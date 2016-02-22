var _ = require('underscore');
var Player = require('./player');

var Handler = (function() {
	var cls = function() {
		this.playerList = [];
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static
	var _ins;
	staticHandler.create = function() {
		return _ins || (_ins = new cls());
	};

	// private
	// mock database
	var database = [{
		username: 'dino',
		pwd: ''
	}, {
		username: 'tongjinle',
		pwd: 'shanghai'
	}];

	// public
	publicHandler.add = function(username, pwd, next) {
		var self = this;
		var flag = false;
		var data = _.find(database, function(n) {
			return n.username == username && n.pwd == pwd;
		});
		var p = self.find(username);
		// mock
		setTimeout(function() {
			if (data && !p) {
				p = new Player(username);
				self.playerList.push(p);
				next(null, p);
			} else {
				next(true);
			}
		}, Math.random() * 600);
	};

	publicHandler.remove = function(username, next) {
		var self = this;
		var p = self.find(username);
		console.warn('playerMgr.remove', username, p);
		setTimeout(function() {
			if (p) {
				self.playerList = _.filter(self.playerList, function(n) {
					return n!=p;
				});
				console.warn('playerMgr.remove-2', self.playerList);
				next(null, p);
			} else {
				next(true);
			}
		}, Math.random() * 600);
	};

	publicHandler.find = function(name) {
		var self = this;
		if (name === undefined) {
			return self.playerList;
		}
		var p = _.find(self.playerList, function(n) {
			return n.name == name;
		});
		return p;
	};

	return cls;

}).call(this);

module.exports = Handler;