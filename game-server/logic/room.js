/*
	游戏房间
*/

var GameFactory = require('./gameFactory');
var _ = require('underscore');

var Room = (function(){
	var cls = function(app,hallId,gameName) {
		this.id = _.uniqueId();
		this.status = CONF.ROOM_STATUS.OPEN;
		this.hallId = hallId;
		this.gameName = null;
		this.channel = app.get('channelService').getChannel(this.id,true);		
		this.playerList = [];
		this.game = GameFactory.create(this.gameName);
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static
	
	// private

	// public

	// 发送信息到游戏逻辑
	publicHandler.sendToGame = function(msg){
		this.game.accpet(msg);
	};

	// 发送信息给客户端
	publicHandler.send = function(msg){
		if(msg.isBroadcast){
			this.channel.push(msg);
		}else{

		}
	};

	// 接收来自客户端的信息
	publicHandler.accpet = function(msg,session)



	return cls;

}).call(this);

module.exports = Room;