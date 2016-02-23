var async = require('async');
var EventProxy = require('eventproxy');

var Handler = (function() {
	var cls = function(app) {
		this.app = app;
		this._ep = null;
		this._listen();
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static

	// private

	// public
	publicHandler._listen = function() {
		var self = this;
		self._ep = new EventProxy();

		self._ep.on('onEnter', function(data) {
			console.warn('>>>onEnter',data.session.uid);
			var dict = {};
			// 如果已经登陆,且现在用新的用户登陆,则优先退出老用户
			if(!!data.session.uid && data.session.uid !=data.username){
				dict.logout = function(cb){
					self.app.rpc.user.userRemote.logout(data.session, data.session.uid, data.session.get('sid'), function(){
						cb();
					});
				};
			}
			dict.login = function(cb){
				self.app.rpc.user.userRemote.login(data.session, data.username, data.pwd, data.sid, function(err, msg) {
					console.warn('login rst ->',msg);
					if (msg.flag) {
						data.session.bind(data.username);
						data.session.set('sid', data.sid);
						data.session.push('sid', function(err) {
							if (err) {
								console.error('set sid for session service failed! error is : %j', err.stack);
							}
						});
					}
					cb(null,msg);
				});
			};
			async.series(dict,function(err,msg){
				data.next(null,msg.login);
			});
		});

		self._ep.on('onLeave', function(data) {
			self.app.rpc.user.userRemote.logout(data.session, data.username, data.session.get('sid'), null);
		});
	};


	publicHandler.entry = function(msg, session, next) {
		var self = this;
		var sid = self.app.get('serverId');
		

		session.on('closed', function(session) {
			self._ep.fire('onLeave', {
				username: session.uid,
				session: session,
			});
		});


		self._ep.fire('onEnter', {
			username: msg.username,
			pwd: msg.pwd,
			session: session,
			sid:sid,
			next: next
		});
	};


	return cls;

}).call(this);

module.exports = function(app) {
	return new Handler(app);
};