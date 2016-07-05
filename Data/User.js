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
			//移动文件
			file.move(files['img'].path,
				'/' + req.session.userId + '/',
				'face.png', res,
				function () {
					var sql = '';

					connection.query(sql, function (err) {
						if (err) {
							res.send(0);
							return;
						}

						if (callBack != undefined) {
							callBack()
						}
					})
			})
		})
	};
	
	this.update = function (deviceId, res, callBack) {
		var sql = '';
		
		connection.query(sql, function (err) {
			if (err) {
				res.send(0);
				return;
			}
			
			if (callBack != undefined) {
				callBack()
			}
		})
	};
	
	this.bindWithDevice = function (deviceId, res, callBack) {
		var sql = '';
		
		connection.query(sql, function (err) {
			if (err) {
				res.send(0);
				return;
			}
			
			if (callBack != undefined) {
				callBack()
			}
		})
	};
	
	this.searchById = function (userId, res, callBack) {
		var sql = '';
		
		connection.query(sql, function (err, rows) {
			if (err) {
				return;
			}
			
			callBack(rows);
		})
	};
	
	this.searchByDeviceId = function (deviceId, res, callBack) {
		var sql = '';
		
		connection.query(sql, function (err, rows) {
			if (err) {
				return;
			}
			
			callBack(rows);
		})
	};
	
	this.searchByPhone = function (phone, res, callBack) {
		var sql = '';
		
		connection.query(sql, function (err, rows) {
			if (err) {
				res.send(0);    //unknown error
				return;
			}
			
			if (rows.length == 0) {
				res.send(-1);   //user not found
				return;
			}
			
			callBack(rows);
		})
	};
	
	this.inBound = function (lon, lat, res, callBack) {
		var sql = '';
		
		connection.query(sql, function (err) {
			if (err) {
				res.send(0);
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
				res.send(0);
				return;
			}
			
			if (callBack) {
				callBack()
			}
		})
	};
	
	this.logout = function (req, res, callBack) {
		var sql = '';

		connection.query(sql, function (err) {
			if (err) {
				res.send(0);
				return;
			}

			if (callBack) {
				callBack()
			}
		})
	};
}

module.exports = new User();