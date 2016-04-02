define(["app",
	"angularRoute",
	'ctrl-platformpage',
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
