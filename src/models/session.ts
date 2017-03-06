import {QMFObject} from '../class';

export class Session extends QMFObject {
    public className = 'Session';
    public properties = [
        { name: 'vhostRef',  type: 'objId',  references: 'Vhost',  access: 'RC',  index: 'y',  parentRef: 'y' },
        { name: 'name', type: 'sstr', access: 'RC', index: 'y' },
        { name: 'fullName', type: 'lstr', access: 'RO', optional: 'y' },
        { name: 'channelId', type: 'uint16', access: 'RO' },
        { name: 'connectionRef',  type: 'objId',  references: 'Connection',  access: 'RO' },
        { name: 'detachedLifespan',  type: 'uint32',  access: 'RO',  unit: 'second' },
        { name: 'attached', type: 'bool', access: 'RO' },
        { name: 'expireTime',  type: 'absTime',  access: 'RO',  optional: 'y' },
        { name: 'maxClientRate',  type: 'uint32',  access: 'RO',  unit: 'msgs/sec',  optional: 'y' }
    ];
    public methods = [
        { name: 'solicitAck' },
        { name: 'detach' },
        { name: 'resetLifespan' },
        { name: 'close' }
    ];

    /**
     * Make the broker ask the client for an ack.
     */
    public solicitAck(): Promise<void> {
        return this._classMethodInvoke(
            this.methods[0]
        );
    }

    /**
     * Detach the connection.
     */
    public detach(): Promise<void> {
        return this._classMethodInvoke(
            this.methods[1]
        );
    }

    /**
     * Reset the lifespan of the connection
     */
    public resetLifespan(): Promise<void> {
        return this._classMethodInvoke(
            this.methods[2]
        );
    }

    /**
     * Close the session.
     */
    public close(): Promise<void> {
        return this._classMethodInvoke(
            this.methods[3]
        );
    }
}
