var _ = require('underscore');
var Dict = require('./dict');
var Player = require('./player');

var Handler = (function() {
	var cls = function() {
		this.playerList = new Dict();
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
		var p = new Player(username);
		// mock
		setTimeout(function() {
			if (data && self.playerList.add(p.name,p)) {
				next(null, p);
			} else {
				next(true);
			}
		}, Math.random() *300);
	};

	publicHandler.remove = function(username, next) {
		var self = this;
		var p = self.playerList.remove(username);
		setTimeout(function() {
			if (p) {
				next(null, p);
			} else {
				next(true);
			}
		}, Math.random() * 300);
	};

	publicHandler.find = function(username) {
		var self = this;
		return self.playerList.get(username);
	};

	publicHandler.update = function(username,changes,next){
		var self = this;
		var p = self.find(username);
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