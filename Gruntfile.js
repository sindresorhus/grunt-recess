module.exports = function( grunt ) {
	'use strict';

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
		watch: {
			files: '<config:lint.files>',
			tasks: 'default'
		},
		jshint: {
      lint: [
        'grunt.js',
        'tests/**/*.js'
      ],
			options: {
				es5: true,
				esnext: true,
				bitwise: true,
				curly: true,
				eqeqeq: true,
				latedef: true,
				newcap: true,
				noarg: true,
				noempty: true,
				regexp: true,
				undef: true,
				strict: true,
				trailing: true,
				smarttabs: true,
				node: true
			}
		}
	});

	grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask( 'default', ['jshint', 'recess:pass', 'recess:fail'] );

};
