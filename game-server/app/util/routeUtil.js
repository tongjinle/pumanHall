var _ = require('underscore');

var exp = module.exports;

exp.hall = function(hallName, msg, app, cb) {
	var self = this;
	cb(null, _.find(self.app.getServersByType('hall'),function(n){return n.hallName == hallName;}));
};
