'use strict';
var _ = require('lodash');
var chalk = require('chalk');

var defaults = {
	noIDs: 'error',
	noJSPrefix: 'error',
	noOverqualifying: 'warning',
	noUnderscores: 'error',
	noUniversalSelectors: 'warning',
	Parse: 'error',
	prefixWhitespace: 'ignore',
	strictPropertyOrder: 'info',
	zeroUnits: 'info',
	defaultError: 'warning'
};

/**
 * Creates a new instance of CheckstyleReporter. CheckstyleReporter provides an API to
 * generate a checkstyle.xml report file from RECESS error objects.
 * @param {Object} options Options for the reporter
 */
function CheckstyleReporter(options) {
	this.options = _.extend({}, defaults, options);
	this.report = '';
}

CheckstyleReporter.prototype = {
	constructor: CheckstyleReporter,

	/**
	 * Starts a checkstyle report.
	 */
	startReport: function () {
		this.report = '<?xml version="1.0" encoding="UTF-8"?>\n';
		this.report += '<checkstyle version="4.0.0">\n';
	},

	/**
	 * Ends a checkstyle report and returns XML as string.
	 * @return {String} XML of checkstyle report
	 */
	endReport: function () {
		this.report += '</checkstyle>\n';
		return this.report;
	},

	/**
	 * Starts reporting errors of a source file.
	 * @param {String} srcFile Filename of .less or .css source file
	 */
	startFile: function (srcFile) {
		this.report += '<file name="' + srcFile + '">\n';
	},

	/**
	 * Ends reporting errors of a source file.
	 */
	endFile: function () {
		this.report += '</file>\n';
	},

	/**
	 * Logs an error of the current source file.
	 * @param {Object} err RECESS error object
	 */
	logError: function (err) {
		var mappedErr = this.translate(err);
		this.report += '<error line="' + mappedErr.line + '"' + ' column="' + mappedErr.column + '"' + ' severity="' +
			mappedErr.severity + '"' + ' message="' + _.escape(mappedErr.message) + '"' + ' source="' +
			_.escape(mappedErr.source) + '"/>\n';
	},

	/**
	 * Translates a RECESS error object to a checkstyle-compatible error object.
	 * @param {Object} err RECESS error object
	 * @return {Object} Checkstyle error object with properties 'line', 'column', 'severity', 'source', and 'message'
	 */
	translate: function (err) {
		return {
			line: err.line || (chalk.stripColor(err.extract).match(/^\s*(\d+)/))[1] || 0,
			column: err.column || 0,
			severity: this.options[err.type] || this.options.defaultError,
			source: 'recess.' + err.type,
			message: chalk.stripColor(err.message.stripColors) + chalk.stripColor(err.extract) ? chalk.stripColor(err.extract) : ''
		};
	},

	/**
	 * Flush the report to stdout
	 */
	flush: function () {
		console.log(this.report);
	}
};

module.exports = CheckstyleReporter;
