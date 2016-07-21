/**
 * Created by zhy on 16/7/2.
 */
function Menu() {
	// var self = this;
	
	var connection = require('../DB_Class').getConnection();
	var file = require('../Service/File');
	var user = require('./User');
	var tool = require('../Service/Tools');
	
	var uploadPath = '/upload';
	
	
	//上传菜谱
	this.add = function (dbMenu, dbMenu_Shop_User, fields, files, res, callBack) {
		//创建新菜单
		dbMenu.create({
			name: fields.name[0],
			price: fields.price[0],
			description: fields.description[0],
			type: fields.type[0],
			del: 0
		}, function (err, row) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			//插入时创建的id
			var menuId = row.id;
			
			//处理上传文件
			var imgPath = '/menu/{id}'.format({
				id: menuId
			});
			var imgName = '/img{name}'.format({
				name: file.getFileType(files.img[0].originalFilename)
			});
			
			//移动文件
			file.move(files.img[0].path, imgPath, imgName, res, function () {
				//将图片路径插入数据库
				dbMenu.find({id: menuId}, function (err, rows) {
					if (err || rows.length == 0) {
						res.send(JSON.stringify(0));
						return;
					}
					
					//插入路径
					rows[0].img = uploadPath + imgPath + imgName;
					rows[0].save(function (err) {
						if (err) {
							res.send(JSON.stringify(0));
							return;
						}
						
						callBack(menuId)
					});
				});
			});
		});
	};
	
	this.bindWithUser = function (dbMenu_Shop_User, menuId, userId, res, callBack) {
		//用户上传
		dbMenu_Shop_User.create({
			menu_id: menuId,
			user_id: userId
		}, function (err) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			callBack()
		});
	};
	
	this.getTypeListWithShopId = function (shopId, dbDriver, res, callBack) {
		var sql = 'SELECT DISTINCT menu.type FROM menu_shop_user msu, menu ' +
			'WHERE msu.menu_id=menu.id AND msu.shop_id={shopId}'.format({
				shopId: shopId
			});
		
		console.log(sql);
		
		dbDriver.execQuery(sql, function (err, rows) {
			if (err || rows.length == 0) {
				res.send(JSON.stringify(0));
				return;
			}
			
			callBack(rows);
		});
	};
	
	this.bindWithShop = function (dbMenu_Shop_User, menuId, shopId, res, callBack) {
		//商家上传
		dbMenu_Shop_User.create({
			menu_id: menuId,
			shop_id: shopId
		}, function (err) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			callBack()
		});
	};
	
	this.all = function (dbMenu, res, callBack) {
		//可返回菜单的属主
		// var sql = 'SELECT name,img,price,description,type,del,score,msu.* FROM menu, menu_shop_user msu ' +
		// 	'GROUP BY msu.menu_id';
		
		dbMenu.find({ del: 0 }, function (err, rows) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			callBack(rows);
		});
	};
	
	this.adminAll = function (dbMenu, res, callBack) {
		//可返回菜单的属主
		// var sql = 'SELECT name,img,price,description,type,del,score,msu.* FROM menu, menu_shop_user msu ' +
		// 	'GROUP BY msu.menu_id';
		
		dbMenu.find(function (err, rows) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			callBack(rows);
		});
	};
	
	this.allWithPageMode = function (dbMenu, page, amount, res, callBack) {
		dbMenu.find({ del: 0 }).limit(amount).offset(page).run(function (err, rows) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			callBack(rows);
		});
	};
	
	//获取单个菜单
	this.getInfoById = function (menuId, dbMenu, res, callBack) {
		dbMenu.find({ id: menuId, del: 0 }, function (err, rows) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			callBack(rows[0])
		});
	};
	
	this.getInfoByName = function (name, dbMenu, res, callBack) {
		dbMenu.find({ name: name, del: 0 }, function (err, rows) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}

			callBack(rows[0])
		});
	};
	
	//获取用户自己的菜单
	this.getByUserDevice = function (deviceId, dbDriver, res, callBack) {
		user.getIdByDeviceId(deviceId, dbDriver, res, function (userId) {
			var sql = 'SELECT menu.* FROM menu, menu_shop_user msu ' +
				'WHERE menu.id=msu.menu_id AND msu.user_id={id} AND menu.del=0'.format({
					id: userId
				});
			
			dbDriver.execQuery(sql, function (err, rows) {
				if (err) {
					res.send(JSON.stringify(0));
					return;
				}
				
				callBack(rows);
			});
		});
	};
	
	this.getByUserId = function (id, dbDriver, res, callBack) {
		var sql = 'SELECT menu.* FROM menu, menu_shop_user msu ' +
			'WHERE menu.id=msu.menu_id AND msu.user_id={id} AND menu.del=0'.format({
				id: id
			});
		
		dbDriver.execQuery(sql, function (err, rows) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			callBack(rows);
		});
	};
	
	//获取餐厅自己的菜单
	this.getByShop = function (shopId, dbDriver, res, callBack) {
		var sql = 'SELECT menu.* FROM menu, menu_shop_user msu ' +
			'WHERE menu.id=msu.menu_id AND msu.shop_id={shopId} AND menu.del=0 '.format({
				shopId: shopId
			});
		
		dbDriver.execQuery(sql, function (err, rows) {
			if (err || rows.length == 0) {
				res.send(JSON.stringify(0));
				return;
			}
			
			var result = {};
			
			result.menus = rows;
			
			var sql = 'SELECT count(menu.id) FROM menu, menu_shop_user msu ' +
				'WHERE menu.id=msu.menu_id AND msu.shop_id={shopId} AND menu.del=0 '.format({
					shopId: shopId
				});
			
			dbDriver.execQuery(sql, function (err, row) {
				if (err || rows.length == 0) {
					res.send(JSON.stringify(0));
					return;
				}
				
				console.log(row);
				
				result.count = row[0]['count(menu.id)'];
				
				callBack(result);
			});
		});
	};
	
	//todo: 分页返回商家菜单
	this.getByShopPageMode = function (shopId, page, amount, dbDriver, res, callBack) {
		var sql = 'SELECT menu.* FROM menu, menu_shop_user msu ' +
			'WHERE menu.id=msu.menu_id AND msu.shop_id={shopId} AND menu.del=0 '.format({
				shopId: shopId
			}) +
			'limit {start},{end}'.format({
				start: (page - 1) * amount,
				end: page * amount
			});
		
		dbDriver.execQuery(sql, function (err, rows) {
			if (err || rows.length == 0) {
				res.send(JSON.stringify(0));
				return;
			}
			
			var result = {};
			
			result.menus = rows;
			
			var sql = 'SELECT count(menu.id) FROM menu, menu_shop_user msu ' +
				'WHERE menu.id=msu.menu_id AND msu.shop_id={shopId} AND menu.del=0 '.format({
					shopId: shopId
				});
			
			dbDriver.execQuery(sql, function (err, rows) {
				if (err || rows.length == 0) {
					res.send(JSON.stringify(0));
					return;
				}
				
				result.count = rows[0]['count(menu.id)'];
				
				callBack(result);
			});
		});
	};
	
	//获取餐厅菜单(按分类)
	this.getByShopWithType = function (shopId, type, dbDriver, res, callBack) {
		var sql = 'SELECT menu.*, count(menu.id) FROM menu, menu_shop_user msu ' +
			'WHERE menu.type="{type}" AND menu.id=msu.menu_id AND msu.shop_id={shopId} AND menu.del=0 '.format({
				shopId: shopId,
				type: type
			});
		
		console.log(sql);
		
		dbDriver.execQuery(sql, function (err, rows) {
			if (err || rows.length == 0) {
				res.send(JSON.stringify(0));
				return;
			}
			
			var result = {};
			
			result.menus = rows;
			result.count = rows[0]['count(menu.id)'];
			
			callBack(result);
		});
	};
	
	this.getByShopWithTypePageMode = function (shopId, type, page, amount, dbDriver, res, callBack) {
		var sql = 'SELECT menu.* FROM menu, menu_shop_user msu ' +
			'WHERE menu.type={type} AND menu.id=msu.menu_id AND msu.shop_id={shopId} AND menu.del=0 '.format({
				shopId: shopId,
				type: type
			}) +
			'limit {start},{end}'.format({
				start: (page - 1) * amount,
				end: page * amount
			});
		
		console.log(sql);
		
		dbDriver.execQuery(sql, function (err, rows) {
			if (err || rows.length == 0) {
				res.send(JSON.stringify(0));
				return;
			}
			
			var result = {};
			
			result.menus = rows;
			
			var sql = 'SELECT count(menu.id) FROM menu, menu_shop_user msu ' +
				'WHERE menu.type={type} AND menu.id=msu.menu_id AND msu.shop_id={shopId} AND menu.del=0 '.format({
					shopId: shopId,
					type: type
				});
			
			dbDriver.execQuery(sql, function (err, rows) {
				if (err || rows.length == 0) {
					res.send(JSON.stringify(0));
					return;
				}
				
				result.count = rows[0]['count(menu.id)'];
				
				callBack(result);
			});
		});
	};
	
	this.search = function (name, shopId, dbDriver, res, callBack) {
		var sql = 'SELECT menu.* FROM menu, menu_shop_user msu ' +
			'WHERE msu.shop_id={shopId} AND menu.id=msu.menu_id AND menu.name LIKE "%{name}%"'.format({
				shopId: shopId,
				name: name
			});
		
		console.log(sql);
		
		dbDriver.execQuery(sql, function (err, rows) {
			if (err || rows.length == 0) {
				res.send(JSON.stringify(0));
				return;
			}
			
			var result = {};
			
			result.menus = rows;
			
			var sql = 'SELECT count(menu.id) FROM menu, menu_shop_user msu ' +
				'WHERE msu.shop_id={shopId} AND menu.id=msu.menu_id AND menu.name LIKE "%{name}%"'.format({
					shopId: shopId,
					name: name
				});
			
			dbDriver.execQuery(sql, function (err, rows) {
				if (err || rows.length == 0) {
					res.send(JSON.stringify(0));
					return;
				}
				
				result.count = rows[0]['count(menu.id)'];
				
				callBack(result);
			});
		});
	};
	
	this.searchWithType = function (name, type, shopId, dbDriver, res, callBack) {
		var sql = 'SELECT menu.* FROM menu, menu_shop_user msu ' +
			'WHERE msu.shop_id={shopId} AND menu.id=msu.menu_id AND menu.name LIKE "%{name}%" AND menu.type="{type}"'.format({
				shopId: shopId, name: name, type: type
			});
		
		console.log(sql);
		
		dbDriver.execQuery(sql, function (err, rows) {
			if (err || rows.length == 0) {
				res.send(JSON.stringify(0));
				return;
			}
			
			var result = {};
			
			result.menus = rows;
			
			var sql = 'SELECT count(menu.id) FROM menu, menu_shop_user msu ' +
				'WHERE msu.shop_id={shopId} AND menu.id=msu.menu_id AND menu.name LIKE "%{name}%" AND menu.type="{type}"'.format({
					shopId: shopId, name: name, type: type
				});
			
			dbDriver.execQuery(sql, function (err, rows) {
				if (err || rows.length == 0) {
					res.send(JSON.stringify(0));
					return;
				}
				
				result.count = rows[0]['count(menu.id)'];
				
				callBack(result);
			});
		});
	};
	
	this.searchSuggest = function (dbDriver, name, res, callBack) {
		var sql = 'SELECT id, name FROM menu ' +
			'WHERE name LIKE "%{name}%"'.format({
				name: name
			});
		
		console.log(sql);
		
		dbDriver.execQuery(sql, function (err, rows) {
			if (err || rows.length == 0) {
				res.send(JSON.stringify(0));
				return;
			}
			
			console.log(rows);
			
			callBack(rows);
		});
	};
	
	//获取一定范围菜单
	this.getInBound = function (page, amount, res, callBack) {
		var sql = '';
		
		connection.query(sql, function (err, rows) {
			if (err) {
				return;
			}
			
			callBack(rows);
		});
	};
	
	//更新菜单
	this.updateById = function (req, res, callBack) {
		//解析二进制数据
		file.parse(req, res, function (fields, files) {
			//处理上传文件
			var imgPath = '/menu/{id}'.format({
				id: fields.id[0]
			});
			var imgName = '/img{name}'.format({
				name: file.getFileType(files.img[0].originalFilename)
			});
			
			//移动文件
			file.move(files.img[0].path, imgPath, imgName, res, function () {
				//根据id寻找菜单
				req.models.menu.find({ id: fields.id[0] }, function (err, rows) {
					if (err || rows.length == 0) {
						res.send(JSON.stringify(0));
						return;
					}
					
					//修改数据
					var row = rows[0];
					
					row.name = fields.name[0];
					row.price = (fields.price || fields.price[0]) ? fields.price[0] : null;
					row.description = fields.description[0];
					row.type = fields.type[0];
					row.img = uploadPath + imgPath + imgName;
					row.save(function (err) {
						if (err) {
							res.send(JSON.stringify(0));
							return;
						}
						
						res.send(JSON.stringify(1));
						
						if (callBack) {
							callBack()
						}
					});
				});
			});
		});
	};
	
	//评价菜单
	this.evaluate = function (params, dbMenu_Eval, dbUser, res, callBack) {
		//寻找用户
		dbUser.find({ device_id: params.deviceId }, function (err, rows) {
			if (err || rows.length == 0) {
				res.send(JSON.stringify(0));
				return;
			}
			
			var userId = rows[0].id;
			
			//新建评论
			dbMenu_Eval.create({
				menu_id: params.id,
				user_id: userId,
				evaluate: params.evaluate,
				score: params.score
			}, function (err) {
				if (err) {
					res.send(JSON.stringify(0));
					return;
				}
				
				res.send(JSON.stringify(1));
				
				if (callBack) {
					callBack()
				}
			});
		});
	};
	
	//获得评价
	this.getEvaluate = function (menuId, dbDriver, res, callBack) {
		var sql = 'SELECT user.id,user.img,user.name,user.sex,evaluate,score FROM menu_evaluate me, user ' +
			'WHERE me.user_id=user.id AND me.menu_id={menuId} AND user.del=0'.format({
				menuId: menuId
			}) +
			'GROUP BY user.id;';
		
		console.log(sql);
		
		dbDriver.execQuery(sql, function (err, rows) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			callBack(rows);
		});
	};
	
	this.del = function (menuId, dbMenu, res, callBack) {
		dbMenu.find({ id: menuId }, function (err, rows) {
			if (err || rows.length == 0) {
				res.send(JSON.stringify(0));
				return;
			}
			
			var row = rows[0];
			
			row.del = 1;
			row.save(function (err) {
				if (err) {
					res.send(JSON.stringify(0));
					return;
				}
				
				callBack();
			});
		});
	};
	
	this.activate = function (menuId, dbMenu, res, callBack) {
		dbMenu.find({ id: menuId }, function (err, rows) {
			if (err || rows.length == 0) {
				res.send(JSON.stringify(0));
				return;
			}
			
			var row = rows[0];
			
			row.del = 0;
			row.save(function (err) {
				if (err) {
					res.send(JSON.stringify(0));
					return;
				}
				
				callBack();
			});
		});
	}
}

module.exports = new Menu();
