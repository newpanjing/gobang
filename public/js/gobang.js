var Gobang = {
    resources: {
        //图片素材
        image: {
            black: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAQAAABLCVATAAAEXElEQVRIx32Wy49TZRjGf+/3nZ5L2xmGTmVmFESEEDXQDCYiiSYGE+NgXBnd+Ae4MsbMX+DOuDC6MwYXJuLGjYmKK2IiCYmABSwERS4TKLXT6TDQmU7vp5+Lnp72TDucb3Nu33Oe53lvRwyPP8TmMMumMP5pJjyztgV4jQUWZF4AULBsLvAjpyn3no8QMCMLzQdSFCPGMraxjWW0UUb663vZO9h3OFxqhMnr5ORrPbuTaTzAp9uD73/4fXNTfWE7I/uiFOVD+VLrJ4jzkE06dMeINoC66LxbuzfsUQRIPpdFj4OsU6JJd5wT4T0pegv7rw5eGJImi7I4xTzrFKmzm2lAto2mmWv8XNozeCFkJAvyS0K/yAp3afIZx7jFSf4Yy6p/x7qw74T7sHep+tki38R0hg0KNJnnEFfIMoF+bI75R5c/xotKW+SpvWgK1IAOl8lyhev422VZsOofNQ72clF/AsgO+cH1nqdECR8o0yTPHUpjPZIQCHDbyR1nqQeM5D1Su2myRizw4BzXWHsMzIBX4y32EOtLe0exkwpVXhroZ7QUQh4IgkKAbqryBlOgQDTHE8Amuzi0TXwGrhBADK5rx0mjFLAP16HBJkfREQZmhEufxwBI0d3DDK4F8ixoWrQ4gD+SNxIxeNilvlN+ihniFsi0wdDCR0hvE6EBoAkBFQoFGJuduBYofDq0MTyIeCQRPgzZDBoLjUbRoSsksBWoKrTpYMgxx2TEWgm+KmGcBI2Di0ucBEk0yieGVuDdhBZthMvc5dWItVFjDYLGxiFOkgQJJugQqwYl8nReNjp0gBZf8QrxiAiJAGtcPOLEiZNkEk0bu0ILXwFtfaFDE1Bc5AwnhmT0z3qR1Lg4uAHMBJNsICQKVGkqoO38Cm18QPidAvuH5AgmiFRPlIcXwtisEFuPrbJKXUHOPPmT9aBLJ4jWn7SY21JRghDDxg5MTpAkyR0Mk3kqrLCpAJzViW8FQzfYfp8KiSGXFILGwsbBxcMjSZIy94lVJ5YosEyrV7TVuVPWshr0Y+rUtlhuYeGEgY9TI4ti6jYr3OQBRgHkOjo/+6m0dAAlI4FXaOxQnEeDcxgS+fg9bnGD9UGHrEye2XUKo4PRJyP1bmGF4kr8RgNnLXWDPFcp0AmBch3yqe/Sp3XXCoZiNIt0CAV/k8XHfpS+SpEs16hGZ3+V6+mTdrP8tjiGLj56SyoKUGIFgxAvpG6wwiXOU+yFOwTKmcwa2UnLfbT6Zm23phtMWRXUfJ0abRSg6zuWEgVKXOIsSzTHTNqMxS7mOVZ/+eGRRhoRCNtGD1A3kvcmilIlT5bz3Kbeb19bZn9GM8VBjvCCv3fz6Ua6lRTpJHVTta2mvREv25vUKbPEX+Qo5JqR2Z/Z2ss8ZjjAczxDiiQuMTSGNi1qVCjyL/9wn0pYCtsA9YxJMM0Ms8wyhYdDlzobrPIfy5Sp0B7zW5PZbphaJEjiEEMDLVrUqQ5ciR7/A4TniIgLyLLcAAAAAElFTkSuQmCC",
            white: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAQAAABLCVATAAAEu0lEQVRIx42W228UVRzHP+fMmdnd3mgppVYsTQhyC8VgSLw8EEl8M8YHQuKbD8TEF0xIfDHhH+BF4xPxCTDeovJiihgl3oLyAFrNAiUFw6WWdtltt3Tb3dndOef4MGdmd4uKc7LJzOzM5/f7fn+/OeeIcTqPzxAItoM4t7v3BXbbgN3RVWmjyfDySxex8VNr3wKx9tYZBFOjg0e9g95mAYDBYtEYGvPRV+V3X73yv0Bv9W85lnvD6/aIMRYwGAwaTUTTVD659/aJmUeA3nmx/wN/ROEhEQQ0sC4fjSHCENEkXC29efxkIjM+vOH0NC8+Pbz+40x/Bh9FD6MM0EcdkEgkAokEBDLIvbKn59wPWf0PoLz48tDwqcAPUPgoRpCAh08d4UaMiSV3Pb+r6/yPLVQKOv7Mk5/7uQSj6CGxuu5ejxECi0UAfc8O3c9PStMB2tx/8OvsSEBAgMJDoVAA1IiwCKwzPoFaEBsPlC4W7sS3JUDeO3IkuzV+WSLxEFSpUadCiMBDOI88F8bDwyPIPXes8licujcMvDy6/7Sf8/HdA7G5EU1MmkeckUiv4tE3VrixcI0mSMirg4fVgHIxRVpVJwDhEKRmx895eHhi/+uVMUT8X1f/IQlIFH5alzhi2m4um/heIl8iGRvv20sOJBwdDXbGpc2mEtoHLq8ku6RucVbZYNeBaAgh82rf04mQDCaNa50/tgOdoITLSwBb9jSfwJP463YkUYL0EzWYFGVSLKnRiVgQDAyZTWQVSmxIuxMPjcEiO6pj2rJLeilGSQS5LjbSpZD0tiR4GCQ4iS1Qp2et1rRYfF+sI6MQUS2JHRGwkn4CncabNkjLN4BQ2xxKwcqidY7U6MOi08RZU0FS5+KzONRKQwiExMxNJz4sATkMGoN295KxFtcaxVWaWEn0XT4yGoulQZn+tjolCFz1zJrWiK+nF2WFpqRxofRgOp5INSWqrOvIpYW06cukIjWVxs2iXCSU41G9fuMb7SZTSwFJrkNOJ9A6gHHP/1HSq2qGqoRG5cSZSjmZ3jXzQHYNpCWNtFkNhtCc/0sU5H3qEuzK3MLPX0REDqRZpo63Rpx2kjStkJpf7hWLaooiWsJ4VC9+eGZuNkFZNCGhO0/WNNxaYtOFSbNQn7gjZv08S25imw3J3J7ftz/j0/bRJl0Ud3nLJU0csmrev1YsBN/LSylo2Babqyzqp/ZK2T4L2VROXHCd5hIR2Y9uXCnI34NvuUuUTv7rw5IpVufMtm0ZlRS53R0Nrk6x/Jo5NX25IKZzE1yj2rEchcuhWVi9Ut26pTfb3nK6bcHWDlOqvXd1epFb2bPiV8px2imoh77yg3ClceF+NTvSn1GJqdb9krEanb178lb5gbienRCXKKEfWrKx3eVKWevbyz+Vap70ejNWJMJi6M0HF+ZP/Tm1EBW937ITYpIS0b/tRkStpz4u9vpb5abuwZ0b13d1e4OZ5eZSc6l5fWW5bkO7LGf8y94kd6i0byMe2tac5jVV3RDtENvFmNwg+ghQSKzVRCzLWTWtppihTOMR+yN3+PQ2hpqPy0EzIHL4MqSmSqrAAmVWaHRuaf4DlAfGBR5ZMig8DE0ahER5+89bv78B7zrviBBp0JcAAAAASUVORK5CYII="
        },
        //声音素材
        audio: {}
    },
    params: {
        num: 15,//横轴15个
        padding: 40,
        pieces: 36,//棋子大小,
        piecesSize: 0,
        retina: true,//高分屏支持
        backgroupColor: "#fde6b8"
    },
    runing: false,//进行中
    board: {},
    ctx: {},
    _selectBox: false,
    _canvas: {},
    //画选框
    initSelectBox: function () {
        var canvas = document.createElement("canvas");
        var size = this.params.piecesSize / 2;
        size += size + 10;

        canvas.width = size;
        canvas.height = size;
        var cxt = canvas.getContext("2d");
        cxt.strokeStyle = "#4b72ff";
        cxt.lineWidth = 10;

        var w = size / 3;
        cxt.beginPath();

        cxt.moveTo(0, 0);
        cxt.lineTo(w, 0);

        cxt.moveTo(0, 0);
        cxt.lineTo(0, w);

        cxt.moveTo(size - w, 0);
        cxt.lineTo(size, 0);

        cxt.moveTo(size, 0);
        cxt.lineTo(size, w);

        cxt.moveTo(0, size);
        cxt.lineTo(0, size - w);

        cxt.moveTo(0, size);
        cxt.lineTo(w, size);

        cxt.moveTo(size, size);
        cxt.lineTo(size - w, size);

        cxt.moveTo(size, size);
        cxt.lineTo(size, size - w);

        cxt.stroke()
        cxt.closePath();

        var img = document.createElement("img");
        img.src = canvas.toDataURL("image/png");
        this._selectBox = img;
        if (this.params.retina) {
            img.width = size / 2;
            img.height = size / 2;
        }
        img.style.display = "none";
        img.style.position = "absolute";
        img.style.transition = "all 0.1s"
        img.style.userSelect = "none";
        this._canvas.parentNode.appendChild(img);

        return img;
    },
    initBorad: function () {
        this.board = new Array();
        var num = this.params.num;

        for (var i = 0; i < num; i++) {
            this.board[i] = [];
            for (var k = 0; k < num; k++) {
                this.board[i].push(-1);
            }
        }
    },
    onmousemove: function (e) {

        //不是我方，不显示框框
        if (_lastType == picesType) {
            return;
        }

        var _self = Gobang;
        if (!_self._selectBox) {
            return;
        }
        var e = window.event || e;
        var rect = this.getBoundingClientRect();
        var x = e.clientX - rect.left;//获取鼠标在canvsa中的坐标
        var y = e.clientY - rect.top;


        var padding = _self.params.padding;
        var piecesSize = _self.params.piecesSize;
        if (_self.params.retina) {
            padding /= 2;
            piecesSize /= 2;

        }
        x -= padding;
        y -= padding;


        // console.log(({x: x, y: y}))
        //坐标纠正
        var piecesSize = piecesSize;
        var px = Math.round(x / piecesSize);
        var py = Math.round(y / piecesSize);
        px = px < 0 ? 0 : px;
        py = py < 0 ? 0 : py;
        px = Math.abs(px);
        py = Math.abs(py);

        var num = _self.params.num - 1;

        if (px > num || py > num) {
            console.log("超出范围")
            return;
        }
        var point = _self.getPoint(px, py);

        if (_self.params.retina) {
            point.pointX /= 2;
            point.pointY /= 2;
        }
        var v = _self._selectBox.width / 2;
        point.pointY -= v;
        point.pointX -= v;

        _self._selectBox.style.top = point.pointY + "px";
        _self._selectBox.style.left = point.pointX + "px";
        _self._selectBox.style.display = "block";
        _self._selectBox.style.pointerEvents = "none";
        // console.log(point);

    },
    onmousedown: function (e) {
        var e = window.event || e
        if (e.button == 2) {
            return false;
        }
        var rect = this.getBoundingClientRect();
        var x = e.clientX - rect.left;//获取鼠标在canvsa中的坐标
        var y = e.clientY - rect.top;

        //如果自己下了之后，等待对家下
        //对家下了自己才可以下
        //黑棋优先


        console.log(_lastType)
        console.log(picesType)


        if (_lastType != picesType) {
            var sign = Gobang.createPices(x, y);
            if (sign) {
                _lastType = picesType;
                Gobang._selectBox.style.display = "none";
            }
        }

    }
    ,
    aa: 0,
    _initImage: false,
    initImage: function () {
        if (this._initImage) {
            return;
        }

        var images = this.resources.image;
        for (var i in images) {
            var item = images[i];
            var img = new Image();
            img.src = item;
            this.resources.image[i] = img;
        }
    }

    ,
    countSuccessY: function (x, y, type) {
        var a = 0;
        var c1 = y;
        var c2 = y + 1;
        for (var i = 0; i < 5; i++) {
            if (this.board[c1][x] == type) {
                a++;
            } else {
                break;
            }
            if (c1-- <= 0) {
                break;
            }
        }
        var b = 0;
        if (c2 < 14) {
            for (var i = 0; i < 4; i++) {
                if (this.board[c2][x] == type) {
                    b++;
                } else {
                    break;
                }
                if (c2++ >= 14) {
                    break;
                }
            }
        }
        return a + b;
    }
    ,
    countSuccessX: function (x, y, type) {
        var a = 0;
        var c1 = x;
        var c2 = x + 1;
        for (var i = 0; i < 5; i++) {
            if (this.board[y][c1] == type) {
                a++;
            } else {
                break;
            }
            if (c1-- < 0) {
                break;
            }
        }

        var b = 0;

        for (var i = 0; i < 4; i++) {
            if (this.board[y][c2] == type) {
                b++;
            } else {
                break;
            }
            if (c2++ >= 14) {
                break;
            }
        }
        return a + b;
    }
    ,
    countSuccessXY1: function (x, y, type) {
        //左上右下
        var count = 0;

        var c1 = c2 = 0;

        var a1 = b1 = x;
        var a2 = b2 = y;

        for (var i = 0; i < 5; i++) {

            if (this.board[a2][a1] == type) {
                c1++;
            } else {
                break;
            }

            if (a1 <= 0) {
                break;
            }
            if (a2 <= 0) {
                break;
            }
            a1--;
            a2--;
        }

        b1 += 1;
        b2 += 1;
        if (b1 <= 14 && b2 <= 14) {
            for (var i = 0; i < 4; i++) {

                if (this.board[b2][b1] == type) {
                    c2++;
                } else {
                    break;
                }

                if (b1 >= 14) {
                    break;
                }
                b1++;
                b2++;
            }
        }

        count += c1;
        count += c2;
        // console.log(count);
        return count;

    }
    ,
    countSuccessXY2: function (x, y, type) {
        //左上右下
        var count = 0;

        var c1 = c2 = 0;

        var a1 = b1 = x;
        var a2 = b2 = y;

        for (var i = 0; i < 5; i++) {

            if (this.board[a2][a1] == type) {
                c1++;
            } else {
                break;
            }

            if (a1 >= 14) {
                break;
            }
            if (a2 <= 0) {
                break;
            }
            a1++;
            a2--;
        }

        b1 -= 1;
        b2 += 1;
        if (b1 >= 0 && b2 <= 14) {

            for (var i = 0; i < 4; i++) {

                if (this.board[b2][b1] == type) {
                    c2++;
                } else {
                    break;
                }

                if (b2 >= 14) {
                    break;
                }
                if (b1 <= 0) {
                    break;
                }
                b1--;
                b2++;
            }
        }

        count += c1;
        count += c2;
        return count;

    }
    ,
    handlerStep: function (x, y, type, notice) {
        //上下
        var sign = 0;
        if (this.countSuccessY(x, y, type) >= 5) {
            sign = 1;
        } else if (this.countSuccessX(x, y, type) >= 5) {
            sign = 1;
        } else if (this.countSuccessXY1(x, y, type) >= 5) {
            sign = 1;
        } else if (this.countSuccessXY2(x, y, type) >= 5) {
            sign = 1;
        }

        //一方赢了
        if (sign == 1) {
            this.runing = false;
            var str = (type == 0 ? "黑棋" : "白棋") + "赢了";
            this.showMaskDialog(str);

            //只用一方通知
            if (!notice) {
                this.onVictory(type);
            }
        }

    },
    onVictory: function (type) {

    },
    createPices: function (x, y) {


        if (!this.runing) {
            console.log("游戏已经结束！")
            return;
        }

        // var type = this.aa % 2 == 0 ? 0 : 1
        type = picesType;
        var padding = this.params.padding;
        var piecesSize = this.params.piecesSize;
        if (this.params.retina) {
            padding /= 2;
            piecesSize /= 2;

        }
        x -= padding;
        y -= padding;


        // console.log(({x: x, y: y}))
        //坐标纠正
        var piecesSize = piecesSize;
        var px = Math.round(x / piecesSize);
        var py = Math.round(y / piecesSize);
        px = px < 0 ? 0 : px;
        py = py < 0 ? 0 : py;
        px = Math.abs(px);
        py = Math.abs(py);

        // console.log({px: px, py: py})

        //判断该位置是否下过了
        if (this.board[py][px] != -1) {
            console.log("该位置下过了！")
            return false;
        }

        // console.log({x: px, y: py})

        this.board[py][px] = type;
        this.aa++;

        var point = this.getPoint(px, py);
        x = point.pointX;
        y = point.pointY;

        //小原点跟随
        $("#pointMe").style.left = (x / 2 - 4) + "px";
        $("#pointMe").style.top = (y / 2 - 4) + "px";

        x -= this.params.pieces / 2;
        y -= this.params.pieces / 2;

        var img = this.resources.image[type == 0 ? "black" : "white"];

        var w = h = this.params.pieces;

        this.ctx.drawImage(img, x, y, w, h);
        this.handlerStep(px, py, type);


        Socket.pices(px, py, type);

        return true;
    }
    ,
    drawPices: function (px, py, type) {
        if (this.board[py][px] != -1) {
            console.log("该位置下过了！")
            return;
        }
        //解锁
        _lastType = type;

        var point = this.getPoint(px, py);
        var x = point.pointX;
        var y = point.pointY;

        //小原点跟随
        $("#pointEnemy").style.left = (x / 2 - 4) + "px";
        $("#pointEnemy").style.top = (y / 2 - 4) + "px";

        this._selectBox.style.display = "block";

        x -= this.params.pieces / 2;
        y -= this.params.pieces / 2;

        var img = this.resources.image[type == 0 ? "black" : "white"];

        var w = h = this.params.pieces;

        this.ctx.drawImage(img, x, y, w, h);
        this.board[py][px] = type;
        this.handlerStep(px, py, type, true);


    }
    ,
    init: function (p, obj) {
        this.runing = true;
        //合并参数
        for (var i in p) {
            this.params[i] = p[i];
        }

        //高分屏支持
        if (this.params.retina) {
            this.params.width *= 2;
            this.params.height *= 2;
            this.params.padding *= 2;
            this.params.pieces *= 2;
        }
        // console.log(this.params)
        var width = this.params.width;
        var height = this.params.height;
        obj.width = width;
        obj.height = height;

        var v1 = width;
        var v2 = height;
        if (this.params.retina) {
            v1 /= 2;
            v2 /= 2;
        }
        obj.style.width = v1 + "px";
        obj.style.height = v2 + "px";

        this._canvas = obj;


        var ctx = obj.getContext('2d');
        this.ctx = ctx;

        this.createBackgroup();

        this.initImage();

        obj.onmousedown = this.onmousedown;
        obj.onmousemove = this.onmousemove;

        //初始化内存棋盘
        this.initBorad();

        //初始化选框
        this.initSelectBox();

        //初始化遮罩层
        // this.initMask();
    }
    ,
    onRestart:function () {

    },
    //重新开始
    restart: function () {

        this.runing = true;
        this.initBorad();
        this.createBackgroup();

        this.hideMaskDialog();

        $("#pointEnemy").style = "left:-20px;top:-20px";
        $("#pointMe").style = "left:-20px;top:-20px";
        this.onRestart();
    }
    ,
    getPoint: function (x, y) {
        var size = this.params.piecesSize;
        // if (this.params.retina) {
        //     size /= 2;
        // }
        var padding = this.params.padding;
        var pointX = x * size + padding;
        var pointY = y * size + padding;

        return {
            pointX: pointX,
            pointY: pointY
        }
    }
    ,
    createBackgroup: function () {
        var ctx = this.ctx;
        var width = this.params.width;
        var height = this.params.height;

        //填充棋盘颜色
        //#ffe690
        ctx.fillStyle = this.params.backgroupColor;
        ctx.fillRect(0, 0, this.params.width, this.params.height);


        ctx.lineWidth = 4;
        ctx.beginPath();

        var x = y = this.params.padding;

        //边框
        ctx.moveTo(x, y);
        ctx.lineTo(width - x, y);

        ctx.moveTo(x, y);
        ctx.lineTo(x, height - y);

        ctx.moveTo(x, height - y);
        ctx.lineTo(width - x, height - y);

        ctx.moveTo(width - x, y);
        ctx.lineTo(width - x, height - y);

        ctx.stroke();

        ctx.lineWidth = 2;
        //格子
        var w = width - (this.params.padding * 2);
        var num = this.params.num - 1;
        var size = w / num;
        this.params.piecesSize = size;

        var x2 = x;
        var y2 = y;
        for (var i = 0; i < num; i++) {
            //横
            y += size;
            ctx.moveTo(x, y);
            ctx.lineTo(width - x, y);

            x2 += size;
            //竖
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2, height - y2);
        }


        ctx.stroke();
        ctx.closePath();


        //白带
        ctx.fillStyle = this.params.backgroupColor;

        ctx.fillRect(width - this.params.padding + 1, 0, this.params.padding, this.params.height);

        //画5个小圆圈

        var points = [{
            x: 3,
            y: 3
        }, {
            x: 11,
            y: 3
        }, {
            x: 3,
            y: 11
        }, {
            x: 11,
            y: 11
        }, {
            x: 7,
            y: 7
        }]
        var w = 5;
        if (this.params.retina) {
            w *= 2;
        }
        for (var i = 0; i < points.length; i++) {
            ctx.beginPath();

            var point = this.getPoint(points[i].x, points[i].y);
            ctx.arc(point.pointX, point.pointY, w, 0, 360, false);
            ctx.fillStyle = "#000";//填充颜色,默认是黑色
            ctx.fill();//画实心圆
            ctx.closePath();

        }


    }
    ,
    showMaskDialog: function (msg) {
        $("#mask").show();
        var content = $("#mask-content");
        // content.show();
        $("#mask-title").text(msg);

        content.style.top = "50%";
    }
    ,
    hideMaskDialog: function () {
        $("#mask").hide();
        // $("#mask-content").hide();
        $("#mask-content").style.top = "-200px";
    }
};