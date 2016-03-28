var _ = require('underscore');

var Handler = (function(){
	var cls = function(username) {
		this.name = username;
		this.hallName = null;
		this.roomName = null;
		this.gameName = null;
		/*
		 -1 未在房间中
		 0 未准备
		 1 准备中
		 2 游戏中
		 3 观看中
		*/
		this.gameStatus = -1;
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static

	// private

	// public

	return cls;

}).call(this);

module.exports = Handler;	