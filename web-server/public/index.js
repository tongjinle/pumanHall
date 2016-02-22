var pomelo = window.pomelo;
var host = "127.0.0.1";
var port = "3010";

function init() {
	pomelo.init({
		host: host,
		port: port,
		log: true
	}, function() {
		console.log('pomelo init');
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
	init();
};