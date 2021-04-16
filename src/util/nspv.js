import { spawn } from 'child_process';
import path from 'path';

const { app } = require('electron');

const binariesDir =
  process.env.NODE_ENV === 'development'
    ? path.join(app.getAppPath(), '..', '..', 'include', 'binaries')
    : path.join(app.getAppPath(), '..', 'binaries');

const cwd = path.join(binariesDir, 'libnspv');
class NspvSingleton {
  constructor() {
    if (process.env.NODE_ENV === 'test') {
      return 'singleton created';
    }
    console.log('Starting a new NSPV process in the background.');
    const nspv = spawn(path.join(cwd, 'nspv'), ['KMD'], { cwd });
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
