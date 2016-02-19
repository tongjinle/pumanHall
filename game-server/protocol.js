-- 服务器设计 --


1 user server (用户信息服务器)
userHandler
	* 查询玩家信息
	-> getPlayerList()
		req:
		{
			playerIdList:Number[]
		}
		res:
		{
			playerList:PlayerInfo[]
		}

		** PlayerInfo:
		{
			id:Number,
			name:String,
			hallId:Number,
			hallName:String,
			roomId:Number,
			roomName:String,
			gameName:String,
			gameStatus:GAME_STATUS
		}

		** GAME_STATUS:{READY,PLAYING,UNREADY}


		req:
		{

		}
		res:
		{

		}
userRemote
	* 登录
	-> login()
		req:
		{
			username:String,
			pwd:String
		}
		res:
		{
			flag:Boolean,
			id?:Number
		}
	* 登出
	-> logout()
		req:
		{}
		res:
		{
			flag:Boolean
		}
		+ broadcast
	
2 hall server (大厅服务器)
hallHandler
	* 获取房间列表
		-> getRoomList()
		req:
		{}
		res:
		{
			roomList:RoomInfo[]
		}

		** RoomInfo
		{
			id:Number,
			name:String,
			gameName:String,
			status:ROOM_STATUS,
			playerList:PlayerInfo[]
		}

		** ROOM_STATUS{OPEN,CLOSE}

	* 获取玩家信息
		-> getPlayerList()
		req:
		{

		}
		res:
		{

		}
roomHandler
	* 获取玩家信息
		-> getPlayerList()
		req:
		{

		}
		res:
		{

		}
	* 准备游戏
		-> beReady()
	* 发送action给游戏逻辑
		-> sendActMsg()
	* 放弃游戏
		-> quitGame()
		req:
		{

		}
		res:
		{

		}
	
hallRemote
	* 进入大厅
		-> enterHall()
		req:
		{

		}
		res:
		{

		}
	* 退出大厅 
		-> quitHall()
		req:
		{

		}
		res:
		{

		}

roomRemote
	* 进入房间
		-> enterRoom()
		req:
		{

		}
		res:
		{

		}
	* 退出房间
		-> quitRoom()
		req:
		{

		}
		res:
		{

		}
