var config = require("../common/config");

var rooms = require("../rooms");

var models = require("../models");
var User = models.User;
var EventProxy = require("eventproxy");
var sockets = {};


/**
 * 发送消息
 * @param event
 * @param uid
 * @param data
 */
function sendMessage(event, uid, data) {
    var socket = sockets[uid];
    if (socket) {
        socket.emit(event, data);
    }
}

/**
 * 查找用户
 * @param uid
 * @param cb
 */
function findOne(uid, cb) {
    User.findOne({uid: uid}, function (err, data) {
        cb(err, data);
    });
}

/**
 * 房间匹配
 * @param user
 * @param socket
 */
function onMatch(user, socket) {
    //如果之前socket存在，关闭socket
    sockets[user.uid] = socket;

    var room = rooms.match(user.uid, socket);
    console.log("房间id：" + room.id);

    if (!room) {
        //寻找房间，
        socket.emit("match", {
            status: false
        });
        return;
    }


    room.status = true;


    //查询2个玩家的资料
    var porxy = new EventProxy();
    porxy.all("data1", "data2", function (data1, data2) {

        room.user1.data = data1;
        room.user2.data = data2;

        socket.emit("match", room);

        //查询u1和u2的资料，下发给2个用户
        var u1 = room.user1.uid;
        var u2 = room.user2.uid;

        //查询资料
        var self = user.uid;

        var type = "";
        var to = null;
        if (self == u1) {
            to = u2;
            type = "user1";
        } else {
            to = u1;
            type = "user2";
        }


        function send(user) {
            sendMessage("join", to, user)
        }

        send(room[type].data);
    });


    //查询2个玩家的资料
    if (!room.user1.data && room.user1.uid != "") {
        User.findOne({uid: room.user1.uid}).then(function (data) {
            porxy.emit("data1", data);
        });
    } else {
        porxy.emit("data1", room.user1.data);
    }

    if (!room.user2.data && room.user2.uid != "") {
        User.findOne({uid: room.user2.uid}).then(function (data) {
            porxy.emit("data2", data);
        });
    } else {
        porxy.emit("data2", room.user2.data);
    }


}

/**
 * 客户端断开
 * @param socket
 */
function onDisconnect(socket) {
    for (var i in sockets) {
        if (sockets[i].id == socket.id) {
            console.log("移除socket");
            return;
        }
    }
    console.log('客户端断开')
}

/**
 * 聊天
 * @param data
 */
function onMessage(data) {

    sendMessage("message", data.target, data);

}

/**
 * 下棋
 * @param data
 */
function onPices(data) {
    //将位置发给对家
    sendMessage("pices", data.enemyUid, data);
    //记录

    rooms.get(data.roomId).board[data.y][data.x] = data.type;
    rooms.get(data.roomId).lastType = data.type;
    rooms.get(data.roomId).lastTime = new Date().getTime();
}

/**
 * 重新开始
 * @param data
 */
function onRestart(data) {
    sendMessage("restart", data.enemyUid, data);
    //房间棋盘清空
    rooms.clearBorad(data.roomId);
}

/**
 * 求和
 * @param data
 */
function onDraw(data) {
    sendMessage("draw", data.enemyUid, data);
}

/**
 * 投降、求和 事件
 * @param data
 */
function onAction(data) {
    console.log("data:");
    console.log(data);

    sendMessage("action", data.enemyUid, data);
    if (data.type == 0) {

        //数据库记录更新
        //更新数据库记录

        //更新双方平局+1
        var room=rooms.get(data.roomId);
        room.user1.data.draw+=1;
        room.user2.data.draw+=1;

        User.update({uid: data.uid}, {$inc: {draw: 1}}).then(function (err,rs) {
            // console.log(err)
            // console.log(rs)
        });
        User.update({uid: data.enemyUid}, {$inc: {draw: 1}}).then(function (err,rs) {
            // console.log(err)
            // console.log(rs)
        });

        rooms.clearBorad(data.roomId);
    } else if (data.type == 2) {
        console.log(data)
        //投降
        var uid= data.uid;
        var enemyUid=data.enemyUid;

        //内存更新
        var room=rooms.get(data.roomId);
        if(room.user1.uid==uid){
            room.user1.data.failure+=1;
            room.user2.data.victory+=1;
        }else{
            room.user2.data.failure+=1;
            room.user1.data.victory+=1;
        }

        User.update({uid: uid}, {$inc: {failure: 1}}).then(function (err,rs) {
            // console.log(err)
            // console.log(rs)
        });
        User.update({uid: enemyUid}, {$inc: {victory: 1}}).then(function (err,rs) {
            // console.log(err)
            // console.log(rs)
        });
        rooms.clearBorad(data.roomId);
    } else if (data.type == 3) {
        //胜利
        var room = rooms.get(data.roomId);
        var victoryUid = "";
        var failureUid = "";

        if (room.user1.type == data.victoryType) {
            victoryUid = room.user1.uid;
            failureUid = room.user2.uid;

            room.user1.data.victory += 1;
            room.user2.data.failure += 1;

        } else {
            victoryUid = room.user2.uid;
            failureUid = room.user1.uid;

            room.user2.data.victory += 1;
            room.user1.data.failure += 1;
        }

        //更新数据库记录
        User.update({uid: victoryUid}, {$inc: {victory: 1}}).then(function (err,rs) {
            // console.log(err)
            // console.log(rs)
        });
        User.update({uid: failureUid}, {$inc: {failure: 1}}).then(function (err,rs) {
            // console.log(err)
            // console.log(rs)
        });
    }
}

/**
 * 心跳
 * @param data
 * @constructor
 */
function onHeartbeat(data) {
// console.log("收到心跳"+JSON.stringify(data))
    var room = rooms.get(data.roomId);
    if (room.user1.uid == data.uid) {
        room.user1.lastTime = new Date();
    } else {
        room.user2.lastTime = new Date();
    }
    // console.log(room)
}

exports.start = function () {


    var options = {
        transports: ['websocket', 'polling']
    };

    var io = require('socket.io').listen(config.websocket.port, options);
    io.sockets.on('connection', function (socket) {

        //超时设置
        // socket.manager.transports[socket.id].socket.setTimeout(15000);

        console.log("客户端连接：" + socket)

        socket.on("match", function (user) {
            onMatch(user, socket);
        });
        socket.on("disconnect", function () {
            onDisconnect(socket);
        });

        socket.on("message", onMessage);
        socket.on("pices", onPices);
        socket.on("restart", onRestart);
        socket.on("draw", onDraw);

        //和棋、认输、胜利
        socket.on("action", onAction);

        //心跳
        socket.on("heartbeat", onHeartbeat);


    });

    console.log("启动ok")

    // //定时踢人
    setInterval(function () {
        rooms.checkTimeout(function (array) {
            for (var i in array) {
                var item = array[i];
                /*
                 roomId: item.id,
                 nickName: item.user1.data.nickName,
                 to: item.user1.uid,
                 from: item.user2.uid
                 */
                console.log(item)
                sendMessage("offline", item.to, item);
            }
        });
    }, 1000);

}