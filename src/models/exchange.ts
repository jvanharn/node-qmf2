import {QMFObject} from '../class';

export class Exchange extends QMFObject {
    public className = 'Exchange';
    public properties = [
        { name: 'vhostRef',  type: 'objId',  references: 'Vhost',  access: 'RC',  index: 'y',  parentRef: 'y' },
        { name: 'name', type: 'sstr', access: 'RC', index: 'y' },
        { name: 'type', type: 'sstr', access: 'RO' },
        { name: 'durable', type: 'bool', access: 'RO' },
        { name: 'autoDelete', type: 'bool', access: 'RO' },
        { name: 'altExchange',  type: 'objId',  references: 'Exchange',  access: 'RO',  optional: 'y' },
        { name: 'arguments', type: 'map', access: 'RO' }
    ];
}
