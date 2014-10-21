'use strict';

module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-banner');

	var credits = '/*\n' +
				  ' * <%= pkg.name %>\n' +
				  ' * <%= pkg.description %>\n' +
				  ' * @author <%= pkg.author %>\n' +
				  ' * @version <%= pkg.version %>\n' +
				  ' * License: <%= pkg.license %>\n' +
				  ' */\n';

	grunt.initConfig({
		usebanner: {
			inc: {
				options: {
					position: 'top',
					banner: credits,
					linebreak: true
				},
				files: {
					src: [
						'<%= project.app %>/combined.*',
						'<%= project.css %>/style.*'
					]
				}
			}
		},
		pkg: grunt.file.readJSON('package.json'),
		project: {
			app: ['app'],
			assets: ['<%= project.app %>/assets'],
			css: ['<%= project.assets %>/css'],
			sass: ['<%= project.assets %>/sass'],
			dependencies: ['<%= project.app %>/dependencies'],
			directives: ['<%= project.dependencies %>/directives']
		},
		index: {
			dev: {
				files: {
					js: [
						'<%= project.app %>/app.js',
						'<%= project.dependencies %>/**/**/*.js',
						'<%= project.directives %>/*.js'
					],
					css: ['<%= project.css %>/style.css']
				},
				tasks: 'index:scripts'
			},
			prod: {
				files: {
					js: ['<%= project.app %>/combined.js'],
					css: ['<%= project.css %>/style.min.css']
				},
				tasks: 'index:scripts'
			}
		},
		concat: {
			js: {
				options: {
					separator: ';'
				},
				src: [
					'<%= project.app %>/app.js',
					'<%= project.dependencies %>/**/**/*.js',
					'<%= project.directives %>/*.js'
				],
				dest: '<%= project.app %>/combined.js'
			},
			css: {
				src: ['<%= project.css %>/*.css'],
				dest: '<%= project.css %>/style.css'
			},
			sass: {
				src: ['<%= project.sass %>/*.scss'],
				dest: '<%= project.sass %>/style.scss'
			}
		},
		uglify: {
			options: {
				mangle: false
			},
			js: {
				files: {
					'<%= project.app %>/combined.min.js': ['<%= project.app %>/combined.js']
				}
			}
		},
		cssmin: {
			combine: {
				files: {
					'<%= project.css %>/style.min.css': ['<%= project.css %>/style.css']
				}
			}
		},
		sass: {
		    dev: {
		        options: {
		            style: 'expanded',
		            compass: false
		        },
		        files: {
		        	'<%= project.css %>/style.css':'<%= project.sass %>/style.scss'
		        }
		    }
		},
		clean: {
			js: ["<%= project.app %>/combined.*"],
			css: ['<%= project.css %>/style.*'],
			sass: ['<%= project.sass %>/style.scss']
		},
		watch: {
			prod: { // For production
				files: [
					'<%= project.app %>/*.tpl',
					'<%= project.app %>/views/*.html',
					'<%= project.app %>/views/**/*.html',
					'<%= project.dependencies %>/**/**/*.js',
					'<%= project.directives %>/*.js',
					'<%= project.app %>/app.js',
					'!<%= project.app %>/combined.*',
					'<%= project.sass %>/{,*/}*.{scss,sass}'
				],
				tasks: [
					'clean',
					'concat',
					'sass',
					'uglify',
					'cssmin',
					'index:prod',
					'usebanner:inc'
				],
				options: {
					livereload: true
				}
			},
			dev: { // For development
				files: [
					'<%= project.app %>/*.tpl',
					'<%= project.app %>/views/*.html',
					'<%= project.app %>/views/**/*.html',
					'<%= project.dependencies %>/**/**/*.js',
					'<%= project.directives %>/*.js',
					'<%= project.app %>/app.js',
					'!<%= project.app %>/combined.*',
					'<%= project.sass %>/{,*/}*.{scss,sass}'
				],
				tasks: [
					'clean',
					'concat',
					'sass',
					'index:dev'
				],
				options: {
					livereload: true
				}
			}
		}
	});

	grunt.registerMultiTask('index', 'Create index.html', function() {
		var scriptfiles = grunt.file.expand(this.data.files.js) || grunt._watch_changed_files;
		var cssfiles = grunt.file.expand(this.data.files.css) || grunt._watch_changed_files;
		var now = new Date().getTime();
		var scripts_str = '';
		var css_str = '';
		var tpl = grunt.file.read('app/index.html.tpl');

		scriptfiles.forEach(function(file) {
			file = file.replace(/^app\//, '');
			scripts_str += '\n\t<script src="' + file + '?disablecache=' + now + '"></script>';
		});

		cssfiles.forEach(function(file) {
			file = file.replace(/^app\//, '');
			css_str += '\n\t<link rel="stylesheet" href="' + file + '?disablecache=' + now + '" type="text/css">';
		});

		grunt.file.write('app/index.html', grunt.template.process(tpl, {
			data: {
				scripts: scripts_str,
				css: css_str
			}
		}))
		console.log('File "index.html" created.');
	});

	grunt.registerTask('default', [
		'watch'
	]);
}