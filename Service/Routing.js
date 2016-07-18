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
	app.post('/user_register', urlEncodedParser, function (req, res) {
		service.userRegister(req, res)
	});
	
	//更新用户信息
	app.post('/user_update', urlEncodedParser, function (req, res) {
		service.userUpdate(req, res)
	});
	
	//用户名是否存在
	app.post('/register_exist', urlEncodedParser, function (req, res) {
		service.regNameExist(req, res)
	});
	
	//获取用户信息
	app.post('/user', urlEncodedParser, function (req, res) {
		service.userInfo(req, res);
	});
	
	//获取一定范围内好友位置
	//bound: meters
	//pointer: [longitude: double, latitude: double]
	app.post('/friend_in_bound', urlEncodedParser, function (req, res) {
		service.friendInBound(req, res);
	});
	
	//获取好友
	app.post('/friend', urlEncodedParser, function (req, res) {
		//todo: 获取好友
	});
	
	//注销
	app.post('/logout', urlEncodedParser, function (req, res) {
		service.logout(req, res)
	});
	
	//餐厅注册
	app.post('/shop_register', urlEncodedParser, function (req, res) {
		service.shopRegister(req, res)
	});
	
	//获取餐厅信息
	app.post('/shop', urlEncodedParser, function (req, res) {
		service.shopInfo(req, res)
	});
	
	//获取餐厅搜索建议
	//name: string
	app.post('/shop_search', urlEncodedParser, function (req, res) {
		service.shopSearchSuggest(req, res);
	});
	
	//更新餐厅信息
	app.post('/shop_update', urlEncodedParser, function (req, res) {
		//todo: 更新shop信息
	});
	
	//获取一定范围内的餐厅信息
	//bound: meters
	//pointer: [longitude: double, latitude: double]
	app.post('/shop_in_bound', urlEncodedParser, function (req, res) {
		service.shopInBound(req, res);
	});
	
	//获取菜单(附编号范围, ex: 1, 10, 表示1到10编号的菜单)
	app.post('/menu', urlEncodedParser, function (req, res) {
		service.menuInfo(req, res);
	});
	
	//菜单分类
	app.post('/menu_type', urlEncodedParser, function (req, res) {
		service.menuType(req, res)
	});
	
	//搜索建议
	app.post('/menu_search', urlEncodedParser, function (req, res) {
		
	});
	
	//上传菜单
	app.post('/menu_upload', urlEncodedParser, function (req, res) {
		service.menuAdd(req, res);
	});
	
	//修改菜单
	app.post('/menu_update', urlEncodedParser, function (req, res) {
		service.menuUpdate(req, res);
	});
	
	//删除菜单
	app.post('/menu_delete', urlEncodedParser, function (req, res) {
		service.menuDel(req, res)
	});
	
	//删除菜单中某一原料
	app.post('/menu_delete_material', urlEncodedParser, function (req, res) {
		//todo: 删除菜单中某一原料
	});
	
	//向菜单中添加现成的原料
	app.post('/menu_add_material', urlEncodedParser, function (req, res) {
		//todo: 向菜单中添加现成原料
	});
	
	//点评菜单
	//menu_id: string
	//content: string
	//score: int
	//images: [multipart-form data]
	app.post('/menu_evaluate', urlEncodedParser, function (req, res) {
		service.menuEvaluate(req, res);
	});
	
	//获得菜单评价
	app.post('/menu_get_evaluate', urlEncodedParser, function (req, res) {
		//todo: 获得菜单评价
	});
	
	//获得原料
	app.post('/material', urlEncodedParser, function (req, res) {
		service.material(req, res)
	});
	
	//添加原料
	app.post('/material_add', urlEncodedParser, function (req, res) {
		//todo: 添加原料
	});
	
	//修改原料
	app.post('/material_update', urlEncodedParser, function (req, res) {
		//todo: 修改原料
	});
	
	//创建订单
	
	
	//封禁
	app.post('/admin_del', urlEncodedParser, function (req, res) {
		service.adminForbid(req, res)
	});
	
	//激活
	app.post('/admin_act', urlEncodedParser, function (req, res) {
		service.adminActivate(req, res)
	});
	
	
	//以下为get请求
	//访问web主页
	app.get('/', urlEncodedParser, function (req, res) {
		res.render('index')
	});
	
	//主页
	app.get('/index.html', urlEncodedParser, function (req, res) {
		res.render('index')
	});
	
	//admin
	app.get('/admin', urlEncodedParser, function (req, res) {
		res.redirect('/admin/login.html')
	})
};