var _ = require('underscore');

var Handler = (function() {
	var cls = function(app) {
		this.app = app;
		this.hall = this.app.get('hall');
		// console.error('-->',this.hall);
		// console.error('-->',app.curServer);
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static

	// private

	// public
	// 退出大厅
	publicHandler.quitHall = function(msg,session,next){
		var self = this;
		var username = session.uid;
		var hallName = self.hall.name;

		console.error('hallHandler.quitHall');
		console.error(username,hallName);
		var sid = session.get('sid');
		self.app.rpc.hall.hallRemote.quitHall(hallName,username,next);
	};

	// 获取大厅消息
	publicHandler.getInfo = function(msg,session,next){
		var self = this;
		var info = self.hall.getInfo('hall.simple');
		next(null,info);
	};

	publicHandler.test = function(msg,session,next){
		console.error('hallHandler.test');
		console.error(arguments);
		next();
	};

	return cls;

}).call(this);

module.exports = function(app) {
	return new Handler(app);
};