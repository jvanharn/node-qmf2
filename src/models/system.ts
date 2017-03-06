import {QMFObject} from '../class';

export class System extends QMFObject {
    public className = 'System';
    public properties = [
        { name: 'systemId', index: 'y', type: 'uuid', access: 'RC' },
        { name: 'osName', type: 'sstr', access: 'RO' },
        { name: 'nodeName', type: 'sstr', access: 'RO' },
        { name: 'release', type: 'sstr', access: 'RO' },
        { name: 'version', type: 'sstr', access: 'RO' },
        { name: 'machine', type: 'sstr', access: 'RO' }
    ];
}
