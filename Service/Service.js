/**
 * Created by zhy on 16/7/4.
 */
function Service() {
	// var self = this;

	var user = require('../Data/User');
	var shop = require('../Data/Shop');
	var menu = require('../Data/Menu');
	var order = require('../Data/Order');
	var material = require('../Data/Material');
	

	//登陆
	this.login = function (req, res) {
		//app
		if (req.body.deviceId) {
			//用户登录
			if (req.body.name) {
				//搜索用户名称
				user.authByName(req.body, req.db.driver, res, function (id) {
					//将设备与用户绑定
					user.bindWithDevice(req.db.driver, req.body.deviceId, id, res);
				})
			}
			else if (req.body.phone) {
				user.authByPhone(req.body, req.db.driver, res, function (id) {
					user.bindWithDevice(req.db.driver, req.body.deviceId, id, res);
				})
			}
		}
		//web
		else {
			if (req.body.admin) {
				user.admin(req.body, req.session, req.models.admin, res);
			}
			else {
				//餐厅登陆
				shop.authByName(req.body.name, req.password, req.db.driver, res, function (id) {
					req.session.shopId = id;
					res.send('1');
				});
			}
		}
	};
	
	//名称是否已存在
	this.regNameExist = function (req, res) {
		//app
		if (req.body.deviceId) {
			user.nameIsExist(req.body.name, req.models.user, res, function () {
				res.send('1')
			})
		}
		//web
		else {
			shop.nameIsExist(req.body.name, req.models.shop, res, function () {
				res.send('1')
			})
		}
	};

	//注册
	this.userRegister = function (req, res) {
		user.add(req.body, req.models.user, res);
	};
	
	this.shopRegister = function (req, res) {
		shop.add(req, res)
	};
	
	//注销
	this.logout = function (req, res) {
		//app
		if (req.body.deviceId) {
			user.logout(req.body.deviceId, req.db.driver, res);
		}
		//web and admin
		else {
			shop.logout(req, function () {
				if (req.session.sessionID) {
					res.send('0')
				}
				else {
					res.send('1')
				}
			})
		}
	};

	//获取用户信息
	this.userInfo = function (req, res) {
		//管理员
		if (req.session.admin == 1) {
			if (req.body.id) {
				user.getById(req.body.id, req.models.user, res, function (rows) {
					res.send(rows)
				})
			}
			else {
				user.all(req.models.user, res, function (rows) {
					res.send(rows)
				})
			}
			
			return
		}
		
		//app
		if (req.body.deviceId) {
			user.getIdByDeviceId(req.body.deviceId, req.db.driver, res, function () {
				//若查询到此deviceId, 则继续执行
				if (req.body.id) {
					//根据id获取信息
					user.getById(req.body.id, req.models.user, res, function (rows) {
						res.send(rows)
					})
				}
				else {
					//获取自己的信息
					user.getByDeviceId(req.body.deviceId, req.models.user, res, function (rows) {
						res.send(rows)
					})
				}
			})
		}
		
		//普通web端无权获取用户信息
	};
	
	//获取餐厅信息
	this.shopInfo = function (req, res) {
		//管理员
		if (req.session.admin == 1) {
			if (req.body.id) {
				shop.getById(req.body.id, req.models.shop, res, function (rows) {
					res.send(rows)
				})
			}
			else {
				//获取所有餐厅
				shop.all(req.models.shop, res, function (rows) {
					res.send(rows)
				})
			}
			
			return
		}
		
		//app
		if (req.body.deviceId) {
			if (req.body.id) {
				shop.getById(req.body.id, req.models.shop, res, function (rows) {
					res.send(rows)
				})
			}
			else if (req.body.name) {
				shop.getByName(req.body.name, req.models.shop, res, function (rows) {
					res.send(rows)
				})
			}
			
			return
		}
		
		//web
		if (req.session.shopId) {
			shop.getById(req.session.shopId, req.models.shop, res, function (rows) {
				res.send(rows)
			})
		}
		else {
			res.send('-10')
		}
	};

	//更新用户信息
	this.userUpdate = function (req, res) {
		user.update(req, res);
	};

	//获取菜单
	this.menus = function (req, res) {
		//管理员
		if (req.session.admin && req.session.admin == 1) {
			if (req.body.id) {
				menu.getById(req.body.id, req.models.menu, res, function (rows) {
					res.send(rows)
				})
			}
			else {
				//获取所有菜单
				menu.all(req.models.menu, res, function (rows) {
					res.send(rows)
				})
			}
			
			return
		}
		
		//app
		if (req.body.deviceId) {
			user.getIdByDeviceId(req.body.deviceId, req.db.driver, res, function () {
				if (req.body.id) {
					menu.getById(req.body.id, req.models.menu, res, function (rows) {
						res.send(rows)
					})
				}
				else {
					//todo: 分页返回
					menu.all(req.models.menu, res, function (rows) {
						res.send(rows)
					})
				}
			});
			
			return
		}
		
		//web
		if (req.session.shopId) {
			if (req.body.id) {
				menu.getById(req.body.id, req.models.menu, res, function (rows) {
					res.send(rows)
				})
			}
			else {
				//todo: 分页返回
				menu.all(req.models.menu, res, function (rows) {
					res.send(rows)
				})
			}
		}
		else {
			res.send('-10')
		}
	};

	//获取用户菜单
	this.selfMenus = function (req, res) {
		//app
		if (req.body.deviceId) {
			menu.getByUser(req.body.deviceId, req.db.driver, res, function (rows) {
				res.send(rows)
			});
			
			return
		}
		
		//web
		if (req.session.shopId) {
			menu.getByShop(req.session.shopId, req.db.driver, res, function (rows) {
				res.send(rows)
			})
		}
		else {
			res.send('-10')
		}
	};

	//上传菜单
	this.menuAdd = function (req, res) {
		//app
		if (req.body.deviceId) {
			user.getIdByDeviceId(req.body.deviceId, req.db.driver, res, function () {
				menu.add(req, res)
			});
			
			return
		}
		
		if (req.session.shopId) {
			menu.add(req, res)
		}
		else {
			res.send('-10')
		}
	};

	//修改菜单
	this.menuUpdate = function (req, res) {
		//app
		if (req.body.deviceId) {
			user.getIdByDeviceId(req.body.deviceId, req.db.driver, res, function () {
				menu.updateById(req, res)
			});
			
			return
		}
		
		//web
		if (req.session.shopId) {
			menu.updateById(req, res)
		}
		else {
			res.send('-10')
		}
	};

	//点评菜单
	this.menuEvaluate = function (req, res) {
		menu.evaluate(req.body, req.models.menu_evaluate, req.models.user, res)
	};

	//餐厅搜索建议
	this.restaurantSearchSuggest = function (req, res) {
		shop.nameSuggest(req.body.name, req.db.driver, res, function (rows) {
			res.send(rows)
		})
	};
	
	//获取附近餐厅
	this.restaurantInBound = function (req, res) {
		//todo: not complete
		shop.searchInBound(req.body, req.db.driver, res, function (rows) {
			res.send(rows)
		})
	};
	
	//获取附近好友
	this.friendInBound = function (req, res) {
		user.friendInBound(req.body, req.db.driver, res, function (rows) {
			res.send(rows)
		})
	};

	//创建订单
	this.orderCreate = function (req, res) {
		order.add(req, res, function () {
			res.send('1');
		})
	};

	//完成订单
	this.orderFinish = function (req, res) {
		switch (req.body.type) {
			case 0:
				//订单完成付款
				order.finish(req.body.id, res, function () {
					res.send('1');
				});
				break;

			case 1:
				//订单被取消
				order.cancel(req.body.id, res, function () {
					res.send('1');
				});
				break;

			default:
				break;
		}
	};
	
	this.adminForbid = function (req, res) {
		//0: 用户, 1: 商户, 2: 菜品
		switch (req.body.type) {
			case '0':
				user.del(req.body.id, req.models.user, res);
				break;
			
			case '1':
				shop.del(req.body.id, req.models.shop, res);
				break;
			
			case '2':
				menu.del(req.body.id, req.models.menu, res);
				break;
			
			case '3':
				material.del(req.body.id, req.models.material, res);
				break;
			
			default:
				break;
		}
	};
	
	this.adminActivate = function (req, res) {
		//0: 用户, 1: 商户, 2: 菜品
		switch (req.body.type) {
			case '0':
				user.activate(req.body.id, req.models.user, res);
				break;
			
			case '1':
				shop.activate(req.body.id, req.models.shop, res);
				break;
			
			case '2':
				menu.activate(req.body.id, req.models.menu, res);
				break;
			
			case '3':
				material.activate(req.body.id, req.models.material, res);
				break;
			
			default:
				break;
		}
	};
	
	this.material = function (req, res) {
		//admin
		if (req.session.admin && req.session.admin == 1) {
			//todo: return all material
			return
		}
		
		//app
		if (req.body.deviceId) {
			//todo: return all
			return
		}
		
		//web
		if (req.session.shopId) {
			//todo: return all
		}
	}
}

module.exports = new Service();