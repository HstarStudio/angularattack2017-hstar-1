const router = Router();
const templateBiz = require('./../bizs/templateBiz');

router.get('/', templateBiz.getTemplates);
router.post('/:name', templateBiz.saveTemplate);

module.exports = {
  router,
  priority: 0,
  prefix: '/template'
};
