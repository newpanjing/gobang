function Dialog(option, cb) {

    var maskContent = null;
    this.show = function () {
        var div = document.createElement("div");
        div.className = "mask-content";
        var h1 = document.createElement("h1");
        h1.innerText = option.title;
        div.appendChild(h1);


        for (var i in option.buttons) {
            var item = option.buttons[i];
            var a = document.createElement("a");
            a.href = "javascript:void(0)";
            a.className = "btn";
            a.innerText = item.text;
            a.onclick = item.handler;
            div.appendChild(a);
        }

        document.getElementById("parent").appendChild(div);
        maskContent = div;
        $("#mask").show();
        setTimeout(function () {

            div.style.top = "50%";
        }, 10);

        var obj = this;
        if (option.timeout) {
            setTimeout(function () {
                cb(obj);
                obj.close();
            }, option.timeout);
        }

        return this;
    }

    this.close = function () {
        //动画
        maskContent.style.top = "-200px";
        $("#mask").hide();
        setTimeout(function () {
            document.getElementById("parent").removeChild(maskContent);
        }, 1000);
    }
}