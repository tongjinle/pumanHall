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
			playerList:{
				id:Number,
				name:String,
				hallId:Number,
				hallName:String,
				roomId:Number,
				roomName:String,
				gameName:String,
				gameStatus:GAME_STATUS
			}[]
		}

		** GAME_STATUS:{UNREADY,READY,PLAYING}

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
			username?:String
		}
	* 登出
	-> logout()
		req:
		{}
		res:
		{
			flag:Boolean
		}
		-> broadcast 
		通知玩家登出
		如果玩家在大厅,则大厅发出"退出大厅"的广播
		如果玩家在房间,则房间发出"退出房间"的广播
	* 改变状态
	-> update()
		req:
		{
			changes:{
				key:String,
				value:any
			}[]
		}


	
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
			playerList:{
				name:String,
				gameStatus:GAME_STATUS,
				seatIndex:Number
			}[],
			emptySeatIndex;Number[]
		}

		** ROOM_STATUS{OPEN,CLOSE}

	* 获取玩家信息
		-> getPlayerList()
		req: {}

		res:
		{
			playerList:{
				id;Number,
				name:String,
				gameStatus;GAME_STATUS
			}[]
		}

		** 进入大厅之后,才可以做的查询,所以不需要传hallId

roomHandler
	* 获取玩家信息
		-> getPlayerList()
		req: {}
		res:
		{
			playerList:{
				id;Number,
				name:String,
				seatIndex:Number,
				gameStatus;GAME_STATUS,
				extInfo:{}
			}[]
		}

		** 进入房间之后,才可以做的查询,所以不需要传roomId

	* 准备游戏
		-> beReady()
		req: {}
		res:
		{
			flag:Boolean,
			gameStatus:GAME_STATUS
		}

		** 把gameStatus设置成GAME_STATUS.READY

	* 取消游戏准备
		-> beUnReady()
		req: {}
		res:
		{
			flag:Boolean,
			gameStatus:GAME_STATUS
		}

		** 把gameStatus设置成GAME_STATUS.UNREADY

	* 换位置
		-> changeSeat()
		req:{
			seatIndex:Number
		}
		res:{
			flag:Boolean,
			seatIndex:Number
		}

	* 发送action给游戏逻辑
		-> sendActMsg()
		req:{
			actionName:string,
			params:{}
		}

		res:{
			flag:Boolean
		}
		-> broadcast 通知玩家去update游戏状态

		** 此处把平台跟具体的游戏逻辑分割,client把msg发送给具体的room,而room作为中介者,再把msg发送给相关的游戏逻辑实例

	* 放弃游戏
		-> quitGame()
		req: {}
		res:
		{
			flag:Boolean
		}
		-> broadcast 通知玩家有玩家退出游戏
	
hallRemote
	* 进入大厅
		-> enterHall()
		req:
		{
			hallId:Number
		}
		res:
		{
			flag:Boolean
		}
		-> broadcast 通知其他玩家大厅人数的改变
		{
			id:Number,
			name:String
		}
	* 退出大厅 
		-> quitHall()
		req: {}
		res:
		{
			flag:Boolean
		}
		-> broadcast 通知其他玩家大厅人数的改变(格式同上)

roomRemote
	* 进入房间
		-> enterRoom()
		req:
		{
			roomId:Number,
			seatIndex?:Number
		}
		res:
		{
			flag:Boolean
		}

		-> broadcast 通知其他玩家房间人数的改变
		{
			id:Number,
			name:String,
			seatIndex:Number
		}

		** 这里暂时不考虑"观看者"角色

	* 退出房间
		-> quitRoom()
		req: {}
		res:
		{
			flag:Boolean
		}
		-> broadcast 通知其他玩家房间人数的改变(同上)

