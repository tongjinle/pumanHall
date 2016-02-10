/**
* @author tongjinle <1328192478@qq.com>
*/
var _ = require('underscore');

var Hall = (function(){
	/**
	* 游戏大厅
	* @constructs Hall
	* @param {string} gameName - 大厅所对应的游戏名称
	* @param {string} [status='close'] - 大厅状态 默认为'close'
	*/
	var cls = function(gameName,status) {
		/**
		* 大厅唯一id
		* @member id
		* @memberof Hall.prototype
		*/
		this.id = _.uniqueId();
		/**
		* 大厅中房间id列表
		* @member roomIdList
		* @memberof Hall.prototype
		*/
		this.roomIdList = [];
		/**
		* 大厅中玩家id列表
		* @member playerIdList
		* @memberof Hall.prototype
		*/
		this.playerIdList = [];
		/**
		* 大厅状态,分为"开启"和"关闭"两个状态
		* @member status
		* @memberof Hall.prototype
		*/
		this.status = status || 'close';
		/**
		* 大厅对应的游戏
		* @member gameName
		* @memberof Hall.prototype
		*/
		this.gameName = gameName;
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static
	// private

	// public
	/**
	* 开启大厅
	* @public open
	* @methodof Hall.prototype
	*/
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

