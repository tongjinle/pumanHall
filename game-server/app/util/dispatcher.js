var crc = require('crc');

var dispatch = function(uid,list){
	var index = crc.crc32(uid)%list.length;
	return list[index];
};


module.exports.dispatch = dispatch;