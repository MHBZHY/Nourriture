/**
 * Created by zhy on 16/7/2.
 */
function Shop() {
	// var self = this;
	
	// var connection = require('../DB_Class').getConnection();
	var file = require('../Service/File');
	var uploadPath = '/upload';
	
	
	//根据account获取密码
	this.authByName = function (name, password, dbDriver, res, callBack) {
		var sql = 'SELECT id, password FROM shop ' +
			'WHERE name="{name}"'.format({
				name: name
			});
		
		console.log(sql);
		
		dbDriver.execQuery(sql, function (err, rows) {
			if (err) {
				res.send('0');    //internal error
				return;
			}
			
			if (rows.length == 0) {
				res.send('-1');   //user not found
				return;
			}
			
			if (password != rows[0].password) {
				res.send('-2');     //password error
				return;
			}
			
			callBack(rows[0].id);
		})
	};
	
	//返回所有shop信息
	this.all = function (dbShop, res, callBack) {
		dbShop.find(function (err, rows) {
			if (err) {
				res.send('0');
				return;
			}
			
			callBack(rows);
		})
	};
	
	//注册
	this.add = function (req, res, callBack) {
		file.parse(req, res, function (fields, files) {
			//新建shop
			var sql = 'INSERT INTO shop(name, password, address, phone, description, ads, longitude, latitude) VALUES (' +
				'"{name}","{password}","{address}","{phone}",{description},{ads},"{longitude}","{latitude}")'.format({
					name: fields.name[0],
					password: fields.password[0],
					address: fields.address[0],
					phone: fields.phone[0],
					description: fields.description[0] == undefined ? null : '"' + fields.description[0] + '"',
					ads: fields.ads[0] == undefined ? null : '"' + fields.ads[0] + '"',
					longitude: fields.longitude,
					latitude: fields.latitude
				});
			
			console.log(sql);
			
			req.db.driver.execQuery(sql, function (err, end) {
				if (err || end.length == 0) {
					res.send('0');
					return;
				}
				
				console.log(end);
				
				var imgPath = '/shop/{id}'.format({
					id: end.insertId
				});
				var imgName = '/background{name}'.format({
					name: file.getFileType(files.img[0].originalFilename)
				});
				var certPath = '/shop/{id}'.format({
					id: end.insertId
				});
				var certName = '/certificate{name}'.format({
					name: file.getFileType(files.certificate[0].originalFilename)
				});
				
				//移动文件
				file.move(files.img[0].path, '/shop/' + end.insertId + '/', imgName, res, function () {
					file.move(files.certificate[0].path, '/shop/' + end.insertId + '/', certName, res, function () {
						//数据库插入路径
						req.models.shop.find({id: end.insertId}, function (err, rows) {
							if (err || rows.length == 0) {
								res.send('0');
								return;
							}
							
							rows[0].img = uploadPath + imgPath + imgName;
							rows[0].certificate = uploadPath + certPath + certName;
							rows[0].save(function (err) {
								if (err) {
									res.send('0');
									return;
								}
								
								res.send('1');
								
								if (callBack) {
									callBack();
								}
							})
						})
					})
				})
			})
		})
	};
	
	//根据account获取信息
	//TO DO
	this.getById = function (id, dbShop, res, callBack) {
		dbShop.find({ id: id }, function (err, rows) {
			if (err) {
				res.send('0');
				return;
			}
			
			callBack(rows)
		});
	};
	
	//根据名称获取信息
	this.getByName = function (name, dbShop, res, callBack) {
		dbShop.find({ name: name }, function (err, rows) {
			if (err) {
				res.send('0');
				return;
			}
			
			callBack(rows)
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
				res.send('0');
				return;
			}
			
			callBack(rows);
		})
	};
	
	//范围内获取餐厅
	this.searchInBound = function (params, dbDriver, res, callBack) {
		var sql = '';
		// lon, lat, bound
		
		console.log(sql);
		
		dbDriver.execQuery(sql, function (err, rows) {
			if (err) {
				res.send('0');
				return;
			}
			
			callBack(rows)
		})
	};
	
	//封禁/删除
	this.del = function (id, dbShop, res, callBack) {
		dbShop.find({ id: id }, function (err, rows) {
			if (err || rows.length == 0) {
				res.send('0');
				return;
			}
			
			//设置del为1, 表示被封禁
			rows[0].del = 1;
			rows[0].save(function (err) {
				if (err) {
					res.send('0');
					return;
				}
				
				res.send('1');
				
				if (callBack) {
					callBack();
				}
			})
		});
	};
	
	//激活
	this.activate = function (id, dbShop, res, callBack) {
		dbShop.find({ id: id }, function (err, rows) {
			if (err || rows.length == 0) {
				res.send('0');
				return;
			}
			
			//设置del为0, 表示已激活
			rows[0].del = 0;
			rows[0].save(function (err) {
				if (err) {
					res.send('0');
					return;
				}
				
				res.send('1');
				
				if (callBack) {
					callBack();
				}
			})
		});
	};
	
	//注销
	this.logout = function (req, callBack) {
		req.session.destroy();
		callBack();
	}
}

module.exports = new Shop();