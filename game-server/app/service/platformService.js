'use strict'
var Dict = require('../domain/dict');
var User = require('../domain/user');

var Handler = (function(){
	var cls = function(app) {
		this.app = app;
		this.userList = new Dict();

		console.log('platformService');
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static

	// private

	// public
	publicHandler.addUser = function(uid,sid){
		var self = this;
		self.userList.add(uid,new User(uid));
		
		console.log(self.userList);
	};

	publicHandler.removeUser = function(uid){
		var self = this;
		self.userList.remove(uid);
	};

	publicHandler.getUser = function(uid){
		var self = this;
		return self.userList.get(uid);
	}; 


	return cls;

}).call(this);


module.exports = function(app){
	return new Handler(app);
};