// Check if the renderer and main bundles are built
import chalk from 'chalk';
import fs from 'fs';

import paths from './paths';

if (!fs.existsSync(paths.builtMainFile)) {
  throw new Error(
    chalk.whiteBright.bgRed.bold(
      'The main process is not built yet. Build it by running "yarn build-main"'
    )
  );
}

if (!fs.existsSync(paths.builtRendererFile)) {
  throw new Error(
    chalk.whiteBright.bgRed.bold(
      'The renderer process is not built yet. Build it by running "yarn build-renderer"'
    )
  );
}
