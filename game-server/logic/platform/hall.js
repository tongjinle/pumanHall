var _ = require('underscore');
var Hall = (function(){
	var cls = function(gameName,status) {
		this.id = _.uniqueId();
		this.roomIdList = [];
		this.playerIdList = [];
		this.status = status || 'close';
		this.gameName = gameName;
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;
	// static
	// private

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

	publicHandler.addPlayer = function(pId){
		this.playerIdList.push(pId);
		this.playerIdList = _.uniq(this.playerIdList);
	};


	publicHandler.removePlayer = function(pId){
		this.playerIdList = _.without(this.playerIdList,function(n){ return n == pId;});
	};

	return cls;

}).call(this);

