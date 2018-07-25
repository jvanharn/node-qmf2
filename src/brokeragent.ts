import { Agent } from './agent';
import {
    Broker,
    Exchange,
    Connection,
    Session,
    Subscription,
    Queue,
    Binding,
    Link,
} from './models';
import { Client as AMQPClient } from 'amqp10';

export class BrokerAgent extends Agent {
    public constructor(client: AMQPClient, responseTopic?: any) {
        super('broker', client, responseTopic);
    }

    public getAllBrokers(): Promise<Broker[]> {
        return this._getObjects('broker');
    }

    public getAllExchanges(): Promise<Exchange[]> {
        return this._getObjects('exchange');
    }

    public getExchange(exchangeName: string): Promise<Exchange> {
        return this._getObject('exchange', 'org.apache.qpid.broker:exchange:' + exchangeName);
    }

    public getCluster(): Promise<any>{
        return this._getObjects('cluster')[0];
    }

    public getHaBroker(): Promise<any>{
        return this._getObjects('habroker')[0];
    }

    public getAllConnections(): Promise<Connection[]>{
        return this._getObjects('connection');
    }

    public getConnection(id: string): Promise<Connection> {
        return this._getObject('connection', 'org.apache.qpid.broker:connection:' + id);
    }

    public getAllSessions(): Promise<Session[]> {
        return this._getObjects('session');
    }

    public getSession(id: string): Promise<Session> {
        return this._getObject('session', 'org.apache.qpid.broker:session:' + id);
    }

    public getAllSubscriptions(): Promise<Subscription[]> {
        return this._getObjects('subscription');
    }

    public getSubscription(id: string): Promise<Subscription> {
        return this._getObject('subscription', 'org.apache.qpid.broker:subscription:' + id);
    }

    public getAllQueues(): Promise<Queue[]> {
        return this._getObjects('queue');
    }

    /**
     * Get the queue with the given name.
     * @return Returns the requested queue Business Object or null when it was not found.
     */
    public getQueue(name: string): Promise<Queue> {
        return this._getObject('queue', 'org.apache.qpid.broker:queue:' + name);
    }

    public getAllBindings(): Promise<Binding[]> {
        return this._getObjects('binding');
    }

    public getAllLinks(): Promise<Link[]> {
        return this._getObjects('link');
    }

//#region Custom (e.g. non protocol defined) helper methods
    /**
     * Bind a queue to another.
     *
     * @param exchange
     * @param queue
     * @param bindingKey
     * @param options
     */
    public bind(
        exchange: string,
        queue: string,
        bindingKey: string,
        options: Map<string, any>,
    ): Promise<void> {
        return this.getAllBrokers().then(([broker]) => broker.create('binding', `${exchange}/${queue}/${bindingKey}`, options, true) as Promise<any>);
    }

    /**
     * Unbind a queue to another.
     *
     * @param exchange
     * @param queue
     * @param bindingKey
     * @param options
     */
    public unbind(
        exchange: string,
        queue: string,
        bindingKey: string,
    ): Promise<void> {
        return this.getAllBrokers().then(([broker]) => broker.delete('binding', `${exchange}/${queue}/${bindingKey}`, void 0, true) as Promise<any>);
    }
//#endregion
}
