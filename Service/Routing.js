/**
 * Created by zhy on 16/7/2.
 */
module.exports.parse = function (app) {
	//引入
	var bodyParser = require('body-parser');
	var path = require('path');
	var service = require('./Service');
	
	var urlEncodedParser = bodyParser.urlencoded({extended: false});
	
	
	//以下为post请求
	//登陆
	//phone: string
	//password: string(md5 or sha1)
	app.post('/login', urlEncodedParser, function (req, res) {
		service.login(req, res);
	});
	
	//注册
	app.post('/register', urlEncodedParser, function (req, res) {
		service.register(req, res);
	});
	
	//注销
	app.post('/logout', urlEncodedParser, function (req, res) {
		service.logout(req, res);
	});
	
	//获取用户信息
	app.post('/user', urlEncodedParser, function (req, res) {
		service.userInfo(req, res);
	});
	
	//更新用户信息
	app.post('/user_update', urlEncodedParser, function (req, res) {
		service.userUpdate(req, res);
	});
	
	//获取菜单(附编号范围, ex: 1, 10, 表示1到10编号的菜单)
	//menu_range: [start: string, end: string]
	app.post('/menu', urlEncodedParser, function (req, res) {
		service.menus(req, res);
	});
	
	//获取个人菜单
	app.post('/menu_self', urlEncodedParser, function (req, res) {
		service.userMenus(req, res);
	});
	
	//获取菜单详细信息(按照菜单编号)
	//menu_id: string
	app.post('/menu_specific', urlEncodedParser, function (req, res) {
		service.menuInfo(req, res);
	});
	
	//上传菜单
	app.post('/menu_add', urlEncodedParser, function (req, res) {
		service.menuUpload(req, res);
	});
	
	//修改菜单
	app.post('/menu_update', urlEncodedParser, function (req, res) {
		service.menuUpdate(req, res);
	});
	
	//点评菜单
	//menu_id: string
	//content: string
	//score: int
	//images: [multipart-form data]
	app.post('/menu_evaluate', urlEncodedParser, function (req, res) {
		service.menuEvaluate(req, res);
	});
	
	//获取商户信息
	app.post('/restaurant', urlEncodedParser, function (req, res) {
		service.restaurantInfo(req, res);
	});
	
	//获取餐厅搜索建议
	//name: string
	app.post('/restaurant_search', urlEncodedParser, function (req, res) {
		service.restaurantSearchSuggest(req, res);
	});
	
	
	//获取一定范围内的餐厅信息
	//bound: meters
	//pointer: [longitude: double, latitude: double]
	app.post('/restaurant_in_bound', urlEncodedParser, function (req, res) {
		service.restaurantInBound(req, res);
	});
	
	//获取一定范围内好友位置
	//bound: meters
	//pointer: [longitude: double, latitude: double]
	app.post('/friend_in_bound', urlEncodedParser, function (req, res) {
		service.friendInBound(req, res);
	});
	
	//获取一定范围内用户(所有用户)位置
	//废弃
	// app.post('/user_in_bound', urlEncodedParser, function (req, res) {
	//    service.userInBound(req, res);
	// });
	
	//创建订单
	
	
	//封禁
	app.post('/admin_del', urlEncodedParser, function (req, res) {
		service.adminForbid(req, res);
	});
	
	//激活
	app.post('/admin_act', urlEncodedParser, function (req, res) {
		service.adminActivate(req, res);
	});
	
	//获得原料
	app.post('/material', urlEncodedParser, function (req, res) {
		service.material(req, res);
	});
	
	
	//以下为get请求
	//访问web主页
	app.get('/', urlEncodedParser, function (req, res) {
		res.render('index');
	});
	
	//主页
	app.get('/index.html', urlEncodedParser, function (req, res) {
		res.render('index');
	});
	
	app.get('/show.html', urlEncodedParser, function (req, res) {
		res.render('show');
	})
};