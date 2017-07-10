/**
 * Created by sun on 16/5/23.
 */

var config = require("../common/config");

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(config.mongodb.host, function (err) {
    if (!err) {
        console.error(err)
    }
});//；连接数据库

//models
require("./user");
exports.User = mongoose.model('User');

