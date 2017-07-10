/**
 * Created by sun on 16/5/24.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var User = new Schema({
    id: ObjectId,       //id
    nickName: String,   //昵称,
    description: String,//个人简介
    createTime: Date,    //创建时间
    updateTime: Date,    //更新时间
    lastLoginTime: Date, //最后登录时间
    location: String,//地区
    sex: {              //性别
        type: String,
        default: '男'
    },
    avatar: String,     //头像1,
    uid: String,//微博uid
    victory: {//胜利
        type: Number,
        default: 0
    },
    failure: {//失败
        type: Number,
        default: 0
    },
    draw: {//平局
        type: Number,
        default: 0
    }
});

mongoose.model('User', User, "user"); //  与users集合关联
