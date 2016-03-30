app.controller('hallCtrl', ['$scope', function($scope) {

	// 是否连接上了connector服务器
	$scope.isConnected = false;

	$scope.username = 'dino';
	$scope.pwd='test123';
	$scope.playerList = [];


	
	// 当前显示区域
	$scope.part = 'platform'; // 默认展示platform区域,方便登录

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

		// 设置player
		$scope.$on('afterLogin',function(e,args){
			var user = args;
			$scope.getPlayerList();
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
		$scope.$watch('playerList.length',function(nv,ov){
			if($scope.player){
				$scope.setChatter('platform',$scope.player.name);
				$scope.refreshMates('platform',$scope.playerList);
			}
		},true);

		$scope.$watch('player',function(){
			if($scope.player){
				$scope.setChatter('platform',$scope.player.name);
				$scope.refreshMates('platform',$scope.playerList);
			}
		});


		////////////////////////////////////////////////////
		// pomelo on
		////////////////////////////////////////////////////



		pomelo.on('platform.addUser', function(user) {
			$scope.playerList.push(user);
			
			if($scope.username == user.name){
				$scope.player = user;
				$scope.$emit('afterLogin',user);
			}

			console.warn('after addPlayer->', $scope.playerList);
			$scope.$apply();
		});

		pomelo.on('platform.removeUser', function(uid) {
			$scope.playerList = _.filter($scope.playerList, function(n) {
				return n.name != uid;
			});
			console.warn('after removePlayer->', $scope.playerList);
			$scope.$apply();
		});

		pomelo.on('platform.chat',function(chat){
			$scope.$broadcast('chat.afterSend',{
				name:'platform',
				chat:chat
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
		$scope.player = null;
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
				$scope.player = null;
				// 因为已经登出,所以playerList自动清空
				$scope.playerList = [];
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
	// getPlayerList
	$scope.getPlayerList = function () {
		var route = 'platform.platformHandler.getUserList';
		var msg = {};
		pomelo.request(route, msg, function(data) {
			console.warn('getPlayerList:', data);
			$scope.playerList = data;
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
	$scope.refreshMates = function(chatName,playerList) {
		// 必须已经登录
		if($scope.player){
			var mates = _.without(_.map($scope.playerList,function(n){return n.name;}),$scope.username);
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
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// 大厅列表
	$scope.hallList = [];
	// 当前大厅
	$scope.hall = null;
	// 大厅聊天记录
	$scope.hallChatList = [];

	// 获取大厅列表
	$scope.getHallList = function(){
		var route = 'hall.hallHandler.getHallList';
		var msg = {};
		pomelo.request(route,msg,function(data){
			console.warn('getHallList',data);
			$scope.hallList = data;
			$scope.$apply();
		});
	};

	// 进入大厅
	$scope.enterHall = function(hallName){
		var route = 'hall.hallHandler.enterHall';
		var msg = {
			player:$scope.player,
			hallName:hallName
		};
		pomelo.request(route,msg,function(data){
			console.log('after enterHall',data);
		});
	};

	// 退出大厅
	$scope.quitHall = function(){
		var route = 'hall.hallHandler.quitHall';
		var msg = {};
		pomelo.request(route,msg,function(data){
			console.log('after quitHall',data);
		});
	};

	// 聊天
	$scope.chatInHall = function(){};


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 启动
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	$scope.listen();

	$scope.queryGate();
}]);