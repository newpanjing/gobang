/**
 * Created by sun on 2017/7/6.
 */

var num = 100;//100个房间
var rooms = {
    //加入房间
    _data: {},
    _init: false,
    init: function () {


        for (var i = 1; i <= num; i++) {
            var array = [];
            for (var j = 0; j < 15; j++) {
                array[j] = [];
                for (var k = 0; k < 15; k++) {
                    array[j].push(-1);
                }
            }
            this._data[i] = {
                user1: {
                    data: null,
                    uid: "",
                    type: 0,
                    lastTime: 0//最后活跃时间
                },
                user2: {
                    data: null,
                    uid: "",
                    type: 1,
                    lastTime: 0//最后活跃时间
                },
                id: i,
                board: array, //棋盘
                lastType: -1//最后下棋者
            };
        }
    },
    clearBorad: function (id) {
        var array = [];
        for (var j = 0; j < 15; j++) {
            array[j] = [];
            for (var k = 0; k < 15; k++) {
                array[j].push(-1);
            }
        }

        this._data[id].board = array;

    },
    //获取房间
    get: function (id) {
        return this._data[id];
    },
    //匹配房间
    match: function (uid) {
        if (!this._init) {
            this.init();
            this._init = true;
        }
        for (var i in this._data) {
            var item = this._data[i];

            if (item.user1.uid == "" || item.user1.uid == uid) {
                item.user1.uid = uid;
                item.user1.lastTime = new Date().getTime();
                return item;
            } else if (item.user2.uid == "" || item.user2.uid == uid) {

                item.user2.uid = uid;
                item.user2.lastTime = new Date().getTime();

                return item;
            }


        }
        return null;
    },
    checkTimeout: function (cb) {

        var time = new Date().getTime();
        var array = [];
        for (var i in this._data) {
            var item = this._data[i];
            if (item.user1.uid != "") {
                if (time - item.user1.lastTime >= 1000 * 20) {
                    if (item.user2.data) {
                        array.push({
                            roomId: item.id,
                            nickName: item.user1.data.nickName,
                            to: item.user2.uid,
                            from: item.user1.uid
                        })
                    }
                    item.user1.uid = "";
                    item.user1.data = null;
                }
            }

            if (item.user2.uid != "") {
                if (time - item.user2.lastTime >= 1000 * 20) {
                    if (item.user1.data) {
                        array.push({
                            roomId: item.id,
                            nickName: item.user2.data.nickName,
                            to: item.user1.uid,
                            from: item.user2.uid
                        })
                    }
                    item.user2.uid = "";
                    item.user2.data = null;
                }
            }
        }

        cb(array);
    }
}

module.exports = rooms;