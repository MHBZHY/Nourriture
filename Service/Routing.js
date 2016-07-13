/**
 * Created by zhy on 16/7/2.
 */
function Routing() {
    var bodyParser = require('body-parser');
    var path = require('path');
    var express = require('express');
    
    var urlEncodedParser = bodyParser.urlencoded({extended: false});
	
	var service = require('./Service');
	var file = require('./File');
	
    
    this.parse = function (app) {
        //post请求
        //登陆
        //phone: string
        //password: string(md5 or sha1)
        app.post('/login', urlEncodedParser, function (req, res) {
	        //app
	        if (req.body.device_id) {
		        //用户登录
		        service.userLogin(req, res);
	        }
		    //web
	        else {
		        if (req.body.isadmin) {
		            service.admin_login(req, res);
		        }
		        else {
			        //餐厅登陆
			        service.restaurantLogin(req, res);
		        }
	        }
        });

        //注册
        app.post('/register', urlEncodedParser, function (req, res) {
            if (req.headers['content-type'].split(';')[0] == 'multipart/form-data') {
	            file.parse(req, res, function (fields) {
		            if (fields.device_id[0]) {
			            //用户注册
			            service.userRegister(req, res);
		            }
		            else {
			            //餐厅注册
			            service.restaurantRegister(req, res);
		            }
	            })
            }
	        else {
	            if (req.body.device_id) {
		            //用户注册
		            service.userRegister(req, res);
	            }
	            else {
		            //餐厅注册
		            service.restaurantRegister(req, res);
	            }
            }
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
		    if (req.body.id) {
			    service.restaurantById(req, res);
		    }
			else if (req.body.name) {
			    service.restaurantByName(req, res);
		    }
		    else {
			    service.restaurantInfo(req, res);
		    }
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
        app.post('/user_in_bound', urlEncodedParser, function (req, res) {
            service.userInBound(req, res);
        });

        //创建订单


	    //封禁
	    app.post('/admin_del', urlEncodedParser, function (req, res) {
			service.adminForbid(req, res);
	    });
	    
	    //激活
	    app.post('/admin_act', urlEncodedParser, function (req, res) {
		    service.adminActivate(req, res);
	    });
        
        
        //访问web主页
        app.get('/', urlEncodedParser, function (req, res) {
            res.render('index', {
	            
            });
        });

        app.get('/test', urlEncodedParser, function (req, res) {
            res.render('test', {
                //ejs
            })
        })
    };
}

module.exports = new Routing();