import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

import { dependencies } from '../../src/electron/package.json';
import paths from './paths';

if (
  Object.keys(dependencies || {}).length > 0 &&
  fs.existsSync(paths.nativeNodeModules)
) {
  const electronRebuildCmd =
    '../node_modules/.bin/electron-rebuild --parallel --force --types prod,dev,optional --module-dir .';
  const cmd =
    process.platform === 'win32'
      ? electronRebuildCmd.replace(/\//g, '\\')
      : electronRebuildCmd;
  execSync(cmd, {
    cwd: paths.appSrcDir,
    stdio: 'inherit',
  });
}
