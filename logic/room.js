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
		* @memberof Hall#
		*/
		this.id = _.uniqueId();
		/**
		* 大厅中房间id列表
		* @member roomIdList
		* @memberof Hall#
		*/
		this.roomIdList = [];
		/**
		* 大厅中玩家id列表
		* @member playerIdList
		* @memberof Hall#
		*/
		this.playerIdList = [];
		/**
		* 大厅状态,分为"开启"和"关闭"两个状态
		* @member status
		* @memberof Hall#
		*/
		this.status = status || 'close';
		/**
		* 大厅对应的游戏
		* @member gameName2
		* @memberof Hall#
		*/
		this.gameName = gameName;
	};

	var staticHandler = cls;

	// static
	// private

	// public
	/**
	* 开启大厅
	* @methodof Hall#
	*/
	cls.prototype.open = function(){
		this.status = 'open';
	};

	/**
	* 关闭大厅
	* @methodof Hall#
	*/
	cls.prototype.close = function(){
		this.status = 'close';
	};

	/**
	* 增加房间
	* @methodof Hall#
	* @param {number} roomId - 房间编号
	*/
	cls.prototype.addRoom = function(roomId){
		this.roomIdList.push(roomId);
		this.roomIdList = _.uniq(this.roomIdList);
	};

	/**
	* 删除房间
	* @methodof Hall#
	* @param {number} roomId - 房间编号
	*/
	cls.prototype.removeRoom = function(roomId){
		this.roomIdList = _.without(this.roomIdList,function(n){return n == roomId;});
	};

	/**
	* 增加玩家
	* @methodof Hall#
	* @param {number} pId - 玩家编号
	*/
	cls.prototype.addPlayer = function(pId){
		this.playerIdList.push(pId);
		this.playerIdList = _.uniq(this.playerIdList);
	};


	/**
	* 删除玩家
	* @methodof Hall#
	* @param {number} pId - 玩家编号
	*/
	cls.prototype.removePlayer = function(pId){
		this.playerIdList = _.without(this.playerIdList,function(n){ return n == pId;});
	};

	return cls;

}).call(this);

