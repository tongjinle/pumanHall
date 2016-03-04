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
	var database = publicHandler._database = [
		{username: 'dino', pwd: 'test123'},
		{username: 'dino2', pwd: 'test123'},
		{username: 'dino3', pwd: 'test123'},
		{username: 'dino4', pwd: 'test123'},
		{username: 'dino5', pwd: 'test123456'}
	];

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
		}, Math.random() *300);
	};

	publicHandler.remove = function(username, next) {
		var self = this;
		var p = self.find(username);
		console.warn('playerMgr.remove', {'wantToDel':username,'ins': p});
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
		}, Math.random() * 300);
	};

	publicHandler.find = function(username) {
		var self = this;
		if (username === undefined) {
			return self.playerList;
		}
		var p = _.find(self.playerList, function(n) {
			return n.name == username;
		});
		return p;
	};

	publicHandler.update = function(username,changes,next){
		var self = this;
		var p = this.find(username);
		if(p){
			_.each(changes,function(v,k){
				p[k]=v;
			});
			next(null,p);
		}else{
			next(true);
		}
	};

	return cls;

}).call(this);

module.exports = Handler;