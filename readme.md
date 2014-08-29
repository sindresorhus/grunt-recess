# grunt-recess [![Build Status](https://travis-ci.org/sindresorhus/grunt-recess.svg?branch=master)](https://travis-ci.org/sindresorhus/grunt-recess)

> Lint and minify CSS and LESS using [RECESS](https://github.com/twitter/recess)

*Issues with the output should be reported on the RECESS [issue tracker](https://github.com/twitter/recess/issues).*


## Install

```sh
$ npm install --save-dev grunt-recess
```


## Usage

### Lint

```js
require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

grunt.initConfig({
	recess: {
		dist: {
			src: ['src/main.css']
		}
	}
});

grunt.registerTask('default', ['recess']);
```

### Lint and compile

```js
recess: {
	dist: {
		options: {
			compile: true
		},
		files: {
			'dist/main.css': 'src/main.less'
		}
	}
}
```

A destination is only needed when `compile: true`. It won't output any warnings in this mode.
You can also specify `.less` files and they will be compiled.


## Options

```js
// Default
compile: false 				// Compiles CSS or LESS. Fixes white space and sort order.
compress: false				// Compress your compiled code
noIDs: true					// Doesn't complain about using IDs in your stylesheets
noJSPrefix: true			// Doesn't complain about styling .js- prefixed classnames
noOverqualifying: true		// Doesn't complain about overqualified selectors (ie: div#foo.bar)
noUnderscores: true			// Doesn't complain about using underscores in your class names
noUniversalSelectors: true	// Doesn't complain about using the universal * selector
prefixWhitespace: true		// Adds whitespace prefix to line up vender prefixed properties
strictPropertyOrder: true	// Complains if not strict property order
zeroUnits: true				// Doesn't complain if you add units to values of 0
includePath: mixed			// Additional paths to look for `@import`'ed LESS files.  Accepts a string or an array of strings.
```


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
