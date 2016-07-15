/**
 * Created by zhy on 16/7/2.
 */
function User() {
	// var self = this;
	
	// var connection = require('../DB_Class').getConnection();
	var file = require('../Service/File');
	var uploadPath = '/upload';
	
	
	//验证密码, 返回id
	this.authByName = function (params, dbDriver, res, callBack) {
		var sql = 'select id, password from user where ' +
			'name="{name}"'.format({
				name: params.name
			});
		
		console.log(sql);
		
		dbDriver.execQuery(sql, function (err, rows) {
			if (err) {
				res.send('0');    //unknown error
				return;
			}
			
			if (rows.length == 0) {
				res.send('-1');   //user not found
				return;
			}
			
			if (rows[0].password != params.password) {
				res.send('-2'); //password error
				return;
			}
			
			callBack(rows[0].id);
		})
	};
	
	this.authByPhone = function (params, dbDriver, res, callBack) {
		var sql = 'select id, password from user where ' +
			'phone="{phone}"'.format({
				phone: params.phone
			});
		
		console.log(sql);
		
		dbDriver.execQuery(sql, function (err, rows) {
			if (err) {
				res.send('0');    //unknown error
				return;
			}
			
			if (rows.length == 0) {
				res.send('-1');   //user not found
				return;
			}
			
			if (rows[0].password != params.password) {
				res.send('-2'); //password error
				return;
			}
			
			callBack(rows[0].id);
		})
	};
	
	//注册
	this.add = function (params, dbUser, res, callBack) {
		dbUser.create({
			name: params.name,
			password: params.password,
			phone: params.phone,
			del: 0
		}, function (err, rows) {
			if (err) {
				res.send('0');
				return;
			}
			
			console.log(rows);
			
			res.send('1');
			
			if (callBack) {
				callBack()
			}
		})
	};
	
	//所有信息
	this.all = function (dbUser, res, callBack) {
		dbUser.find(function (err, rows) {
			if (err) {
				res.send('0');
				return;
			}
			
			callBack(rows);
		})
	};
	
	//是否存在
	this.isExist = function (name, dbDriver, res) {
		var sql = 'select name from user where name={name}'.format({
			name: name
		});
		
		console.log(sql);
		
		dbDriver.execQuery(sql, function (err, rows) {
			if (err) {
				res.send('0');
				return;
			}
			
			if (rows.length == 0) {
				res.send('-1');
				return;
			}
			
			res.send('1');
		})
	};
	
	//更新信息
	this.update = function (req, res, callBack) {
		file.parse(req, res, function (fields, files) {
			//得到用户id
			req.models.user.find({ device_id: fields.deviceId[0] }, function (err, rows) {
				if (err || rows.length == 0) {
					res.send('0');
					return;
				}
				
				//userId
				var userId = rows[0].id;
				
				//图片路径
				var newUserPath = '/user/{id}'.format({
					id: userId
				});
				var newFileName = '/face{ext}'.format({
					ext: file.getFileType(files.img[0].originalFilename)
				});
				
				file.move(files.img[0].path, newUserPath, newFileName, res, function () {
					//修改数据
					var row = rows[0];
					
					row.name = fields.name[0];
					row.phone = fields.phone[0];
					row.img = uploadPath + newUserPath + newFileName;
					//可选数据
					row.birthday = (fields.birthday && fields.birthday[0]) ? fields.birthday[0] : null;
					row.mail = (fields.mail && fields.mail[0]) ? fields.mail[0] : null;
					row.sex = (fields.sex && fields.sex[0]) ? fields.sex[0] : null;
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
	
	//绑定设备
	this.bindWithDevice = function (dbDriver, deviceId, userId, res, callBack) {
		var sql = 'update user set device_id="{deviceId}" where id={userId}'.format({
			deviceId: deviceId,
			userId: userId
		});
		
		console.log(sql);
		
		dbDriver.execQuery(sql, function (err) {
			if (err) {
				res.send('0');
				return;
			}
			
			res.send('1');
			
			if (callBack != undefined) {
				callBack()
			}
		})
	};
	
	this.getIdByDeviceId = function (deviceId, dbDriver, res, callBack) {
		var sql = 'SELECT id FROM user WHERE device_id={id}'.format({
			id: deviceId
		});
		
		dbDriver.execQuery(sql, function (err, rows) {
			if (err) {
				res.send('0');
				return;
			}
			
			if (rows.length == 0) {
				res.send('-1');
				return;
			}
			
			callBack(rows[0].id)
		})
	};
	
	//根据id获取信息
	this.getById = function (id, dbUser, res, callBack) {
		dbUser.find({ id: id }, function (err, rows) {
			if (err) {
				res.send('0');
				return;
			}
			
			callBack(rows);
		})
	};
	
	//根据昵称获取信息
	this.getByName = function (name, dbUser, res, callBack) {
		dbUser.find({ name: name }, function (err, rows) {
			if (err) {
				res.send('0');  //内部错误
				return;
			}
			
			if (rows.length == 0) {
				res.send('-1'); //未找到
				return;
			}
			
			callBack(rows);
		})
	};
	
	//根据deviceid获取信息
	this.getByDeviceId = function (deviceId, dbUser, res, callBack) {
		dbUser.find({ device_id: deviceId }, function (err, rows) {
			if (err) {
				res.send('0');
				return;
			}
			
			if (rows.length == 0) {
				res.send('-1');
				return;
			}
			
			callBack(rows);
		})
	};
	
	//范围内用户查找(预计废弃)
	this.getInBound = function (params, dbDriver, res, callBack) {
		var sql = '';
		
		console.log(sql);
		
		dbDriver.execQuery(sql, function (err) {
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
	this.friendInBound = function (params, dbDriver, res, callBack) {
		var sql = '';
		
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
	this.del = function (id, dbUser, res, callBack) {
		dbUser.find({ id: id }, function (err, rows) {
			if (err) {
				res.send('0');
				return;
			}
			
			if (rows.length == 0) {
				res.send('-1');
				return;
			}
			
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
	this.activate = function (id, dbUser, res, callBack) {
		dbUser.find({ id: id }, function (err, rows) {
			if (err) {
				res.send('0');
				return;
			}
			
			if (rows.length == 0) {
				res.send('-1');
				return;
			}
			
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
	this.logout = function (deviceId, dbDriver, res, callBack) {
		var sql = 'UPDATE user SET device_id = NULL WHERE device_id = "{deviceId}"'.format({
			deviceId: deviceId
		});

		dbDriver.execQuery(sql, function (err) {
			if (err) {
				res.send('0');
				return;
			}
			
			res.send('1');
			
			if (callBack) {
				callBack()
			}
		})
	};
	
	//管理员登陆
	this.admin = function (params, session, dbAdmin, res, callBack) {
		dbAdmin.find({
			id: params.id,
			password: params.password
		}, function (err, rows) {
			if (err) {
				res.send('0');  //内部错误
				return;
			}
			
			if (rows.length == 0) {
				res.send('-1'); //密码错误
				return;
			}
			
			//设置session
			session.admin = 1;
			res.send('1');
			
			if (callBack) {
				callBack();
			}
		});
	}
}

module.exports = new User();