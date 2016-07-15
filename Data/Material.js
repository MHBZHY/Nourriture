/**
 * Created by zhy on 16/7/14.
 */
function Material() {
	
	var connection = require('../DB_Class').getConnection();
	
	this.getByMenuIdForUser = function (menuId, res, callBack) {
		var sql = 'SELECT ma_u.id, ma_u.name, nutrition_value, ma_u.img FROM `material-user` ma_u, `menu-user` me_u, `menu_material-user` me_ma_u ' +
			'WHERE me_ma_u.menu_id = me_u.id AND me_ma_u.material_id = ma_u.id';
		
		connection.query(sql, function (err, rows) {
			if (err) {
				res.send('0');
				return;
			}
			
			callBack(rows);
		})
	};
	
	this.getByMenuIdForShop = function (menuId, res, callBack) {
		var sql = 'SELECT `material-shop`.id, `material-shop`.name, nutrition_value, `material-shop`.img FROM `menu-shop`, `material-shop`, `menu_material-shop` ' +
			'WHERE `menu_material-shop`.menu_id = `menu-shop`.id AND `menu_material-shop`.material_id = `material-shop`.id';
		
		connection.query(sql, function (err, rows) {
			if (err) {
				res.send('0');
				return;
			}
			
			callBack(rows);
		})
	}
}

module.exports = new Material();