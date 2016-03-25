'use strict';

var channelMap = {};
// uid mapTo sid
var uidMap = {};

class messageRemote{
	constructor(app){
		this.app = app;
		this.channelService = this.app.get('channelService');
	}

	addUser(channelName,uid,sid,next){
		// uidMap
		uidMap[uid] = sid;
		// channel
		var channel = this.channelService.getChannel(channelName,true);
		channel.add(uid,sid);

		next(null);
	}

	removeUser(uid,next){
		// uidMap
		var sid = uidMap[uid];
		delete uidMap[uid];

		// channel
	}

	send(channelName,uids,msg,next){

	}

}



module.exports = function(app){
	return new messageRemote(app);
};