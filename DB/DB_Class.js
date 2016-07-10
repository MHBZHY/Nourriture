/**
 * Created by zhy on 16/7/2.
 */
function DB() {
    var mysql = require('mysql');

    var host = 'localhost';
	// var host = '123.206.64.143';
    var port = '3306';
    var user = 'root';
    var password = '248326';
	// var password = '1234root5678';
    var db = 'Nourriture';
    var charset = 'UTF8_BIN';

	var connection;

	this.getConnection = function () {
        if (connection == undefined) {
	        connection = mysql.createConnection({
		        host: host,
		        user: user,
		        password: password,
		        port: port,
		        database: db,
		        charset: charset,
		        dateStrings: true,
		        multipleStatements: true
	        });

	        connection.connect();
        }

        return connection;
    }
}

module.exports = new DB();