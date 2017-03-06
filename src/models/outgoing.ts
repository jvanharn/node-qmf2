import {QMFObject} from '../class';

export class Outgoing extends QMFObject {
    public className = 'Outgoing';
    public properties = [
        { name: 'sessionRef',  type: 'objId',  references: 'Session',  access: 'RC',  parentRef: 'y' },
        { name: 'containerid', type: 'sstr', access: 'RC', index: 'y' },
        { name: 'name', type: 'sstr', access: 'RC', index: 'y' },
        { name: 'source', type: 'sstr', access: 'RC' },
        { name: 'target', type: 'sstr', access: 'RC' },
        { name: 'domain', type: 'sstr', access: 'RC' }
    ];
}
