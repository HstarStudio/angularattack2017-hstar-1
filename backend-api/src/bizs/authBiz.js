const expressToken = require('express-token');
const db = require('./../common/db');
const util = require('./../common/util');
const authSchemas = require('./schemas/authSchemas');

/**
 * User login logic
 */
const doLogin = (req, res, next) => {
  let data = req.body;
  Validator.validate(data, authSchemas.USER_LOGON_SCHEMA)
    .then(() => {
      let password = util.md5(data.password);
      return db.findOne(db.collections.users, { username: data.username, password });
    })
    .then(userInfo => { // login
      if (!userInfo) {
        // login failed.
        return Promise.reject(util.bizException('Username or password invalid.'));
      }
      return expressToken.login(userInfo);
    })
    .then(token => {
      res.send({
        username: data.username,
        token
      });
    })
    .catch(next);
};

/**
 * User logout
 */
const doLogout = (req, res, next) => {
  let token = req.headers['x-dojo-token'];
  Promise.resolve()
    .then(() => {
      if (!req.user) {
        return Promise.reject(util.bizException('User not logged.'));
      }
      return req.user;
    })
    .then(userInfo => {
      // return expressToken.logout(token); // logout
    })
    .then(() => {
      res.end();
    })
    .catch(next);
};

/**
 * User auto login 
 */
const doAutoLogin = (req, res, next) => {
  Promise.resolve()
    .then(() => {
      if (!req.user) {
        return Promise.reject(util.bizException('Auto login failed.', 200));
      }
      let token = req.headers['x-dojo-token'];
      let userInfo = Object.assign({}, req.user, { token });
      delete userInfo.password;
      delete userInfo._id;
      res.send(userInfo);
    })
    .catch(next);
};

const doRegister = (req, res, next) => {
  let data = req.body;
  Validator.validate(data, authSchemas.USER_LOGON_SCHEMA)
    .then(() => {
      let userInfo = { username: data.username, password: util.md5(data.password) };
      return db.insert(db.collections.users, userInfo);
    })
    .then(userInfo => {
      return expressToken.login(userInfo);
    })
    .then(token => {
      res.send({
        username: data.username,
        token
      });
    })
    .catch(next);
};

module.exports = {
  doLogin,
  doLogout,
  doAutoLogin,
  doRegister
};
