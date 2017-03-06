import 'es6-shim';
export default {
    address: (process.env.AMQP_SERVER ? 'amqp://'+process.env.AMQP_SERVER  : 'amqp://localhost'),
};
console.log(process.env.AMQP_SERVER);
