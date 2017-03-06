import {QMFObject} from '../class';

export class Bridge extends QMFObject {
    public className = 'Bridge';
    public properties = [
        { name: 'linkRef',  type: 'objId',  references: 'Link',  access: 'RC',  index: 'y',  parentRef: 'y' },
        { name: 'name', type: 'sstr', access: 'RC', index: 'y' },
        { name: 'channelId', type: 'uint16', access: 'RO' },
        { name: 'durable', type: 'bool', access: 'RC' },
        { name: 'src', type: 'sstr', access: 'RC' },
        { name: 'dest', type: 'sstr', access: 'RC' },
        { name: 'key', type: 'lstr', access: 'RC' },
        { name: 'srcIsQueue', type: 'bool', access: 'RC' },
        { name: 'srcIsLocal', type: 'bool', access: 'RC' },
        { name: 'tag', type: 'sstr', access: 'RC' },
        { name: 'excludes', type: 'sstr', access: 'RC' },
        { name: 'dynamic', type: 'bool', access: 'RC' },
        { name: 'sync', type: 'uint16', access: 'RC' },
        { name: 'credit', type: 'uint32', access: 'RC' }
    ];
    public methods = [
        { name: 'close' }
    ];

    /**
     * Close the connection bridge.
     */
    public close(): Promise<void> {
        return this._classMethodInvoke(
            this.methods[0]
        );
    }
}
