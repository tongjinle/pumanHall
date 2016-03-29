var async = require('async');
var _ = require('underscore');
// var userRemote = require('../remote/userRemote');


var Handler = (function(){
	var cls = function(app) {
		this.app = app;
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static

	// private

	// public
	publicHandler.getUserList = function(msg,session,next){
		var self = this;
		self.app.rpc.platform.platformRemote.getUserList(session,next);
		return;
	};

	publicHandler.logout = function(msg,session,next){
		var self = this;
		var uid = session.uid;
		
		async.series([
			function(cb){
				session.unbind(uid,cb);
			},
			function(cb){
				self.app.rpc.platform.platformRemote.removeUser(session,uid,cb);
			}
		],function(err,data){
			next(null,{code:err?500:200,err:err,data:data});
		});
	};

	publicHandler.update = function(msg,session,next){
		var self = this;
		var username = session.uid;
		var changes = msg;
		self.app.rpc.platform.platformRemote.update(session,username,changes,next);

	};

	return cls;

}).call(this);

module.exports = function(app){
	return new Handler(app);
};	