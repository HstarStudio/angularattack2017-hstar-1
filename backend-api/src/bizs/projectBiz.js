const expressToken = require('express-token');
const db = require('./../common/db');
const util = require('./../common/util');
const projectSchemas = require('./schemas/projectSchemas');

const createProject = (req, res, next) => {
  let data = req.body;
  Validator.validate(data, projectSchemas.CREATE_PROJECT_SCHEMA, { allowUnknown: false, abortEarly: false })
    .then(() => {
      data.projectId = util.generateShortId();
      data.createDate = data.lastUpdateDate = Date.now();
      data.userId = req.user ? req.user._id : ''; // if
      return db.insert(db.collections.projects, data);
    })
    .then(doc => {
      res.end();
    })
    .catch(next);
};

// Judge user auth
const _updateProject = (req) => {
  // find the project
  let projectId = req.params.projectId;
  return db.findOne(db.collections.projects, { projectId })
    .then(doc => {
      if (!doc) {
        return Promise.reject(util.bizException('Project not exists.', 404));
      }
      if (doc.userId) { // Need user logged and match
        if (!req.user) {
          return Promise.reject(util.bizException('Can\'t update project, need login.', 401));
        } else if (doc.userId !== req.user._id) {
          return Promise.reject(util.bizException('Can\'t update project, not your project.', 401));
        }
      }
      return doc;
    })
    .then(doc => {
      let updatedData = {
        $set: Object.assgin({}, data, { lastUpdateDate: Date.now() })
      };
      return db.update(db.collections.projects, { _id: doc._id }, updatedData);
    });
};

const updateProject = (req, res, next) => {
  let data = req.data;
  Validator.validate(data, projectSchemas.UPDATE_PROJECT_SCHEMA, { allowUnknown: false, abortEarly: false })
    .then(() => {
      return _updateProject(req);
    })
    .then(() => {
      res.status(201).end();
    })
    .catch(next);
};

const updateProjectFiles = (req, res, next) => {
  Validator.validate(data, projectSchemas.UPDATE_PROJECT_FILES_SCHEMA, { allowUnknown: false, abortEarly: false })
    .then(() => {
      return _updateProject(req);
    })
    .then(() => {
      res.status(201).end();
    })
    .catch(next);
};

module.exports = {
  createProject,
  updateProject,
  updateProjectFiles
};
