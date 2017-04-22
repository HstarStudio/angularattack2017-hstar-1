'use strict';

let request = require('request');
let db = require('./../common/db');
let util = require('./../common/util');

const SEVEN_DAYS_MILLISECONDS = 1000 * 60 * 60 * 24 * 7; //7天的毫秒数

// 更新User token消息
var _upsertUserInfo = (userInfo, token) => {
    let expiredTime = Date.now() + SEVEN_DAYS_MILLISECONDS;
    db.users.findOne({
        userId: userInfo.userID
    }, (err, user) => {
        if (err) {
            return;
        }
        if (user) { //找到了用户，做更新操作
            db.update({
                _id: user._id
            }, {
                $set: {
                    token: token,
                    fullName: userInfo.FullName,
                    expiredTime: expiredTime,
                    userInfo: userInfo
                }
            }, {}, (err, numReplaced) => {});
        } else { //没有找到用户，做新增操作
            let userData = {
                userId: userInfo.UserID,
                fullName: userInfo.FullName,
                token: token,
                expiredTime: expiredTime,
                userInfo: userInfo
            };
            db.users.insert(userData);
        }
    });
};

var doLogin = (req, res, next) => {
    let postData = {
        Token: req.body.ssoToken,
        ApplicationIds: []
    };
    request({
        url: 'http://10.16.75.24:3000/framework/v1/keystone/sso-auth-data',
        method: 'post',
        body: JSON.stringify(postData),
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': 'Bearer G5vZ4d1JjPl5A1K675OQ3I7oWW6RrfQ4gHtwwUZv'
        }
    }, (err2, res2, body2) => {
        if (err2) {
            return next(err2);
        }
        let userInfo = JSON.parse(body2).UserInfo;
        if(!userInfo){
            return next(new Error('User not exists.'));
        }
        let token = util.buildToken(userInfo.UserID);

        _upsertUserInfo(userInfo, token);

        res.setHeader('Access-Control-Expose-Headers', 'x-dojo-token');
        res.setHeader('x-dojo-token', token);
        res.json(userInfo);
    });
};

var doAutoLogin = (req, res, next) => {
    db.users.findOne({
        token: req.body.dojoToken,
        expiredTime: {
            $gt: Date.now()
        }
    }, (err, user) => {
        if (err) {
            return next(err);
        }
        res.json(user ? user.userInfo : null);
    });
};

var doLogout = (req, res, next) => {

};

var validateUser = (req, res, next) => {
    let dojoToken = req.headers['x-dojo-token'];
    if(!dojoToken){
        return next(new Error('Headers must include x-dojo-token'));
    }
    db.users.findOne({
        token: dojoToken,
        expiredTime: {
            $gt: Date.now()
        }
    }, (err, user) => {
        if (err) {
            return next(err);
        }
        if(!user){
            return next(new Error('User not found.'));
        }
        req.sessionObj = req.sessionObj || {};
        req.sessionObj.userInfo = {
            userId: user.userId,
            fullName: user.fullName
        };
        next();
    });
};

module.exports = {
    doLogin: doLogin,
    doAutoLogin: doAutoLogin,
    doLogout: doLogout,
    validateUser: validateUser
};