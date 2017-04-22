'use strict';

let projectDal = require('./../dal/projectDal');

let saveProject = (req, res, next) => {
  let projectInfo = req.body;
  projectDal.createProject(projectInfo, req.sessionObj.userInfo.userId)
    .then(data => res.json(data))
    .catch(reason => next(reason));
};

let updateProject = (req, res, next) => {
  let params = req.params;
  let body = req.body;
  let updateProjectObj = {};
  let keys = ['fileList', 'projectName', 'description', 'tags'];
  keys.forEach(k => {
    if (body[k]) {
      updateProjectObj[k] = body[k];
    }
  });
  projectDal.updateProject(params.projId, updateProjectObj, req.sessionObj.userInfo.userId)
    .then(succeed => {
      res.json(succeed);
    })
    .catch(reason => next(reason));
};

let likeProject = (req, res, next) => {
  projectDal.likeProject(req.params.projId, req.sessionObj.userInfo.userId, false)
    .then(data => res.json(data))
    .catch(reason => next(reason));
};

let unLikeProject = (req, res, next) => {
  projectDal.likeProject(req.params.projId, req.sessionObj.userInfo.userId, true)
    .then(data => res.json(data))
    .catch(reason => next(reason));
};

let deleteProject = (req, res, next) => {
  projectDal.deleteProject(req.params.projId, req.sessionObj.userInfo.userId)
    .then(() => res.json(true))
    .catch(reason => next(reason));
};

let getFileContent = (req, res, next) => {
  let params = req.params;
  let projectId = params.projId;
  let fileName = params.file || 'index.html';
  projectDal.getProject(projectId)
    .then(p => {
      let content = p.fileList.find(x => x.fileName === fileName).originalContent;
      if (fileName === 'index.css') {
        res.set('Content-Type', 'text/css');
      }
      res.send(content);
    }).catch(reason => next(reason));
};

let getProject = (req, res, next) => {
  let params = req.params;
  projectDal.getProject(params.projId)
    .then(data => res.json(data))
    .catch(reason => next(reason));
};

let getMyCodes = (req, res, next) => {
  let userId = req.sessionObj.userInfo.userId;
  let keyword = req.query.keyword;
  let pageSize = req.query.size || 15;
  let pageIndex = req.query.index || 1;

  projectDal.queryProjects(keyword, pageSize, pageIndex, { userId: userId, includeTotalCount: true })
    .then(data => res.json(data))
    .catch(reason => next(reason));
};

let getSquareCodes = (req, res, next) => {
  let keyword = req.query.keyword;
  let pageSize = req.query.size || 15;
  let pageIndex = req.query.index || 1;

  projectDal.queryProjects(keyword, pageSize, pageIndex, { includeTotalCount: true })
    .then(data => res.json(data))
    .catch(reason => next(reason));
};

module.exports = {
  saveProject: saveProject,
  updateProject: updateProject,
  deleteProject: deleteProject,
  getFileContent: getFileContent,
  getProject: getProject,
  getMyCodes: getMyCodes,
  getSquareCodes: getSquareCodes,
  likeProject: likeProject,
  unLikeProject: unLikeProject
};