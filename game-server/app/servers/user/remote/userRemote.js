var PlayerMgr = require('../../../../logic/playerMgr');

var Handler = (function(){
	var cls = function(app) {
		this.app = app;
		this.playerMgr = PlayerMgr.create();
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
			// console.warn(err,p);
			if(err){
				next(err);
			}else{
				self.channel.add(username,sid);
				self.channel.pushMessage('addPlayer',p);
				next(null,{
					flag:!!p,
					username:username
				});
			}
		});
	};

	publicHandler.logout = function(username,sid,next){
		var self = this;
		self.playerMgr.remove(username,function(err,p){
			if(err){
				next(err);
			}else{
				self.channel.leave(username,sid);
				self.channel.pushMessage('removePlayer',p);
				next(null,{
					flag:true,
					player:p
				});
			}
		});
	};

	publicHandler.getPlayerList = function(next){
		var self = this;
		next(null,self.playerMgr.find());
	};

	publicHandler.update = function(){};

	return cls;

}).call(this);


module.exports = function(app) {
	return new Handler(app);
};