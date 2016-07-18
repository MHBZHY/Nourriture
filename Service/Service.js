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
	var file = require('./File');
	
	
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
					user.bindWithDevice(req.db.driver, req.body.deviceId, id, res, function () {
						res.send('1')
					});
				})
			}
		}
		//web
		else {
			if (req.body.admin) {
				user.admin(req.body, req.models.admin, res, function () {
					req.session.admin = 1;
					res.send('1')
				})
			}
			else {
				//餐厅登陆
				shop.authByName(req.body.name, req.password, req.db.driver, res, function (id) {
					req.session.shopId = id;
					res.send('1');
				})
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
		user.add(req.body, req.models.user, res, function (userId) {
			res.send(JSON.stringify(userId))
		});
	};
	
	this.shopRegister = function (req, res) {
		file.parse(req, res, function (fields, files) {
			shop.add(req.models.shop, req.db.driver, fields, files, res, function (shopId) {
				res.send(JSON.stringify(shopId))
			})
		})
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
					res.send(rows[0])
				})
			}
			else if (req.body.name) {
				user.getByName(req.body.name, req.models.user, res, function (rows) {
					res.send(rows[0])
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
					res.send(rows[0])
				})
			}
			else if (req.body.name) {
				shop.getByName(req.body.name, req.models.shop, res, function (rows) {
					res.send(rows[0])
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
		//todo: change to req.session.shopId
		if (req.body.id) {
			shop.getById(req.body.id, req.models.shop, res, function (row) {
				console.log(row);
				res.send(row)
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
	this.menuInfo = function (req, res) {
		//管理员
		if (req.session.admin && req.session.admin == 1) {
			if (req.body.id) {
				menu.getById(req.body.id, req.models.menu, res, function (row) {
					res.send(row)
				})
			}
			else if (req.body.name) {
				menu.getByName(req.body.name, req.models.menu, res, function (row) {
					res.send(row)
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
				else if (req.body.shopId) {
					menu.getByShop(req.body.shopId, req.db.driver, res, function (rows) {
						res.send(rows)
					})
				}
				else {
					//todo: 分页返回
					// menu.all(req.models.menu, res, function (rows) {
					// 	res.send(rows)
					// })
					menu.allWithPageMode(req.models.menu, req.body.page, req.body.amount, res, function (rows) {
						console.log(rows);
						res.send(rows)
					})
				}
			});
			
			return
		}
		
		//web
		//todo: change to req.session.shopId
		// if (req.body.id) {
		// 	//todo: 分页返回
		// 	menu.getByShop(req.body.id, req.db.driver, res, function (rows) {
		// 		console.log(rows);
		// 		res.send(rows)
		// 	})
		// }
		if (req.body.type) {
			menu.getByShopWithType(req.body.id, req.body.type, req.db.driver, res, function (rows) {
				console.log(rows);
				res.send(rows)
			})
		}
		else {
			res.send('-10')
		}
	};
	
	//菜单分类
	this.menuType = function (req, res) {
		//todo: 权限控制
		menu.getTypeListWithShopId(req.body.id, req.db.driver, res, function (rows) {
			console.log(rows);
			res.send(rows)
		})
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
		//parse
		file.parse(req, res, function (fields, files) {
			//app
			if (fields.deviceId && fields.deviceId[0]) {
				//get id
				user.getIdByDeviceId(req.body.deviceId, req.db.driver, res, function (userId) {
					//add menu
					menu.add(req.models.menu, req.models.menu_shop_user, fields, files, res, function (menuId) {
						//bind
						menu.bindWithUser(req.models.menu_shop_user, menuId, userId, res, function () {
							res.send(JSON.stringify(menuId))
						})
					})
				});
				
				return
			}
			
			//web
			//todo: change to req.session.shopId
			if (fields.id) {
				menu.add(req.models.menu, req.models.menu_shop_user, fields, files, res, function (menuId) {
					menu.bindWithShop(req.models.menu_shop_user, menuId, fields.id[0], res, function () {
						res.send(JSON.stringify(menuId))
					})
				})
			}
			else {
				res.send('-10')
			}
		})
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
	this.shopSearchSuggest = function (req, res) {
		shop.nameSuggest(req.body.name, req.db.driver, res, function (rows) {
			res.send(rows)
		})
	};
	
	//获取附近餐厅
	this.shopInBound = function (req, res) {
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
	
	//上传原料
	this.materialAdd = function (req, res) {
		//parse
		file.parse(req, res, function (fields, files) {
			if (fields.deviceId && fields.deviceId[0]) {
				//app
				user.getIdByDeviceId(fields.deviceId[0], req.db.driver, res, function () {
					//upload
					material.add(req.models.material, fields, files, res, function (materialId) {
						res.send({
							id: materialId
						})
					})
				})
			}
		})
	};
	
	this.addMaterialForMenu = function (req, res) {
		if (req.body.deviceId) {
			//app
			user.getIdByDeviceId(req.body.deviceId, req.db.driver, res, function () {
				//bind
				material.bindWithMenuId(req.body.materialId, req.body.menuId, req.models.menu_material, res, function () {
					res.send('1')
				})
			})
		}
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