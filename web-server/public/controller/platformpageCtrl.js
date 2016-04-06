define([
	'app',
	'underscore',
	'directive-platform',
	'directive-hall',
	'directive-chat'
],function(app){
	app.controller('platformpageCtrl',["$scope",function($scope){
		$scope.partName = 'platform';

		$scope.listen = function(){
			$scope.$on('changePart',function(e,args){
				var part =args.part;
				$scope.partName = part;

				if(part == 'hall'){
					var params = _.pick(args,'hallName','username');
					$scope.$broadcast('hall.setMeta',params);
				}
			});
		};

		$scope.listen();
	}]);
});