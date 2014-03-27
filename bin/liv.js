#!/usr/bin/env node

/*
 * liv
 * https://github.com/chrisenytc/liv
 *
 * Copyright (c) 2014 Christopher EnyTC
 * Licensed under the MIT license.
 */

/**
 * Module dependencies.
 */

var program = require('commander');
var updateNotifier = require('update-notifier');
var Insight = require('insight');
var _ = require('underscore');
var shell = require('shelljs');
var banner = require('../lib/banner.js');
var Liv = require('..');
var liv;
var logged = false;
var path = require('path');
var h = require('../lib/helpers.js');
var debug = require('../lib/debugger.js');
var pkg = require('../package.json');
var configPath = path.join(__dirname, '..', 'lib', 'livConfig.json');
require('colors');

/*
 * Liv Insight
 */

var insight = new Insight({
    trackingCode: 'UA-26025686-4',
    packageName: pkg.name,
    packageVersion: pkg.version
});

/*
 * Liv Bootstrap
 */

program
    .version(pkg.version, '-v, --version')
    .usage('command [option]'.white);

/*
 * Start API
 */

if (h.exists(configPath)) {
    var config = require(configPath);
    liv = new Liv(config.token);
    logged = true;
} else {
    liv = new Liv('');
    debug('  You are not logged in at the time. You may not use all the features of Liv if you do not login with your account.\n', 'error');
}

/*
 * Options
 */

program
    .option('--json', 'Show pure JSON output');

program
    .option('--all', 'Install all modules');

program
    .option('-t, --time <time>', 'A time in milliseconds for monitor mode');

/*
 * Liv Signup
 */

program
    .command('signup')
    .description('Create your Liv account'.white)
    .action(function() {
        var prompts = [{
            type: 'input',
            name: 'name',
            message: 'What\'s your name?'
        }, {
            type: 'input',
            name: 'email',
            message: 'What\'s your email?'
        }, {
            type: 'password',
            name: 'password',
            message: 'Enter your password'
        }];
        //Ask
        liv.prompt(prompts, function(answers) {
            liv.signup(answers.name, answers.email, answers.password);
        });
    });

/*
 * Liv Login
 */

program
    .command('login')
    .description('Login in your Liv account'.white)
    .action(function() {
        var prompts = [{
            type: 'input',
            name: 'email',
            message: 'Enter your email'
        }, {
            type: 'password',
            name: 'password',
            message: 'Enter your password'
        }];
        //Ask
        liv.prompt(prompts, function(answers) {
            liv.login(answers.email, answers.password);
        });
    });

/*
 * Liv Forgot
 */

program
    .command('forgot')
    .description('Reset your password'.white)
    .action(function() {
        var prompts = [{
            type: 'input',
            name: 'email',
            message: 'Enter your email'
        }];
        //Ask
        liv.prompt(prompts, function(answers) {
            liv.forgot(answers.email);
        });
    });

/*
 * Liv Logout
 */

program
    .command('logout')
    .description('Logout of your Liv account'.white)
    .action(function() {
        var prompts = [{
            type: 'confirm',
            name: 'logout',
            message: 'Are you sure you want to logout from your account?'
        }];
        //Ask
        liv.prompt(prompts, function(answers) {
            if (answers.logout) {
                if (h.exists(configPath)) {
                    h.remove(configPath);
                }
                debug('You went out of your account successfully!', 'success');
            }
        });
    });

/*
 * Liv Status
 */
program
    .command('status')
    .description('Show status of API'.white)
    .action(function() {
        if (program.json) {
            liv.status(true);
        } else {
            liv.status();
        }
    });

if (logged) {

    /*
     * Liv Me
     */
    program
        .command('me')
        .description('Show me profile info'.white)
        .action(function() {
            if (program.json) {
                liv.me(true);
            } else {
                liv.me();
            }
        });

    /*
     * Liv UpdateMe
     */

    program
        .command('me:update')
        .description('Update your profile info'.white)
        .action(function() {
            var prompts = [{
                type: 'input',
                name: 'name',
                message: 'Enter a name'
            }, {
                type: 'input',
                name: 'email',
                message: 'Enter a email'
            }, {
                type: 'password',
                name: 'password',
                message: 'Enter a password'
            }];
            //Ask
            liv.prompt(prompts, function(answers) {
                liv.updateMe(answers.name, answers.email, answers.password);
            });
        });

    /*
     * Liv deleteMe
     */

    program
        .command('me:delete')
        .description('Delete your Liv account'.white)
        .action(function() {
            var prompts = [{
                type: 'confirm',
                name: 'delete',
                message: 'Are you sure you want to delete your account with all data?'
            }, {
                type: 'confirm',
                name: 'delete2',
                message: 'Do you confirm the account deletion?'
            }];
            //Ask
            liv.prompt(prompts, function(answers) {
                if (answers.delete) {
                    if (answers.delete2) {
                        liv.deleteMe();
                    }
                }
            });
        });

    /*
     * Liv modules
     */
    program
        .command('list')
        .description('Show your modules'.white)
        .action(function() {
            if (program.json) {
                liv.modules(true);
            } else {
                liv.modules();
            }
        });

    /*
     * Liv updateModules
     */

    program
        .command('save')
        .description('Save global npm modules'.white)
        .action(function() {
            var prompts = [{
                type: "confirm",
                message: "You want to save your global npm modules?",
                name: "confirmSave",
                default: false
            }];
            //Ask
            liv.prompt(prompts, function(answers) {
                if (answers.confirmSave) {
                    // Get global npm modules
                    var modulesStr = shell.exec('npm -g list --json', {
                        silent: true
                    }).output;
                    // Parse a json string to JSON object
                    var modules = JSON.parse(modulesStr);
                    // Storage for a modules list
                    var moduleStorage = [];
                    // Get primary modules only
                    _.each(modules.dependencies, function(val, key) {
                        if (key !== 'npm') {
                            moduleStorage.push({
                                name: key,
                                version: val.version
                            });
                        }
                    });
                    // Save modules
                    liv.updateModules(moduleStorage);
                }
            });
        });

    /*
     * Liv updateModules
     */

    program
        .command('monitor')
        .description('Save global npm modules in a background process'.white)
        .action(function() {
            setInterval(function() {
                var modulesStr = shell.exec('npm -g list --json', {
                    silent: true
                }).output;
                // Parse a json string to JSON object
                var modules = JSON.parse(modulesStr);
                // Storage for a modules list
                var moduleStorage = [];
                // Get primary modules only
                _.each(modules.dependencies, function(val, key) {
                    if (key !== 'npm') {
                        moduleStorage.push({
                            name: key,
                            version: val.version
                        });
                    }
                });
                // Save modules
                liv.updateModules(moduleStorage);
            }, program.time || 900000);
        });

    /*
     * Liv modules
     */
    program
        .command('install [module]')
        .description('Install modules'.white)
        .action(function(module) {
            var prompts = [{
                type: "confirm",
                message: "You want to install your global npm modules?",
                name: "confirmInstall",
                default: false
            }];
            liv.prompt(prompts, function(answers) {
                if (answers.confirmInstall) {
                    liv.getModules(function(list) {
                        if (program.all) {
                            shell.exec('npm install -g ' + list.all);
                        } else {
                            if (module) {
                                var selectedModules = _.filter(list.modules, function(val) {
                                    var regexp = new RegExp(module, 'g');
                                    return regexp.test(val);
                                });
                                shell.exec('npm install -g ' + selectedModules.toString());
                            } else {
                                debug('Enter a name of module to install', 'error');
                            }
                        }
                    });
                }
            });
        });

}

/*
 * Liv on help ption show examples
 */

program.on('--help', function() {
    console.log('  Examples:');
    console.log('');
    console.log('    $ liv signup');
    console.log('    $ liv login');
    console.log('    $ liv forgot');
    console.log('    $ liv logout');
    console.log('');
});

/*
 * Liv Process Parser
 */

program.parse(process.argv);

/*
 * Liv Default Action
 */

var notifier = updateNotifier({
    packageName: pkg.name,
    packageVersion: pkg.version
});

if (notifier.update) {
    notifier.notify(true);
}

if (process.argv.length == 2) {
    banner();
    program.help();
}
