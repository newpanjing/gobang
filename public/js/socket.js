//网络部分
var host = "http://gobang.88cto.com:8000";

var Socket = {
    connection: null,
    host: null,
    init: function (host) {
        this.host = host;

        this.connection = io(this.host, {
            'reconnect': true
        });

        this.connection.on('connect', function (data) {
            console.log("连接服务器成功！")
            Socket.match();

        });
        this.connection.on('disconnect', function (data) {
            console.log("断开连接！")
        });
        this.connection.on("message", function (data) {
            console.log(data);
        });

        this.connection.on("join", function (data) {
            Socket.onJoin(data);
        });

        this.connection.on("match", function (data) {
            Socket.onMatch(data);
        });

        this.connection.on("pices", function (data) {

            Socket.onPices(data);
        });
        this.connection.on("restart", function (data) {
            Gobang.restart();
        });

        this.connection.on("message", function (data) {
            Socket.onMessage(data);
        });

        this.connection.on("draw", function (data) {
            Socket.onDraw(data);
        })


    },
    match: function () {
        if (_user.uid == '') {
            console.log("用户未登录，不匹配！");
            return;
        }
        //匹配房间
        this.connection.emit("match", _user);
    },
    onMatch: function (data) {
    },
    pices: function (x, y, type) {
        this.connection.emit("pices", {x: x, y: y, type: type, uid: _user.uid, enemyUid: enemyUid, roomId: roomId});
    },
    onJoin: function (data) {
    },
    onPices: function (data) {

    },
    //重新开始游戏
    restart: function () {
        console.log("send")
        this.connection.emit("restart", {uid: _user.uid, enemyUid: enemyUid, roomId: roomId});
    },
    sendMessage: function (msg) {
        this.connection.emit("message", {
            from: _user.uid,
            msg: msg,
            nickName: _user.nickName,
            target: enemyUid,
            roomId: roomId
        });
    },
    onMessage: function (data) {

    },
    draw: function () {
        this.connection.emit("draw", {roomId: roomId, uid: _user.uid, nickName: _user.nickName, enemyUid: enemyUid})
    },
    onDraw: function (data) {
        var dialog = new Dialog({
            title: data.nickName + '请求与您和棋，是否同意？',
            buttons: [{
                text: '同意',
                handler: function () {

                    dialog.close();
                }
            }, {
                text: '拒绝',
                handler: function () {

                    dialog.close();
                }
            }]
        }).show();
    },
    appendMessage: function (nickName, msg) {
        var div = document.createElement("div");
        div.className = "item";
        var html = '';
        html += '<div class="nickname">' + nickName + ' : </div>';
        html += '<div class="content">' + msg + '</div>';

        div.innerHTML = html;
        var msgbox = document.getElementById("msgbox");
        msgbox.appendChild(div);
        msgbox.scrollTop = msgbox.scrollHeight;

    }

}


var enemyUid = null;
//匹配成功
var picesType = 0;

var _lastType = -1;
//玩家加入
Socket.onJoin = function (data) {

    var type = 0;
    if (picesType == 0) {
        type = 1;
    } else {
        type = 0;
    }
    showUser(data, 'enemy', type);
    enemyUid = data.uid;
};

var roomId = null;
Socket.onMatch = function (data) {

    $("#roomId").innerText = data.id;
    roomId = data.id;


    var enemy = null;
    var me = null;

    var enemyType = 0;
    var meType = 0;
    if (data.user1.uid == _user.uid) {
        picesType = data.user1.type;
        enemy = data.user2.data;
        me = data.user1.data;

        enemyType = data.user2.type;
        meType = data.user1.type;
    } else {
        enemy = data.user1.data;
        me = data.user2.data;
        picesType = data.user2.type;

        enemyType = data.user1.type;
        meType = data.user2.type;
    }
    //恢复锁
    //最后一个自己下的就锁住
    _lastType = data.lastType;


    showUser(enemy, 'enemy', enemyType);
    showUser(me, 'me', meType);
    if (enemy) {
        enemyUid = enemy.uid;
    }

    //恢复棋局

    for (var y = 0; y < data.board.length; y++) {
        var item = data.board[y];
        for (var x = 0; x < item.length; x++) {
            var type = item[x];
            if (type != -1) {
                Gobang.drawPices(x, y, type);
            }
        }
    }
    console.log(data)
};

Socket.onPices = function (data) {
    console.log(data)
    Gobang.drawPices(data.x, data.y, data.type);
};

Socket.onMessage = function (data) {
    appendMessage(data.nickName, data.msg);
};

Socket.init(host);

function showUser(user, id, type) {

    //胜率=赢/（输+赢+平局）
    if (!user) {
        return;
    }
    var value = user.victory / (user.victory + user.failure + user.draw);
    if (isNaN(value)) {
        value = 0;
    }
    value = parseFloat(value).toFixed(2);

    var html = '<img class="avatar" src="' + user.avatar + '"/>';
    html += '<div>';

    if (type == 0) {
        html += '<span class="icon-black"></span>';
    } else {
        html += '<span class="icon-white"></span>';
    }

    html += '<a href="https://weibo.com/' + user.uid + '" target="_blank"><span>' + user.nickName + '</span></a>';
    html += '</div>';
    html += '<div>' + user.location + '</div>';
    html += '<div>赢：' + user.victory + ' 输：' + user.failure + ' 和：' + user.draw + '</div>';
    html += '<div>胜率：' + value + '%</div>';
    html += '<div>步时：02:00</div>';

    document.getElementById(id).innerHTML = html;
}

//lock同步

window.Socket = Socket;



