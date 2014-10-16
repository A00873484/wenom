'use strict';


module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.initConfig({
		index: {
			files: [
				'app/app.js',
				'app/dependencies/**/**/*.js',
				'app/directives/*.js'
			],
			tasks: 'index:scripts'
		},
		pkg: grunt.file.readJSON('package.json'),
		project: {
			app: ['app'],
			assets: ['<%= project.app %>/assets'],
			css: ['<%= project.assets %>/sass/style.scss']
		},
		sass: {
		    dev: {
		        options: {
		            style: 'expanded',
		            compass: false
		        },
		        files: {
		            '<%= project.assets %>/css/style.css':'<%= project.css %>'
		        }
		    }
		},
		watch: {
		    sass: {
		        files: '<%= project.assets %>/sass/{,*/}*.{scss,sass}',
		        tasks: ['sass:dev']
		    }
		}
	});

	grunt.registerMultiTask('index', 'Create index.html',
		function() {        
			var files = grunt._watch_changed_files || grunt.file.expand(this.data);
			var now = new Date().getTime();
			var scripts_str = '';
			var tpl = grunt.file.read('app/index.html.tpl');

			files.forEach(function(file) {
				file = file.replace(/^app\//, '');
				scripts_str += '\n\t<script src="' + file + '?disablecache=' + now + '"></script>';
			});   

			grunt.file.write('app/index.html', grunt.template.process(tpl, {
				data: {
					scripts: scripts_str
				}
			}))
			console.log('File "index.html" created.');

		});

	grunt.registerTask('default', [
		'index:files',
		'watch'
	]);
}