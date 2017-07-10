/**
 * Created by sun on 16/5/24.
 */
var config = require('../common/config');
var http_request = require('../common/http_request');
var qs = require('querystring');

var weibo = config.oauth.weibo;
/**
 *
 * @param callback
 */
exports.authorize = function (callback) {
    var url = weibo.api + "/authorize?";
    var data = {
        client_id: weibo.appKey,
        redirect_uri: weibo.redirectUri
        ,forcelogin: true   //强制重新登录
    };
    url += qs.stringify(data);
    callback(url);
}
/**
 * 通过code获取访问token获取
 * @param code
 * @param callback
 */
exports.accessToken = function (code, callback) {
    var url = weibo.api + "/access_token?"
    var data = {
        client_id: weibo.appKey,
        client_secret: weibo.appSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: weibo.redirectUri
    };
    http_request.post(url, data, function (d) {
        var dd = JSON.parse(d);
        if (dd.error_code) {
            callback("认证失败! error:" + d, dd);
        } else {
            callback(null, dd);
        }
    });
}
/**
 * 获取用户
 * @param accessToken
 * @param uid
 * @param callback
 */
exports.userShow = function (accessToken, uid, callback) {
    var url = weibo.api2 + "/users/show.json";
    var data = {
        access_token: accessToken,
        uid: uid
    };

    http_request.httpsGet(url, data, function (json) {
        console.log(json);
        var data = JSON.parse(json);
        if (data.error_code) {
            callback("认证失败! error:" + json, data);
        } else {
            callback(null, data);
        }
    });
}