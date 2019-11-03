// producer.js
const zmq = require('zeromq');
const sock = zmq.socket('push');
const sock_pull = zmq.socket('pull');

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

console.log(getRandomInt(3));
// expected output: 0, 1 or 2

sock.connect('tcp://127.0.0.1:3000');
sock_pull.connect('tcp://127.0.0.1:3001');
console.log('Producer bound to port 3000');

sock_pull.on('message', function (msg) {
  // console.info(JSON.parse(msg))
});

const MAX = 1_000_000;

const items = [];
for (let i = 0; i < MAX; i++) {
  const obj = {
    i: i,
    id: getRandomInt(10),
    value: getRandomInt(10),
    event: "increment",
  };
  items.push(obj);
}

items.forEach((item) => {
  let i = item.i;
  sock.send(JSON.stringify(item));
  if (i % 100000 === 0) {
    console.info("send msg", i, JSON.stringify(item));
  }
});
console.info("finished");