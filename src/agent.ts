import uuid = require('uuid');
import { Client as AMQPClient, SenderLink, ReceiverLink, MessageOptions } from 'amqp10';
import * as log from './log';
import * as classes from './models/models';
import * as errors from './errors';
import * as u from './utilities';

import * as _ from 'lodash';

const CorrelationIdKey = 'correlationId';

export class Agent {
    private _receiver: ReceiverLink;
    private _sender: SenderLink;
    public replyTo: string;
    public nextCorrelationId: number = 0;
    public requests: { [correlationId: number]: any } = {};

    public constructor(public name: string, public client: AMQPClient, responseTopic?: any) {
        this.replyTo = responseTopic || 'qmf.default.topic/' + uuid.v4();
    }

    /**
     * Initialize the agent.
     */
    public initialize(): Promise<[SenderLink, ReceiverLink]> {
        return Promise.all([
            this.client.createSender('qmf.default.direct').then(sender => {
                this._sender = sender;
                return sender;
            }),
            this.client.createReceiver(this.replyTo).then((receiver: ReceiverLink) => {
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

                receiver.on('error', (err) => {
                    var _keys = Object.keys(this.requests),
                        _len = _keys.length;
                    for (var i = 0; i < _len; ++i) {
                        this.requests[_keys[i]](err, null);
                    }
                });

                this._receiver = receiver;
                return receiver;
            })
        ]);
    };

    /**
     * Dispose the agent.
     */
    public dispose(): Promise<void> {
        return Promise.all([
            this._sender.detach(),
            this._receiver.detach()
        ]).then(_.noop);
    }

    /**
     * Send a Remote Procedure Call via QMF.
     */
    protected _rpcSend(
        content: any,
        subject: string,
        messageOptions: MessageOptions,
        options?: AgentOptions
    ): Promise<any> {
        this.nextCorrelationId++;
        var correlationId = '' + this.nextCorrelationId;
        options = options || { timeout: 5000 };
        messageOptions.properties = {
            subject: !!subject ? subject : 'broker',
            replyTo: this.replyTo,
            correlationId: correlationId
        };

        var response = new Promise((resolve, reject) => {
            this.requests[correlationId] = (err, message) => {
                let opcode = messageOptions.applicationProperties['qmf.opcode'];

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

                if (!(_.isPlainObject(message.body) || _.isArray(message.body))) {
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

        this._sender.send(content, messageOptions);
        return response;
    };

    /**
     * @internal
     */
    public _request(opcode: string, subject: string, content: any, options?: AgentOptions): Promise<any> {
        return this._rpcSend(content, subject, {
            body: content,
            applicationProperties: {
                'method': 'request',
                'qmf.opcode': opcode,
                'x-amqp-0-10.app-id': 'qmf2'
            }
        }, options);
    };

    protected _nameQuery(name: string, options?: AgentOptions): Promise<any> {
        return this._request('_query_request', 'broker', {
            '_what': 'OBJECT',
            '_object_id': {
                '_object_name': name
            }
        }, options);
    };

    protected _classQuery(className: string, options?: AgentOptions): Promise<any> {
        return this._request('_query_request', 'broker', {
            '_what': 'OBJECT',
            '_schema_id': {
                '_class_name': className
            }
        }, options);
    };

    /**
     * Get multiple objects (class query) of the given type/class.
     */
    protected _getObjects<T>(type: string, options?: AgentOptions): Promise<T[]> {
        return this._classQuery(type, options)
            .then(objects => {
                if (!_.isArray(objects)) {
                    objects = [objects];
                }
                return _.map(objects, object => new classes[type](this, object));
            });
    };

    /**
     * Get a single object (name query) from the server.
     * @return T|null Get the object requested, or null if the object was not found.
     */
    protected _getObject<T>(type: string, name: string, options?: AgentOptions): Promise<T> {
        return this
            ._nameQuery(name, options)
            .then(object => {
                if (_.isPlainObject(object)) {
                    return new classes[type](this, object);
                }
                else if (_.isArray(object)) {
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
            });
    };
}

export interface AgentOptions {
    timeout: number;
}
