window.onload = function() {
	var app = angular.module('hall',[]);

	app.controller('hallCtrl', ['$scope', function($scope) {

		// 是否连接上了connector服务器
		$scope.isConnected = false;

		$scope.username = 'dino';
		$scope.pwd='test123';
		$scope.playerList = [];

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