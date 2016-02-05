module.exports = function(grunt) {
	// require("colors");
	// // show elapsed time at the end  
	// require('time-grunt')(grunt);  
	// // load all grunt tasks  
	require('load-grunt-tasks')(grunt);  
	// grunt.loadNpmTasks('grunt-contrib-less');
	// grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.initConfig({
		jsdoc : {
		    dist : {
		        src: ['src/**/*.js', 'README.md'],
		        options: {
		            destination: 'doc',
		            template : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
		            configure : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json"
		        }
		    }
		}
	});



	grunt.registerTask('serve', function() {
		console.log('jsdoc start');
		// grunt.task.run([
		// 	'jsdoc'
		// ]);
		console.log('jsdoc end');
	});

	grunt.registerTask('default', ['serve']);

	grunt.registerTask('jsdoc', ['jsdoc']);
};