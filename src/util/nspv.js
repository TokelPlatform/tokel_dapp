const { spawn } = require('child_process');

const newEnvVars = { ...process.env };
delete newEnvVars.HOT;
delete newEnvVars.START_HOT;
newEnvVars.NODE_ENV = 'production';

const path = require('path');
const { app } = require('electron');

export const getBinariesDirectoryPath = () => {
  let appPath = null;
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    appPath = app.getAppPath();
  } else {
    appPath = path.join(app.getAppPath(), '..');
  }
  return path.join(appPath, 'binaries');
};

const cwd = `${getBinariesDirectoryPath()}/libnspv`;
class NspvSingleton {
  constructor() {
    if (process.env.NODE_ENV === 'test') {
      return 'singleton created';
    }
    console.log('Starting a new NSPV process in the background.');
    const nspv = spawn(cwd.concat('/nspv'), ['KMD'], {
      cwd,
    });
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
