const uuid = require('uuid');
const sechash = require('sechash');

const algorithm = 'sha1';

const getHashValue = (userId, length) => {
  let seed = `${userId}_${Date.now()}`;
  return sechash.basicHash(algorithm, seed).slice(0, length);
};

const buildId = (userId) => {
  return getHashValue(userId, 8);
};

const buildToken = (userId) => {
  let seed = Date.now();
  return getHashValue(userId, 21);
};

module.exports = {
  buildId,
  buildToken
};
