'use strict';

const chalk = require('chalk');
const vm = require('vm');
const escape = require('escape-html');
const async = require('async');

function requireShim(x) {
    console.log(chalk.green("External script required: " + x));
    return require(x);
}

function runScript(scriptId, script, done) {
    var result;
    var sandboxContext = {
        "done": function (value) {
            result = value;
        },
        "module": module,
        "require": requireShim,
        "console": console
    };

    //30 sec timeout
    try {
        vm.runInNewContext(script, sandboxContext, {timeout: 30 * 1000});
        done(scriptId, escape(result || 'Default Answer'));
    } catch (e) {
        console.log(chalk.red('Error while running script ' + scriptId + '! ' + e));
        done(scriptId, 'error while executing script');
    }
}

exports.runScripts = function (scripts, done) {
    var scriptResults = {};

    async.forEachLimit(Object.keys(scripts), 4, function (scriptId, callback) {
        runScript(scriptId, scripts[scriptId], function (id, result) {
            scriptResults[id] = result;
            callback();
        });
    }, function (err) {
        done(err, scriptResults);
    });
};
