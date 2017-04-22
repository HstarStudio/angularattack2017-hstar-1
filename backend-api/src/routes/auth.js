'use strict';

var router = require('express').Router();
var config = require('./../config');
var authBiz = require('./../bizs/authBiz');

router.post('/login', authBiz.doLogin);

router.post('/autologin', authBiz.doAutoLogin);

router.post('/logout', authBiz.doLogout);

module.exports = (app) => {
  app.use(`${config.apiPrefix}/auth`, router);
};