var EventProxy = require('eventproxy');

var Handler = (function() {
	var cls = function(app) {
		this.app = app;
		this.ep = null;
		this.listen();
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static

	// private

	// public
	publicHandler.listen = function() {
		var self = this;
		self.ep = new EventProxy();

		self.ep.on('onEnter', function(data) {
			data.session.bind(data.username);
			self.app.rpc.user.userRemote.login(data.session, data.username, data.pwd, data.sid, function(err,info) {
				console.warn(err,info);
				data.next(null, info);
			});
		});
	};


	publicHandler.entry = function(msg, session, next) {
		var self = this;
		self.ep.fire('onEnter', {
			username: msg.username,
			pwd: msg.pwd,
			session: session,
			sid: self.app.get('serverId'),
			next: next
		});
	};


	return cls;

}).call(this);

module.exports = function(app) {
	return new Handler(app);
};