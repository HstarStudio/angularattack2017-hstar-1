const util = require('./../common/util');
const db = require('./../common/db');

let queryProjects = (keyword, pageSize, pageIndex, options) => {
  if (!pageSize || !pageIndex) {
    throw new Error('pageSize and pageIndex required.');
  }
  options = options || {};
  let searchObj = {};
  // 关键字匹配
  if (keyword) {
    searchObj.$or = [
      { projectName: { $regex: new RegExp(keyword, 'gi') } },
      { description: { $regex: new RegExp(keyword, 'gi') } },
      { tags: { $elemMatch: keyword } }
    ];
  }
  // 判断 user
  if (options.userId) {
    searchObj.owner = options.userId;
  }
  let promiseArr = [];
  // 定义查数据的Promise
  let queryDataPromise = new Promise((resolve, reject) => {
    db.projectInfo.find(searchObj, { fileList: 0 })
      .sort({ createDate: -1 })
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize)
      .exec((err, projects) => {
        if (err) return reject(err);
        resolve(projects);
      });
  });
  promiseArr.push(queryDataPromise);
  // 定义查询 totalCount Promise
  if (options.includeTotalCount) {
    let queryTotalCountPromise = new Promise((resolve, reject) => {
      db.projectInfo.count(searchObj, (err, count) => {
        if (err) return reject(err);
        resolve(count);
      });
    });
    promiseArr.push(queryTotalCountPromise);
  }
  // 返回结果
  return new Promise((resolve, reject) => {
    Promise.all(promiseArr)
      .then(results => {
        let result = {
          pageSize: pageSize,
          pageIndex: pageIndex,
          data: results[0]
        };
        if (results.length === 2) {
          result.totalCount = results[1];
        }
        resolve(result);
      })
      .catch(reason => reject(reason));
  });
};

let _setBasicInfo = (projectInfo, isCreate) => {
  projectInfo.lastUpdateDate = Date.now();
  if (isCreate) {
    projectInfo.createDate = projectInfo.lastUpdateDate;
    projectInfo.projectId = util.buildId(projectInfo.owner);
    projectInfo.version = 0;
  }
};

let createProject = (project, userId) => {
  project.owner = userId;
  _setBasicInfo(project, true);
  return new Promise((resolve, reject) => {
    db.projectInfo.insert(project, (err, doc) => {
      if (err) return reject(err);
      resolve(doc);
    });
  });

};

let updateProject = (projectId, project, userId) => {
  let updateObj = { lastUpdateDate: Date.now() };
  Object.keys(project).forEach(k => updateObj[k] = project[k]);
  return new Promise((resolve, reject) => {
    db.projectInfo.update({
      projectId: projectId,
      version: 0,
      owner: userId
    }, {
        $set: updateObj
      }, {}, (err, numReplaced) => {
        if (err) return reject(err);
        if (numReplaced === 0) {
          return reject(new Error('操作失败，请重试！'));
        }
        resolve(true);
      });
  });
};

let likeProject = (projectId, userId, isUnLike) => {
  return new Promise((resolve, reject) => {
    db.projectInfo.findOne({ projectId: projectId }, (err, p) => {
      if (err) return reject(err);
      if (!p) {
        return reject(new Error('Project not found.'));
      }
      if (!p.likes) {
        p.likes = [];
      }
      let userIndex = p.likes.indexOf(userId);
      if (isUnLike) {
        if (userIndex < 0) {
          return resolve('You are not like it, can not unlike.');
        } else {
          // 取消赞
          db.projectInfo.update({ _id: p._id }, { $pull: { likes: userId } }, {}, (err, aa) => {
            console.log(err, aa);
            resolve(true);
          });
        }
      } else {
        if (userIndex >= 0) {
          return resolve('You are liked it, can not repeat like.');
        } else {
          // 点赞
          db.projectInfo.update({ _id: p._id }, { $addToSet: { likes: userId } }, {}, (err, aa) => {
            console.log(err, aa);
            resolve(true);
          });
        }
      }
    });
  });
};

let deleteProject = (projectId, userId) => {
  return new Promise((resolve, reject) => {
    db.projectInfo.findOne({ projectId: projectId }, (err, p) => {
      if (err) return reject(err);
      if (p.owner !== userId) {
        return reject(new Error('You has no authorize to delete the code.'));
      }
      db.projectInfo.remove({ _id: p._id }, {}, (err, numRemoved) => {
        if (err) return reject(err);
        if (numRemoved === 0) {
          return reject(new Error('Operate failed, please retry.'));
        }
        resolve();
      });
    });
  });
};

let getProject = (projectId) => {
  return new Promise((resolve, reject) => {
    db.projectInfo.findOne({
      projectId: projectId,
      version: 0
    }, {}, (err, project) => {
      if (err) return reject(err);
      resolve(project);
    });
  });
};

module.exports = {
  queryProjects: queryProjects,
  createProject: createProject,
  updateProject: updateProject,
  getProject: getProject,
  deleteProject: deleteProject,
  likeProject: likeProject
};