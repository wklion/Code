/**
 * ajax request
 *
 * @exports request
 *
 * @requires jQuery
 * @requires Promise
 *
 * @author rexer
 */
~ function(jQuery) {

  /**
   * 发起ajax请求
   * wrapper of jQuery.ajax
   *
   * @param {String} method 请求类型
   * @param {String} url 请求地址
   * @param {*} [data] 请求参数
   * @param {*} [option] jQuery.ajax设置参数
   * @returns {Promise}
   * @throws Error if invalid
   * @throws Promise.&lt;Error&gt; if fail, catch by <code>Promise.catch</code>
   * @see request.Method
   *
   */
  function request(method, url) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var option = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    validMethod(method);
    var options = Object.assign({
      paramize: true // 默认处理参数
    }, option, {
      url: url,
      method: method,
      success: null,
      error: null
    });

    // 参数处理
    options.data = options.paramize ? request.paramize(data) : data;

    // 移除多余字段
    delete options.paramize;

    return new Promise(function(resolve, reject) {
      jQuery.ajax(options).then(resolve, reject);
    });
  }

  /**
   * 同步请求
   *
   * @param {String} method 请求类型
   * @param {String} url 请求地址
   * @param {*} [data] 请求参数
   * @param {*} [option] jQuery.ajax设置参数
   * @returns {*|null} 请求结果 注意：请求失败也返回null
   * @throws Error if invalid
   */
  request.sync = function(method, url) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var option = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    validMethod(method);

    var result = null;

    var options = Object.assign({
      paramize: true // 默认处理参数
    }, option, {
      url: url,
      method: method,
      async: false,
      success: function success(res) {
        return result = res;
      },
      error: function error(_ref) {
        var status = _ref.status,
          statusText = _ref.statusText,
          responseText = _ref.responseText;
        return console.error('request on %o: status=%d,statusText=%o,response=%o', url, status, statusText, responseText);
      }
    });

    // 参数处理
    options.data = options.paramize ? request.paramize(data) : data;

    // 移除多余字段
    delete options.paramize;

    jQuery.ajax(options);

    return result;
  };

  /**
   * Ping
   *
   * @param {String} url
   * @param {Number} [timeout]
   * @returns {Boolean}
   */
  request.ping = function(url) {
    var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3000;

    var result = false;

    // 绝对地址
    if (!/^(https?:)?\/\//.test(url)) {
      throw new Error('protocol: //, http:// or https://');
    }

    jQuery.ajax({
      url: url,
      async: false,
      method: request.Method.HEAD,
      timeout: timeout,
      success: function success() {
        return result = true;
      },
      error: function error(_ref2) {
        var status = _ref2.status;
        return result = status === 0 || status === 200;
      }
    });

    return result;
  };

  /**
   * post请求
   *
   * @param args 展开依次为<code>url, data, option</code>。 具体见{@link request}参数，<code>method='POST'</code> 其余参数一致
   * @returns {Promise}
   * @throws Promise.&lt;Error&gt
   * @see request
   */
  request.post = function() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return request.apply(undefined, [request.Method.POST].concat(args));
  };

  /**
   * get请求
   *
   * @param args 展开依次为<code>url, data, option</code>。 具体见{@link request}参数，<code>method='GET'</code> 其余参数一致
   * @returns {Promise}
   * @throws Promise.&lt;Error&gt
   * @see request
   */
  request.get = function() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return request.apply(undefined, [request.Method.GET].concat(args));
  };

  /**
   * 参数化
   * 添加`para`包裹参数字符串
   *
   * @param {*} [para]
   * @returns
   */
  request.paramize = function() {
    var para = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (para != null) return {
      para: JSON.stringify(para)
    };
  };

  /**
   * 验证请求方法
   *
   * @param method
   * @returns {boolean}
   * @throws Error if invalid
   * @private
   */
  function validMethod(method) {
    if (!Object.keys(request.Method).includes(method.toUpperCase())) throw new Error('Invalid method: ' + method);
    return true;
  }

  /**
   * 请求方法枚举
   *
   * @type {{DELETE: string, HEAD: string, GET: string, OPTIONS: string, POST: string, PUT: string, TRACE: string}}
   * @enum {String}
   */
  request.Method = {
    DELETE: 'DELETE',
    HEAD: 'HEAD',
    GET: 'GET',
    OPTIONS: 'OPTIONS',
    POST: 'POST',
    PUT: 'PUT',
    TRACE: 'TRACE'
  };

  /**
   * MediaType枚举
   *
   * @type {{WILDCARD: string, TEXT_PLAIN: string, TEXT_XML: string, TEXT_HTML: string, JSON: string, XML: string,
   *   FORM_URLENCODED: string, MULTIPART_FORM_DATA: string, OCTET_STREAM: string}}
   * @enum {String}
   */
  request.MediaType = {
    WILDCARD: '*/*',
    TEXT_PLAIN: 'text/plain',
    TEXT_XML: 'text/xml',
    TEXT_HTML: 'text/html',
    JSON: 'application/json',
    XML: 'application/xml',
    FORM_URLENCODED: 'application/x-www-form-urlencoded',
    MULTIPART_FORM_DATA: 'multipart/form-data',
    OCTET_STREAM: 'application/octet-stream'
  };

  /**
   * 验证非空数组
   *
   * @param {*} any
   * @returns {Boolean}
   * @deprecated
   */
  request.isPretty = function(any) {
    return Array.isArray(any) && any.length > 0;
  };

  // exports
  window.request = request;
}(jQuery);
