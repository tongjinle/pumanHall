var _ = require('underscore');

var exp = module.exports;

exp.hall = function(session, msg, app, cb) {
	var hallName;
	if(_.isString(session)){
		hallName = session;
	}else{
		hallName = session.get('hallName');
	}
	var server = _.find(app.getServersByType('hall'),function(n){return n.hallName == hallName;});
	console.error('hallName -> hall.serverId');
	console.error(hallName,server);
	cb(null, server.id);
};
