window.onload = function() {
	var app = angular.module('hall',[]);

	app.controller('hallCtrl', ['$scope', function($scope) {
		$scope.username = 'dino';
		$scope.pwd='test123';
		$scope.playerList = [];


		// login
		$scope.login = function(){
			if($scope.username==''){
				alert('username can not be empty!!');
			}
			var route = 'gate.gateHandler.queryEntry';
			var msg = {
				uid:$scope.username
			};
			pomelo.request(route,msg,function(data){
				console.log(data);
			});
			return;
			var route = 'connector.entryHandler.entry';
			var msg = {
				username: $scope.username,
				pwd: $scope.pwd
			};
			pomelo.request(route, msg, function(data){
				console.warn(data);
				if(data.flag){
					$scope.player = data.player;
				}else{
					$scope.player = null;
					
				}
				$scope.$apply();
				$scope.getPlayerList();
				$scope.getHallList();
			});
		};

		// logout 
		$scope.logout = function(){
			var route = 'user.userHandler.logout';
			var msg = {};
			pomelo.request(route, msg, function(data) {
				if(data.flag){
					$scope.player = null;
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

		// getPlayerList
		$scope.getPlayerList = function () {
			var route = 'user.userHandler.getPlayerList';
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
			var pomelo = window.pomelo;
			var host = "127.0.0.1";
			var port = "4010";
			pomelo.init({host: host, port: port, log: true }, next);
		}

		init(function(){
			// push message

			pomelo.on('getPlayerList', function(playerList) {
				$scope.playerList=playerList;
				$scope.$apply();
				console.warn('after getPlayerList->', $scope.playerList);
			});


			pomelo.on('addPlayer', function(player) {
				if($scope.player && player.name == $scope.player.name){return;}
				$scope.playerList.push(player);
				$scope.$apply();
				console.warn('after addPlayer->', $scope.playerList);
			});

			pomelo.on('removePlayer', function(player) {
				$scope.playerList = _.filter($scope.playerList, function(n) {
					return n.name != player.name;
				});
				$scope.$apply();
				console.warn('after removePlayer->', $scope.playerList);
			});

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
	}]);

	angular.bootstrap(document.body,[app.name]);
};