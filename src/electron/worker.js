// require('./src/util/nspv-bitgo');
// require('./src/node_modules/cryptoconditions-js/pkg/cryptoconditions.js');

// import bitgo from '@tokel/bitgo-komodo-cc-lib';

const { parentPort } = require('worker_threads');

const bitgo = require('../util/nspv-bitgo');

console.log(`>>>> Worker: Initializing bitgo at ${new Date().toISOString()}`);

parentPort.on('message', msg => {
  if (msg === 'GET_NEW_ADDRESS') {
    const data = bitgo.getNewAddress();
    parentPort.postMessage({ type: 'GET_NEW_ADDRESS', data });
  }
});
