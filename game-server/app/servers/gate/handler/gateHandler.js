'use strict'

var dispatch = require('../../../util/dispatcher').dispatch;
class Gate{
	constructor(app){
		this.app = app;
	}

	queryEntry(msg,session,next){
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
		// here we just start `ONE` connector server, so we return the connectors[0] 
		var res = dispatch(uid,connectors);
		next(null, {
			code: 200,
			host: res.host,
			port: res.clientPort
		});
	}
}

module.exports = function(app){
	return  new Gate(app);
};