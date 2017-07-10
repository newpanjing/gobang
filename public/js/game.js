window.onload = function () {

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


}

window.start = function () {
    //防止对象暴露
    Socket.restart();
    Gobang.restart();
}








