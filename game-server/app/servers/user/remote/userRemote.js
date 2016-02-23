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
				console.warn('>>> channel add : '+username);
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
			// 此处err表示是否删除player成功
			if(!err){
				self.channel.pushMessage('removePlayer',p);
				self.channel.leave(username,sid);
			}
			next(null,{
				flag:!err,
				player:p
			});
		});
	};

	publicHandler.getPlayerList = function(next){
		var self = this;
		next(null,self.playerMgr.find());
	};

	publicHandler.update = function(username,changes,next){
		var self = this;
		self.playerMgr.update(username,changes,function(err,p){
			if(!err){
				self.channel.pushMessage('updatePlayer',p);
			}
			next(null,{
				flag:!err,
				player:p
			});
		});
	};

	return cls;

}).call(this);


module.exports = function(app) {
	return new Handler(app);
};