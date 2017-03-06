import {QMFObject} from '../class';

export class TopicPolicy extends QMFObject {
    public className = 'TopicPolicy';
    public properties = [
        { name: 'name', type: 'sstr', access: 'RC', index: 'y' },
        { name: 'properties', type: 'map', access: 'RO' }
    ];
}
