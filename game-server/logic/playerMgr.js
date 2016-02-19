var Handler = (function(){
	var cls = function() {
		this.playerList = [];	
	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static

	// private
	var database = [
		{id:1000,username:'dino',pwd:''},
		{id:1001,username:'tongjinle',pwd:'shanghai'}
	];

	// public
	publicHandler.add= function(user,pwd,next){
		var flag = false;
		var player = _.find(database,function(n){return n.username==username && n.pwd == pwd;});
		setTimeout(function(){
			if(player){
				this.playerList.push(new Player)
			}
			player ? next(null,player) : next(true);
		},Math.random()*600);
	};

	publicHandler.remove = 

	

	return cls;

}).call(this);
