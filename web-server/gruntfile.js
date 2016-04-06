module.exports = function (grunt) {  
	require("colors");
	// show elapsed time at the end  
	require('time-grunt')(grunt);  
	// load all grunt tasks  
	require('load-grunt-tasks')(grunt);  
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	// grunt.loadNpmTasks('grunt-jsdoc');

	grunt.initConfig({  
		watch: {  
			livereload: {  
				options: {  
					livereload: '<%= connect.options.livereload %>'    
				},  
				files: [
					'public/**/*.html',
					'public/css/bundle.css',
					'public/js/**/*.js', 
					'public/script/**/*.js', 
					'public/controller/**/*.js', 
					'public/filter/**/*.js', 
					'public/directive/script/**/*.js'
				]  
			},
			less:{
				files:[
					'public/less/**/*.less',
					'public/directive/less/**/*.less'
				],
				tasks:["less"]
			}
		},
		less:{
			dev:{
				files:{
					// "css/bundle.css":["less/**/*.less","directive/less/**/*.less"]
					'public/css/bundle.css':'<%= watch.less.files %>'
				}
			}
		},
		connect: {  
			options: {  
				port: 9001,  
				livereload: 35731,  
				// change this to '0.0.0.0' to access the server from outside  
				hostname: 'localhost'  
			},  
			livereload: {  
				options: {  
					open: 'http://<%= connect.options.hostname %>:<%= connect.options.port %>/public/index.html',  
				}  
			}
		}
	});  


	grunt.registerTask('compile',function(){
		grunt.task.run([
			'less'
		]);
	});
  
	grunt.registerTask('serve', function () {  
		grunt.task.run([  
			'compile',  
			'connect:livereload',  
			'watch'
		]);  
	});  

  
	grunt.registerTask('default', ['serve']);  
};  