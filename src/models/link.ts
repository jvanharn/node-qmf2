import { QMFObject, QMFMethodDefinition } from '../class';

export class Link extends QMFObject {
    public className = 'Link';
    public properties = [
        { name: 'vhostRef', type: 'objId', references: 'Vhost', access: 'RC', index: 'y', parentRef: 'y' },
        { name: 'name', type: 'sstr', access: 'RC', index: 'y' },
        { name: 'host', type: 'sstr', access: 'RO' },
        { name: 'port', type: 'uint16', access: 'RO' },
        { name: 'transport', type: 'sstr', access: 'RO' },
        { name: 'durable', type: 'bool', access: 'RC' },
        { name: 'connectionRef', type: 'objId', references: 'Connection', access: 'RO' }
    ];
    public methods: QMFMethodDefinition[] = [
        { name: 'close' },
        {
            name: 'bridge',
            arguments: [
                { name: 'durable', dir: 'I', type: 'bool' },
                { name: 'src', dir: 'I', type: 'sstr' },
                { name: 'dest', dir: 'I', type: 'sstr' },
                { name: 'key', dir: 'I', type: 'lstr' },
                { name: 'tag', dir: 'I', type: 'sstr' },
                { name: 'excludes', dir: 'I', type: 'sstr' },
                { name: 'srcIsQueue', dir: 'I', type: 'bool' },
                { name: 'srcIsLocal', dir: 'I', type: 'bool' },
                { name: 'dynamic', dir: 'I', type: 'bool' },
                { name: 'sync', dir: 'I', type: 'uint16' },
                { name: 'credit', dir: 'I', type: 'uint32', default: '0xFFFFFFFF' }
            ]
        }
    ];

    /**
     * Close the connection bridge.
     */
    public close(): Promise<void> {
        return this._classMethodInvoke(
            this.methods[0]
        );
    }

    /**
     * Bridge the given named link to another.
     */
    public bridge(
        durable: boolean,
        src: string,
        dest: string,
        key: string,
        tag: string,
        excludes: string,
        srcIsQueue: boolean,
        srcIsLocal: boolean,
        dynamic: boolean,
        sync: number,
        credit: number
    ): Promise<void> {
        return this._classMethodInvoke(
            this.methods[1],
            {
                durable,
                src,
                dest,
                key,
                tag,
                excludes,
                srcIsQueue,
                srcIsLocal,
                dynamic,
                sync,
                credit
            }
        );
    }
}
