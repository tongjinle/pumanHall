var Handler = (function(){
	var cls = function(app) {
		this.app = app;
		this.list = [];
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static

	// private

	// public
	publicHandler.addUser = function(uid){
		var self = this;
		self.list.push(uid);
		console.log(self.list);
	};


	return cls;

}).call(this);


module.exports = function(app){
	return new Handler(app);
};