'use strict';

var _ = require('lodash'),
	chalk = require('chalk');

var padLine;

padLine = function(line)
{
	var num = line + '. ';
	var space = '';

	_.times(10 - num.length, function () {
		space += ' ';
	});

	return chalk.gray(space + num);
};

module.exports = padLine;
