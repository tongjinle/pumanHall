var Handler = (function(){
	var cls = function() {
		this.playerList = [];	
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static
	var _ins;
	staticHandler.create = function(){
		return _ins || (_ins = new cls());
	};

	// private
	// mock database
	var database = [
		{username:'dino',pwd:''},
		{username:'tongjinle',pwd:'shanghai'}
	];

	// public
	publicHandler.add= function(username,pwd,next){
		var flag = false;
		var data = _.find(database,function(n){return n.username==username && n.pwd == pwd;});
		var p = _.find(this.playerList,function(n){return n.username == username; });
		// mock
		setTimeout(function(){
			if(data && !p){
				p = new Player(username);
				this.playerList.push(p);
				next(null,p);
			}else{
				next(true);
			}
		},Math.random()*600);
	};

	publicHandler.remove = function(id,next){
		var p = _.find(this.playerList,function(n){return n.id == id;});
		setTimeout(function(){
			if(p){
				this.playerList = _.without(this.playerList,function(n){return n==p;});
				next(null,p);
			}else{
				next(true);
			}
		},Math.random()*600);
	};

	publicHandler.find = function(id){
		var p = _.find(this.playerList,function(n){return n.id == id;});
		return p;
	};


	

	return cls;

}).call(this);
