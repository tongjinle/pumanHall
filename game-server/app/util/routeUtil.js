var _ = require('underscore');

var exp = module.exports;

exp.hall = function(hallName, msg, app, cb) {
	var server = _.find(app.getServersByType('hall'),function(n){return n.hallName == hallName;});
	console.error('hallName -> hall.serverId');
	console.error(hallName,server);
	cb(null, server.id);
};
