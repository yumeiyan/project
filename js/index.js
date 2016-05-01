var fnSearch=null;
var inputValue=DOM.next(DOM.getByClassName("glass")[0]).defaultValue;
var scriptId=0;
var searchTimer=window.setInterval(function () {
    try {
        document.body.removeChild(document.getElementById(scriptId));
    }catch (e){

    }
    var value = DOM.next(DOM.getByClassName("glass")[0]).value;
    if (value==""||value == inputValue) {
        return;
    }else{
        inputValue=value;
        fnSearch=function(data) {
            //操作
            if(data.result.code==0){
                var array=data.item;
                var oUl=DOM.getByClassName("searchend")[0];
                var str='';
                for(var i=0;i<array.length;i++){
                    var cur=array[i];
                     if(cur["idType"]>=2&&cur["class"]!="电影"&&cur["da"]){
                        str+='<li><a href="'+cur["url"]+'" class="item_posi"><span class="result_title">'+cur["title"]+'</span><span class="title_desc">('+cur["da"]+')&nbsp;'+cur["class"]+'</span><span class="item_posi"><i class="icon_arrow"></i></span></a><div class="wrap_content"><a href="" class="figure"><img src="'+cur["dc"]+'" alt=""></a><div class="wrap_right"><div class="detail_list"><h3>'+cur["tt"]+'</h3><p>'+cur["ee"]+'</p><p>主演：'+cur["pa"]+'</p></div><a href="'+cur["url"]+'" class="btn_play">立即播放</a></div></div></li>';
                    }else{
                        str+='<li><a href="http://v.qq.com/search.html?pagetype=3&stj2=search.smartbox&stag=txt.smart_index&ms_key='+cur["word"]+'" class="item_posi"><span class="result_title">'+cur["title"]+'</span><span class="title_desc">&nbsp;</span></a></li>'
                    }
                }
                oUl.innerHTML=str;
                oUl.style.display="block";
            }
        };
        var script = document.createElement("script");
        script.id=++scriptId;
        script.src = "http://s.video.qq.com/smartbox?plat=2&ver=0&num=10&otype=json&query=" + value + "&callback=fnSearch&low_login=1&_=1461240039775";
        document.body.appendChild(script);
    }
}, 1000);
(function () {
    //全网搜input输入框处理
    var input = DOM.next(DOM.getByClassName("glass")[0]);
    on(input, "focus", function () {
        if (this.value = this.defaultValue)this.value = "";
    });
    on(input, "blur", function () {
        if (this.value == "")this.value = this.defaultValue;
        DOM.getByClassName("searchend")[0].style.display="none";
    });
    //导航栏处理
    navigate(DOM.getByClassName("bannerbottom-left")[0]);
    navigate(DOM.getByClassName("bannerbottom-right")[0]);
    //轮播图处理
    var oUlSmall = DOM.getByClassName("viwebtphoto")[0];
    var left = DOM.getByClassName("btn_prev")[0];
    on(left, "click", leftClick);
    var right = DOM.getByClassName("btn_next")[0];
    on(right, "click", rightClick);
    DOM.children(DOM.children(DOM.children(DOM.getByClassName("viwebtphoto")[0], "li")[0], "a")[0], "i")[0].style.display = "block";
    DOM.setCss(DOM.children(DOM.children(DOM.getByClassName("viwebtphoto")[0], "li")[0], "a")[0], "opacity", "1");
    carousel(DOM.getByClassName("viweinner")[0], DOM.getByClassName("viwebtphoto")[0]);

    function leftClick() {
        var defaultLeft = parseFloat(DOM.getCss(oUlSmall, "left"));
        if (defaultLeft < 0) {
            animate(oUlSmall, {"left": 0}, 1);
        } else {
            animate(oUlSmall, {"left": -oUlSmall.offsetWidth / 2}, 1);
        }
    }
    function rightClick() {
        var defaultLeft = parseFloat(DOM.getCss(oUlSmall, "left"));
        if (defaultLeft < 0) {
            animate(oUlSmall, {"left": 0}, 1);
        } else {
            animate(oUlSmall, {"left": -oUlSmall.offsetWidth / 2}, 1);
        }
    }
    //logo登录
   /* var logoA=DOM.children(DOM.getByClassName("QQ")[0],"a")[0];
    var logoClose=DOM.getByClassName("logoBoardClose")[0];
    logoA.onclick=function () {
        DOM.getByClassName("logoBoard")[0].style.display="block";
        var light=document.getElementById("light");
        light.style.height=(document.documentElement.offsetHeight||document.body.offsetHeight)+"px";
    };
    logoClose.onclick=function () {
        DOM.getByClassName("logoBoard")[0].style.display="none";
        light.style.height="0";
    };*/
    /**
     * 导航栏显示隐藏子div
     * @param ele 导航栏
     */
    function navigate(ele) {
        var oLis = DOM.children(ele, "li");
        var oAs = [];
        TOOLS.each(oLis, function (item) {
            oAs.push(DOM.children(item, "a")[0]);
        });
        TOOLS.each(oAs, function (item) {
            on(item, "mouseenter", function () {
                var next=DOM.next(this);
                on(next,"mouseenter",function () {
                    this.style.display="block";
                });
                DOM.next(this).style.display = "block";
            });
            on(item, "mouseleave", function () {
                var next=DOM.next(this);
                on(next,"mouseleave",function () {
                    this.style.display="none";
                });
                DOM.next(this).style.display = "none";
            });
        });
        function hover() {
            DOM.next(this).style.display = "block";
            var othersLi = DOM.siblings(this.parentNode);
            TOOLS.each(othersLi, function (item) {
                var oDivs = DOM.children(item, "div")[0].style.display = "none";
            });
            return false;
        }
    }

    /**
     * 自动轮播
     * @param photoArea  图片区域
     * @param btnArea  按钮区域
     */
    function carousel(photoArea, btnArea) {
        var photoWidth = DOM.firstChild(photoArea).offsetWidth;
        var btnLis = DOM.children(btnArea, "li");
        for (var i = 0; i < btnLis.length; i++) {
            btnLis[i].index = i;
            btnLis[i].onmouseenter = function () {
                changeColor(this.index);
                animate(photoArea, {left: -photoWidth * this.index}, 0, 1);
                step = this.index;
                window.clearInterval(autoTimer);
                autoTimer = window.setTimeout(function () {
                    autoTimer = window.setInterval(autoMove, 3000);
                }, 3000)
            }
        }
       /* function animate(ele, obj, duration, effect, callback) {
            var fnEffect = tween.Expo.easeInOut;
            if (typeof effect == "number") {
                switch (effect) {
                    case 0:
                        break;
                    case 1:
                        fnEffect = tween.Circ.easeOut;
                        break;
                    case 2:
                        fnEffect = tween.Cubic.easeOut;
                        break;
                    case 3:
                        fnEffect = tween.Elastic.easeOut;
                        break;
                }
            }
            if (typeof effect == "function") {
                callback = effect;
            }
            clearInterval(ele.timer);
            var times = 0;
            var interval = 10;
            var oChange = {};
            var oBegin = {};
            var flag = 0;
            for (var attr in obj) {
                var begin = getCss(ele, attr);
                var change = obj[attr] - begin;
                if (change) {/!*------------*!/
                    oBegin[attr] = begin;
                    oChange[attr] = change;
                    flag++;
                }
            }
            if (flag == 0)return;
            function step() {
                times += interval;
                if (times < duration) {
                    for (var attr in oChange) {
                        tween.Expo.easeInOut();
                        var value = fnEffect(times, oBegin[attr], oChange[attr], duration);
                        setCss(ele, attr, value);
                    }
                } else {
                    for (var attr in oChange) {
                        setCss(ele, attr, obj[attr]);
                    }
                    window.clearInterval(ele.timer);
                    ele.timer = null;
                    if (typeof callback == "function") {
                        callback.call(ele);
                    }
                }
            }

            ele.timer = window.setInterval(step, interval);
        }

        function getCss(ele, attr) {
            if (window.getComputedStyle) {
                return parseFloat(getComputedStyle(ele)[attr]);
                /!*去单位*!/
            } else {//ie
                if (attr == "opacity") {
                    var value = ele.currentStyle[attr];
                    value = value.replace(/ +/g, "");
                    var reg = /alpha\(opacity=(\d+(\.\d+)?)\)/;
                    if (reg.test(value)) {
                        return RegExp.$1 / 100;
                    } else {
                        return 1;
                    }
                } else {
                    return parseFloat(ele.currentStyle[attr]);
                }
            }
        }

        function setCss(ele, attr, value) {
            if (attr == "opacity") {
                ele.style[attr] = value;
                ele.style.filter = "alpha(opacity=" + value * 100 + ")";
            } else {
                ele.style[attr] = value + "px";
            }
        }*/

        var div = photoArea.getElementsByTagName("div")[0].cloneNode(true);
        photoArea.appendChild(div);
        photoArea.style.width = photoArea.offsetWidth + div.offsetWidth + "px";
        var step = 0;
        function autoMove() {
            step++;
            if (step == 15) {
                photoArea.style.left = 0;
                step = 1;
            }
            if (step % 7 == 0)rightClick();
            if (step == 14) {
                changeColor(0);
            } else {
                changeColor(step);
            }
            animate(photoArea, {left: -photoWidth * step}, 0, 1);
        }

        var autoTimer = window.setInterval(autoMove, 3000);

        function changeColor(n) {
            var oSpan1 = DOM.getByClassName("viweb_t")[0];
            var oSpan2 = DOM.getByClassName("viweb_b")[0];
            for (var i = 0; i < btnLis.length; i++) {
                var oIs = DOM.children(DOM.children(btnLis[i], "a")[0], "i")[0];
                oIs.style.display = "none";
                var oAs = DOM.children(btnLis[i], "a")[0];
                DOM.setCss(oAs, "opacity", "1");
                //改变左侧文字
                oSpan1.innerHTML = DOM.children(oAs, "span")[0].innerHTML;
                oSpan2.innerHTML = DOM.children(oAs, "span")[1].innerHTML;
            }
            var oIsN = DOM.children(DOM.children(btnLis[n], "a")[0], "i")[0];
            oIsN.style.display = "block";
            var oAsN = DOM.children(btnLis[n], "a")[0];
            DOM.setCss(oAsN, "opacity", "1");
            oSpan1.innerHTML = DOM.children(DOM.children(btnLis[n], "a")[0], "span")[0].innerHTML;
            oSpan2.innerHTML = DOM.children(DOM.children(btnLis[n], "a")[0], "span")[1].innerHTML;
        }
    }

    /*window.onscroll=function () {
        //返回顶部代码
        if((document.documentElement.scrollTop||document.body.scrollTop)>0){
            var backTop=document.getElementById("backTop");
            backTop.style.display="block";
            backTop.onclick=function () {
                document.body.scrollTop=0;
                this.style.display="none";
            }
        }
    }*/
    /**
     * 滑动门
     * @param doorUl 滑动门ul区域
     */

    doorMove(DOM.getByClassName("door")[0]);
    doorMove(DOM.getByClassName("door")[1]);
    doorMove(DOM.getByClassName("door")[2]);
    function doorMove(doorUl) {
        var doorLis = doorUl.getElementsByTagName("li");
        TOOLS.each(doorLis, function (val, index) {
            if (index == 4) {
                index = 3;
            }
            val.index = index;
            on(val, "mousemove", function () {
                //console.log(val.index * 248);
                animate(doorUl, {"left": -val.index * 248}, 1000);
                var span = DOM.children(this, "span")[0];
                animate(span, {"width": 744}, 1000);
                animate(this, {"width": 992}, 1000);
            });
            on(val, "mouseout", function () {
                animate(doorUl, {"left": 0}, 1000);
                var span = DOM.children(this, "span")[0];
                animate(span, {"width": 0}, 1000);
                animate(this, {"width": 248}, 1000);
            })
        })
    }

})();

