/**
 * Created by zhy on 16/7/4.
 */
function Service() {
	var self = this;

	var user = require('../Data/User');
	var restaurant = require('../Data/Restaurant');
	var menu = require('../Data/Menu');
	var order = require('../Data/Order');

	//用户登录
	this.userLogin = function (req, res) {
		//搜索用户名称
		user.searchByPhone(req.body.phone,  res,  function (rows) {
			if (rows[0].password != req.body.password) {
				res.send(-2);   //-2: password error
				return;
			}
			
			//将设备与用户绑定
			user.bindWithDevice(req.body.deviceId, res, function () {
				res.send(1);
			});
		})
	};

	//商户登陆
	this.restaurantLogin = function (req, res) {
		//搜索商户
		restaurant.searchByPhone(req.body.phone, res, function (rows) {
			if (rows[0].password != req.body.password) {
				res.send(-2);   //password incorrect
				return;
			}

			//注册session
			req.session.userId = rows[0].id;
			//返回成功
			res.send(1);
		})
	};

	//用户注册
	this.userRegister = function (req, res) {
		user.add(req, res, function () {
			res.send(1);    //register success
		})
	};

	//商户注册
	this.restaurantRegister = function (req, res) {
		restaurant.add(req, res, function () {
			res.send(1);    //register success
		})
	};

	//注销
	this.logout = function (req, res) {
		//deviceId存在
		if (req.body.deviceId != undefined) {
			user.logout(req, res, function () {
				res.send(1);
			})
		}
		//不存在
		else {
			restaurant.logout(req, function () {
				if (req.session.sessionID == undefined) {
					res.send(1);
				}
				else {
					res.send(0);
				}
			})
		}
	};

	//获取用户信息
	this.userInfo = function (req, res) {
		//搜索id
		user.searchByDeviceId(req.body.deviceId, res, function (rows) {
			//根据id返回信息
			user.searchById(rows[0].id, res, function (rows) {
				res.send(rows);
			})
		});
	};

	//获取商户信息
	this.restaurantInfo = function (req, res) {
		restaurant.searchById(req.session.userId, res, function (rows) {
			res.send(rows);
		})
	};

	//更新用户信息
	this.userUpdate = function (req, res) {
		user.update(req.body.deviceId, res, function () {
			res.send(1);
		})
	};

	//获取菜单
	this.menus = function (req, res) {
		menu.getInBound(req.body.page, req.body.amount, res, function (rows) {
			res.send(rows);
		})
	};

	//获取用户菜单
	this.userMenus = function (req, res) {
		menu.getByUser(req, res, function (rows) {
			res.send(rows);
		})
	};

	//获取菜单详情
	this.menuInfo = function (req, res) {
		menu.getById(req.body.id, res, function (rows) {
			res.send(rows);
		})
	};

	//上传菜单
	this.menuUpload = function (req, res) {
		menu.add(req, res, function () {
			res.send(1);
		})
	};

	//修改菜单
	this.menuUpdate = function (req, res) {
		menu.updateById(req.body.id, res, function () {
			res.send(1);
		})
	};

	//点评菜单
	this.menuEvaluate = function (req, res) {
		menu.evaluate(req.body.id, res, function () {
			res.send(1);
		})
	};

	//餐厅搜索建议
	this.restaurantSearchSuggest = function (req, res) {
		restaurant.searchSuggest(req.body.name, res, function (rows) {
			res.send(rows);
		})
	};
	
	//按号查找用户
	this.userById = function (req, res) {
		user.searchById(req.body.id, res, function (rows) {
			res.send(rows);
		})
	};
	
	//获取附近餐厅
	this.restaurantInBound = function (req, res) {
		restaurant.searchInBound(req.body.lon, req.body.lat, res, function (rows) {
			res.send(rows);
		})
	};
	
	//获取附近好友
	this.friendInBound = function (req, res) {
		user.friendInBound(req.body.deviceId, req.body.lon, req.body.lat, res, function (rows) {
			res.send(rows);
		})
	};
	
	//获取附近用户
	this.userInBound = function (req, res) {
		user.inBound(req.body.lon, req.body.lat, res, function (rows) {
			res.send(rows);
		})
	};

	//创建订单
	this.orderCreate = function (req, res) {
		order.add(req, res, function () {
			res.send(1);
		})
	};

	//完成订单
	this.orderFinish = function (req, res) {
		switch (req.body.type) {
			case 0:
				//订单完成付款
				order.finish(req.body.id, res, function () {
					res.send(1);
				});
				break;

			case 1:
				//订单被取消
				order.cancel(req.body.id, res, function () {
					res.send(1);
				});
				break;

			default:
				break;
		}
	}
}

module.exports = new Service();