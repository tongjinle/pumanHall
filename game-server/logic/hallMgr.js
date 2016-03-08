// 大厅管理者
var _ = require('underscore');
var Hall = require('./hall');
var Dict = require('./dict');

var HallMgr = (function(){
	var cls = function() {
		this.hallList = new Dict();
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static

	// private

	// public
	// 创建一个大厅
	publicHandler.addHall = function(hallName,gameName,status){
		var self = this;
		var hall = new Hall(hallName,gameName,status);
		return self.hallList.add(hall.name,hall);
	};

	// 切换大厅status
	publicHandler.changeStatus = function(hallName,status){
		var self = this;
		var hall = self.hallList.get(hallName);
		return hall && hall.changeStatus(status);
	};

	// 删除一个大厅
	publicHandler.removeHall = function(hallName){
		var self = this;
		return self.hallList.remove(hallName);
	};

	// 返回大厅
	publicHandler.find = function(hallName){
		var self = this;
		return self.hallList.get(hallName);
	};

	return cls;

}).call(this);


module.exports = HallMgr;