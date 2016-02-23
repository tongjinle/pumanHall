var _ = require('underscore');
var PlayerMgr = require('../../../../logic/playerMgr');
// var userRemote = require('../remote/userRemote');


var Handler = (function(){
	var cls = function(app) {
		this.app = app;
		this.playerMgr = PlayerMgr.create();
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static

	// private

	// public
	publicHandler.getPlayerList = function(msg,session,next){
		var self = this;
		self.app.rpc.user.userRemote.getPlayerList(session,next);
		return;
		
		var playerList = self.playerMgr.find();
		next(null,{playerList:playerList});
		return;
	};

	publicHandler.logout = function(msg,session,next){
		var self = this;
		var username = session.uid;
		self.app.rpc.user.userRemote.logout(session,username,session.get('sid'),next);
	};

	publicHandler.update = function(msg,session,next){
		var self = this;
		var username = session.uid;
		var changes = msg.changes;
		self.app.rpc.user.userRemote.update(session,username,changes,next);

	};

	return cls;

}).call(this);

module.exports = function(app){
	return new Handler(app);
};	