var config = require("../common/config");
var qq = config.oauth.qq;
var http_request = require("../common/http_request");
var qs = require("querystring");
/**
 * 认证地址
 * @param callback
 */
exports.authorize = function (callback) {
    var url = qq.api + "/authorize?";
    var param = {
        response_type: 'code',
        client_id: qq.appId,
        redirect_uri: qq.redirect_uri,
        state: new Date().getTime()
    };

    url += qs.stringify(param);

    callback(url);
}

/**
 * 获取token
 * @param code
 * @param callback
 */
exports.accessToken = function (code, callback) {
    var url = qq.api + "/token";
    var param = {
        grant_type: 'authorization_code',
        client_id: qq.appId,
        client_secret: qq.appKey,
        code: code,
        redirect_uri: qq.redirect_uri
    };

    http_request.httpsGet(url, param, function (json) {
        var data = getAccessToken(json);
        callback(data);
    })
};
/**
 * url参 转为json
 * @param str
 * @returns {{}}
 */
function getAccessToken(str) {
    var data = {};
    var array = str.split("&");
    for (var i in array) {
        var items = array[i].split("=");
        data[items[0]] = items[1];
    }

    return data;
}

/**
 * 获取用户
 * @param accessToken
 * @param callback
 */
exports.getUserInfo = function (accessToken, cb) {

    //处理jsonp
    function callback(data) {
        console.log(data)
        //获取用户信息
        var url = qq.api2 + "/user/get_user_info";
        var param = {
            access_token: accessToken,
            oauth_consumer_key: qq.appId,
            openid: data.openid
        };
        http_request.httpsGet(url, param, function (json) {
            var userInfo = JSON.parse(json);
            userInfo.openId = data.openid;
            cb(userInfo);
        })

    }

    var url = qq.api + "/me";
    var param = {
        access_token: accessToken
    };

    http_request.httpsGet(url, param, function (str) {
        eval(str);
    })
}

/*var dd = getAccessToken("access_token=9CBBF1A737CE0713D47B476B62DB4734&expires_in=7776000&refresh_token=1C8C556AA8A928A8D560BBE972B7035E");
 console.log(dd)*/
/*

 this.authorize(function (url) {
 console.log(url);
 });

 this.accessToken('4B0B31BD633DC586FF19CDD6AA220115',function (json) {
 console.log(json)
 })
 */

/*this.getUserInfo('9CBBF1A737CE0713D47B476B62DB4734', function (data) {
 console.log(data)
 });*/
