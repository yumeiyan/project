/**
 * Created by 刘绍振 on 2016/4/16.
 */
(function (global, undefined) {
    var namespace={};//定义命名空间
    //$.noConflict();//jquery中解决冲突的方法
    var defaultOptions = {//默认的参数列表
        url: "",//ajax请求的路径
        data: "",//往服务器发送的数据
        type: "",//使用什么方法
        async: true,//ajax请求方式同步还是异步，默认为true异步
        success: function (data) {//成功时执行的函数
        },
        error: function (errInfo) {//失败是执行的函数
        },
        header: {},//自定义请求首部列表
        overrideMimeType: "",//重写响应的的mimeType
        catch: false,//走不走缓存
        timeout: 0,//超时毫秒数，默认为0的时候表示不执行超时逻辑
        processData: true,//post方法的时候，判断是否格式化参数uri string
        contentType: "application/x-www-form-urlencoded",//请求的mime类型，默认为表单提交mime类型
        dataType:"text"//返回的数据格式text或者json，默认是text
    };
    /**
     * CORE
     * @param options 用户输入的参数
     * @throw TypeError
     */
    var ajax = function (options) {
        if(!tool.isObject(options)){//判断参数是不是一个对象，如果不是则抛出类型错误
            throw new TypeError("参数类型错误");
        }
        var userOptions=tool.extend(defaultOptions,options);//合并用户输入的参数列表和默认的参数列表，返回一个全新的参数列表对象
        var xhr=tool.getXHR();//获取ajax对象
        //1、如果是get，就把data拼到url后边。
        if(/^(get|delete|head)$/igm.test(userOptions.type)){
            var data=tool.encodeToURIString(userOptions.data);
            userOptions.url=tool.hasSearch(userOptions.url,data);
            userOptions.data=null;//因为data是往服务器发送的数据，而get系不需要传参，为配合 xhr.send(userOptions.data)，所以要设置null;
        }
        //2、看是否走缓存，如果不走缓存，则在url后边加一个随机数来防止缓存。
        if(userOptions.catch===false){
            var random="_="+(Math.random()*0xffffff).toFixed(0);//因为search是有固定格式的(key=value),如果只写value是不合法的，所以必须要写一个key，而且这个key不能和已有的key重复，所以用_当作key
            tool.hasSearch(userOptions.url,random);
        }
        xhr.open(userOptions.type,userOptions.url,userOptions.async);
        //3、设置自定义请求首部信息
        if(userOptions.header&&tool.isObject(userOptions.header)){
            tool.eachObject(userOptions.header,function(key,value){
                xhr.setRequestHeader(key,value);
            })
        }
        //4、设置重写的mime类型，设置响应的mimeType
        if(tool.isString(userOptions.overrideMimeType)){
            xhr.overrideMimeType(userOptions.overrideMimeType);
        }
        //5、设置超时，0不设置超时
        if(tool.isNumber(userOptions.timeout)&&userOptions.timeout>0){
            xhr.timeout=userOptions.timeout;
            if("ontimeout" in xhr){
                xhr.ontimeout=function(){
                    userOptions.error("timeout");
                }
            }else{
                window.setTimeout(function(){
                    if(xhr.readyState!=4){
                        xhr.abort();//强制终止
                    }
                },xhr.timeout);
            }
        }
        //6、判断是否需要处理数据，即processData是否为true。当给服务器发送的数据为二进制或者formData的时候，不需要处理这个数据，要把processData设置为false
        if(/^(post|put)$/img.test(userOptions.type)&&userOptions.processData===true){
            userOptions.processData=tool.encodeToURIString(userOptions.data);
        }
        //7、contentType设置请求的mime类型，即设置content-type。http用来表现mimeType的字段就是content-type
        if(userOptions.contentType&&tool.isString(userOptions.contentType)){
            xhr.setRequestHeader("content-type",userOptions.contentType);
        }
        xhr.onreadystatechange=function(){
            if(xhr.readyState==4){//http的事务是否完成
                if(/^2\d{2}$/.test(xhr.status)){//判断响应是否成功
                    var responseText=xhr.responseText;
                    //8、处理dataType
                    if(userOptions.dataType==="json"){//判断是否需要把响应主体格式化为json对象
                        //因为不合法的json字符串无法转换为json对象，会出异常,所以加try catch
                        try{
                            responseText=tool.JSONParse(responseText);
                        }catch (e){
                            userOptions.error(e);
                            return;
                        }
                        userOptions.success(responseText);
                    }
                }else if(/^(4|5)\d{2}$/.test(xhr.status)){//响应失败
                    userOptions.error(xhr.status);
                }
            }
        };
        xhr.send(userOptions.data);
    };
    /**
     * 利用闭包实现获取数据类型
     * @param type  数据类型
     * @returns {Function}
     */
    var getType=function(type){
      return function (obj){
          return Object.prototype.toString.call(obj)==="[object "+type+"]";
      }
    };
    var tool = {
        /**
         * 获得ajax对象
         */
        getXHR: (function () {
            var list = [function () {
                return new XMLHttpRequest();
            }, function () {
                return new ActiveXObject("Microsoft.XMLHTTP");
            }, function () {
                return new ActiveXObject("Msxml2.XMLHTTP");
            }, function () {
                return new ActiveXObject("Msxml3.XMLHTTP");
            }];
            var xhr = null;
            var len = list.length;
            while (len--) {
                try {
                    list[len]();
                    xhr = list[len];
                    break;
                } catch (e) {
                    continue;
                }
            }
            if (xhr != null) {
                return xhr;
            }
            throw new Error("当前浏览器不支持ajax");
        })(),
        /**
         * 合并多个对象,对象值以后一个为准  例如 extent({a:1},{b:2,c:3}{d:4})
         * @returns {{}}  合并后的对象
         */
        extend: function () {
            var params = [].slice.call(arguments, 0);//因为参数长度不固定，所以把参数列表转成数组
            var voidObj = {};
            this.each(params,function(item){//item为数组中每个对象中的每个参数
                tool.eachObject(item,function(key,value){
                   voidObj[key]=value;
                });
            });
            return voidObj;
        },
        /**
         * 循环帮助函数
         * @param list 循环的集合
         * @param callback 回调函数
         * @param context 上下文
         */
        each: (function () {//利用惰性函数
            if ([].forEach) {
                return function (list, callback, context) {
                    [].forEach.call(list, callback, context);
                };
            }
            return function (list, callback, context) {
                for (var i = 0, l = list.length; i < l; i++) {
                    callback.call(context, list[i], i, list);
                }
            }
        })(),
        /**
         * 循环对象
         * @param obj 要循环的对象
         * @param callback 回调函数
         * @param context Object|undefined 回调函数里的上下文对象
         */
        eachObject:function(obj,callback,context){
            for(var n in obj){
                if(!obj.hasOwnProperty(n))continue;
                callback.call(context,n,obj[n]);
            }
        },
        /**
         * 在tool里添加判断数据类型的方法
         */
        init:function(){
            this.each(["Object","Function","String","Number","RegExp"],function(item){
                tool["is"+item]=getType(item);
            })
        },
        /**
         * 对象格式化为uri string
         * @param data 对象
         * @returns {*} uri string
         */
        encodeToURIString:function(data){
            if(this.isString(data))return data;
            if(this.isObject(data))return "";
            var arr=[];
            this.eachObject(data,function(key,value){
                arr.push(encodeURIComponent(key)+"="+encodeURIComponent(value));
            });
            return arr.join("&");
        },
        /**
         * 向url后边拼接参数
         * @param url  地址
         * @param padString  要拼接的参数
         * @returns 拼接之后的url
         */
        hasSearch:function(url,padString){
            if(!padString)return url;//如果padString为空，则直接返回url
            /*if(/\?/.test(url)){//如果有问号，说明url里已经有参数了，因为参数和参数直接用&来分割
                return url+"&"+padString;
            }else{
                return url+"?"+padString;
            }*/
            return url+(/\?/.test(url)?"$":"?")+padString;
        },
        /**
         * 字符串格式化为json对象
         * @param jsonString  json格式的字符串
         * @returns Object  JSON对象
         */
        JSONParse:function(jsonString){
            if(window.JSON){
                return JSON.parse(jsonString);
            }
            return eval("("+jsonString+")");
        }
    };
    tool.init();
    namespace.ajax=ajax;//把ajax方法放到命名空间中

    //封装get和post方法
    tool.each(["get","post"],function(item){
        /**
         * 动态添加get和post方法
         * @param url  请求的url
         * @param data  往服务器发送数据
         * @param callback  成功的回调函数
         * @param dataType  数据格式
         */
        namespace[item]=function(url,data,callback,dataType){
            ajax({
                url:url,
                type:item,
                data:data,
                success:callback,
                dataType:dataType
            });
        }
    });
    var globalX=global.x;
    /**
     * 判断当前全局下有没有x这个变量
     * @param symbol  string|undefined 更改的全局变量名
     * @returns Object
     */
    namespace.noConflict=function(symbol){
        if(symbol&&tool.isString(symbol)){
            window[symbol]=namespace;
        }
        window.x=globalX;
        return namespace;
    };
    global.x=namespace;//暴露到全局环境中
})(this);
