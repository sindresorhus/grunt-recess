'use strict';
var recess = require('recess');
var grunt = require('grunt');
var async = require('async');
var maxmin = require('maxmin');
var logError = require('./util/log-error');

var RecessTask = function (task) {
	// Store reference to original task
	this.task = task;

	// Merge task options with defaults
	this.options = task.options(RecessTask.DEFAULT_OPTIONS);
};

/**
 * Default options that will be merged with options specified in
 * the original task.
 *
 * @type {*}
 */
RecessTask.DEFAULT_OPTIONS = {
	banner: '',
	compress: false,
	footer: ''
};

/**
 * @type {string}
 */
RecessTask.TASK_NAME = 'recess';

/**
 * @type {string}
 */
RecessTask.TASK_DESCRIPTION = 'Lint and minify CSS and LESS using RECESS';

/**
 * Static method for registering an instance of the task with Grunt.
 *
 * @param {*} grunt
 */
RecessTask.registerWithGrunt = function (grunt) {
	grunt.registerMultiTask(RecessTask.TASK_NAME, RecessTask.TASK_DESCRIPTION, function () {
		var task = new RecessTask(this);
		task.run();
	});
};

RecessTask.prototype.run = function () {
	var cb = this.task.async();
	var files = this.task.files;
	var options = this.task.options(RecessTask.DEFAULT_OPTIONS);

	var banner = grunt.template.process(options.banner);
	var footer = grunt.template.process(options.footer);
	var reporter = false;

	if (!files.length) {
		grunt.log.writeln('No destinations specified.');
		cb();
		return;
	}

	// hook the reporting in...
	if (options.report && options.report.reporter) {
		reporter = {};
		reporter.proto = require(__dirname + '/reporters/' + options.report.reporter + '.js');
		reporter.mapping = options.report.mapping ? grunt.file.readJSON(options.report.mapping) : {};
		reporter.inst = new reporter.proto(reporter.mapping);
		options.compress = false;
		options.compile = true;
	}

	async.eachSeries(files, function (el, cb2) {
		var dest = el.dest;

		if (!el.src.length) {
			grunt.warn('No existing source files for destination "' + dest + '".');
			cb2();
			return;
		}

		recess(el.src, options, function (err, data) {
			var min = [];
			var max = [];

			if (err) {
				err.forEach(logError);
			}

			if (reporter) {
				reporter.inst.startReport();
			}

			data.forEach(function (item) {
				if (item.options.compile || reporter) {
					min.push(item.output);
					max.push(item.data);
					// Extract status and check
				} else if (item.output[1] && item.output[1].indexOf('Perfect!') !== -1) {
					grunt.log.writeln(item.output.join('\n'));
				} else {
					grunt.warn(item.output.join('\n'));
				}

				if (reporter) {
					reporter.inst.startFile(dest);

					if (item.definitions && item.definitions.length) {
						// loop over definitions to get errors
						item.definitions.forEach(function (definition) {
							if (definition.errors && definition.errors.length) {
								definition.errors.forEach(function (definitionErr) {
									// report that error
									reporter.inst.logError(definitionErr);
								});
							}
						});
					}

					reporter.inst.endFile();
				}
			});

			if (min.length) {
				if (dest) {
					// Concat files
					grunt.file.write(dest, banner + min.join('\n\n') + footer);
					grunt.log.writeln('File "' + dest + '" created.');

					if (options.compress) {
						grunt.log.writeln(maxmin(max.join('\n\n'), min.join('\n\n'), true));
					}
				} else {
					grunt.warn('No destination specified. Required when options.compile is enabled.');
				}
			}

			if (reporter) {
				// Write report to the report file, if wanted
				reporter.inst.endReport();
				if (options.report.output) {
					options.report.outputFile = grunt.template.process(options.report.output);
					options.report.outputDir = require('path').dirname(options.report.outputFile);
					if (!grunt.file.exists(options.report.outputDir)) {
						grunt.file.mkdir(options.report.outputDir);
					}
					grunt.file.write(options.report.outputFile, reporter.inst.report);
					grunt.log.ok('Report "' + options.report.outputFile + '" created.');
				}
			}

			cb2();
		});
	}, function (err) {
		cb(!err);
	});
};

module.exports = RecessTask;
