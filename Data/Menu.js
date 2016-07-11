/**
 * Created by zhy on 16/7/2.
 */
function Menu() {
	var self = this;
	
	var connection = require('../DB/DB_Class').getConnection();

	//上传菜谱
	this.add = function (req, res, callBack) {
		var sql;

		switch (req.body.type) {
			case 0:
				//用户上传菜谱
				sql = '';
				break;

			case 1:
				//商家上传菜谱
				sql = '';
				break;

			default:
				sql = '';
				break;
		}

		connection.query(sql, function (err) {
			if (err) {
				return;
			}

			if (callBack != undefined) {
				callBack()
			}
		})
	};
	
	//获取单个菜单
	this.getById = function (menuId, res, callBack) {
		var sql = '';
		
		connection.query(sql, function (err, rows) {
			if (err) {
				return;
			}
			
			callBack(rows);
		})
	};
	
	this.getByUser = function (req, res, callBack) {
		var sql = '';
		
		if (req.body.deviceId != undefined) {
			
		}
		else {
			
		}
		
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
	this.updateById = function (menuId, res, callBack) {
		var sql = '';

		connection.query(sql, function (err, rows) {
			if (err) {
				return;
			}

			callBack(rows);
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
	
	this.del = function (account, res, callBack) {
		var sql = 'UPDATE menu-shop, menu-user SET del = 1 WHERE account="' + account + '"';
		
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
		var sql = 'UPDATE user SET del = 0 WHERE account="' + account + '"';
		
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
}

module.exports = new Menu();
