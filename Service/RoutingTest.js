/**
 * Created by zhy on 16/7/14.
 */
module.exports.router = function (app) {
	var user = require('../Data/User');
	var shop = require('../Data/Shop');
	var menu = require('../Data/Menu');
	var order = require('../Data/Order');
	var material = require('../Data/Material');
	
	var bodyParser = require('body-parser');
	var path = require('path');
	// var service = require('./Service');
	
	var urlEncodedParser = bodyParser.urlencoded({extended: false});
	
	app.post('/all_user', urlEncodedParser, function (req, res) {
		user.all(req.models.user, res, function (rows) {
			res.send(rows);
		})
	});
	
	app.post('/register_user', urlEncodedParser, function (req, res) {
		user.add(req.body, req.models.user, res);
	});
	
	app.post('/user_exist', urlEncodedParser, function (req, res) {
		user.isExist(req.body.name, req.db.driver, res);
	});
	
	app.post('/user_update', urlEncodedParser, function (req, res) {
		user.update(req, res);
	});
	
	app.post('/user_login', urlEncodedParser, function (req, res) {
		user.authByName(req.body, req.db.driver, res, function (id) {
			user.bindWithDevice(req.db.driver, req.body.deviceId, id, res);
		})
	});
	
	app.post('/user_id', urlEncodedParser, function (req, res) {
		user.getById(req.body.id, req.models.user, res, function (rows) {
			res.send(rows);
		});
	});
	
	app.post('/user_name', urlEncodedParser, function (req, res) {
		user.getByName(req.body.name, req.models.user, res, function (rows) {
			res.send(rows);
		})
	});
	
	app.post('/user_deviceId', urlEncodedParser, function (req, res) {
		user.getByDeviceId(req.body.deviceId, req.models.user, res, function (rows) {
			res.send(rows);
		})
	});
	
	app.post('/user_del', urlEncodedParser, function (req, res) {
		user.del(req.body.id, req.models.user, res);
	});
	
	app.post('/user_logout', urlEncodedParser, function (req, res) {
		user.logout(req.body.deviceId, req.db.driver, res);
	});
	
	app.post('/admin_login', urlEncodedParser, function (req, res) {
		user.admin(req.body, req.session, req.models.admin, res);
	});
	
	app.post('/shop_all', urlEncodedParser, function (req, res) {
		shop.all(req.models.shop, res, function (rows) {
			res.send(rows);
		})
	});
	
	app.post('/register_shop', urlEncodedParser, function (req, res) {
		shop.add(req, res);
	});
	
	app.post('/shop_login', urlEncodedParser, function (req, res) {
		shop.authByName(req.body.name, req.body.password, req.db.driver, res, function (id) {
			req.session.shopId = id;
			res.send('1');
		})
	});
	
	app.post('/shop_id', urlEncodedParser, function (req, res) {
		shop.getById(req.body.id, req.models.shop, res, function (rows) {
			res.send(rows);
		})
	});
	
	app.post('/shop_name', urlEncodedParser, function (req, res) {
		shop.getByName(req.body.name, req.models.shop, res, function (rows) {
			res.send(rows);
		})
	});
	
	app.get('/', urlEncodedParser, function (req, res) {
		res.render('index_test');
	})
};