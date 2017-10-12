const getChannel = require('./getChannel');

const consumer = (opts, onMessage) => {
  const { exchange, bindingType, exchangeOpts={durable: false}, queueOpts={exclusive: true}, q='', routingKey='', consumeOpts={noAck: true} } = opts;

  if (!exchange || !bindingType || !onMessage) {
    return;
  }

  getChannel((err, ch) => {
    if (err) {
      return;
    }

    ch.assertExchange(exchange, bindingType, exchangeOpts);

    ch.assertQueue(q, queueOpts, (err, {queue}) => {
      if (err) {
        return;
      }
      ch.bindQueue(queue, exchange, routingKey);
      ch.consume(queue, onMessage, consumeOpts);
    })
  });
}

module.exports = consumer;
