/**
 * Created by sun on 16/5/23.
 */
var config = {
    mongodb: {
        host: "mongodb://127.0.0.1/gobang"
    },
    redis: {
        host: '127.0.0.1',
        port: 6379
    },
    oauth: {
        //微博
        weibo: {
            appKey: '1905667217',
            appSecret: '929e32353398953d0105acfb22971b06',
            api: 'https://api.weibo.com/oauth2',//接口地址
            api2: "https://api.weibo.com/2",//接口地址2
            redirectUri: 'http://gobang.88cto.com/oauth/weibo/callback'  //授权成功回调地址
        }
    },
    redis: {
        host: "127.0.0.1",
        port: 6379
    },
    websocket: {
        port: 8000,
        host: 'http://gobang.88cto.com:8000'
    }
};
//导出配置
module.exports = config;