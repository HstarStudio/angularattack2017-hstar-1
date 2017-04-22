const uuid = require('uuid');
const sechash = require('sechash');
const shortid = require('shortid');
const nodeMd5 = require('md5');

const generateShortId = () => {
  return shortid.generate();
};

const hashCode = (str, len = undefined, algorithm = 'sha1') => {
  return sechash.basicHash(algorithm, str).slice(0, len);
};

const generateUUID = () => {
  return uuid.v4();
};

const md5 = (str) => {
  return nodeMd5(str);
};

const bizException = (message, status = 500) => {
  return {
    isBizException: true,
    message,
    status
  };
};

module.exports = {
  generateShortId,
  hashCode,
  generateUUID,
  md5,
  bizException
};
