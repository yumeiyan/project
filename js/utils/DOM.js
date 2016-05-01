/**
 * Created by 刘绍振 on 2016/3/20.
 */
var DOM = {};
/**
 * 获得指定元素的索引
 * @param ele 指定元素
 * @returns {number} 索引
 */
DOM.getIndex = function getIndex(ele) {
    var index = 0;
    var p = ele.previousSibling;
    while (p) {
        if (p.nodeType === 1) {
            index++;
        }
        p = p.previousSibling;
    }
    return index;
};

/**
 * 计算任意元素距离文档上边和左边的绝对偏移量
 * @param ele
 * @returns {{t: (*|Number|number)距离上边的偏移量, l: (*|Number|number)距离左边的偏移量}}
 */
DOM.offset = function offset(ele) {
    var top = ele.offsetTop;
    var left = ele.offsetLeft;
    var parent = ele.offsetParent;
    while (parent) {
        if (window.navigator.userAgent("MSIE 8") == -1) {
            top += parent.offsetTop + parent.clientTop;
            left += parent.offsetLeft + parent.clientLeft
        } else {
            top += parent.offsetTop;
            left += parent.offsetLeft;
        }
    }
    return {t: top, l: left};
};
/**
 * 类数组转换为数组
 * @param likeArray 类数组
 * @returns {Array} 数组
 */
DOM.listToArray = function listToArray(likeArray) {
    try {
        return [].slice.call(likeArray);
    } catch (e) {
        var ary = [];
        for (var i = 0; i < likeArray; i++) {
            ary[ary.length] = likeArray[i];
        }
        return ary;
    }
};

/**
 * 获得指定元素的所有的元素哥哥弟弟节点
 * @param ele 指定元素
 * @returns {Array} 哥哥弟弟，顺序和文档顺序相同
 */
DOM.siblings = function siblings(ele) {
    var parent = ele.parentNode;
    var children = parent.children;//所有元素节点，在ie中还会包括注释节点
    var ary = [];
    for (var i = 0; i < children.length; i++) {
        if (children[i].nodeType === 1 && children[i] != ele) {
            ary.push(children[i]);
        }
    }
    return ary;
};
/**
 * 获得指定元素相邻的哥哥元素节点
 * @param ele 指定元素
 * @returns {Object} 元素节点
 */
DOM.previous = function previous(ele) {
    if (typeof ele.previousElementSibling == "object") {//如果没有哥哥元素节点，或者支持这个方法  if里直接写 ele.previousElementSibling会有问题
        return ele.previousElementSibling;
    } else {
        var p = ele.previousSibling;
        while (p) {
            if (p.nodeType === 1) {
                return p;
            }
            p = p.previousSibling;
        }
        return null;//如果没有哥哥节点，返回null
    }
};
/**
 * 获得指定元素相邻的弟弟元素节点
 * @param ele 指定元素
 * @returns {Object}
 */
DOM.next = function next(ele) {
    if (typeof ele.nextElementSibling == "object") {
        return ele.nextElementSibling;
    }
    var next = ele.nextSibling;
    while (next) {
        if (next.nodeType === 1) {
            return next;
        }
        next = next.nextSibling;
    }
    return null;
};
/**
 * 获得指定元素所有的哥哥元素节点
 * @param ele 指定元素
 * @returns {Array} 哥哥元素节点数组
 */
DOM.previousAll = function previousAll(ele) {
    var ary = [];
    var p = ele.previousSibling;
    while (p) {
        if (p.nodeType === 1) {
            ary.push(p);
        }
        p = p.previousSibling;
    }
    return ary;
};
/**
 * 获得指定元素所有的弟弟元素节点
 * @param ele 指定元素
 * @returns {Array} 弟弟元素节点数组
 */
DOM.nextAll = function nextAll(ele) {
    var ary = [];
    var next = ele.nextSibling;
    while (next) {
        if (next.nodeType === 1) {
            ary.push(next);
        }
        next = next.nextSibling;
    }
    return ary;
};
/**
 * 获得指定元素的第一个元素子节点
 * @param parent 指定元素
 * @returns {Object} 元素节点
 */
DOM.firstChild = function firstChild(parent) {
    if (typeof parent.firstElementChild == "object") {
        return parent.firstElementChild;
    }
    var first = parent.firstChild;
    while (first) {
        if (first.nodeType === 1) {
            return first;
        }
        first = first.nextSibling;
    }
    return null;
};
/**
 * 获得指定元素的最后一个元素子节点
 * @param parent 指定元素
 * @returns {Object} 元素节点
 */
DOM.lastChild = function lastChild(parent) {
    if (typeof parent.lastElementChild == "object") {
        return parent.lastElementChild;
    }
    var last = parent.lastChild;
    while (last) {
        if (last.nodeType === 1) {
            return last;
        }
        last = last.previousSibling;
    }
    return null;
};
/**
 * 获得parent所有的子元素节点,兼容ie，还可以获得指定标签名tagName的子元素
 * @param parent 父元素
 * @param tagName 子元素的名称
 * @returns {Array} 数组
 */
DOM.children = function children(parent, tagName) {
    var ary = [];
    var child = parent.children;//children在ie67中会包括注释节点
    if (typeof tagName == "string") {
        for (var i = 0; i < child.length; i++) {
            //if(child[i].nodeType===1&&child[i].nodeName==tagName.toUpperCase()){
            //if(child[i].nodeType===1&&child[i].tagName==tagName.toUpperCase()){nodeName和tagName：tagName只是元素节点的属性（其它节点是undefined），nodeName是所有的节点
            if (child[i].tagName === tagName.toUpperCase()) {
                ary.push(child[i]);
            }
        }
    } else if (tagName === undefined) {
        for (var i = 0; i < child.length; i++) {
            if (child[i].nodeType === 1) {
                ary.push(child[i]);
            }
        }
    } else {
        throw new Error("第二个参数标签名错误");
    }
    return ary;
};
/**
 * 根据类名获得元素
 * @param className  类名，字符串，多个类名以空格分隔
 * @param parent  父级，可以不写，不写为整个文档
 * @returns {Array} 数组
 */
DOM.getByClassName = function getByClassName(className, parent) {
    parent = parent || document;
    if (parent.getElementsByClassName) {
        return parent.getElementsByClassName(className);
    }
    var regTrim = /^ +| +$/g;
    className = className.replace(regTrim, "");
    var allTag = parent.getElementsByTagName("*");
    var classNameAry = className.split(/ +/);
    for (var i = 0; i < classNameAry.length; i++) {
        var reg = new RegExp("(?:^| )" + classNameAry[i] + "(?: |$)");
        var ary = [];
        for (var k = 0; k < allTag.length; k++) {
            if (reg.test(allTag[k].className)) {
                ary.push(allTag[k]);
            }
        }
        allTag = ary;
    }
    return allTag;
};
/**
 * 新增class类名
 * @param ele 元素
 * @param className 要新增的类名
 */
DOM.addClass = function addClass(ele, className) {
    if (ele && ele.nodeType && ele.nodeType === 1 && className && typeof className === "string") {
        var reg = new RegExp("(?:^| )" + className + "(?: |$)");
        if (!reg.test(ele.className)) {
            ele.className = ele.className + " " + className;
        }
    }
};
/**
 * 移除class类名
 * @param ele 元素
 * @param className 要移除的类名
 */
DOM.removeClass = function removeClass(ele, className) {
    if (ele && ele.nodeType && ele.nodeType === 1 && className && typeof className === "string") {
        var reg = new RegExp("(?:^| )" + className + "(?: |$)", "g");
        //ele.className = ele.className.replace(/ /g, "   ");//加空格
        ele.className = ele.className.replace(reg, " ");
    }
};
/**
 * 将新元素添加到老元素后边
 * @param newEle 新元素
 * @param oldEle 老元素
 */
DOM.insetAfter = function insetAfter(newEle, oldEle) {
    //ele.insertBefore(newEle,oldEle);//如果第二个参数为null，或者不写，相当于appendChild
    //把newEle添加到oldEle的弟弟的前边
    oldEle.parentNode.insertBefore(newEle, oldEle.nextSibling);
};
/**
 * 将子元素添加到父元素的第一个位置
 * @param parent 父元素
 * @param child 子元素
 */
DOM.prepend = function prepend(parent, child) {
    //appendChile是在最后
    parent.insertBefore(child, parent.firstChild);
};
/**
 * 获得内敛式或者外嵌式css属性值。带单位的属性值去掉单位，不带单位直接返回
 * @param ele  元素
 * @param attr  属性名 例如 "left"、"margin"
 * @returns {Number}
 */
DOM.getCss = function getCss(ele, attr) {
    var value, reg;
    if (typeof window.getComputedStyle == "function") {
        value = window.getComputedStyle(ele)[attr];
    } else {
        if(attr=="opacity"){
            var opacity=ele.currentStyle["filter"];//alpha(opacity=80)
            var regOpacity=/alpha\(opacity *= *(\d+(\.\d+)?)\)/;
            value=regOpacity.test(opacity)?parseFloat(RegExp.$1)/100:1;
        }else{
            value = ele.currentStyle[attr];
        }
    }
    reg = /^[+-]?\d+(\.\d+)?(px|pt|em|rem)?$/;
    if (reg.test(value)) {
        return parseFloat(value);
    } else {
        return value;
    }
};
/**
 * 设置css属性
 * @param ele  元素
 * @param attr  属性名
 * @param value  属性值
 */
DOM.setCss=function setCss(ele,attr,value){
    if(attr=="opacity"){
        ele.style["opacity"]=value;
        ele.style["filter"]="alpha(opacity="+value+")";
    }else{
        if(isNaN(value)){
            ele.style[attr]=value;
        }else{
            ele.style[attr]=value+"px";
        }
    }
};