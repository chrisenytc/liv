/*
 * liv
 * https://github.com/chrisenytc/liv
 *
 * Copyright (c) 2014 Christopher EnyTC
 * Licensed under the MIT license.
 */

'use strict';

/*
 * Module Dependencies
 */

var request = require('superagent');
var inquirer = require('inquirer');
var debug = require('./debugger.js');
var async = require('async');
var _ = require('underscore');
var h = require('./helpers.js');
var pj = require('prettyjson').render;
var join = require('path').join;

/*
 * Private Methods
 */

function response(err, res, pureJson, message, type) {
    if (err) {
        throw err;
    }
    if (res) {
        if (!pureJson) {
            console.log('\n[ ' + 'Response'.green.bold + ' ] ==> ');
            console.log();
            console.log(pj(res.body));
        } else {
            console.log(JSON.stringify(res.body, null, 4));
        }
    }
    if (message && type) {
        debug(message, type);
    }
    if (message && !type) {
        debug(message);
    }
}

/*
 * Public Methods
 */

/**
 * @class Liv
 *
 * @constructor
 *
 * Constructor responsible for provide api requests
 *
 * @example
 *
 *     var api = new Liv('access_token');
 *
 * @param {String} access_token Access Token
 */

var Liv = module.exports = function Liv(token) {
    //Access Token
    this.access_token = token;
    //apiUri
    this.uri = 'https://livia.herokuapp.com';
    var apiUri = 'https://livia.herokuapp.com/:path';
    //Get handler
    this.get = function(path, cb) {
        request
            .get(apiUri.replace(new RegExp(':path', 'g'), path).replace(new RegExp(':token', 'g'), 'access_token=' + this.access_token))
            .set('Accept', 'application/json')
            .end(cb);
    };
    //Post handler
    this.post = function(path, body, cb) {
        request
            .post(apiUri.replace(new RegExp(':path', 'g'), path).replace(new RegExp(':token', 'g'), 'access_token=' + this.access_token))
            .send(body)
            .set('Accept', 'application/json')
            .end(cb);
    };
    //Put handler
    this.put = function(path, body, cb) {
        request
            .put(apiUri.replace(new RegExp(':path', 'g'), path).replace(new RegExp(':token', 'g'), 'access_token=' + this.access_token))
            .send(body)
            .set('Accept', 'application/json')
            .end(cb);
    };
    //Delete handler
    this.delete = function(path, body, cb) {
        request
            .del(apiUri.replace(new RegExp(':path', 'g'), path).replace(new RegExp(':token', 'g'), 'access_token=' + this.access_token))
            .send(body)
            .set('Accept', 'application/json')
            .end(cb);
    };
};

//HandlerExceptions
process.on('uncaughtException', function(err) {
    console.log();
    console.error(err.stack);
    console.error(err);
});

/**
 * Method responsible for asking questions
 *
 * @example
 *
 *     api.prompt(prompts, cb);
 *
 * @method prompt
 * @public
 * @param {Object} prompts Array of prompt options
 * @param {Function} cb A callback
 */

Liv.prototype.prompt = function prompt(prompts, cb) {
    inquirer.prompt(prompts, function(answers) {
        cb(answers);
    });
};

/**
 * Method responsible for create accounts
 *
 * @example
 *
 *     api.signup('name', 'email', 'password');
 *
 * @method signup
 * @public
 * @param {String} name Name
 * @param {String} email Email
 * @param {String} password Password
 */

Liv.prototype.signup = function signup(name, email, password) {
    this.post('signup', {
        name: name,
        email: email,
        password: password
    }, function(err, res) {
        if (err) {
            response(err);
        }
        response(null, res);
    });
};

/**
 * Method responsible for login in accounts
 *
 * @example
 *
 *     api.login('email', 'username', 'password');
 *
 * @method login
 * @public
 * @param {String} email Email
 * @param {String} password Password
 */

Liv.prototype.login = function login(email, password) {
    this.post('signin', {
        email: email,
        password: password
    }, function(err, res) {
        if (err) {
            response(err);
        }
        //Write config
        if (res.body.token && res.body.roles) {
            h.write(join(__dirname, 'livConfig.json'), JSON.stringify(res.body, null, 4));
            response(null, null, null, 'Logged successfully!', 'success');
        } else {
            response(null, null, null, 'Login failed. Try again!', 'error');
        }
    });
};

/**
 * Method responsible for reset passwords
 *
 * @example
 *
 *     api.forgot('email');
 *
 * @method forgot
 * @public
 * @param {String} email Email
 */

Liv.prototype.forgot = function forgot(email) {
    this.post('forgot', {
        email: email
    }, function(err, res) {
        if (err) {
            response(err);
        }
        response(null, res);
    });
};

/**
 * Method responsible for showing the status of api
 *
 * @example
 *
 *     api.status();
 *
 * @method status
 * @public
 * @param {Boolean} pureJson If true show json raw
 */

Liv.prototype.status = function status(pureJson) {
    this.get('status', function(err, res) {
        if (err) {
            response(err);
        }
        response(null, res, pureJson);
    });
};

/**
 * Method responsible for showing profile info
 *
 * @example
 *
 *     api.me();
 *
 * @method me
 * @public
 * @param {Boolean} pureJson If true show json raw
 */

Liv.prototype.me = function me(pureJson) {
    this.get('me?:token', function(err, res) {
        if (err) {
            response(err);
        }
        var obj = {
            body: _.pick(res.body, ['name', 'email', 'status'])
        }
        response(null, obj, pureJson);
    });
};

/**
 * Method responsible for update profile info
 *
 * @example
 *
 *     api.updateMe('name', email', 'password');
 *
 * @method updateMe
 * @public
 * @param {String} name Name
 * @param {String} email Email
 * @param {String} password Password
 */

Liv.prototype.updateMe = function updateMe(name, email, password) {
    var meObj = {
        name: name,
        email: email,
        password: password
    };
    this.put('me?:token', meObj, function(err, res) {
        if (err) {
            response(err);
        }
        response(null, null, null, res.body.message);
    });
};

/**
 * Method responsible for delete profile info
 *
 * @example
 *
 *     api.deleteMe();
 *
 * @method deleteMe
 * @public
 */

Liv.prototype.deleteMe = function deleteMe() {

    this.delete('me?:token', null, function(err, res) {
        if (err) {
            response(err);
        }
        if (h.exists(__dirname + '/livConfig.json')) {
            h.remove(__dirname + '/livConfig.json');
        }
        response(null, null, null, res.body.message);
    });
};

/**
 * Method responsible for list all modules
 *
 * @example
 *
 *     api.modules();
 *
 * @method modules
 * @public
 * @param {Boolean} pureJson If true show json raw
 */

Liv.prototype.modules = function modules(pureJson) {
    this.get('modules?:token', function(err, res) {
        if (err) {
            response(err);
        }
        if (res.body.length < 1) {
            console.log('  You don\'t have modules. \n  Upload your modules.\n' + '\n  $ liv save'.bold.white);
            process.exit();
        }
        response(null, res, pureJson);
    });
};

/**
 * Method responsible for return a list of all modules
 *
 * @example
 *
 *     api.getModules();
 *
 * @method getModules
 * @public
 * @param {Function} cb A callback
 */

Liv.prototype.getModules = function getModules(cb) {
    this.get('modules?:token', function(err, res) {
        if (err) {
            response(err);
        }
        var modulesList = {};
        modulesList.modules = [];
        _.each(res.body.modules, function(val, key) {
            modulesList.modules.push(val.name + '@' + val.version);
        });
        modulesList.all = modulesList.modules.join(' ');
        cb(modulesList);
    });
};

/**
 * Method responsible for update modules
 *
 * @example
 *
 *     api.updateModules([{name: '', version: ''}]);
 *
 * @method updateModules
 * @public
 * @param {Array} modules A array with modules
 */

Liv.prototype.updateModules = function updateModules(modules) {
    var modulesObj = {
        modules: modules
    };
    this.put('modules?:token', modulesObj, function(err, res) {
        if (err) {
            response(err);
        }
        response(null, res);
    });
};
