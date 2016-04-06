define(['app','underscore'],function(app,_){
	app.directive('chat',[function(){
		return {
			restrict:"E",
			scope:{},
			templateUrl:"./directive/html/chat.html",
			link:function  ($scope,$element,$attrs) {
				$scope.name = $attrs.name;

				// '我'
				$scope.username = null;
				// 发送对象 
				$scope.reciver = null;
				// 发送内容
				$scope.content = null;
				// platform同伴
				$scope.mates = [];
				// 聊天记录
				$scope.chatList = [];


				$scope.listen = function(){

					$scope.$on('chat.afterSend',function(e,args){
						if(args.name != $scope.name){return;};

						var name =  args.name;
						var chat = args.chat;
						

						// 更新聊天记录面板
						$scope.chatList.push(chat);
						
						// 清空聊天框
						$scope.content = '';
					});

					$scope.$on('chat.setMates',function(e,args){
						if(args.name != $scope.name){return;};

						var mates = args.mates;
						$scope.setMates(mates);
					});

					// 设置用户名
					$scope.$on('chat.setUsername',function(e,args){
						if(args.name != $scope.name){return;};

						var username = args.username;
						$scope.username = username;
					});
				};

				$scope.send = function(){
					var name = $scope.name;
					var reciver = $scope.reciver;
					var content = $scope.content;

					$scope.$emit('chat.send',{name:name,reciver:reciver,content:content});
				};

				$scope.setMates = function(mates){
					$scope.mates = mates;
					// 设置默认接收者
					$scope.reciver = _.find($scope.mates,function(n){return n == $scope.reciver;}) ? $scope.reciver : ($scope.mates[0] || '');
				};


				$scope.listen();
			}
		};
	}]);
});
