/**
 * Created by zhy on 7/11/16.
 */
function Admin() {
	var self = this;

	var connection = require('../DB/DB_Class').getConnection();

	this.forbidShop = function (account, res, callBack) {
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

	this.activateShop = function (account, res, callBack) {
		var sql = 'UPDATE user SET del = 1 WHERE account="' + account + '"';
		
		connection.query(sql, function (err) {
			if (err) {
				res.send('0');
				return;
			}
			
			if  (callBack) {
				callBack();
			}
		})
	}
}

module.exports = new Admin();