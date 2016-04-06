// 大厅是房间的"管理者"
var _ = require('underscore');
var Dict = require('./dict');
// var Room = require('./room');

var Hall = (function(){
	var cls = function(hallName,gameName,status) {
		this.id = _.uniqueId();
		this.name = hallName;
		this.roomList = new Dict();
		this.userList = new Dict();
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
	publicHandler.addUser = function(user){
		var self = this;
		var p = self.userList.add(user.name,user);
		return p;
	};

	// 删除一个玩家
	publicHandler.removeUser = function(username){
		var self = this;
		var p = self.userList.remove(username);
		return p;
	};

	// 寻找玩家
	publicHandler.getUser = function(username){
		var self = this;
		return self.userList.get(username);
	};


	// 返回信息
	publicHandler.getInfo = function(type){
		var self = this;
		type = type || 'platform.simple';

		var dict = {};
		dict['platform.simple'] = function(){
			return {
				hallName:self.name,
				gameName:self.gameName,
				status:self.status,
				userCount:self.userList.count()
			};
		};

		dict['hall.simple'] = function(){
			var userList = _.map(self.userList.get(),function(n){
				return {
					name:n.name,
					roomName:n.roomName,
					gameStatus:n.gameStatus
				};
			});
			// var roomList = _.map(self.roomList,function(n){
			// 	return {
			// 		name:n.name,
			// 		userCount:n.userList.length,
			// 		status:n.status
			// 	};
			// });
			var roomList = [];
			return {
				userList:userList,
				roomList:roomList
			};
		};

		return dict[type]();
	};

	return cls;

}).call(this);

module.exports =  Hall;