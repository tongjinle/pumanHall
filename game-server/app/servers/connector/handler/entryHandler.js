var async = require('async');
var _ = require('underscore');

var Handler = (function(){
	var cls = function(app) {
		this.app = app;
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static

	// private

	// public
	publicHandler.login = function(msg,session,next){
		var self = this;
		var uid = msg.uid;
		var pwd = msg.pwd;
		var sid = self.app.get('serverId');

		session.on('closed',function(session){
			console.log('session closed:'+(session.uid+'').blue);
			self.logout(msg,session,function(){});
		});

		async.series(
		[
			// logout
			function(cb){
				self.logout(msg,session,cb);
			},
			// session
			function(cb){
				session.bind(uid);
				session.set('sid',sid);
				session.pushAll(cb);
			},
			// login
			function(cb){
				self.app.rpc.platform.platformRemote.addUser(session,uid,pwd,sid,cb);
			}
		],
		function(err,data){
			next(null,{code:err?500:200,err:err,data:data});
		}
		);
	};


	publicHandler.logout = function(msg,session,next){
		var self = this;
		var uid = session.uid;
		if(uid){
			async.series([
				function(cb){
					// console.error('session.unbind');
					// session.unbind(uid,cb);
					cb();
				},
				function(cb){
					console.error('platformRemote.removeUser');
					self.app.rpc.platform.platformRemote.removeUser(session,uid,cb);
				}
			],function(err,data){
				next(null,{code:err?500:200,err:err,data:data});
			});
			return;
		}
		next(null,{code:200});
	};

	return cls;

}).call(this);



module.exports = function(app) {
	return new Handler(app);
};

// var async = require('async');
// var EventProxy = require('eventproxy');
// var _ = require('underscore');

// var Handler = (function() {
// 	var cls = function(app) {
// 		this.app = app;
// 		this._ep = null;
// 		this._listen();
// 	};

// 	var staticHandler = cls;
// 	var publicHandler = cls.prototype;

// 	// static

// 	// private

// 	// public
// 	publicHandler._listen = function() {
// 		var self = this;
// 		self._ep = new EventProxy();

// 		self._ep.on('onLeave', function(data) {
// 			console.warn('session leave');
// 			self.app.rpc.user.userRemote.logout(data.session, data.username, data.session.get('sid'), null);
// 		});

// 		self._ep.on('onEnter', function(data) {
// 			var username = data.username;
// 			var pwd = data.pwd;
// 			var session = data.session;
// 			var sid = data.sid;
// 			var next = data.next;

// 			async.series([
// 				// userRemote logout
// 				function(cb){
// 					console.warn('userRemote logout');
// 					if(!session.uid){
// 						cb();
// 						return;
// 					}
// 					self.app.rpc.user.userRemote.logout(session, session.uid, session.get('sid'), cb);
// 				},
// 				// kick old uid
// 				function(cb){
// 					if(!session.uid){
// 						cb();
// 						return;
// 					}
// 					// self.app.get('sessionService').kick(session.uid,cb);
// 					console.warn('kick old uid:',session.uid);
// 					session.unbind(session.uid,cb);
// 				},
// 				function(cb){
// 					self.app.rpc.user.userRemote.getPlayerList(session,function(err,data){
// 						console.warn('userRemote getPlayerList:',_.map(data,function(n){return n.name;}));
// 						cb();
// 					});
// 				},
// 				// bind uid
// 				function(cb){
// 					console.warn('bind uid');
// 					session.bind(username,cb);
// 				},
// 				// push session
// 				function(cb){
// 					console.warn('push session');
// 					session.set('sid',sid);
// 					session.pushAll(cb);
// 				},
// 				// userRemote login
// 				function(cb){
// 					console.warn('userRemote login');
// 					self.app.rpc.user.userRemote.login(session, username, pwd, sid, cb);
// 				}
// 			],function(err,data){
// 				if(err){
// 					next(err,{code:500});
// 					return;
// 				}
// 				next(null,data[data.length-1]);
// 			});

// 			// // // 如果已经登陆,且现在用新的用户登陆,则优先退出老用户
// 			// if(!!data.session.uid){
// 			// 	dict.logout = function(cb){
// 			// 		console.log('登陆前先登出同名uid');
// 			// 		self.app.rpc.user.userRemote.logout(data.session, data.session.uid, data.session.get('sid'), function(){
// 			// 			data.session.unbind(data.session.uid);
// 			// 			cb();
// 			// 		});
// 			// 	};
// 			// }
// 			// dict.login = function(cb){
// 			// 	console.log('登陆');
// 			// 	data.session.bind(data.username);
// 			// 	data.session.set('sid', data.sid);
// 			// 	data.session.pushAll();
// 			// 	self.app.rpc.user.userRemote.login(data.session, data.username, data.pwd, data.sid, function(err, msg) {
// 			// 		console.warn('login rst ->',msg);
// 			// 		cb(null,msg);
// 			// 	});
// 			// };
// 			// async.series(dict,function(err,msg){
// 			// 	data.next(null,msg.login);
// 			// });

			
// 		});

		
// 	};


// 	publicHandler.entry = function(msg, session, next) {
// 		var self = this;
// 		var sid = self.app.get('serverId');
		

// 		session.on('closed', function(session) {
// 			self._ep.fire('onLeave', {
// 				username: session.uid,
// 				session: session,
// 			});
// 		});


// 		self._ep.fire('onEnter', {
// 			username: msg.username,
// 			pwd: msg.pwd,
// 			session: session,
// 			sid:sid,
// 			next: next
// 		});
// 	};


// 	return cls;

// }).call(this);

// module.exports = function(app) {
// 	return new Handler(app);
// };

