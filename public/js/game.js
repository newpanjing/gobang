window.onload = function () {

    //网络部分
    var host = _config.host;

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

            this.connection.on("restart", function (data) {
                Gobang.restart();
            });
            this.connection.on('disconnect', function (data) {
                console.log("断开连接！")
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


            this.connection.on("message", function (data) {
                Socket.onMessage(data);
            });

            this.connection.on("draw", function (data) {
                Socket.onDraw(data);
            })

            this.connection.on("action", function (data) {
                Socket.onAction(data);
            })

            this.connection.on("offline", function (data) {
                Socket.onOffline(data);
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

        },
        action: function (type, data) {
            this.connection.emit("action", {
                uid: _user.uid,
                nickName: _user.nickName,
                roomId: roomId,
                enemyUid: enemyUid,
                type: type,//0 同意，1 拒绝
                victoryType: data
            })
        },
        onAction: function (data) {
        },
        sendHeartbeat: function () {

            this.connection.emit("heartbeat", {
                uid: _user.uid,
                roomId: roomId
            });
        },
        onOffline: function () {

        }


    }

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
        Socket.appendMessage(data.nickName, data.msg);
    };

    Socket.init(host);

    function showUser(user, id, type) {
        if (!user) {
            document.getElementById(id).innerHTML = "";
        }
        //胜率=赢/（输+赢+平局）
        if (!user) {
            return;
        }
        var value = user.victory / (user.victory + user.failure + user.draw);
        if (isNaN(value)) {
            value = 0;
        }
        value = parseFloat(value*100).toFixed(2);

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
        // html += '<div>步时：02:00</div>';

        document.getElementById(id).innerHTML = html;
    }

    //lock同步

    window.Socket = Socket;


    var width = 580;
    var height = 580;

    $("#container").style.height = height + "px";
    $("#container").style.width = (width + 400) + "px";

    $("#user").style.height = height + "px";
    $("#action").style.height = height + "px";


    var parent = document.getElementById("parent");
    parent.style.width = width + "px";
    parent.style.height = height + "px";

    var canvas = document.createElement("canvas");
    parent.appendChild(canvas);


    //初始化
    Gobang.init({
        width: width,
        height: height,
        padding: 20,
        retina: true
    }, canvas);

    //测试暴露对象
    window.Gobang = Gobang;

    //登录框
    if (_user.signin == "false") {

        var dialog = new Dialog({
            title: '您还没有登录！',
            buttons: [{
                text: '微博登录',
                handler: function () {
                    window.location.href = "/oauth/weibo";
                }
            }]
        });
        dialog.show();
    }


    document.getElementById("drawBtn").onclick = function () {
        Socket.draw();
        this.className = "btn disabled";
    }


    function isIE() { //ie?
        if (!!window.ActiveXObject || "ActiveXObject" in window)
            return true;
        else
            return false;
    }

    if (isIE()) {
        new Dialog({
            title: '对不起，本程序不支持IE浏览器，请使用Chrome/Webkit内核系列的浏览器！', buttons: [{
                text: "下载Chrome浏览器",
                handler: function () {
                    window.location.href = "http://www.google.cn/chrome/browser/desktop/";
                }
            }]
        }).show();
    }


    //输入框事件
    $("#inputbox").onkeyup = function (event) {
        if (event.keyCode == 13) {
            var value = $("#inputbox").value;
            value = value.replace(/ /g, "");

            if (value != "") {
                Socket.sendMessage(value);
                $("#inputbox").value = "";
                Socket.appendMessage(_user.nickName, value);
            }
        }
    }

    Socket.onDraw = function (data) {
        var dialog = new Dialog({
            title: data.nickName + '请求与您和棋，是否同意？',
            buttons: [{
                text: '同意',
                handler: function () {

                    //发送通知，游戏重新开始
                    Socket.action(0)
                    //擦除棋盘
                    Gobang.restart();
                    dialog.close();
                }
            }, {
                text: '拒绝',
                handler: function () {
                    Socket.action(1);
                    dialog.close();
                }
            }]
        }).show();
    }


    Socket.onAction = function (data) {

        var msg = "";
        if (data.type == 0) {
            //同意，擦出桌面
            msg = data.nickName + "同意和棋！";
            //擦除棋盘
            Gobang.restart();

        } else if (data.type == 1) {
            msg = data.nickName + "不同意和棋！";
        } else if (data.type === 2) {
            msg = data.nickName + "已认输！";
            //擦除棋盘
            Gobang.restart();
        }
        new Dialog({title: msg, timeout: 2000}).show();
    }

    Socket.onOffline = function (data) {
        var dialog = new Dialog({
            title: data.nickName + "掉线，您赢了！", buttons: [{
                text: '重新开始',
                handler: function () {
                    Gobang.restart();
                    Socket.restart();
                    dialog.close();
                }
            }],
        }).show();
        showUser(null, 'enemy');
    }

    $("#towelBtn").onclick = function () {
        var dialog = new Dialog({
            title: '您确定要认输吗？',
            buttons: [{
                text: '确定',
                handler: function () {
                    Socket.action(2);
                    //擦除棋盘
                    Gobang.restart();
                    dialog.close();
                }
            }, {
                text: '取消',
                handler: function () {
                    dialog.close();
                }
            }]
        }).show();
    }

    Gobang.onVictory = function (type) {
        Socket.action(3, type)
    }


    //更新资料
    Gobang.onRestart = function () {
        Socket.match();
        //求和按钮重新启用，一局只能求和一次，同意或拒绝都是一次
        $("#drawBtn").className="btn";
    };

    setInterval(function () {
        if (roomId && roomId != "") {
            Socket.sendHeartbeat();
        }
    }, 1000);

}

window.start = function () {
    //防止对象暴露
    Socket.restart();
    Gobang.restart();
}








