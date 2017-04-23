const Joi = require('joi');

const project = {
  projectName: Joi.string().required(),
  projectDescription: Joi.string().allow(''),
  projectTags: Joi.array().min(1)
};

const files = {
  templateName: Joi.string().required(),
  files: Joi.object({
    'index.js': Joi.string().allow(''),
    'index.html': Joi.string().allow(''),
    'index.css': Joi.string().allow('')
  })
};

// Schema for create project 
const CREATE_PROJECT_SCHEMA = Joi.object(Object.assign({}, project, files));

// Schema for update project info
const UPDATE_PROJECT_SCHEMA = Joi.object(Object.assign({}, project));

// Schema for update project files info
const UPDATE_PROJECT_FILES_SCHEMA = Joi.object(Object.assign({}, files));

module.exports = {
  CREATE_PROJECT_SCHEMA,
  UPDATE_PROJECT_SCHEMA,
  UPDATE_PROJECT_FILES_SCHEMA
};
