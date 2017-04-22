const path = require('path');

module.exports = {
  debug: true,
  port: 8603,
  apiPrefix: '/api/v1',
  dbFolder: path.join(__dirname, './database')
};
