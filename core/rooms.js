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
                    type: 0
                },
                user2: {
                    data: null,
                    uid: "",
                    type: 1
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

                return item;
            } else if (item.user2.uid == "" || item.user2.uid == uid) {

                item.user2.uid = uid;
                return item;
            }

        }
        return null;
    }
}

module.exports = rooms;