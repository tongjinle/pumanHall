// 房间
var GameFactory = require('./gameFactory');
var _ = require('underscore');

var Room = (function(){
	var cls = function(hallId,gameName) {
		this.id = _.uniqueId();
		this.status = CONF.ROOM_STATUS.OPEN;
		this.hallId = hallId;
		this.gameName = null;
		this.playerList = [];
		this.game = GameFactory.create(this.gameName);
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static
	
	// private

	// public
	// 修改状态

	// 增加玩家

	// 删除玩家

	// 玩家修改状态


	// 发送信息到游戏逻辑,并且从游戏逻辑获取处理结果
	publicHandler.send = function(msg){
		return this.game.accpet(msg);
	};


	return cls;

}).call(this);

module.exports = Room;