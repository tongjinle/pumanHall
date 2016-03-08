// 大厅是房间的"管理者"
var _ = require('underscore');
var Dict = require('./dict');
var Room = require('./room');

var Hall = (function(){
	var cls = function(hallName,gameName,status) {
		this.id = _.uniqueId();
		this.roomList = new Dict();
		this.playerList = new Dict();
		this.status = status || 'open';
		this.gameName = gameName;
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;
	// static
	// private

	// public

	// 修改hall的状态
	// 只有open和close
	publicHandler.changeStatus = function(status){
		this.status = status;
	};

	// 增加房间
	publicHandler.addRoom = function(gameName){
		var self = this;
		var room = new Room(self.id,self.gameName);
		room =  self.roomList.add(room.id,room);
		// 触发
		// room && room.afterAdd && room.afterAdd();
		return room;
	};

	// 移除房间
	publicHandler.removeRoom = function(roomId){
		var self = this;
		var room = self.roomList.remove(roomId);		
		// room && room.afterRemove && room.afterRemove();
		return room;
	};

	// 增加一个玩家
	publicHandler.addPlayer = function(player){
		var self = this;
		var p = self.playerList.add(player.name,player);
		return p;
	};

	// 删除一个玩家
	publicHandler.removePlayer = function(username){
		var self = this;
		var p = self.playerList.remove(username);
		return p;
	};

	// 寻找玩家
	publicHandler.findPlayer = function(username){
		return self.playerList.get(username);
	};

	return cls;

}).call(this);

module.exports =  Hall;