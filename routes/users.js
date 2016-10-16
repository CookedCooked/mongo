var express = require('express');
//得到连接数据库对象
var db = require("../mongo/db");
//得到加密对象
var crypto = require("crypto");
//得到util对象
var util = require("util");
//用户对象
var user = require("./user");
//主键uuid.v1()
var uuid = require('node-uuid');
//得到blog
var Blog = require("./Blog");

var router = express.Router();

/** 退出登录 */
router.get("/logout", function (req, res) {
    req.session.user = null;
    res.redirect("/");
});

/*删除一条微博*/
router.get("/del", function (req, res) {
    var id = req.param("id");
    //打开数据连接
    db.open(function (err, db) {
        if (err) {
            console.log("打开数据错误!Error :" + err);
            return;
        }
        //创建连接
        db.createCollection("blog", {safe: true}, function (err, collection) {
            if (err) {
                console.log("连接数据库错误!Error :" + err);
                return;
            }

            var where = {"_id": id};
            collection.remove(where, {safe: true}, function (err, result) {
                if (err) {
                    console.log("删除错误！Error :" + err);
                    return;
                }
                res.redirect("/");
            });
        });
    });

});
/**
 * 去登陆页面
 */
router.get("/loginUI", function (req, res) {
    res.render("page_signin", {"title": "登录", "pageName": "登录"});
});
/**
 * 登陆操作
 */
router.post("/login", function (req, res) {
    var username = req.param("username");
    db.open(function (err, db) {
        if (err) {
            console.log("打开库错误.Err " + err);
            return;
        }
        db.createCollection("user", {safe: true}, function (err, collection) {
            if (err) {
                console.log("数据库连接错误.Err " + err);
                return;
            }
            var where = {username: username};
            collection.find(where).toArray(function (err, result) {
                if (err) {
                    console.log("Err :" + err);
                    return;
                }
                if (!result.length) {
                    req.flash("error", "用户不存在");
                    res.redirect("/users/loginUI");
                    return;
                }
                var md5 = crypto.createHash("md5");
                var pwd = md5.update(req.param("password")).digest("base64");
                if (result[0].password != pwd) {
                    req.flash("error", "用户密码错误");
                    res.redirect("/users/loginUI");
                    return;
                }
                req.session.user = new user({
                    _id: result[0]._id,
                    username: result[0].username,
                    password: result[0].password,
                    email: result[0].email
                });
                res.redirect("/");
            });
        });
    });

});

/**
 * 注册页面
 */
router.get("/signupUI", function (req, res) {
    res.render("page_signup", {"title": "注册", "signup": "注册"});
});
/**注册逻辑实现*/
router.post("/signup", function (req, res) {
    //得到注册数据
    var passwd = req.param("password");
    var againPwd = req.param("againpwd");
    if (passwd != againPwd) {
        req.flash("error", "两次输入密码不一致,请重新输入。");
        res.redirect("/users/signupUI");
        return;
    }
    var username = req.param("username");
    //连接数据查询此用户是否存在
    db.open(function (err, db) {
        if (err) {
            console.log("打开数据库错误");
            return;
        }
        db.createCollection("user", {safe: true}, function (err, collection) {
            if (err) {
                console.log("连接数据库错误");
                return;
            }
            var where = {"username": username};
            collection.find(where).toArray(function (err, result) {
                if (err) {
                    console.log("查询错误");
                    return;
                }
                if (result.length) {
                    req.flash("error", "用户已经存在");
                    res.redirect("/users/signupUI");
                    return;
                }
                //对密码进行md5加密
                var md5 = crypto.createHash("md5");
                var password = md5.update(passwd).digest("base64");
                var newUser = new user({
                    _id: uuid.v1(),
                    username: username,
                    password: password,
                    email: req.param("email")
                });
                collection.insertOne(newUser, function (err, result) {
                    if (err) {
                        console.log("插入数据错误");
                        return;
                    }
                    console.log("加入新用户成功");
                    req.session.user = newUser;
                    res.redirect("/");
                });
            });
        });
    });
});

/**
 * 添加微博主页
 */
router.get("/addUI", function (req, res) {
    res.render("add", {"title": "发布微博"});
});

/**添加微博*/
router.post("/add", function (req, res) {
    //添加微博
    db.open(function (err, db) {
        if (err) {
            console.log("数据库打开错误 Err" + err);
            return;
        }
        db.createCollection("blog", {safe: true}, function (err, collection) {
            if (err) {
                console.log("连接错误 Err" + err);
                return;
            }
            var blog = {
                _id: uuid.v1(),
                title: req.param("title"),
                content: req.param("contents"),
                time: new Date(),
                auther: req.session.user.username
            };
            collection.insertOne(blog);
            res.redirect("/");
        });
    });
});

router.get("/forgetPwd", function (req, res) {
    res.render("page_forgotpwd", {"title": "找回密码", "pageName": "找回密码"});
});


module.exports = router;
