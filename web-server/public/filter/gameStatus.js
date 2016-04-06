define([
		'app'
	],function(app){
		app.filter('gameStatus',[function(){
 			return function(gameStatus){
				var dict = {
					"-1":"未在房间中",
					"0":"未准备",
					"1":"准备中",
					"2":"游戏中",
					"3":"观看中"
				};
				return dict[gameStatus];
			};
		}]);
	}
);