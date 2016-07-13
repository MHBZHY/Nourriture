/**
 * Created by zhy on 16/7/2.
 */
function Restaurant() {
	// var self = this;
	
	var connection = require('../DB_Class').getConnection();
	var file = require('../Service/File');
	var oppositePath = '/Public/upload';
	
	this.all = function (res, callBack) {
		var sql = 'SELECT account id, name, certificate, address, phone, reg_date, img, description, ads, longitude, latitude FROM shop';
		
		console.log(sql);
		
		connection.query(sql, function (err, rows) {
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
			var account = '123456';
			var imgPath = '/shop/{account}/background{name}'.format({
				account: account,
				name: file.getFileType(files.img[0].originalFilename)
			});
			var certPath = '/shop/{account}/certificate{name}'.format({
				account: account,
				name: file.getFileType(files.certificate[0].originalFilename)
			});
			
			//移动文件
			file.move(files.img[0].path, '/' + account + '/', 'background' + file.getFileType(files.img[0].originalFilename), res, function () {
				var sql = 'INSERT INTO shop(name, account, password, certificate, address, phone, img, description, ads, longitude, latitude) VALUES (' +
						'"{name}","{account}","{password}","{certificate}","{address}","{phone}","{img}",{description},{ads},"{longitude}","{latitude}")'.format({
							name: fields.name[0],
							account: account,
							password: fields.password[0],
							certificate: oppositePath + certPath,
							address: fields.address[0],
							phone: fields.phone[0],
							img: oppositePath + imgPath,
							description: fields.description[0] == undefined ? null : '"' + fields.description[0] + '"',
							ads: fields.ads[0] == undefined ? null : '"' + fields.ads[0] + '"',
							longitude: fields.lon,
							latitude: fields.lat
						});
				
				console.log(sql);
				
				connection.query(sql, function (err) {
					if (err) {
						console.log(err);
						res.send('0');
						return;
					}
					
					if (callBack != undefined) {
						callBack()
					}
				})
			})
		});
	};
	
	//根据account获取信息
	this.getInfoByAccount = function (account, res, callBack) {
		var sql = 'SELECT account id, name, certificate, address, phone, reg_date, img, description, ads, longitude, latitude FROM shop ' +
			'WHERE account = "{account}"'.format({
				account: account
			});
		
		console.log(sql);
		
		connection.query(sql, function (err, rows) {
			if (err) {
				res.send('0');
				return;
			}
			
			if (callBack != undefined) {
				callBack(rows)
			}
		})
	};
	
	//根据名称获取信息
	this.getInfoByName = function (name, res, callBack) {
		var sql = 'SELECT account id, name, certificate, address, phone, reg_date, img, description, ads, longitude, latitude FROM shop ' +
			'WHERE name = "{name}"'.format({
				name: name
			});
		
		console.log(sql);
		
		connection.query(sql, function (err, rows) {
			if (err) {
				res.send('0');
				return;
			}
			
			if (callBack) {
				callBack(rows)
			}
		})
	};
	
	//根据account获取密码
	this.getPasswordByAccount = function (account, res, callBack) {
		var sql = 'SELECT password FROM shop ' +
			'WHERE account="{account}"'.format({
				account: account
			});
		
		console.log(sql);
		
		connection.query(sql, function (err, rows) {
			if (err) {
				res.send('0');    //internal error
				return;
			}
			
			if (rows.length == 0) {
				res.send('-1');   //user not found
			}
			
			if (callBack != undefined) {
				callBack(rows)
			}
		})
	};
	
	//范围内获取餐厅
	this.searchInBound = function (lon, lat, bound, res, callBack) {
		var sql = '';
		
		console.log(sql);
		
		connection.query(sql, function (err, rows) {
			if (err) {
				res.send('0');
				return;
			}
			
			if (callBack != undefined) {
				callBack(rows)
			}
		})
	};
	
	//搜索建议(名称)
	this.searchSuggest = function (namePart, res, callBack) {
		var sql = 'SELECT name, account id FROM shop ' +
			'WHERE name LIKE "%{namePart}%"'.format({
				namePart: namePart
			});
		
		console.log(sql);
		
		connection.query(sql, function (err, rows) {
			if (err) {
				res.send('0');
				return;
			}
			
			callBack(rows);
		})
	};
	
	//封禁/删除
	this.del = function (account, res, callBack) {
		var sql = 'UPDATE shop SET del = 1 WHERE account="{account}"'.format({
			account: account
		});
		
		console.log(sql);
		
		connection.query(sql, function (err) {
			if (err) {
				res.send('0');
				return;
			}
			
			if  (callBack) {
				callBack();
			}
		})
	};
	
	//激活
	this.activate = function (account, res, callBack) {
		var sql = 'UPDATE shop SET del = 0 WHERE account="{account}"'.format({
			account: account
		});
		
		console.log(sql);
		
		connection.query(sql, function (err) {
			if (err) {
				res.send('0');
				return;
			}
			
			if  (callBack) {
				callBack();
			}
		})
	};
	
	//注销
	this.logout = function (req, callBack) {
		req.session.destroy();
		callBack();
	}
}

module.exports = new Restaurant();