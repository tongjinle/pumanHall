var _ = require('underscore');

var Handler = (function() {
	var cls = function(app) {
		this.app = app;
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static

	// private

	// public
	// 进入大厅
	publicHandler.enterHall = function(msg, session, next) {
		var self = this;
		var player = msg.player;
		var hallName = msg.hallName;
		var sid = session.get('sid');

		self.app.rpc.hall.hallRemote.enterHall(session,player,hallName,sid,next);
	};

	// 退出大厅
	publicHandler.quitHall = function(msg,session,next){
		var self = this;
		var username = session.uid;
		var sid = session.get('sid');

		self.app.rpc.hall.hallRemote.quitHall(session,username,sid,next);
	};

	// 获取大厅列表
	publicHandler.getHallList = function(msg,session,next){
		var self = this;
		self.app.rpc.hall.hallRemote.getHallList(session,next);
	};


	return cls;

}).call(this);

module.exports = function(app) {
	return new Handler(app);
};