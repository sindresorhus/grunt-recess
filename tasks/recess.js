/*
 * grunt-recess
 * 0.1.0 - 2012-05-06
 * github.com/sindresorhus/grunt-recess
 *
 * (c) Sindre Sorhus
 * sindresorhus.com
 * MIT License
 */
module.exports = function( grunt ) {
	'use strict';

	grunt.registerMultiTask('recess', 'Grunt plugin to lint and minify CSS or LESS.', function() {
		var recess = require('recess'),
			lf = grunt.utils.linefeed,
			done = this.async(),
			files = grunt.file.expandFiles( this.file.src ),
			dest = this.file.dest,
			options = this.data.options || {},
			compress = options.compress,
			separator = compress ? '' : lf + lf;

		recess( files, options, function( err, data ) {
			var min = [],
				max = [];

			// RECESS returns an object when passed a single file,
			// and a array of objects when passed multiple files
			data = Array.isArray( data ) ? data : [ data ];

			if ( err ) {
				grunt.fail.fatal( err );
			}

			data.forEach(function( item ) {
				if ( item.errors.length ) {
					grunt.fail.warn( item.errors.join('') );
				}

				if ( item.options.compile ) {
					min.push( item.output );
					max.push( item.data );
				// Extract status and check
				} else if ( item.output[1].indexOf('Perfect!') === -1 ) {
					grunt.fail.warn( lf + item.output.join( lf ) );
				} else {
					grunt.log.writeln( item.output.join( lf ) );
				}
			});

			if ( min.length ) {
				if ( dest ) {
					// Concat files
					var css = min.reverse();
					grunt.file.write( dest, css.join( separator ) );
					grunt.log.writeln( 'File "' + dest + '" created.' );
					if ( compress ) {
						grunt.helper( 'min_max_info', min.join( separator ), max.join( separator ) );
					}
				} else {
					grunt.fail.fatal('No destination specified. This is required when enabling options.compile.');
				}
			}

			done();
		});
	});

};