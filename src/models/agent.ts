import {QMFObject} from '../class';

export class Agent extends QMFObject {
    public className = 'Agent';
    public properties = [
        { name: 'connectionRef',  type: 'objId',  references: 'Connection',  access: 'RO',  index: 'y' },
        { name: 'label', type: 'sstr', access: 'RO' },
        { name: 'registeredTo',  type: 'objId',  references: 'Broker',  access: 'RO' },
        { name: 'systemId', type: 'uuid', access: 'RO' },
        { name: 'brokerBank', type: 'uint32', access: 'RO' },
        { name: 'agentBank', type: 'uint32', access: 'RO' }
    ];
}
