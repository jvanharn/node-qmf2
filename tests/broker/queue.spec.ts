global['jasmineRequire'] = {
    interface: function () { }
};
import 'jasmine-promises';

import '../helpers/classes.matcher';

import { Client as AMQPClient } from 'amqp10';
import { BrokerAgent } from '../../src/brokeragent';
import { TimeoutError } from '../../src/errors';

import config from '../config';

import _ = require('lodash');

describe('Broker', () => {
    var test: { client?: AMQPClient, agent?: BrokerAgent } = {};
    beforeAll(() =>
        (test.client = new AMQPClient())
            .connect(config.address)
            .then(() => {
                test.agent = new BrokerAgent(test.client);
                return test.agent.initialize();
            }));


    it('should support an echo command', () =>
        test.agent
            .getAllBrokers()
            .then(brokers =>
                Promise
                    .all(_.map(brokers, broker => broker.echo(0, 'test')))
                    .then(responses =>
                        _.each(responses, r => expect(r).toEqual({ sequence: 0, body: 'test' })))));

    it('should support a name query', () =>
        test.agent
            .getQueue('test.queue')
            .then((queue) => {
                expect(queue).not.toBeNull('test.queue was not found')
                expect((<any>queue).name).toEqual('test.queue');
            }));

    it('should support a timeout parameter', () =>
        new Promise(resolve =>
            (<any>test.agent)
                ._getObjects('queue', { timeout: 1 })
                .then(queues => resolve(expect(queues).toEqual(false)))
                .catch(err => resolve(expect(err).toBeInstanceOf(TimeoutError)))
        ),
        10000)

    it('should support JSON.stringify for class instances', () =>
        test.agent
            .getAllExchanges()
            .then((exchanges) =>
                expect(JSON.stringify(exchanges)).toBeDefined()));
});
