window.onload = function() {
	var app = angular.module('hall',[]);

	app.controller('hallCtrl', ['$scope', function($scope) {

		// 是否连接上了connector服务器
		$scope.isConnected = false;

		$scope.username = 'dino';
		$scope.pwd='test123';
		$scope.playerList = [];


		// 发送对象 
		$scope.reciver = null;
		// platform同伴
		$scope.platformMates = [];
		// 聊天记录
		$scope.chatList = [];

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

			$scope.$watch('playerList.length',function(nv,ov){
				// 必须已经登录
				$scope.refreshMates();
			},true);

			$scope.$watch('player',function(){
				$scope.refreshMates();
			});


			////////////////////////////////////////////////////
			// pomelo on
			////////////////////////////////////////////////////

			pomelo.on('platform.addUser', function(user) {
				$scope.playerList.push(user);
				$scope.$apply();
				console.warn('after addPlayer->', $scope.playerList);
			});

			pomelo.on('platform.removeUser', function(uid) {
				$scope.playerList = _.filter($scope.playerList, function(n) {
					return n.name != uid;
				});
				$scope.$apply();
				console.warn('after removePlayer->', $scope.playerList);
			});

			pomelo.on('platform.chat',function(chat){
				$scope.chatList.push(chat);
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
			pomelo.request(route, msg, function(data){
				console.warn(data);
				if(data.code == 200){
					$scope.player = {name:$scope.username};
					$scope.getPlayerList();
				}else{
					$scope.player = null;
				}
				$scope.$apply();
				// $scope.getPlayerList();
				// $scope.getHallList();
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

		// 刷新聊天列表
		$scope.refreshMates = function () {
			// 必须已经登录
			if($scope.player){
				$scope.platformMates = _.without(_.map($scope.playerList,function(n){return n.name;}),$scope.player?$scope.player.name:'');
				$scope.platformMates.unshift('*');
				$scope.reciver = _.find($scope.platformMates,function(n){return n == $scope.reciver;}) ? $scope.reciver : ($scope.platformMates[0] || '');
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
				$scope.content = '';
			});
		};

		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
		// getHallList
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
		}


		// 初始化pomelo
		function init(next) {
			return ;
			var pomelo = window.pomelo;
			var host = "127.0.0.1";
			var port = "3010";
			pomelo.init({host: host, port: port, log: true }, next);
		}

		init(function(){
			// push message

			// pomelo.on('getPlayerList', function(playerList) {
			// 	$scope.playerList=playerList;
			// 	$scope.$apply();
			// 	console.warn('after getPlayerList->', $scope.playerList);
			// });



			pomelo.on('updatePlayer',function(player){
				var index = _.findIndex($scope.playerList,function(p){return p.name == player.name});
				$scope.playerList[index] = player;
				$scope.$apply();
				console.warn(player);

			});

			pomelo.on('hall.getList',function (hallList) {
				$scope.hallList = hallList;
				$scope.$apply();
				console.warn('after hall getPlayerList->', $scope.hallList);

				// 确定我所在的大厅
				// var myHall = _.find($scope.hallList,function(hall){});
				// $scope.myHallName = 


			});


			pomelo.on('abc',function(abc){
				console.log(abc);
			});



			// pomelo.on('hall.addPlayer',function (player) {
			// 	if(player.name == $scope.loginUsername){return;}
			// 	$scope.hallPlayerList.push(player);
			// 	$scope.$apply();
			// 	console.warn('after hall addPlayer->', player);
			// });

			// pomelo.on('hall.removePlayer',function(player){
			// 	$scope.hallPlayerList = _.filter($scope.hallPlayerList, function(n) {
			// 		return n.name != player.name;
			// 	});
			// 	$scope.$apply();
			// 	console.warn('after removePlayer->', player);
			// });
		});


		$scope.listen();

		$scope.queryGate();
	}]);

	angular.bootstrap(document.body,[app.name]);
};