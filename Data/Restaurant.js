/**
 * Created by zhy on 16/7/2.
 */
function Restaurant() {
	var self = this;
	
	var connection = require('../DB/DB_Class').getConnection();
	var file = require('../Service/File');
	var oppositePath = '/Public/upload';
	
	this.all = function (res, callBack) {
		var sql = 'SELECT account id, name, certificate, address, phone, reg_date, img, description, ads, longitude, latitude FROM shop';
		
		connection.query(sql, function (err, rows) {
			if (err) {
				res.send('0');
				return;
			}
			
			callBack(rows);
		})
	};
	
	this.add = function (req, res, callBack) {
		file.parse(req, res, function (fields, files) {
			var account = '123456';
			var imgPath = '/' + account + '/' + 'background' + file.getFileType(files.img[0].originalFilename);
			var certPath = '/' + account + '/' + 'certificate' + file.getFileType(files.certificate[0].originalFilename);
			
			file.move(files.img[0].path, '/' + account + '/', 'background' + file.getFileType(files.img[0].originalFilename), res, function () {
				var sql = 'INSERT INTO shop (name, account, password, certificate, address, phone, img, description, ads, longitude, latitude) VALUES ("' +
					fields.name[0] + '","' + account + '","' + fields.password[0] + '","' + oppositePath + certPath + '","' + fields.address[0] + '","' + fields.phone[0] + '","' +
					oppositePath + imgPath + '","' + fields.description[0] + '","' + fields.ads[0] + '","' + fields.lon + '","' + fields.lat + '")';
				
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
	
	this.getInfoByAccount = function (account, res, callBack) {
		var sql = 'SELECT account id, name, certificate, address, phone, reg_date, img, description, ads, longitude, latitude FROM shop ' +
			'WHERE account = "' + account + '"';
		
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
	
	this.getInfoByName = function (name, res, callBack) {
		var sql = 'SELECT account id, name, certificate, address, phone, reg_date, img, description, ads, longitude, latitude FROM shop ' +
			'WHERE name = "' + name + '"';
		
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
	
	this.getPasswordByAccount = function (account, res, callBack) {
		var sql = 'SELECT password FROM shop ' +
			'WHERE account="' + account + '"';
		
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
	
	this.searchInBound = function (lon, lat, bound, res, callBack) {
		var sql = '';
		
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
	
	this.searchSuggest = function (namePart, res, callBack) {
		var sql = 'SELECT name, account id FROM shop ' +
			'WHERE name LIKE "%' + namePart + '%"';
		
		console.log(sql);
		
		connection.query(sql, function (err, rows) {
			if (err) {
				res.send('0');
				return;
			}
			
			callBack(rows);
		})
	};
	
	this.del = function (account, res, callBack) {
		var sql = 'UPDATE shop SET del = 1 WHERE account="' + account + '"';
		
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
	
	this.activate = function (account, res, callBack) {
		var sql = 'UPDATE shop SET del = 0 WHERE account="' + account + '"';
		
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
	
	this.logout = function (req, callBack) {
		req.session.destroy();
		callBack();
	}
}

module.exports = new Restaurant();