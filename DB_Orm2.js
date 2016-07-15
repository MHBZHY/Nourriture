/**
 * Created by zhy on 16/7/13.
 */
module.exports.createOrmConnection = function (app) {
	var orm = require('orm');
	
	app.use(orm.express("mysql://root:1234root5678@localhost:3306/Nourriture", {
		define: function (db, models) {
			// models.Order = db.define('order', {
			// 	id: Number,
			// 	user_id: Number,
			// 	shop_id: Number,
			// 	create_date: Date,
			// 	price: Number,
			// 	finish_date: Date,
			// 	menus: String
			// });
			models.menu = db.define('menu-shop', {
				id: Number,
				name: String,
				img: String,
				price: Number,
				description: String,
				type: String,
				del: Number
			});
			models.material = db.define('material_shop', {
				id: Number,
				name: String,
				img: String,
				nutrition_value: String
			});
			models.user = db.define('user', {
				id: Number,
				name: String,
				password: String,
				sex: String,
				birthday: String,
				phone: String,
				longitude: Number,
				latitude: Number,
				reg_date: String,
				del: Number
			});
			models.shop = db.define('shop', {
				id: Number,
				name: String,
				password: String,
				phone: String,
				address: String,
				certificate: String,
				img: String,
				longitude: Number,
				latitude: Number,
				description: String,
				ads: String,
				reg_date: String,
				del: Number
			});
			models.admin = db.define('admin', {
				id: Number,
				password: String
			})
		}
	}))
};
