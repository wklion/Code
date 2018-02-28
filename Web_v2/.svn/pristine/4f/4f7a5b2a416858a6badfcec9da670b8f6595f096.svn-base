/**
 * 工具类
 * @author rexer
 * @date   2017-01-11
 */

var T = Object.create(null);

~ function($) {

    ///////////
    // const //
    ///////////

    /**
     * 地址
     */
    T.HOST = window.location.protocol + '//' + window.location.host + '/';

    /**
     * 站点
     */
    T.CTX = T.HOST + '/gdyb_test/';

    /**
     * 本地服务地址
     * @param  {String}   serve       服务名
     * @param  {String}   [service]     接口名
     * @param  {String}   [action]      接口方法
     * @param  {Boolean}  [hasServe]  是否追加'services/', 默认true
     * @param  {String}   [port]      端口 默认host.port
     * @return {String}   url
     */
    T.url = function(serve, service, action, hasServe, port) {
        var me = T.url;
        var url = me._host_ + ':' + (port || me._port_) + '/' + serve +
            (hasServe === false ? '' : '/services') + '/' +
            (service ? (service + '/') : '') + (action || '');
        return url;
    };

    T.url._host_ = window.location.protocol + '//' + window.location.hostname;
    T.url._port_ = window.location.port || 80;

    /////////////
    // request //
    /////////////

    /**
     * 同步post请求
     */
    T.postSync = function(url, para, opt) {
        return T.ajaxSync(url, para, $.extend(opt, {
            type: 'POST'
        }));
    };

    /**
     * 同步get请求
     */
    T.getSync = function(url, para, opt) {
        return T.ajaxSync(url, para, $.extend(opt, {
            type: 'GET'
        }));
    };

    /**
     * 同步请求
     */
    T.ajaxSync = function(url, para, opt) {
        var result;
        $.ajax($.extend(true, {
            data: T.paramize(para),
            timeout: 30000
        }, opt, {
            url: url,
            async: false,
            success: function(data) {
                result = data;
            },
            error: function() {
                result = null;
            }
        }));
        return result;
    };

    /**
     * 参数化
     */
    T.paramize = function(para) {
        return para ? {
            para: JSON.stringify(para)
        } : '';
    };

    /**
     * 多请求延时处理
     * @author rexer
     * @date   2016-11-02
     * @class
     */
    T.DeferredQuery = function() {
        /**
         * 请求队列
         * @type {Array}
         */
        var XHRS = [];

        /**
         * 清空请求队列
         */
        this.clearQuery = function() {
            XHRS = [];
            return this;
        };
        /**
         * 添加请求
         * @param  {String}   url  地址
         * @param  {Object}   para 参数
         * @param  {String}   [jqAjaxType] jQuery AJAX方法名(ajax,post,get,getJSON...)，默认为post
         * @tips 若需要设置`ajax参数`时: jqAjaxType='ajax'，para为`ajax参数`而非send data
         */
        this.addQuery = function(url, para, jqAjaxType) {
            jqAjaxType = jqAjaxType || 'post';
            var request = $[jqAjaxType](url, para); //jqAjaxType === 'ajax' ? para : T.paramize(para)
            XHRS.push(request);
            return this;
        };

        /**
         * 请求
         * @param  {Function}   success 成功
         * @return {Deferred}
         * @tips 请求队列为空,返回false, 否则返回Deferred对象;
         *       请求队列长度 = 1, callback(success)参数为jQuery正常参数(data, textStatus, jqXHR);
         *       请求队列长度 > 1, callback(success)参数为依次按序的请求结果(data1, data2, data3, ...)
         */
        this.query = function(success) {
            var reqSize = XHRS.length;
            if (reqSize === 0) return false;
            return $.when.apply($, XHRS).done(function() {
                // 取出数据
                var data = [];
                var results = Array.prototype.slice.call(arguments);
                if (reqSize === 1) {
                    data = results;
                } else {
                    results.forEach(function(item) {
                        data.push(item[0]);
                    });
                }
                success.apply(this, data);
            }).fail(function() {
                $.each(XHRS, function() {
                    this.abort();
                });
            });
        };
    };


    //////////
    // util //
    //////////

    T.firstKey = function(obj) {
        for (var key in obj) return key;
    };

    T.firstVal = function(obj) {
        for (var key in obj) return obj[key];
    };

    /**
     * 下载/导出数据
     * @author rexer
     * @date   2016-07-22
     * @param  {Blob}     blob     [description]
     * @param  {String}   filename [description]
     * @return {[type]}            [description]
     */
    T.download = function(blob, filename) {
        if (navigator.msSaveOrOpenBlob) { //IE
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            var URL = (window.URL || window.webkitURL);
            var url = URL.createObjectURL(blob);
            T.downloading(url, filename);
            setTimeout(function() {
                URL.revokeObjectURL(url);
            }, 100);
        }
    };
    // a标签下载文件
    T.downloading = function(url, filename) {
        var a = document.createElement('a');
        a.style.display = 'none';
        a.setAttribute('href', url);
        a.setAttribute('download', filename);
        document.body.appendChild(a);
        a.dispatchEvent(new MouseEvent('click'));
        document.body.removeChild(a);
    };
    /**
     * 检验函数
     * @param  {[type]}   any [description]
     * @return {Boolean}      [description]
     */
    T.isFunction = function(any) {
        return typeof any === 'function';
    };

    /**
     * 检验数组
     * @param  {[type]}   any [description]
     * @return {Boolean}      [description]
     */
    T.isArray = function(any) {
        return Array.isArray ? Array.isArray(any) : Object.prototype.toString.call(any) === '[object Array]';
    };

    /**
     * 检验非空数组
     * @param  {[type]}   any [description]
     * @return {Boolean}      [description]
     */
    T.isPretty = function(any) {
        return T.isArray(any) && any.length > 0;
    };

    /////////
    // DOM //
    /////////

    /**
     * DOM相关
     */
    T.DOM = {
        /**
         * 获取可视区域大小
         */
        getViewport: function() {
            return {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            };
        }
    };

}(jQuery)
