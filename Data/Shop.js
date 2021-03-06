/**
 * Created by zhy on 16/7/2.
 */
function Shop() {
	// var self = this;
	
	// var connection = require('../DB_Class').getConnection();
	var file = require('../Service/File');
	var uploadPath = '/upload';
	
	/*
	餐厅添加公告
	 */
	this.addAds = function (shopId, ads, dbShop, res, callBack) {
		dbShop.find({ id: shopId }, function (err, rows) {
			if (err || rows.length == 0) {
				res.send(JSON.stringify(0));
				return;
			}
			
			rows[0].ads = ads;
			rows[0].save(function (err) {
				if (err) {
					res.send(JSON.stringify(0));
					return;
				}
				
				callBack()
			});
		});
	};
	
	//根据name验证
	this.authByName = function (name, password, dbShop, res, callBack) {
		// var sql = 'SELECT id, password, del FROM shop ' +
		// 	'WHERE name="{name}"'.format({
		// 		name: name
		// 	});
		//
		// console.log(sql);
		
		dbShop.find({ name: name, del: 0}).only(['id', 'password']).run(function (err, rows) {
			if (err) {
				res.send(JSON.stringify(0));    //internal error
				return;
			}
			
			if (rows.length == 0) {
				res.send(JSON.stringify(-1));   //user not found
				return;
			}
			
			if (password != rows[0].password) {
				res.send(JSON.stringify(-2));     //password error
				return;
			}
			
			callBack(rows[0].id);
		});
		
		// dbDriver.execQuery(sql, )
	};
	
	this.authById = function (shopId, password, dbShop, res, callBack) {
		dbShop.find({ id: shopId }).only(['password', 'del']).run(function (err, rows) {
			if (err) {
				res.send(JSON.stringify(0));    //internal error
				return;
			}
			
			if (rows.length == 0) {
				res.send(JSON.stringify(-1));   //user not found
				return;
			}
			console.log(rows);
			console.log(rows[0].del);
			if (rows[0].del == 1) {
				res.send(JSON.stringify(-9));
				return;
			}
			// console.log(rows[0].password);
			if (password != rows[0].password) {
				res.send(JSON.stringify(-2));     //password error
				return;
			}
			
			callBack()
		});
	};
	
	//账户是否存在
	this.isExist = function (id, dbShop, res, callBack) {
		dbShop.exists({ id: id }, function (err, isExist) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			callBack(isExist)
		});
	};
	
	//名称是否存在
	this.nameIsExist = function (name, dbShop, res, callBack) {
		dbShop.exists({ name: name }, function (err, bool) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			callBack(bool)
		});
	};
	
	//返回所有shop信息
	this.all = function (dbShop, res, callBack) {
		dbShop.find(function (err, rows) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			callBack(rows);
		});
	};
	
	//注册
	this.add = function (dbShop, dbDriver, fields, files, res, callBack) {
		//新建shop
		var sql = 'INSERT INTO shop(name, password, address, phone, description, ads, longitude, latitude) VALUES (' +
			'"{name}","{password}","{address}","{phone}",{description},{ads},"{longitude}","{latitude}")'.format({
				name: fields.name[0],
				password: fields.password[0],
				address: fields.address[0],
				phone: fields.phone[0],
				description: fields.description == undefined ? null : '"' + fields.description[0] + '"',
				ads: fields.ads == undefined ? null : '"' + fields.ads[0] + '"',
				longitude: fields.longitude[0],
				latitude: fields.latitude[0]
			});
		
		console.log(sql);
		
		dbDriver.execQuery(sql, function (err, result) {
			if (err || result.length == 0) {
				res.send(JSON.stringify(0));
				return;
			}
			
			console.log(result);
			
			//插入时生成的shopId
			var shopId = result.insertId;
			
			var imgPath = '/shop/{id}'.format({
				id: shopId
			});
			var imgName = '/background{name}'.format({
				name: file.getFileType(files.img[0].originalFilename)
			});
			var certPath = '/shop/{id}'.format({
				id: shopId
			});
			var certName = '/certificate{name}'.format({
				name: file.getFileType(files.certificate[0].originalFilename)
			});
			
			//移动文件
			file.move(files.img[0].path, imgPath, imgName, res, function () {
				file.move(files.certificate[0].path, certPath, certName, res, function () {
					//数据库插入路径
					dbShop.find({ id: shopId }, function (err, rows) {
						if (err || rows.length == 0) {
							res.send(JSON.stringify(0));
							return;
						}
						
						rows[0].img = uploadPath + imgPath + imgName;
						rows[0].certificate = uploadPath + certPath + certName;
						rows[0].save(function (err) {
							if (err) {
								res.send(JSON.stringify(0));
								return;
							}
							
							callBack(shopId)
						});
					});
				});
			});
		});
	};
	
	//更新信息
	this.update = function (dbShop, fields, files, res, callBack) {
		var shopId = fields.id[0];
		
		//查找要修改的shop
		dbShop.find({ id: shopId }, function (err, rows) {
			if (err || rows.length == 0) {
				res.send(JSON.stringify(0));
				return;
			}
			
			//处理图片
			var imgPath = '/shop/{id}'.format({
				id: shopId
			});
			var imgName = '/background{name}'.format({
				name: file.getFileType(files.img[0].originalFilename)
			});
			var certPath = '/shop/{id}'.format({
				id: shopId
			});
			var certName = '/certificate{name}'.format({
				name: file.getFileType(files.certificate[0].originalFilename)
			});
			
			//移动文件
			file.move(files.img[0].path, imgPath, imgName, res, function () {
				file.move(files.certificate[0].path, certPath, certName, res, function () {
					//修改数据库
					var row = rows[0];
					
					row.name = fields.name[0];
					row.password = fields.password[0];
					row.address = fields.address[0];
					row.phone = fields.phone[0];
					row.description = fields.description[0] == undefined ? null : '"' + fields.description[0] + '"';
					row.ads = fields.ads[0] == undefined ? null : '"' + fields.ads[0] + '"';
					row.longitude = fields.longitude;
					row.latitude = fields.latitude;
					
					row.save(function (err) {
						if (err) {
							res.send(JSON.stringify(0));
							return;
						}
						
						res.send(JSON.stringify(1));
						
						if (callBack) {
							callBack();
						}
					});
				});
			});
		});
	};
	
	//根据id获取信息
	this.getInfoById = function (id, dbShop, res, callBack) {
		dbShop.find({ id: id }, function (err, rows) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			callBack(rows[0])
		});
	};
	
	//根据名称获取信息
	this.getInfoByName = function (name, dbShop, res, callBack) {
		dbShop.find({ name: name }, function (err, rows) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			callBack(rows);
		});
	};
	
	//搜索建议(名称)
	this.nameSuggest = function (namePart, dbDriver, res, callBack) {
		var sql = 'SELECT name, id FROM shop ' +
			'WHERE name LIKE "%{namePart}%"'.format({
				namePart: namePart
			});
		
		console.log(sql);
		
		dbDriver.execQuery(sql, function (err, rows) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			callBack(rows);
		});
	};
	
	//范围内获取餐厅
	this.searchInBound = function (params, dbDriver, res, callBack) {
		var sql = '';
		// lon, lat, bound
		
		console.log(sql);
		
		dbDriver.execQuery(sql, function (err, rows) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			callBack(rows);
		});
	};
	
	//封禁/删除
	this.del = function (shopId, dbShop, res, callBack) {
		dbShop.find({ id: shopId }, function (err, rows) {
			if (err || rows.length == 0) {
				res.send(JSON.stringify(0));
				return;
			}
			
			//设置del为1, 表示被封禁
			rows[0].del = 1;
			rows[0].save(function (err) {
				if (err) {
					res.send(JSON.stringify(0));
					return;
				}
				
				callBack();
			});
		});
	};
	
	//激活
	this.activate = function (shopId, dbShop, res, callBack) {
		dbShop.find({ id: shopId }, function (err, rows) {
			if (err || rows.length == 0) {
				res.send(JSON.stringify(0));
				return;
			}
			
			//设置del为0, 表示已激活
			rows[0].del = 0;
			rows[0].save(function (err) {
				if (err) {
					res.send(JSON.stringify(0));
					return;
				}
				
				callBack();
			});
		});
	};
	
	//注销
	this.logout = function (req, callBack) {
		req.session.destroy();
		callBack();
	}
}

module.exports = new Shop();