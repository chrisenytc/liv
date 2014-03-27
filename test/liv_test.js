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

var chai = require('chai');
chai.expect();
chai.should();

var Liv = require('../lib/liv.js');
var liv = new Liv('token');

describe('liv module', function() {
    describe('#constructor()', function() {
        it('should be a function', function() {
            Liv.should.be.a("function");
        });
    });
    describe('#instance()', function() {
        it('should be a object', function() {
            liv.should.be.a("object");
        });
    });
});
