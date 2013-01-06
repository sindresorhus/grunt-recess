'use strict';
module.exports = function (grunt) {
	grunt.initConfig({
		recess: {
			pass: {
				src: [
					'test/fixtures/valid.less',
					'test/fixtures/valid.css'
				]
			},
			fail: {
				src: [
					'test/fixtures/invalid.css'
				]
			}
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'tasks/*.js',
				'tests/*.js'
			]
		}
	});

	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['jshint', 'recess:pass', 'recess:fail']);
};
