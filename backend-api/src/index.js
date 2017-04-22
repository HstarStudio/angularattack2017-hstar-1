const path = require('path');
const express = require('express');
const restExpress = require('rest-express');
const expressToken = require('express-token');

const config = require('./config');

const options = {
  port: config.port,
  enableCors: true,
  enableGzip: true,
  apiPrefix: config.apiPrefix,
  routesPath: path.join(__dirname, 'routes'),
  onRoutesLoading(app) {
    app.use(expressToken({ tokenHeader: 'x-dojo-token' }));
  },
  onRoutesLoaded: app => {
    app.use((req, res, next) => {
      var err = new Error('API not found.');
      err.status = 404;
      next(err);
    });

    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      let errResult;
      if (err.isBizException) {
        errResult = err;
      } else {
        errResult = {
          message: (err instanceof Error) ? err.message : err,
          error: config.debug ? err : null
        };
      }
      res.send(errResult);
    });
  }
};
// 如果是调试模式
if (config.debug) {
  options.enableResponseTime = true;
  options.enableLog = true;
}

restExpress.startServer(options)
  .then(server => {
    let addr = server.address();
    console.log(`Server started at ${addr.address}:${addr.port}`);
  }, console.error);
