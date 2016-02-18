-- 服务器设计 --

1 user server (用户信息服务器)
userHandler
	* 查询玩家信息
	-> getPlayerList()


userRemote
	* 登录
	-> login()
	* 登出
	-> logout()
	* 
	-> getMember()
	** userName忽略的时候,返回所有玩家信息
	
2 hall server (大厅服务器)
hallHandler
	* 获取房间列表
		-> getRoomList()
	* 获取玩家信息
		-> getPlayerList()
roomHandler
	* 获取玩家信息
		-> getPlayerList()
	* 准备游戏
		-> beReady()
	
hallRemote
	* 进入大厅
		-> enterHall()
	* 退出大厅 
		-> quitHall()

roomRemote
	* 进入房间
		-> enterRoom()
	* 退出房间
		-> quitRoom()