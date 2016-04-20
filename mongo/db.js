/**
 * Created by FAN on 2016/4/20.
 * 提供数据库连接
 */
var setting = require("../setting");
//得到mongodb连接对象
var mongodb = require("mongodb");
//得到服务
var server = new mongodb.Server(setting.master.host, setting.master.port, {auto_reconnect: true});
//得到连接对象
var db = new mongodb.Db(setting.master.database, server, {safe: true});
//抛出对象
module.exports = db;
