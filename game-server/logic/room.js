// 房间
var _ = require('underscore');
var Dict = require('./dict');
var GameFactory = require('./gameFactory');

var Room = (function(){
	var cls = function(hallId,gameName) {
		this.id = _.uniqueId();
		this.status = 'waiting';
		this.hallId = hallId;
		this.gameName = gameName;
		this.playerList = new Dict();
		this.game = GameFactory.create(this.gameName);
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static
	
	// private

	// public
	// 修改状态
	publicHandler.changeStatus = function(status){
		var self = this;
		self.status = status;
	};

	// 增加玩家
	publicHandler.addPlayer = function(player){
		var self = this;
		return self.playerList.add(player.name,player);
	};	

	// 删除玩家
	publicHandler.removePlayer = function(username){
		var self = this;
		return self.playerList.remove(username);
	};

	// 修改玩家状态
	publicHandler.changePlayerStatus = function(username,status){
		var self = this;
		var p = self.playerList.get(username);
		p.status = status;
		return p;
	};	


	// 发送信息到游戏逻辑,并且从游戏逻辑获取处理结果
	publicHandler.send = function(msg){
		var self = this;
		return self.game.accpet(msg);
	};


	return cls;

}).call(this);

module.exports = Room;