import {QMFObject} from '../class';

export class ManagementSetupState extends QMFObject {
    public className = 'ManagementSetupState';
    public properties = [
        { name: 'objectNum', type: 'uint64', access: 'RO' },
        { name: 'bootSequence', type: 'uint16', access: 'RO' }
    ];
}
