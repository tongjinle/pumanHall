define([
	'app',
	'underscore'
	],function(app,_){
	app.directive('platform',['$location',function($location){
		return {
			restrict:'E',
			templateUrl:'./directive/html/platform.html',
			link:function($scope,$element,$attrs){

				// 是否连接上了connector服务器
				$scope.isConnected = false;

				$scope.username = 'dino';
				$scope.pwd='test123';
				$scope.userList = [];


				
				// 当前显示区域
				$scope.part = 'userList'; // 默认展示platform区域,方便登录

				// 切换显式区域
				$scope.changePart = function(part){
					$scope.part = part;
				};
				// 发送信息(platform)
				$scope.send = function(reciver,word){
					var msg = {
						reciver:reciver,
						word:word
					};
					pomelo.request('platform.platformHandler.chat',msg,function(){});
				};

				var gateConf = {
					host:'127.0.0.1',
					port:'3010'
				};

				$scope.listen = function(){
					var self = this;

					$scope.$on('gate.afterQuery',function(e,args){
						var connectorHost = args.host;
						var connectorPort = args.port;

						pomelo.init({host:connectorHost,port:connectorPort,log:true},function(){
							$scope.$emit('connector.afterInit');
						});
					});


					$scope.$on('connector.afterInit',function(){
						$scope.isConnected = true;
						$scope.$apply();
					});

					// 设置user
					$scope.$on('afterLogin',function(e,args){
						$scope.getUserList();
					});

					$scope.$on('afterLogin',function(e,args){
						$scope.changePart('hallList');
						$scope.getHallList();
						// $scope.$broadcast('initHallList');
					});

					// chat要求发送消息
					$scope.$on('chat.send',function(e,args){
						var name = args.name;

						var route = {
							'platform': 'platform.platformHandler.chat'
						}[name];
						var msg = _.pick(args,'reciver','content');
						
						pomelo.request(route,msg,function(data){
						});
					});

					// 设置chat参数
					$scope.$watch('userList.length',function(nv,ov){
						if($scope.user){
							$scope.setChatter('platform',$scope.user.name);
							$scope.refreshMates('platform',$scope.userList);
						}
					},true);

					$scope.$watch('user',function(){
						if($scope.user){
							$scope.setChatter('platform',$scope.user.name);
							$scope.refreshMates('platform',$scope.userList);
						}
					});


					////////////////////////////////////////////////////
					// pomelo on
					////////////////////////////////////////////////////


					// -->> platform
					pomelo.on('platform.addUser', function(user) {
						$scope.userList.push(user);
						
						if($scope.username == user.name){
							$scope.user = user;
							$scope.$emit('afterLogin',user);
						}

						console.warn('after addUser->', $scope.userList);
						$scope.$apply();
					});

					pomelo.on('platform.removeUser', function(uid) {
						$scope.userList = _.filter($scope.userList, function(n) {
							return n.name != uid;
						});
						console.warn('after removeUser->', $scope.userList);
						$scope.$apply();
					});

					pomelo.on('platform.chat',function(chat){
						$scope.$broadcast('chat.afterSend',{
							name:'platform',
							chat:chat
						});

						$scope.$apply();
					});

					pomelo.on('platform.updateUser',function(user){
						console.log('platform.updateUser',user);
						_.find($scope.userList,function(n,i){
							if(n.name == user.name){
								$scope.userList[i] = user;
								return true;
							}
						});
						if($scope.user && $scope.user.name == user.name){
							$scope.user = user;
						}
						$scope.$apply();
					});

					// -->> platform
					pomelo.on('platform.refreshHall',function(msg){
						var hallName = msg.hallName;
						_.find($scope.hallList,function(n,i){
							if(n.hallName == hallName){
								$scope.hallList[i] = msg;
							}
						});
						$scope.$apply();
					});
				};



				$scope.queryGate = function(){
					pomelo.init({host: gateConf.host, port: gateConf.port, log: true }, function(data){
						var route = 'gate.gateHandler.queryEntry';
						var msg = {uid:$scope.username};

						pomelo.request(route,msg,function(data){
							console.log(data);
							if(data.code == 200){
								$scope.$emit('gate.afterQuery',data);
								// pomelo.disconnect();
							}
						});
					});
				};

				// login
				$scope.login = function(){
					var route = 'connector.entryHandler.login';
					var msg = {
						uid: $scope.username,
						pwd: $scope.pwd
					};

					// 默认先登出
					$scope.user = null;
					pomelo.request(route, msg, function(data){
						console.warn(data);
					});
				};

				// logout 
				$scope.logout = function(){
					var route = 'platform.platformHandler.logout';
					var msg = {};
					pomelo.request(route, msg, function(data) {
						console.log(data);
						if(data.code == 200){
							$scope.user = null;
							// 因为已经登出,所以userList自动清空
							$scope.userList = [];
							$scope.$apply();
						}
					});
				};

				// update
				// todo 
				$scope.update = function() {
					return;
					var route = 'user.userHandler.update';
					var msg = {
						gameStatus: 2
					};
					pomelo.request(route, msg, function(data) {
						console.warn(data);
					});
				};

				// platform
				// getUserList
				$scope.getUserList = function () {
					var route = 'platform.platformHandler.getUserList';
					var msg = {};
					pomelo.request(route, msg, function(data) {
						console.warn('getUserList:', data);
						$scope.userList = data;
						$scope.$apply();
					});
				};

				/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

				// 设置聊天者'我'
				$scope.setChatter = function(chatName,username){
					var msg = {name:chatName,username:username};
					$scope.$broadcast('chat.setUsername',msg);
				};


				// 刷新聊天列表
				$scope.refreshMates = function(chatName,userList) {
					// 必须已经登录
					if($scope.user){
						var mates = _.without(_.map($scope.userList,function(n){return n.name;}),$scope.username);
						mates.unshift('*');


						var msg = {name:chatName,mates:mates};
						$scope.$broadcast('chat.setMates',msg);
					}
				};

				// 发送信息
				$scope.send = function(){
					var route = 'platform.platformHandler.chat';
					var msg = {
						reciver:$scope.reciver,
						content:$scope.content
					};
					pomelo.request(route,msg,function(data){
					});
				};

				/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				// HALL
				/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				
				// 大厅列表
				$scope.hallList = [];
				// 当前大厅
				$scope.hall = null;
				// 大厅聊天记录
				$scope.hallChatList = [];

				// 获取大厅列表
				$scope.getHallList = function(){
					var route = 'platform.platformHandler.getHallList';
					var msg = {};
					pomelo.request(route,msg,function(data){
						console.warn('getHallList',data);
						$scope.hallList = data;
						$scope.$apply();
					});
				};

				// 进入大厅
				$scope.enterHall = function(hallName){
					var route = 'platform.platformHandler.enterHall';
					var msg = {
						hallName:hallName
					};
					pomelo.request(route,msg,function(data){
						console.log('after enterHall',data);
						// if(data.code == 200){
						// 	$scope.hallName = hallName;
						// }
						// $scope.$apply();

					});
				};

				// 退出大厅
				$scope.quitHall = function(){
					var route = 'hall.hallHandler.quitHall';
					// var route = 'hall.hallHandler.test';
					var msg = {};
					var hallName = $scope.hallName;
					pomelo.request(route,msg,function(data){
						console.log('after quitHall',data);
					});
				};

				// 聊天
				$scope.chatInHall = function(){};

				// 转去"hall"页面
				$scope.goHall = function(){
					var username = $scope.username;
					var user = _.find($scope.userList,function(n){return n.name == username;});
					var hallName = user.hallName;
					$location.path("/hall/:hallName/:username".replace(':hallName',hallName).replace(':username',username));
				};


				/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				// 启动
				/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

				$scope.listen();

				$scope.queryGate();
			}
		};
	}]);
});