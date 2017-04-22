'use strict';

var router = require('express').Router();
var config = require('./../config');
var authBiz = require('./../bizs/authBiz');
var templateBiz = require('./../bizs/templateBiz');

// 模板相关Start
router.get('/', templateBiz.getTemplates);
router.post('/:name', authBiz.validateUser, templateBiz.saveTemplate);
// 模板相关End

module.exports = (app) => {
  app.use(`${config.apiPrefix}/template`, router);
};
