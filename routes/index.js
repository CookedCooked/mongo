var express = require('express');
//得到Post对象
var blog = require("./Blog");
var db = require("../mongo/db");
var router = express.Router();

/* 去主页 */
router.get('/', function (req, res, next) {
    db.open(function (err, db) {
        if (err) {
            console.log("数据库打开错误!");
            console.log(err);
            return;
        }
        //创建连接件
        db.createCollection("blog", {safe: true}, function (err, collection) {
            //连接错误
            if (err) {
                console.log("连接表blog错误!");
                console.log(err);
                return;
            }
            //连接操作
            collection.find().toArray(function (err, data) {
                if (err) {
                    console.log("查询数据错误!");
                    console.log(err);
                    return;
                }
                var blogs = [];
                //构造数据
                data.forEach(function (doc, index) {
                    var b = new blog(doc._id,doc.title, doc.content, doc.time, doc.auther);
                    blogs.push(b);
                });
                //查找所有信息
                res.render("index", {title: "首页", blogs: blogs});
            });

        });

    });
});

module.exports = router;
