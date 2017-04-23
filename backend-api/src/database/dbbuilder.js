const db = require('./../common/db');
const util = require('../common/util');

db.users.insert([
  { username: 'admin', password: util.md5('123456') },
  { username: 'anonymous', password: util.md5('anonymous') }
]);
