const redis = require('redis');
const store = redis.createClient(process.env.REDIS_URL, process.env.REDIS_PORT);
const pub   = redis.createClient(process.env.REDIS_URL, process.env.REDIS_PORT);
const sub   = redis.createClient(process.env.REDIS_URL, process.env.REDIS_PORT);

module.exports = {

};

/*
client1.on('message', function(chan, msg) {
  client2.hgetall(msg, function(err, res) {
    res.key = msg;
    io.sockets.emit(res);
  });
});

client1.subscribe('yourChannelName');
*/