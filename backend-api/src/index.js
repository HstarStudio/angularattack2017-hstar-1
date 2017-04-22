var path = require('path');
var express = require('express');
var rexpress = require('neg-rexpress');
var busboy = require('connect-busboy');
var config = require('./config');

var logOption = {
    apiLog: {
        uri: 'http://10.16.75.24:3000/framework/v1/log-entry',
        global: 'Newegg',
        local: 'Newegg-dojo',
        category: "Exception"
    } 
};
var routePath = `${__dirname}/routes`;
var beforeLoadRoute = (app) => {
    // app.use(history());
    app.use(busboy({
        limits: {
            fileSize: 1024 * 1024 * 50 //50M
        }
    }));
};

var options = {
    logConfig: logOption,
    routePath: routePath,
    port: config.port,
    consoleFormat: 'dev',
    errorTitle: 'Newegg Dojo Error',
    beforeLoadRoute: beforeLoadRoute
};

rexpress.startServer(options, (server, app) => {
    var addr = server.address();
    console.log(`Start server at ${addr.address},port:${addr.port}`);
});
