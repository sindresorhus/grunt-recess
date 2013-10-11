'use strict';
module.exports = function (grunt) {
	grunt.initConfig({
		recess: {
			compile: {
				options: {
					compile: true
				},
				files: {
					'test/main.css': ['test/fixtures/valid.less']
				}
			},
			checkstyle: {
				options: {
					report: {
						reporter: 'checkstyle',
						output: 'test/checkstyle/report.xml',
						mapping: 'test/fixtures/recess-checkstyle.json'
					}
				},
				src: ['test/fixtures/valid.less', 'test/fixtures/valid.css', 'test/fixtures/invalid.css'],
				dest: 'test/checkstyle/referencable.css'
			},
			pass: {
				files: {
					src: [
						'test/fixtures/valid.less',
						'test/fixtures/valid.css'
					]
				}
			},
			fail: {
				files: {
					src: [
						'test/fixtures/invalid.css'
					]
				}
			}
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'tasks/**/*.js',
				'tests/**/*.js'
			]
		}
	});

	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['jshint', 'recess']);
};
