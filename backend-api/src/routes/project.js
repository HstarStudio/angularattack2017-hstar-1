const router = Router();
const projectBiz = require('./../bizs/projectBiz');

router.post('/', projectBiz.createProject);

router.put('/:projectId', projectBiz.updateProject);

router.put('/:projectId/files', projectBiz.updateProjectFiles);

router.get('/', projectBiz.getProjectList);

router.get('/my', projectBiz.getMyProjectList);

router.get('/:username/:projectId', projectBiz.getProject);

module.exports = {
  router,
  priority: 0,
  prefix: '/project'
};
