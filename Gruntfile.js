module.exports = function(grunt) {
	// require("colors");
	// // show elapsed time at the end  
	// require('time-grunt')(grunt);  
	// // load all grunt tasks  
	// require('load-grunt-tasks')(grunt);  
	// grunt.loadNpmTasks('grunt-contrib-less');
	// grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.initConfig({
		jsdoc: {
			dist: {
				src: ['logic/**/*.js'],
				options: {
					destination: 'doc'
				}
			}
		}
	});



	grunt.registerTask('serve', function() {
		grunt.task.run([
			'jsdoc'
		]);
	});

	grunt.registerTask('default', ['serve']);

	grunt.registerTask('jsdoc', ['jsdoc']);
};