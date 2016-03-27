var Handler = (function(){
	var cls = function(app) {
		this.app = app;
		this.list = [];

		console.log('platformService');
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static

	// private

	// public
	publicHandler.addUser = function(uid){
		var self = this;
		self.list.push(uid);
		
		// self.app.rpc.

		console.log(self.list);


	};

	publicHandler.removeUser = function(){
		var self = this;
	}; 


	return cls;

}).call(this);


module.exports = function(app){
	return new Handler(app);
};