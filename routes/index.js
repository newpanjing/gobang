var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express', user: req.session.user});
});

var oauth = require('../core/controllers/oauth');

router.get('/oauth/weibo', oauth.weiboAuth);
router.get('/oauth/weibo/callback', oauth.weiboCallback);

router.get('/oauth/qq', oauth.qqAuth);
router.get('/auth/qq/callback', oauth.qqCallback);


var websocket = require('../core/controllers/websocket');
websocket.start();

router.get('/test',function (req,res,next) {
   res.render("test");
});

module.exports = router;
