var dispatch = require('../../../util/dispatcher').dispatch;

var Handler = (function(){
	var cls = function(app) {
		this.app = app;
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static

	// private

	// public
	publicHandler.queryEntry = function(msg,session,next){
		var uid = msg.uid;
		if(!uid) {
			next(null, {
				code: 500
			});
			return;
		}
		// get all connectors
		var connectors = this.app.getServersByType('connector');
		if(!connectors || connectors.length === 0) {
			next(null, {
				code: 500
			});
			return;
		}
		var res = dispatch(uid,connectors);
		next(null, {
			code: 200,
			host: res.host,
			port: res.clientPort
		});
	};

	return cls;

}).call(this);


module.exports = function(app){
	return  new Handler(app);
};