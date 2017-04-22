const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const commonConfig = require('./webpack.common.conf.js');
const util = require('./util');
const hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';

const devConfig = webpackMerge(commonConfig, {
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: util.root('dist'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ],
  // devServer: {
  //   // host: '0.0.0.0', // If need visit extenal, cancel the comment
  //   port: 7410,
  //   historyApiFallback: true,
  //   stats: 'minimal',
  //   open: true
  // }
});

Object.keys(devConfig.entry).forEach(key => {
  devConfig.entry[key] = ['eventsource-polyfill', hotMiddlewareScript].concat(devConfig.entry[key]);
});

module.exports = devConfig;
