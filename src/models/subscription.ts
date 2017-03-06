import {QMFObject} from '../class';

export class Subscription extends QMFObject {
    public className = 'Subscription';
    public properties = [
        { name: 'sessionRef',  type: 'objId',  references: 'Session',  access: 'RC',  index: 'y',  parentRef: 'y' },
        { name: 'queueRef',  type: 'objId',  references: 'Queue',  access: 'RC',  index: 'y' },
        { name: 'name', type: 'sstr', access: 'RC', index: 'y' },
        { name: 'browsing', type: 'bool', access: 'RC' },
        { name: 'acknowledged', type: 'bool', access: 'RC' },
        { name: 'exclusive', type: 'bool', access: 'RC' },
        { name: 'creditMode', type: 'sstr', access: 'RO' },
        { name: 'arguments', type: 'map', access: 'RC' }
    ];
}
