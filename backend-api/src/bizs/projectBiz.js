const expressToken = require('express-token');
const db = require('./../common/db');
const util = require('./../common/util');
const projectSchemas = require('./schemas/projectSchemas');

// Judge user auth
const _updateProject = (req) => {
  // find the project
  let projectId = req.params.projectId;
  let data = req.body;
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
      if (data.files) {
        _processProjectFiles(data);
      }
      let updatedData = {
        $set: Object.assign({}, data, { lastUpdateDate: Date.now() })
      };
      return db.update(db.collections.projects, { _id: doc._id }, updatedData);
    });
};

const _processProjectFiles = project => {
  Object.keys(project.files).forEach(key => {
    project.files[key.replace('.', '_')] = project.files[key]
    delete project.files[key];
  });
};

const _reverseProcessProjectFiles = project => {
  Object.keys(project.files).forEach(key => {
    project.files[key.replace('_', '.')] = project.files[key]
    delete project.files[key];
  });
};

const createProject = (req, res, next) => {
  let data = req.body;
  Validator.validate(data, projectSchemas.CREATE_PROJECT_SCHEMA, { allowUnknown: false, abortEarly: false })
    .then(() => {
      _processProjectFiles(data);
      data.projectId = util.generateShortId();
      data.createDate = data.lastUpdateDate = Date.now();
      data.userId = req.user ? req.user._id : '';
      data.username = req.user ? req.user.username : 'anonymous';
      return db.insert(db.collections.projects, data);
    })
    .then(doc => {
      res.status(201).send(doc);
    })
    .catch(next);
};

const updateProject = (req, res, next) => {
  let data = req.data;
  Validator.validate(data, projectSchemas.UPDATE_PROJECT_SCHEMA, { allowUnknown: false, abortEarly: false })
    .then(() => {
      return _updateProject(req);
    })
    .then(() => {
      res.status(202).end();
    })
    .catch(next);
};

const updateProjectFiles = (req, res, next) => {
  let data = req.body;
  Validator.validate(data, projectSchemas.UPDATE_PROJECT_FILES_SCHEMA, { allowUnknown: false, abortEarly: false })
    .then(() => {
      return _updateProject(req);
    })
    .then(() => {
      res.status(202).end();
    })
    .catch(next);
};

const getProject = (req, res, next) => {
  let username = req.params.username;
  let projectId = req.params.projectId;
  db.findOne(db.collections.projects, { projectId })
    .then(project => {
      if (!project || project.username !== username) {
        return Promise.reject(util.bizException('Project not exists.'));
      }
      _reverseProcessProjectFiles(project);
      res.send(project);
    })
    .catch(next);
};

module.exports = {
  createProject,
  updateProject,
  updateProjectFiles,
  getProject
};
