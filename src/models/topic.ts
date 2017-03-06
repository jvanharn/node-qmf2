import {QMFObject} from '../class';

export class Topic extends QMFObject {
    public className = 'Topic';
    public properties = [
        { name: 'name', type: 'sstr', access: 'RC', index: 'y' },
        { name: 'exchangeRef',  type: 'objId',  references: 'Exchange',  access: 'RC' },
        { name: 'durable', type: 'bool', access: 'RC' },
        { name: 'properties', type: 'map', access: 'RO' }
    ];
}
