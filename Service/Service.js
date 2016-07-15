/**
 * Created by zhy on 16/7/4.
 */
function Service() {
	// var self = this;

	var user = require('../Data/User');
	var restaurant = require('../Data/Shop');
	var menu = require('../Data/Menu');
	var order = require('../Data/Order');
	var material = require('../Data/Material');
	

	//登陆
	this.login = function (req, res) {
		//app
		if (req.body.deviceId) {
			//用户登录
			//搜索用户名称
			user.authByName(req.body.id, res,  function (rows) {
				if (rows[0].password != req.body.password) {
					res.send('-2');   //-2: password error
					return;
				}
				
				//将设备与用户绑定
				user.bindWithDevice(req.body.deviceId, rows[0].id, res, function () {
					res.send('1');
				});
			})
		}
		//web
		else {
			if (req.body.isadmin) {
				user.admin(req.body.name, req.body.password, res, function () {
					req.session.admin = 1;
					res.send('1');
				})
			}
			else {
				//餐厅登陆
				//搜索商户
				restaurant.authByName(req.body.id, res, function (rows) {
					if (rows[0].password != req.body.password) {
						res.send('-2');   //password incorrect
						return;
					}
					
					//注册session
					req.session.userId = req.body.id;
					//返回成功
					res.send('1');
					// res.redirect('/view/show.html');
				})
			}
		}
	};

	//注册
	this.register = function (req, res) {
		if (req.body.deviceId) {
			//来自app
			user.add(req, res, function () {
				res.send('1');
			})
		}
		else {
			//来自web
			restaurant.add(req, res, function () {
				res.send('1');
				// res.redirect('');
			})
		}
	};
	
	//注销
	this.logout = function (req, res) {
		//deviceId存在
		if (req.body.deviceId != undefined) {
			user.logout(req.body.deviceId, res, function () {
				res.send('1');
			})
		}
		//不存在
		else {
			restaurant.logout(req, function () {
				if (req.session.sessionID == undefined) {
					res.send('1');
				}
				else {
					res.send('0');
				}
			})
		}
	};

	//获取用户信息
	this.userInfo = function (req, res) {
		//管理员未登陆
		//session replace
		//仅管理员
		if (req.session.admin) {
			if (!req.body.id && !req.body.name) {
				user.all(req, res, function (rows) {
					res.send(rows);
				})
			}
		}
		
		//通用
		if (req.body.id) {
			user.getById(req.body.id, res, function (rows) {
				res.send(rows[0]);
			})
		}
		else if (req.body.name) {
			user.getByName(req.body.name, res, function (rows) {
				res.send(rows[0]);
			})
		}
		else if (req.body.deviceId) {
			//搜索id
			user.getByDeviceId(req.body.deviceId, res, function (rows) {
				//根据id返回信息
				res.send(rows);
			});
		}
	};
	
	//获取餐厅信息
	this.restaurantInfo = function (req, res) {
		if (req.body.id) {
			//根据account获取
			restaurant.getById(req.body.id, res, function (rows) {
				res.send(rows[0]);
			})
		}
		else if (req.body.name) {
			//根据name获取
			restaurant.getByName(req.body.name, res, function (rows) {
				res.send(rows[0]);
			})
		}
		else {
			//根据已登陆的餐厅获取数据
			//管理员
			if (req.session.admin) {
				restaurant.all(res, function (rows) {
					res.send(rows);
				});
				
				return;
			}
			
			//session replace
			restaurant.getById(req.body.id, res, function (rows) {
				res.send(rows);
			})
		}
	};

	//更新用户信息
	this.userUpdate = function (req, res) {
		user.update(req, res, function () {
			res.send('1');
		})
	};

	//获取菜单
	this.menus = function (req, res) {
		// if (!req.session.userId) {
		// 	if (req.body.id) {
		//
		// 	}
		// 	else if (req.body.name) {
		//
		// 	}
		// 	else {
		// 		menu.all(res, function (rows) {
		// 			res.send(rows);
		// 		})
		// 	}
		// }
		// else {
			if (req.body.page && req.body.amount) {
				menu.getInBound(req.body.page, req.body.amount, res, function (rows) {
					res.send(rows);
				});
			}
			else {
				menu.all(req, res, function (rows) {
					res.send(rows);
				})
			}
		// }
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
			res.send('1');
		})
	};

	//修改菜单
	this.menuUpdate = function (req, res) {
		menu.updateById(req.body.id, res, function () {
			res.send('1');
		})
	};

	//点评菜单
	this.menuEvaluate = function (req, res) {
		menu.evaluate(req.body.id, res, function () {
			res.send('1');
		})
	};

	//餐厅搜索建议
	this.restaurantSearchSuggest = function (req, res) {
		restaurant.searchSuggest(req.body.name, res, function (rows) {
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
				user.del(req.body.id, res, function () {
					res.send('1');
				});
				break;
			
			case '1':
				restaurant.del(req.body.id, res, function () {
					res.send('1');
				});
				break;
			
			case '2':
				menu.del(req.body.id, req.body.menuType, res, function () {
					res.send('1');
				});
				break;
			
			default:
				break;
		}
	};
	
	this.adminActivate = function (req, res) {
		//0: 用户, 1: 商户, 2: 菜品
		switch (req.body.type) {
			case '0':
				user.activate(req.body.id, res, function () {
					res.send('1');
				});
				break;
			
			case '1':
				restaurant.activate(req.body.id, res, function () {
					res.send('1');
				});
				break;
			
			case '2':
				menu.activate(req.body.id, req.body.menuType, res, function () {
					res.send('1');
				});
				break;
			
			default:
				break;
		}
	};
	
	this.material = function (req, res) {
		if (req.body.type == '0') {
			material.getByMenuIdForUser(req.body.id, res, function (rows) {
				res.send(rows);
			})
		}
		else if (req.body.type == 1) {
			material.getByMenuIdForShop(req.body.id, res, function (rows) {
				res.send(rows);
			})
		}
	}
}

module.exports = new Service();