// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"hRTX":[function(require,module,exports) {
'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

},{}],"yQtW":[function(require,module,exports) {
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],"Feqj":[function(require,module,exports) {
'use strict';

var bind = require('./helpers/bind');
var isBuffer = require('is-buffer');

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};

},{"./helpers/bind":"hRTX","is-buffer":"yQtW"}],"njyv":[function(require,module,exports) {
'use strict';

var utils = require('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

},{"../utils":"Feqj"}],"Lpyz":[function(require,module,exports) {
'use strict';

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};

},{}],"NZT3":[function(require,module,exports) {
'use strict';

var enhanceError = require('./enhanceError');

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

},{"./enhanceError":"Lpyz"}],"Ztkp":[function(require,module,exports) {
'use strict';

var createError = require('./createError');

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

},{"./createError":"NZT3"}],"phS/":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

},{"./../utils":"Feqj"}],"Zn5P":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

},{"./../utils":"Feqj"}],"Rpqp":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);

},{"./../utils":"Feqj"}],"XHRg":[function(require,module,exports) {
'use strict';

// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;

},{}],"M+LC":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);

},{"./../utils":"Feqj"}],"akUF":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

var settle = require('./../core/settle');

var buildURL = require('./../helpers/buildURL');

var parseHeaders = require('./../helpers/parseHeaders');

var isURLSameOrigin = require('./../helpers/isURLSameOrigin');

var createError = require('../core/createError');

var btoa = typeof window !== 'undefined' && window.btoa && window.btoa.bind(window) || require('./../helpers/btoa');

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false; // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.

    if ("production" !== 'test' && typeof window !== 'undefined' && window.XDomainRequest && !('withCredentials' in request) && !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;

      request.onprogress = function handleProgress() {};

      request.ontimeout = function handleTimeout() {};
    } // HTTP basic authentication


    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true); // Set the request timeout in MS

    request.timeout = config.timeout; // Listen for ready state

    request[loadEvent] = function handleLoad() {
      if (!request || request.readyState !== 4 && !xDomain) {
        return;
      } // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request


      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      } // Prepare the response


      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };
      settle(resolve, reject, response); // Clean up request

      request = null;
    }; // Handle low level network errors


    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request)); // Clean up request

      request = null;
    }; // Handle timeout


    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED', request)); // Clean up request

      request = null;
    }; // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.


    if (utils.isStandardBrowserEnv()) {
      var cookies = require('./../helpers/cookies'); // Add xsrf header


      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    } // Add headers to the request


    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    } // Add withCredentials to request if needed


    if (config.withCredentials) {
      request.withCredentials = true;
    } // Add responseType to request if needed


    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    } // Handle progress if needed


    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    } // Not all browsers support upload events


    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel); // Clean up request

        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    } // Send the request


    request.send(requestData);
  });
};
},{"./../utils":"Feqj","./../core/settle":"Ztkp","./../helpers/buildURL":"phS/","./../helpers/parseHeaders":"Zn5P","./../helpers/isURLSameOrigin":"Rpqp","../core/createError":"NZT3","./../helpers/btoa":"XHRg","./../helpers/cookies":"M+LC"}],"yK1t":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"A14q":[function(require,module,exports) {
var process = require("process");
'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

},{"./utils":"Feqj","./helpers/normalizeHeaderName":"njyv","./adapters/xhr":"akUF","./adapters/http":"akUF","process":"yK1t"}],"xpeW":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

},{"./../utils":"Feqj"}],"IAOH":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

},{"./../utils":"Feqj"}],"mXc0":[function(require,module,exports) {
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],"R56a":[function(require,module,exports) {
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

},{}],"uRyQ":[function(require,module,exports) {
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

},{}],"6H+A":[function(require,module,exports) {
'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');
var isAbsoluteURL = require('./../helpers/isAbsoluteURL');
var combineURLs = require('./../helpers/combineURLs');

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

},{"./../utils":"Feqj","./transformData":"IAOH","../cancel/isCancel":"mXc0","../defaults":"A14q","./../helpers/isAbsoluteURL":"R56a","./../helpers/combineURLs":"uRyQ"}],"2trU":[function(require,module,exports) {
'use strict';

var defaults = require('./../defaults');
var utils = require('./../utils');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, {method: 'get'}, this.defaults, config);
  config.method = config.method.toLowerCase();

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

},{"./../defaults":"A14q","./../utils":"Feqj","./InterceptorManager":"xpeW","./dispatchRequest":"6H+A"}],"qFUg":[function(require,module,exports) {
'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

},{}],"VgQU":[function(require,module,exports) {
'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

},{"./Cancel":"qFUg"}],"4yis":[function(require,module,exports) {
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

},{}],"Wzmt":[function(require,module,exports) {
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

},{"./utils":"Feqj","./helpers/bind":"hRTX","./core/Axios":"2trU","./defaults":"A14q","./cancel/Cancel":"qFUg","./cancel/CancelToken":"VgQU","./cancel/isCancel":"mXc0","./helpers/spread":"4yis"}],"O4Aa":[function(require,module,exports) {
module.exports = require('./lib/axios');
},{"./lib/axios":"Wzmt"}],"YsI0":[function(require,module,exports) {
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  for (var i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],"3TAr":[function(require,module,exports) {
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],"cnf2":[function(require,module,exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"WXKZ":[function(require,module,exports) {

var global = arguments[3];
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

},{"base64-js":"YsI0","ieee754":"3TAr","isarray":"cnf2","buffer":"WXKZ"}],"ysax":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

exports.__esModule = true;

var axios_1 = require("axios");

var CONST_PKG3_XML_ROOT = 'hfs_manifest';

var CONST_READ_SIZE = function () {
  var min = Math.ceil(50);
  var max = Math.floor(100);
  var rand = Math.floor(Math.random() * (max - min + 1)) + min;
  return rand * 0x100000;
}();

var CONST_READ_AHEAD_SIZE = 128 * 0x400;
var CONST_USER_AGENT_PS3 = "Mozilla/5.0 (PLAYSTATION 3; 4.84)"; // const CONST_USER_AGENT_PSP = ""

var CONST_USER_AGENT_PSV = " libhttp/3.70 (PS Vita)";
var CONST_USER_AGENT_PS4 = "Download/1.00 libhttp/6.50 (PlayStation 4)";

var PkgReader =
/** @class */
function () {
  function PkgReader(url, baseUrl) {
    this.parts = [];
    this.baseUrl = baseUrl || '';
    this.source = new URL(this.baseUrl + url);
    this.pkgName = 'UNKNOWN';
    this.size = 0;
    this.multipart = false;
    this.partsCount = 0;
    this.buffer = Buffer.from([]);
    this.bufferSize = 0;
    this.headers = {}; // if (this.source.href.endsWith('.xml')) {
    //   this.setupXml()
    // } else if (this.source.href.endsWith('.json')) {
    //   console.error(".json URLs aren't implemented")
    // } else {
    //   if (this.source.href.startsWith('http:') || this.source.href.startsWith('http:')) {
    //     this.setupPkg()
    //   }
  }

  PkgReader.prototype.open = function (filePart) {
    return __awaiter(this, void 0, void 0, function () {
      var partSize, response;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (filePart.request) {
              return [2
              /*return*/
              ];
            }

            partSize = null;
            if (!(filePart.url.href.startsWith('http:') || filePart.url.href.startsWith('https:'))) return [3
            /*break*/
            , 2];
            filePart.request = axios_1["default"].create({
              headers: this.headers,
              responseType: 'arraybuffer'
            });
            return [4
            /*yield*/
            , filePart.request.head(filePart.url.href)];

          case 1:
            response = _a.sent();

            if (response.headers['content-length']) {
              partSize = response.headers['content-length'];
            } // Check file size


            if (partSize !== null) {
              if (filePart.size) {
                console.error("[INPUT] File size differs from meta data " + partSize + " <> " + filePart.size);
              } else {
                filePart.size = partSize;
                filePart.endOfs = Number(filePart.startOfs) + Number(filePart.size);
              }
            }

            _a.label = 2;

          case 2:
            return [2
            /*return*/
            ];
        }
      });
    });
  };

  PkgReader.prototype.read = function (offset, size) {
    return __awaiter(this, void 0, void 0, function () {
      var result, readOffset, readSize, readBufferSize, count, lastCount, filePart, fileOffset, readBufferSize, response;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            result = [];
            readOffset = offset;
            readSize = size;

            if (readSize < 0) {
              throw new Error('Negative read size');
            }

            if (this.buffer && this.bufferSize > readOffset && readSize > 0) {
              readBufferSize = readSize;

              if (readOffset + readBufferSize > this.bufferSize) {
                readBufferSize = this.bufferSize - readOffset;
              }

              result.push(this.buffer.slice(readOffset, readOffset + readBufferSize)); // result = Buffer.concat(result, this.buffer.slice(readOffset, readOffset + readBufferSize));
              // let b =
              // result.set(this.buffer.slice(readOffset, readOffset + readBufferSize), 0)
              // result.push() = result. (result, 0, 0, )

              readOffset += readBufferSize;
              readSize -= readBufferSize;
            }

            count = 0;
            lastCount = -1;
            _a.label = 1;

          case 1:
            if (!(readSize > 0)) return [3
            /*break*/
            , 4];

            while (count < this.partsCount && this.parts[count].startOfs <= readOffset) {
              count += 1;
            }

            count -= 1;

            if (lastCount === count) {
              throw new Error("[INPUT] Read offset " + readOffset + " out of range (max. " + (this.size - 1) + ")");
            }

            lastCount = count;
            filePart = this.parts[count];
            fileOffset = readOffset - filePart.startOfs;
            readBufferSize = readSize;

            if (readOffset + readBufferSize > filePart.endOfs) {
              readBufferSize = filePart.endOfs - readOffset;
            }

            return [4
            /*yield*/
            , this.open(filePart) // if (filePart.streamType === "requests") {
            //   const reqHeaders = {
            //     "Range": `bytes=${fileOffset}-${fileOffset + readBufferSize - 1}`,
            //   };
            // filePart.stream.create()
            ];

          case 2:
            _a.sent();

            return [4
            /*yield*/
            , filePart.request.get(filePart.url.href, {
              headers: {
                Range: "bytes=" + fileOffset + "-" + (fileOffset + readBufferSize - 1)
              },
              responseType: 'arraybuffer'
            })];

          case 3:
            response = _a.sent();
            result.push(Buffer.from(response.data)); // result =_.concat(result, response.data)
            // result. response.data, result.length)
            // result.push(response.data);
            // }

            readOffset += readBufferSize;
            readSize -= readBufferSize;
            return [3
            /*break*/
            , 1];

          case 4:
            // return result
            // return Buffer.from(result);
            return [2
            /*return*/
            , Buffer.concat(result) // return this.buffer.slice(offset, offset + this.bufferSize)
            ];
        }
      });
    });
  };

  PkgReader.prototype.close = function () {
    for (var filePart in this.parts) {
      // @ts-ignore
      if (!filePart.request) {
        continue;
      } // @ts-ignore


      filePart.request.close(); // delete filePart.stream
    }

    return;
  };

  PkgReader.prototype.getSize = function () {
    return this.size;
  };

  PkgReader.prototype.getSource = function () {
    return this.source;
  };

  PkgReader.prototype.getPkgName = function () {
    return this.pkgName;
  };

  PkgReader.prototype.getBuffer = function () {
    return Buffer.from(this.buffer);
  };

  PkgReader.prototype.setupPkg = function () {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        this.pkgName = this.source.pathname;
        this.multipart = false;
        this.partsCount = 1;
        this.parts.push({
          index: 0,
          startOfs: 0,
          url: this.source
        });
        this.open(this.parts[0]);
        return [2
        /*return*/
        ];
      });
    });
  };

  PkgReader.prototype.setupXml = function () {
    return __awaiter(this, void 0, void 0, function () {
      var inputStream, xmlRoot, xmlElement, dp, e_1, offset, _i, _a, el, index, size, startOfs;

      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            xmlRoot = null;
            xmlElement = null;
            if (!(this.source.href.startsWith('http:') || this.source.href.startsWith('https:'))) return [3
            /*break*/
            , 5];
            _b.label = 1;

          case 1:
            _b.trys.push([1, 3,, 4]);

            return [4
            /*yield*/
            , axios_1["default"].get(this.source.href, {
              headers: this.headers,
              responseType: 'text'
            }).then(function (resp) {
              return resp.data;
            })];

          case 2:
            inputStream = _b.sent();
            dp = new DOMParser().parseFromString(inputStream, 'application/xml');
            xmlRoot = dp.documentElement;
            return [3
            /*break*/
            , 4];

          case 3:
            e_1 = _b.sent();
            throw new Error("[INPUT] Could not open URL " + this.source.href);

          case 4:
            return [3
            /*break*/
            , 6];

          case 5:
            console.error("File paths aren't supported.");
            _b.label = 6;

          case 6:
            // let dp = new DOMParser().parseFromString(inputStream, 'application/xml')
            // xmlRoot = dp.documentElement
            // xmlRoot = inp
            // Check for known XML
            if (xmlRoot.tagName !== CONST_PKG3_XML_ROOT) {
              throw new Error("[INPUT] Not a known PKG XML file (" + xmlRoot.tagName + " <> " + CONST_PKG3_XML_ROOT + ")");
            } // Determine values from XML data


            xmlElement = xmlRoot.querySelector('file_name');

            if (xmlElement) {
              this.pkgName = xmlElement.textContent.toString();
            }

            xmlElement = xmlRoot.querySelector('file_size');

            if (xmlElement) {
              this.size = Number(xmlElement.textContent);
            }

            xmlElement = xmlRoot.querySelector('number_of_split_files');

            if (xmlElement) {
              this.partsCount = Number(xmlElement.textContent);

              if (this.partsCount > 1) {
                this.multipart = true;
              }
            }

            offset = 0;

            for (_i = 0, _a = xmlRoot.querySelectorAll('pieces'); _i < _a.length; _i++) {
              el = _a[_i];
              index = Number(el.getAttribute('index'));
              size = Number(el.getAttribute('file_size'));
              startOfs = offset;
              this.parts.push({
                index: index,
                size: size,
                startOfs: startOfs,
                endOfs: startOfs + size,
                url: new URL(this.baseUrl + el.getAttribute('url'))
              });
              offset += size;
            }

            return [2
            /*return*/
            ];
        }
      });
    });
  };

  PkgReader.prototype.setupJson = function () {
    return __awaiter(this, void 0, void 0, function () {
      var inputStream, jsonData, e_2, count, _i, _a, piece, filePart;

      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            inputStream = null;
            jsonData = null;
            if (!(this.source.href.startsWith('http:') || this.source.href.startsWith('https:'))) return [3
            /*break*/
            , 5];
            _b.label = 1;

          case 1:
            _b.trys.push([1, 3,, 4]);

            return [4
            /*yield*/
            , axios_1["default"].get(this.source.href, {
              headers: this.headers,
              responseType: 'json'
            }).then(function (resp) {
              return resp.data;
            })];

          case 2:
            inputStream = _b.sent();
            return [3
            /*break*/
            , 4];

          case 3:
            e_2 = _b.sent();
            throw new Error("[INPUT] Could not open URL " + this.source.href);

          case 4:
            jsonData = inputStream;
            return [3
            /*break*/
            , 6];

          case 5:
            console.error("File paths aren't supported.");
            _b.label = 6;

          case 6:
            // Check for known JSON
            if (!jsonData.pieces || !jsonData.pieces[0] || !jsonData.pieces[0].url) {
              throw new Error('[INPUT] JSON source does not look like PKG meta data (missing [pieces][0])');
            } // Determine values from JSON data


            if (jsonData.originalFileSize) this.size = jsonData.originalFileSize;

            if (jsonData.numberOfSplitFiles) {
              this.partsCount = jsonData.numberOfSplitFiles;

              if (this.partsCount > 1) {
                this.multipart = true;
              }
            } // Determine file parts from JSON data


            if (jsonData.pieces) {
              count = 0;

              for (_i = 0, _a = jsonData.pieces; _i < _a.length; _i++) {
                piece = _a[_i];
                filePart = {
                  url: new URL(this.baseUrl + piece.url),
                  index: 0,
                  startOfs: 0,
                  endOfs: 0,
                  size: 0
                };

                if (!this.pkgName) {
                  if (filePart.url.href.startsWith('http:') || filePart.url.href.startsWith('https:')) {
                    this.pkgName = filePart.url.pathname;
                  } else {
                    this.pkgName = filePart.url.pathname;
                  }

                  this.pkgName = this.pkgName.replace(/_[0-9]+\.pkg$/, '.pkg');
                }

                filePart.index = count;
                count += 1;
                filePart.startOfs = piece.fileOffset;
                filePart.size = piece.fileSize;
                filePart.endOfs = filePart.startOfs + filePart.size;
                this.parts.push(filePart);
              }
            }

            return [2
            /*return*/
            ];
        }
      });
    });
  };

  return PkgReader;
}();

exports.PkgReader = PkgReader;
},{"axios":"O4Aa","buffer":"WXKZ"}],"ilr3":[function(require,module,exports) {
var define;
/*! MIT License. Copyright 2015-2018 Richard Moore <me@ricmoo.com>. See LICENSE.txt. */
(function(root) {
    "use strict";

    function checkInt(value) {
        return (parseInt(value) === value);
    }

    function checkInts(arrayish) {
        if (!checkInt(arrayish.length)) { return false; }

        for (var i = 0; i < arrayish.length; i++) {
            if (!checkInt(arrayish[i]) || arrayish[i] < 0 || arrayish[i] > 255) {
                return false;
            }
        }

        return true;
    }

    function coerceArray(arg, copy) {

        // ArrayBuffer view
        if (arg.buffer && arg.name === 'Uint8Array') {

            if (copy) {
                if (arg.slice) {
                    arg = arg.slice();
                } else {
                    arg = Array.prototype.slice.call(arg);
                }
            }

            return arg;
        }

        // It's an array; check it is a valid representation of a byte
        if (Array.isArray(arg)) {
            if (!checkInts(arg)) {
                throw new Error('Array contains invalid value: ' + arg);
            }

            return new Uint8Array(arg);
        }

        // Something else, but behaves like an array (maybe a Buffer? Arguments?)
        if (checkInt(arg.length) && checkInts(arg)) {
            return new Uint8Array(arg);
        }

        throw new Error('unsupported array-like object');
    }

    function createArray(length) {
        return new Uint8Array(length);
    }

    function copyArray(sourceArray, targetArray, targetStart, sourceStart, sourceEnd) {
        if (sourceStart != null || sourceEnd != null) {
            if (sourceArray.slice) {
                sourceArray = sourceArray.slice(sourceStart, sourceEnd);
            } else {
                sourceArray = Array.prototype.slice.call(sourceArray, sourceStart, sourceEnd);
            }
        }
        targetArray.set(sourceArray, targetStart);
    }



    var convertUtf8 = (function() {
        function toBytes(text) {
            var result = [], i = 0;
            text = encodeURI(text);
            while (i < text.length) {
                var c = text.charCodeAt(i++);

                // if it is a % sign, encode the following 2 bytes as a hex value
                if (c === 37) {
                    result.push(parseInt(text.substr(i, 2), 16))
                    i += 2;

                // otherwise, just the actual byte
                } else {
                    result.push(c)
                }
            }

            return coerceArray(result);
        }

        function fromBytes(bytes) {
            var result = [], i = 0;

            while (i < bytes.length) {
                var c = bytes[i];

                if (c < 128) {
                    result.push(String.fromCharCode(c));
                    i++;
                } else if (c > 191 && c < 224) {
                    result.push(String.fromCharCode(((c & 0x1f) << 6) | (bytes[i + 1] & 0x3f)));
                    i += 2;
                } else {
                    result.push(String.fromCharCode(((c & 0x0f) << 12) | ((bytes[i + 1] & 0x3f) << 6) | (bytes[i + 2] & 0x3f)));
                    i += 3;
                }
            }

            return result.join('');
        }

        return {
            toBytes: toBytes,
            fromBytes: fromBytes,
        }
    })();

    var convertHex = (function() {
        function toBytes(text) {
            var result = [];
            for (var i = 0; i < text.length; i += 2) {
                result.push(parseInt(text.substr(i, 2), 16));
            }

            return result;
        }

        // http://ixti.net/development/javascript/2011/11/11/base64-encodedecode-of-utf8-in-browser-with-js.html
        var Hex = '0123456789abcdef';

        function fromBytes(bytes) {
                var result = [];
                for (var i = 0; i < bytes.length; i++) {
                    var v = bytes[i];
                    result.push(Hex[(v & 0xf0) >> 4] + Hex[v & 0x0f]);
                }
                return result.join('');
        }

        return {
            toBytes: toBytes,
            fromBytes: fromBytes,
        }
    })();


    // Number of rounds by keysize
    var numberOfRounds = {16: 10, 24: 12, 32: 14}

    // Round constant words
    var rcon = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91];

    // S-box and Inverse S-box (S is for Substitution)
    var S = [0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15, 0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75, 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf, 0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73, 0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08, 0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf, 0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16];
    var Si =[0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb, 0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb, 0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e, 0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25, 0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92, 0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84, 0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06, 0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b, 0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73, 0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e, 0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b, 0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4, 0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f, 0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef, 0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61, 0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d];

    // Transformations for encryption
    var T1 = [0xc66363a5, 0xf87c7c84, 0xee777799, 0xf67b7b8d, 0xfff2f20d, 0xd66b6bbd, 0xde6f6fb1, 0x91c5c554, 0x60303050, 0x02010103, 0xce6767a9, 0x562b2b7d, 0xe7fefe19, 0xb5d7d762, 0x4dababe6, 0xec76769a, 0x8fcaca45, 0x1f82829d, 0x89c9c940, 0xfa7d7d87, 0xeffafa15, 0xb25959eb, 0x8e4747c9, 0xfbf0f00b, 0x41adadec, 0xb3d4d467, 0x5fa2a2fd, 0x45afafea, 0x239c9cbf, 0x53a4a4f7, 0xe4727296, 0x9bc0c05b, 0x75b7b7c2, 0xe1fdfd1c, 0x3d9393ae, 0x4c26266a, 0x6c36365a, 0x7e3f3f41, 0xf5f7f702, 0x83cccc4f, 0x6834345c, 0x51a5a5f4, 0xd1e5e534, 0xf9f1f108, 0xe2717193, 0xabd8d873, 0x62313153, 0x2a15153f, 0x0804040c, 0x95c7c752, 0x46232365, 0x9dc3c35e, 0x30181828, 0x379696a1, 0x0a05050f, 0x2f9a9ab5, 0x0e070709, 0x24121236, 0x1b80809b, 0xdfe2e23d, 0xcdebeb26, 0x4e272769, 0x7fb2b2cd, 0xea75759f, 0x1209091b, 0x1d83839e, 0x582c2c74, 0x341a1a2e, 0x361b1b2d, 0xdc6e6eb2, 0xb45a5aee, 0x5ba0a0fb, 0xa45252f6, 0x763b3b4d, 0xb7d6d661, 0x7db3b3ce, 0x5229297b, 0xdde3e33e, 0x5e2f2f71, 0x13848497, 0xa65353f5, 0xb9d1d168, 0x00000000, 0xc1eded2c, 0x40202060, 0xe3fcfc1f, 0x79b1b1c8, 0xb65b5bed, 0xd46a6abe, 0x8dcbcb46, 0x67bebed9, 0x7239394b, 0x944a4ade, 0x984c4cd4, 0xb05858e8, 0x85cfcf4a, 0xbbd0d06b, 0xc5efef2a, 0x4faaaae5, 0xedfbfb16, 0x864343c5, 0x9a4d4dd7, 0x66333355, 0x11858594, 0x8a4545cf, 0xe9f9f910, 0x04020206, 0xfe7f7f81, 0xa05050f0, 0x783c3c44, 0x259f9fba, 0x4ba8a8e3, 0xa25151f3, 0x5da3a3fe, 0x804040c0, 0x058f8f8a, 0x3f9292ad, 0x219d9dbc, 0x70383848, 0xf1f5f504, 0x63bcbcdf, 0x77b6b6c1, 0xafdada75, 0x42212163, 0x20101030, 0xe5ffff1a, 0xfdf3f30e, 0xbfd2d26d, 0x81cdcd4c, 0x180c0c14, 0x26131335, 0xc3ecec2f, 0xbe5f5fe1, 0x359797a2, 0x884444cc, 0x2e171739, 0x93c4c457, 0x55a7a7f2, 0xfc7e7e82, 0x7a3d3d47, 0xc86464ac, 0xba5d5de7, 0x3219192b, 0xe6737395, 0xc06060a0, 0x19818198, 0x9e4f4fd1, 0xa3dcdc7f, 0x44222266, 0x542a2a7e, 0x3b9090ab, 0x0b888883, 0x8c4646ca, 0xc7eeee29, 0x6bb8b8d3, 0x2814143c, 0xa7dede79, 0xbc5e5ee2, 0x160b0b1d, 0xaddbdb76, 0xdbe0e03b, 0x64323256, 0x743a3a4e, 0x140a0a1e, 0x924949db, 0x0c06060a, 0x4824246c, 0xb85c5ce4, 0x9fc2c25d, 0xbdd3d36e, 0x43acacef, 0xc46262a6, 0x399191a8, 0x319595a4, 0xd3e4e437, 0xf279798b, 0xd5e7e732, 0x8bc8c843, 0x6e373759, 0xda6d6db7, 0x018d8d8c, 0xb1d5d564, 0x9c4e4ed2, 0x49a9a9e0, 0xd86c6cb4, 0xac5656fa, 0xf3f4f407, 0xcfeaea25, 0xca6565af, 0xf47a7a8e, 0x47aeaee9, 0x10080818, 0x6fbabad5, 0xf0787888, 0x4a25256f, 0x5c2e2e72, 0x381c1c24, 0x57a6a6f1, 0x73b4b4c7, 0x97c6c651, 0xcbe8e823, 0xa1dddd7c, 0xe874749c, 0x3e1f1f21, 0x964b4bdd, 0x61bdbddc, 0x0d8b8b86, 0x0f8a8a85, 0xe0707090, 0x7c3e3e42, 0x71b5b5c4, 0xcc6666aa, 0x904848d8, 0x06030305, 0xf7f6f601, 0x1c0e0e12, 0xc26161a3, 0x6a35355f, 0xae5757f9, 0x69b9b9d0, 0x17868691, 0x99c1c158, 0x3a1d1d27, 0x279e9eb9, 0xd9e1e138, 0xebf8f813, 0x2b9898b3, 0x22111133, 0xd26969bb, 0xa9d9d970, 0x078e8e89, 0x339494a7, 0x2d9b9bb6, 0x3c1e1e22, 0x15878792, 0xc9e9e920, 0x87cece49, 0xaa5555ff, 0x50282878, 0xa5dfdf7a, 0x038c8c8f, 0x59a1a1f8, 0x09898980, 0x1a0d0d17, 0x65bfbfda, 0xd7e6e631, 0x844242c6, 0xd06868b8, 0x824141c3, 0x299999b0, 0x5a2d2d77, 0x1e0f0f11, 0x7bb0b0cb, 0xa85454fc, 0x6dbbbbd6, 0x2c16163a];
    var T2 = [0xa5c66363, 0x84f87c7c, 0x99ee7777, 0x8df67b7b, 0x0dfff2f2, 0xbdd66b6b, 0xb1de6f6f, 0x5491c5c5, 0x50603030, 0x03020101, 0xa9ce6767, 0x7d562b2b, 0x19e7fefe, 0x62b5d7d7, 0xe64dabab, 0x9aec7676, 0x458fcaca, 0x9d1f8282, 0x4089c9c9, 0x87fa7d7d, 0x15effafa, 0xebb25959, 0xc98e4747, 0x0bfbf0f0, 0xec41adad, 0x67b3d4d4, 0xfd5fa2a2, 0xea45afaf, 0xbf239c9c, 0xf753a4a4, 0x96e47272, 0x5b9bc0c0, 0xc275b7b7, 0x1ce1fdfd, 0xae3d9393, 0x6a4c2626, 0x5a6c3636, 0x417e3f3f, 0x02f5f7f7, 0x4f83cccc, 0x5c683434, 0xf451a5a5, 0x34d1e5e5, 0x08f9f1f1, 0x93e27171, 0x73abd8d8, 0x53623131, 0x3f2a1515, 0x0c080404, 0x5295c7c7, 0x65462323, 0x5e9dc3c3, 0x28301818, 0xa1379696, 0x0f0a0505, 0xb52f9a9a, 0x090e0707, 0x36241212, 0x9b1b8080, 0x3ddfe2e2, 0x26cdebeb, 0x694e2727, 0xcd7fb2b2, 0x9fea7575, 0x1b120909, 0x9e1d8383, 0x74582c2c, 0x2e341a1a, 0x2d361b1b, 0xb2dc6e6e, 0xeeb45a5a, 0xfb5ba0a0, 0xf6a45252, 0x4d763b3b, 0x61b7d6d6, 0xce7db3b3, 0x7b522929, 0x3edde3e3, 0x715e2f2f, 0x97138484, 0xf5a65353, 0x68b9d1d1, 0x00000000, 0x2cc1eded, 0x60402020, 0x1fe3fcfc, 0xc879b1b1, 0xedb65b5b, 0xbed46a6a, 0x468dcbcb, 0xd967bebe, 0x4b723939, 0xde944a4a, 0xd4984c4c, 0xe8b05858, 0x4a85cfcf, 0x6bbbd0d0, 0x2ac5efef, 0xe54faaaa, 0x16edfbfb, 0xc5864343, 0xd79a4d4d, 0x55663333, 0x94118585, 0xcf8a4545, 0x10e9f9f9, 0x06040202, 0x81fe7f7f, 0xf0a05050, 0x44783c3c, 0xba259f9f, 0xe34ba8a8, 0xf3a25151, 0xfe5da3a3, 0xc0804040, 0x8a058f8f, 0xad3f9292, 0xbc219d9d, 0x48703838, 0x04f1f5f5, 0xdf63bcbc, 0xc177b6b6, 0x75afdada, 0x63422121, 0x30201010, 0x1ae5ffff, 0x0efdf3f3, 0x6dbfd2d2, 0x4c81cdcd, 0x14180c0c, 0x35261313, 0x2fc3ecec, 0xe1be5f5f, 0xa2359797, 0xcc884444, 0x392e1717, 0x5793c4c4, 0xf255a7a7, 0x82fc7e7e, 0x477a3d3d, 0xacc86464, 0xe7ba5d5d, 0x2b321919, 0x95e67373, 0xa0c06060, 0x98198181, 0xd19e4f4f, 0x7fa3dcdc, 0x66442222, 0x7e542a2a, 0xab3b9090, 0x830b8888, 0xca8c4646, 0x29c7eeee, 0xd36bb8b8, 0x3c281414, 0x79a7dede, 0xe2bc5e5e, 0x1d160b0b, 0x76addbdb, 0x3bdbe0e0, 0x56643232, 0x4e743a3a, 0x1e140a0a, 0xdb924949, 0x0a0c0606, 0x6c482424, 0xe4b85c5c, 0x5d9fc2c2, 0x6ebdd3d3, 0xef43acac, 0xa6c46262, 0xa8399191, 0xa4319595, 0x37d3e4e4, 0x8bf27979, 0x32d5e7e7, 0x438bc8c8, 0x596e3737, 0xb7da6d6d, 0x8c018d8d, 0x64b1d5d5, 0xd29c4e4e, 0xe049a9a9, 0xb4d86c6c, 0xfaac5656, 0x07f3f4f4, 0x25cfeaea, 0xafca6565, 0x8ef47a7a, 0xe947aeae, 0x18100808, 0xd56fbaba, 0x88f07878, 0x6f4a2525, 0x725c2e2e, 0x24381c1c, 0xf157a6a6, 0xc773b4b4, 0x5197c6c6, 0x23cbe8e8, 0x7ca1dddd, 0x9ce87474, 0x213e1f1f, 0xdd964b4b, 0xdc61bdbd, 0x860d8b8b, 0x850f8a8a, 0x90e07070, 0x427c3e3e, 0xc471b5b5, 0xaacc6666, 0xd8904848, 0x05060303, 0x01f7f6f6, 0x121c0e0e, 0xa3c26161, 0x5f6a3535, 0xf9ae5757, 0xd069b9b9, 0x91178686, 0x5899c1c1, 0x273a1d1d, 0xb9279e9e, 0x38d9e1e1, 0x13ebf8f8, 0xb32b9898, 0x33221111, 0xbbd26969, 0x70a9d9d9, 0x89078e8e, 0xa7339494, 0xb62d9b9b, 0x223c1e1e, 0x92158787, 0x20c9e9e9, 0x4987cece, 0xffaa5555, 0x78502828, 0x7aa5dfdf, 0x8f038c8c, 0xf859a1a1, 0x80098989, 0x171a0d0d, 0xda65bfbf, 0x31d7e6e6, 0xc6844242, 0xb8d06868, 0xc3824141, 0xb0299999, 0x775a2d2d, 0x111e0f0f, 0xcb7bb0b0, 0xfca85454, 0xd66dbbbb, 0x3a2c1616];
    var T3 = [0x63a5c663, 0x7c84f87c, 0x7799ee77, 0x7b8df67b, 0xf20dfff2, 0x6bbdd66b, 0x6fb1de6f, 0xc55491c5, 0x30506030, 0x01030201, 0x67a9ce67, 0x2b7d562b, 0xfe19e7fe, 0xd762b5d7, 0xabe64dab, 0x769aec76, 0xca458fca, 0x829d1f82, 0xc94089c9, 0x7d87fa7d, 0xfa15effa, 0x59ebb259, 0x47c98e47, 0xf00bfbf0, 0xadec41ad, 0xd467b3d4, 0xa2fd5fa2, 0xafea45af, 0x9cbf239c, 0xa4f753a4, 0x7296e472, 0xc05b9bc0, 0xb7c275b7, 0xfd1ce1fd, 0x93ae3d93, 0x266a4c26, 0x365a6c36, 0x3f417e3f, 0xf702f5f7, 0xcc4f83cc, 0x345c6834, 0xa5f451a5, 0xe534d1e5, 0xf108f9f1, 0x7193e271, 0xd873abd8, 0x31536231, 0x153f2a15, 0x040c0804, 0xc75295c7, 0x23654623, 0xc35e9dc3, 0x18283018, 0x96a13796, 0x050f0a05, 0x9ab52f9a, 0x07090e07, 0x12362412, 0x809b1b80, 0xe23ddfe2, 0xeb26cdeb, 0x27694e27, 0xb2cd7fb2, 0x759fea75, 0x091b1209, 0x839e1d83, 0x2c74582c, 0x1a2e341a, 0x1b2d361b, 0x6eb2dc6e, 0x5aeeb45a, 0xa0fb5ba0, 0x52f6a452, 0x3b4d763b, 0xd661b7d6, 0xb3ce7db3, 0x297b5229, 0xe33edde3, 0x2f715e2f, 0x84971384, 0x53f5a653, 0xd168b9d1, 0x00000000, 0xed2cc1ed, 0x20604020, 0xfc1fe3fc, 0xb1c879b1, 0x5bedb65b, 0x6abed46a, 0xcb468dcb, 0xbed967be, 0x394b7239, 0x4ade944a, 0x4cd4984c, 0x58e8b058, 0xcf4a85cf, 0xd06bbbd0, 0xef2ac5ef, 0xaae54faa, 0xfb16edfb, 0x43c58643, 0x4dd79a4d, 0x33556633, 0x85941185, 0x45cf8a45, 0xf910e9f9, 0x02060402, 0x7f81fe7f, 0x50f0a050, 0x3c44783c, 0x9fba259f, 0xa8e34ba8, 0x51f3a251, 0xa3fe5da3, 0x40c08040, 0x8f8a058f, 0x92ad3f92, 0x9dbc219d, 0x38487038, 0xf504f1f5, 0xbcdf63bc, 0xb6c177b6, 0xda75afda, 0x21634221, 0x10302010, 0xff1ae5ff, 0xf30efdf3, 0xd26dbfd2, 0xcd4c81cd, 0x0c14180c, 0x13352613, 0xec2fc3ec, 0x5fe1be5f, 0x97a23597, 0x44cc8844, 0x17392e17, 0xc45793c4, 0xa7f255a7, 0x7e82fc7e, 0x3d477a3d, 0x64acc864, 0x5de7ba5d, 0x192b3219, 0x7395e673, 0x60a0c060, 0x81981981, 0x4fd19e4f, 0xdc7fa3dc, 0x22664422, 0x2a7e542a, 0x90ab3b90, 0x88830b88, 0x46ca8c46, 0xee29c7ee, 0xb8d36bb8, 0x143c2814, 0xde79a7de, 0x5ee2bc5e, 0x0b1d160b, 0xdb76addb, 0xe03bdbe0, 0x32566432, 0x3a4e743a, 0x0a1e140a, 0x49db9249, 0x060a0c06, 0x246c4824, 0x5ce4b85c, 0xc25d9fc2, 0xd36ebdd3, 0xacef43ac, 0x62a6c462, 0x91a83991, 0x95a43195, 0xe437d3e4, 0x798bf279, 0xe732d5e7, 0xc8438bc8, 0x37596e37, 0x6db7da6d, 0x8d8c018d, 0xd564b1d5, 0x4ed29c4e, 0xa9e049a9, 0x6cb4d86c, 0x56faac56, 0xf407f3f4, 0xea25cfea, 0x65afca65, 0x7a8ef47a, 0xaee947ae, 0x08181008, 0xbad56fba, 0x7888f078, 0x256f4a25, 0x2e725c2e, 0x1c24381c, 0xa6f157a6, 0xb4c773b4, 0xc65197c6, 0xe823cbe8, 0xdd7ca1dd, 0x749ce874, 0x1f213e1f, 0x4bdd964b, 0xbddc61bd, 0x8b860d8b, 0x8a850f8a, 0x7090e070, 0x3e427c3e, 0xb5c471b5, 0x66aacc66, 0x48d89048, 0x03050603, 0xf601f7f6, 0x0e121c0e, 0x61a3c261, 0x355f6a35, 0x57f9ae57, 0xb9d069b9, 0x86911786, 0xc15899c1, 0x1d273a1d, 0x9eb9279e, 0xe138d9e1, 0xf813ebf8, 0x98b32b98, 0x11332211, 0x69bbd269, 0xd970a9d9, 0x8e89078e, 0x94a73394, 0x9bb62d9b, 0x1e223c1e, 0x87921587, 0xe920c9e9, 0xce4987ce, 0x55ffaa55, 0x28785028, 0xdf7aa5df, 0x8c8f038c, 0xa1f859a1, 0x89800989, 0x0d171a0d, 0xbfda65bf, 0xe631d7e6, 0x42c68442, 0x68b8d068, 0x41c38241, 0x99b02999, 0x2d775a2d, 0x0f111e0f, 0xb0cb7bb0, 0x54fca854, 0xbbd66dbb, 0x163a2c16];
    var T4 = [0x6363a5c6, 0x7c7c84f8, 0x777799ee, 0x7b7b8df6, 0xf2f20dff, 0x6b6bbdd6, 0x6f6fb1de, 0xc5c55491, 0x30305060, 0x01010302, 0x6767a9ce, 0x2b2b7d56, 0xfefe19e7, 0xd7d762b5, 0xababe64d, 0x76769aec, 0xcaca458f, 0x82829d1f, 0xc9c94089, 0x7d7d87fa, 0xfafa15ef, 0x5959ebb2, 0x4747c98e, 0xf0f00bfb, 0xadadec41, 0xd4d467b3, 0xa2a2fd5f, 0xafafea45, 0x9c9cbf23, 0xa4a4f753, 0x727296e4, 0xc0c05b9b, 0xb7b7c275, 0xfdfd1ce1, 0x9393ae3d, 0x26266a4c, 0x36365a6c, 0x3f3f417e, 0xf7f702f5, 0xcccc4f83, 0x34345c68, 0xa5a5f451, 0xe5e534d1, 0xf1f108f9, 0x717193e2, 0xd8d873ab, 0x31315362, 0x15153f2a, 0x04040c08, 0xc7c75295, 0x23236546, 0xc3c35e9d, 0x18182830, 0x9696a137, 0x05050f0a, 0x9a9ab52f, 0x0707090e, 0x12123624, 0x80809b1b, 0xe2e23ddf, 0xebeb26cd, 0x2727694e, 0xb2b2cd7f, 0x75759fea, 0x09091b12, 0x83839e1d, 0x2c2c7458, 0x1a1a2e34, 0x1b1b2d36, 0x6e6eb2dc, 0x5a5aeeb4, 0xa0a0fb5b, 0x5252f6a4, 0x3b3b4d76, 0xd6d661b7, 0xb3b3ce7d, 0x29297b52, 0xe3e33edd, 0x2f2f715e, 0x84849713, 0x5353f5a6, 0xd1d168b9, 0x00000000, 0xeded2cc1, 0x20206040, 0xfcfc1fe3, 0xb1b1c879, 0x5b5bedb6, 0x6a6abed4, 0xcbcb468d, 0xbebed967, 0x39394b72, 0x4a4ade94, 0x4c4cd498, 0x5858e8b0, 0xcfcf4a85, 0xd0d06bbb, 0xefef2ac5, 0xaaaae54f, 0xfbfb16ed, 0x4343c586, 0x4d4dd79a, 0x33335566, 0x85859411, 0x4545cf8a, 0xf9f910e9, 0x02020604, 0x7f7f81fe, 0x5050f0a0, 0x3c3c4478, 0x9f9fba25, 0xa8a8e34b, 0x5151f3a2, 0xa3a3fe5d, 0x4040c080, 0x8f8f8a05, 0x9292ad3f, 0x9d9dbc21, 0x38384870, 0xf5f504f1, 0xbcbcdf63, 0xb6b6c177, 0xdada75af, 0x21216342, 0x10103020, 0xffff1ae5, 0xf3f30efd, 0xd2d26dbf, 0xcdcd4c81, 0x0c0c1418, 0x13133526, 0xecec2fc3, 0x5f5fe1be, 0x9797a235, 0x4444cc88, 0x1717392e, 0xc4c45793, 0xa7a7f255, 0x7e7e82fc, 0x3d3d477a, 0x6464acc8, 0x5d5de7ba, 0x19192b32, 0x737395e6, 0x6060a0c0, 0x81819819, 0x4f4fd19e, 0xdcdc7fa3, 0x22226644, 0x2a2a7e54, 0x9090ab3b, 0x8888830b, 0x4646ca8c, 0xeeee29c7, 0xb8b8d36b, 0x14143c28, 0xdede79a7, 0x5e5ee2bc, 0x0b0b1d16, 0xdbdb76ad, 0xe0e03bdb, 0x32325664, 0x3a3a4e74, 0x0a0a1e14, 0x4949db92, 0x06060a0c, 0x24246c48, 0x5c5ce4b8, 0xc2c25d9f, 0xd3d36ebd, 0xacacef43, 0x6262a6c4, 0x9191a839, 0x9595a431, 0xe4e437d3, 0x79798bf2, 0xe7e732d5, 0xc8c8438b, 0x3737596e, 0x6d6db7da, 0x8d8d8c01, 0xd5d564b1, 0x4e4ed29c, 0xa9a9e049, 0x6c6cb4d8, 0x5656faac, 0xf4f407f3, 0xeaea25cf, 0x6565afca, 0x7a7a8ef4, 0xaeaee947, 0x08081810, 0xbabad56f, 0x787888f0, 0x25256f4a, 0x2e2e725c, 0x1c1c2438, 0xa6a6f157, 0xb4b4c773, 0xc6c65197, 0xe8e823cb, 0xdddd7ca1, 0x74749ce8, 0x1f1f213e, 0x4b4bdd96, 0xbdbddc61, 0x8b8b860d, 0x8a8a850f, 0x707090e0, 0x3e3e427c, 0xb5b5c471, 0x6666aacc, 0x4848d890, 0x03030506, 0xf6f601f7, 0x0e0e121c, 0x6161a3c2, 0x35355f6a, 0x5757f9ae, 0xb9b9d069, 0x86869117, 0xc1c15899, 0x1d1d273a, 0x9e9eb927, 0xe1e138d9, 0xf8f813eb, 0x9898b32b, 0x11113322, 0x6969bbd2, 0xd9d970a9, 0x8e8e8907, 0x9494a733, 0x9b9bb62d, 0x1e1e223c, 0x87879215, 0xe9e920c9, 0xcece4987, 0x5555ffaa, 0x28287850, 0xdfdf7aa5, 0x8c8c8f03, 0xa1a1f859, 0x89898009, 0x0d0d171a, 0xbfbfda65, 0xe6e631d7, 0x4242c684, 0x6868b8d0, 0x4141c382, 0x9999b029, 0x2d2d775a, 0x0f0f111e, 0xb0b0cb7b, 0x5454fca8, 0xbbbbd66d, 0x16163a2c];

    // Transformations for decryption
    var T5 = [0x51f4a750, 0x7e416553, 0x1a17a4c3, 0x3a275e96, 0x3bab6bcb, 0x1f9d45f1, 0xacfa58ab, 0x4be30393, 0x2030fa55, 0xad766df6, 0x88cc7691, 0xf5024c25, 0x4fe5d7fc, 0xc52acbd7, 0x26354480, 0xb562a38f, 0xdeb15a49, 0x25ba1b67, 0x45ea0e98, 0x5dfec0e1, 0xc32f7502, 0x814cf012, 0x8d4697a3, 0x6bd3f9c6, 0x038f5fe7, 0x15929c95, 0xbf6d7aeb, 0x955259da, 0xd4be832d, 0x587421d3, 0x49e06929, 0x8ec9c844, 0x75c2896a, 0xf48e7978, 0x99583e6b, 0x27b971dd, 0xbee14fb6, 0xf088ad17, 0xc920ac66, 0x7dce3ab4, 0x63df4a18, 0xe51a3182, 0x97513360, 0x62537f45, 0xb16477e0, 0xbb6bae84, 0xfe81a01c, 0xf9082b94, 0x70486858, 0x8f45fd19, 0x94de6c87, 0x527bf8b7, 0xab73d323, 0x724b02e2, 0xe31f8f57, 0x6655ab2a, 0xb2eb2807, 0x2fb5c203, 0x86c57b9a, 0xd33708a5, 0x302887f2, 0x23bfa5b2, 0x02036aba, 0xed16825c, 0x8acf1c2b, 0xa779b492, 0xf307f2f0, 0x4e69e2a1, 0x65daf4cd, 0x0605bed5, 0xd134621f, 0xc4a6fe8a, 0x342e539d, 0xa2f355a0, 0x058ae132, 0xa4f6eb75, 0x0b83ec39, 0x4060efaa, 0x5e719f06, 0xbd6e1051, 0x3e218af9, 0x96dd063d, 0xdd3e05ae, 0x4de6bd46, 0x91548db5, 0x71c45d05, 0x0406d46f, 0x605015ff, 0x1998fb24, 0xd6bde997, 0x894043cc, 0x67d99e77, 0xb0e842bd, 0x07898b88, 0xe7195b38, 0x79c8eedb, 0xa17c0a47, 0x7c420fe9, 0xf8841ec9, 0x00000000, 0x09808683, 0x322bed48, 0x1e1170ac, 0x6c5a724e, 0xfd0efffb, 0x0f853856, 0x3daed51e, 0x362d3927, 0x0a0fd964, 0x685ca621, 0x9b5b54d1, 0x24362e3a, 0x0c0a67b1, 0x9357e70f, 0xb4ee96d2, 0x1b9b919e, 0x80c0c54f, 0x61dc20a2, 0x5a774b69, 0x1c121a16, 0xe293ba0a, 0xc0a02ae5, 0x3c22e043, 0x121b171d, 0x0e090d0b, 0xf28bc7ad, 0x2db6a8b9, 0x141ea9c8, 0x57f11985, 0xaf75074c, 0xee99ddbb, 0xa37f60fd, 0xf701269f, 0x5c72f5bc, 0x44663bc5, 0x5bfb7e34, 0x8b432976, 0xcb23c6dc, 0xb6edfc68, 0xb8e4f163, 0xd731dcca, 0x42638510, 0x13972240, 0x84c61120, 0x854a247d, 0xd2bb3df8, 0xaef93211, 0xc729a16d, 0x1d9e2f4b, 0xdcb230f3, 0x0d8652ec, 0x77c1e3d0, 0x2bb3166c, 0xa970b999, 0x119448fa, 0x47e96422, 0xa8fc8cc4, 0xa0f03f1a, 0x567d2cd8, 0x223390ef, 0x87494ec7, 0xd938d1c1, 0x8ccaa2fe, 0x98d40b36, 0xa6f581cf, 0xa57ade28, 0xdab78e26, 0x3fadbfa4, 0x2c3a9de4, 0x5078920d, 0x6a5fcc9b, 0x547e4662, 0xf68d13c2, 0x90d8b8e8, 0x2e39f75e, 0x82c3aff5, 0x9f5d80be, 0x69d0937c, 0x6fd52da9, 0xcf2512b3, 0xc8ac993b, 0x10187da7, 0xe89c636e, 0xdb3bbb7b, 0xcd267809, 0x6e5918f4, 0xec9ab701, 0x834f9aa8, 0xe6956e65, 0xaaffe67e, 0x21bccf08, 0xef15e8e6, 0xbae79bd9, 0x4a6f36ce, 0xea9f09d4, 0x29b07cd6, 0x31a4b2af, 0x2a3f2331, 0xc6a59430, 0x35a266c0, 0x744ebc37, 0xfc82caa6, 0xe090d0b0, 0x33a7d815, 0xf104984a, 0x41ecdaf7, 0x7fcd500e, 0x1791f62f, 0x764dd68d, 0x43efb04d, 0xccaa4d54, 0xe49604df, 0x9ed1b5e3, 0x4c6a881b, 0xc12c1fb8, 0x4665517f, 0x9d5eea04, 0x018c355d, 0xfa877473, 0xfb0b412e, 0xb3671d5a, 0x92dbd252, 0xe9105633, 0x6dd64713, 0x9ad7618c, 0x37a10c7a, 0x59f8148e, 0xeb133c89, 0xcea927ee, 0xb761c935, 0xe11ce5ed, 0x7a47b13c, 0x9cd2df59, 0x55f2733f, 0x1814ce79, 0x73c737bf, 0x53f7cdea, 0x5ffdaa5b, 0xdf3d6f14, 0x7844db86, 0xcaaff381, 0xb968c43e, 0x3824342c, 0xc2a3405f, 0x161dc372, 0xbce2250c, 0x283c498b, 0xff0d9541, 0x39a80171, 0x080cb3de, 0xd8b4e49c, 0x6456c190, 0x7bcb8461, 0xd532b670, 0x486c5c74, 0xd0b85742];
    var T6 = [0x5051f4a7, 0x537e4165, 0xc31a17a4, 0x963a275e, 0xcb3bab6b, 0xf11f9d45, 0xabacfa58, 0x934be303, 0x552030fa, 0xf6ad766d, 0x9188cc76, 0x25f5024c, 0xfc4fe5d7, 0xd7c52acb, 0x80263544, 0x8fb562a3, 0x49deb15a, 0x6725ba1b, 0x9845ea0e, 0xe15dfec0, 0x02c32f75, 0x12814cf0, 0xa38d4697, 0xc66bd3f9, 0xe7038f5f, 0x9515929c, 0xebbf6d7a, 0xda955259, 0x2dd4be83, 0xd3587421, 0x2949e069, 0x448ec9c8, 0x6a75c289, 0x78f48e79, 0x6b99583e, 0xdd27b971, 0xb6bee14f, 0x17f088ad, 0x66c920ac, 0xb47dce3a, 0x1863df4a, 0x82e51a31, 0x60975133, 0x4562537f, 0xe0b16477, 0x84bb6bae, 0x1cfe81a0, 0x94f9082b, 0x58704868, 0x198f45fd, 0x8794de6c, 0xb7527bf8, 0x23ab73d3, 0xe2724b02, 0x57e31f8f, 0x2a6655ab, 0x07b2eb28, 0x032fb5c2, 0x9a86c57b, 0xa5d33708, 0xf2302887, 0xb223bfa5, 0xba02036a, 0x5ced1682, 0x2b8acf1c, 0x92a779b4, 0xf0f307f2, 0xa14e69e2, 0xcd65daf4, 0xd50605be, 0x1fd13462, 0x8ac4a6fe, 0x9d342e53, 0xa0a2f355, 0x32058ae1, 0x75a4f6eb, 0x390b83ec, 0xaa4060ef, 0x065e719f, 0x51bd6e10, 0xf93e218a, 0x3d96dd06, 0xaedd3e05, 0x464de6bd, 0xb591548d, 0x0571c45d, 0x6f0406d4, 0xff605015, 0x241998fb, 0x97d6bde9, 0xcc894043, 0x7767d99e, 0xbdb0e842, 0x8807898b, 0x38e7195b, 0xdb79c8ee, 0x47a17c0a, 0xe97c420f, 0xc9f8841e, 0x00000000, 0x83098086, 0x48322bed, 0xac1e1170, 0x4e6c5a72, 0xfbfd0eff, 0x560f8538, 0x1e3daed5, 0x27362d39, 0x640a0fd9, 0x21685ca6, 0xd19b5b54, 0x3a24362e, 0xb10c0a67, 0x0f9357e7, 0xd2b4ee96, 0x9e1b9b91, 0x4f80c0c5, 0xa261dc20, 0x695a774b, 0x161c121a, 0x0ae293ba, 0xe5c0a02a, 0x433c22e0, 0x1d121b17, 0x0b0e090d, 0xadf28bc7, 0xb92db6a8, 0xc8141ea9, 0x8557f119, 0x4caf7507, 0xbbee99dd, 0xfda37f60, 0x9ff70126, 0xbc5c72f5, 0xc544663b, 0x345bfb7e, 0x768b4329, 0xdccb23c6, 0x68b6edfc, 0x63b8e4f1, 0xcad731dc, 0x10426385, 0x40139722, 0x2084c611, 0x7d854a24, 0xf8d2bb3d, 0x11aef932, 0x6dc729a1, 0x4b1d9e2f, 0xf3dcb230, 0xec0d8652, 0xd077c1e3, 0x6c2bb316, 0x99a970b9, 0xfa119448, 0x2247e964, 0xc4a8fc8c, 0x1aa0f03f, 0xd8567d2c, 0xef223390, 0xc787494e, 0xc1d938d1, 0xfe8ccaa2, 0x3698d40b, 0xcfa6f581, 0x28a57ade, 0x26dab78e, 0xa43fadbf, 0xe42c3a9d, 0x0d507892, 0x9b6a5fcc, 0x62547e46, 0xc2f68d13, 0xe890d8b8, 0x5e2e39f7, 0xf582c3af, 0xbe9f5d80, 0x7c69d093, 0xa96fd52d, 0xb3cf2512, 0x3bc8ac99, 0xa710187d, 0x6ee89c63, 0x7bdb3bbb, 0x09cd2678, 0xf46e5918, 0x01ec9ab7, 0xa8834f9a, 0x65e6956e, 0x7eaaffe6, 0x0821bccf, 0xe6ef15e8, 0xd9bae79b, 0xce4a6f36, 0xd4ea9f09, 0xd629b07c, 0xaf31a4b2, 0x312a3f23, 0x30c6a594, 0xc035a266, 0x37744ebc, 0xa6fc82ca, 0xb0e090d0, 0x1533a7d8, 0x4af10498, 0xf741ecda, 0x0e7fcd50, 0x2f1791f6, 0x8d764dd6, 0x4d43efb0, 0x54ccaa4d, 0xdfe49604, 0xe39ed1b5, 0x1b4c6a88, 0xb8c12c1f, 0x7f466551, 0x049d5eea, 0x5d018c35, 0x73fa8774, 0x2efb0b41, 0x5ab3671d, 0x5292dbd2, 0x33e91056, 0x136dd647, 0x8c9ad761, 0x7a37a10c, 0x8e59f814, 0x89eb133c, 0xeecea927, 0x35b761c9, 0xede11ce5, 0x3c7a47b1, 0x599cd2df, 0x3f55f273, 0x791814ce, 0xbf73c737, 0xea53f7cd, 0x5b5ffdaa, 0x14df3d6f, 0x867844db, 0x81caaff3, 0x3eb968c4, 0x2c382434, 0x5fc2a340, 0x72161dc3, 0x0cbce225, 0x8b283c49, 0x41ff0d95, 0x7139a801, 0xde080cb3, 0x9cd8b4e4, 0x906456c1, 0x617bcb84, 0x70d532b6, 0x74486c5c, 0x42d0b857];
    var T7 = [0xa75051f4, 0x65537e41, 0xa4c31a17, 0x5e963a27, 0x6bcb3bab, 0x45f11f9d, 0x58abacfa, 0x03934be3, 0xfa552030, 0x6df6ad76, 0x769188cc, 0x4c25f502, 0xd7fc4fe5, 0xcbd7c52a, 0x44802635, 0xa38fb562, 0x5a49deb1, 0x1b6725ba, 0x0e9845ea, 0xc0e15dfe, 0x7502c32f, 0xf012814c, 0x97a38d46, 0xf9c66bd3, 0x5fe7038f, 0x9c951592, 0x7aebbf6d, 0x59da9552, 0x832dd4be, 0x21d35874, 0x692949e0, 0xc8448ec9, 0x896a75c2, 0x7978f48e, 0x3e6b9958, 0x71dd27b9, 0x4fb6bee1, 0xad17f088, 0xac66c920, 0x3ab47dce, 0x4a1863df, 0x3182e51a, 0x33609751, 0x7f456253, 0x77e0b164, 0xae84bb6b, 0xa01cfe81, 0x2b94f908, 0x68587048, 0xfd198f45, 0x6c8794de, 0xf8b7527b, 0xd323ab73, 0x02e2724b, 0x8f57e31f, 0xab2a6655, 0x2807b2eb, 0xc2032fb5, 0x7b9a86c5, 0x08a5d337, 0x87f23028, 0xa5b223bf, 0x6aba0203, 0x825ced16, 0x1c2b8acf, 0xb492a779, 0xf2f0f307, 0xe2a14e69, 0xf4cd65da, 0xbed50605, 0x621fd134, 0xfe8ac4a6, 0x539d342e, 0x55a0a2f3, 0xe132058a, 0xeb75a4f6, 0xec390b83, 0xefaa4060, 0x9f065e71, 0x1051bd6e, 0x8af93e21, 0x063d96dd, 0x05aedd3e, 0xbd464de6, 0x8db59154, 0x5d0571c4, 0xd46f0406, 0x15ff6050, 0xfb241998, 0xe997d6bd, 0x43cc8940, 0x9e7767d9, 0x42bdb0e8, 0x8b880789, 0x5b38e719, 0xeedb79c8, 0x0a47a17c, 0x0fe97c42, 0x1ec9f884, 0x00000000, 0x86830980, 0xed48322b, 0x70ac1e11, 0x724e6c5a, 0xfffbfd0e, 0x38560f85, 0xd51e3dae, 0x3927362d, 0xd9640a0f, 0xa621685c, 0x54d19b5b, 0x2e3a2436, 0x67b10c0a, 0xe70f9357, 0x96d2b4ee, 0x919e1b9b, 0xc54f80c0, 0x20a261dc, 0x4b695a77, 0x1a161c12, 0xba0ae293, 0x2ae5c0a0, 0xe0433c22, 0x171d121b, 0x0d0b0e09, 0xc7adf28b, 0xa8b92db6, 0xa9c8141e, 0x198557f1, 0x074caf75, 0xddbbee99, 0x60fda37f, 0x269ff701, 0xf5bc5c72, 0x3bc54466, 0x7e345bfb, 0x29768b43, 0xc6dccb23, 0xfc68b6ed, 0xf163b8e4, 0xdccad731, 0x85104263, 0x22401397, 0x112084c6, 0x247d854a, 0x3df8d2bb, 0x3211aef9, 0xa16dc729, 0x2f4b1d9e, 0x30f3dcb2, 0x52ec0d86, 0xe3d077c1, 0x166c2bb3, 0xb999a970, 0x48fa1194, 0x642247e9, 0x8cc4a8fc, 0x3f1aa0f0, 0x2cd8567d, 0x90ef2233, 0x4ec78749, 0xd1c1d938, 0xa2fe8cca, 0x0b3698d4, 0x81cfa6f5, 0xde28a57a, 0x8e26dab7, 0xbfa43fad, 0x9de42c3a, 0x920d5078, 0xcc9b6a5f, 0x4662547e, 0x13c2f68d, 0xb8e890d8, 0xf75e2e39, 0xaff582c3, 0x80be9f5d, 0x937c69d0, 0x2da96fd5, 0x12b3cf25, 0x993bc8ac, 0x7da71018, 0x636ee89c, 0xbb7bdb3b, 0x7809cd26, 0x18f46e59, 0xb701ec9a, 0x9aa8834f, 0x6e65e695, 0xe67eaaff, 0xcf0821bc, 0xe8e6ef15, 0x9bd9bae7, 0x36ce4a6f, 0x09d4ea9f, 0x7cd629b0, 0xb2af31a4, 0x23312a3f, 0x9430c6a5, 0x66c035a2, 0xbc37744e, 0xcaa6fc82, 0xd0b0e090, 0xd81533a7, 0x984af104, 0xdaf741ec, 0x500e7fcd, 0xf62f1791, 0xd68d764d, 0xb04d43ef, 0x4d54ccaa, 0x04dfe496, 0xb5e39ed1, 0x881b4c6a, 0x1fb8c12c, 0x517f4665, 0xea049d5e, 0x355d018c, 0x7473fa87, 0x412efb0b, 0x1d5ab367, 0xd25292db, 0x5633e910, 0x47136dd6, 0x618c9ad7, 0x0c7a37a1, 0x148e59f8, 0x3c89eb13, 0x27eecea9, 0xc935b761, 0xe5ede11c, 0xb13c7a47, 0xdf599cd2, 0x733f55f2, 0xce791814, 0x37bf73c7, 0xcdea53f7, 0xaa5b5ffd, 0x6f14df3d, 0xdb867844, 0xf381caaf, 0xc43eb968, 0x342c3824, 0x405fc2a3, 0xc372161d, 0x250cbce2, 0x498b283c, 0x9541ff0d, 0x017139a8, 0xb3de080c, 0xe49cd8b4, 0xc1906456, 0x84617bcb, 0xb670d532, 0x5c74486c, 0x5742d0b8];
    var T8 = [0xf4a75051, 0x4165537e, 0x17a4c31a, 0x275e963a, 0xab6bcb3b, 0x9d45f11f, 0xfa58abac, 0xe303934b, 0x30fa5520, 0x766df6ad, 0xcc769188, 0x024c25f5, 0xe5d7fc4f, 0x2acbd7c5, 0x35448026, 0x62a38fb5, 0xb15a49de, 0xba1b6725, 0xea0e9845, 0xfec0e15d, 0x2f7502c3, 0x4cf01281, 0x4697a38d, 0xd3f9c66b, 0x8f5fe703, 0x929c9515, 0x6d7aebbf, 0x5259da95, 0xbe832dd4, 0x7421d358, 0xe0692949, 0xc9c8448e, 0xc2896a75, 0x8e7978f4, 0x583e6b99, 0xb971dd27, 0xe14fb6be, 0x88ad17f0, 0x20ac66c9, 0xce3ab47d, 0xdf4a1863, 0x1a3182e5, 0x51336097, 0x537f4562, 0x6477e0b1, 0x6bae84bb, 0x81a01cfe, 0x082b94f9, 0x48685870, 0x45fd198f, 0xde6c8794, 0x7bf8b752, 0x73d323ab, 0x4b02e272, 0x1f8f57e3, 0x55ab2a66, 0xeb2807b2, 0xb5c2032f, 0xc57b9a86, 0x3708a5d3, 0x2887f230, 0xbfa5b223, 0x036aba02, 0x16825ced, 0xcf1c2b8a, 0x79b492a7, 0x07f2f0f3, 0x69e2a14e, 0xdaf4cd65, 0x05bed506, 0x34621fd1, 0xa6fe8ac4, 0x2e539d34, 0xf355a0a2, 0x8ae13205, 0xf6eb75a4, 0x83ec390b, 0x60efaa40, 0x719f065e, 0x6e1051bd, 0x218af93e, 0xdd063d96, 0x3e05aedd, 0xe6bd464d, 0x548db591, 0xc45d0571, 0x06d46f04, 0x5015ff60, 0x98fb2419, 0xbde997d6, 0x4043cc89, 0xd99e7767, 0xe842bdb0, 0x898b8807, 0x195b38e7, 0xc8eedb79, 0x7c0a47a1, 0x420fe97c, 0x841ec9f8, 0x00000000, 0x80868309, 0x2bed4832, 0x1170ac1e, 0x5a724e6c, 0x0efffbfd, 0x8538560f, 0xaed51e3d, 0x2d392736, 0x0fd9640a, 0x5ca62168, 0x5b54d19b, 0x362e3a24, 0x0a67b10c, 0x57e70f93, 0xee96d2b4, 0x9b919e1b, 0xc0c54f80, 0xdc20a261, 0x774b695a, 0x121a161c, 0x93ba0ae2, 0xa02ae5c0, 0x22e0433c, 0x1b171d12, 0x090d0b0e, 0x8bc7adf2, 0xb6a8b92d, 0x1ea9c814, 0xf1198557, 0x75074caf, 0x99ddbbee, 0x7f60fda3, 0x01269ff7, 0x72f5bc5c, 0x663bc544, 0xfb7e345b, 0x4329768b, 0x23c6dccb, 0xedfc68b6, 0xe4f163b8, 0x31dccad7, 0x63851042, 0x97224013, 0xc6112084, 0x4a247d85, 0xbb3df8d2, 0xf93211ae, 0x29a16dc7, 0x9e2f4b1d, 0xb230f3dc, 0x8652ec0d, 0xc1e3d077, 0xb3166c2b, 0x70b999a9, 0x9448fa11, 0xe9642247, 0xfc8cc4a8, 0xf03f1aa0, 0x7d2cd856, 0x3390ef22, 0x494ec787, 0x38d1c1d9, 0xcaa2fe8c, 0xd40b3698, 0xf581cfa6, 0x7ade28a5, 0xb78e26da, 0xadbfa43f, 0x3a9de42c, 0x78920d50, 0x5fcc9b6a, 0x7e466254, 0x8d13c2f6, 0xd8b8e890, 0x39f75e2e, 0xc3aff582, 0x5d80be9f, 0xd0937c69, 0xd52da96f, 0x2512b3cf, 0xac993bc8, 0x187da710, 0x9c636ee8, 0x3bbb7bdb, 0x267809cd, 0x5918f46e, 0x9ab701ec, 0x4f9aa883, 0x956e65e6, 0xffe67eaa, 0xbccf0821, 0x15e8e6ef, 0xe79bd9ba, 0x6f36ce4a, 0x9f09d4ea, 0xb07cd629, 0xa4b2af31, 0x3f23312a, 0xa59430c6, 0xa266c035, 0x4ebc3774, 0x82caa6fc, 0x90d0b0e0, 0xa7d81533, 0x04984af1, 0xecdaf741, 0xcd500e7f, 0x91f62f17, 0x4dd68d76, 0xefb04d43, 0xaa4d54cc, 0x9604dfe4, 0xd1b5e39e, 0x6a881b4c, 0x2c1fb8c1, 0x65517f46, 0x5eea049d, 0x8c355d01, 0x877473fa, 0x0b412efb, 0x671d5ab3, 0xdbd25292, 0x105633e9, 0xd647136d, 0xd7618c9a, 0xa10c7a37, 0xf8148e59, 0x133c89eb, 0xa927eece, 0x61c935b7, 0x1ce5ede1, 0x47b13c7a, 0xd2df599c, 0xf2733f55, 0x14ce7918, 0xc737bf73, 0xf7cdea53, 0xfdaa5b5f, 0x3d6f14df, 0x44db8678, 0xaff381ca, 0x68c43eb9, 0x24342c38, 0xa3405fc2, 0x1dc37216, 0xe2250cbc, 0x3c498b28, 0x0d9541ff, 0xa8017139, 0x0cb3de08, 0xb4e49cd8, 0x56c19064, 0xcb84617b, 0x32b670d5, 0x6c5c7448, 0xb85742d0];

    // Transformations for decryption key expansion
    var U1 = [0x00000000, 0x0e090d0b, 0x1c121a16, 0x121b171d, 0x3824342c, 0x362d3927, 0x24362e3a, 0x2a3f2331, 0x70486858, 0x7e416553, 0x6c5a724e, 0x62537f45, 0x486c5c74, 0x4665517f, 0x547e4662, 0x5a774b69, 0xe090d0b0, 0xee99ddbb, 0xfc82caa6, 0xf28bc7ad, 0xd8b4e49c, 0xd6bde997, 0xc4a6fe8a, 0xcaaff381, 0x90d8b8e8, 0x9ed1b5e3, 0x8ccaa2fe, 0x82c3aff5, 0xa8fc8cc4, 0xa6f581cf, 0xb4ee96d2, 0xbae79bd9, 0xdb3bbb7b, 0xd532b670, 0xc729a16d, 0xc920ac66, 0xe31f8f57, 0xed16825c, 0xff0d9541, 0xf104984a, 0xab73d323, 0xa57ade28, 0xb761c935, 0xb968c43e, 0x9357e70f, 0x9d5eea04, 0x8f45fd19, 0x814cf012, 0x3bab6bcb, 0x35a266c0, 0x27b971dd, 0x29b07cd6, 0x038f5fe7, 0x0d8652ec, 0x1f9d45f1, 0x119448fa, 0x4be30393, 0x45ea0e98, 0x57f11985, 0x59f8148e, 0x73c737bf, 0x7dce3ab4, 0x6fd52da9, 0x61dc20a2, 0xad766df6, 0xa37f60fd, 0xb16477e0, 0xbf6d7aeb, 0x955259da, 0x9b5b54d1, 0x894043cc, 0x87494ec7, 0xdd3e05ae, 0xd33708a5, 0xc12c1fb8, 0xcf2512b3, 0xe51a3182, 0xeb133c89, 0xf9082b94, 0xf701269f, 0x4de6bd46, 0x43efb04d, 0x51f4a750, 0x5ffdaa5b, 0x75c2896a, 0x7bcb8461, 0x69d0937c, 0x67d99e77, 0x3daed51e, 0x33a7d815, 0x21bccf08, 0x2fb5c203, 0x058ae132, 0x0b83ec39, 0x1998fb24, 0x1791f62f, 0x764dd68d, 0x7844db86, 0x6a5fcc9b, 0x6456c190, 0x4e69e2a1, 0x4060efaa, 0x527bf8b7, 0x5c72f5bc, 0x0605bed5, 0x080cb3de, 0x1a17a4c3, 0x141ea9c8, 0x3e218af9, 0x302887f2, 0x223390ef, 0x2c3a9de4, 0x96dd063d, 0x98d40b36, 0x8acf1c2b, 0x84c61120, 0xaef93211, 0xa0f03f1a, 0xb2eb2807, 0xbce2250c, 0xe6956e65, 0xe89c636e, 0xfa877473, 0xf48e7978, 0xdeb15a49, 0xd0b85742, 0xc2a3405f, 0xccaa4d54, 0x41ecdaf7, 0x4fe5d7fc, 0x5dfec0e1, 0x53f7cdea, 0x79c8eedb, 0x77c1e3d0, 0x65daf4cd, 0x6bd3f9c6, 0x31a4b2af, 0x3fadbfa4, 0x2db6a8b9, 0x23bfa5b2, 0x09808683, 0x07898b88, 0x15929c95, 0x1b9b919e, 0xa17c0a47, 0xaf75074c, 0xbd6e1051, 0xb3671d5a, 0x99583e6b, 0x97513360, 0x854a247d, 0x8b432976, 0xd134621f, 0xdf3d6f14, 0xcd267809, 0xc32f7502, 0xe9105633, 0xe7195b38, 0xf5024c25, 0xfb0b412e, 0x9ad7618c, 0x94de6c87, 0x86c57b9a, 0x88cc7691, 0xa2f355a0, 0xacfa58ab, 0xbee14fb6, 0xb0e842bd, 0xea9f09d4, 0xe49604df, 0xf68d13c2, 0xf8841ec9, 0xd2bb3df8, 0xdcb230f3, 0xcea927ee, 0xc0a02ae5, 0x7a47b13c, 0x744ebc37, 0x6655ab2a, 0x685ca621, 0x42638510, 0x4c6a881b, 0x5e719f06, 0x5078920d, 0x0a0fd964, 0x0406d46f, 0x161dc372, 0x1814ce79, 0x322bed48, 0x3c22e043, 0x2e39f75e, 0x2030fa55, 0xec9ab701, 0xe293ba0a, 0xf088ad17, 0xfe81a01c, 0xd4be832d, 0xdab78e26, 0xc8ac993b, 0xc6a59430, 0x9cd2df59, 0x92dbd252, 0x80c0c54f, 0x8ec9c844, 0xa4f6eb75, 0xaaffe67e, 0xb8e4f163, 0xb6edfc68, 0x0c0a67b1, 0x02036aba, 0x10187da7, 0x1e1170ac, 0x342e539d, 0x3a275e96, 0x283c498b, 0x26354480, 0x7c420fe9, 0x724b02e2, 0x605015ff, 0x6e5918f4, 0x44663bc5, 0x4a6f36ce, 0x587421d3, 0x567d2cd8, 0x37a10c7a, 0x39a80171, 0x2bb3166c, 0x25ba1b67, 0x0f853856, 0x018c355d, 0x13972240, 0x1d9e2f4b, 0x47e96422, 0x49e06929, 0x5bfb7e34, 0x55f2733f, 0x7fcd500e, 0x71c45d05, 0x63df4a18, 0x6dd64713, 0xd731dcca, 0xd938d1c1, 0xcb23c6dc, 0xc52acbd7, 0xef15e8e6, 0xe11ce5ed, 0xf307f2f0, 0xfd0efffb, 0xa779b492, 0xa970b999, 0xbb6bae84, 0xb562a38f, 0x9f5d80be, 0x91548db5, 0x834f9aa8, 0x8d4697a3];
    var U2 = [0x00000000, 0x0b0e090d, 0x161c121a, 0x1d121b17, 0x2c382434, 0x27362d39, 0x3a24362e, 0x312a3f23, 0x58704868, 0x537e4165, 0x4e6c5a72, 0x4562537f, 0x74486c5c, 0x7f466551, 0x62547e46, 0x695a774b, 0xb0e090d0, 0xbbee99dd, 0xa6fc82ca, 0xadf28bc7, 0x9cd8b4e4, 0x97d6bde9, 0x8ac4a6fe, 0x81caaff3, 0xe890d8b8, 0xe39ed1b5, 0xfe8ccaa2, 0xf582c3af, 0xc4a8fc8c, 0xcfa6f581, 0xd2b4ee96, 0xd9bae79b, 0x7bdb3bbb, 0x70d532b6, 0x6dc729a1, 0x66c920ac, 0x57e31f8f, 0x5ced1682, 0x41ff0d95, 0x4af10498, 0x23ab73d3, 0x28a57ade, 0x35b761c9, 0x3eb968c4, 0x0f9357e7, 0x049d5eea, 0x198f45fd, 0x12814cf0, 0xcb3bab6b, 0xc035a266, 0xdd27b971, 0xd629b07c, 0xe7038f5f, 0xec0d8652, 0xf11f9d45, 0xfa119448, 0x934be303, 0x9845ea0e, 0x8557f119, 0x8e59f814, 0xbf73c737, 0xb47dce3a, 0xa96fd52d, 0xa261dc20, 0xf6ad766d, 0xfda37f60, 0xe0b16477, 0xebbf6d7a, 0xda955259, 0xd19b5b54, 0xcc894043, 0xc787494e, 0xaedd3e05, 0xa5d33708, 0xb8c12c1f, 0xb3cf2512, 0x82e51a31, 0x89eb133c, 0x94f9082b, 0x9ff70126, 0x464de6bd, 0x4d43efb0, 0x5051f4a7, 0x5b5ffdaa, 0x6a75c289, 0x617bcb84, 0x7c69d093, 0x7767d99e, 0x1e3daed5, 0x1533a7d8, 0x0821bccf, 0x032fb5c2, 0x32058ae1, 0x390b83ec, 0x241998fb, 0x2f1791f6, 0x8d764dd6, 0x867844db, 0x9b6a5fcc, 0x906456c1, 0xa14e69e2, 0xaa4060ef, 0xb7527bf8, 0xbc5c72f5, 0xd50605be, 0xde080cb3, 0xc31a17a4, 0xc8141ea9, 0xf93e218a, 0xf2302887, 0xef223390, 0xe42c3a9d, 0x3d96dd06, 0x3698d40b, 0x2b8acf1c, 0x2084c611, 0x11aef932, 0x1aa0f03f, 0x07b2eb28, 0x0cbce225, 0x65e6956e, 0x6ee89c63, 0x73fa8774, 0x78f48e79, 0x49deb15a, 0x42d0b857, 0x5fc2a340, 0x54ccaa4d, 0xf741ecda, 0xfc4fe5d7, 0xe15dfec0, 0xea53f7cd, 0xdb79c8ee, 0xd077c1e3, 0xcd65daf4, 0xc66bd3f9, 0xaf31a4b2, 0xa43fadbf, 0xb92db6a8, 0xb223bfa5, 0x83098086, 0x8807898b, 0x9515929c, 0x9e1b9b91, 0x47a17c0a, 0x4caf7507, 0x51bd6e10, 0x5ab3671d, 0x6b99583e, 0x60975133, 0x7d854a24, 0x768b4329, 0x1fd13462, 0x14df3d6f, 0x09cd2678, 0x02c32f75, 0x33e91056, 0x38e7195b, 0x25f5024c, 0x2efb0b41, 0x8c9ad761, 0x8794de6c, 0x9a86c57b, 0x9188cc76, 0xa0a2f355, 0xabacfa58, 0xb6bee14f, 0xbdb0e842, 0xd4ea9f09, 0xdfe49604, 0xc2f68d13, 0xc9f8841e, 0xf8d2bb3d, 0xf3dcb230, 0xeecea927, 0xe5c0a02a, 0x3c7a47b1, 0x37744ebc, 0x2a6655ab, 0x21685ca6, 0x10426385, 0x1b4c6a88, 0x065e719f, 0x0d507892, 0x640a0fd9, 0x6f0406d4, 0x72161dc3, 0x791814ce, 0x48322bed, 0x433c22e0, 0x5e2e39f7, 0x552030fa, 0x01ec9ab7, 0x0ae293ba, 0x17f088ad, 0x1cfe81a0, 0x2dd4be83, 0x26dab78e, 0x3bc8ac99, 0x30c6a594, 0x599cd2df, 0x5292dbd2, 0x4f80c0c5, 0x448ec9c8, 0x75a4f6eb, 0x7eaaffe6, 0x63b8e4f1, 0x68b6edfc, 0xb10c0a67, 0xba02036a, 0xa710187d, 0xac1e1170, 0x9d342e53, 0x963a275e, 0x8b283c49, 0x80263544, 0xe97c420f, 0xe2724b02, 0xff605015, 0xf46e5918, 0xc544663b, 0xce4a6f36, 0xd3587421, 0xd8567d2c, 0x7a37a10c, 0x7139a801, 0x6c2bb316, 0x6725ba1b, 0x560f8538, 0x5d018c35, 0x40139722, 0x4b1d9e2f, 0x2247e964, 0x2949e069, 0x345bfb7e, 0x3f55f273, 0x0e7fcd50, 0x0571c45d, 0x1863df4a, 0x136dd647, 0xcad731dc, 0xc1d938d1, 0xdccb23c6, 0xd7c52acb, 0xe6ef15e8, 0xede11ce5, 0xf0f307f2, 0xfbfd0eff, 0x92a779b4, 0x99a970b9, 0x84bb6bae, 0x8fb562a3, 0xbe9f5d80, 0xb591548d, 0xa8834f9a, 0xa38d4697];
    var U3 = [0x00000000, 0x0d0b0e09, 0x1a161c12, 0x171d121b, 0x342c3824, 0x3927362d, 0x2e3a2436, 0x23312a3f, 0x68587048, 0x65537e41, 0x724e6c5a, 0x7f456253, 0x5c74486c, 0x517f4665, 0x4662547e, 0x4b695a77, 0xd0b0e090, 0xddbbee99, 0xcaa6fc82, 0xc7adf28b, 0xe49cd8b4, 0xe997d6bd, 0xfe8ac4a6, 0xf381caaf, 0xb8e890d8, 0xb5e39ed1, 0xa2fe8cca, 0xaff582c3, 0x8cc4a8fc, 0x81cfa6f5, 0x96d2b4ee, 0x9bd9bae7, 0xbb7bdb3b, 0xb670d532, 0xa16dc729, 0xac66c920, 0x8f57e31f, 0x825ced16, 0x9541ff0d, 0x984af104, 0xd323ab73, 0xde28a57a, 0xc935b761, 0xc43eb968, 0xe70f9357, 0xea049d5e, 0xfd198f45, 0xf012814c, 0x6bcb3bab, 0x66c035a2, 0x71dd27b9, 0x7cd629b0, 0x5fe7038f, 0x52ec0d86, 0x45f11f9d, 0x48fa1194, 0x03934be3, 0x0e9845ea, 0x198557f1, 0x148e59f8, 0x37bf73c7, 0x3ab47dce, 0x2da96fd5, 0x20a261dc, 0x6df6ad76, 0x60fda37f, 0x77e0b164, 0x7aebbf6d, 0x59da9552, 0x54d19b5b, 0x43cc8940, 0x4ec78749, 0x05aedd3e, 0x08a5d337, 0x1fb8c12c, 0x12b3cf25, 0x3182e51a, 0x3c89eb13, 0x2b94f908, 0x269ff701, 0xbd464de6, 0xb04d43ef, 0xa75051f4, 0xaa5b5ffd, 0x896a75c2, 0x84617bcb, 0x937c69d0, 0x9e7767d9, 0xd51e3dae, 0xd81533a7, 0xcf0821bc, 0xc2032fb5, 0xe132058a, 0xec390b83, 0xfb241998, 0xf62f1791, 0xd68d764d, 0xdb867844, 0xcc9b6a5f, 0xc1906456, 0xe2a14e69, 0xefaa4060, 0xf8b7527b, 0xf5bc5c72, 0xbed50605, 0xb3de080c, 0xa4c31a17, 0xa9c8141e, 0x8af93e21, 0x87f23028, 0x90ef2233, 0x9de42c3a, 0x063d96dd, 0x0b3698d4, 0x1c2b8acf, 0x112084c6, 0x3211aef9, 0x3f1aa0f0, 0x2807b2eb, 0x250cbce2, 0x6e65e695, 0x636ee89c, 0x7473fa87, 0x7978f48e, 0x5a49deb1, 0x5742d0b8, 0x405fc2a3, 0x4d54ccaa, 0xdaf741ec, 0xd7fc4fe5, 0xc0e15dfe, 0xcdea53f7, 0xeedb79c8, 0xe3d077c1, 0xf4cd65da, 0xf9c66bd3, 0xb2af31a4, 0xbfa43fad, 0xa8b92db6, 0xa5b223bf, 0x86830980, 0x8b880789, 0x9c951592, 0x919e1b9b, 0x0a47a17c, 0x074caf75, 0x1051bd6e, 0x1d5ab367, 0x3e6b9958, 0x33609751, 0x247d854a, 0x29768b43, 0x621fd134, 0x6f14df3d, 0x7809cd26, 0x7502c32f, 0x5633e910, 0x5b38e719, 0x4c25f502, 0x412efb0b, 0x618c9ad7, 0x6c8794de, 0x7b9a86c5, 0x769188cc, 0x55a0a2f3, 0x58abacfa, 0x4fb6bee1, 0x42bdb0e8, 0x09d4ea9f, 0x04dfe496, 0x13c2f68d, 0x1ec9f884, 0x3df8d2bb, 0x30f3dcb2, 0x27eecea9, 0x2ae5c0a0, 0xb13c7a47, 0xbc37744e, 0xab2a6655, 0xa621685c, 0x85104263, 0x881b4c6a, 0x9f065e71, 0x920d5078, 0xd9640a0f, 0xd46f0406, 0xc372161d, 0xce791814, 0xed48322b, 0xe0433c22, 0xf75e2e39, 0xfa552030, 0xb701ec9a, 0xba0ae293, 0xad17f088, 0xa01cfe81, 0x832dd4be, 0x8e26dab7, 0x993bc8ac, 0x9430c6a5, 0xdf599cd2, 0xd25292db, 0xc54f80c0, 0xc8448ec9, 0xeb75a4f6, 0xe67eaaff, 0xf163b8e4, 0xfc68b6ed, 0x67b10c0a, 0x6aba0203, 0x7da71018, 0x70ac1e11, 0x539d342e, 0x5e963a27, 0x498b283c, 0x44802635, 0x0fe97c42, 0x02e2724b, 0x15ff6050, 0x18f46e59, 0x3bc54466, 0x36ce4a6f, 0x21d35874, 0x2cd8567d, 0x0c7a37a1, 0x017139a8, 0x166c2bb3, 0x1b6725ba, 0x38560f85, 0x355d018c, 0x22401397, 0x2f4b1d9e, 0x642247e9, 0x692949e0, 0x7e345bfb, 0x733f55f2, 0x500e7fcd, 0x5d0571c4, 0x4a1863df, 0x47136dd6, 0xdccad731, 0xd1c1d938, 0xc6dccb23, 0xcbd7c52a, 0xe8e6ef15, 0xe5ede11c, 0xf2f0f307, 0xfffbfd0e, 0xb492a779, 0xb999a970, 0xae84bb6b, 0xa38fb562, 0x80be9f5d, 0x8db59154, 0x9aa8834f, 0x97a38d46];
    var U4 = [0x00000000, 0x090d0b0e, 0x121a161c, 0x1b171d12, 0x24342c38, 0x2d392736, 0x362e3a24, 0x3f23312a, 0x48685870, 0x4165537e, 0x5a724e6c, 0x537f4562, 0x6c5c7448, 0x65517f46, 0x7e466254, 0x774b695a, 0x90d0b0e0, 0x99ddbbee, 0x82caa6fc, 0x8bc7adf2, 0xb4e49cd8, 0xbde997d6, 0xa6fe8ac4, 0xaff381ca, 0xd8b8e890, 0xd1b5e39e, 0xcaa2fe8c, 0xc3aff582, 0xfc8cc4a8, 0xf581cfa6, 0xee96d2b4, 0xe79bd9ba, 0x3bbb7bdb, 0x32b670d5, 0x29a16dc7, 0x20ac66c9, 0x1f8f57e3, 0x16825ced, 0x0d9541ff, 0x04984af1, 0x73d323ab, 0x7ade28a5, 0x61c935b7, 0x68c43eb9, 0x57e70f93, 0x5eea049d, 0x45fd198f, 0x4cf01281, 0xab6bcb3b, 0xa266c035, 0xb971dd27, 0xb07cd629, 0x8f5fe703, 0x8652ec0d, 0x9d45f11f, 0x9448fa11, 0xe303934b, 0xea0e9845, 0xf1198557, 0xf8148e59, 0xc737bf73, 0xce3ab47d, 0xd52da96f, 0xdc20a261, 0x766df6ad, 0x7f60fda3, 0x6477e0b1, 0x6d7aebbf, 0x5259da95, 0x5b54d19b, 0x4043cc89, 0x494ec787, 0x3e05aedd, 0x3708a5d3, 0x2c1fb8c1, 0x2512b3cf, 0x1a3182e5, 0x133c89eb, 0x082b94f9, 0x01269ff7, 0xe6bd464d, 0xefb04d43, 0xf4a75051, 0xfdaa5b5f, 0xc2896a75, 0xcb84617b, 0xd0937c69, 0xd99e7767, 0xaed51e3d, 0xa7d81533, 0xbccf0821, 0xb5c2032f, 0x8ae13205, 0x83ec390b, 0x98fb2419, 0x91f62f17, 0x4dd68d76, 0x44db8678, 0x5fcc9b6a, 0x56c19064, 0x69e2a14e, 0x60efaa40, 0x7bf8b752, 0x72f5bc5c, 0x05bed506, 0x0cb3de08, 0x17a4c31a, 0x1ea9c814, 0x218af93e, 0x2887f230, 0x3390ef22, 0x3a9de42c, 0xdd063d96, 0xd40b3698, 0xcf1c2b8a, 0xc6112084, 0xf93211ae, 0xf03f1aa0, 0xeb2807b2, 0xe2250cbc, 0x956e65e6, 0x9c636ee8, 0x877473fa, 0x8e7978f4, 0xb15a49de, 0xb85742d0, 0xa3405fc2, 0xaa4d54cc, 0xecdaf741, 0xe5d7fc4f, 0xfec0e15d, 0xf7cdea53, 0xc8eedb79, 0xc1e3d077, 0xdaf4cd65, 0xd3f9c66b, 0xa4b2af31, 0xadbfa43f, 0xb6a8b92d, 0xbfa5b223, 0x80868309, 0x898b8807, 0x929c9515, 0x9b919e1b, 0x7c0a47a1, 0x75074caf, 0x6e1051bd, 0x671d5ab3, 0x583e6b99, 0x51336097, 0x4a247d85, 0x4329768b, 0x34621fd1, 0x3d6f14df, 0x267809cd, 0x2f7502c3, 0x105633e9, 0x195b38e7, 0x024c25f5, 0x0b412efb, 0xd7618c9a, 0xde6c8794, 0xc57b9a86, 0xcc769188, 0xf355a0a2, 0xfa58abac, 0xe14fb6be, 0xe842bdb0, 0x9f09d4ea, 0x9604dfe4, 0x8d13c2f6, 0x841ec9f8, 0xbb3df8d2, 0xb230f3dc, 0xa927eece, 0xa02ae5c0, 0x47b13c7a, 0x4ebc3774, 0x55ab2a66, 0x5ca62168, 0x63851042, 0x6a881b4c, 0x719f065e, 0x78920d50, 0x0fd9640a, 0x06d46f04, 0x1dc37216, 0x14ce7918, 0x2bed4832, 0x22e0433c, 0x39f75e2e, 0x30fa5520, 0x9ab701ec, 0x93ba0ae2, 0x88ad17f0, 0x81a01cfe, 0xbe832dd4, 0xb78e26da, 0xac993bc8, 0xa59430c6, 0xd2df599c, 0xdbd25292, 0xc0c54f80, 0xc9c8448e, 0xf6eb75a4, 0xffe67eaa, 0xe4f163b8, 0xedfc68b6, 0x0a67b10c, 0x036aba02, 0x187da710, 0x1170ac1e, 0x2e539d34, 0x275e963a, 0x3c498b28, 0x35448026, 0x420fe97c, 0x4b02e272, 0x5015ff60, 0x5918f46e, 0x663bc544, 0x6f36ce4a, 0x7421d358, 0x7d2cd856, 0xa10c7a37, 0xa8017139, 0xb3166c2b, 0xba1b6725, 0x8538560f, 0x8c355d01, 0x97224013, 0x9e2f4b1d, 0xe9642247, 0xe0692949, 0xfb7e345b, 0xf2733f55, 0xcd500e7f, 0xc45d0571, 0xdf4a1863, 0xd647136d, 0x31dccad7, 0x38d1c1d9, 0x23c6dccb, 0x2acbd7c5, 0x15e8e6ef, 0x1ce5ede1, 0x07f2f0f3, 0x0efffbfd, 0x79b492a7, 0x70b999a9, 0x6bae84bb, 0x62a38fb5, 0x5d80be9f, 0x548db591, 0x4f9aa883, 0x4697a38d];

    function convertToInt32(bytes) {
        var result = [];
        for (var i = 0; i < bytes.length; i += 4) {
            result.push(
                (bytes[i    ] << 24) |
                (bytes[i + 1] << 16) |
                (bytes[i + 2] <<  8) |
                 bytes[i + 3]
            );
        }
        return result;
    }

    var AES = function(key) {
        if (!(this instanceof AES)) {
            throw Error('AES must be instanitated with `new`');
        }

        Object.defineProperty(this, 'key', {
            value: coerceArray(key, true)
        });

        this._prepare();
    }


    AES.prototype._prepare = function() {

        var rounds = numberOfRounds[this.key.length];
        if (rounds == null) {
            throw new Error('invalid key size (must be 16, 24 or 32 bytes)');
        }

        // encryption round keys
        this._Ke = [];

        // decryption round keys
        this._Kd = [];

        for (var i = 0; i <= rounds; i++) {
            this._Ke.push([0, 0, 0, 0]);
            this._Kd.push([0, 0, 0, 0]);
        }

        var roundKeyCount = (rounds + 1) * 4;
        var KC = this.key.length / 4;

        // convert the key into ints
        var tk = convertToInt32(this.key);

        // copy values into round key arrays
        var index;
        for (var i = 0; i < KC; i++) {
            index = i >> 2;
            this._Ke[index][i % 4] = tk[i];
            this._Kd[rounds - index][i % 4] = tk[i];
        }

        // key expansion (fips-197 section 5.2)
        var rconpointer = 0;
        var t = KC, tt;
        while (t < roundKeyCount) {
            tt = tk[KC - 1];
            tk[0] ^= ((S[(tt >> 16) & 0xFF] << 24) ^
                      (S[(tt >>  8) & 0xFF] << 16) ^
                      (S[ tt        & 0xFF] <<  8) ^
                       S[(tt >> 24) & 0xFF]        ^
                      (rcon[rconpointer] << 24));
            rconpointer += 1;

            // key expansion (for non-256 bit)
            if (KC != 8) {
                for (var i = 1; i < KC; i++) {
                    tk[i] ^= tk[i - 1];
                }

            // key expansion for 256-bit keys is "slightly different" (fips-197)
            } else {
                for (var i = 1; i < (KC / 2); i++) {
                    tk[i] ^= tk[i - 1];
                }
                tt = tk[(KC / 2) - 1];

                tk[KC / 2] ^= (S[ tt        & 0xFF]        ^
                              (S[(tt >>  8) & 0xFF] <<  8) ^
                              (S[(tt >> 16) & 0xFF] << 16) ^
                              (S[(tt >> 24) & 0xFF] << 24));

                for (var i = (KC / 2) + 1; i < KC; i++) {
                    tk[i] ^= tk[i - 1];
                }
            }

            // copy values into round key arrays
            var i = 0, r, c;
            while (i < KC && t < roundKeyCount) {
                r = t >> 2;
                c = t % 4;
                this._Ke[r][c] = tk[i];
                this._Kd[rounds - r][c] = tk[i++];
                t++;
            }
        }

        // inverse-cipher-ify the decryption round key (fips-197 section 5.3)
        for (var r = 1; r < rounds; r++) {
            for (var c = 0; c < 4; c++) {
                tt = this._Kd[r][c];
                this._Kd[r][c] = (U1[(tt >> 24) & 0xFF] ^
                                  U2[(tt >> 16) & 0xFF] ^
                                  U3[(tt >>  8) & 0xFF] ^
                                  U4[ tt        & 0xFF]);
            }
        }
    }

    AES.prototype.encrypt = function(plaintext) {
        if (plaintext.length != 16) {
            throw new Error('invalid plaintext size (must be 16 bytes)');
        }

        var rounds = this._Ke.length - 1;
        var a = [0, 0, 0, 0];

        // convert plaintext to (ints ^ key)
        var t = convertToInt32(plaintext);
        for (var i = 0; i < 4; i++) {
            t[i] ^= this._Ke[0][i];
        }

        // apply round transforms
        for (var r = 1; r < rounds; r++) {
            for (var i = 0; i < 4; i++) {
                a[i] = (T1[(t[ i         ] >> 24) & 0xff] ^
                        T2[(t[(i + 1) % 4] >> 16) & 0xff] ^
                        T3[(t[(i + 2) % 4] >>  8) & 0xff] ^
                        T4[ t[(i + 3) % 4]        & 0xff] ^
                        this._Ke[r][i]);
            }
            t = a.slice();
        }

        // the last round is special
        var result = createArray(16), tt;
        for (var i = 0; i < 4; i++) {
            tt = this._Ke[rounds][i];
            result[4 * i    ] = (S[(t[ i         ] >> 24) & 0xff] ^ (tt >> 24)) & 0xff;
            result[4 * i + 1] = (S[(t[(i + 1) % 4] >> 16) & 0xff] ^ (tt >> 16)) & 0xff;
            result[4 * i + 2] = (S[(t[(i + 2) % 4] >>  8) & 0xff] ^ (tt >>  8)) & 0xff;
            result[4 * i + 3] = (S[ t[(i + 3) % 4]        & 0xff] ^  tt       ) & 0xff;
        }

        return result;
    }

    AES.prototype.decrypt = function(ciphertext) {
        if (ciphertext.length != 16) {
            throw new Error('invalid ciphertext size (must be 16 bytes)');
        }

        var rounds = this._Kd.length - 1;
        var a = [0, 0, 0, 0];

        // convert plaintext to (ints ^ key)
        var t = convertToInt32(ciphertext);
        for (var i = 0; i < 4; i++) {
            t[i] ^= this._Kd[0][i];
        }

        // apply round transforms
        for (var r = 1; r < rounds; r++) {
            for (var i = 0; i < 4; i++) {
                a[i] = (T5[(t[ i          ] >> 24) & 0xff] ^
                        T6[(t[(i + 3) % 4] >> 16) & 0xff] ^
                        T7[(t[(i + 2) % 4] >>  8) & 0xff] ^
                        T8[ t[(i + 1) % 4]        & 0xff] ^
                        this._Kd[r][i]);
            }
            t = a.slice();
        }

        // the last round is special
        var result = createArray(16), tt;
        for (var i = 0; i < 4; i++) {
            tt = this._Kd[rounds][i];
            result[4 * i    ] = (Si[(t[ i         ] >> 24) & 0xff] ^ (tt >> 24)) & 0xff;
            result[4 * i + 1] = (Si[(t[(i + 3) % 4] >> 16) & 0xff] ^ (tt >> 16)) & 0xff;
            result[4 * i + 2] = (Si[(t[(i + 2) % 4] >>  8) & 0xff] ^ (tt >>  8)) & 0xff;
            result[4 * i + 3] = (Si[ t[(i + 1) % 4]        & 0xff] ^  tt       ) & 0xff;
        }

        return result;
    }


    /**
     *  Mode Of Operation - Electonic Codebook (ECB)
     */
    var ModeOfOperationECB = function(key) {
        if (!(this instanceof ModeOfOperationECB)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Electronic Code Block";
        this.name = "ecb";

        this._aes = new AES(key);
    }

    ModeOfOperationECB.prototype.encrypt = function(plaintext) {
        plaintext = coerceArray(plaintext);

        if ((plaintext.length % 16) !== 0) {
            throw new Error('invalid plaintext size (must be multiple of 16 bytes)');
        }

        var ciphertext = createArray(plaintext.length);
        var block = createArray(16);

        for (var i = 0; i < plaintext.length; i += 16) {
            copyArray(plaintext, block, 0, i, i + 16);
            block = this._aes.encrypt(block);
            copyArray(block, ciphertext, i);
        }

        return ciphertext;
    }

    ModeOfOperationECB.prototype.decrypt = function(ciphertext) {
        ciphertext = coerceArray(ciphertext);

        if ((ciphertext.length % 16) !== 0) {
            throw new Error('invalid ciphertext size (must be multiple of 16 bytes)');
        }

        var plaintext = createArray(ciphertext.length);
        var block = createArray(16);

        for (var i = 0; i < ciphertext.length; i += 16) {
            copyArray(ciphertext, block, 0, i, i + 16);
            block = this._aes.decrypt(block);
            copyArray(block, plaintext, i);
        }

        return plaintext;
    }


    /**
     *  Mode Of Operation - Cipher Block Chaining (CBC)
     */
    var ModeOfOperationCBC = function(key, iv) {
        if (!(this instanceof ModeOfOperationCBC)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Cipher Block Chaining";
        this.name = "cbc";

        if (!iv) {
            iv = createArray(16);

        } else if (iv.length != 16) {
            throw new Error('invalid initialation vector size (must be 16 bytes)');
        }

        this._lastCipherblock = coerceArray(iv, true);

        this._aes = new AES(key);
    }

    ModeOfOperationCBC.prototype.encrypt = function(plaintext) {
        plaintext = coerceArray(plaintext);

        if ((plaintext.length % 16) !== 0) {
            throw new Error('invalid plaintext size (must be multiple of 16 bytes)');
        }

        var ciphertext = createArray(plaintext.length);
        var block = createArray(16);

        for (var i = 0; i < plaintext.length; i += 16) {
            copyArray(plaintext, block, 0, i, i + 16);

            for (var j = 0; j < 16; j++) {
                block[j] ^= this._lastCipherblock[j];
            }

            this._lastCipherblock = this._aes.encrypt(block);
            copyArray(this._lastCipherblock, ciphertext, i);
        }

        return ciphertext;
    }

    ModeOfOperationCBC.prototype.decrypt = function(ciphertext) {
        ciphertext = coerceArray(ciphertext);

        if ((ciphertext.length % 16) !== 0) {
            throw new Error('invalid ciphertext size (must be multiple of 16 bytes)');
        }

        var plaintext = createArray(ciphertext.length);
        var block = createArray(16);

        for (var i = 0; i < ciphertext.length; i += 16) {
            copyArray(ciphertext, block, 0, i, i + 16);
            block = this._aes.decrypt(block);

            for (var j = 0; j < 16; j++) {
                plaintext[i + j] = block[j] ^ this._lastCipherblock[j];
            }

            copyArray(ciphertext, this._lastCipherblock, 0, i, i + 16);
        }

        return plaintext;
    }


    /**
     *  Mode Of Operation - Cipher Feedback (CFB)
     */
    var ModeOfOperationCFB = function(key, iv, segmentSize) {
        if (!(this instanceof ModeOfOperationCFB)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Cipher Feedback";
        this.name = "cfb";

        if (!iv) {
            iv = createArray(16);

        } else if (iv.length != 16) {
            throw new Error('invalid initialation vector size (must be 16 size)');
        }

        if (!segmentSize) { segmentSize = 1; }

        this.segmentSize = segmentSize;

        this._shiftRegister = coerceArray(iv, true);

        this._aes = new AES(key);
    }

    ModeOfOperationCFB.prototype.encrypt = function(plaintext) {
        if ((plaintext.length % this.segmentSize) != 0) {
            throw new Error('invalid plaintext size (must be segmentSize bytes)');
        }

        var encrypted = coerceArray(plaintext, true);

        var xorSegment;
        for (var i = 0; i < encrypted.length; i += this.segmentSize) {
            xorSegment = this._aes.encrypt(this._shiftRegister);
            for (var j = 0; j < this.segmentSize; j++) {
                encrypted[i + j] ^= xorSegment[j];
            }

            // Shift the register
            copyArray(this._shiftRegister, this._shiftRegister, 0, this.segmentSize);
            copyArray(encrypted, this._shiftRegister, 16 - this.segmentSize, i, i + this.segmentSize);
        }

        return encrypted;
    }

    ModeOfOperationCFB.prototype.decrypt = function(ciphertext) {
        if ((ciphertext.length % this.segmentSize) != 0) {
            throw new Error('invalid ciphertext size (must be segmentSize bytes)');
        }

        var plaintext = coerceArray(ciphertext, true);

        var xorSegment;
        for (var i = 0; i < plaintext.length; i += this.segmentSize) {
            xorSegment = this._aes.encrypt(this._shiftRegister);

            for (var j = 0; j < this.segmentSize; j++) {
                plaintext[i + j] ^= xorSegment[j];
            }

            // Shift the register
            copyArray(this._shiftRegister, this._shiftRegister, 0, this.segmentSize);
            copyArray(ciphertext, this._shiftRegister, 16 - this.segmentSize, i, i + this.segmentSize);
        }

        return plaintext;
    }

    /**
     *  Mode Of Operation - Output Feedback (OFB)
     */
    var ModeOfOperationOFB = function(key, iv) {
        if (!(this instanceof ModeOfOperationOFB)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Output Feedback";
        this.name = "ofb";

        if (!iv) {
            iv = createArray(16);

        } else if (iv.length != 16) {
            throw new Error('invalid initialation vector size (must be 16 bytes)');
        }

        this._lastPrecipher = coerceArray(iv, true);
        this._lastPrecipherIndex = 16;

        this._aes = new AES(key);
    }

    ModeOfOperationOFB.prototype.encrypt = function(plaintext) {
        var encrypted = coerceArray(plaintext, true);

        for (var i = 0; i < encrypted.length; i++) {
            if (this._lastPrecipherIndex === 16) {
                this._lastPrecipher = this._aes.encrypt(this._lastPrecipher);
                this._lastPrecipherIndex = 0;
            }
            encrypted[i] ^= this._lastPrecipher[this._lastPrecipherIndex++];
        }

        return encrypted;
    }

    // Decryption is symetric
    ModeOfOperationOFB.prototype.decrypt = ModeOfOperationOFB.prototype.encrypt;


    /**
     *  Counter object for CTR common mode of operation
     */
    var Counter = function(initialValue) {
        if (!(this instanceof Counter)) {
            throw Error('Counter must be instanitated with `new`');
        }

        // We allow 0, but anything false-ish uses the default 1
        if (initialValue !== 0 && !initialValue) { initialValue = 1; }

        if (typeof(initialValue) === 'number') {
            this._counter = createArray(16);
            this.setValue(initialValue);

        } else {
            this.setBytes(initialValue);
        }
    }

    Counter.prototype.setValue = function(value) {
        if (typeof(value) !== 'number' || parseInt(value) != value) {
            throw new Error('invalid counter value (must be an integer)');
        }

        // We cannot safely handle numbers beyond the safe range for integers
        if (value > Number.MAX_SAFE_INTEGER) {
            throw new Error('integer value out of safe range');
        }

        for (var index = 15; index >= 0; --index) {
            this._counter[index] = value % 256;
            value = parseInt(value / 256);
        }
    }

    Counter.prototype.setBytes = function(bytes) {
        bytes = coerceArray(bytes, true);

        if (bytes.length != 16) {
            throw new Error('invalid counter bytes size (must be 16 bytes)');
        }

        this._counter = bytes;
    };

    Counter.prototype.increment = function() {
        for (var i = 15; i >= 0; i--) {
            if (this._counter[i] === 255) {
                this._counter[i] = 0;
            } else {
                this._counter[i]++;
                break;
            }
        }
    }


    /**
     *  Mode Of Operation - Counter (CTR)
     */
    var ModeOfOperationCTR = function(key, counter) {
        if (!(this instanceof ModeOfOperationCTR)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Counter";
        this.name = "ctr";

        if (!(counter instanceof Counter)) {
            counter = new Counter(counter)
        }

        this._counter = counter;

        this._remainingCounter = null;
        this._remainingCounterIndex = 16;

        this._aes = new AES(key);
    }

    ModeOfOperationCTR.prototype.encrypt = function(plaintext) {
        var encrypted = coerceArray(plaintext, true);

        for (var i = 0; i < encrypted.length; i++) {
            if (this._remainingCounterIndex === 16) {
                this._remainingCounter = this._aes.encrypt(this._counter._counter);
                this._remainingCounterIndex = 0;
                this._counter.increment();
            }
            encrypted[i] ^= this._remainingCounter[this._remainingCounterIndex++];
        }

        return encrypted;
    }

    // Decryption is symetric
    ModeOfOperationCTR.prototype.decrypt = ModeOfOperationCTR.prototype.encrypt;


    ///////////////////////
    // Padding

    // See:https://tools.ietf.org/html/rfc2315
    function pkcs7pad(data) {
        data = coerceArray(data, true);
        var padder = 16 - (data.length % 16);
        var result = createArray(data.length + padder);
        copyArray(data, result);
        for (var i = data.length; i < result.length; i++) {
            result[i] = padder;
        }
        return result;
    }

    function pkcs7strip(data) {
        data = coerceArray(data, true);
        if (data.length < 16) { throw new Error('PKCS#7 invalid length'); }

        var padder = data[data.length - 1];
        if (padder > 16) { throw new Error('PKCS#7 padding byte out of range'); }

        var length = data.length - padder;
        for (var i = 0; i < padder; i++) {
            if (data[length + i] !== padder) {
                throw new Error('PKCS#7 invalid padding byte');
            }
        }

        var result = createArray(length);
        copyArray(data, result, 0, 0, length);
        return result;
    }

    ///////////////////////
    // Exporting


    // The block cipher
    var aesjs = {
        AES: AES,
        Counter: Counter,

        ModeOfOperation: {
            ecb: ModeOfOperationECB,
            cbc: ModeOfOperationCBC,
            cfb: ModeOfOperationCFB,
            ofb: ModeOfOperationOFB,
            ctr: ModeOfOperationCTR
        },

        utils: {
            hex: convertHex,
            utf8: convertUtf8
        },

        padding: {
            pkcs7: {
                pad: pkcs7pad,
                strip: pkcs7strip
            }
        },

        _arrayTest: {
            coerceArray: coerceArray,
            createArray: createArray,
            copyArray: copyArray,
        }
    };


    // node.js
    if (typeof exports !== 'undefined') {
        module.exports = aesjs

    // RequireJS/AMD
    // http://www.requirejs.org/docs/api.html
    // https://github.com/amdjs/amdjs-api/wiki/AMD
    } else if (typeof(define) === 'function' && define.amd) {
        define([], function() { return aesjs; });

    // Web Browsers
    } else {

        // If there was an existing library at "aesjs" make sure it's still available
        if (root.aesjs) {
            aesjs._aesjs = root.aesjs;
        }

        root.aesjs = aesjs;
    }


})(this);

},{}],"Gk9W":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var aesjs = require("aes-js");

var PkgAesCounter =
/** @class */
function () {
  function PkgAesCounter(key, iv) {
    this.keySize = 128;
    this.blockOffset = -1;
    this.aes = null;
    this.key = key;
    this.iv = iv;
  }

  PkgAesCounter.prototype.setOffset = function (offset) {
    if (offset === this.blockOffset) {
      return;
    }

    var startCounter = this.iv;
    this.blockOffset = 0;
    var count = offset / 16;

    if (count > 0) {
      startCounter += count;
      this.blockOffset += count * 16;
    }

    if (this.aes) {
      this.aes = null;
    }

    var counter = new aesjs.Counter(startCounter);
    this.aes = new aesjs.ModeOfOperation.ctr(this.key, counter);
  };

  PkgAesCounter.prototype.decrypt = function (offset, data) {
    this.setOffset(offset);
    this.blockOffset += data.length;
    var decryptedData = this.aes.decrypt(data);
    return decryptedData;
  };

  return PkgAesCounter;
}();

exports.PkgAesCounter = PkgAesCounter;
},{"aes-js":"ilr3"}],"DUt7":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var Slicer =
/** @class */
function () {
  function Slicer(buffer) {
    this.offset = 0;
    this.buffer = buffer;
  }

  Slicer.prototype.get = function (size, fromOffset) {
    if (fromOffset) {
      var endOffset = fromOffset + size;
      var slice_1 = this.buffer.slice(fromOffset, endOffset);
      this.offset = endOffset;
      return slice_1;
    }

    var slice = this.buffer.slice(this.offset, this.offset + size);
    this.offset += size;
    return slice;
  };

  Slicer.prototype.setOffset = function (offset) {
    this.offset = offset;
  };

  return Slicer;
}();

exports.Slicer = Slicer;
},{}],"GnoI":[function(require,module,exports) {
var define;
(function (root, factory) {
    // Hack to make all exports of this module sha256 function object properties.
    var exports = {};
    factory(exports);
    var sha256 = exports["default"];
    for (var k in exports) {
        sha256[k] = exports[k];
    }
        
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = sha256;
    } else if (typeof define === 'function' && define.amd) {
        define(function() { return sha256; }); 
    } else {
        root.sha256 = sha256;
    }
})(this, function(exports) {
"use strict";
exports.__esModule = true;
// SHA-256 (+ HMAC and PBKDF2) for JavaScript.
//
// Written in 2014-2016 by Dmitry Chestnykh.
// Public domain, no warranty.
//
// Functions (accept and return Uint8Arrays):
//
//   sha256(message) -> hash
//   sha256.hmac(key, message) -> mac
//   sha256.pbkdf2(password, salt, rounds, dkLen) -> dk
//
//  Classes:
//
//   new sha256.Hash()
//   new sha256.HMAC(key)
//
exports.digestLength = 32;
exports.blockSize = 64;
// SHA-256 constants
var K = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b,
    0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01,
    0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7,
    0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
    0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152,
    0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc,
    0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819,
    0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08,
    0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f,
    0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
]);
function hashBlocks(w, v, p, pos, len) {
    var a, b, c, d, e, f, g, h, u, i, j, t1, t2;
    while (len >= 64) {
        a = v[0];
        b = v[1];
        c = v[2];
        d = v[3];
        e = v[4];
        f = v[5];
        g = v[6];
        h = v[7];
        for (i = 0; i < 16; i++) {
            j = pos + i * 4;
            w[i] = (((p[j] & 0xff) << 24) | ((p[j + 1] & 0xff) << 16) |
                ((p[j + 2] & 0xff) << 8) | (p[j + 3] & 0xff));
        }
        for (i = 16; i < 64; i++) {
            u = w[i - 2];
            t1 = (u >>> 17 | u << (32 - 17)) ^ (u >>> 19 | u << (32 - 19)) ^ (u >>> 10);
            u = w[i - 15];
            t2 = (u >>> 7 | u << (32 - 7)) ^ (u >>> 18 | u << (32 - 18)) ^ (u >>> 3);
            w[i] = (t1 + w[i - 7] | 0) + (t2 + w[i - 16] | 0);
        }
        for (i = 0; i < 64; i++) {
            t1 = (((((e >>> 6 | e << (32 - 6)) ^ (e >>> 11 | e << (32 - 11)) ^
                (e >>> 25 | e << (32 - 25))) + ((e & f) ^ (~e & g))) | 0) +
                ((h + ((K[i] + w[i]) | 0)) | 0)) | 0;
            t2 = (((a >>> 2 | a << (32 - 2)) ^ (a >>> 13 | a << (32 - 13)) ^
                (a >>> 22 | a << (32 - 22))) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
            h = g;
            g = f;
            f = e;
            e = (d + t1) | 0;
            d = c;
            c = b;
            b = a;
            a = (t1 + t2) | 0;
        }
        v[0] += a;
        v[1] += b;
        v[2] += c;
        v[3] += d;
        v[4] += e;
        v[5] += f;
        v[6] += g;
        v[7] += h;
        pos += 64;
        len -= 64;
    }
    return pos;
}
// Hash implements SHA256 hash algorithm.
var Hash = /** @class */ (function () {
    function Hash() {
        this.digestLength = exports.digestLength;
        this.blockSize = exports.blockSize;
        // Note: Int32Array is used instead of Uint32Array for performance reasons.
        this.state = new Int32Array(8); // hash state
        this.temp = new Int32Array(64); // temporary state
        this.buffer = new Uint8Array(128); // buffer for data to hash
        this.bufferLength = 0; // number of bytes in buffer
        this.bytesHashed = 0; // number of total bytes hashed
        this.finished = false; // indicates whether the hash was finalized
        this.reset();
    }
    // Resets hash state making it possible
    // to re-use this instance to hash other data.
    Hash.prototype.reset = function () {
        this.state[0] = 0x6a09e667;
        this.state[1] = 0xbb67ae85;
        this.state[2] = 0x3c6ef372;
        this.state[3] = 0xa54ff53a;
        this.state[4] = 0x510e527f;
        this.state[5] = 0x9b05688c;
        this.state[6] = 0x1f83d9ab;
        this.state[7] = 0x5be0cd19;
        this.bufferLength = 0;
        this.bytesHashed = 0;
        this.finished = false;
        return this;
    };
    // Cleans internal buffers and re-initializes hash state.
    Hash.prototype.clean = function () {
        for (var i = 0; i < this.buffer.length; i++) {
            this.buffer[i] = 0;
        }
        for (var i = 0; i < this.temp.length; i++) {
            this.temp[i] = 0;
        }
        this.reset();
    };
    // Updates hash state with the given data.
    //
    // Optionally, length of the data can be specified to hash
    // fewer bytes than data.length.
    //
    // Throws error when trying to update already finalized hash:
    // instance must be reset to use it again.
    Hash.prototype.update = function (data, dataLength) {
        if (dataLength === void 0) { dataLength = data.length; }
        if (this.finished) {
            throw new Error("SHA256: can't update because hash was finished.");
        }
        var dataPos = 0;
        this.bytesHashed += dataLength;
        if (this.bufferLength > 0) {
            while (this.bufferLength < 64 && dataLength > 0) {
                this.buffer[this.bufferLength++] = data[dataPos++];
                dataLength--;
            }
            if (this.bufferLength === 64) {
                hashBlocks(this.temp, this.state, this.buffer, 0, 64);
                this.bufferLength = 0;
            }
        }
        if (dataLength >= 64) {
            dataPos = hashBlocks(this.temp, this.state, data, dataPos, dataLength);
            dataLength %= 64;
        }
        while (dataLength > 0) {
            this.buffer[this.bufferLength++] = data[dataPos++];
            dataLength--;
        }
        return this;
    };
    // Finalizes hash state and puts hash into out.
    //
    // If hash was already finalized, puts the same value.
    Hash.prototype.finish = function (out) {
        if (!this.finished) {
            var bytesHashed = this.bytesHashed;
            var left = this.bufferLength;
            var bitLenHi = (bytesHashed / 0x20000000) | 0;
            var bitLenLo = bytesHashed << 3;
            var padLength = (bytesHashed % 64 < 56) ? 64 : 128;
            this.buffer[left] = 0x80;
            for (var i = left + 1; i < padLength - 8; i++) {
                this.buffer[i] = 0;
            }
            this.buffer[padLength - 8] = (bitLenHi >>> 24) & 0xff;
            this.buffer[padLength - 7] = (bitLenHi >>> 16) & 0xff;
            this.buffer[padLength - 6] = (bitLenHi >>> 8) & 0xff;
            this.buffer[padLength - 5] = (bitLenHi >>> 0) & 0xff;
            this.buffer[padLength - 4] = (bitLenLo >>> 24) & 0xff;
            this.buffer[padLength - 3] = (bitLenLo >>> 16) & 0xff;
            this.buffer[padLength - 2] = (bitLenLo >>> 8) & 0xff;
            this.buffer[padLength - 1] = (bitLenLo >>> 0) & 0xff;
            hashBlocks(this.temp, this.state, this.buffer, 0, padLength);
            this.finished = true;
        }
        for (var i = 0; i < 8; i++) {
            out[i * 4 + 0] = (this.state[i] >>> 24) & 0xff;
            out[i * 4 + 1] = (this.state[i] >>> 16) & 0xff;
            out[i * 4 + 2] = (this.state[i] >>> 8) & 0xff;
            out[i * 4 + 3] = (this.state[i] >>> 0) & 0xff;
        }
        return this;
    };
    // Returns the final hash digest.
    Hash.prototype.digest = function () {
        var out = new Uint8Array(this.digestLength);
        this.finish(out);
        return out;
    };
    // Internal function for use in HMAC for optimization.
    Hash.prototype._saveState = function (out) {
        for (var i = 0; i < this.state.length; i++) {
            out[i] = this.state[i];
        }
    };
    // Internal function for use in HMAC for optimization.
    Hash.prototype._restoreState = function (from, bytesHashed) {
        for (var i = 0; i < this.state.length; i++) {
            this.state[i] = from[i];
        }
        this.bytesHashed = bytesHashed;
        this.finished = false;
        this.bufferLength = 0;
    };
    return Hash;
}());
exports.Hash = Hash;
// HMAC implements HMAC-SHA256 message authentication algorithm.
var HMAC = /** @class */ (function () {
    function HMAC(key) {
        this.inner = new Hash();
        this.outer = new Hash();
        this.blockSize = this.inner.blockSize;
        this.digestLength = this.inner.digestLength;
        var pad = new Uint8Array(this.blockSize);
        if (key.length > this.blockSize) {
            (new Hash()).update(key).finish(pad).clean();
        }
        else {
            for (var i = 0; i < key.length; i++) {
                pad[i] = key[i];
            }
        }
        for (var i = 0; i < pad.length; i++) {
            pad[i] ^= 0x36;
        }
        this.inner.update(pad);
        for (var i = 0; i < pad.length; i++) {
            pad[i] ^= 0x36 ^ 0x5c;
        }
        this.outer.update(pad);
        this.istate = new Uint32Array(8);
        this.ostate = new Uint32Array(8);
        this.inner._saveState(this.istate);
        this.outer._saveState(this.ostate);
        for (var i = 0; i < pad.length; i++) {
            pad[i] = 0;
        }
    }
    // Returns HMAC state to the state initialized with key
    // to make it possible to run HMAC over the other data with the same
    // key without creating a new instance.
    HMAC.prototype.reset = function () {
        this.inner._restoreState(this.istate, this.inner.blockSize);
        this.outer._restoreState(this.ostate, this.outer.blockSize);
        return this;
    };
    // Cleans HMAC state.
    HMAC.prototype.clean = function () {
        for (var i = 0; i < this.istate.length; i++) {
            this.ostate[i] = this.istate[i] = 0;
        }
        this.inner.clean();
        this.outer.clean();
    };
    // Updates state with provided data.
    HMAC.prototype.update = function (data) {
        this.inner.update(data);
        return this;
    };
    // Finalizes HMAC and puts the result in out.
    HMAC.prototype.finish = function (out) {
        if (this.outer.finished) {
            this.outer.finish(out);
        }
        else {
            this.inner.finish(out);
            this.outer.update(out, this.digestLength).finish(out);
        }
        return this;
    };
    // Returns message authentication code.
    HMAC.prototype.digest = function () {
        var out = new Uint8Array(this.digestLength);
        this.finish(out);
        return out;
    };
    return HMAC;
}());
exports.HMAC = HMAC;
// Returns SHA256 hash of data.
function hash(data) {
    var h = (new Hash()).update(data);
    var digest = h.digest();
    h.clean();
    return digest;
}
exports.hash = hash;
// Function hash is both available as module.hash and as default export.
exports["default"] = hash;
// Returns HMAC-SHA256 of data under the key.
function hmac(key, data) {
    var h = (new HMAC(key)).update(data);
    var digest = h.digest();
    h.clean();
    return digest;
}
exports.hmac = hmac;
// Derives a key from password and salt using PBKDF2-HMAC-SHA256
// with the given number of iterations.
//
// The number of bytes returned is equal to dkLen.
//
// (For better security, avoid dkLen greater than hash length - 32 bytes).
function pbkdf2(password, salt, iterations, dkLen) {
    var prf = new HMAC(password);
    var len = prf.digestLength;
    var ctr = new Uint8Array(4);
    var t = new Uint8Array(len);
    var u = new Uint8Array(len);
    var dk = new Uint8Array(dkLen);
    for (var i = 0; i * len < dkLen; i++) {
        var c = i + 1;
        ctr[0] = (c >>> 24) & 0xff;
        ctr[1] = (c >>> 16) & 0xff;
        ctr[2] = (c >>> 8) & 0xff;
        ctr[3] = (c >>> 0) & 0xff;
        prf.reset();
        prf.update(salt);
        prf.update(ctr);
        prf.finish(u);
        for (var j = 0; j < len; j++) {
            t[j] = u[j];
        }
        for (var j = 2; j <= iterations; j++) {
            prf.reset();
            prf.update(u).finish(u);
            for (var k = 0; k < len; k++) {
                t[k] ^= u[k];
            }
        }
        for (var j = 0; j < len && i * len + j < dkLen; j++) {
            dk[i * len + j] = t[j];
        }
    }
    for (var i = 0; i < len; i++) {
        t[i] = u[i] = 0;
    }
    for (var i = 0; i < 4; i++) {
        ctr[i] = 0;
    }
    prf.clean();
    return dk;
}
exports.pbkdf2 = pbkdf2;
});

},{}],"hEtP":[function(require,module,exports) {
var process = require("process");
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

},{"process":"yK1t"}],"UQvq":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

exports.__esModule = true;

var PkgReader_1 = require("./PkgReader");

var PkgAesCounter_1 = require("./PkgAesCounter");

var Slicer_1 = require("./Slicer");

var fast_sha256_1 = require("fast-sha256");

var aesjs = require("aes-js");

var path = require("path");

var PBPItemEntry =
/** @class */
function () {
  function PBPItemEntry(init) {
    this.name = '';
    this.isFileOfs = -1;
    this.dataOfs = init.dataOfs;
    this.dataSize = init.dataSize;
    this.index = init.index; // this.align = calculateAesAlignedOffsetAndSize(this.dataOfs, this.dataSize)
  }

  return PBPItemEntry;
}();

var PKG3ItemEntry =
/** @class */
function () {
  function PKG3ItemEntry(init) {
    this.name = '';
    this.isFileOfs = -1;
    this.itemNameOfs = init.itemNameOfs;
    this.itemNameSize = init.itemNameSize;
    this.dataOfs = init.dataOfs;
    this.dataSize = init.dataSize;
    this.flags = init.flags;
    this.padding1 = init.padding1;
    this.index = init.index;
    this.keyIndex = this.flags >> 28 & 0x7;
    this.align = calculateAesAlignedOffsetAndSize(this.dataOfs, this.dataSize);
  }

  return PKG3ItemEntry;
}();

var CONST_PKG3_MAGIC = 0x7f504b47;
var CONST_PKG3_HEADER_SIZE = 128;
var CONST_PKG3_HEADER_EXT_SIZE = 64;
var CONST_PKG3_DIGEST_SIZE = 64;
var CONST_PKG3_ITEM_ENTRY_SIZE = 32;
var CONST_PKG3_EXT_MAGIC = 0x7f657874;
var CONST_PKG3_CONTENT_KEYS = [{
  key: new Uint8Array([0x2e, 0x7b, 0x71, 0xd7, 0xc9, 0xc9, 0xa1, 0x4e, 0xa3, 0x22, 0x1f, 0x18, 0x88, 0x28, 0xb8, 0xf8]),
  // key: 'Lntx18nJoU6jIh8YiCi4+A==',
  desc: 'PS3'
}, {
  key: new Uint8Array([0x07, 0xf2, 0xc6, 0x82, 0x90, 0xb5, 0x0d, 0x2c, 0x33, 0x81, 0x8d, 0x70, 0x9b, 0x60, 0xe6, 0x2b]),
  // key: 'B/LGgpC1DSwzgY1wm2DmKw==',
  desc: 'PSX/PSP'
}, {
  key: new Uint8Array([0xe3, 0x1a, 0x70, 0xc9, 0xce, 0x1d, 0xd7, 0x2b, 0xf3, 0xc0, 0x62, 0x29, 0x63, 0xf2, 0xec, 0xcb]),
  // key: '4xpwyc4d1yvzwGIpY/Lsyw==',
  desc: 'PSV',
  derive: true
}, {
  key: new Uint8Array([0x42, 0x3a, 0xca, 0x3a, 0x2b, 0xd5, 0x64, 0x9f, 0x96, 0x86, 0xab, 0xad, 0x6f, 0xd8, 0x80, 0x1f]),
  // key: 'QjrKOivVZJ+Whqutb9iAHw==',
  desc: 'Unknown',
  derive: true
}, {
  key: new Uint8Array([0xaf, 0x07, 0xfd, 0x59, 0x65, 0x25, 0x27, 0xba, 0xf1, 0x33, 0x89, 0x66, 0x8b, 0x17, 0xd9, 0xea]),
  // key: 'rwf9WWUlJ7rxM4lmixfZ6g==',
  desc: 'PSM',
  derive: true
}];
var CONST_PKG3_UPDATE_KEYS = {
  2: {
    key: new Uint8Array([0xE5, 0xE2, 0x78, 0xAA, 0x1E, 0xE3, 0x40, 0x82, 0xA0, 0x88, 0x27, 0x9C, 0x83, 0xF9, 0xBB, 0xC8, 0x06, 0x82, 0x1C, 0x52, 0xF2, 0xAB, 0x5D, 0x2B, 0x4A, 0xBD, 0x99, 0x54, 0x50, 0x35, 0x51, 0x14]),
    desc: 'PSV'
  }
};
var CONST_PKG4_MAIN_HEADER_SIZE = 1440;
var CONST_PKG4_FILE_ENTRY_SIZE = 32;
var CONST_PKG4_MAGIC = 0x7f434e54;
var CONST_PKG4_FILE_ENTRY_ID_DIGEST_TABLE = 0x0001;
var CONST_PKG4_FILE_ENTRY_ID_ENTRY_KEYS = 0x0010;
var CONST_PKG4_FILE_ENTRY_ID_IMAGE_KEY = 0x0020;
var CONST_PKG4_FILE_ENTRY_ID_GENERAL_DIGESTS = 0x0080;
var CONST_PKG4_FILE_ENTRY_ID_META_TABLE = 0x0100;
var CONST_PKG4_FILE_ENTRY_ID_NAME_TABLE = 0x0200;
var CONST_PKG4_FILE_ENTRY_ID_PARAM_SFO = 0x1000;
var CONST_PKG4_FILE_ENTRY_NAME_MAP = {
  CONST_PKG4_FILE_ENTRY_ID_DIGEST_TABLE: '.digests',
  CONST_PKG4_FILE_ENTRY_ID_ENTRY_KEYS: '.entry_keys',
  CONST_PKG4_FILE_ENTRY_ID_IMAGE_KEY: '.image_key',
  CONST_PKG4_FILE_ENTRY_ID_GENERAL_DIGESTS: '.general_digests',
  CONST_PKG4_FILE_ENTRY_ID_META_TABLE: '.metatable',
  CONST_PKG4_FILE_ENTRY_ID_NAME_TABLE: '.nametable',
  0x0400: 'license.dat',
  0x0401: 'license.info',
  0x0402: 'nptitle.dat',
  0x0403: 'npbind.dat',
  0x0404: 'selfinfo.dat',
  0x0406: 'imageinfo.dat',
  0x0407: 'target-deltainfo.dat',
  0x0408: 'origin-deltainfo.dat',
  0x0409: 'psreserved.dat',
  CONST_PKG4_FILE_ENTRY_ID_PARAM_SFO: 'param.sfo',
  0x1001: 'playgo-chunk.dat',
  0x1002: 'playgo-chunk.sha',
  0x1003: 'playgo-manifest.xml',
  0x1004: 'pronunciation.xml',
  0x1005: 'pronunciation.sig',
  0x1006: 'pic1.png',
  0x1007: 'pubtoolinfo.dat',
  0x1008: 'app/playgo-chunk.dat',
  0x1009: 'app/playgo-chunk.sha',
  0x100a: 'app/playgo-manifest.xml',
  0x100b: 'shareparam.json',
  0x100c: 'shareoverlayimage.png',
  0x100d: 'save_data.png',
  0x100e: 'shareprivacyguardimage.png',
  0x1200: 'icon0.png',
  0x1220: 'pic0.png',
  0x1240: 'snd0.at9',
  0x1260: 'changeinfo/changeinfo.xml',
  0x1280: 'icon0.dds',
  0x12a0: 'pic0.dds',
  0x12c0: 'pic1.dds'
};
var CONST_PARAM_SFO_MAGIC = 0x00505346;
var CONST_SFO_HEADER_SIZE = 20;
var CONST_SFO_INDEX_ENTRY_SIZE = 16;
var CONST_PBP_HEADER_SIZE = 40;
var CONST_PBP_MAGIC = 0x00504250;
var CONST_REGEX_PBP_SUFFIX = /\.PBP$/i;
var CONST_PSP_PSV_RIF_SIZE = 512;
var CONST_PSM_RIF_SIZE = 1024;
var CONST_DATATYPE_AS_IS = 'AS-IS';
var CONST_DATATYPE_DECRYPTED = 'DECRYPTED';
var CONST_DATATYPE_UNENCRYPTED = 'UNENCRYPTED';
var CONST_CONTENT_ID_SIZE = 0x30;
var CONST_SHA256_HASH_SIZE = 0x20;

var CONST_READ_SIZE = function () {
  var min = Math.ceil(50);
  var max = Math.floor(100);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}();

var CONST_READ_AHEAD_SIZE = 128 * 0x400;
var REPLACE_LIST = [['™®☆◆', ' '], ['—–', '-']];

var GetInfo =
/** @class */
function () {
  function GetInfo(options) {
    this.options = options;
  }

  GetInfo.prototype.pkg = function (url) {
    return __awaiter(this, void 0, void 0, function () {
      var sfoBytes, pkgHeader, pkgExtHeader, pkgMetadata, pkgSfoValues, pkgItemEntries, pkgFileTable, pkgFileTableMap, itemSfoValues, pbpHeader, pbpItemEntries, pbpSfoValues, npsType, mainSfoValues, results, pkg, _a, e_1, magic, _b, _c, _d, _e, parsedHeader, parsedItems, retrieveEncryptedParamSfo, _i, pkgItemEntries_1, itemEntry, itemIndex, sfoMagic, pbpBytes, parsedPBP, _f, e_2, parsedPbpHeader, r, _g, _h, language, key, _j, REPLACE_LIST_1, replaceChars, i, replaceChar, _k, _l, language, key, _m, REPLACE_LIST_2, replaceChars, i, replaceChar, updateHash, data, updateHash, data, sfoValues, jsonOutput;

      return __generator(this, function (_o) {
        switch (_o.label) {
          case 0:
            return [4
            /*yield*/
            , this.initReader(url)];

          case 1:
            _o.sent();

            pkgHeader = null;
            pkgExtHeader = null;
            pkgMetadata = null;
            pkgSfoValues = null;
            pkgItemEntries = null;
            pkgFileTable = null;
            pkgFileTableMap = null;
            itemSfoValues = null;
            pbpHeader = null;
            pbpItemEntries = null;
            pbpSfoValues = null;
            npsType = 'UNKNOWN';
            mainSfoValues = null;
            results = {};
            pkg = {
              headBytes: Buffer.from([]),
              tailBytes: Buffer.from([])
            };
            _o.label = 2;

          case 2:
            _o.trys.push([2, 4,, 5]);

            _a = pkg;
            return [4
            /*yield*/
            , this.reader.read(0, 4)];

          case 3:
            _a.headBytes = _o.sent();
            this.reader.close();
            return [3
            /*break*/
            , 5];

          case 4:
            e_1 = _o.sent();
            console.error(e_1);
            this.reader.close();
            throw new Error("Could not get PKG magic at offset 0 with size 4 from " + this.reader.getSource());

          case 5:
            magic = pkg.headBytes.toString('hex');
            if (!(magic === CONST_PKG3_MAGIC.toString(16))) return [3
            /*break*/
            , 25];
            pkg.itemsInfoBytes = {};
            pkg.itemBytes = {};
            _b = pkg;
            _d = (_c = Buffer).concat;
            _e = [pkg.headBytes];
            return [4
            /*yield*/
            , this.reader.read(4, CONST_PKG3_HEADER_SIZE - 4)];

          case 6:
            _b.headBytes = _d.apply(_c, [_e.concat([_o.sent()])]);
            return [4
            /*yield*/
            , parsePkg3Header(pkg.headBytes, this.reader)];

          case 7:
            parsedHeader = _o.sent();
            pkgHeader = parsedHeader.pkgHeader;
            pkgExtHeader = parsedHeader.pkgExtHeader;
            pkgMetadata = parsedHeader.pkgMetadata;
            pkg.headBytes = parsedHeader.headBytes;

            if (pkgHeader.totalSize) {
              results.pkgTotalSize = parseInt(pkgHeader.totalSize.toString('hex'), 16);
            }

            if (pkgHeader.contentId) {
              results.pkgContentId = pkgHeader.contentId;
              results.pkgCidTitleId1 = pkgHeader.contentId.substr(7, 16);
              results.pkgCidTitleId2 = pkgHeader.contentId.substr(20);
            }

            if (pkgMetadata[0x0e]) {
              results.pkgSfoOffset = pkgMetadata[0x0e].ofs;
              results.pkgSfoSize = pkgMetadata[0x0e].size;
            }

            if (pkgMetadata[0x01]) {
              results.pkgDrmType = pkgMetadata[0x01].value;
            }

            if (pkgMetadata[0x02]) {
              results.pkgContentType = pkgMetadata[0x02].value;
            }

            if (pkgMetadata[0x06]) {
              results.mdTitleId = pkgMetadata[0x06].value;
            }

            if (!results.pkgSfoOffset) return [3
            /*break*/
            , 10];
            return [4
            /*yield*/
            , retrieveParamSfo(pkg, results, this.reader) // const sfoMagic = sfoBytes.readUInt32BE(0)
            // const sfoMagic = buf2Int(sfoBytes.slice(0, 4), 16)
            // if (sfoMagic !== CONST_PARAM_SFO_MAGIC) {
            //   this.reader.close()
            //   throw new Error(`Not a known PARAM.SFO structure`)
            // }
            ];

          case 8:
            sfoBytes = _o.sent(); // const sfoMagic = sfoBytes.readUInt32BE(0)
            // const sfoMagic = buf2Int(sfoBytes.slice(0, 4), 16)
            // if (sfoMagic !== CONST_PARAM_SFO_MAGIC) {
            //   this.reader.close()
            //   throw new Error(`Not a known PARAM.SFO structure`)
            // }

            checkSfoMagic(sfoBytes.slice(0, 4), this.reader);
            return [4
            /*yield*/
            , parseSfo(sfoBytes)];

          case 9:
            pkgSfoValues = _o.sent();
            _o.label = 10;

          case 10:
            if (!(pkgHeader.keyIndex !== null)) return [3
            /*break*/
            , 12];
            return [4
            /*yield*/
            , parsePkg3ItemsInfo(pkgHeader, pkgMetadata, this.reader)];

          case 11:
            parsedItems = _o.sent();
            pkg.itemsInfoBytes = parsedItems.itemsInfoBytes;
            pkgItemEntries = parsedItems.pkgItemEntries;
            results.itemsInfo = pkg.itemsInfoBytes;

            if (results.itemsInfo[CONST_DATATYPE_AS_IS]) {
              delete results.itemsInfo[CONST_DATATYPE_AS_IS];
            }

            if (results.itemsInfo[CONST_DATATYPE_DECRYPTED]) {
              delete results.itemsInfo[CONST_DATATYPE_DECRYPTED];
            }

            _o.label = 12;

          case 12:
            if (!pkgItemEntries) return [3
            /*break*/
            , 20];
            retrieveEncryptedParamSfo = false;

            if (pkgHeader.paramSfo) {
              retrieveEncryptedParamSfo = true;
            }

            _i = 0, pkgItemEntries_1 = pkgItemEntries;
            _o.label = 13;

          case 13:
            if (!(_i < pkgItemEntries_1.length)) return [3
            /*break*/
            , 20];
            itemEntry = pkgItemEntries_1[_i];

            if (!itemEntry.name || itemEntry.dataSize <= 0) {
              return [3
              /*break*/
              , 19];
            }

            itemIndex = itemEntry.index;
            if (!(retrieveEncryptedParamSfo && itemEntry.name === pkgHeader.paramSfo)) return [3
            /*break*/
            , 15]; // Retrieve PARAM.SFO

            pkg.itemBytes[itemIndex] = {};
            pkg.itemBytes[itemIndex].add = true;
            return [4
            /*yield*/
            , processPkg3Item(pkgHeader, itemEntry, this.reader, pkg.itemBytes[itemIndex]) // Process PARAM.SFO
            ];

          case 14:
            _o.sent(); // Process PARAM.SFO


            sfoBytes = pkg.itemBytes[itemIndex][CONST_DATATYPE_DECRYPTED].slice(itemEntry.align.ofsDelta, itemEntry.align.ofsDelta + itemEntry.dataSize);
            sfoMagic = buf2Int(sfoBytes.slice(0, 4), 16); // if (sfoMagic !== CONST_PARAM_SFO_MAGIC) {
            //   this.reader.close()
            //   throw new Error(`Not a known PARAM.SFO structure`)
            // }

            checkSfoMagic(sfoBytes.slice(0, 4), this.reader); // Process PARAM.SFO data

            itemSfoValues = parseSfo(sfoBytes);
            return [3
            /*break*/
            , 19];

          case 15:
            if (!CONST_REGEX_PBP_SUFFIX.test(itemEntry.name)) return [3
            /*break*/
            , 19]; // Retrieve PBP header

            pkg.itemBytes[itemIndex] = {};
            pkg.itemBytes[itemIndex].add = true;
            return [4
            /*yield*/
            , processPkg3Item(pkgHeader, itemEntry, this.reader, pkg.itemBytes[itemIndex], Math.min(2048, itemEntry.dataSize)) // Process PBP header
            ];

          case 16:
            _o.sent();

            pbpBytes = pkg.itemBytes[itemIndex][CONST_DATATYPE_DECRYPTED].slice(itemEntry.align.ofsDelta, itemEntry.align.ofsDelta + CONST_PBP_HEADER_SIZE);
            return [4
            /*yield*/
            , parsePbpHeader(pbpBytes, itemEntry.dataSize)];

          case 17:
            parsedPBP = _o.sent();
            pbpHeader = parsedPBP.pbpHeaderFields;
            pbpItemEntries = parsedPBP.itemEntries;
            return [4
            /*yield*/
            , processPkg3Item(pkgHeader, itemEntry, this.reader, pkg.itemBytes[itemIndex], pbpHeader.iconPngOfs) // Process PARAM.SFO
            ];

          case 18:
            _o.sent(); // Process PARAM.SFO


            sfoBytes = pkg.itemBytes[itemIndex][CONST_DATATYPE_DECRYPTED].slice(itemEntry.align.ofsDelta + pbpItemEntries[0].dataOfs, itemEntry.align.ofsDelta + pbpItemEntries[0].dataOfs + pbpItemEntries[0].dataSize); // Check for known PARAM.SFO data

            checkSfoMagic(sfoBytes.slice(0, 4), this.reader); // Process PARAM.SFO data

            pbpSfoValues = parseSfo(sfoBytes);
            _o.label = 19;

          case 19:
            _i++;
            return [3
            /*break*/
            , 13];

          case 20:
            if (pkgSfoValues === null && itemSfoValues !== null) {
              pkgSfoValues = itemSfoValues;
              itemSfoValues = null;
            }

            mainSfoValues = pkgSfoValues;
            _o.label = 21;

          case 21:
            _o.trys.push([21, 23,, 24]);

            _f = pkg;
            return [4
            /*yield*/
            , this.reader.read(pkgHeader.dataOffset + pkgHeader.dataSize, pkgHeader.totalSize - (pkgHeader.dataOffset + pkgHeader.dataSize))];

          case 22:
            _f.tailBytes = _o.sent();
            return [3
            /*break*/
            , 24];

          case 23:
            e_2 = _o.sent();
            this.reader.close();
            console.error("Could not get PKG3 unencrypted tail at offset " + (pkgHeader.dataOffset + pkgHeader.dataSize) + " size " + (pkgHeader.totalSize - (pkgHeader.dataOffset + pkgHeader.dataSize)) + " from " + this.reader.getSource());
            return [3
            /*break*/
            , 24];

          case 24:
            if (pkg.tailBytes) {
              // may not be present or have failed, e.g. when analyzing a head.bin file, a broken download or only thje first file of a multi-part package
              results.pkgTailSize = pkg.tailBytes.length;
              results.pkgTailSha1 = pkg.tailBytes.slice(-0x20, -0x0c);
            }

            return [3
            /*break*/
            , 31];

          case 25:
            if (!(magic === CONST_PKG4_MAGIC.toString(16))) return [3
            /*break*/
            , 26]; // PS4

            console.error('PS4 support not yet added.');
            return [3
            /*break*/
            , 31];

          case 26:
            if (!(magic === CONST_PBP_MAGIC.toString(16))) return [3
            /*break*/
            , 31];
            return [4
            /*yield*/
            , parsePbpHeader(pkg.headBytes, results.fileSize, this.reader)];

          case 27:
            parsedPbpHeader = _o.sent();
            pbpHeader = parsedPbpHeader.pbpHeaderFields;
            pbpItemEntries = parsedPbpHeader.itemEntries;
            if (!(pbpItemEntries.length >= 1 && pbpItemEntries[0].dataSize > 0)) return [3
            /*break*/
            , 31];
            results.pkgSfoOffset = pbpItemEntries[0].dataOfs;
            results.pkgSfoSize = pbpItemEntries[0].dataSize;
            return [4
            /*yield*/
            , retrieveParamSfo(pkg, results, this.reader) // Process PARAM.SFO if present
            ];

          case 28:
            // Retrieve PBP PARAM.SFO from unencrypted data
            sfoBytes = _o.sent();
            if (!sfoBytes) return [3
            /*break*/
            , 30]; // Check for known PARAM.SFO data

            checkSfoMagic(sfoBytes.slice(0, 4), this.reader);
            return [4
            /*yield*/
            , parseSfo(sfoBytes)];

          case 29:
            // Process PARAM.SFO data
            pbpSfoValues = _o.sent();
            _o.label = 30;

          case 30:
            mainSfoValues = pbpSfoValues;
            _o.label = 31;

          case 31:
            if (results.pkgContentId) {
              results.contentId = results.pkgContentId;
              results.cidTitleId1 = results.contentId.substring(7, 16);
              results.cidTitleId2 = results.contentId.substring(20);
              results.titleId = results.cidTitleId1;
            }

            if (results.mdTitleId) {
              if (!results.titleId) {
                results.titleId = results.mdTitleId;
              }

              if (results.cidTitleId1 && results.mdTitleId !== results.cidTitleId1) {
                results.mdTidDiffer = true;
              }
            } // Process main PARAM.SFO if present


            if (mainSfoValues) {
              if (mainSfoValues.DISK_ID) {
                results.sfoTitleId = mainSfoValues.DISK_ID;
              }

              if (mainSfoValues.TITLE_ID) {
                results.sfoTitleId = mainSfoValues.TITLE_ID;

                if (results.pkgCidTitleId1 && mainSfoValues.TITLE_ID !== results.pkgCidTitleId1) {
                  results.sfoPkgTidDiffer = true;
                }
              }

              if (mainSfoValues.CONTENT_ID) {
                results.sfoContentId = mainSfoValues.CONTENT_ID;
                results.sfoCidTitleId1 = results.sfoContentId.substring(7, 16);
                results.sfoCidTitleId2 = results.sfoContentId.substring(20);

                if (results.pkgContentId && mainSfoValues.CONTENT_ID !== results.pkgContentId) {
                  results.sfoCidDiffer = true;
                }

                if (mainSfoValues.TITLE_ID && mainSfoValues.TITLE_ID !== results.sfoCidTitleId1) {
                  results.sfoTidDiffer = true;
                }
              }

              if (mainSfoValues.CATEGORY) {
                results.sfoCategory = mainSfoValues.CATEGORY;
              }

              if (mainSfoValues.PUBTOOLINFO) {
                try {
                  results.sfoCreationDate = mainSfoValues.PUBTOOLINFO.substring(7, 15);
                  results.sfoSdkVer = Number(mainSfoValues.PUBTOOLINFO.substring(24, 32)) / 1000000;
                } catch (e) {
                  console.error(e);
                }
              }

              if (!results.titleId && results.sfoTitleId) {
                results.titleId = results.sfoTitleId;
              }

              if (!results.contentId && results.sfoContentId) {
                results.contentId = results.sfoContentId;
                results.cidTitleId1 = results.contentId.substring(7, 16);
                results.cidTitleId2 = results.contentId.substring(20);

                if (!results.titleId) {
                  results.titleId = results.cidTitleId1;
                }
              }
            } // Determine some derived variables
            // a) Region and related languages


            if (results.contentId) {
              r = getRegion(results.contentId[0]);
              results.region = r.region;
              results.languages = r.languages; // if (results.languages === null) {
              // TODO: line 2831/2832
              // }
            } // b) International/English title


            for (_g = 0, _h = ['01', '18']; _g < _h.length; _g++) {
              language = _h[_g];
              key = 'TITLE_'.concat(language);

              if (mainSfoValues && mainSfoValues[key]) {
                results.sfoTitle = mainSfoValues[key];
              }
            }

            if (!results.sfoTitle && mainSfoValues && mainSfoValues.TITLE) {
              results.sfoTitle = mainSfoValues.TITLE;
            } // Clean international/english title


            if (results.sfoTitle) {
              if (REPLACE_LIST) {
                for (_j = 0, REPLACE_LIST_1 = REPLACE_LIST; _j < REPLACE_LIST_1.length; _j++) {
                  replaceChars = REPLACE_LIST_1[_j];

                  for (i = 0; i < replaceChars[0].length; i++) {
                    replaceChar = replaceChars[0][i];

                    if (replaceChars[1] === ' ') {
                      results.sfoTitle = results.sfoTitle.replace(replaceChar.concat(':'), ':');
                    }

                    results.sfoTitle = results.sfoTitle.replace(replaceChar, replaceChars[1]);
                  }
                }
              }

              results.sfoTitle = results.sfoTitle.replace(/[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+/, ' '); // also replaces \u3000
              // Condense demo information in title to '(DEMO)'

              results.sfoTitle = results.sfoTitle.replace('demo ver.', '(DEMO)').replace('(Demo Version)', '(DEMO)').replace('Demo Version', '(DEMO)').replace('Demo version', '(DEMO)').replace('DEMO Version', '(DEMO)').replace('DEMO version', '(DEMO)').replace('【体験版】', '(DEMO)').replace('(体験版)', '(DEMO)').replace('体験版', '(DEMO)');
              results.sfoTitle = results.sfoTitle.replace(/(demo)/i, '(DEMO)');
              results.sfoTitle = results.sfoTitle.replace(/(^|(?:[\0-'\)-`\{-\u017E\u0180-\u2129\u212B-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]){1})demo((?:[\0-\(\*-`\{-\u017E\u0180-\u2129\u212B-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]){1}|$)/i, '$1(DEMO)$2');
              results.sfoTitle = results.sfoTitle.replace(/(  )/i, ' ');
            } // c) Regional title


            if (results.languages) {
              for (_k = 0, _l = results.languages; _k < _l.length; _k++) {
                language = _l[_k];
                key = 'TITLE_'.concat(language);

                if (mainSfoValues && mainSfoValues[key]) {
                  results.sfoTitleRegional = mainSfoValues[key];
                  break;
                }
              }
            }

            if (!results.sfoTitleRegional && mainSfoValues && mainSfoValues.title) {
              results.sfoTitleRegional = mainSfoValues.title;
            } // Clean regional title


            if (results.sfoTitleRegional) {
              if (REPLACE_LIST) {
                for (_m = 0, REPLACE_LIST_2 = REPLACE_LIST; _m < REPLACE_LIST_2.length; _m++) {
                  replaceChars = REPLACE_LIST_2[_m];

                  for (i = 0; i < replaceChars[0].length; i++) {
                    replaceChar = replaceChars[0][i];

                    if (replaceChars[1] === ' ') {
                      results.sfoTitleRegional = results.sfoTitleRegional.replace(replaceChar.concat(':'), ':');
                    }

                    results.sfoTitleRegional = results.sfoTitleRegional.replace(replaceChar, replaceChars[1]);
                  }
                }
              }

              results.sfoTitleRegional = results.sfoTitleRegional.replace(/[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+/, ' '); // also replaces \u3000
            } // d) Determine platform and package type
            // TODO: Further complete determination (e.g. PS4 content types)


            if (magic === CONST_PKG3_MAGIC.toString(16)) {
              if (results.pkgContentType) {
                // PS3 packages
                if (results.pkgContentType === 0x4 || results.pkgContentType === 0xB) {
                  results.platform = "PS3"
                  /* PS3 */
                  ;

                  if (pkgMetadata[0x0B]) {
                    results.pkgType = "Update"
                    /* PATCH */
                    ;
                    npsType = 'PS3 UPDATE';
                  } else {
                    results.pkgType = "DLC"
                    /* DLC */
                    ;
                    npsType = 'PS3 DLC';
                  }

                  results.pkgExtractRootCont = pkgHeader.contentId.substring(7);

                  if (results.titleId) {
                    results.titleUpdateUrl = "https://a0.ww.np.dl.playstation.net/tpl/np/" + results.titleId + "/" + results.titleId + "-ver.xml";
                  }
                } else if (results.pkgContentType === 0x5 || results.pkgContentType === 0x13 || results.pkgContentType === 0x14) {
                  results.platform = "PS3"
                  /* PS3 */
                  ;
                  results.pkgType = "Game"
                  /* GAME */
                  ;

                  if (results.pkgContentType === 0x14) {
                    results.pkgSubType = "PSP Remaster"
                    /* PSP_REMASTER */
                    ;
                  }

                  results.pkgExtractRootCont = pkgHeader.contentId.substring(7);
                  npsType = 'PS3 GAME';

                  if (results.titleId) {
                    results.titleUpdateUrl = "https://a0.ww.np.dl.playstation.net/tpl/np/" + results.titleId + "/" + results.titleId + "-ver.xml";
                  }
                } else if (results.pkgContentType === 0x9) {
                  // PS3/PSP Themes
                  results.platform = "PS3"
                  /* PS3 */
                  ;
                  results.pkgType = "Theme"
                  /* THEME */
                  ;
                  npsType = 'PS3 THEME';

                  if (pkgMetadata[0x03] && buf2Int(pkgMetadata[0x03].value) === 0x0000020C) {
                    results.platform = "PSP"
                    /* PSP */
                    ;
                    npsType = 'PSP THEME';
                  }

                  results.pkgExtractRootCont = pkgHeader.contentId.substring(7);
                } else if (results.pkgContentType === 0xD) {
                  results.platform = "PS3"
                  /* PS3 */
                  ;
                  results.pkgType = "Avatar"
                  /* AVATAR */
                  ;
                  results.pkgExtractRootCont = pkgHeader.contentId.substring(7);
                  npsType = 'PS3 AVATAR';
                } else if (results.pkgContentType === 0x12) {
                  // PS2/SFO_CATEGORY = 2P
                  results.platform = "PS3"
                  /* PS3 */
                  ;
                  results.pkgType = "Game"
                  /* GAME */
                  ;
                  results.pkgSubType = "PS2 Classic"
                  /* PS2 */
                  ;
                  results.pkgExtractRootCont = pkgHeader.contentId.substring(7);
                  npsType = 'PS3 GAME';

                  if (results.sfoTitleId) {
                    results.Ps2TitleId = results.sfoTitleId;
                  }
                } else if (results.pkgContentType === 0x1 || results.pkgContentType === 0x6) {
                  // PSX packages
                  results.platform = "PSX"
                  /* PSX */
                  ;
                  results.pkgType = "Game"
                  /* GAME */
                  ;
                  results.pkgExtractRootUx0 = path.join('pspemu', 'PSP', 'GAME', results.pkgCidTitleId1);
                  results.pkgExtractLicUx0 = path.join('pspemu', 'PSP', 'LICENSE', ''.concat(results.pkgContentId, '.rif'));
                  results.pkgExtractRootCont = pkgHeader.contentId.substring(7);
                  npsType = 'PSX GAME'; // Special Case: PCSC80018 "Pocketstation for PS Vita"

                  if (results.titleId === 'PCSC80018') {
                    results.platform = "PSV"
                    /* PSV */
                    ;
                    results.pkgSubType = "PSX"
                    /* PSX */
                    ;
                    results.pkgExtractRootUx0 = path.join('ps1emu', results.pkgCidTitleId1);
                    npsType = 'PSV GAME';
                  }

                  if (results.pkgContentType === 0x6 && results.mdTitleId) {
                    results.psxTitleId = results.mdTitleId;
                  }
                } else if (results.pkgContentType === 0x7 || results.pkgContentType === 0xE || results.pkgContentType === 0xF || results.pkgContentType === 0x10) {
                  results.platform = "PSP"
                  /* PSP */
                  ;

                  if (pbpSfoValues && pbpSfoValues.category) {
                    if (pbpSfoValues.category === 'PG') {
                      results.pkgType = "Update"
                      /* PATCH */
                      ;
                      npsType = 'PSP UPDATE';
                    } else if (pbpSfoValues.category === 'MG') {
                      results.pkgType = "DLC"
                      /* DLC */
                      ;
                      npsType = 'PSP DLC';
                    }
                  }

                  if (!results.pkgType) {
                    // Normally CATEGORY === EG
                    results.pkgType = "Game"
                    /* GAME */
                    ;
                    npsType = 'PSP GAME';
                  } // TODO: Verify when ISO and when GAME directory has to be used?


                  results.pkgExtractRootUx0 = path.join('pspemu', 'PSP', 'GAME', results.pkgCidTitleId1);
                  results.pkgExtractIsorUx0 = path.join('pspemu', 'ISO');
                  results.pkgExtractIsoName = results.sfoTitle + " [" + results.pkgCidTitleId1 + "].iso"; // results.pkgExtractIsoName = ''.concat(results.sfoTitle, ' [', results.pkgCidTitleId1, ']', '.iso')

                  if (results.pkgContentType === 0x7) {
                    if (results.sfoCategory === 'HG') {
                      results.pkgSubType = "PC Engine"
                      /* PSP_PC_ENGINE */
                      ;
                    }
                  } else if (results.pkgContentType === 0xE) {
                    results.pkgSubType = "Go"
                    /* PSP_GO */
                    ;
                  } else if (results.pkgContentType === 0xF) {
                    results.pkgSubType = "PSP Mini"
                    /* PSP_MINI */
                    ;
                  } else if (results.pkgContentType === 0x10) {
                    results.pkgSubType = "PSP NeoGeo"
                    /* PSP_NEOGEO */
                    ;
                  }

                  results.pkgExtractRootCont = pkgHeader.contentId.substring(7);

                  if (results.titleId) {
                    results.titleUpdateUrl = "https://a0.ww.np.dl.playstation.net/tpl/np/" + results.titleId + "/" + results.titleId + "-ver.xml";
                  }
                } else if (results.pkgContentType === 0x15) {
                  // PSV packages
                  results.platform = "PSV"
                  /* PSV */
                  ;

                  if (results.sfoCategory && results.sfoCategory === 'gp') {
                    results.pkgType = "Update"
                    /* PATCH */
                    ;
                    results.pkgExtractRootUx0 = path.join('patch', results.cidTitleId1);
                    npsType = 'PSV UPDATE';
                  } else {
                    results.pkgType = "Game"
                    /* GAME */
                    ;
                    results.pkgExtractRootUx0 = path.join('app', results.cidTitleId1);
                    npsType = 'PSV GAME';
                  }

                  results.pkgExtractRootCont = pkgHeader.contentId.substring(7);

                  if (results.titleId) {
                    updateHash = new fast_sha256_1.HMAC(CONST_PKG3_UPDATE_KEYS[2].key);
                    data = new TextEncoder().encode("np_" + results.titleId);
                    updateHash.update(data);
                    results.titleUpdateUrl = "http://gs-sec.ww.np.dl.playstation.net/pl/np/" + results.titleId + "/" + toHexString(updateHash.digest()) + "/" + results.titleId + "-ver.xml";
                  }
                } else if (results.pkgContentType === 0x16) {
                  results.platform = "PSV"
                  /* PSV */
                  ;
                  results.pkgType = "DLC"
                  /* DLC */
                  ;
                  results.pkgExtractRootUx0 = path.join('addcont', results.cidTitleId1, results.cidTitleId2);
                  results.pkgExtractRootCont = pkgHeader.contentId.substring(7);
                  npsType = 'PSV DLC';

                  if (results.titleId) {
                    updateHash = new fast_sha256_1.HMAC(CONST_PKG3_UPDATE_KEYS[2].key);
                    data = new TextEncoder().encode("np_" + results.titleId);
                    updateHash.update(data);
                    results.titleUpdateUrl = "http://gs-sec.ww.np.dl.playstation.net/pl/np/" + results.titleId + "/" + toHexString(updateHash.digest()) + "/" + results.titleId + "-ver.xml";
                  }
                } else if (results.pkgContentType === 0x1F) {
                  results.platform = "PSV"
                  /* PSV */
                  ;
                  results.pkgType = "Theme"
                  /* THEME */
                  ;
                  results.pkgExtractRootUx0 = path.join('theme', results.cidTitleId1 + "-" + results.cidTitleId2); // TODO/FUTURE: bgdl
                  //  - find next free xxxxxxxx dir (hex 00000000-FFFFFFFF)
                  //    Note that Vita has issues with handling more than 32 bgdls at once
                  //  - package sub dir is Results["PKG_CID_TITLE_ID1"] for Game/DLC/Theme
                  //  - create additional d0/d1.pdb and temp.dat files in root dir for Game/Theme
                  //  - create additional f0.pdb for DLC
                  // Results["PKG_EXTRACT_ROOT_UX0"] = os.path.join("bgdl", "t", "xxxxxx")
                  // , )))

                  results.pkgExtractRootCont = pkgHeader.contentId.substring(7);
                  npsType = 'PSV THEME';
                } else if (results.pkgContentType === 0x18 || results.pkgContentType === 0x1D) {
                  results.platform = "PSM"
                  /* PSM */
                  ;
                  results.pkgType = "Game"
                  /* GAME */
                  ;
                  results.pkgExtractRootUx0 = path.join('psm', results.cidTitleId1);
                  results.pkgExtractRootCont = pkgHeader.contentId.substring(7);
                  npsType = 'PSM GAME';
                } else {
                  // Unknown packages
                  console.error("PKG content type " + results.pkgContentType + ".");
                  results.pkgExtractRootCont = pkgHeader.contentId.substring(7);
                }
              }
            } else if (magic === CONST_PKG4_MAGIC.toString(16)) {
              results.platform = "PS4"
              /* PS4 */
              ;

              if (results.pkgContentType === 0x1A) {
                if (results.sfoCategory && results.sfoCategory === 'gd') {
                  results.pkgType = "Game"
                  /* GAME */
                  ;
                  npsType = 'PS4 GAME';
                } else if (results.sfoCategory && results.sfoCategory === 'gp') {
                  results.pkgType = "Update"
                  /* PATCH */
                  ;
                  npsType = 'PS4 UPDATE';
                }
              } else if (results.pkgContentType === 0x1B) {
                if (results.sfoCategory && results.sfoCategory === 'ac') {
                  results.pkgType = "DLC"
                  /* DLC */
                  ;
                  npsType = 'PS4 DLC';
                }
              }
            } else if (magic === CONST_PBP_MAGIC.toString(16)) {
              // PBP
              // TODO
              results.pkgExtractRootCont = results.titleId;
            }

            results.npsType = npsType;
            sfoValues = null;

            for (sfoValues in [pbpSfoValues, itemSfoValues, pkgSfoValues]) {
              if (!sfoValues) continue; // Media Version

              if (!results.sfoVersion && sfoValues.discVersion) {
                results.sfoVersion = parseFloat(sfoValues.discVersion);
              }

              if (!results.sfoVersion && sfoValues.version) {
                results.sfoVersion = parseFloat(sfoValues.version);
              } // Application Version


              if (!results.sfoAppVer && sfoValues.appVer) {
                results.sfoAppVer = parseFloat(sfoValues.appVer);
              } // Firmware PS3


              if (!results.sfoMinVerPs3 && sfoValues.ps3SystemVer) {
                results.sfoMinVerPs3 = parseFloat(sfoValues.ps3SystemVer);
              } // Firmware PSP


              if (!results.sfoMinVerPsp && sfoValues.pspSystemVer) {
                results.sfoMinVerPsp = parseFloat(sfoValues.pspSystemVer);
              } // Firmware PS Vita


              if (!results.sfoMinVerPsv && sfoValues.psp2DispVer) {
                results.sfoMinVerPsv = parseFloat(sfoValues.psp2DispVer);
              } // Firmware PS4


              if (!results.sfoMinVerPs4 && sfoValues.systemVer) {
                results.sfoMinVerPs4 = (sfoValues.systemVer >> 24 & 0xFF) + "." + (sfoValues.systemVer >> 16 & 0xFF);
              }
            }

            if (!results.sfoAppVer) {
              results.sfoAppVer = 0x0; // mandatory value
            }

            results.sfoMinVer = 0.00; // mandatory value

            if (results.platform) {
              if (results.platform === "PS3"
              /* PS3 */
              ) {
                  if (results.sfoMinVerPs3) {
                    results.sfoMinVer = results.sfoMinVerPs3;
                  }
                } else if (results.platform === "PSP"
              /* PSP */
              ) {
                  if (results.sfoMinVerPsp) {
                    results.sfoMinVer = results.sfoMinVerPsp;
                  }
                } else if (results.platform === "PSV"
              /* PSV */
              ) {
                  if (results.sfoMinVerPsv) {
                    results.sfoMinVer = results.sfoMinVerPsv;
                  }
                } else if (results.platform === "PS4"
              /* PS4 */
              ) {
                  if (results.sfoMinVerPs4) {
                    results.sfoMinVer = results.sfoMinVerPs4;
                  }
                }
            }

            jsonOutput = {};
            jsonOutput.results = {};
            jsonOutput.results.source = this.reader.getSource().href;
            if (results.titleId) jsonOutput.results.titleId = results.titleId;
            if (results.sfoTitle) jsonOutput.results.title = results.sfoTitle;
            if (results.sfoTitleRegional) jsonOutput.results.regionalTitle = results.sfoTitleRegional;
            if (results.contentId) jsonOutput.results.region = results.region;
            if (results.sfoMinVer) jsonOutput.results.minFw = results.sfoMinVer;
            if (results.sfoMinVerPs3 && results.sfoMinVerPs3 >= 0) jsonOutput.results.minFwPs3 = results.sfoMinVerPs3;
            if (results.sfoMinVerPsp && results.sfoMinVerPsp >= 0) jsonOutput.results.minFwPsp = results.sfoMinVerPsp;
            if (results.sfoMinVerPsv && results.sfoMinVerPsv >= 0) jsonOutput.results.minFwPsv = results.sfoMinVerPsv;
            if (results.sfoMinVerPs4 && results.sfoMinVerPs4 >= 0) jsonOutput.results.minFwPs4 = results.sfoMinVerPs4;
            if (results.sfoSdkVer && results.sfoSdkVer >= 0) jsonOutput.results.sdkVer = results.sfoSdkVer;
            if (results.sfoCreationDate) jsonOutput.results.creationDate = results.sfoCreationDate;
            if (results.sfoVersion && results.sfoVersion >= 0) jsonOutput.results.version = results.sfoVersion;
            if (results.sfoAppVer && results.sfoAppVer >= 0) jsonOutput.results.appVer = results.sfoAppVer;
            if (results.psxTitleId) jsonOutput.results.psxTitleId = results.psxTitleId;
            if (results.contentId) jsonOutput.results.contentId = results.contentId;

            if (results.pkgTotalSize && results.pkgTotalSize > 0) {
              jsonOutput.results.pkgTotalSize = results.pkgTotalSize;
              jsonOutput.results.prettySize = humanFileSize(results.pkgTotalSize);
            }

            if (results.fileSize) jsonOutput.results.fileSize = results.fileSize;
            if (results.titleUpdateUrl) jsonOutput.results.titleUpdateUrl = results.titleUpdateUrl;
            jsonOutput.results.npsType = results.npsType;
            if (results.platform) jsonOutput.results.pkgPlatform = results.platform;
            if (results.pkgType) jsonOutput.results.pkgType = results.pkgType;
            if (results.pkgSubType) jsonOutput.results.pkgSubType = results.pkgSubType;
            if (results.toolVersion) jsonOutput.results.toolVersion = results.toolVersion;

            if (results.pkgContentId) {
              jsonOutput.results.pkgContentId = results.pkgContentId;
              jsonOutput.results.pkgCidTitleId1 = results.pkgCidTitleId1;
              jsonOutput.results.pkgCidTitleId2 = results.pkgCidTitleId2;
            }

            if (results.mdTitleId) {
              jsonOutput.results.mdTitleId = results.mdTitleId;

              if (results.mdTidDiffer) {
                jsonOutput.results.mdTidDiffer = results.mdTidDiffer;
              }
            }

            if (results.pkgSfoOffset) jsonOutput.results.pkgSfoOffset = results.pkgSfoOffset;
            if (results.pkgSfoOffset) jsonOutput.results.pkgSfoSize = results.pkgSfoSize;
            if (results.pkgDrmType) jsonOutput.results.pkgDrmType = results.pkgDrmType;
            if (results.pkgContentType) jsonOutput.results.pkgContentType = results.pkgContentType;
            if (results.pkgTailSize) jsonOutput.results.pkgTailSize = results.pkgTailSize;
            if (results.pkgTailSha1) jsonOutput.results.pkgTailSha1 = results.pkgTailSha1;

            if (results.itemsInfo) {
              jsonOutput.results.itemsInfo = results.itemsInfo;
              if (jsonOutput.results.itemsInfo.align) delete jsonOutput.results.itemsInfo.align;
            }

            if (results.sfoTitleId) jsonOutput.results.sfoTitleId = results.sfoTitleId;
            if (results.sfoCategory) jsonOutput.results.sfoCategory = results.sfoCategory;

            if (results.sfoContentId) {
              jsonOutput.results.sfoContentId = results.sfoContentId;
              jsonOutput.results.sfoCidTitleId1 = results.sfoCidTitleId1;
              jsonOutput.results.sfoCidTitleId2 = results.sfoCidTitleId2;
              if (results.sfoCidDiffer) jsonOutput.results.sfoCidDiffer = results.sfoCidDiffer;
              if (results.sfoTidDiffer) jsonOutput.results.sfoTidDiffer = results.sfoTidDiffer;
            }

            return [2
            /*return*/
            , jsonOutput];
        }
      });
    });
  };

  GetInfo.prototype.initReader = function (url) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (this.options.baseUrl) {
              if (!this.options.baseUrl.endsWith('/')) {
                this.options.baseUrl += '/';
              }

              this.reader = new PkgReader_1.PkgReader(url, this.options.baseUrl);
            } else {
              this.reader = new PkgReader_1.PkgReader(url);
            }

            if (!url.endsWith('.xml')) return [3
            /*break*/
            , 2];
            return [4
            /*yield*/
            , this.reader.setupXml()];

          case 1:
            _a.sent();

            return [3
            /*break*/
            , 6];

          case 2:
            if (!url.endsWith('.json')) return [3
            /*break*/
            , 4];
            return [4
            /*yield*/
            , this.reader.setupJson()];

          case 3:
            _a.sent();

            return [3
            /*break*/
            , 6];

          case 4:
            if (!(url.startsWith('http:') || url.startsWith('http:'))) return [3
            /*break*/
            , 6];
            return [4
            /*yield*/
            , this.reader.setupPkg()];

          case 5:
            _a.sent();

            _a.label = 6;

          case 6:
            return [2
            /*return*/
            ];
        }
      });
    });
  };

  return GetInfo;
}();

exports["default"] = GetInfo;

function parsePkg3Header(dataBuffer, reader) {
  return __awaiter(this, void 0, void 0, function () {
    function get(size, fromOffset) {
      if (fromOffset) {
        var slice_1 = dataBuffer.slice(fromOffset, fromOffset + size);
        offset = fromOffset + size;
        return slice_1;
      }

      var slice = dataBuffer.slice(offset, offset + size);
      offset += size;
      return slice;
    }

    var offset, headerFields, readSize, _a, _b, _c, extHeaderFields, mainHdrSize, magic, key, aesEcb, pkgKey, metadata, mdEntryType, mdEntrySize, metaoffset, i, tempBytes;

    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          offset = 0;
          headerFields = {
            magic: get(0x04),
            rev: get(0x02),
            type: buf2Int(get(0x02), 4),
            metadataOffset: buf2Int(get(0x04), 16),
            metadataCount: buf2Int(get(0x04), 16),
            metadataSize: get(0x04),
            itemCount: buf2Int(get(0x04), 16),
            totalSize: get(0x08),
            dataOffset: buf2Int(get(0x08), 16),
            dataSize: get(0x08),
            contentId: get(0x24).toString(),
            padding: get(0x0c),
            digest: get(0x10),
            dataRiv: get(0x10),
            keyType: dataBuffer[0xe7] & 7,
            keyIndex: null,
            paramSfo: '',
            aesCtr: {}
          };
          readSize = headerFields.dataOffset - CONST_PKG3_HEADER_SIZE;
          _b = (_a = Buffer).concat;
          _c = [dataBuffer];
          return [4
          /*yield*/
          , reader.read(CONST_PKG3_HEADER_SIZE, readSize)];

        case 1:
          // let unencryptedBytes = await reader.read(CONST_PKG3_HEADER_SIZE, readSize)
          // const unencryptedBytes = Buffer.concat([dataBuffer, get(readSize, CONST_PKG3_HEADER_SIZE)])
          // const unencryptedBytes = get(CONST_PKG3_HEADER_SIZE, readSize)
          // const unencryptedBytes = Buffer.concat([dataBuffer, await reader.read(CONST_PKG3_HEADER_SIZE, readSize)])
          dataBuffer = _b.apply(_a, [_c.concat([_d.sent()])]);
          extHeaderFields = null;
          mainHdrSize = CONST_PKG3_HEADER_SIZE + CONST_PKG3_DIGEST_SIZE;

          if (headerFields.type === 0x2) {
            magic = get(0x04, mainHdrSize); // const magic = unencryptedBytes.slice(mainHdrSize, mainHdrSize + 0x04)

            if (magic.readInt32BE(0) !== CONST_PKG3_EXT_MAGIC) {
              reader.close();
              throw new Error('Not a known PKG3 Extended Main Header');
              console.error('Not a known PKG3 Extended Main Header');
            }

            extHeaderFields = {
              magic: magic,
              unknown1: get(0x04),
              extHeaderSize: get(0x04),
              extDataSize: get(0x04),
              mainAndExtHeadersHmacOffset: get(0x04),
              metadataHeaderHmacOffset: get(0x04),
              tailOffset: get(0x08),
              padding1: get(0x04),
              pkgKeyId: buf2Int(get(0x04), 16),
              fullHeaderHmacOffset: get(0x04),
              padding2: get(0x02)
            };
          }
          /*
            Determine key index for item entries plus path of PARAM.SFO
           */


          if (headerFields.type === 0x1) {
            // PS3
            headerFields.keyIndex = 0;
            headerFields.paramSfo = 'PARAM.SFO';
          } else if (headerFields.type === 0x2) {
            // PSX/PSP/PSV/PSM
            headerFields.paramSfo = 'PARAM.SFO';

            if (extHeaderFields) {
              headerFields.keyIndex = extHeaderFields.pkgKeyId & 0xf;

              if (headerFields.keyIndex === 2) {
                // PSV
                headerFields.paramSfo = 'sce_sys/param.sfo';
              } else if (headerFields.keyIndex === 3) {
                // Unknown
                console.error("[UNKNOWN] PKG3 Key Index " + headerFields.type);
                throw new Error("[UNKNOWN] PKG3 Key Index " + headerFields.type);
              }
            } else {
              headerFields.keyIndex = 1;
            }
          } else {
            console.error("[UNKNOWN] PKG3 Package Type " + headerFields.type); // throw new Error(`[UNKNOWN] PKG3 Package Type ${headerFields.type}`)
          }

          for (key in CONST_PKG3_CONTENT_KEYS) {
            // console.log('key: ' + CONST_PKG3_CONTENT_KEYS[key])
            if (CONST_PKG3_CONTENT_KEYS[key].derive) {
              aesEcb = new aesjs.ModeOfOperation.ecb(CONST_PKG3_CONTENT_KEYS[key].key);
              pkgKey = aesEcb.encrypt(headerFields.dataRiv);
              headerFields.aesCtr[key] = new PkgAesCounter_1.PkgAesCounter(pkgKey, headerFields.dataRiv); //   aes: aesEcb,
              //   pkgKey: aesjs.utils.hex.fromBytes(pkgKey),
              //   setOffset: function(offset: number) {
              //
              //   },
              //   decrypt: function(offset, data) {
              //     return this.aes.utils.utf8.fromBytes(this.aes.decrypt(pkgKey))
              //   }
              // }
              // aesjs.utils.hex.fromBytes(pkgKey)
            } else {
              // console.log("doesn't have derive")
              // headerFields.aesCtr[key] = CONST_PKG3_CONTENT_KEYS[key]
              // headerFields.aesCtr[key] = aesjs.utils.hex.fromBytes(CONST_PKG3_CONTENT_KEYS[key].key)
              headerFields.aesCtr[key] = new PkgAesCounter_1.PkgAesCounter(CONST_PKG3_CONTENT_KEYS[key].key, headerFields.dataRiv);
            }
          }

          metadata = {};
          mdEntryType = -1;
          mdEntrySize = -1;
          metaoffset = headerFields.metadataOffset;

          for (i = 0; i < headerFields.metadataCount; i++) {
            // let type = get(4);
            // const type = unencryptedBytes.slice(metaoffset, metaoffset + 4)
            // mdEntryType = unencryptedBytes.slice(metaoffset, metaoffset + 4).readInt32BE(0)
            mdEntryType = dataBuffer.slice(metaoffset, metaoffset + 4).readInt32BE(0);
            metaoffset += 4; // let size = get(4)
            // mdEntrySize = unencryptedBytes.slice(metaoffset, metaoffset + 4).readInt32BE(0)

            mdEntrySize = dataBuffer.slice(metaoffset, metaoffset + 4).readInt32BE(0); // const size = unencryptedBytes.slice(metaoffset, metaoffset + 4)

            metaoffset += 4;
            tempBytes = dataBuffer.slice(metaoffset, metaoffset + mdEntrySize); // let tempBytes = unencryptedBytes.slice(metaoffset, metaoffset + mdEntrySize)

            metadata[mdEntryType] = {}; // (1) DRM Type
            // (2) Content Type

            if (mdEntryType === 0x01 || mdEntryType === 0x02) {
              if (mdEntryType === 0x01) {
                metadata[mdEntryType].desc = 'DRM Type';
              } else if (mdEntryType === 0x02) {
                metadata[mdEntryType].desc = 'Content Type';
              }

              metadata[mdEntryType].value = tempBytes.readInt32BE(0);

              if (mdEntrySize > 0x04) {
                metadata[mdEntryType].unknown = tempBytes.slice(0x04);
              }
            } // (6) Title ID (when size 0xC) (otherwise Version + App Version)
            else if (mdEntryType === 0x06 && mdEntrySize === 0x0c) {
                if (mdEntryType === 0x06) {
                  metadata[mdEntryType].desc = 'Title ID';
                }

                metadata[mdEntryType].value = tempBytes.toString();
              } // (10) Install Directory
              else if (mdEntryType === 0x0a) {
                  if (mdEntryType === 0x0a) {
                    metadata[mdEntryType].desc = 'Install Directory';
                  }

                  metadata[mdEntryType].unknown = tempBytes.slice(0, 0x8);
                  metadata[mdEntryType].value = tempBytes.slice(0x8).toString();
                } // (13) Items Info (PS Vita)
                else if (mdEntryType === 0x0d) {
                    if (mdEntryType === 0x0d) {
                      metadata[mdEntryType].desc = 'Items Info (SHA256 of decrypted data)';
                    }

                    metadata[mdEntryType].ofs = tempBytes.readInt32BE(0);
                    metadata[mdEntryType].size = tempBytes.readInt32BE(0x04);
                    metadata[mdEntryType].sha256 = tempBytes.slice(0x08, 0x08 + 0x20);

                    if (mdEntrySize > 0x28) {
                      metadata[mdEntryType].unknown = tempBytes.slice(0x28);
                    }
                  } // (14) PARAM.SFO Info (PS Vita)
                  // (15) Unknown Info (PS Vita)
                  // (16) Entirety Info (PS Vita)
                  // (18) Self Info (PS Vita)
                  else if (mdEntryType === 0x0e || mdEntryType === 0x0f || mdEntryType === 0x10 || mdEntryType === 0x12) {
                      if (mdEntryType === 0x0e) {
                        metadata[mdEntryType].desc = 'PARAM.SFO Info';
                      } else if (mdEntryType === 0x10) {
                        metadata[mdEntryType].desc = 'Entirety Info';
                      } else if (mdEntryType === 0x12) {
                        metadata[mdEntryType].desc = 'Self Info';
                      }

                      metadata[mdEntryType].ofs = tempBytes.readInt32BE(0);
                      metadata[mdEntryType].size = tempBytes.readInt32BE(0x04);

                      if (mdEntryType === 0x0e) {
                        metadata[mdEntryType].unknown1 = tempBytes.slice(0x08, 0x08 + 4);
                        metadata[mdEntryType].firmware = tempBytes.slice(0x0c, 0x0c + 4);
                        metadata[mdEntryType].unknown2 = tempBytes.slice(0x10, mdEntrySize - 0x20);
                      } else {
                        metadata[mdEntryType].unknown = tempBytes.slice(0x08, mdEntrySize - 0x20);
                      }

                      metadata[mdEntryType].sha256 = tempBytes.slice(mdEntrySize - 0x20);
                    } else {
                      if (mdEntryType === 0x03) {
                        metadata[mdEntryType].desc = 'Package Type/Flags';
                      } else if (mdEntryType === 0x04) {
                        metadata[mdEntryType].desc = 'Package Size';
                      } else if (mdEntryType === 0x06) {
                        metadata[mdEntryType].desc = 'Version + App Version';
                      } else if (mdEntryType === 0x07) {
                        metadata[mdEntryType].desc = 'QA Digest';
                      }

                      metadata[mdEntryType].value = tempBytes;
                    } // // Unknown element found; seen in PSP cumulative patch
            // if (type.readInt32BE(0) === 0xB) { // 11
            //   metadataFields.type0B = true
            // }
            // PARAM.SFO offset and size element found
            // if (type.readInt32BE(0) === 0xE) { // 14
            //   metadataFields.sfoOffset = unencryptedBytes.slice(metaoffset + 8, metaoffset + 12);
            //   metadataFields.sfoSize = unencryptedBytes.slice(metaoffset + 12, metaoffset + 16)
            // }


            metaoffset += mdEntrySize;
          }

          headerFields.metadataSize = metaoffset - headerFields.metadataOffset;
          return [2
          /*return*/
          , {
            pkgHeader: headerFields,
            pkgExtHeader: extHeaderFields,
            pkgMetadata: metadata,
            headBytes: dataBuffer
          }];
      }
    });
  });
}

function retrieveParamSfo(pkg, results, reader) {
  return __awaiter(this, void 0, void 0, function () {
    var e_3;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (pkg.headBytes.length >= results.pkgSfoOffset + results.pkgSfoSize) {
            return [2
            /*return*/
            , pkg.headBytes.slice(results.pkgSfoOffset, results.pkgSfoOffset + results.pkgSfoSize)];
          }

          _a.label = 1;

        case 1:
          _a.trys.push([1, 3,, 4]);

          return [4
          /*yield*/
          , reader.read(results.pkgSfoOffset, results.pkgSfoSize)];

        case 2:
          return [2
          /*return*/
          , _a.sent()];

        case 3:
          e_3 = _a.sent();
          reader.close();
          throw new Error("Could not get PARAM.SFO at offset " + results.pkgSfoOffset + " with size " + results.pkgSfoSize + " from " + reader.getSource());

        case 4:
          return [2
          /*return*/
          ];
      }
    });
  });
}

function checkSfoMagic(sfoMagic, reader) {
  if (buf2Int(sfoMagic, 16) !== CONST_PARAM_SFO_MAGIC) {
    reader.close();
    throw new Error("Not a known PARAM.SFO structure");
  }

  return;
}

function parseSfo(sfoBytes) {
  return __awaiter(this, void 0, void 0, function () {
    var sfoKeyTableStart, sfoDataTableStart, sfoTableEntries, sfoValues, i, sfoIndexEntryOfs, sfoIndexKeyOfs, sfoIndexKey, charArr, j, sfoIndexKeyName, sfoIndexDataOfs, sfoIndexDataFmt, sfoIndexDataLen, sfoIndexData, value;
    return __generator(this, function (_a) {
      sfoBytes = Buffer.from(sfoBytes);
      sfoKeyTableStart = sfoBytes.readInt32LE(0x08);
      sfoDataTableStart = sfoBytes.readInt32LE(0x0c);
      sfoTableEntries = sfoBytes.readInt32LE(0x10);
      sfoValues = {};

      for (i = 0; i < sfoTableEntries; i++) {
        sfoIndexEntryOfs = 0x14 + i * 0x10;
        sfoIndexKeyOfs = sfoKeyTableStart + sfoBytes.readInt16LE(sfoIndexEntryOfs);
        sfoIndexKey = '';
        charArr = sfoBytes.slice(sfoIndexKeyOfs).toString(); // console.log(charArr)

        for (j = 0; j < charArr.length; j++) {
          if (charArr.charAt(j) === "\0") {
            break;
          }

          sfoIndexKey += charArr.charAt(j);
        }

        sfoIndexKeyName = sfoIndexKey.toString();
        sfoIndexDataOfs = sfoDataTableStart + sfoBytes.readInt32LE(sfoIndexEntryOfs + 0x0c);
        sfoIndexDataFmt = sfoBytes.readInt16LE(sfoIndexEntryOfs + 0x02);
        sfoIndexDataLen = sfoBytes.readInt32LE(sfoIndexEntryOfs + 0x04);
        sfoIndexData = sfoBytes.slice(sfoIndexDataOfs, sfoIndexDataOfs + sfoIndexDataLen);
        value = void 0;

        if (sfoIndexDataFmt === 0x0004 || sfoIndexDataFmt === 0x0204) {
          // if (sfoIndexDataFmt === 0x0204) {
          //
          // }
          value = sfoIndexData.toString();
        } else if (sfoIndexDataFmt === 0x0404) {
          value = sfoIndexData.readInt32LE(0);
        }

        sfoValues[sfoIndexKeyName] = value;
      }

      return [2
      /*return*/
      , sfoValues];
    });
  });
}

function calculateAesAlignedOffsetAndSize(offset, size) {
  var align = {}; // Decrement AES block size (16)

  align.ofsDelta = offset & 0x10 - 1;
  align.ofs = offset - align.ofsDelta;
  align.sizeDelta = align.ofsDelta + size & 0x10 - 1;

  if (align.sizeDelta > 0) {
    align.sizeDelta = 0x10 - align.sizeDelta;
  }

  align.sizeDelta += align.ofsDelta;
  align.size = size + align.sizeDelta;
  return align;
}

function parsePkg3ItemsInfo(headerFields, metaData, reader) {
  return __awaiter(this, void 0, void 0, function () {
    var itemsInfoBytes, _a, _b, e_4, pkgItemEntries, offset, nameOffsetEnd, itemNameSizeMax, slicer, i, tempFields, itemFlags, readSize, readOffset, _c, _d, _e, _f, _g, e_5, align, _i, pkgItemEntries_2, itemEntry, keyIndex, align, tmp, hasher;

    return __generator(this, function (_h) {
      switch (_h.label) {
        case 0:
          itemsInfoBytes = {};
          itemsInfoBytes.ofs = 0;
          itemsInfoBytes.size = headerFields.itemCount * CONST_PKG3_ITEM_ENTRY_SIZE;
          itemsInfoBytes.align = {};
          itemsInfoBytes.entriesSize = headerFields.itemCount * CONST_PKG3_ITEM_ENTRY_SIZE;

          if (metaData[0x0d]) {
            itemsInfoBytes.ofs = metaData[0x0d].ofs;

            if (itemsInfoBytes.size < metaData[0x0d].size) {
              itemsInfoBytes.size = metaData[0x0d].size;
            }
          }

          itemsInfoBytes.align = calculateAesAlignedOffsetAndSize(itemsInfoBytes.ofs, itemsInfoBytes.size);

          if (itemsInfoBytes.align.ofsDelta > 0) {
            console.error("Unaligned encrypted offset     " + itemsInfoBytes.ofs + " - " + itemsInfoBytes.align.ofsDelta + " =     " + itemsInfoBytes.align.ofs + " (+ " + headerFields.dataOffset + ") for Items Info/Items Entries.");
          }

          itemsInfoBytes[CONST_DATATYPE_AS_IS] = [];
          _h.label = 1;

        case 1:
          _h.trys.push([1, 3,, 4]);

          _a = itemsInfoBytes;
          _b = CONST_DATATYPE_AS_IS;
          return [4
          /*yield*/
          , reader.read(headerFields.dataOffset + itemsInfoBytes.align.ofs, itemsInfoBytes.align.size) // itemsInfoBytes[CONST_DATATYPE_AS_IS] = Buffer.concat([itemsInfoBytes[CONST_DATATYPE_AS_IS], await reader.read(headerFields.dataOffset + itemsInfoBytes.align.ofs, itemsInfoBytes.align.size)])
          ];

        case 2:
          _a[_b] = _h.sent();
          return [3
          /*break*/
          , 4];

        case 3:
          e_4 = _h.sent();
          reader.close();
          throw new Error("Could not get PKG3 encrypted data at     offset " + (headerFields.dataOffset + itemsInfoBytes.align.ofs) + " with     size " + itemsInfoBytes.align.size + " from " + reader.getSource());

        case 4:
          // Decrypt PKG3 Item Entries
          itemsInfoBytes[CONST_DATATYPE_DECRYPTED] = headerFields.aesCtr[headerFields.keyIndex].decrypt(itemsInfoBytes.align.ofs, itemsInfoBytes[CONST_DATATYPE_AS_IS]);
          pkgItemEntries = [];
          offset = itemsInfoBytes.align.ofsDelta;
          itemsInfoBytes.namesOfs = null;
          nameOffsetEnd = null;
          itemNameSizeMax = 0;
          slicer = new Slicer_1.Slicer(itemsInfoBytes[CONST_DATATYPE_DECRYPTED]);

          for (i = 0; i < headerFields.itemCount; i++) {
            tempFields = new PKG3ItemEntry({
              itemNameOfs: buf2Int(slicer.get(0x4), 16),
              itemNameSize: buf2Int(slicer.get(0x4), 16),
              dataOfs: buf2Int(slicer.get(0x8), 16),
              dataSize: buf2Int(slicer.get(0x8), 16),
              flags: buf2Int(slicer.get(0x4), 16),
              padding1: buf2Int(slicer.get(0x4), 16),
              index: i
            });

            if (tempFields.align.ofsDelta > 0) {
              console.error("Unaligned encrypted offset " + tempFields.dataOfs + " - " + tempFields.align.ofsDelta + " = " + tempFields.align.ofs + " (+" + headerFields.dataOffset + ")");
            }

            itemFlags = tempFields.flags & 0xff;

            if (itemFlags === 0x4 || itemFlags === 0x12) {
              // directory
              tempFields.isFileOfs = -1;
            } else {
              tempFields.isFileOfs = tempFields.dataOfs;
            }

            pkgItemEntries.push(tempFields);

            if (tempFields.itemNameSize > 0) {
              if (itemsInfoBytes.namesOfs === null || tempFields.itemNameOfs < itemsInfoBytes.namesOfs) {
                itemsInfoBytes.namesOfs = tempFields.itemNameOfs;
              }

              if (nameOffsetEnd === null || tempFields.itemNameOfs >= nameOffsetEnd) {
                nameOffsetEnd = tempFields.itemNameOfs + tempFields.itemNameSize;
              }

              if (tempFields.itemNameSize > itemNameSizeMax) {
                itemNameSizeMax = tempFields.itemNameSize;
              }
            }

            offset += CONST_PKG3_ITEM_ENTRY_SIZE;
          }

          itemsInfoBytes.namesSize = nameOffsetEnd - itemsInfoBytes.namesOfs; // Check if Item Names follow immediately after Item Entries (relative offsets inside Items Info)

          if (itemsInfoBytes.namesOfs < itemsInfoBytes.entriesSize) {
            console.error("Item Names with offset " + itemsInfoBytes.namesOfs + " are INTERLEAVED with the Item Entries of size " + itemsInfoBytes.entriesSize + ".");
            console.error('Please report this issue at https://github.com/windsurfer1122/PSN_get_pkg_info');
          } else if (itemsInfoBytes.namesOfs > itemsInfoBytes.entriesSize) {
            console.error("Item Names with offset " + itemsInfoBytes.namesOfs + " are not directly following the Item Entries with size " + itemsInfoBytes.entriesSize);
            console.error('Please report this issue at https://github.com/windsurfer1122/PSN_get_pkg_info');
          }

          readSize = itemsInfoBytes.namesOfs + itemsInfoBytes.namesSize;
          if (!(readSize > itemsInfoBytes.size)) return [3
          /*break*/
          , 9];

          if (metaData[0x0d] && metaData[0x0d].size >= itemsInfoBytes.entriesSize) {
            // meta data size too small for whole Items Info
            console.error("Items Info size " + metaData[0x0d].size + " from meta data 0x0D is too small for complete Items Info (Entries+Names) with total size of " + readSize);
            console.error('Please report this issue at https://github.com/windsurfer1122/PSN_get_pkg_info');
          }

          itemsInfoBytes.size = readSize;
          itemsInfoBytes.align = calculateAesAlignedOffsetAndSize(itemsInfoBytes.ofs, itemsInfoBytes.size);
          readOffset = itemsInfoBytes.align.ofs + itemsInfoBytes[CONST_DATATYPE_AS_IS].length;
          readSize = itemsInfoBytes.align.size - itemsInfoBytes[CONST_DATATYPE_AS_IS].length;
          _h.label = 5;

        case 5:
          _h.trys.push([5, 7,, 8]);

          _c = itemsInfoBytes;
          _d = CONST_DATATYPE_AS_IS;
          _f = (_e = Buffer).concat;
          _g = [Buffer.from(itemsInfoBytes[CONST_DATATYPE_AS_IS])];
          return [4
          /*yield*/
          , reader.read(headerFields.dataOffset + readOffset, readSize)];

        case 6:
          _c[_d] = _f.apply(_e, [_g.concat([_h.sent()])]);
          return [3
          /*break*/
          , 8];

        case 7:
          e_5 = _h.sent();
          reader.close();
          throw new Error("Could not get PKG3 encrypted data at offset " + (headerFields.dataOffset + readOffset) + " with size " + readSize + " from " + reader.getSource());

        case 8:
          itemsInfoBytes[CONST_DATATYPE_DECRYPTED] = Buffer.concat([Buffer.from(itemsInfoBytes[CONST_DATATYPE_DECRYPTED]), itemsInfoBytes[CONST_DATATYPE_AS_IS].slice(itemsInfoBytes[CONST_DATATYPE_DECRYPTED.length])]);
          return [3
          /*break*/
          , 10];

        case 9:
          if (metaData[0x0d]) {
            align = calculateAesAlignedOffsetAndSize(itemsInfoBytes.ofs, readSize);

            if (align.size !== metaData[0x0d].size) {
              console.error("Determined aligned Items Info size " + align.size + " <> " + metaData[0x0d].size + " from meta data 0x0D.");
              console.error('Please report this issue at https://github.com/windsurfer1122/PSN_get_pkg_info');
            }
          }

          _h.label = 10;

        case 10:
          // Decrypt and Parse PKG3 Item Names
          for (_i = 0, pkgItemEntries_2 = pkgItemEntries; _i < pkgItemEntries_2.length; _i++) {
            itemEntry = pkgItemEntries_2[_i];

            if (itemEntry.itemNameSize <= 0) {
              continue;
            }

            keyIndex = itemEntry.keyIndex;
            offset = itemsInfoBytes.ofs + itemEntry.itemNameOfs;
            align = calculateAesAlignedOffsetAndSize(offset, itemEntry.itemNameSize);

            if (align.ofsDelta > 0) {
              console.error("Unaligned encrypted offset " + offset + " - " + align.ofsDelta + " = " + align.ofs + " (+ " + headerFields.dataOffset + ") for " + itemEntry.index + " item name.");
              console.error('Please report this issue at https://github.com/windsurfer1122/PSN_get_pkg_info');
            }

            offset = align.ofs - itemsInfoBytes.align.ofs;
            tmp = itemsInfoBytes[CONST_DATATYPE_DECRYPTED].slice(offset + align.ofsDelta, offset + align.ofsDelta + itemEntry.itemNameSize);
            itemsInfoBytes[CONST_DATATYPE_DECRYPTED].set(tmp, offset);
            itemEntry.name = buf2Str(tmp);
          }

          hasher = new fast_sha256_1.Hash();
          hasher.update(itemsInfoBytes[CONST_DATATYPE_DECRYPTED]);
          itemsInfoBytes.sha256 = hasher.digest();

          if (metaData[0x0d] && buf2hex(itemsInfoBytes.sha256) !== buf2hex(metaData[0x0d].sha256)) {
            console.error('Calculated SHA-256 of decrypted Items Info does not match the one from meta data 0x0D.');
            console.error(itemsInfoBytes.sha256 + " <> " + metaData[0x0d].sha256);
            console.error('Please report this issue at https://github.com/windsurfer1122/PSN_get_pkg_info');
          } // Further analysys data


          itemsInfoBytes.fileOfs = headerFields.dataOffset + itemsInfoBytes.ofs;
          itemsInfoBytes.fileOfsEnd = itemsInfoBytes.fileOfs + itemsInfoBytes.size;
          return [2
          /*return*/
          , {
            itemsInfoBytes: itemsInfoBytes,
            pkgItemEntries: pkgItemEntries
          }];
      }
    });
  });
}

function processPkg3Item(extractionsFields, itemEntry, reader, itemData, size, extractions) {
  if (size === void 0) {
    size = null;
  }

  if (extractions === void 0) {
    extractions = null;
  }

  return __awaiter(this, void 0, void 0, function () {
    var itemDataUsable, addItemData, key, extract, align, dataOffset, fileOffset, restSize, encryptedBytes, decryptedBytes, blockDataOfs, blockDataSizeDelta, blockSize, blockDataSize, e_6, key, extract, writeBytes, key, extract;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          itemDataUsable = 0;
          addItemData = false;

          if (itemData !== null) {
            if (itemData.add) {
              addItemData = true;

              if (!itemData[CONST_DATATYPE_AS_IS]) {
                itemData[CONST_DATATYPE_AS_IS] = [];
              }

              if (!itemData[CONST_DATATYPE_DECRYPTED]) {
                itemData[CONST_DATATYPE_DECRYPTED] = [];
              }
            }

            if (itemData[CONST_DATATYPE_AS_IS]) {
              itemDataUsable = itemData[CONST_DATATYPE_AS_IS].length;
            }
          }

          if (extractions) {
            for (key in extractions) {
              extract = extractions[key];
              extract.itemBytesWritten = 0;
            }
          }

          align = null;

          if (size === null) {
            size = itemEntry.dataSize;
            align = itemEntry.align;
          } else {
            align = calculateAesAlignedOffsetAndSize(itemEntry.dataOfs, size);
          }

          dataOffset = align.ofs;
          fileOffset = extractionsFields.dataOffset + dataOffset;
          restSize = align.size;
          encryptedBytes = null;
          decryptedBytes = null;
          blockDataOfs = align.ofsDelta;
          blockDataSizeDelta = 0;
          blockSize = null;
          _a.label = 1;

        case 1:
          if (!(restSize > 0)) return [3
          /*break*/
          , 7]; // Calculate next data block

          if (itemDataUsable > 0) {
            blockSize = itemDataUsable;
          } else {
            blockSize = restSize; // blockSize = Math.min(restSize, CONST_READ_SIZE)
          }

          if (restSize <= blockSize) {
            // final block
            blockDataSizeDelta = align.sizeDelta - align.ofsDelta;
          }

          blockDataSize = blockSize - blockDataOfs - blockDataSizeDelta;
          if (!(itemDataUsable > 0)) return [3
          /*break*/
          , 2];
          encryptedBytes = itemData[CONST_DATATYPE_AS_IS];
          return [3
          /*break*/
          , 6];

        case 2:
          _a.trys.push([2, 4,, 5]);

          return [4
          /*yield*/
          , reader.read(fileOffset, blockSize)];

        case 3:
          encryptedBytes = _a.sent();
          return [3
          /*break*/
          , 5];

        case 4:
          e_6 = _a.sent();
          reader.close();
          throw new Error("Could not get PKG3 encrypted data at offset " + (extractionsFields.dataOffset + align.ofs) + " with size " + align.size + " from " + reader.getSource());

        case 5:
          if (addItemData) {
            itemData[CONST_DATATYPE_AS_IS] = encryptedBytes;
          }

          _a.label = 6;

        case 6:
          // Get and process decrypted block
          if (itemEntry.keyIndex && extractionsFields.aesCtr) {
            if (itemDataUsable > 0) {
              decryptedBytes = itemData[CONST_DATATYPE_DECRYPTED];
            } else {
              decryptedBytes = extractionsFields.aesCtr[itemEntry.keyIndex].decrypt(dataOffset, encryptedBytes);

              if (addItemData) {
                itemData[CONST_DATATYPE_DECRYPTED] = decryptedBytes;
              }
            }
          } // Write extractions


          if (extractions) {
            for (key in extractions) {
              extract = extractions[key]; // console.debug(extract)

              if (!extract.request) {
                continue;
              }

              writeBytes = null;

              if (extract.itemDataType === CONST_DATATYPE_AS_IS) {
                writeBytes = encryptedBytes;
              } else if (extract.itemDataType === CONST_DATATYPE_DECRYPTED) {
                writeBytes = decryptedBytes;
              } else {
                continue; // TODO: error handling
              }

              if (extract.aligned) {// extract.itemBytesWritten += extract.request
                // todo: ln 2073
              } else {// extract.itemBytesWritten += extract.request.write
                  // todo: ln 2075
                }
            }
          } // Prepare for next data block


          restSize -= blockSize;
          fileOffset += blockSize;
          dataOffset += blockSize;
          blockDataOfs = 0;
          itemDataUsable = 0;
          return [3
          /*break*/
          , 1];

        case 7:
          // Clean up extractions
          if (extractions) {
            for (key in extractions) {
              extract = extractions[key];

              if (extract.request) {
                extract.bytesWritten += extract.itemBytesWritten;
              }
            }
          }

          return [2
          /*return*/
          , itemData];
      }
    });
  });
}

function parsePbpHeader(headBytes, fileSize, reader) {
  return __awaiter(this, void 0, void 0, function () {
    var slicer, pbpHeaderFields, unencryptedBytes, readSize, _a, _b, _c, e_7, itemEntries, itemIndex, lastItem, key, itemEntry;

    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          slicer = new Slicer_1.Slicer(headBytes);
          pbpHeaderFields = {
            magic: slicer.get(0x04),
            version: slicer.get(0x04),
            paramSfoOfs: slicer.get(0x04),
            icon0PngOfs: slicer.get(0x04),
            icon1PmfOfs: slicer.get(0x04),
            pic0PngOfs: slicer.get(0x04),
            pic1PngOfs: slicer.get(0x04),
            snd0At3Ofs: slicer.get(0x04),
            dataPspOfs: slicer.get(0x04),
            dataPsarOfs: slicer.get(0x04)
          };
          console.debug(pbpHeaderFields);
          unencryptedBytes = new Uint8Array([]);
          if (!reader) return [3
          /*break*/
          , 4];
          readSize = pbpHeaderFields.icon0PngOfs - CONST_PBP_HEADER_SIZE;
          unencryptedBytes = headBytes;
          _d.label = 1;

        case 1:
          _d.trys.push([1, 3,, 4]);

          _b = (_a = Buffer).concat;
          _c = [unencryptedBytes];
          return [4
          /*yield*/
          , reader.read(CONST_PBP_HEADER_SIZE, readSize)];

        case 2:
          unencryptedBytes = _b.apply(_a, [_c.concat([_d.sent()])]);
          return [3
          /*break*/
          , 4];

        case 3:
          e_7 = _d.sent();
          reader.close();
          throw new Error("Could not get PBP unencrypted data at offset " + CONST_PBP_HEADER_SIZE + " with size " + readSize + " from " + reader.getSource());

        case 4:
          itemEntries = [];
          itemIndex = 0;
          lastItem = 0;

          for (key in pbpHeaderFields) {
            itemEntry = new PBPItemEntry({
              index: itemIndex,
              dataOfs: pbpHeaderFields[key],
              isFileOfs: pbpHeaderFields[key]
            }); // itemEntry.
            // itemEntry.structureDef
            // itemEntry.dataOfs = pbpHeaderFields[key]
            // itemEntry.isFileOfs = itemEntry.dataOfs

            if (lastItem) {
              itemEntries[lastItem].dataSize = itemEntry.dataOfs - itemEntries[lastItem].dataOfs;
              itemEntries[lastItem].align = calculateAesAlignedOffsetAndSize(itemEntries[lastItem].dataOfs, itemEntries[lastItem].dataSize);
            }

            lastItem = itemIndex;

            if (key === 'paramSfoOfs') {
              itemEntry.name = 'PARAM.SFO';
            } else if (key === 'icon0PngOfs') {
              itemEntry.name = 'ICON0.PNG';
            } else if (key === 'icon1PmfOfs') {
              itemEntry.name = 'ICON1.PMF';
            } else if (key === 'pic0PngOfs') {
              itemEntry.name = 'PIC0.PNG';
            } else if (key === 'pic1PngOfs') {
              itemEntry.name = 'PIC1.PNG';
            } else if (key === 'snd0At3Ofs') {
              itemEntry.name = 'SND0.AT3';
            } else if (key === 'dataPspOfs') {
              itemEntry.name = 'DATA.PSP';
            } else if (key === 'dataPsarOfs') {
              itemEntry.name = 'DATA.PSAR';
            }

            itemEntries.push(itemEntry);
            itemIndex += 1;
          }

          if (lastItem) {
            itemEntries[lastItem].dataSize = fileSize - itemEntries[lastItem].dataOfs;
            itemEntries[lastItem].align = calculateAesAlignedOffsetAndSize(itemEntries[lastItem].dataOfs, itemEntries[lastItem].dataSize);
          }

          return [2
          /*return*/
          , {
            pbpHeaderFields: pbpHeaderFields,
            itemEntries: itemEntries
          }];
      }
    });
  });
}

function getRegion(id) {
  // For definition see http://www.psdevwiki.com/ps3/Productcode
  //                    http://www.psdevwiki.com/ps3/PARAM.SFO#TITLE_ID
  //                    http://www.psdevwiki.com/ps4/Regioning
  //
  //                    https://playstationdev.wiki/psvitadevwiki/index.php?title=Languages
  //                    http://www.psdevwiki.com/ps3/Languages
  //                    http://www.psdevwiki.com/ps3/PARAM.SFO#TITLE
  //                    http://www.psdevwiki.com/ps4/Languages
  switch (id) {
    case 'A':
      return {
        region: 'ASIA',
        languages: ['09', '11', '10', '00']
      };

    case 'E':
      return {
        region: 'EU',
        languages: ['01', '18']
      };

    case 'H':
      return {
        region: 'ASIA(HKG)',
        languages: ['11', '10']
      };

    case 'I':
      return {
        region: 'INT',
        languages: ['01', '18']
      };

    case 'J':
      return {
        region: 'JP',
        languages: ['00']
      };

    case 'K':
      return {
        region: 'ASIA(KOR)',
        languages: ['09']
      };

    case 'U':
      return {
        region: 'US',
        languages: ['01']
      };

    default:
      return {
        region: '???',
        languages: null
      };
  }
}

function buf2hex(buffer) {
  var s = '';
  var h = '0123456789ABCDEF';
  new Uint8Array(buffer).forEach(function (v) {
    s += h[v >> 4] + h[v & 15];
  });
  return s;
}

function buf2Int(bytes, radix) {
  if (radix === void 0) {
    radix = 16;
  }

  return parseInt(buf2hex(bytes), radix);
}

function buf2Str(bytes) {
  var str = '';

  for (var i = 0; i < bytes.byteLength; i++) {
    str += String.fromCharCode(bytes[i]);
  }

  return str;
}

function toHexString(byteArray) {
  return Array.prototype.map.call(byteArray, function (byte) {
    return ('0' + (byte & 0xff).toString(16)).slice(-2);
  }).join('');
}

function toByteArray(hex) {
  var result = [];

  while (hex.length >= 2) {
    result.push(parseInt(hex.substring(0, 2), 16));
    hex = hex.substring(2, hex.length);
  }

  return result;
}

function humanFileSize(bytes, si) {
  if (si === void 0) {
    si = false;
  }

  var thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  var units = si ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  var u = -1;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);

  return bytes.toFixed(1) + ' ' + units[u];
}
},{"./PkgReader":"ysax","./PkgAesCounter":"Gk9W","./Slicer":"DUt7","fast-sha256":"GnoI","aes-js":"ilr3","path":"hEtP","buffer":"WXKZ"}],"Focm":[function(require,module,exports) {
"use strict";

var _GetInfo = _interopRequireDefault(require("./src/GetInfo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.getElementById("btnRun").addEventListener('click', function () {
  var getinfo = new _GetInfo.default({
    baseUrl: 'http://proxy.nopaystation.com'
  });
  var info = getinfo.pkg(document.getElementById('url').value);
  info.then(function (result) {
    document.getElementById('results').innerText = JSON.stringify(result, null, 1);
    console.log(result);
  });
});
},{"./src/GetInfo":"UQvq"}]},{},["Focm"], null)
//# sourceMappingURL=/index.map