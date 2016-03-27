'use strict';
var _ = require('underscore');

var Handler = (function(){
	var cls = function(app) {
		this.app = app;
		this.channelService = this.app.get('channelService');

		this.uidMap = {};
		this.channelMap  = {};

	};

	var staticHandler = cls;
	var publicHandler = cls.prototype;

	// static

	// private

	// public
	publicHandler.addUser = function(channelName,uid,sid,next){
		var self = this;

		// channel
		var channel = self.channelService.getChannel(channelName,true);
		channel.add(uid,sid);

		// uidMap
		self.setSidByUid(uid,sid);

		next();
	};


	publicHandler.removeUser = function(channelName,uid,next){
		var self = this;

		// channel
		var channel = self.channelService.getChannel(channelName);
		var sid = self.getSidByUid(uid);
		if(channel && sid && channel.getMember(uid)){
			channel.leave(uid,sid);
		}

		// uidMap
		if(self.uidMap[uid]){
			delete uidMap[uid];
		}

		next();
	};

	publicHandler.send = function(){};

	// channelMap
	// get && set
	publicHandler.getChannels = function(uid){
		var self = this;
		return self.channelMap[uid] = self.channelMap[uid] || [];
	};

	publicHandler.setChannels = function(uid,channels){
		var self = this;
		self.channelMap[uid] = channels;
	};
	publicHandler.addChannel = function(uid,channel){
		var self = this;
		var channels = self.getChannels(uid);
		if(!_.find(channels,function(ch){return ch == channel;})){
			channels.push(channel);
		}

	};
	publicHandler.removeChannel = function(uid,channel){
		var self = this;
		var channels = self.getChannels(uid);
		channels = _.filter(channels,function(ch){return ch != channel;});
		// import
		self.channelMap[uid] = channels;
	};
	




	// uidMap 
	// get && set
	publicHandler.setSidByUid = function (uid,sid) {
		var self = this;
		self.uidMap[uid] = sid;
	};

	publicHandler.getSidByUid = function(uid){
		var self = this;
		return self.uidMap[uid];
	};

	return cls;

}).call(this);




module.exports = function(app){
	return new Handler(app);
};