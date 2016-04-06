define([
	'app',
	'underscore'
	],function(app,_){
	app.directive('hall',['$routeParams',function($routeParams){
		return {
			restrict:'E',
			templateUrl:'./directive/html/hall.html',
			link:function($scope,$element,$attrs){
				$scope.username = $routeParams.username;
				$scope.hallName = $routeParams.hallName;
				$scope.userList = null;
				$scope.roomList = null;
				
				// chat
				$scope.reciver = null;
				$scope.content = null;


				// query info of hall
				$scope.getInfo = function(){
					pomelo.request('hall.hallHandler.getInfo',function(data){

					});
				};

				$scope.chat = function(reciver,content){
					var route = 'hall.hallHandler.chat';
					var msg = {
						reciver:$scope.reciver,
						content:$scope.content
					};
					pomelo.request(route,msg,function(data){
					});
				};

				// init chat
				$scope.initChat = function(){
					var username = $scope.username;
					var chatName = $scope.hallName;
					$scope.$broadcast('chat.setUsername',{name:chatName,username:username});
				};

				// listen
				$scope.listen = function(){
					////////////////////////////////////////////////////////////////////////////////
					// on
					////////////////////////////////////////////////////////////////////////////////
					$scope.$on('chat.send',function(e,args){
						var chatName = $scope.hallName;
						var name = args.name;
						if(name!=chatName){return;};

						var reciver = args.reciver;
						var content = args.content;
						$scope.chat(reciver,content);
					});	

					////////////////////////////////////////////////////////////////////////////////
					// watch
					////////////////////////////////////////////////////////////////////////////////
					$scope.$watch('userList.length',function(){
						var mates = _.map($scope.userList,function(n){return n.name;});
						var chatName = $scope.hallName;
						$scope.$broadcast('chat.setMates',{name:chatName,mates:mates});
					});

					////////////////////////////////////////////////////////////////////////////////
					// pomelo on
					////////////////////////////////////////////////////////////////////////////////

					pomelo.on('hall.chat',function(chat){
						var chatName = $scope.hallName;
						$scope.$broadcast('chat.afterSend',{
							name:chatName,
							chat:chat
						});

						$scope.$apply();
					});
				};

				$scope.listen();

				$scope.initChat();

				$scope.getInfo();
			}
		};
	}]);
});