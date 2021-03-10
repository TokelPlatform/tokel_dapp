// Check if the renderer and main bundles are built
import path from 'path';
import chalk from 'chalk';
import fs from 'fs';

const mainPath = path.join(__dirname, '../../src/main.prod.js');
const loginRendererPath = path.join(
  __dirname, '../../src/dist/login.renderer.prod.js'
);
const dashboardRendererPath = path.join(
  __dirname, '../../src/dist/dashboard.renderer.prod.js'
);

if (!fs.existsSync(mainPath)) {
  throw new Error(
    chalk.whiteBright.bgRed.bold(
      'The main process is not built yet. Build it by running "yarn build-main"'
    )
  );
}

if (!fs.existsSync(loginRendererPath)) {
  throw new Error(
    chalk.whiteBright.bgRed.bold(
      'The renderer process is not built yet. Build it by running "yarn build-renderer"'
    )
  );
}

  if (!fs.existsSync(dashboardRendererPath)) {
    throw new Error(
      chalk.whiteBright.bgRed.bold(
        'The renderer process is not built yet. Build it by running "yarn build-renderer"'
      )
    );
}
