const { spawn } = require('child_process');

const libnspv = `${__dirname}/../../bin/libnspv/nspv`;
class NspvSingleton {
  constructor() {
    if (process.env.NODE_ENV === 'test') {
      return 'singleton created';
    }
    console.log('Starting a new NSPV process in the background.');
    const nspv = spawn(libnspv, ['KMD']);
    nspv.stdout.setEncoding('utf8');

    nspv.stdout.on('data', (data) => {
      console.log('------', data);
    });

    nspv.stderr.on('data', (err) => {
      console.error(`stderr: ${err}`);
    });

    nspv.on('exit', (code) => {
      console.log('exit', code);
      // Handle exit
    });
  }
}

const nspv = new NspvSingleton();
export default nspv;
