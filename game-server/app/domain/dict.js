// 基础类
// playerMgr,hall,room在一定的程度上,都是list

var _ = require('underscore');

var Dict = (function(){
	var cls = function() {
		var self = this;

		self._dict = {};
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static

	// private

	// public
	

	// 获取符合条件的item
	publicHandler.get = function(key){
		var self = this;
		if(key === undefined){
			// 转换成array
			return _.map(self._dict,function(v,k){return v;});
		}else{
			return self._dict[key];
		} 
	};

	// 增加item
	publicHandler.add = function(key,value){
		var self = this;
		if(!self._dict[key]){
			self._dict[key]=value;
			return value;
		}
		return null;
	};

	// 删除item
	publicHandler.remove = function(key){
		var self = this;
		var item = self._dict[key];
		if(item){
			delete self._dict[key];
			return item;
		}
		return null;
	};

	// 获取item的数量
	publicHandler.count = function(){
		var self = this;
		return _.size(self._dict);
	};

	return cls;

}).call(this);

module.exports = Dict;
