/**
 * Created by zhy on 16/7/2.
 */
function User() {
	var self = this;
	
	var connection = require('../DB_Class').getConnection();
	var file = require('../Service/File');
	
	// this.add = function (fields, files, res, callBack) {
	// 	//移动文件
	// 	file.move(files['img'].path, '/' + account + '/', 'face' + file.getFileType(files['img'].originalFilename), res, function () {
	//
	// 		// var sql = 'INSERT INTO user(account,password) VALUES ("' + fields.account + '","' + fields.password + '");';
	// 		// sql += 'INSERT INTO user_info(phone,sex,birthday,email,name,location,picture) VALUES ("' +
	// 		// 	fields.phone + '","' + fields.sex + '","' + fields.birthday + '","' + fields.email + '","' + fields.name + '","' + null + '","' + files[0].path + '")';
	//
	// 		connection.query('INSERT INTO user(name, account, password, img, phone, birthday, sex) VALUES ("' +
	// 			fields.name[0] + '","' + account + '","' + fields.password[0] + '","/Public/upload/' + account + '/face' + file.getFileType(files['img'].originalFilename) + '","' +
	// 			fields.phone[0] + '","' + fields.birthday[0] + '","' + fields.sex[0] + '")',
	// 			function (err) {
	// 				if (err) {
	// 					res.send('0');
	// 					return;
	// 				}
	//
	// 				if (callBack != undefined) {
	// 					callBack()
	// 				}
	// 			})
	// 	})
	// };
	
	//注册
	this.add = function (req, res, callBack) {
		var account = '111111';
		
		var sql = 'INSERT INTO user(name, account, password, phone, birthday, sex) VALUES (' +
			'"{name}","{account}","{password}",{phone},{birthday},{sex})'.format({
				name: req.body.name,
				account: account,
				password: req.body.password,
				phone: req.body.phone == undefined ? null : '"' + req.body.phone + '"',
				birthday: req.body.birthday == undefined ? null : '"' + req.body.birthday + '"',
				sex: req.body.sex == undefined ? null : '"' + req.body.sex + '"'
			});
		
		console.log(sql);
		
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
	
	//所有信息
	this.all = function (res, callBack) {
		var sql = 'SELECT name, account id, password, reg_date, img, phone, birthday, sex FROM user';
		
		connection.query(sql, function (err, rows) {
			if (err) {
				res.send('0');
				return;
			}
			
			if (callBack) {
				callBack(rows);
			}
		})
	};
	
	//是否存在
	this.isExist = function (name, res, callBack) {
		var sql = 'select name from user where name={name}'.format({
			name: name
		});
		
		console.log(sql);
		
		connection.query(sql, function (err) {
			if (err) {
				res.send('0');
				return;
			}
			
			if (callBack != undefined) {
				callBack()
			}
		})
	};
	
	//更新信息
	this.update = function (req, res, callBack) {
		file.parse(req, res, function (fields, files) {
			var sql = 'SELECT account FROM user WHERE deviceid="{deviceId}"'.format({
				deviceId: fields.device_id
			});
			
			console.log(sql);
			
			//得到路径
			connection.query(sql, function (err, rows) {
				if (err || rows.length == 0) {
					res.send('0');
					return;
				}
				
				var newUserPath = '/' + rows[0].account + '/';
				var newFileName = 'face' + file.getFileType(files.img[0].originalFilename);
				
				file.move(files.img[0].path, newUserPath, newFileName, res, function () {
					// var sql = 'update user_info set ' +
					// 	'phone="' + fields.phone + '",sex="' + fields.sex + '",birthday="' + fields.birthday + '",email="' + fields.email + '",name="' + fields.name + '",picture="' + files[0].path + '" ' +
					// 	'where deviceid="' + fields.deviceId + '"';
					
					var sql = 'UPDATE user SET ' +
						'name="{name}",img="/Public/upload{path}",phone="{phone}",birthday="{birthday}",sex="{sex}" where deviceid="{deviceId}"'.format({
							name: fields.name[0],
							path: newUserPath + newFileName,
							phone: fields.phone[0],
							birthday: fields.birthday[0],
							sex: fields.sex[0],
							deviceId: fields.device_id[0]
						});
					
					console.log(sql);
					
					connection.query(sql, function (err) {
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
	
	//绑定设备
	this.bindWithDevice = function (deviceId, userId, res, callBack) {
		var sql = 'update user set deviceid="{deviceId}" where id={userId}'.format({
			deviceId: deviceId,
			userId: userId
		});
		
		console.log(sql);
		
		connection.query(sql, function (err) {
			if (err) {
				res.send('0');
				return;
			}
			
			if (callBack != undefined) {
				callBack()
			}
		})
	};
	
	//根据account获取信息
	this.getInfoByAccount = function (account, res, callBack) {
		var sql = 'SELECT name, account, img, phone, birthday, sex FROM user ' +
			'where account="{account}"'.format({
				account: account
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
	
	//根据昵称获取信息
	this.getInfoByName = function (name, res, callBack) {
		var sql = 'SELECT name, account id, img, phone, birthday, sex, longitude, latitude FROM user ' +
			'where name="{name}"'.format({
				name: name
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
	
	//根据deviceid获取信息
	this.searchByDeviceId = function (deviceId, res, callBack) {
		var sql = 'select * from user,user_info ' +
			'where user.device_id="{deviceId}"'.format({
				deviceId: deviceId
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
	
	//根据account获取密码
	this.getPasswordByAccount = function (account, res, callBack) {
		var sql = 'select password from user where ' +
			'account="{account}"'.format({
				account: account
			});
		
		console.log(sql);
		
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
	
	//范围内用户查找(预计废弃)
	this.inBound = function (lon, lat, res, callBack) {
		var sql = '';
		
		console.log(sql);
		
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
	
	//范围内查找好友
	this.friendInBound = function (deviceId, lon, lat, res, callBack) {
		var sql = '';
		
		console.log(sql);
		
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
	
	//封禁/删除
	this.del = function (account, res, callBack) {
		var sql = 'UPDATE user SET del = 1 WHERE account="{account}"'.format({
			account: account
		});
		
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
	
	//激活
	this.activate = function (account, res, callBack) {
		var sql = 'UPDATE user SET del = 0 WHERE account="{account}"'.format({
			account: account
		});
		
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
	
	//注销
	this.logout = function (deviceId, res, callBack) {
		var sql = 'UPDATE user SET deviceid = NULL WHERE deviceid = "{deviceId}"'.format({
			deviceId: deviceId
		});
		
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
	
	//管理员登陆
	this.admin = function (name, password, res, callBack) {
		var sql = 'SELECT * FROM admin ' +
			'WHERE name="{name}" AND password="{password}"'.format({
				name: name,
				password: password
			});
		
		console.log(sql);
		
		connection.query(sql, function (err, rows) {
			if (err) {
				res.send('0');
				return;
			}
			
			if (rows.length == 0) {
				res.send('-1');
				return;
			}
			
			if (callBack) {
				callBack();
			}
		})
	}
}

module.exports = new User();