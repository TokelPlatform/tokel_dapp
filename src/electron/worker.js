const { parentPort } = require('worker_threads');

const bitgo = require('../util/nspv-bitgo');

console.log(`>>>> Worker: Initializing bitgo at ${new Date().toISOString()}`);

parentPort.on('message', msg => {
  bitgo[msg.type](msg.payload)
    .then(data => parentPort.postMessage({ type: msg.type, data }))
    .catch(e => console.error(e));
});
