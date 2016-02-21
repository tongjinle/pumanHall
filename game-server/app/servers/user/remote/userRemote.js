var PlayerMgr = require('../../../../logic/playerMgr');

var Handler = (function(){
	var cls = function(app) {
		this.app = app;
		this.playerMgr = new PlayerMgr();
		this.channel = this.app.get('channelService').createChannel('userCenter');
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static

	// private


	// public
	publicHandler.login = function(username,pwd,sid,next){
		this.playerMgr.add(username,pwd,function(err,p){

		});
	};

	publicHandler.logout = function(){};

	publicHandler.update = function(){};

	return cls;

}).call(this);


module.exports = function(app) {
	return new Handler(app);
};