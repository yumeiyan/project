/**
 * 把一系列的jsonp操作封装到一起
 */
(function () {
    // 先定义一个明明空间
    var namespace = {};
    // 向外暴露的全局函数名
    var globalName = 'x';
    /**
     * jsonp操作
     * @param {string} url 请求jsonp接口
     * @param {*} data 发送的参数
     * @param {string} jsonpcallback 只是一个笼统的名称，表示server定义好的参数名
     * @param {Function} callback 回调函数
     */
    var jsonp = function (url, data, jsonpcallback, callback) {
        // 定义回调函数名称 函数名是累加的 第一次 cb1 第二次 cb2
        // 一直累加是为了防止缓存
        var cbName = 'cb' + jsonp.count++;
        // 定义全局函数名 因为jsonp必须需要一个全局函数名
        var callbackName = 'windowxjsonp' + cbName;
        // 定义全局函数体
        window.x.jsonp[cbName] = function (data) {
            try {
                callback(data);
            } finally {
                // 为什么把script删掉，没有删掉数据嘞？
                // 答：因为script只负责获取js数据。获取完成之后，script标签就没有任何用处。
                // 获取过来的数据和script也没有了半毛钱关系。所以删掉script不会对数据构成任何影响
                // script只是负责获取数据，不负责保存数据。
                script.parentNode.removeChild(script);
                delete window.x.jsonp[cbName];
            }
        };
        // 因为jsonp的原理就是通过script标签去请求server的
        var script = document.createElement('script');
        // 如果有参数，把参数格式化为uri string
        if (data) {
            data = tool.encodeToURIString(data);
        }
        // jsonpcallback是否为字符串，把jsonpcallback和已经定义好的全局函数名拼接到一起
        if (typeof jsonpcallback === 'string') {
            //把func和server定义好的参数名(val)一起拼接到url的后 http://localhost:8080?val=func
            var canshu = jsonpcallback + '=' + callbackName;
        }
        // 拼接参数
        url = tool.hasSearch(url, data);
        // 拼接jsonpcallback和已经定义好的全局函数名
        url = tool.hasSearch(url, canshu);
        // 把最终得到的完整的url 赋值到script标签的src属性上
        script.src = url;
        // 把script标签添加到body上，这样script才会去请求自己的src。
        document.body.appendChild(script);
    };
    jsonp.count = 0;
    namespace.jsonp = jsonp;
    // 暴露到全局变量上 x
    this[globalName] = namespace;
    var tool = {
        encodeToURIString: function (data) {
            if (!data) return '';
            if (typeof data === 'string') return data;
            var arr = [];
            for (var n in data) {
                if (!data.hasOwnProperty(n)) continue;
                arr.push(encodeURIComponent(n) + '=' + encodeURIComponent(data[n]));
            }
            return arr.join('&');
        },
        hasSearch: function (url, padString) {
            if (!padString) return url;
            if (typeof padString !== 'string') return url;
            return url + (/\?/.test(url) ? '&' : '?') + padString;
        }
    }
})();
//window.x.jsonp('HTTP://XXX',{},CALLABCK,FUNCTION(){}));