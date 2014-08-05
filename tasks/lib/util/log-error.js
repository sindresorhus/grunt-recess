'use strict';
var grunt = require('grunt');
var chalk = require('chalk' );
var padLine = require('./pad-line');

var logError = function (err) {
	// RECESS doesn't log errors when `compile: true`
	// Duplicate its error logging style
	if (err.type === 'Parse') {
		// parse error
		grunt.log.error(chalk.red('Parser error') + (err.filename ? ' in ' + chalk.yellow(err.filename) : '') + '\n');
	} else {
		// other exception
		grunt.log.error((err.name ? chalk.red(err.name) + ': ' : '') + err.message +
			(err.filename ? ' in ' + chalk.yellow(err.filename) : '') + '\n');
	}

	// if extract - then log it
	if (err.extract) {
		err.extract.forEach(function (line, index) {
			grunt.log.error(padLine(err.line + index) + line);
		});
	}

	grunt.warn('');
};

module.exports = logError;
