/**
 * Created by zhy on 16/6/8.
 */
var express = require('express');
var app = express();

//session
var session = require('express-session');
var cookie = require('cookie-parser');

//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    // res.header("X-Powered-By",' 3.2.1');
    // res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

//设置cookie
app.use(cookie());

//设置session
app.use(session({
    secret: 'Nourriture',
    cookie: {maxAge: 15 * 60 * 1000},   //session timeout: 15 min
    resave: false,
    saveUninitialized: true
}));

//设置刷新session
app.use(function (req, res, next) {
    req.session._garbage = new Date();
    req.session.touch();
    next();
});

//orm操作数据库(实验中)
require('./DB_ORM2').createOrmConnection(app);

//静态页面
app.use(express.static(__dirname + '/Public'));

//模版引擎
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.set('views', __dirname + '/Public/view');

//设置一些扩展函数
require('./Service/Tools').stringFormat();

//注册post处理
// require('./Service/Routing').parse(app);
require('./Service/RoutingTest').router(app);

//启动服务器
app.listen(8088, function () {
    console.log('Server started at 8088');
});