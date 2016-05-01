var TOOLS = {
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
    JSONParse: (function (jsonString) {
        if (window.JSON) {
           return function (){
               return JSON.parse(jsonString);
           }
        }
        return function (){
            return eval("(" + jsonString + ")");
        }
    })(),
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
};