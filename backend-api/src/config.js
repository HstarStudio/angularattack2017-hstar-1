'use strict';

var path = require('path');

module.exports = {
  port: 8603,
  apiPrefix: '/api/v1',
  dbFolder: path.join(__dirname, './database')
};