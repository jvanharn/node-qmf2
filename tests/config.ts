export default {
    address: (process.env.AMQP_SERVER ? process.env.AMQP_SERVER : 'localhost'),
};
console.log(process.env.AMQP_SERVER);
