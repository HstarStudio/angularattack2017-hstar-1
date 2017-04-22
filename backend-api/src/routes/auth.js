const router = Router();
const authBiz = require('./../bizs/authBiz');

router.post('/login', authBiz.doLogin);
router.post('/autologin', authBiz.doAutoLogin);
router.post('/logout', authBiz.doLogout);
router.post('/register', authBiz.doRegister);

module.exports = {
  router,
  priority: 0,
  prefix: '/auth'
};
