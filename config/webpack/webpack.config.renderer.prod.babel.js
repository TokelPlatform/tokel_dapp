/**
 * Build config for electron renderer process
 */

import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { merge } from 'webpack-merge';

import CheckNodeEnv from '../scripts/CheckNodeEnv';
import DeleteSourceMaps from '../scripts/DeleteSourceMaps';
import paths from '../scripts/paths';
import baseConfig from './webpack.config.base';
import moduleFactory from './webpack.config.renderer.module.babel';

CheckNodeEnv('production');
DeleteSourceMaps();

export default merge(baseConfig, {
  ...(process.env.DEBUG_PROD === 'true' ? { devtool: 'source-map' } : {}),
  mode: 'production',
  target: 'electron-renderer',

  entry: ['core-js', 'regenerator-runtime/runtime', paths.appIndex],

  output: {
    path: paths.electronDistDir,
    publicPath: '../../dist/',
    filename: 'renderer.js',
  },

  module: moduleFactory(false),

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG_PROD: false,
    }),

    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),

    new BundleAnalyzerPlugin({
      analyzerMode: process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
      openAnalyzer: process.env.OPEN_ANALYZER === 'true',
    }),
  ],
});
