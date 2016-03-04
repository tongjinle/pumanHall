var Player = require('../logic/player');
var PlayerMgr = require('../logic/playerMgr');
describe('',function(){
	var mgr;
	beforeEach(function(){
		mgr = new PlayerMgr();
		mgr._database = [
			{username: 'dino', pwd: 'test123'},
			{username: 'dino2', pwd: 'test123'},
			{username: 'dino3', pwd: 'test123'},
			{username: 'dino4', pwd: 'test123'},
			{username: 'dino5', pwd: 'test123456'}
		];
	});

	it('test',function(){
		expect(1).toBe(1);
	});

	it('add player',function(){
		var mgr = new PlayerMgr();
		mgr.add('dino','test123',function(err,data){
			expect(err).toBeFalsy();
		});

		mgr.add('dino2','null',function(err,data){
			console.log(err);
			expect(err).toBeTruly2();
		});
	});

	it('remove player',function(){

	});
});