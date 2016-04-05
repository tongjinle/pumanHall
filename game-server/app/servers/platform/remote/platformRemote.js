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
				cb(!!self.platformService.getUser(uid));
			},
			function(cb){
				self.platformService.addUser(uid);
				console.error('after addUsers ->',self.platformService.getUser(),self.platformService.userList);
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
		next
		);
	};


	publicHandler.removeUser = function(uid,next){
		var self = this;
		async.series([
			function(cb){
				// quit hall
				var user = self.platformService.getUser(uid);
				if(user.hallName){
					self.app.rpc.hall.hallRemote.quitHall(user.hallName,uid,cb);
					return;
				}
				cb();
			},
			function(cb){
				// quit platform
				async.series([
					function(cb2){
						// message
						self.app.rpc.message.messageRemote.removeUser(null,self._channelName,uid,cb2);
					},
					function(cb2){
						// send message of 'platform.removeUser'
						var route = 'platform.removeUser';
						var msg = uid;
						var channel = self._channelName;
						self.app.rpc.message.messageRemote.send(null,route,msg,channel,cb2);
					},
					function(cb2){
						self.platformService.removeUser(uid);
						console.error('after removeUser ->',self.platformService.getUser(),self.platformService.userList);
						cb2();
					}
				],cb);
			}
		],function(err,data){
			next();
		});
	};

	publicHandler.updateUser =function(uid,changes,next){
		var self = this;

		var user = self.platformService.getUser(uid);
		_.each(changes,function(v,k){
			if(!_.isUndefined(user[k])){
				user[k] = v;
			}
		});

		// notify all users in platform
		var route = 'platform.updateUser';
		var msg = user;
		var channel = self._channelName;
		self.app.rpc.message.messageRemote.send(null,route,msg,channel,next);


	};

	publicHandler.broadcast = function(route,msg,next){
		var self = this;
		var channel = self._channelName;
		self.app.rpc.message.messageRemote.send(null,route,msg,channel,next);
	};

	publicHandler.getUser = function(uid,next){
		var self = this;
		var user = self.platformService.getUser(uid);
		next(null,user);
	};

	publicHandler.getUserList = function(next){
		var self = this;
		var userList = self.platformService.getUser();
		next(null,userList);
	};



	publicHandler.chat = function(sender,reciver,content,next){
		var self = this;
		var route = 'platform.chat';
		var msg;
		var isPrivate = false;
		var channelName;
		if(reciver == '*'){
			channelName = self._channelName;
		}else{
			channelName = [sender,reciver];
			isPrivate = true;
		}
		msg = {sender:sender,reciver:reciver,content:content,isPrivate};
		self.app.rpc.message.messageRemote.send(null,route,msg,channelName,next);
	};

	return cls;

}).call(this);


module.exports = function(app){
	// var ins = new Handler(app);
	// console.log(ins.addUser+'');
	return new Handler(app);
};

// var async = require('async');
// var UserMgr = require('../../../../logic/userMgr');
 
// var Handler = (function(){
// 	var cls = function(app) {
// 		this.app = app;
// 		this.userMgr = new UserMgr();
// 		this.channel = this.app.get('channelService').createChannel('userCenter');
// 	};

// 	var staticHandler = cls;
// 	var publicHandler = cls.prototype;

// 	// static

// 	// private


// 	// public
// 	publicHandler.login = function(username,pwd,sid,next){
// 		var self = this;
// 		self.userMgr.add(username,pwd,function(err,p){
// 			console.warn('>>>>>>login',err,p);
// 			if(!err){
// 				console.warn('>>> channel before login : '+username+","+sid,self.channel.getMembers());
// 				self.channel.pushMessage('addUser',p);
// 				self.channel.add(username,sid);
// 				// self.app.get('channelService').pushMessageByUids('getUserList',self.userMgr.find(),[{uid:username,sid:sid}]);
// 				console.warn('>>> channel after login : '+username+","+sid,self.channel.getMembers());
// 			}
// 			next(null,{
// 				flag:!!p,
// 				user:p
// 			});
// 		});
// 	};

// 	publicHandler.logout = function(username,sid,next){
// 		var self = this;
// 		console.error(self.app.get('channelService').getChannel('userCenter').getMembers());
// 		self.userMgr.remove(username,function(err,p){
// 			console.warn('logout in remote');
// 			console.warn(err,p);
// 			// 此处err表示是否删除user成功
// 			if(!err){
// 				console.warn('>>> channel before logout : '+username+","+sid,self.channel.getMembers());
// 				self.channel.pushMessage('removeUser',p);
// 				self.channel.leave(username,sid);
// 				console.warn('>>> channel after logout : '+username+","+sid,self.channel.getMembers());
// 			}
// 			next(null,{
// 				flag:!err,
// 				user:p
// 			});
// 		});
// 	};

// 	publicHandler.getUserList = function(next){
// 		var self = this;
// 		next(null,self.userMgr.find());
// 	};

// 	publicHandler.update = function(username,changes,next){
// 		var self = this;
// 		self.userMgr.update(username,changes,function(err,p){
// 			if(!err){
// 				self.channel.pushMessage('updateUser',p);
// 			}
// 			next(null,{
// 				flag:!err,
// 				user:p
// 			});
// 		});
// 	};

// 	return cls;

// }).call(this);


// module.exports = function(app) {
// 	return new Handler(app);
// };