var config = require("../common/config");

var rooms = require("../rooms");

var models = require("../models");
var User = models.User;

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

    //将自己的资料发给对家
    if (!room.data) {

        findOne(self, function (err, data) {
            if (!err) {
                rooms.get(room.id)[type]["data"] = data;
                send(data);
            }
        });
    } else {
        send(room[type]);
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
    sendMessage("action", data);
    rooms.clearBorad(data.roomId);
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

    });

    console.log("启动ok")
}