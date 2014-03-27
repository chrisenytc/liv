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

var fs = require('fs');

/**
@class Helpers
 */

/*
 * Private Methods
 */

/*
 * Public Methods
 */

/**
 * Method responsible for check if path exists
 *
 * @example
 *
 *     helpers.exists('./ully');
 *
 * @method exists
 * @public
 * @param {String} path File path of archive
 * @return {String} Returns true if file exists
 */

exports.exists = function exists(path) {
    return fs.existsSync(path);
};

/**
 * Method responsible for reading files and get content
 *
 * @example
 *
 *     helpers.read('./ully');
 *
 * @method read
 * @public
 * @param {String} fillepath File path of archive
 * @return {String} Returns file content
 */

exports.read = function readFile(filepath) {
    //Read and return this file content
    return fs.readFileSync(filepath, 'utf-8');
};

/**
 * Method responsible for writing files
 *
 * @example
 *
 *     helpers.write('./ully', 'string data');
 *
 * @method write
 * @public
 * @param {String} fillepath File path of archive
 * @param {String} data Data of file
 */

exports.write = function writeFile(filepath, data) {
    //Read and return this file content
    fs.writeFileSync(filepath, data);
};

/**
 * Method responsible for demove files
 *
 * @example
 *
 *     helpers.remove('./ully');
 *
 * @method remove
 * @public
 * @param {String} path File path of archive
 */

exports.remove = function remove(path) {
    fs.unlinkSync(path);
};

/**
 * Method responsible for demove directories
 *
 * @example
 *
 *     helpers.rm('./ully');
 *
 * @method rm
 * @public
 * @param {String} path File path of directory
 */

exports.rm = function rm(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file) {
            var curPath = path + '/' + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                exports.rm(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

/**
 * Method responsible for check if path is a file
 *
 * @example
 *
 *     helpers.isFile('./ully');
 *
 * @method isFile
 * @public
 * @param {String} path File path of archive
 * @return {String} Returns true if path is file
 */

exports.isFile = function isFile(path) {
    var f = fs.stat(path);
    return f.isFile();
};

/**
 * Method responsible for check if path is a directory
 *
 * @example
 *
 *     helpers.isDir('./ully');
 *
 * @method isDir
 * @public
 * @param {String} path File path of archive
 * @return {String} Returns true if path is directory
 */

exports.isDir = function isDir(path) {
    var f = fs.stat(path);
    return f.isDirectory();
};
