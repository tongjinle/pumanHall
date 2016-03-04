window.onload = function() {
	var app = angular.module('hall',[]);

	app.controller('hallCtrl', ['$scope', function($scope) {
		$scope.username = 'dino';
		$scope.pwd='test123';
		$scope.playerList = [];
		// login
		$scope.login = function(){
			var route = 'connector.entryHandler.entry';
			var msg = {
				username: $scope.username,
				pwd: $scope.pwd
			};
			pomelo.request(route, msg, function(data){
				console.warn(data);
				if(data.flag){
					$scope.isLogin = true;
				}
			});
		};

		// logout 
		$scope.logout = function(){
			var route = 'user.userHandler.logout';
			var msg = {};
			pomelo.request(route, msg, function(data) {
				if(data.flag){
					$scope.isLogin = false;
				}
			});
		};

		// update
		$scope.update = function() {
			var route = 'user.userHandler.update';
			var msg = {
				changes: {
					gameStatus: 2
				}
			};
			pomelo.request(route, msg, function(data) {
				console.warn(data);
			});
		};

		// listAll
		$scope.listAll = function () {
			var route = 'user.userHandler.getPlayerList';
			var msg = {};
			pomelo.request(route, msg, function(data) {
				console.warn('getPlayerList:', data);
			});
		}


		// 初始化pomelo
		function init(next) {
			var pomelo = window.pomelo;
			var host = "127.0.0.1";
			var port = "3010";
			pomelo.init({host: host, port: port, log: true }, next);
		}

		init(function(){
			// push message

			pomelo.on('getPlayerList', function(pList) {
				$scope.playerList=pList;
				$scope.$apply();
				console.warn('after getPlayerList->', $scope.playerList);
			});


			pomelo.on('addPlayer', function(p) {
				if(p.name == $scope.username){return;}
				$scope.playerList.push(p);
				$scope.$apply();
				console.warn('after addPlayer->', $scope.playerList);
			});

			pomelo.on('removePlayer', function(p) {
				$scope.playerList = _.filter($scope.playerList, function(n) {
					return n.name != p.name;
				});
				$scope.$apply();
				console.warn('after removePlayer->', $scope.playerList);
			});
		});
	}]);

	angular.bootstrap(document.body,[app.name]);
};