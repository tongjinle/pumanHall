var _ = require('underscore');
var Hall = (function(){
	var cls = function(hallName,gameName,status) {
		this.id = _.uniqueId();
		this.roomIdList = [];
		this.playerIdList = [];
		this.status = status || 'open';
		this.gameName = gameName;
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;
	// static
	// private
	function find

	// public
	publicHandler.open = function(){
		this.status = 'open';
	};

	publicHandler.close = function(){
		this.status = 'close';
	};

	publicHandler.addRoom = function(roomId){
		this.roomIdList.push(roomId);
		this.roomIdList = _.uniq(this.roomIdList);
	};

	publicHandler.removeRoom = function(roomId){
		this.roomIdList = _.without(this.roomIdList,function(n){return n == roomId;});
	};

	// 增加一个玩家
	publicHandler.addPlayer = function(pId){
		if(!this.findPlayer(pId)){
			this.playerIdList.push(pId);
			return true;
		}
		return false;
	};

	// 删除一个玩家
	publicHandler.removePlayer = function(pId){
		if(this.findPlayer(pId)){
			this.playerIdList = _.without(this.playerIdList,function(n){ return n == pId;});
			// 同时从各个房间中
			_.each(this.roomIdList,function(){
				
			});
			var p = playerMgr.getPlayer(pId);
			p.quitRoom
			return true;
		}
		return false;
	};

	publicHandler.findPlayer = function(pId){
		return _.find(this.playerIdList,function(n){return pId == n;});
	};

	return cls;

}).call(this);

module.exports =  Hall;