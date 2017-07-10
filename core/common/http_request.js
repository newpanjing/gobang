/**
 * Created by sun on 16/5/24.
 */
//http请求封装
var URL = require('url');

var http = require('http'),
    https = require('https'),
    querystring = require('querystring'),
    zlib = require('zlib'),
    qs = require("querystring");

function handlerUrl(str) {
    var rs = URL.parse(str);
    return {
        protocol: rs.protocol,
        hostname: rs.hostname,
        port: rs.port,
        path: rs.path,
        queryString: rs.queryString

    };
}

/**
 * 发送get请求
 * @param str
 * @param callback
 */
var httpPost = function (str, data, callback, headers) {

    var rs = handlerUrl(str);
    var queryString = rs.path;

    data = qs.stringify(data);
    var options = {
        hostname: rs.hostname,
        port: 80,
        path: queryString,
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.11 Safari/537.36',
            'Accept-Encoding': 'gzip, deflate',
        },
        method: 'POST'
    };

    //合并headers
    if (headers) {
        if (!options.headers) {
            options.headers = {};
        }
        for (var item in headers) {
            options.headers[item] = headers[item];
        }
    }

    var req = http.request(options, function (res) {
        var encoding = res.headers["content-encoding"];
        var chunks = [];
        var buffer = [];


        if (encoding == "gzip") {
            var gunzip = zlib.createGunzip();
            res.pipe(gunzip);
            gunzip.on('data', function (data) {
                // decompression chunk ready, add it to the buffer
                buffer.push(data.toString())

            }).on("end", function () {
                // response and decompression complete, join the buffer and return
                callback(null, buffer.join(""));

            })
        } else if (encoding == 'deflate') {
            zlib.inflate(buffer, function (err, decoded) {
                callback(err, decoded.toString());
            });
        } else {
            callback(null, res.data);
        }


    });
    req.write(data + "\n");
    req.end();

}
exports.httpPost = httpPost;
/**
 * 发送get请求
 * @param str
 * @param callback
 */
var get = function (str, data, callback, headers) {

    var rs = handlerUrl(str);
    var queryString = rs.path;
    if (queryString.indexOf("?") > -1) {
        queryString += "&" + qs.stringify(data);
    } else {
        queryString += "?" + qs.stringify(data);
    }


    var options = {
        hostname: rs.hostname,
        port: 80,
        path: queryString,
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Content-Length': queryString.length,
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.11 Safari/537.36',
            'Accept-Encoding': 'gzip, deflate',
        },
        method: 'GET'
    };

    //合并headers
    if (headers) {
        if (!options.headers) {
            options.headers = {};
        }
        for (var item in headers) {
            options.headers[item] = headers[item];
        }
    }

    var req = http.request(options, function (res) {
        var encoding = res.headers["content-encoding"];
        var chunks = [];
        var buffer = [];


        if (encoding == "gzip") {
            var gunzip = zlib.createGunzip();
            res.pipe(gunzip);
            gunzip.on('data', function (data) {
                // decompression chunk ready, add it to the buffer
                buffer.push(data.toString())

            }).on("end", function () {
                // response and decompression complete, join the buffer and return
                callback(null, buffer.join(""));

            })
        } else if (encoding == 'deflate') {
            zlib.inflate(buffer, function (err, decoded) {
                callback(err, decoded.toString());
            });
        } else {
            callback(null, res.data);
        }


    });
    req.end();

}
exports.get = get;
var sslGet = function (url, data, callback) {
    if (url.indexOf("?") > -1) {
        url += "&" + qs.stringify(data);
    } else {
        url += "?" + qs.stringify(data);
    }

    console.log(url);
    https.get(url, function (res) {
        res.on("data", function (buffer) {
            callback(buffer.toString());
        })

    });
}
exports.sslGet = sslGet;

/**
 * https get请求
 * @param str
 * @param data
 * @param callback
 * @param headers
 */
var httpsGet = function (str, data, callback, headers) {
    var queryString = qs.stringify(data);

    var port = 80;

    var urlParam = handlerUrl(str);
    if (urlParam.protocol == "https:") {
        port = 443;
    }

    var url = urlParam.path;
    if (queryString.length > 0) {
        if (url.indexOf("?") > -1) {
            url += "&" + queryString;
        } else {
            url += "?" + queryString;
        }
    }

    var options = {
        port: port,
        method: 'GET',
        hostname: urlParam.hostname,
        path: url,
        /* headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
         'Content-Length': url.length
         }*/
    };

    //合并headers
    if (headers) {
        if (!options.headers) {
            options.headers = {};
        }
        for (var item in headers) {
            options.headers[item] = headers[item];
        }
    }

    var req = https.request(options, function (res) {
        var encoding = res.headers["content-encoding"];
        if (encoding == "gzip") {
            var buffer = [];
            var gunzip = zlib.createGunzip();
            res.pipe(gunzip);
            gunzip.on('data', function (data) {
                // decompression chunk ready, add it to the buffer
                buffer.push(data.toString())

            }).on("end", function () {
                // response and decompression complete, join the buffer and return
                callback(buffer.join(""));

            })
        } else {
            res.on('data', function (buffer) {
                callback(buffer.toString());
            });
        }
    });
    //req.write(postData);
    req.end();

}

exports.httpsGet = httpsGet;

var post = function (str, data, callback, headers) {
    var postData = qs.stringify(data);

    var port = 80;

    var urlParam = handlerUrl(str);
    if (urlParam.protocol == "https:") {
        port = 443;
    }
    var options = {
        port: port,
        method: 'post',
        hostname: urlParam.hostname,
        path: urlParam.path,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    };

    //合并headers
    if (headers) {
        for (var item in headers) {
            options.headers[item] = headers[item];
        }
    }

    var req = https.request(options, function (res) {

        res.on('data', function (buffer) {
            callback(buffer.toString());
        });
    });
    req.write(postData);
    req.end();

}
exports.post = post;

/*get("http://www.jd.com/",{}, function (err, data) {
 console.info(data)
 });*/
/*
 this.post("https://api.weibo.com/oauth2/access_token", {
 client_id: '123',
 client_secret: '321',
 grant_type: 'authorization_code',
 code: '56bb721bc191827fe1f842be9b14b19f',
 redirect_uri: 'http://www.qikenet.com/oauth/callback/weibo'
 }, function (data) {
 console.log(data);
 });
 */
/*sslGet("https://api.weibo.com/2/users/show.json?access_token=2.00QP8ZpB3ml_FC52c8c98d25WrdQ9D&uid=1678172182",{
 age:123,
 sex:321
 },function (data) {
 console.log(JSON.parse(data));
 });*/

/*post("https://github.com/login/oauth/access_token", {
 access_token:'e72e16c7e42f292c6912e7710c838347ae178b4a',
 scope:'user%2Cgist',
 token_type:'bearer'
 }, function (data) {
 console.log(data);
 },{
 Accept:'application/json'
 })*/

/*
 this.httpsGet("https://segmentfault.com/search?q=java",{},function (str) {

 })*/
