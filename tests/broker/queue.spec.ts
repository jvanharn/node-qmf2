global['jasmineRequire'] = {
    interface: function () { }
};
import 'jasmine-promises';

import '../helpers/classes.matcher';

import { Connection as RheaConnection, create_container } from 'rhea';
import { BrokerAgent, TimeoutError } from '../../src/index';

import config from '../config';

import * as debuglib from 'debug';
const debug = debuglib('test:queue');

describe('Broker', () => {
    var test: { conn?: RheaConnection, agent?: BrokerAgent } = {};
    beforeAll(done => {
        var container = create_container();

        var addr = config.address.split(':'),
            host = addr[0].trim().length > 0 ? addr[0].trim() : 'localhost',
            port = addr.length > 0 ? parseInt(addr[1], 10) : void 0;

        test.conn = container.connect({ host, port });
        debug(`connecting to "${config.address}" or "${test.conn.hostname}" or "${host}" "${port}" -> ${test.conn.is_open()}`);

        container.once('connection_open', () => {
            test.agent = new BrokerAgent(test.conn);

            debug(`connected!`);
            done();
        });
    });


    it('should support an echo command', () =>
        test.agent
            .getAllBrokers()
            .then(brokers =>
                Promise
                    .all((brokers || []).map(broker => broker.echo(0, 'test')))
                    .then(responses =>
                        (responses || []).forEach(r => expect(r).toEqual({ sequence: 0, body: 'test' })))));

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
        10000);

    it('should support JSON.stringify for class instances', () =>
        test.agent
            .getAllExchanges()
            .then((exchanges) =>
                expect(JSON.stringify(exchanges)).toBeDefined()));
});
