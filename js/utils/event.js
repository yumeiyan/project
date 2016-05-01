/**
 * Created by 刘绍振 on 2016/4/3.
 * 事件库：用on绑定，用off解绑。
 * 自定义事件代号必须以"self"开头
 */

/**
 * 事件绑定
 * @param ele 目标元素
 * @param type  事件类型代号
 * @param fn  方法名
 */
function on(ele, type, fn) {
    if(/^self/.test(type)){//处理自定义事件
        if(!ele["self"+type])ele["self"+type]=[];
        var a=ele["self"+type];
        for(var i=0;i< a.length;i++){
            if(a[i]==fn)return;
        }
        a.push(fn);
        return;
    }


    if (ele.addEventListener) {//如果支持标准浏览器的方法，则直接用此方法完成事件绑定
        ele.addEventListener(type, fn, false);
        return;
    }
    if (!ele["aEvent" + type]) {
        ele["aEvent" + type] = [];
        ele.attachEvent("on" + type, function () {
            run.call(ele)
        });//代替了bind方法
    }
    var a = ele["aEvent" + type];
    for (var i = 0; i < a.length; i++) {
        if (a[i] == fn)return;
    }
    a.push(fn);
}

/**
 *自定义事件运行
 * @param type 自定义的事件类型代号
 * @param e  事件对象
 */
function selfRun(type,e){
    var a=this["self"+type];
    if(a){
        for(var i=0;i< a.length;i++){
            if(typeof a[i]=="function"){
                a[i].call(this,e);
            }else{
                a.splice(i,1);
                i--;
            }
        }
    }
}

/**
 * 系统事件运行
 * @param e  事件对象
 */
function run(e) {
    e = window.event;
    var type = e.type;
    if (!e.target) {
        e.target = e.srcElement;
        e.preventDefault = function () {
            e.returnValue = false
        };
        e.stopPropagation = function () {
            e.cancelBubble = true
        };
        e.pageX = document.documentElement.scrollLeft || document.body.scrollLeft + e.clientX;
        e.pageY = document.documentElement.scrollTop || document.body.scrollTop + e.clientY;
    }
    var a = this["aEvent" + type];

    if (a && a.length) {
        for (var i = 0; i < a.length; i++) {
            if (typeof a[i] == "function") {
                a[i].call(this, e);
            } else {
                a.splice(i, 1);
                i--;
            }
        }
    }
}
/**
 *
 * @param ele  目标元素
 * @param type  事件类型代号
 * @param fn    方法名
 */
function off(ele, type, fn) {
    if(/^self/.test(type)){
        var a = ele["self" + type];
        if (a && a.length) {
            for (var i = 0; i < a.length; i++) {
                if (a[i] == fn) {
                    a[i] = null;
                    return;
                }
            }
        }
    }
    if (ele.removeEventListener) {
        ele.removeEventListener(type, fn);
        return;
    }
    var a = ele["aEvent" + type];
    if (a && a.length) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] == fn) {
                a[i] = null;
                return;
            }
        }
    }
}
/**
 * 功能类似与Function.prototype.bind
 *让fn功能不变，把fn中的this指向obj
 * @param fn  方法
 * @param obj  this
 * @returns {Function}
 */
function processThis(fn, obj) {
    return function (e) {
        fn.call(obj, e)
    }
}

