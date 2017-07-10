/**
 * Created by sun on 2017/7/5.
 */

var oauth_weibo = require('../auth/oauth_weibo');
var models = require('../models');
var User = models.User;

exports.weiboAuth = function (req, res, next) {

    oauth_weibo.authorize(function (url) {
        res.redirect(url);
    });
}

exports.weiboCallback = function (req, res, next) {

    var code = req.query.code;
    console.log(code)
    oauth_weibo.accessToken(code, function (err, data) {
        if (err) {
            console.log(err);
            return res.end("登录失败，请重试！");
        }
        oauth_weibo.userShow(data.access_token, data.uid, function (err, user) {
            if (err) {
                console.log(err);
                return res.end("登录失败，请重试！");
            }

            var uid = user.id;

            //查找数据
            User.findOne({
                uid: uid
            }, function (err, rs) {

                if (rs) {
                    //更新
                    User.update({uid: uid}, {
                        nickName: user.screen_name,   //昵称,
                        description: user.description,//个人简介
                        updateTime: new Date(),    //更新时间
                        lastLoginTime: new Date(), //最后登录时间
                        sex: user.gender,
                        avatar: user.avatar_hd,     //头像1,
                        location: user.location//地区
                    }, function (err, rs) {

                    });

                } else {
                    //不存在保存

                    var u = new User({
                        nickName: user.screen_name,   //昵称,
                        description: user.description,//个人简介
                        createTime: new Date(),    //创建时间
                        updateTime: new Date(),    //更新时间
                        lastLoginTime: new Date(), //最后登录时间
                        sex: user.gender,
                        avatar: user.avatar_hd,     //头像1,
                        uid: uid,//id
                        location: user.location//地区
                    });
                    u.save(function (err, doc) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            });

            console.log(req.session)
            req.session.user = user;
            res.redirect("/");
        });

    });

}