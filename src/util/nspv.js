/* eslint-disable no-console */
import { spawn } from 'child_process';
import path from 'path';
import os from 'os';
import { SIGINT } from 'constants';

import { OsType, TICKER } from '../vars/defines';

const { app } = require('electron');

const RECONNECT_TIMES = 6;

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
    this.binName = os.type === OsType.WINDOWS ? 'nspv.exe' : 'nspv';
    this.connect();
    this.reconnected = 0;
  }

  connect() {
    console.log('Starting a new NSPV process in the background.');
    this.nspv = spawn(path.join(cwd, this.binName), [TICKER], { cwd });
    this.nspv.stdout.setEncoding('utf8');

    this.nspv.stdout.on('data', data => {
      console.log('------', data);
    });

    this.nspv.stderr.on('data', err => {
      console.error(`stderr: ${err}`);
    });

    this.nspv.on('exit', code => {
      console.log('exit', code);
      if (!this.nukeit && this.reconnected < RECONNECT_TIMES) {
        setTimeout(() => {
          this.connect();
          this.reconnected += 1;
        }, 10000);
      }
    });
  }

  get() {
    return this.nspv;
  }

  cleanup() {
    console.log('SIGINT by the app');
    this.nukeit = true;
    this.nspv.kill(SIGINT);
  }
}

const nspv = new NspvSingleton();
export default nspv;
