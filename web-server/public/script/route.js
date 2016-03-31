define(["app",
	"angularRoute",
	'ctrl-platformpage'
	],
	function(app){
		var initRoute = function(){		
			app.config(["$routeProvider",function($routeProvider){
				$routeProvider
					.when("/",{
						templateUrl:"view/platformpage.html",
						controller:"platformpageCtrl"
					})

					.otherwise({
						redirectTo:"/"
					});
			}]);
	
		};
		return {init:initRoute};
	}
);
