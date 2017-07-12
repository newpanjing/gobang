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
    sendMessage("action", data.enemyUid, data);
    if (data.type == 0) {

        //数据库记录更新

        rooms.clearBorad(data.roomId);
    } else if (data.type == 2) {
        //投降
        rooms.clearBorad(data.roomId);
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

        //和棋、认输
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