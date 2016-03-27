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
	publicHandler.addUser = function(uid,sid){
		var self = this;
		self.list.push(uid);
		
		// self.app.rpc.
		self.app.rpc.message.messageRemote.addUser('platformChannel',uid,sid,)

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