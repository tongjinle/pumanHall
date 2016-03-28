'use strict'
var Dict = require('../domain/dict');

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
		self.userList.add(uid);
		
		

		console.log(self.userList);


	};

	publicHandler.removeUser = function(uid){
		var self = this;
		self.userList.remove(uid);
	}; 


	return cls;

}).call(this);


module.exports = function(app){
	return new Handler(app);
};