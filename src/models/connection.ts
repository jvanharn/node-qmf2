import {QMFObject} from '../class';

export class Connection extends QMFObject {
    public className = 'Connection';
    public properties = [
        { name: 'vhostRef',  type: 'objId',  references: 'Vhost',  access: 'RC',  index: 'y',  parentRef: 'y' },
        { name: 'address', type: 'sstr', access: 'RC', index: 'y' },
        { name: 'incoming', type: 'bool', access: 'RC' },
        { name: 'SystemConnection', type: 'bool', access: 'RC' },
        { name: 'userProxyAuth', type: 'bool', access: 'RO' },
        { name: 'federationLink', type: 'bool', access: 'RO' },
        { name: 'authIdentity', type: 'sstr', access: 'RO' },
        { name: 'remoteProcessName',  type: 'lstr',  access: 'RO',  optional: 'y' },
        { name: 'remotePid', type: 'uint32', access: 'RO', optional: 'y' },
        { name: 'remoteParentPid',  type: 'uint32',  access: 'RO',  optional: 'y' },
        { name: 'shadow', type: 'bool', access: 'RO' },
        { name: 'saslMechanism', type: 'sstr', access: 'RO' },
        { name: 'saslSsf', type: 'uint16', access: 'RO' },
        { name: 'remoteProperties', type: 'map', access: 'RO' },
        { name: 'protocol', type: 'sstr', access: 'RC' }
    ];

    public methods = [
        { name: 'close' }
    ];

    /**
     * Close the connection bridge.
     */
    public close(): Promise<void> {
        return this._classMethodInvoke(
            this.methods[0]
        );
    }
}
