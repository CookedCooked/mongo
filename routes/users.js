var express = require('express');
//得到连接数据库对象
var db = require("../mongo/db");
//得到util对象
var util = require("util");
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get("/add", function (req, res) {
    db.open(function (err, db) {
        if(err){
            console.log("Error:"+err);
            return;
        }
        db.createCollection("blog", {safe: true}, function (err, collection) {
            if (err) {
                console.log("MongoDB connect err")
                console.log("Err" + err);
                return;
            }
            //得到查询数据
            collection.find().toArray(function (err, result) {
                console.log("请求成功!");
                res.send("返回结果为:" + util.inspect(result));
				db.close();
            });
        });
    });
});

module.exports = router;
