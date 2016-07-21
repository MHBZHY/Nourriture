/**
 * Created by zhy on 16/7/2.
 */
function User() {
	// var self = this;
	
	// var connection = require('../DB_Class').getConnection();
	var file = require('../Service/File');
	var uploadPath = '/upload';
	
	
	
	// 验证密码, 返回id
	this.authByName = function (params, dbDriver, res, callBack) {
		var sql = 'select id, password, del from user where ' +
			'name="{name}"'.format({
				name: params.name
			});
		
		console.log(sql);
		
		dbDriver.execQuery(sql, function (err, rows) {
			if (err) {
				res.send(JSON.stringify(0));    //unknown error
				return;
			}
			
			if (rows.length == 0) {
				res.send(JSON.stringify(-1));   //user not found
				return;
			}
			
			if (rows[0].del == 1) {
				res.send(JSON.stringify(-9));   //user not found
				return;
			}
			
			if (rows[0].password != params.password) {
				res.send(JSON.stringify(-2));   //password error
				return;
			}
			
			callBack(rows[0].id);
		});
	};
	
	this.authByPhone = function (params, dbDriver, res, callBack) {
		var sql = 'select id, password, del from user where ' +
			'phone="{phone}"'.format({
				phone: params.phone
			});
		
		console.log(sql);
		
		dbDriver.execQuery(sql, function (err, rows) {
			if (err) {
				res.send(JSON.stringify(0));    //unknown error
				return;
			}
			
			if (rows.length == 0) {
				res.send(JSON.stringify(-1));   //user not found
				return;
			}
			
			if (rows[0].del == 1) {
				res.send(JSON.stringify(-9));   //user not found
				return;
			}
			
			if (rows[0].password != params.password) {
				res.send(JSON.stringify(-2)); //password error
				return;
			}
			
			callBack(rows[0].id);
		});
	};
	
	//注册
	this.add = function (params, dbUser, res, callBack) {
		dbUser.create({
			name: params.name,
			password: params.password,
			phone: params.phone,
			del: 0
		}, function (err, result) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			// console.log(rows);
			
			callBack(result.id)
		});
	};
	
	//所有信息
	this.all = function (dbUser, res, callBack) {
		dbUser.find(function (err, rows) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			callBack(rows);
		});
	};
	
	//用户是否存在
	this.isExist = function (params, dbUser, res, callBack) {
		if (params.id) {
			dbUser.exists({ id: params.id }, function (err, count) {
				if (err || !count) {
					res.send(JSON.stringify(0));
					return;
				}
				
				callBack()
			});
		}
	};
	
	//名称是否已存在
	this.nameIsExist = function (name, dbUser, res, callBack) {
		dbUser.exists({ name: name }, function (err, count) {
			if (err) {
				res.send(JSON.stringify(-1));
				return;
			}
			
			if (!count) {
				res.send(JSON.stringify(0));
				return;
			}
			
			callBack()
		});
	};
	
	//更新信息
	this.update = function (dbUser, fields, files, res, callBack) {
		//得到用户id
		req.models.user.find({ device_id: fields.deviceId[0] }, function (err, rows) {
			if (err || rows.length == 0) {
				res.send(JSON.stringify(0));
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
						res.send(JSON.stringify(0));
						return;
					}
					
					callBack();
				});
			});
		});
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
				res.send(JSON.stringify(0));
				return;
			}
			
			callBack()
		});
	};
	
	this.getIdByDeviceId = function (deviceId, dbDriver, res, callBack) {
		var sql = 'SELECT id FROM user WHERE device_id="{id}" AND del=0'.format({
			id: deviceId
		});
		
		dbDriver.execQuery(sql, function (err, rows) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			if (rows.length == 0) {
				res.send(JSON.stringify(-10));    //未登录
				return;
			}
			
			console.log(rows);
			callBack(rows[0].id);
		});
	};
	
	//根据id获取信息
	this.getInfoById = function (id, dbUser, res, callBack) {
		dbUser.find({ id: id }, function (err, rows) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			callBack(rows);
		});
	};
	
	//根据昵称获取信息
	this.getInfoByName = function (name, dbUser, res, callBack) {
		dbUser.find({ name: name }, function (err, rows) {
			if (err) {
				res.send(JSON.stringify(0));  //内部错误
				return;
			}
			
			if (rows.length == 0) {
				res.send(JSON.stringify(-1)); //未找到
				return;
			}
			
			callBack(rows);
		});
	};
	
	//根据deviceid获取信息
	this.getByDeviceId = function (deviceId, dbUser, res, callBack) {
		dbUser.find({ device_id: deviceId }, function (err, rows) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			if (rows.length == 0) {
				res.send(JSON.stringify(-1));
				return;
			}
			
			callBack(rows);
		});
	};
	
	//范围内用户查找(预计废弃)
	this.getInBound = function (params, dbDriver, res, callBack) {
		var sql = '';
		
		console.log(sql);
		
		dbDriver.execQuery(sql, function (err) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			callBack()
		});
	};
	
	//获得好友
	this.friend = function (params, dbDriver, res, callBack) {
		var sql = 'SELECT @userId:=id FROM user ' +
			'WHERE device_id={deviceId};'.format({
				deviceId: params.deviceId
			}) +
			'SELECT user.* FROM user, friend ' +
			'WHERE friend.user_id=@userId AND friend.friend_id=user.id';
		
		console.log(sql);
		
		dbDriver.execQuery(sql, function (err, rows) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			callBack(rows);
		});
	};
	
	//范围内查找好友
	this.friendInBound = function (userId, location, distance, dbDriver, res, callBack) {
		var sql = '';
		
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
	this.del = function (userId, dbUser, res, callBack) {
		dbUser.find({ id: userId }, function (err, rows) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			if (rows.length == 0) {
				res.send(JSON.stringify(-1));
				return;
			}
			
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
	this.activate = function (userId, dbUser, res, callBack) {
		dbUser.find({ id: userId }, function (err, rows) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			if (rows.length == 0) {
				res.send(JSON.stringify(-1));
				return;
			}
			
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
	this.logout = function (deviceId, dbDriver, res, callBack) {
		var sql = 'UPDATE user SET device_id = NULL WHERE device_id = "{deviceId}"'.format({
			deviceId: deviceId
		});

		dbDriver.execQuery(sql, function (err) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			callBack()
		});
	};
	
	//管理员登陆
	this.admin = function (params, dbAdmin, res, callBack) {
		dbAdmin.find({
			id: params.name,
			password: params.password
		}, function (err, rows) {
			if (err) {
				res.send(JSON.stringify(0));  //内部错误
				return;
			}
			
			if (rows.length == 0) {
				res.send(JSON.stringify(-1)); //密码错误
				return;
			}
			
			callBack()
		});
	}
}

module.exports = new User();