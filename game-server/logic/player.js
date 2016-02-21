var _ = require('underscore');
var GAME_STATUS = require('./enums').GAME_STATUS;

var Handler = (function(){
	var cls = function(username) {
		this.id = _.uniqueId();
		this.name = username;
		this.hallId = -1;
		this.hallName = null;
		this.roomId = -1;
		this.roomName = null;
		this.gameName = null;
		this.gameStatus = GAME_STATUS.NONE;
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static

	// private

	// public

	return cls;

}).call(this);

module.exports = Handler;	