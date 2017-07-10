function $(id) {
    var flag = id.substring(0, 1);
    var node = id.substring(1);

    var obj = null;

    if (flag == "#") {
        obj = document.getElementById(node);
    } else {
        obj = document.getElementsByClassName(node);
    }

    obj.show = function () {

        this.style.display = "block";
    }
    obj.hide = function () {
        this.style.display = "none";
    }
    obj.text = function (text) {
        this.innerText = text;
    }
    return obj;
}