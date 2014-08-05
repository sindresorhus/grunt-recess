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
			include: {
				options: {
					includePath: 'test/externalDependency'
				},
				files: {
					src: [
						'test/fixtures/include.less'
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
		}
	});

	grunt.loadTasks('tasks');
	grunt.registerTask('default', ['recess']);
};
