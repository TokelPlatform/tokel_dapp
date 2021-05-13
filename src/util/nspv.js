/* eslint-disable no-console */
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
    const binName = os.type === OsType.WINDOWS ? 'nspv.exe' : 'nspv';
    console.log('Starting a new NSPV process in the background.');
    this.nspv = spawn(path.join(cwd, binName), ['KMD'], { cwd });
    this.nspv.stdout.setEncoding('utf8');

    this.nspv.stdout.on('data', data => {
      console.log('------', data);
    });

    this.nspv.stderr.on('data', err => {
      console.error(`stderr: ${err}`);
    });

    this.nspv.on('exit', code => {
      console.log('exit', code);
      // Handle exit
    });
  }

  get() {
    return this.nspv;
  }

  cleanup() {
    this.nspv.kill();
  }
}

const nspv = new NspvSingleton();
export default nspv;
