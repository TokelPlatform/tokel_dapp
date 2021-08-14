/* eslint-disable no-console */
import { spawn } from 'child_process';
import path from 'path';
import os from 'os';
import { SIGINT } from 'constants';

import { app } from 'electron';

import { OsType, TICKER } from '../vars/defines';

const RECONNECT_TIMES = 6;

const getbinariesDir = () =>
  process.env.NODE_ENV === 'development'
    ? path.join(app.getAppPath(), '..', '..', 'include', 'binaries')
    : path.join(app.getAppPath(), '..', 'binaries');

const getBinaryName = () => {
  console.log(os.type());
  switch (os.type()) {
    case OsType.MAC:
      return 'nspv-mac';
    case OsType.LINUX:
      return 'nspv-linux';
    default:
      return 'nspv.exe';
  }
};

const cwd = path.join(getbinariesDir(), 'libnspv');
class NspvSingleton {
  constructor() {
    if (process.env.NODE_ENV === 'test') {
      return 'singleton created';
    }
    this.binName = getBinaryName();
    this.connect();
    this.reconnected = 0;
    this.callbackFn = null;
  }

  connect() {
    console.log('Starting a new NSPV process in the background.');
    this.nspv = spawn(path.join(cwd, this.binName), [TICKER], { cwd });
    this.nspv.stdout.setEncoding('utf8');
    this.connected = true;
    if (this.callbackFn) {
      this.callbackFn(true);
    }

    this.nspv.stdout.on('data', data => {
      console.log('------', data);
    });

    this.nspv.stderr.on('data', err => {
      console.error(`stderr: ${err}`);
    });

    this.nspv.on('exit', code => {
      console.log('exit', code);
      this.connected = false;
      if (this.callbackFn) {
        this.callbackFn(false);
      }
      if (!this.nukeit && this.reconnected < RECONNECT_TIMES) {
        setTimeout(() => {
          this.connect();
          this.reconnected += 1;
        }, 10000);
      }
    });
  }

  registerCallback(callbackFn) {
    this.callbackFn = callbackFn;
  }

  get() {
    return this.nspv;
  }

  cleanup() {
    console.log('SIGINT by the app');
    this.connected = false;
    if (this.callbackFn) {
      this.callbackFn(false);
    }
    this.nukeit = true;
    this.nspv.kill(SIGINT);
  }
}

const nspv = new NspvSingleton();
export default nspv;
