/**
 * Created by zhy on 16/7/2.
 */
function Menu() {
	var self = this;
	
	var connection = require('../DB_Class').getConnection();
	
	//上传菜谱
	this.add = function (req, res, callBack) {
		if (req.body.deviceId) {
			//用户上传
			
		}
		else {
			//商家上传
			req.models.Menu.create({
				name: req.body.name,
				img: req.body.img,
				price: req.body.price,
				description: req.body.description,
				type: req.body.type,
				evaluate: req.body.evaluate,
				score: req.body.score
			}, function (err, results) {
				if (err) {
					res.send('0');
					return;
				}
				
				if (callBack) {
					callBack();
				}
			})
		}
		
		// connection.query(sql, function (err) {
		// 	if (err) {
		// 		return;
		// 	}
		//
		// 	if (callBack != undefined) {
		// 		callBack()
		// 	}
		// })
	};
	
	this.all = function (req, res, callBack) {
		req.models.Menu_User.find(function (err, userMenus) {
			if (err) {
				res.send('0');
				return;
			}
			
			req.models.Menu_Shop.find(function (err, shopMenus) {
				if (err) {
					res.send('0');
					return;
				}
				
				callBack(userMenus.concat(shopMenus));
			})
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
			
			if (callBack) {
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
			
			if (callBack) {
				callBack();
			}
		})
	};
}

module.exports = new Menu();
