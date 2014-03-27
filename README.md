# Liv [![Build Status](https://secure.travis-ci.org/chrisenytc/liv.png?branch=master)](http://travis-ci.org/chrisenytc/liv) [![NPM version](https://badge-me.herokuapp.com/api/npm/liv.png)](http://badges.chrisenytc.com/for/npm/liv) [![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/chrisenytc/liv/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

> A CLI tool for save and manage your global npm modules

## Getting Started
Install the module with: `npm install -g liv`

```javascript
var Liv = require('liv');
//Create new instance of Liv
var api = new Liv('access_token');
```

## Run in a background

To run Liv in monitor mode you have to use the option --time 5000

Example:

```bash
# Time in milliseconds
liv monitor --time 5000 &
```

**INFO**: Without --time the default is 900000 = 15 minutes

## Documentation

#### .prompt(prompts, cb)

**Parameter**: `prompts`
**Type**: `Array`
**Example**: 

```javascript
var prompts = [
{
	type: 'input',
	name: 'name',
	message: 'What\'s your name?'
}, 
{
	type: 'input',
	name: 'email',
	message: 'What\'s your email?'
}];
```

**Parameter**: `cb`
**Type**: `Function`
**Example**:

```javascript
function(answers) {
	
}
```

The 'prompt' method is responsible for asking questions

How to use this method

```javascript
var prompts = [
{
	type: 'input',
	name: 'name',
	message: 'What\'s your name?'
}, 
{
	type: 'input',
	name: 'email',
	message: 'What\'s your email?'
}];

api.prompt(prompts, function(answers) {
	console.log(answers);
}); 
```

#### .signup(name, email, password)

**Parameter**: `name`
**Type**: `String`
**Example**: `myname`


**Parameter**: `email`
**Type**: `String`
**Example**: `example@example.com`


**Parameter**: `password`
**Type**: `String`
**Example**: `123456test`


The 'signup' method is responsible for create accounts

How to use this method

```javascript

api.signup('myname', 'email', '123456test');
```

#### .login(email, password)


**Parameter**: `email`
**Type**: `String`
**Example**: `example@example.com`


**Parameter**: `password`
**Type**: `String`
**Example**: `123456test`


The 'login' method is responsible to login in accounts

How to use this method

```javascript

api.login('email', '123456test');
```

#### .forgot(email)


**Parameter**: `email`
**Type**: `String`
**Example**: `example@example.com`


The 'forgot' method is responsible for reset passwords

How to use this method

```javascript

api.forgot('example@example.com');
```

#### .me(pureJson)


**Parameter**: `pureJson`
**Type**: `Boolean`
**Example**: `true`


The 'me' method is responsible for showing profile info

How to use this method

```javascript

api.me(true);
```

#### .updateMe(name, email, password)

**Parameter**: `name`
**Type**: `String`
**Example**: `myname`


**Parameter**: `email`
**Type**: `String`
**Example**: `example@example.com`


**Parameter**: `password`
**Type**: `String`
**Example**: `123456test`

The 'updateMe' method is responsible for update profile info

How to use this method

```javascript

api.updateMe('myname', 'email', '123456test');
```

#### .deleteMe()

The 'deleteMe' method is responsible for delete profile info

How to use this method

```javascript

api.deleteMe();
```

#### .modules(pureJson)


**Parameter**: `pureJson`
**Type**: `Boolean`
**Example**: `true`


The 'modules' method is responsible for list all modules

How to use this method

```javascript

api.modules(true);
```

#### .getModules(cb)


**Parameter**: `cb`
**Type**: `Function`
**Example**: `function(list) {}`


The 'getModules' method is responsible for return all modules

How to use this method

```javascript

api.getModules(function(list) {
	console.log(list.all); // All modules in a string
	console.log(list.modules); // All modules in a array
});
```

#### .updateModules(modules)


**Parameter**: `modules`
**Type**: `Array`
**Example**: `[{name: '', version: ''}]`


The 'updateModules' method is responsible for update modules

How to use this method

```javascript

api.updateModules([{name: 'liv', version: '0.1.0'}]);
```

## Contributing

See the [CONTRIBUTING Guidelines](CONTRIBUTING.md)

## Support
If you have any problem or suggestion please open an issue [here](https://github.com/chrisenytc/liv/issues).

## License

The MIT license

Copyright 2014, Christopher EnyTC

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
