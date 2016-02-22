var pomelo = window.pomelo;
var host = "127.0.0.1";
var port = "3010";

var playerList = [];

function init(next) {
	pomelo.init({
		host: host,
		port: port,
		log: true
	}, function() {
		next();
	});
}

function initPushMessage(){
	pomelo.on('addPlayer',function(p){
		playerList.push(p);
		console.warn('after addPlayer->',playerList);
	});

	pomelo.on('removePlayer',function(p){
		playerList = _.filter(playerList,function(n){
			return n.name != p.name;
		});
		console.warn('after removePlayer->',playerList);
	});
}

function login(){

	var route = 'connector.entryHandler.entry';
	var msg = {
		username: 'tongjinle',
		pwd: 'shanghai'
	};
	pomelo.request(route, msg, function(data) {
		console.warn(data);
	});
}

function logout(){
	var route = 'user.userHandler.logout';
	var msg = {};
	pomelo.request(route,msg,function(data){
		console.warn(data);
	});
}

function listAll(){
	var route = 'user.userHandler.getPlayerList';
	var msg = {};
	pomelo.request(route,msg,function(data){
		console.warn('getPlayerList:',data);
	});
}


window.onload = function(){
	init(function(){
		console.log('pomelo init');

		initPushMessage();
	});
};