/**
 * Created by LFAN on 2016/4/25.
 */
var express = require("express");
var blog = require("./Blog");
var router = express.Router();
router.get("/", function (req, resp) {

    var blogs = [];

    var b1 = new blog("1", "2", "3", "4", "5");
    blogs.push(b1);
    var b2 = new blog("a", "b", "c", "d", "e");
    blogs.push(b2);

    console.log(blogs);

    resp.render("htest", {"title": "测试", blogs: blogs});
});


router.get("/testUrl", function (req, res, next) {
    console.log("-----Router");
    res.send("输出"+req.session.user);
});

router.get("/loginup", function (req, res) {
    res.render("page_signup", {"title": "测试"});
});

router.get("/loginin", function (req, res) {
    res.render("page_signin", {"title": "测试"});
});
module.exports = router;
