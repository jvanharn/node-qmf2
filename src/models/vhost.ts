import {QMFObject} from '../class';

export class Vhost extends QMFObject {
    public className = 'Vhost';
    public properties = [
        { name: 'brokerRef',  type: 'objId',  references: 'Broker',  access: 'RC',  index: 'y',  parentRef: 'y' },
        { name: 'name', type: 'sstr', access: 'RC', index: 'y' },
        { name: 'federationTag', type: 'sstr', access: 'RO' }
    ];
}
