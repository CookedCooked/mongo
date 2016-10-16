/**
 * Created by LFAN on 2016/4/29.
 * 用于测试各种不会的语句
 */

//var objectId = require("mongodb").ObjectID;
//var querystring  = require("querystring");
//var dbInstance = require("../mongo/db");
//dbInstance.open(function(err,db){
//    db.createCollection("blog",{safe:true},function(err,collection){
//        console.log(collection.collectionName);
//        collection.removeOne({"_id":new objectId(querystring.stringify("57238b3f90c45d207f59c7b"))});
//
//    });
//});
//TODO  暂略
//var objectId = require("mongodb").ObjectID;
//var str = new objectId("123");
//console.log(str);
//var user = require("./user");
//var users = new user({
//    username:"Zhan",
//    password:"123",
//    email:"12"
//});
//var db = require("../mongo/db");
//db.open(function(err,db){
//    db.createCollection("user",{safe:true},function(err,collection){
//        //collection.insertOne(users,function(err,result){
//        //    console.log(result);
//        //});
//        var where = {"username": "LFAN"};
//        collection.find(where).toArray(function(err,result){
//          console.log(result[0].username);
//        });
//    });
//});

var uuid = require('node-uuid');
console.log(uuid.v1());

