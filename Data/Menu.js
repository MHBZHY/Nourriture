/**
 * Created by zhy on 16/7/2.
 */
function Menu() {
	// var self = this;
	
	var connection = require('../DB_Class').getConnection();
	var file = require('../Service/File');
	var user = require('./User');
	
	var uploadPath = '/upload';
	
	
	//上传菜谱
	this.add = function (req, res, callBack) {
		//解析二进制数据
		file.parse(req, res, function (fields, files) {
			//创建新菜单
			req.models.menu.create({
				name: fields.name[0],
				price: fields.price[0],
				description: fields.description[0],
				type: fields.type[0],
				del: 0
			}, function (err, rows) {
				if (err) {
					res.send('0');
					return;
				}
				
				//插入时创建的id
				var menuId = rows.id;
				
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
					req.models.menu.find({id: menuId}, function (err, rows) {
						if (err || rows.length == 0) {
							res.send('0');
							return;
						}
						
						//插入路径
						rows[0].img = uploadPath + imgPath + imgName;
						rows[0].save(function (err) {
							if (err) {
								res.send('0');
								return;
							}
							
							//根据上传者建立关系
							if (fields.deviceId || fields.deviceId[0]) {
								//获取用户id
								user.getIdByDeviceId(fields.deviceId[0], req.db.driver, res, function (userId) {
									//用户上传
									req.models.menu_shop_user.create({
										menu_id: menuId,
										user_id: userId
									}, function (err) {
										if (err) {
											res.send('0');
											return;
										}
										
										res.send('1');
										
										if (callBack) {
											callBack()
										}
									})
								})
							}
							else {
								//商家上传
								req.models.menu_shop_user.create({
									menu_id: menuId,
									shop_id: req.session.shopId
								}, function (err) {
									if (err) {
										res.send('0');
										return;
									}
									
									res.send('1');
									
									if (callBack) {
										callBack()
									}
								})
							}
						})
					})
				})
			})
		})
	};
	
	this.all = function (dbMenu, res, callBack) {
		dbMenu.find(function (err, rows) {
			if (err) {
				res.send('0');
				return;
			}
			
			callBack(rows)
		})
	};
	
	//获取单个菜单
	this.getById = function (menuId, dbMenu, res, callBack) {
		dbMenu.find({id: menuId}, function (err, rows) {
			if (err) {
				res.send('0');
				return;
			}
			
			callBack(rows)
		})
	};
	
	this.getByUser = function (deviceId, dbDriver, res, callBack) {
		user.getIdByDeviceId(deviceId, dbDriver, res, function (userId) {
			var sql = 'SELECT menu.* FROM menu, menu_shop_user msu ' +
				'WHERE menu.id=msu.menu_id AND msu.user_id={id}'.format({
					id: userId
				});
			
			dbDriver.execQuery(sql, function (err, rows) {
				if (err) {
					res.send('0');
					return;
				}
				
				callBack(rows)
			})
		})
	};
	
	//获取一定范围菜单
	this.getInBound = function (page, amount, res, callBack) {
		var sql = '';
		
		connection.query(sql, function (err, rows) {
			if (err) {
				return;
			}
			
			callBack(rows);
		})
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
						res.send('0');
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
							res.send('0');
							return;
						}
						
						res.send('1');
						
						if (callBack) {
							callBack()
						}
					})
				})
			})
		})
	};
	
	//评价菜单
	this.evaluate = function (menuId, res, callBack) {
		var sql = '';
		
		connection.query(sql, function (err) {
			if (err) {
				res.send('0');
				return;
			}
			
			if (callBack) {
				callBack();
			}
		})
	};
	
	this.del = function (account, menuType, res, callBack) {
		var sql;
		
		if (menuType == '0') {
			sql = 'UPDATE `menu-user` SET del = 1 WHERE id=' + account;
		}
		else if (menuType == '1') {
			sql = 'UPDATE `menu-shop` SET del = 1 WHERE id=' + account;
		}
		else {
			res.send('0');
		}
		
		console.log(sql);
		
		connection.query(sql, function (err) {
			if (err) {
				res.send('0');
				return;
			}
			
			if (callBack) {
				callBack();
			}
		})
	};
	
	this.activate = function (account, menuType, res, callBack) {
		var sql;
		
		if (menuType == '0') {
			sql = 'UPDATE `menu-user` SET del = 0 WHERE id=' + account;
		}
		else if (menuType == '1') {
			sql = 'UPDATE `menu-shop` SET del = 0 WHERE id=' + account;
		}
		else {
			res.send('0');
			return;
		}
		
		connection.query(sql, function (err) {
			if (err) {
				res.send('0');
				return;
			}
			
			if (callBack) {
				callBack();
			}
		})
	};
}

module.exports = new Menu();
