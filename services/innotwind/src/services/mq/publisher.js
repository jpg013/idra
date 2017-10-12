const getChannel = require('./getChannel');

const publisher = (opts, onPublished) => {
  const { exchange, bindingType, exchangeOpts={ durable: false }, msg, routingKey='' } = opts;

  if (!exchange || !bindingType || !msg) {
    return;
  }

  onPublished = onPublished ? onPublished : err => err;
  
  getChannel((err, ch) => {
    if (err) {
      return;
    }
    
    try {
      const strBuffer = Buffer.from(JSON.stringify(msg));
      ch.assertExchange(exchange, bindingType, exchangeOpts);
      ch.publish(exchange, routingKey, strBuffer);
    } catch(e) {
      // handle
      
    }
  });
}

module.exports = publisher;
