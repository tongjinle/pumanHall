var pomelo = window.pomelo;
var host = "127.0.0.1";
var port = "3010";

function show() {
  pomelo.init({
    host: host,
    port: port,
    log: true
  }, function() {
    var route = 'connector.entryHandler.entry';
    var msg = {
      username: 'tongjinle',
      pwd: 'shanghai'
    };
    pomelo.request(route, msg, function(data) {
      console.warn(data);
    });
  });
}