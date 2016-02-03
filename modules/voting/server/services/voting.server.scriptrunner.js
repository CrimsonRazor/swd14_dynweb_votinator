'use strict';

const chalk = require('chalk');
const vm = require('vm');
const escape = require('escape-html');

function requireShim(x) {
    console.log(chalk.yellow("External script required: " + x));
    return require(x);
}

function runScript(script) {
    var sandboxContext = {
        "result": '',
        "module": module,
        "require": requireShim,
        "console": console
    };

    //30 sec timeout
    vm.runInNewContext(script, sandboxContext, {timeout: 30 * 1000});

    return escape(sandboxContext.result || 'Default Answer');
}

exports.runScripts = function (scripts) {
    var scriptResults = {};
    for (var i in scripts) {
        if (scripts.hasOwnProperty(i))
            scriptResults[i] = runScript(scripts[i]);
    }
    return scriptResults;
};
