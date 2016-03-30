var pomelo = require('pomelo');
var routeUtil = require('./app/util/routeUtil');
var PlatformService = require("./app/service/platformService");

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'pumanHall');

// app configuration
app.configure('production|development', 'connector', function(){
	app.set('connectorConfig',
		{
			connector : pomelo.connectors.hybridconnector,
			heartbeat : 3,
			useDict : true,
			useProtobuf : true
		});
});

app.configure('production|development', 'gate', function(){
	app.set('connectorConfig',
		{
			connector : pomelo.connectors.hybridconnector,
			useProtobuf : true
		});
});

app.configure('production|development', 'platform', function(){
	app.set('platformService',new PlatformService());
});

app.configure('production|development', 'hall', function(){
	var self = this;
	console.error('app.curServer');
	console.error(app.curServer);
	var server = app.curServer;

});


// route
app.route('hall',routeUtil.hall);


// start app
app.start();

process.on('uncaughtException', function (err) {
	console.error(' Caught exception: ' + err.stack);
});
