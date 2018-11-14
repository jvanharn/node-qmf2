import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { Connection, Receiver, Sender } from 'rhea';

import * as log from './log';
import * as classes from './models/models';
import * as errors from './errors';
import * as u from './utilities';

const CorrelationIdKey = 'correlationId';

export class Agent extends EventEmitter {
    private _disposed: boolean = false;
    private _receiver: Receiver;
    private _sender: Sender;

    /**
     * Queue used by this agent to receive reply's to QMF calls.
     */
    public replyTo: string;

    /**
     * Our next correlation identity.
     */
    public nextCorrelationId: number = 0;

    /**
     * All our outstanding requests.
     */
    public requests: { [correlationId: number]: any } = {};

    public constructor(public name: string, public conn: Connection, responseTopic?: any) {
        super();

        // Create sender
        var sender = this.conn.open_sender('qmf.default.direct');
        sender.once('sendable', () => {
            if (this._disposed) {
                sender.detach();
            }
            else {
                this._sender = sender;
                if (this._sender && this._receiver) {
                    this.emit('open');
                }
            }
        });

        // Create and configure the receiver
        this.replyTo = responseTopic || 'qmf.default.topic/' + uuidv4();
        var receiver = this.conn.open_receiver(this.replyTo);
        receiver.once('receiver_open', () => {
            if (this._disposed) {
                receiver.detach();
            }
            else {
                this._receiver = receiver;
                if (this._sender && this._receiver) {
                    this.emit('open');
                }
            }
        });

        // Handle incomming message.
        receiver.on('message', (message) => {
            var correlationId = message.properties[CorrelationIdKey];
            if (correlationId === undefined || correlationId === null) {
                log.error('message lacks correlation-id');
                return;
            }

            if (!this.requests.hasOwnProperty(correlationId)) {
                log.error('invalid correlation-id: ', correlationId);
                return;
            }

            // complete request
            this.requests[correlationId](null, message);
            delete this.requests[correlationId];
        });

        // Error handler.
        receiver.on('error', (err) => {
            var _keys = Object.keys(this.requests),
                _len = _keys.length;
            for (var i = 0; i < _len; ++i) {
                this.requests[_keys[i]](err, null);
            }
        });
    }

    /**
     * Dispose the agent.
     */
    public dispose(): void {
        if (this._disposed) {
            return;
        }

        this.emit('close');
        this.emit('disposed');

        this._disposed = true;
        if (this._sender) {
            this._sender.detach();
        }
        if (this._receiver) {
            this._receiver.detach();
        }
    }

    /**
     * Prepare and execute an call using the correct QMF headers.
     * @internal
     */
    public _request(opcode: string, subject: string, content: any, options?: AgentOptions): Promise<any> {
        if (this._disposed) {
            return Promise.reject(new Error('The agent is already disposed, cannot execute a call on an disposed agent!'));
        }

        this.nextCorrelationId++;
        var correlationId = '' + this.nextCorrelationId;
        options = options || { timeout: 5000 };

        var message = {
            subject: !!subject ? subject : 'broker',
            body: content,
            application_properties: {
                'method': 'request',
                'qmf.opcode': opcode,
                'x-amqp-0-10.app-id': 'qmf2'
            },
            reply_to: this.replyTo,
            correlation_id: correlationId
        };

        var response = new Promise((resolve, reject) => {
            this.requests[correlationId] = (err, message) => {
                if (!!err) {
                    return reject(err);
                }
                var messageOpcode = message.applicationProperties['qmf.opcode'];
                if (messageOpcode === '_exception') {
                    return reject(new errors.AgentExceptionError(message.body._values));
                }

                if ((opcode === '_method_request' && messageOpcode !== '_method_response') ||
                    (opcode === '_query_request' && messageOpcode !== '_query_response')) {
                    return reject(new errors.InvalidResponseError(messageOpcode));
                }

                if (opcode === '_method_request') {
                    return resolve(u.unwrap_data(message.body._arguments));
                }

                if (!(typeof message.body === 'object' || Array.isArray(message.body))) {
                    reject(new errors.InvalidResponseError(messageOpcode));
                }
                resolve(message.body);
            };

            setTimeout(() => {
                if (this.requests.hasOwnProperty(correlationId)) {
                    delete this.requests[correlationId];
                    reject(new errors.TimeoutError());
                }
            }, options.timeout);
        });

        if (this._sender) {
            this._sender.send(message);
        }
        else {
            this.once('open', () => this._sender.send(message));
        }

        return response;
    }

    protected _nameQuery(name: string, options?: AgentOptions): Promise<any> {
        return this._request('_query_request', 'broker', {
            '_what': 'OBJECT',
            '_object_id': {
                '_object_name': name
            }
        }, options);
    }

    protected _classQuery(className: string, options?: AgentOptions): Promise<any> {
        return this._request('_query_request', 'broker', {
            '_what': 'OBJECT',
            '_schema_id': {
                '_class_name': className
            }
        }, options);
    }

    /**
     * Get multiple objects (class query) of the given type/class.
     */
    protected _getObjects<T>(type: string, options?: AgentOptions): Promise<T[]> {
        return this._classQuery(type, options)
            .then(objects => {
                if (!Array.isArray(objects)) {
                    objects = [objects];
                }
                return (objects || []).map(object => new classes[type](this, object));
            });
    }

    /**
     * Get a single object (name query) from the server.
     * @return T|null Get the object requested, or null if the object was not found.
     */
    protected _getObject<T>(type: string, name: string, options?: AgentOptions): Promise<T> {
        return this
            ._nameQuery(name, options)
            .then(object => {
                if (Array.isArray(object)) {
                    if (object.length === 1) {
                        return new classes[type](this, object[0]);
                    }
                    else if (object.length === 0) {
                        return null;
                    }
                    else {
                        throw new errors.AgentExceptionError('Expected object, but got something else.');
                    }
                }
                else if (typeof object === 'object') {
                    return new classes[type](this, object);
                }
            });
    }
}

export interface AgentOptions {
    timeout: number;
}
