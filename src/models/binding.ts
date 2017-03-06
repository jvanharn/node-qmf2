import {QMFObject} from '../class';

export class Binding extends QMFObject {
    public className = 'Binding';
    public properties = [
        { name: 'exchangeRef',  type: 'objId',  references: 'Exchange',  access: 'RC',  index: 'y',  parentRef: 'y' },
        { name: 'queueRef',  type: 'objId',  references: 'Queue',  access: 'RC',  index: 'y' },
        { name: 'bindingKey', type: 'lstr', access: 'RC', index: 'y' },
        { name: 'arguments', type: 'map', access: 'RC' },
        { name: 'origin', type: 'sstr', access: 'RO', optional: 'y' }
    ];
}
