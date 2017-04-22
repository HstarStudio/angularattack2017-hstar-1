const Joi = require('joi');
const USER_LOGON_SCHEMA = Joi.object({
  username: Joi.string().min(4).max(16).required(),
  password: Joi.string().min(6).required()
});

module.exports = {
  USER_LOGON_SCHEMA
};
