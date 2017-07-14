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
        },
        qq:{
            appId:'101409125',
            appKey:'3ac4c01094df2fd58fecf3c972578f6b',
            redirect_uri: 'http://gobang.88cto.com/auth/qq/callback',
            api: 'https://graph.qq.com/oauth2.0',
            api2: 'https://graph.qq.com'
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