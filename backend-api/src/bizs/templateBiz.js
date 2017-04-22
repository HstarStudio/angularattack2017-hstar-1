'use strict';

let templatetDal = require('./../dal/templateDal');

let getTemplates = (req, res, next) => {
  templatetDal.getTemplates()
    .then(data => res.json(data))
    .catch(reason => next(reason));
};

let saveTemplate = (req, res, next) => {
  let template = {
    templateName: req.params.name,
    htmlCode: req.body.htmlCode,
    jsCode: req.body.jsCode,
    cssCode: req.body.cssCode
  };
  templatetDal.saveTemplate(template)
    .then(data => res.json(data))
    .catch(reason => next(reason));
};

module.exports = {
  getTemplates: getTemplates,
  saveTemplate: saveTemplate
};