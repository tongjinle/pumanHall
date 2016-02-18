var Hall = require('../../../logic/platform/hall');



var Handler = (function() {
	var cls = function(app) {
		this.app = app;

		var hallName = 'gameHall001';
		var gameName = 'Texas Poker';
		var status = 'open';
		var roomCount = 30;
		this._init({hallName,gameName,status,roomCount});

		this.channel = app.get('channelService').get(hallName,true);
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static

	// private
	publicHandler._broadcastInHall(msg){
		this.channel.push('hallBroadcast',msg);
	};

	// public
	// 初始化大厅
	publicHandler._initHall = function(opts){
		if(this._init){return;}
		this._init = true;
		this.hall = new Hall(opts.hallName, opts.gameName);
		hall.setStatus(opts.status || 'open');
		var roomCount = opts.roomCount || 0;
		while(roomCount--){
			this.hall.createRoom();
		}
	};


	// 进入大厅
	publicHandler.enterHall = function(msg, session, next) {
		var pId = session.uid;
		var p = playerMgr.getPlayer(pId);
		var rst = p.enterHall();
		next(null, rst);

		var msg = {
			player: {
				id: p.id,
				name: p.name
			},
			hall:{
				id:this.id,
				name:this.name
			}
		};
		this._broadcastInHall("onEnterHall",msg);
	};

	// 获取大厅游戏房间列表
	publicHandler.getRoomList = function(msg, session, next) {
		var roomList = _.map(this.hall.roomIdList,function(n){return roomMgr.getRoom(n);});
		next(null,{roomList:JSON.stringify(roomList)});
	};


	// 退出大厅
	publicHandler.quitHall = function(msg,session,next){
		var pId = session.uid;
		var p = playerMgr.getPlayer(pId);
		var rst = p.quitHall();

		next(null,rst);
		var msg = {
			player: {
				id: p.id,
				name: p.name
			},
			hall:{
				id:this.id,
				name:this.name
			}
		};
		this._broadcastInHall("onQuitHall",msg);
	};



	return cls;

}).call(this);

module.exports = function(app) {
	return new Handler(app);
};