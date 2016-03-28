var _ = require('underscore');
var async = require('async');

var Handler = (function(){
	var cls = function(app) {
		this.app=app;
		this.platformService = this.app.get('platformService');

		this._channelName = 'platformChannel';
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static 

	// private

	// public
	publicHandler.addUser = function(uid,pwd,sid,next){
		var self = this;
		async.series([
			function(cb){
				self.platformService.addUser(uid);
				cb();
			},
			function(cb){
				// message
				self.app.rpc.message.messageRemote.addUser(null,self._channelName,uid,sid,cb);
			},
			function(cb){
				// send message of 'platform.addUser'
				var route = 'platform.addUser';
				var user = self.platformService.getUser(uid);
				var msg = user;
				var channel = self._channelName;
				self.app.rpc.message.messageRemote.send(null,route,msg,channel,cb);
			}
		],
		function(err,data){ 
			next();
		}
		);
	};


	publicHandler.removeUser = function(uid,next){
		var self = this;
		async.series([
			function(cb){
				self.platformService.removeUser(uid);
				cb();
			},
			function(cb){
				// message
				self.app.rpc.message.messageRemote.removeUser(null,self._channelName,uid,cb);
			},
			function(cb){
				// send message of 'platform.removeUser'
				var route = 'platform.removeUser';
				var msg = {uid:uid};
				var channel = self._channelName;
				self.app.rpc.message.messageRemote.send(null,route,msg,channel,cb);
			}
		],function(err,data){
			next();
		});
	};


	publicHandler.getUserList = function(next){
		var self = this;
		var userList = self.platformService.getUser();
		next(null,userList);
	};

	return cls;

}).call(this);


module.exports = function(app){
	// var ins = new Handler(app);
	// console.log(ins.addUser+'');
	return new Handler(app);
};

// var async = require('async');
// var PlayerMgr = require('../../../../logic/playerMgr');
 
// var Handler = (function(){
// 	var cls = function(app) {
// 		this.app = app;
// 		this.playerMgr = new PlayerMgr();
// 		this.channel = this.app.get('channelService').createChannel('userCenter');
// 	};

// 	var staticHandler = cls;
// 	var publicHandler = cls.prototype;

// 	// static

// 	// private


// 	// public
// 	publicHandler.login = function(username,pwd,sid,next){
// 		var self = this;
// 		self.playerMgr.add(username,pwd,function(err,p){
// 			console.warn('>>>>>>login',err,p);
// 			if(!err){
// 				console.warn('>>> channel before login : '+username+","+sid,self.channel.getMembers());
// 				self.channel.pushMessage('addPlayer',p);
// 				self.channel.add(username,sid);
// 				// self.app.get('channelService').pushMessageByUids('getPlayerList',self.playerMgr.find(),[{uid:username,sid:sid}]);
// 				console.warn('>>> channel after login : '+username+","+sid,self.channel.getMembers());
// 			}
// 			next(null,{
// 				flag:!!p,
// 				player:p
// 			});
// 		});
// 	};

// 	publicHandler.logout = function(username,sid,next){
// 		var self = this;
// 		console.error(self.app.get('channelService').getChannel('userCenter').getMembers());
// 		self.playerMgr.remove(username,function(err,p){
// 			console.warn('logout in remote');
// 			console.warn(err,p);
// 			// 此处err表示是否删除player成功
// 			if(!err){
// 				console.warn('>>> channel before logout : '+username+","+sid,self.channel.getMembers());
// 				self.channel.pushMessage('removePlayer',p);
// 				self.channel.leave(username,sid);
// 				console.warn('>>> channel after logout : '+username+","+sid,self.channel.getMembers());
// 			}
// 			next(null,{
// 				flag:!err,
// 				player:p
// 			});
// 		});
// 	};

// 	publicHandler.getPlayerList = function(next){
// 		var self = this;
// 		next(null,self.playerMgr.find());
// 	};

// 	publicHandler.update = function(username,changes,next){
// 		var self = this;
// 		self.playerMgr.update(username,changes,function(err,p){
// 			if(!err){
// 				self.channel.pushMessage('updatePlayer',p);
// 			}
// 			next(null,{
// 				flag:!err,
// 				player:p
// 			});
// 		});
// 	};

// 	return cls;

// }).call(this);


// module.exports = function(app) {
// 	return new Handler(app);
// };