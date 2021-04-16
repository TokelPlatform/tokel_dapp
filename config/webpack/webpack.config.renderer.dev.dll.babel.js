/**
 * Builds the DLL for development electron renderer process
 */
import path from 'path';

import webpack from 'webpack';
import { merge } from 'webpack-merge';

import { dependencies } from '../../package.json';
import CheckNodeEnv from '../scripts/CheckNodeEnv';
import paths from '../scripts/paths';
import baseConfig from './webpack.config.base';
import module from './webpack.config.renderer.dev.module.babel';

CheckNodeEnv('development');

export default merge(baseConfig, {
  mode: 'development',
  context: paths.rootDir,
  devtool: 'eval',
  target: 'electron-renderer',
  externals: ['fsevents', 'crypto-browserify'],

  module,

  entry: {
    renderer: Object.keys(dependencies || {}),
  },

  output: {
    library: 'renderer',
    path: paths.dllDir,
    filename: '[name].dev.dll.js',
    libraryTarget: 'var',
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.join(paths.dllDir, '[name].json'),
      name: '[name]',
    }),

    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        context: paths.appSrcDir,
        output: {
          path: paths.dllDir,
        },
      },
    }),
  ],
});
