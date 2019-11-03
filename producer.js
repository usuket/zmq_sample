// producer.js
const zmq = require('zeromq');
const sock = zmq.socket('push');
const sock_pull = zmq.socket('pull');

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

console.log(getRandomInt(3));
// expected output: 0, 1 or 2

sock.bindSync('tcp://127.0.0.1:3000');
sock_pull.bindSync('tcp://127.0.0.1:3001');
console.log('Producer bound to port 3000');

sock_pull.on('message', function (msg) {
  // console.info(JSON.parse(msg))
});

const MAX = 10000;
for (let i = 0; i < MAX; i++) {

  const obj = {
    i: i,
    id: getRandomInt(10),
    value: getRandomInt(10),
  };
  sock.send(JSON.stringify(obj));
  console.info("send msg", JSON.stringify(obj));
}
console.info("finished");