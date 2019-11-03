// worker.js
const zmq = require('zeromq');
const sock = zmq.socket('pull');
const sock_push = zmq.socket('push');

sock.connect('tcp://127.0.0.1:3000');
sock_push.connect('tcp://127.0.0.1:3001');
console.log('Worker connected to port 3000');

const balances = {};


sock.on('message', function (msg) {
  let obj = JSON.parse(msg);
  let target = balances[obj.id];
  if (target) {
    if(obj.event === "add")
    target.value = target.value + obj.value;
    target.count++;
  } else {
    // Init
    balances[obj.id] = {
      id: obj.id,
      value: obj.value,
      count: 1
    }
  }
  if (JSON.parse(msg).i % 100 === 0) {
    console.log('work: %s', msg.toString());
  }
  sock_push.send(JSON.stringify({"event": "ack", "i": obj.i}));
});

setInterval(() => {
  console.info(balances);
}, 1000);
