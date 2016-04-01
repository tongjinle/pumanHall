define(['app'],function(app){
	app.directive('platform',[function(){
		return {
			restrict:'E',
			templateUrl:'./directive/html/platform.html',
			link:function($scope,$element,$attrs){

			}
		};
	}]);
});