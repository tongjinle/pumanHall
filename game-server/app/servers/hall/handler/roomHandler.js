var Handler = (function(){
	var cls = function(app) {
		this.app = app;
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static

	// private

	// public
	// 进入房间
	publicHandler.enterRoom = function(msg,session,next) {
		var pId = session.uid;
		var roomId = msg.roomId;
		var p = playerMgr.getPlayer(pId);
		var rst = p.enterRoom(roomId);
		next(null,rst);
	};

	// 准备游戏
	publicHandler.beReady = function(msg,session,next){
		var pId = session.uid;
		var p = playerMgr.getPlayer(pId);
		var rst = p.beReady();
		next(null,rst);
	};


	// 强行退出游戏
	publicHandler.quitGame = function(msg,session,next){
		var pId = session.uid;
		var p = playerMgr.getPlayer(pId);
		var info = p.quitGame();
		next(null,info);
	};

	// 退出房间
	publicHandler.quitRoom = function(msg,session,next){
		var 
	};

	return cls;

}).call(this);
