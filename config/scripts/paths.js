import fs from 'fs';
import path from 'path';

const rootDir = fs.realpathSync(process.cwd());
const resolveRoot = relativePath => path.resolve(rootDir, relativePath);

export default {
  rootDir,

  appPackageJson: resolveRoot('package.json'),
  appNodeModules: resolveRoot('node_modules'),
  appYarnLock: resolveRoot('yarn.lock'),
  appTsConfig: resolveRoot('tsconfig.json'),

  dllDir: resolveRoot('config/dll'),

  appSrcDir: resolveRoot('src'),
  appIndex: resolveRoot('src/index.tsx'),

  builtMainFile: resolveRoot('build/main.js'),
  builtRendererFile: resolveRoot('build/dist/renderer.js'),

  electronBuildDir: resolveRoot('build'),
  electronDistDir: resolveRoot('build/dist'),

  indexHtml: resolveRoot('src/electron/index.html'),
  electronMainFile: resolveRoot('src/electron/main.ts'),
  nativePackageJson: resolveRoot('src/electron/package.json'),
  nativeNodeModules: resolveRoot('src/electron/node_modules'),
};
