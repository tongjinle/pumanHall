// 房间
var _ = require('underscore');
var Dict = require('./dict');
var GameFactory = require('./gameFactory');

var Room = (function(){
	var cls = function(hallName,gameName) {
		this.id = _.uniqueId();
		// 0 -> wait
		// 1 -> run
		this.status = '0';
		this.hallName = hallName;
		this.gameName = gameName;
		this.userList = new Dict();
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
	publicHandler.addPlayer = function(user){
		var self = this;
		return self.userList.add(user.name,user);
	};	

	// 删除玩家
	publicHandler.removePlayer = function(username){
		var self = this;
		return self.userList.remove(username);
	};

	// 修改玩家状态
	publicHandler.changePlayerStatus = function(username,status){
		var self = this;
		var p = self.userList.get(username);
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