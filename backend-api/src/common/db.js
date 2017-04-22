'use strict';

var fs = require('fs');
var path = require('path');
var DataStore = require('nedb');
var config = require('./../config');

if(!fs.existsSync(config.dbFolder)){
  fs.mkdirSync(config.dbFolder);
}

var db = {};

db.users = new DataStore({filename: path.join(config.dbFolder, 'users.db'), autoload: true});

db.projectInfo = new DataStore({filename: path.join(config.dbFolder, 'projectInfo.db'), autoload: true});

db.templateInfo = new DataStore({filename: path.join(config.dbFolder, 'templateInfo.db'), autoload: true});


module.exports = db;