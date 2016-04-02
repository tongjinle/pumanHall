requirejs.config({
	//默认情况下模块所在目录为js/lib
	baseUrl: './',
	//当模块id前缀为app时，他便由js/app加载模块文件
	//这里设置的路径是相对与baseUrl的，不要包含.js
	paths: {
		angular: 'bower_components/angular/angular',
		angularRoute:"bower_components/angular-route/angular-route",

		underscore:"bower_components/underscore/underscore",
		async:"bower_components/async/dist/async.min",

		//
		route:"script/route",
		app:"script/app",
		
		// service
		// "service-goods":"service/script/goods",

		// ctrl
		"ctrl-platformpage":"controller/platformpageCtrl",
		"ctrl-testpage":"controller/testpageCtrl",

		// directive
		"directive-platform":"directive/script/platform",

		// end tail
		"jquery":"bower_components/jquery/dist/jquery.min"
	},
	shim:{
		'angularRoute':["angular"]
	}
 
});

// 开始逻辑.
requirejs(['jquery','route','app'],function($,route,app){
	route.init();
	$(function(){
		angular.bootstrap(document.body,[app.name]);
	});
});
