#!/usr/bin/env node

var pluginlist = [
    "https://github.com/apache/cordova-plugins#wkwebview-engine-localhost"
];

var exec = require('child_process').exec;

function log(error, stdout, stderr) {
    console.log(stdout);
}

pluginlist.forEach(function (plugin) {
    exec("cordova plugin add " + plugin, log);
});
