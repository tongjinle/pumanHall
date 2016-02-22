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
			data.session.bind(data.username);
			self.app.rpc.user.userRemote.login(data.session, data.username, data.pwd, data.session.get('sid'), function(err, msg) {
				data.next(null, msg);
			});
		});

		self._ep.on('onLeave', function(data) {
			self.app.rpc.user.userRemote.logout(data.session, data.username, data.session.get('sid'), null);
		});
	};


	publicHandler.entry = function(msg, session, next) {
		var self = this;
		var sid = self.app.get('serverId');
		session.set('sid', sid);
		session.push('sid', function(err) {
			if (err) {
				console.error('set sid for session service failed! error is : %j', err.stack);
			}
		});

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
			next: next
		});
	};


	return cls;

}).call(this);

module.exports = function(app) {
	return new Handler(app);
};