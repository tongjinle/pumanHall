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
		var self = this;
		self.playerMgr.add(username,pwd,function(err,p){
			console.warn(err,p);
			if(err){
				next(err);
			}else{
				self.channel.add(username,sid);
				next(null,{
					flag:!!p,
					username:username
				});
			}
		});
	};

	publicHandler.logout = function(){};

	publicHandler.update = function(){};

	return cls;

}).call(this);


module.exports = function(app) {
	return new Handler(app);
};