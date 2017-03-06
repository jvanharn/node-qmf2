import {QMFObject} from '../class';

export class QueuePolicy extends QMFObject {
    public className = 'QueuePolicy';
    public properties = [
        { name: 'name', type: 'sstr', access: 'RC', index: 'y' },
        { name: 'properties', type: 'map', access: 'RO' }
    ];
}
