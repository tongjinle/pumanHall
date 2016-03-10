// 大厅

var _ = require('underscore');
var async = require('async');
var PlayerMgr = require('../../../../logic/playerMgr');
var HallMgr = require('../../../../logic/hallMgr');

var Handler = (function(){
	var cls = function(app) {
		this.app = app;
		this.hallMgr = new HallMgr();
		this._createHalls();	
		this.channelService = this.app.get('channelService');
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static

	// private
	var errorCodeDict = {
		// 大厅不存在
		HALL_NOT_EXIST:7001,
		// 玩家不存在
		PLAYER_NOT_EXIST:7002,

	};

	// 创建hall
	publicHandler._createHalls = function(cfg){
		var self = this;
		cfg = [
			{hallName:'beijing',gameName:'poker'},
			{hallName:'shanghai',gameName:'poker'},
			{hallName:'huzhou',gameName:'go'},
		];
		_.each(cfg,function(n){
			self.hallMgr.addHall(n.hallName,n.gameName,'open');
		});
	};

	// 获取玩家列表
	publicHandler._getHallPlayerList = function(){
		var self = this;
		var list = self.hallMgr.find();
		return _.map(list,function(n){
			return {
				// 大厅编号
				id:n.id,
				// 大厅名称
				name:n.name,
				// 大厅游戏
				gameName:n.gameName,
				// 大厅人数
				playerCount:n.playerList.count(),
				// 大厅状态
				status:n.status
			};
		});
	};

	// 根据hall来获取它的channel
	publicHandler._getChannelByHall = function(hall){
		var self = this;
		return self.channelService.getChannel('HALL_CHANNEL'+hall.id,true);
	};

	// 获取玩家所在的hall
	publicHandler._getHall = function(username){
		var self = this;
		return _.find(self.hallMgr.get(),function(hall){
			return hall.playerList.get(username);
		});
	};

	// public
	// 进入大厅
	publicHandler.enterHall = function(player,hallName,sid,next){
		var self = this;
		var hall = self.hallMgr.get(hallName);
		if(hall){
			var p = hall.playerList.add(player.name,player);
			if(p){
				var channel = self._getChannelByHall(hall);
				channel.add(player.name,sid);
				self.channelService.pushMessageByUids('hall.getPlayerList',self._getHallPlayerList(),[{uid:player.name,sid:sid}]);
				channel.push('hall.addPlayer',p);
				next(null);
			}else{
				next(true,{code:errorCodeDict.PLAYER_NOT_EXIST});
			}
		}else{
			console.error('no such hall:'+hallName)
			next(true,{code:errorCodeDict.HALL_NOT_EXIST});
		}
	};

	// 退出大厅
	publicHandler.quitHall = function(username,sid,next){
		var self = this;
		var hall = self.getHall(username);
		if(hall){
			var p = self.playerList.remove(username);
			if(p){
				var channel = self.channelService.getChannel(hall);
				channel.push('hall.removePlayer',p);
				next(null);
			}else{
				next(true,errorCodeDict.PLAYER_NOT_EXIST);
			}
		}else{
			next(true,errorCodeDict.HALL_NOT_EXIST);
		}
	};

	// 获取大厅列表(包括一些附加信息,包括大厅人数,大厅的状态)
	publicHandler.getHallList = function(next){
		console.log('getHallList>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
		var self = this;
		var hallList = self._getHallPlayerList();
		next(null,hallList);
	};

	


	return cls;

}).call(this);



module.exports = function(app) {
	return new Handler(app);
};