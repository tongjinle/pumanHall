var _ = require('underscore');


var Handler = (function(){
	var cls = function(app) {
		this.app = app;
		this.userMgr = new UserMgr();
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static

	// private

	// public
	publicHandler.getPlayerList = function(msg,session,next){
		var playerIdList = session.playerIdList;

		var playerList = this.userMgr.getPlayerList();
		var info = _.map(function(n){
			return {
				id:n.id,
				name:n.name,
				hallId:n.hallId,
				hallName:n.hallName,
				roomId:n.roomId,
				roomName:n.roomName,
				gameName:n.gameName,
				gameStatus:n.gameStatus
			};
		});
		next(null,{playerList:info})
	};

	return cls;

}).call(this);

module.exports = function(app){
	return new Handler(app);
};	