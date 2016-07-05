/**
 * Created by zhy on 16/7/2.
 */
function Restaurant() {
	var self = this;
	
	var connection = require('../DB/DB_Class').getConnection();
	
	this.add = function (req, res, callBack) {
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

	this.searchById = function (id, res, callBack) {
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

	this.searchByPhone = function (phone, res, callBack) {
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
	
	this.searchInBound = function (lon, lat, bound, res, callBack) {
		var sql = '';
		
		connection.query(sql, function (err, rows) {
			if (err) {
				res.send(0);
				return;
			}
			
			if (callBack != undefined) {
				callBack(rows)
			}
		})
	};
	
	this.searchSuggest = function (namePart, res, callBack) {
		var sql = '';
		
		connection.query(sql, function (err, rows) {
			if (err) {
				res.send(0);
				return;
			}
			
			callBack(rows);
		})
	};
	
	this.logout = function (req, callBack) {
		req.session.destroy();
		callBack();
	}
}

module.exports = new Restaurant();