// 大厅
var _ = require('underscore');
var async = require('async');
var hallConfig = require('../../../config/hallConfig');

var Handler = (function(){
	var cls = function(app) {
		this.app = app;
		this.hall = this.app.get('hall');
		// this.hall = new Hall(this.app.get)
		// console.error('-->',app.curServer);
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static

	// private

	// public
	publicHandler.getInfo = function(next){
		var self = this;

		var info = self.hall.getInfo();
		console.error(self.hall.name,'->',info);
		next(null,info);
	};

	publicHandler.enterHall = function(uid,sid,next){
		var self = this;
		
		async.series([
			function(cb){
				// 加入chat频道
				var channelName = self.hall.name;
				self.app.rpc.message.messageRemote.addUser(channelName,uid,sid,cb);
			},
			function(cb){
				// 告知hall中其他成员,有新成员的加入
				var route = 'hall.addUser';
				var msg = {username:uid};
				var channelName = self.hall.name;
				self.app.rpc.message.messageRemote.send(route,msg,channelName,cb);
			},
			function(cb){
				// 通知platform中user状态的改变
				var changes = {
					hallName:self.hall.name
				};
				self.app.rpc.platform.platformRemote.updateUser(null,uid,changes,cb);
			}
		],next);


	};

	publicHandler.quitHall = function(uid,next){
		var self = this;

		async.series([
			function(cb){
				// 离开chat频道
				var channelName = self.hall.name;
				self.app.rpc.message.messageRemote.removeUser(channelName,uid,cb);
			},
			function(cb){
				// 告知hall中其他成员,有新成员的加入
				var route = 'hall.removeUser';
				var msg = {username:uid};
				var channelName = self.hall.name;
				self.app.rpc.message.messageRemote.send(route,msg,channelName,cb);
			},
			function(cb){
				// 通知platform中user状态的改变
				var changes = {
					hallName:null
				};
				self.app.rpc.platform.platformRemote.updateUser(null,uid,changes,cb);
			}
		],next);
	};

	publicHandler.chat = function(sender,reciver,content,next){
		var self = this;
		var route = 'hall.chat';
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

	}

	return cls;

}).call(this);



module.exports = function(app) {
	return new Handler(app);
};


// // 大厅

// var _ = require('underscore');
// var async = require('async');
// var PlayerMgr = require('../../../../logic/playerMgr');
// var HallMgr = require('../../../../logic/hallMgr');

// var Handler = (function(){
// 	var cls = function(app) {
// 		this.app = app;
// 		this.hallMgr = new HallMgr();
// 		this._createHalls();	
// 		this.channelService = this.app.get('channelService');
// 	};

// 	var staticHandler = cls;
// 	var publicHandler = cls.prototype;

// 	// static

// 	// private
// 	var errorCodeDict = {
// 		// 大厅不存在
// 		HALL_NOT_EXIST:7001,
// 		// 玩家不存在
// 		PLAYER_NOT_EXIST:7002,

// 	};

// 	// 创建hall
// 	publicHandler._createHalls = function(cfg){
// 		var self = this;
// 		cfg = [
// 			{hallName:'beijing',gameName:'poker'},
// 			{hallName:'shanghai',gameName:'poker'},
// 			{hallName:'huzhou',gameName:'go'},
// 		];
// 		_.each(cfg,function(n){
// 			self.hallMgr.addHall(n.hallName,n.gameName,'open');
// 		});
// 	};

// 	// 获取玩家列表
// 	publicHandler._getHallList = function(){
// 		var self = this;
// 		var list = self.hallMgr.find();
// 		return _.map(list,function(n){
// 			return {
// 				// 大厅编号
// 				id:n.id,
// 				// 大厅名称
// 				name:n.name,
// 				// 大厅游戏
// 				gameName:n.gameName,
// 				// 大厅人数
// 				playerCount:n.playerList.count(),
// 				// 大厅状态
// 				status:n.status
// 			};
// 		});
// 	};

// 	// 根据hall来获取它的channel
// 	publicHandler._getChannelByHall = function(hall){
// 		var self = this;
// 		return self.channelService.getChannel('HALL_CHANNEL'+hall.id,true);
// 	};

// 	// 获取玩家所在的hall
// 	publicHandler._getHall = function(username){
// 		var self = this;
// 		return _.find(self.hallMgr.find(),function(hall){
// 			return hall.findPlayer(username);
// 		});
// 	};

// 	// 找到玩家信息
// 	publicHandler._getPlayer = function(username){
// 		var self = this;
// 		var p=null;
// 		_.find(self.hallMgr.find(),function(hall){
// 			p = hall.findPlayer(username);
// 			return true;
// 		});
// 		return p;
// 	};


// 	// public
// 	// 进入大厅
// 	publicHandler.enterHall = function(player,hallName,sid,next){
// 		var self = this;
// 		var channel = self.channelService.getChannel('userCenter');
// 		console.error('abc',channel.getMembers());
// 		channel.pushMessage('abc',channel.getMembers());
// 		channel.pushMessage('getPlayerList',312);
// 		// console.warn('>>>>>>>>>>>>>>>>>>>>>>>>>');
// 		// console.warn('>>>>>>>>>>>>>>>>>>>>>>>>>',channel);
// 		// console.warn(self.channelService.channels);
// 		async.series({
// 			// 退出大厅(可能用户已经在别的大厅)
// 			'quitHall':function(cb){
// 				self.quitHall(player.name,sid,function(){
// 					cb();
// 				});
// 			},
// 			// 进入大厅
// 			'enterHall':function(cb){
// 				var hall = self.hallMgr.find(hallName);
// 				if(hall){
// 					var p = hall.playerList.add(player.name,player);
// 					if(p){
// 						var channel = self._getChannelByHall(hall);
// 						channel.add(player.name,sid);
// 						// self.channelService.pushMessageByUids('hall.getPlayerList',self._getHallList(),[{uid:player.name,sid:sid}]);
// 						channel.pushMessage('hall.getList',self._getHallList());
// 						console.warn('players in hall-------->>',self._getHallList());
// 						// channel.pushMessage('hall.addPlayer',p);
// 						cb(null);
// 					}else{
// 						cb(true,{code:errorCodeDict.PLAYER_NOT_EXIST});
// 					}
// 				}else{
// 					console.error('no such hall:'+hallName)
// 					cb(true,{code:errorCodeDict.HALL_NOT_EXIST});
// 				}
// 			},
// 			// 更新user中心的状态
// 			// todo
// 			'updateUser':function(cb){
// 				var hall = self.hallMgr.find(hallName);
// 				var changes = {
// 					hallId:hall.id,
// 					hallName:hall.name,
// 					gameName:hall.gameName
// 				};
// 				self.app.rpc.user.userRemote.update(null,player.name,changes,cb);
// 				// cb();
// 			}
// 		},function(err,data){
// 			next(err,data['enterHall']);
// 		});
// 	};

// 	// 退出大厅
// 	publicHandler.quitHall = function(username,sid,next){
// 		var self = this;
// 		async.series({
// 			// 退出房间
// 			// todo
// 			'quitRoom':function(cb){
// 				cb();
// 			},
// 			// 退出大厅
// 			'quitHall':function(cb){
// 				var hall = self._getHall(username);
// 				if(hall){
// 					var p = hall.playerList.remove(username);
// 					if(p){
// 						var channel = self._getChannelByHall(hall);
// 						// channel.push('hall.removePlayer',p);
// 						channel.pushMessage('hall.getList',self._getHallList());
// 						cb(null,p);
// 					}else{
// 						cb(true,errorCodeDict.PLAYER_NOT_EXIST);
// 					}
// 				}else{
// 					cb(true,errorCodeDict.HALL_NOT_EXIST);
// 				}
// 			},
// 			// 更新用户中心
// 			'updateUser':function(cb){
// 				var player = self._getPlayer(username);
// 				var changes = {
// 					hallId:-1,
// 					hallName:null,
// 					gameName:null
// 				};
// 				self.app.rpc.user.userRemote.update(null,username,changes,cb);
// 			}
// 		},function(err,data){
// 			next(err,data['quitHall']);
// 		});
		
// 	};

// 	// 获取大厅列表(包括一些附加信息,包括大厅人数,大厅的状态)
// 	publicHandler.getHallList = function(next){
// 		console.log('getHallList>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
// 		var self = this;
// 		var hallList = self._getHallList();
// 		next(null,hallList);
// 	};

	


// 	return cls;

// }).call(this);



// module.exports = function(app) {
// 	return new Handler(app);
// };