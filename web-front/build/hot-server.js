require('shelljs/global');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const express = require('express');
const historyApiFallback = require('connect-history-api-fallback');

const util = require('./util');
const devConfig = require('./webpack.dev.conf');
const compiler = webpack(devConfig);

const app = express();

app.use(historyApiFallback());

app.use(webpackDevMiddleware(compiler, {
  publicPath: 'http://localhost:7410/',
  stats: {
    colors: true,
    chunks: false
  }
}));
app.use(webpackHotMiddleware(compiler));

app.listen(7410, err => {
  if (err) {
    return console.error(err);
  }
  exec('start http://localhost:7410');
});