/**
 * Created by zhy on 16/7/2.
 */
function Order() {
	var self = this;

	var connection = require('../DB/DB_Class').getConnection();

	this.add = function (req, res, callBack) {
		var sql = '';

		connection.query(sql, function (err, rows) {
			if (err) {
				return;
			}

			if (callBack != undefined) {
				callBack(rows)
			}
		})
	};

	this.searchWithId = function (userId, res, callBack) {
		var sql = '';

		connection.query(sql, function (err) {
			if (err) {
				return;
			}

			if (callBack != undefined) {
				callBack()
			}
		})
	};

	this.finish = function (menuId, res, callBack) {
		var sql = '';

		connection.query(sql, function (err) {
			if (err) {
				return;
			}

			if (callBack != undefined) {
				callBack()
			}
		})
	};

	this.cancel = function (menuId, res, callBack) {
		var sql = '';

		connection.query(sql, function (err) {
			if (err) {
				return;
			}

			if (callBack != undefined) {
				callBack()
			}
		})
	}
}

module.exports = new Order();
