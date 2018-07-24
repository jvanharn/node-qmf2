import { QMFObject, QMFMethodDefinition } from '../class';

export class Queue extends QMFObject {
    public className = 'Queue';
    public properties = [
        { name: 'vhostRef', type: 'objId', references: 'Vhost', access: 'RC', index: 'y', parentRef: 'y' },
        { name: 'name', type: 'sstr', access: 'RC', index: 'y' },
        { name: 'durable', type: 'bool', access: 'RC' },
        { name: 'autoDelete', type: 'bool', access: 'RC' },
        { name: 'exclusive', type: 'bool', access: 'RO' },
        { name: 'arguments', type: 'map', access: 'RO' },
        { name: 'altExchange', type: 'objId', references: 'Exchange', access: 'RO', optional: 'y' }
    ];
    public methods: QMFMethodDefinition[] = [
        {
            name: 'purge', arguments: [
                { name: 'request', dir: 'I', type: 'uint32' },
                { name: 'filter', dir: 'I', type: 'map' }
            ]
        },
        {
            name: 'reroute', arguments: [
                { name: 'request', dir: 'I', type: 'uint32' },
                { name: 'useAltExchange', dir: 'I', type: 'bool' },
                { name: 'exchange', dir: 'I', type: 'sstr' },
                { name: 'filter', dir: 'I', type: 'map' }
            ]
        }
    ];

    /**
     * Remove all message on the queue that match the filter.
     */
    public purge(
        request: number,
        filter: Map<string, any>
    ): Promise<void> {
        return this._classMethodInvoke(
            this.methods[0],
            {
                request,
                filter
            }
        );
    }

    /**
     * Reroute all incomming messages to the given exchange.
     */
    public reroute(
        request: number,
        useAltExchange: boolean,
        exchange: string,
        filter: Map<string, any>
    ): Promise<void> {
        return this._classMethodInvoke(
            this.methods[0],
            {
                request,
                useAltExchange,
                exchange,
                filter
            }
        );
    }
}
