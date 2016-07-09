/**
 * Created by zhy on 16/7/2.
 */
function User() {
	var self = this;
	
	var connection = require('../DB/DB_Class').getConnection();
	var file = require('../Service/File');
	
	this.add = function (req, res, callBack) {
		//解析包含二进制数据的请求
		file.parse(req, res, function (fields, files) {
			var account = '1234567';    //测试用account
			
			//移动文件
			file.move(files['img'].path, '/' + account + '/', 'face' + file.getFileType(files['img'].originalFilename), res, function () {
				
				// var sql = 'INSERT INTO user(account,password) VALUES ("' + fields.account + '","' + fields.password + '");';
				// sql += 'INSERT INTO user_info(phone,sex,birthday,email,name,location,picture) VALUES ("' +
				// 	fields.phone + '","' + fields.sex + '","' + fields.birthday + '","' + fields.email + '","' + fields.name + '","' + null + '","' + files[0].path + '")';
				
				connection.query('INSERT INTO user(name, account, password, img, phone, birthday, sex) VALUES ("' +
					fields.name[0] + '","' + account + '","' + fields.password[0] + '","/Public/upload/' + account + '/face' + file.getFileType(files['img'].originalFilename) + '","' +
					fields.phone[0] + '","' + fields.birthday[0] + '","' + fields.sex[0] + '")',
					function (err) {
						if (err) {
							res.send('0');
							return;
						}
						
						if (callBack != undefined) {
							callBack()
						}
					})
			})
		})
	};
	
	this.isExist = function (name, res, callBack) {
		connection.query('select name from user where name="' + name + '"', function (err) {
			if (err) {
				res.send('0');
				return;
			}
			
			if (callBack != undefined) {
				callBack()
			}
		})
	};
	
	this.update = function (req, res, callBack) {
		file.parse(req, res, function (fields, files) {
			//得到路径
			connection.query('SELECT account FROM user WHERE device_id="' + fields.device_id + '"', function (err, rows) {
				if (err || rows.length == 0) {
					res.send('0');
					return;
				}
				
				var newUserPath = '/' + rows[0].account + '/';
				var newFileName = 'face' + file.getFileType(files['img'].originalFilename);
				
				file.move(files.img.path, newUserPath, newFileName, res, function () {
					// var sql = 'update user_info set ' +
					// 	'phone="' + fields.phone + '",sex="' + fields.sex + '",birthday="' + fields.birthday + '",email="' + fields.email + '",name="' + fields.name + '",picture="' + files[0].path + '" ' +
					// 	'where device_id="' + fields.deviceId + '"';
					
					connection.query('UPDATE user SET ' +
						'name="' + fields.name[0] + '",img="/Public/upload' + newUserPath + newFileName +
						'",phone="' + fields.phone[0] + '",birthday="' + fields.birthday[0] + '",sex="' + fields.sex[0] + '" ' +
						'where device_id="' + fields.device_id[0] + '"',
						function (err) {
							if (err) {
								res.send('0');
								return;
							}
							
							if (callBack != undefined) {
								callBack()
							}
						})
				})
			})
		})
	};
	
	this.bindWithDevice = function (deviceId, userId, res, callBack) {
		connection.query('update user set device_id="' + deviceId + '" ' +
			'where id=' + userId,
			function (err) {
				if (err) {
					res.send('0');
					return;
				}
				
				if (callBack != undefined) {
					callBack()
				}
			})
	};
	
	this.getInfoByAccount = function (account, res, callBack) {
		connection.query('SELECT name, account, img, phone, birthday, sex FROM user ' +
			'where account="' + account + '"',
			function (err, rows) {
				if (err) {
					res.send('0');
					return;
				}
				
				callBack(rows);
			})
	};
	
	this.searchByDeviceId = function (deviceId, res, callBack) {
		var sql = 'select * from user,user_info ' +
			'where user.device_id="' + deviceId + '"';
		
		connection.query(sql, function (err, rows) {
			if (err) {
				res.send('0');
				return;
			}
			
			callBack(rows);
		})
	};
	
	this.getPasswordByAccount = function (account, res, callBack) {
		var sql = 'select password from user where ' +
			'account="' + account + '"';
		
		connection.query(sql, function (err, rows) {
			if (err) {
				res.send('0');    //unknown error
				return;
			}
			
			if (rows.length == 0) {
				res.send('-1');   //user not found
				return;
			}
			
			callBack(rows);
		})
	};
	
	this.inBound = function (lon, lat, res, callBack) {
		var sql = '';
		
		connection.query(sql, function (err) {
			if (err) {
				res.send('0');
				return;
			}
			
			if (callBack) {
				callBack()
			}
		})
	};
	
	this.friendInBound = function (deviceId, lon, lat, res, callBack) {
		var sql = '';
		
		connection.query(sql, function (err) {
			if (err) {
				res.send('0');
				return;
			}
			
			if (callBack) {
				callBack()
			}
		})
	};
	
	this.logout = function (deviceId, res, callBack) {
		connection.query('UPDATE user SET device_id = NULL WHERE device_id = "' + deviceId + '"',
			function (err) {
				if (err) {
					res.send('0');
					return;
				}
				
				if (callBack) {
					callBack()
				}
			})
	};
}

module.exports = new User();