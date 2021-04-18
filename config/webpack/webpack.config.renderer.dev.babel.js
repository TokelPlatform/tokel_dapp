import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import chalk from 'chalk';
import webpack from 'webpack';
import { merge } from 'webpack-merge';

import CheckNodeEnv from '../scripts/CheckNodeEnv';
import paths from '../scripts/paths';
import baseConfig from './webpack.config.base';
import module from './webpack.config.renderer.dev.module.babel';

// When an ESLint server is running, we can't set the NODE_ENV so we'll check if it's
// at the dev webpack config is not accidentally run in a production environment
if (process.env.NODE_ENV === 'production') {
  CheckNodeEnv('development');
}

const port = process.env.PORT || 1212;
const publicPath = `http://localhost:${port}/dist`;
const manifestFile = path.resolve(paths.dllDir, 'renderer.json');

/**
 * Warn if the DLL is not built
 */
if (!(fs.existsSync(paths.dllDir) && fs.existsSync(manifestFile))) {
  console.log(
    chalk.black.bgYellow.bold(
      'The DLL files are missing. Sit back while we build them for you with "yarn build-dll"'
    )
  );
  execSync('yarn build-dll');
}

export default merge(baseConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  target: 'electron-renderer',

  module,

  entry: ['core-js', 'regenerator-runtime/runtime', require.resolve(paths.appIndex)],

  output: {
    publicPath: `http://localhost:${port}/dist/`,
    filename: 'renderer.dev.js',
  },

  plugins: [
    new webpack.DllReferencePlugin({
      context: paths.dllDir,
      manifest: require(manifestFile),
      sourceType: 'var',
    }),

    new webpack.NoEmitOnErrorsPlugin(),

    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),

    new ReactRefreshWebpackPlugin(),
  ],

  node: {
    __dirname: false,
    __filename: false,
  },

  devServer: {
    port,
    publicPath,
    compress: true,
    noInfo: false,
    stats: 'errors-only',
    inline: true,
    lazy: false,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentBase: path.join(__dirname, 'dist'),
    watchOptions: {
      aggregateTimeout: 300,
      ignored: /node_modules/,
      poll: 100,
    },
    historyApiFallback: {
      verbose: true,
      disableDotRule: false,
    },
    before() {
      console.log('Starting Main Process...');
      spawn('npm', ['run', 'start:main'], {
        shell: true,
        env: process.env,
        stdio: 'inherit',
      })
        .on('close', code => process.exit(code))
        .on('error', spawnError => console.error(spawnError));
    },
  },
});
