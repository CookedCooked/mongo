var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//添加会话支持(session)
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
//引入 flash 模块来实现页面通知 TODO 有待查询
var flash = require('connect-flash');//req.flash()使用
//得到自己写的路由
var routes = require('./routes/index');
var users = require('./routes/users');
var setting = require("./setting");

//测试路由
var test = require("./routes/test");
//得到express
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//设置后缀为html
app.engine(".html", require("ejs").renderFile);
app.set("view engine", "html");
//app.set('view engine', 'ejs');

//TODO 有待研究
app.use(flash());//定义使用 flash 功能
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//-------------------------------

//store: new MongoStore({
//    url: 'mongodb://localhost/test-app',
//    autoRemove: 'interval',
//    autoRemoveInterval: 10 // In minutes. Default
//})
//TODO session设置
// @see https://github.com/expressjs/session
// @see http://www.cnblogs.com/alvin_xp/p/4751784.html
app.use(session({
    secret: setting.master.cookieSecret,
    cookie: {maxAge: 1000 * 60 * 30},//30 minute
    store: new MongoStore({
        host: setting.master.host, port: setting.master.port, db: "blog"
    }),
    resave: false,//不要保存session在没有操作的时候
    saveUninitialized: true,
}));

// 相当于往session中存数据。每一个请求都会经过这个中间件
app.use(function (req, res, next) {
    console.log("session中间件");
    //res.locals.xxx实现xxx变量全局化，在其他页面直接访问变量名即可
    //访问session数据：用户信息
    res.locals.user = req.session.user;
    //显示错误信息  TODO 这个有待研究
    var error = req.flash('error');//获取flash中存储的error信息
    res.locals.error = error.length ? error : null;
    //显示成功信息
    var success = req.flash('success');
    res.locals.success = success.length ? success : null;
    next();
});
//------------------------------


//使用路由
app.use('/', routes);
app.use('/users', users);
app.use("/test", test);

//测试Router.get()方法和app.get()方法谁先输出。注意:router中先输出
//app.get("/test/testUrl", function (req, res,next) {
//    console.log("----app");
//    //res.send("输出");
//    next();
//});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
