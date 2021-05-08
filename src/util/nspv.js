import { spawn } from 'child_process';
import path from 'path';
import os from 'os';

import { OsType } from '../vars/defines';

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
    let binName = 'nspv';
    if (os.type === OsType.WINDOWS) {
      binName = 'nspv.exe';
    }
    console.log('Starting a new NSPV process in the background.');
    const nspv = spawn(path.join(cwd, binName), ['KMD'], { cwd });
    nspv.stdout.setEncoding('utf8');

    nspv.stdout.on('data', data => {
      console.log('------', data);
    });

    nspv.stderr.on('data', err => {
      console.error(`stderr: ${err}`);
    });

    nspv.on('exit', code => {
      console.log('exit', code);
      // Handle exit
    });
  }
}

const nspv = new NspvSingleton();
export default nspv;
