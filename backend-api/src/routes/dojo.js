'use strict';

var router = require('express').Router();
var config = require('./../config');
var authBiz = require('./../bizs/authBiz');
var dojoBiz = require('./../bizs/dojoBiz');

// 项目相关Start
router.get('/get-my-codes', authBiz.validateUser, dojoBiz.getMyCodes);
router.get('/get-square-codes', dojoBiz.getSquareCodes);
router.post('/new', authBiz.validateUser, dojoBiz.saveProject);
router.post('/like/:projId', authBiz.validateUser, dojoBiz.likeProject);
router.post('/unlike/:projId', authBiz.validateUser, dojoBiz.unLikeProject);
router.post('/:projId/:version', authBiz.validateUser, dojoBiz.updateProject);
router.delete('/:projId', authBiz.validateUser, dojoBiz.deleteProject);
router.get('/:projId/:version/preview/:file?', dojoBiz.getFileContent);
router.get('/:projId/:version', dojoBiz.getProject);
// 项目相关End

module.exports = (app) => {
  app.use(`${config.apiPrefix}/dojo`, router);
};