'use strict';

let db = require('./../common/db');

let getTemplates = () => {
  return new Promise((resolve, reject) => {
    db.templateInfo.find({}, (err, templates) => {
      if (err) return reject(err);
      resolve(templates);
    });
  });
};

let saveTemplate = (template) => {
  return new Promise((resolve, reject) => {
    db.templateInfo.findOne({ templateName: template.templateName }, (err, templateDoc) => {
      if (err) return reject(err);
      if (templateDoc) { // Update
        templateDoc.htmlCode = template.htmlCode;
        templateDoc.jsCode = template.jsCode;
        templateDoc.cssCode = template.cssCode;
        db.templateInfo.update({ templateName: template.templateName }, template, (err, numReplaced) => {
          if (err) return reject(err);
          if (numReplaced === 0) {
            return reject(new Error('Save failed, please retry.'));
          }
          resolve('Accepted');
        });
      } else { // Insert
        db.templateInfo.insert(template, (err, doc) => {
          if (err) return reject(err);
          resolve('Created');
        });
      }
    });
  });
};

module.exports = {
  getTemplates: getTemplates,
  saveTemplate: saveTemplate
};