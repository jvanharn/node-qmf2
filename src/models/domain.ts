import {QMFObject} from '../class';

export class Domain extends QMFObject {
    public className = 'Domain';
    public properties = [
        { name: 'name', type: 'sstr', access: 'RC', index: 'y' },
        { name: 'durable', type: 'bool', access: 'RC' },
        { name: 'url', type: 'sstr', access: 'RO' },
        { name: 'mechanisms', type: 'sstr', access: 'RO' },
        { name: 'username', type: 'sstr', access: 'RO' },
        { name: 'password', type: 'sstr', access: 'RO' }
    ];
}
