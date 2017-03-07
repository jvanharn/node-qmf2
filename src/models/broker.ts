import { QMFObject, QMFMethodDefinition } from '../class';

export class Broker extends QMFObject {
    public className = 'Broker';
    public properties = [
        { name: 'name', type: 'sstr', access: 'RC', index: 'y' },
        { name: 'systemRef', type: 'objId', references: 'System', access: 'RO', parentRef: 'y' },
        { name: 'port', type: 'uint16', access: 'RO' },
        { name: 'workerThreads', type: 'uint16', access: 'RO' },
        { name: 'maxConns', type: 'uint16', access: 'RO' },
        { name: 'connBacklog', type: 'uint16', access: 'RO' },
        { name: 'stagingThreshold', type: 'uint32', access: 'RO' },
        { name: 'mgmtPublish', type: 'bool', access: 'RO' },
        { name: 'mgmtPubInterval', type: 'uint16', access: 'RW', unit: 'second', min: '1' },
        { name: 'version', type: 'sstr', access: 'RO' },
        { name: 'dataDir', type: 'lstr', access: 'RO', optional: 'y' }
    ];
    public methods: QMFMethodDefinition[] = [
        {
            name: 'echo',
            arguments: [
                { name: 'sequence', dir: 'IO', type: 'uint32' },
                { name: 'body', dir: 'IO', type: 'lstr' }
            ]
        },
        {
            name: 'connect',
            arguments: [
                { name: 'host', dir: 'I', type: 'sstr' },
                { name: 'port', dir: 'I', type: 'uint32' },
                { name: 'durable', dir: 'I', type: 'bool' },
                { name: 'authMechanism', dir: 'I', type: 'sstr' },
                { name: 'username', dir: 'I', type: 'sstr' },
                { name: 'password', dir: 'I', type: 'sstr' },
                { name: 'transport', dir: 'I', type: 'sstr' }
            ]
        },
        {
            name: 'queueMoveMessages',
            arguments: [
                { name: 'srcQueue', dir: 'I', type: 'sstr' },
                { name: 'destQueue', dir: 'I', type: 'sstr' },
                { name: 'qty', dir: 'I', type: 'uint32' },
                { name: 'filter', dir: 'I', type: 'map' }
            ]
        },
        {
            name: 'setLogLevel',
            arguments: [
                { name: 'level', dir: 'I', type: 'sstr' }
            ]
        },
        {
            name: 'getLogLevel',
            arguments: [
                { name: 'level', dir: 'O', type: 'sstr' }
            ]
        },
        {
            name: 'getTimestampConfig',
            arguments: [
                { name: 'receive', dir: 'O', type: 'bool' }
            ]
        },
        {
            name: 'setTimestampConfig',
            arguments: [
                { name: 'receive', dir: 'I', type: 'bool' }
            ]
        },
        {
            name: 'create',
            arguments: [
                { name: 'type', dir: 'I', type: 'sstr' },
                { name: 'name', dir: 'I', type: 'sstr' },
                { name: 'properties', dir: 'I', type: 'map' },
                { name: 'strict', dir: 'I', type: 'bool' }
            ]
        },
        {
            name: 'delete',
            arguments: [
                { name: 'type', dir: 'I', type: 'sstr' },
                { name: 'name', dir: 'I', type: 'sstr' },
                { name: 'options', dir: 'I', type: 'map' }
            ]
        },
        {
            name: 'query',
            arguments: [
                { name: 'type', dir: 'I', type: 'sstr' },
                { name: 'name', dir: 'I', type: 'sstr' },
                { name: 'results', dir: 'O', type: 'map' }
            ]
        },
        {
            name: 'getLogHiresTimestamp',
            arguments: [
                { name: 'logHires', dir: 'O', type: 'bool' }
            ]
        },
        {
            name: 'setLogHiresTimestamp',
            arguments: [
                { name: 'logHires', dir: 'I', type: 'bool' }
            ]
        },
        {
            name: 'queueRedirect',
            arguments: [
                { name: 'sourceQueue', dir: 'I', type: 'sstr' },
                { name: 'targetQueue', dir: 'I', type: 'sstr' }
            ]
        },
        { name: 'shutdown' }
    ];

    /**
     * Echo back the given data (via the broker).
     */
    public echo(sequence: number, body: string): Promise<{ sequence: number, body: string }> {
        return this._classMethodInvoke(
            this.methods[0],
            {
                sequence: sequence,
                body: body
            }
        );
    }

    /**
     * Make the currently connected broker, connect to another broker.
     */
    public connect(
        host: string,
        port: number,
        durable: boolean,
        authMechanism: string,
        username: string,
        password: string,
        transport: string
    ): Promise<void> {
        return this._classMethodInvoke(
            this.methods[1],
            {
                host,
                port,
                durable,
                authMechanism,
                username,
                password,
                transport
            }
        );
    }

    /**
     * Move a queued message from one queue to another.
     */
    public queueMoveMessages(
        srcQueue: string,
        destQueue: string,
        qty: number,
        filter: Map<string, string>
    ): Promise<void> {
        return this._classMethodInvoke(
            this.methods[2],
            {
                srcQueue,
                destQueue,
                qty,
                filter
            }
        );
    }

    /**
     * Set the brokers log level.
     */
    public setLogLevel(
        level: string
    ): Promise<void> {
        return this._classMethodInvoke(
            this.methods[3],
            {
                level
            }
        );
    }

    /**
     * Set the brokers log level.
     */
    public getLogLevel(): Promise<string> {
        return this._classMethodInvoke(
            this.methods[4]
        );
    }

    /**
     * Set the brokers log level.
     */
    public setTimestampConfig(
        receive: boolean
    ): Promise<void> {
        return this._classMethodInvoke(
            this.methods[5],
            {
                receive
            }
        );
    }

    /**
     * Set the brokers log level.
     */
    public getTimestampConfig(): Promise<boolean> {
        return this._classMethodInvoke(
            this.methods[6]
        );
    }

    /**
     * Create an object of the specified type.
     *
     * @param type The type of object to create.
     * @param name The name of the object to create.
     * @param properties Type specific object properties.
     * @param strict If specified, treat unrecognised object properties as an error
     */
    public create(
        type: string,
        name: string,
        properties: Map<string, string>,
        strict: boolean = false
    ): Promise<boolean> {
        return this._classMethodInvoke(
            this.methods[7],
            {
                type,
                name,
                properties,
                strict
            }
        );
    }

    /**
     * Delete an object of the specified type.
     *
     * @param type The type of object to delete.
     * @param name The name of the object to delete.
     * @param options Type specific object options for deletion.
     */
    public delete(
        type: string,
        name: string,
        options: Map<string, any>
    ): Promise<boolean> {
        return this._classMethodInvoke(
            this.methods[8],
            {
                type,
                name,
                options
            }
        );
    }

    /**
     * Query the current state of an object.
     *
     * @param type The type of object to query.
     * @param name The name of the object to query
     *
     * @return A snapshot of the object's state.
     */
    public query(
        type: string,
        name: string
    ): Promise<Map<string, any>> {
        return this._classMethodInvoke(
            this.methods[9],
            {
                type,
                name
            }
        );
    }

    /**
     * Get whether or not a high resolution timestamp is used for logging.
     *
     * @return True if high resolution timestamp in logs is enabled.
     */
    public getLogHiresTimestamp(): Promise<boolean> {
        return this._classMethodInvoke(
            this.methods[10]
        );
    }

    /**
     * Set whether or not a high resolution timestamp is used for logging.
     *
     * @param logHires True to enable enable high resolution timestamp in logs.
     */
    public setLogHiresTimestamp(
        logHires: boolean
    ): Promise<void> {
        return this._classMethodInvoke(
            this.methods[11],
            {
                logHires
            }
        );
    }

    /**
     * Redirect message targetted on the given queue to the other queue.
     *
     * @param sourceQueue Source queue.
     * @param targetQueue Redirect target queue. Blank disables redirect.
     */
    public queueRedirect(
        sourceQueue: string,
        targetQueue: string
    ): Promise<void> {
        return this._classMethodInvoke(
            this.methods[12],
            {
                sourceQueue,
                targetQueue
            }
        );
    }

    /**
     * Shutdown the broker.
     */
    public shutdown(): Promise<void> {
        return this._classMethodInvoke(this.methods[13]);
    }
}
