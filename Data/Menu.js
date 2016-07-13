/**
 * Created by zhy on 16/7/2.
 */
function Menu() {
	var self = this;
	
	var connection = require('../DB_Class').getConnection();

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

	this.all = function (res, callBack) {
		var sql1 = 'SELECT name, img, price, description, type, evaluate FROM `menu-user`, `menu_material-user`, `material-user`' +
			'WHERE `menu-user`.id = `menu_material-user`.menu_id AND `material-user`.id = `menu_material-user`.material_id';

		console.log(sql1);

		connection.query(sql1, function (err, rows1) {
			if (err) {
				res.send('0');
				return;
			}

			rows1.forEach(function (row) {
				row.menuType = 0;
			});

			var sql2 = 'SELECT id, name, img, price, description, type, evaluate FROM `menu-shop`';

			console.log(sql2);

			connection.query(sql2, function (err, rows2) {
				if (err) {
					res.send('0');
					return;
				}

				rows2.forEach(function (row) {
					row.menuType = 1;
				});

				var rows = rows1.concat(rows2);

				if (callBack) {
					callBack(rows);
				}
			})
		});
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
	
	this.del = function (account, menuType, res, callBack) {
		var sql;

		if (menuType == '0') {
			sql = 'UPDATE `menu-user` SET del = 1 WHERE id=' + account;
		}
		else if (menuType == '1') {
			sql = 'UPDATE `menu-shop` SET del = 1 WHERE id=' + account;
		}
		else {
			res.send('0');
		}
		
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
	
	this.activate = function (account, menuType, res, callBack) {
		var sql;

		if (menuType == '0') {
			sql = 'UPDATE `menu-user` SET del = 0 WHERE id=' + account;
		}
		else if (menuType == '1') {
			sql = 'UPDATE `menu-shop` SET del = 0 WHERE id=' + account;
		}
		else {
			res.send('0');
			return;
		}
		
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
