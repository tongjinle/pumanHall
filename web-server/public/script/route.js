define(["app",
	"angularRoute",
	'ctrl-platformpage',
	'ctrl-hallpage',
	'ctrl-testpage'
	],
	function(app){
		var initRoute = function(){		
			app.config(["$routeProvider",function($routeProvider){
				$routeProvider
					.when("/",{
						templateUrl:"view/platformpage.html",
						controller:"platformpageCtrl"
					})
					.when("/platform",{
						templateUrl:"view/platformpage.html",
						controller:"platformpageCtrl"
					})
					.when("/hall/:hallName/:username",{
						templateUrl:"view/hallpage.html",
						controller:"hallpageCtrl"
					})
					.when("/test",{
						templateUrl:"view/testpage.html",
						controller:"testpageCtrl"
					})
					.otherwise({
						redirectTo:"/"
					});
			}]);
	
		};
		return {init:initRoute};
	}
);
