var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except2, desc7) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except2)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc7 = __getOwnPropDesc(from, key)) || desc7.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../node_modules/hono/dist/compose.js
var compose;
var init_compose = __esm({
  "../node_modules/hono/dist/compose.js"() {
    init_functionsRoutes_0_6398490784585695();
    compose = /* @__PURE__ */ __name((middleware, onError, onNotFound) => {
      return (context, next) => {
        let index2 = -1;
        return dispatch(0);
        async function dispatch(i) {
          if (i <= index2) {
            throw new Error("next() called multiple times");
          }
          index2 = i;
          let res;
          let isError = false;
          let handler;
          if (middleware[i]) {
            handler = middleware[i][0][0];
            context.req.routeIndex = i;
          } else {
            handler = i === middleware.length && next || void 0;
          }
          if (handler) {
            try {
              res = await handler(context, () => dispatch(i + 1));
            } catch (err) {
              if (err instanceof Error && onError) {
                context.error = err;
                res = await onError(err, context);
                isError = true;
              } else {
                throw err;
              }
            }
          } else {
            if (context.finalized === false && onNotFound) {
              res = await onNotFound(context);
            }
          }
          if (res && (context.finalized === false || isError)) {
            context.res = res;
          }
          return context;
        }
        __name(dispatch, "dispatch");
      };
    }, "compose");
  }
});

// ../node_modules/hono/dist/http-exception.js
var init_http_exception = __esm({
  "../node_modules/hono/dist/http-exception.js"() {
    init_functionsRoutes_0_6398490784585695();
  }
});

// ../node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT;
var init_constants = __esm({
  "../node_modules/hono/dist/request/constants.js"() {
    init_functionsRoutes_0_6398490784585695();
    GET_MATCH_RESULT = /* @__PURE__ */ Symbol();
  }
});

// ../node_modules/hono/dist/utils/body.js
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
var parseBody, handleParsingAllValues, handleParsingNestedValues;
var init_body = __esm({
  "../node_modules/hono/dist/utils/body.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_request();
    parseBody = /* @__PURE__ */ __name(async (request, options = /* @__PURE__ */ Object.create(null)) => {
      const { all = false, dot = false } = options;
      const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
      const contentType = headers.get("Content-Type");
      if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
        return parseFormData(request, { all, dot });
      }
      return {};
    }, "parseBody");
    __name(parseFormData, "parseFormData");
    __name(convertFormDataToBodyData, "convertFormDataToBodyData");
    handleParsingAllValues = /* @__PURE__ */ __name((form, key, value) => {
      if (form[key] !== void 0) {
        if (Array.isArray(form[key])) {
          ;
          form[key].push(value);
        } else {
          form[key] = [form[key], value];
        }
      } else {
        if (!key.endsWith("[]")) {
          form[key] = value;
        } else {
          form[key] = [value];
        }
      }
    }, "handleParsingAllValues");
    handleParsingNestedValues = /* @__PURE__ */ __name((form, key, value) => {
      if (/(?:^|\.)__proto__\./.test(key)) {
        return;
      }
      let nestedForm = form;
      const keys = key.split(".");
      keys.forEach((key2, index2) => {
        if (index2 === keys.length - 1) {
          nestedForm[key2] = value;
        } else {
          if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
            nestedForm[key2] = /* @__PURE__ */ Object.create(null);
          }
          nestedForm = nestedForm[key2];
        }
      });
    }, "handleParsingNestedValues");
  }
});

// ../node_modules/hono/dist/utils/url.js
var splitPath, splitRoutingPath, extractGroupsFromPath, replaceGroupMarks, patternCache, getPattern, tryDecode, tryDecodeURI, getPath, getPathNoStrict, mergePath, checkOptionalParameter, _decodeURI, _getQueryParam, getQueryParam, getQueryParams, decodeURIComponent_;
var init_url = __esm({
  "../node_modules/hono/dist/utils/url.js"() {
    init_functionsRoutes_0_6398490784585695();
    splitPath = /* @__PURE__ */ __name((path) => {
      const paths = path.split("/");
      if (paths[0] === "") {
        paths.shift();
      }
      return paths;
    }, "splitPath");
    splitRoutingPath = /* @__PURE__ */ __name((routePath) => {
      const { groups, path } = extractGroupsFromPath(routePath);
      const paths = splitPath(path);
      return replaceGroupMarks(paths, groups);
    }, "splitRoutingPath");
    extractGroupsFromPath = /* @__PURE__ */ __name((path) => {
      const groups = [];
      path = path.replace(/\{[^}]+\}/g, (match3, index2) => {
        const mark = `@${index2}`;
        groups.push([mark, match3]);
        return mark;
      });
      return { groups, path };
    }, "extractGroupsFromPath");
    replaceGroupMarks = /* @__PURE__ */ __name((paths, groups) => {
      for (let i = groups.length - 1; i >= 0; i--) {
        const [mark] = groups[i];
        for (let j = paths.length - 1; j >= 0; j--) {
          if (paths[j].includes(mark)) {
            paths[j] = paths[j].replace(mark, groups[i][1]);
            break;
          }
        }
      }
      return paths;
    }, "replaceGroupMarks");
    patternCache = {};
    getPattern = /* @__PURE__ */ __name((label, next) => {
      if (label === "*") {
        return "*";
      }
      const match3 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
      if (match3) {
        const cacheKey = `${label}#${next}`;
        if (!patternCache[cacheKey]) {
          if (match3[2]) {
            patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match3[1], new RegExp(`^${match3[2]}(?=/${next})`)] : [label, match3[1], new RegExp(`^${match3[2]}$`)];
          } else {
            patternCache[cacheKey] = [label, match3[1], true];
          }
        }
        return patternCache[cacheKey];
      }
      return null;
    }, "getPattern");
    tryDecode = /* @__PURE__ */ __name((str, decoder) => {
      try {
        return decoder(str);
      } catch {
        return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match3) => {
          try {
            return decoder(match3);
          } catch {
            return match3;
          }
        });
      }
    }, "tryDecode");
    tryDecodeURI = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURI), "tryDecodeURI");
    getPath = /* @__PURE__ */ __name((request) => {
      const url = request.url;
      const start = url.indexOf("/", url.indexOf(":") + 4);
      let i = start;
      for (; i < url.length; i++) {
        const charCode = url.charCodeAt(i);
        if (charCode === 37) {
          const queryIndex = url.indexOf("?", i);
          const hashIndex = url.indexOf("#", i);
          const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
          const path = url.slice(start, end);
          return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
        } else if (charCode === 63 || charCode === 35) {
          break;
        }
      }
      return url.slice(start, i);
    }, "getPath");
    getPathNoStrict = /* @__PURE__ */ __name((request) => {
      const result = getPath(request);
      return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
    }, "getPathNoStrict");
    mergePath = /* @__PURE__ */ __name((base, sub, ...rest) => {
      if (rest.length) {
        sub = mergePath(sub, ...rest);
      }
      return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
    }, "mergePath");
    checkOptionalParameter = /* @__PURE__ */ __name((path) => {
      if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
        return null;
      }
      const segments = path.split("/");
      const results = [];
      let basePath = "";
      segments.forEach((segment) => {
        if (segment !== "" && !/\:/.test(segment)) {
          basePath += "/" + segment;
        } else if (/\:/.test(segment)) {
          if (/\?/.test(segment)) {
            if (results.length === 0 && basePath === "") {
              results.push("/");
            } else {
              results.push(basePath);
            }
            const optionalSegment = segment.replace("?", "");
            basePath += "/" + optionalSegment;
            results.push(basePath);
          } else {
            basePath += "/" + segment;
          }
        }
      });
      return results.filter((v, i, a) => a.indexOf(v) === i);
    }, "checkOptionalParameter");
    _decodeURI = /* @__PURE__ */ __name((value) => {
      if (!/[%+]/.test(value)) {
        return value;
      }
      if (value.indexOf("+") !== -1) {
        value = value.replace(/\+/g, " ");
      }
      return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
    }, "_decodeURI");
    _getQueryParam = /* @__PURE__ */ __name((url, key, multiple) => {
      let encoded;
      if (!multiple && key && !/[%+]/.test(key)) {
        let keyIndex2 = url.indexOf("?", 8);
        if (keyIndex2 === -1) {
          return void 0;
        }
        if (!url.startsWith(key, keyIndex2 + 1)) {
          keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
        }
        while (keyIndex2 !== -1) {
          const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
          if (trailingKeyCode === 61) {
            const valueIndex = keyIndex2 + key.length + 2;
            const endIndex = url.indexOf("&", valueIndex);
            return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
          } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
            return "";
          }
          keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
        }
        encoded = /[%+]/.test(url);
        if (!encoded) {
          return void 0;
        }
      }
      const results = {};
      encoded ??= /[%+]/.test(url);
      let keyIndex = url.indexOf("?", 8);
      while (keyIndex !== -1) {
        const nextKeyIndex = url.indexOf("&", keyIndex + 1);
        let valueIndex = url.indexOf("=", keyIndex);
        if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
          valueIndex = -1;
        }
        let name = url.slice(
          keyIndex + 1,
          valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
        );
        if (encoded) {
          name = _decodeURI(name);
        }
        keyIndex = nextKeyIndex;
        if (name === "") {
          continue;
        }
        let value;
        if (valueIndex === -1) {
          value = "";
        } else {
          value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
          if (encoded) {
            value = _decodeURI(value);
          }
        }
        if (multiple) {
          if (!(results[name] && Array.isArray(results[name]))) {
            results[name] = [];
          }
          ;
          results[name].push(value);
        } else {
          results[name] ??= value;
        }
      }
      return key ? results[key] : results;
    }, "_getQueryParam");
    getQueryParam = _getQueryParam;
    getQueryParams = /* @__PURE__ */ __name((url, key) => {
      return _getQueryParam(url, key, true);
    }, "getQueryParams");
    decodeURIComponent_ = decodeURIComponent;
  }
});

// ../node_modules/hono/dist/request.js
var tryDecodeURIComponent, HonoRequest;
var init_request = __esm({
  "../node_modules/hono/dist/request.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_http_exception();
    init_constants();
    init_body();
    init_url();
    tryDecodeURIComponent = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURIComponent_), "tryDecodeURIComponent");
    HonoRequest = class {
      static {
        __name(this, "HonoRequest");
      }
      /**
       * `.raw` can get the raw Request object.
       *
       * @see {@link https://hono.dev/docs/api/request#raw}
       *
       * @example
       * ```ts
       * // For Cloudflare Workers
       * app.post('/', async (c) => {
       *   const metadata = c.req.raw.cf?.hostMetadata?
       *   ...
       * })
       * ```
       */
      raw;
      #validatedData;
      // Short name of validatedData
      #matchResult;
      routeIndex = 0;
      /**
       * `.path` can get the pathname of the request.
       *
       * @see {@link https://hono.dev/docs/api/request#path}
       *
       * @example
       * ```ts
       * app.get('/about/me', (c) => {
       *   const pathname = c.req.path // `/about/me`
       * })
       * ```
       */
      path;
      bodyCache = {};
      constructor(request, path = "/", matchResult = [[]]) {
        this.raw = request;
        this.path = path;
        this.#matchResult = matchResult;
        this.#validatedData = {};
      }
      param(key) {
        return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
      }
      #getDecodedParam(key) {
        const paramKey = this.#matchResult[0][this.routeIndex][1][key];
        const param = this.#getParamValue(paramKey);
        return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
      }
      #getAllDecodedParams() {
        const decoded = {};
        const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
        for (const key of keys) {
          const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
          if (value !== void 0) {
            decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
          }
        }
        return decoded;
      }
      #getParamValue(paramKey) {
        return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
      }
      query(key) {
        return getQueryParam(this.url, key);
      }
      queries(key) {
        return getQueryParams(this.url, key);
      }
      header(name) {
        if (name) {
          return this.raw.headers.get(name) ?? void 0;
        }
        const headerData = {};
        this.raw.headers.forEach((value, key) => {
          headerData[key] = value;
        });
        return headerData;
      }
      async parseBody(options) {
        return parseBody(this, options);
      }
      #cachedBody = /* @__PURE__ */ __name((key) => {
        const { bodyCache, raw: raw2 } = this;
        const cachedBody = bodyCache[key];
        if (cachedBody) {
          return cachedBody;
        }
        const anyCachedKey = Object.keys(bodyCache)[0];
        if (anyCachedKey) {
          return bodyCache[anyCachedKey].then((body) => {
            if (anyCachedKey === "json") {
              body = JSON.stringify(body);
            }
            return new Response(body)[key]();
          });
        }
        return bodyCache[key] = raw2[key]();
      }, "#cachedBody");
      /**
       * `.json()` can parse Request body of type `application/json`
       *
       * @see {@link https://hono.dev/docs/api/request#json}
       *
       * @example
       * ```ts
       * app.post('/entry', async (c) => {
       *   const body = await c.req.json()
       * })
       * ```
       */
      json() {
        return this.#cachedBody("text").then((text2) => JSON.parse(text2));
      }
      /**
       * `.text()` can parse Request body of type `text/plain`
       *
       * @see {@link https://hono.dev/docs/api/request#text}
       *
       * @example
       * ```ts
       * app.post('/entry', async (c) => {
       *   const body = await c.req.text()
       * })
       * ```
       */
      text() {
        return this.#cachedBody("text");
      }
      /**
       * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
       *
       * @see {@link https://hono.dev/docs/api/request#arraybuffer}
       *
       * @example
       * ```ts
       * app.post('/entry', async (c) => {
       *   const body = await c.req.arrayBuffer()
       * })
       * ```
       */
      arrayBuffer() {
        return this.#cachedBody("arrayBuffer");
      }
      /**
       * Parses the request body as a `Blob`.
       * @example
       * ```ts
       * app.post('/entry', async (c) => {
       *   const body = await c.req.blob();
       * });
       * ```
       * @see https://hono.dev/docs/api/request#blob
       */
      blob() {
        return this.#cachedBody("blob");
      }
      /**
       * Parses the request body as `FormData`.
       * @example
       * ```ts
       * app.post('/entry', async (c) => {
       *   const body = await c.req.formData();
       * });
       * ```
       * @see https://hono.dev/docs/api/request#formdata
       */
      formData() {
        return this.#cachedBody("formData");
      }
      /**
       * Adds validated data to the request.
       *
       * @param target - The target of the validation.
       * @param data - The validated data to add.
       */
      addValidatedData(target, data) {
        this.#validatedData[target] = data;
      }
      valid(target) {
        return this.#validatedData[target];
      }
      /**
       * `.url()` can get the request url strings.
       *
       * @see {@link https://hono.dev/docs/api/request#url}
       *
       * @example
       * ```ts
       * app.get('/about/me', (c) => {
       *   const url = c.req.url // `http://localhost:8787/about/me`
       *   ...
       * })
       * ```
       */
      get url() {
        return this.raw.url;
      }
      /**
       * `.method()` can get the method name of the request.
       *
       * @see {@link https://hono.dev/docs/api/request#method}
       *
       * @example
       * ```ts
       * app.get('/about/me', (c) => {
       *   const method = c.req.method // `GET`
       * })
       * ```
       */
      get method() {
        return this.raw.method;
      }
      get [GET_MATCH_RESULT]() {
        return this.#matchResult;
      }
      /**
       * `.matchedRoutes()` can return a matched route in the handler
       *
       * @deprecated
       *
       * Use matchedRoutes helper defined in "hono/route" instead.
       *
       * @see {@link https://hono.dev/docs/api/request#matchedroutes}
       *
       * @example
       * ```ts
       * app.use('*', async function logger(c, next) {
       *   await next()
       *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
       *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
       *     console.log(
       *       method,
       *       ' ',
       *       path,
       *       ' '.repeat(Math.max(10 - path.length, 0)),
       *       name,
       *       i === c.req.routeIndex ? '<- respond from here' : ''
       *     )
       *   })
       * })
       * ```
       */
      get matchedRoutes() {
        return this.#matchResult[0].map(([[, route]]) => route);
      }
      /**
       * `routePath()` can retrieve the path registered within the handler
       *
       * @deprecated
       *
       * Use routePath helper defined in "hono/route" instead.
       *
       * @see {@link https://hono.dev/docs/api/request#routepath}
       *
       * @example
       * ```ts
       * app.get('/posts/:id', (c) => {
       *   return c.json({ path: c.req.routePath })
       * })
       * ```
       */
      get routePath() {
        return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
      }
    };
  }
});

// ../node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase, raw, resolveCallback;
var init_html = __esm({
  "../node_modules/hono/dist/utils/html.js"() {
    init_functionsRoutes_0_6398490784585695();
    HtmlEscapedCallbackPhase = {
      Stringify: 1,
      BeforeStream: 2,
      Stream: 3
    };
    raw = /* @__PURE__ */ __name((value, callbacks) => {
      const escapedString = new String(value);
      escapedString.isEscaped = true;
      escapedString.callbacks = callbacks;
      return escapedString;
    }, "raw");
    resolveCallback = /* @__PURE__ */ __name(async (str, phase, preserveCallbacks, context, buffer) => {
      if (typeof str === "object" && !(str instanceof String)) {
        if (!(str instanceof Promise)) {
          str = str.toString();
        }
        if (str instanceof Promise) {
          str = await str;
        }
      }
      const callbacks = str.callbacks;
      if (!callbacks?.length) {
        return Promise.resolve(str);
      }
      if (buffer) {
        buffer[0] += str;
      } else {
        buffer = [str];
      }
      const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
        (res) => Promise.all(
          res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
        ).then(() => buffer[0])
      );
      if (preserveCallbacks) {
        return raw(await resStr, callbacks);
      } else {
        return resStr;
      }
    }, "resolveCallback");
  }
});

// ../node_modules/hono/dist/context.js
var TEXT_PLAIN, setDefaultContentType, createResponseInstance, Context;
var init_context = __esm({
  "../node_modules/hono/dist/context.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_request();
    init_html();
    TEXT_PLAIN = "text/plain; charset=UTF-8";
    setDefaultContentType = /* @__PURE__ */ __name((contentType, headers) => {
      return {
        "Content-Type": contentType,
        ...headers
      };
    }, "setDefaultContentType");
    createResponseInstance = /* @__PURE__ */ __name((body, init) => new Response(body, init), "createResponseInstance");
    Context = class {
      static {
        __name(this, "Context");
      }
      #rawRequest;
      #req;
      /**
       * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
       *
       * @see {@link https://hono.dev/docs/api/context#env}
       *
       * @example
       * ```ts
       * // Environment object for Cloudflare Workers
       * app.get('*', async c => {
       *   const counter = c.env.COUNTER
       * })
       * ```
       */
      env = {};
      #var;
      finalized = false;
      /**
       * `.error` can get the error object from the middleware if the Handler throws an error.
       *
       * @see {@link https://hono.dev/docs/api/context#error}
       *
       * @example
       * ```ts
       * app.use('*', async (c, next) => {
       *   await next()
       *   if (c.error) {
       *     // do something...
       *   }
       * })
       * ```
       */
      error;
      #status;
      #executionCtx;
      #res;
      #layout;
      #renderer;
      #notFoundHandler;
      #preparedHeaders;
      #matchResult;
      #path;
      /**
       * Creates an instance of the Context class.
       *
       * @param req - The Request object.
       * @param options - Optional configuration options for the context.
       */
      constructor(req, options) {
        this.#rawRequest = req;
        if (options) {
          this.#executionCtx = options.executionCtx;
          this.env = options.env;
          this.#notFoundHandler = options.notFoundHandler;
          this.#path = options.path;
          this.#matchResult = options.matchResult;
        }
      }
      /**
       * `.req` is the instance of {@link HonoRequest}.
       */
      get req() {
        this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
        return this.#req;
      }
      /**
       * @see {@link https://hono.dev/docs/api/context#event}
       * The FetchEvent associated with the current request.
       *
       * @throws Will throw an error if the context does not have a FetchEvent.
       */
      get event() {
        if (this.#executionCtx && "respondWith" in this.#executionCtx) {
          return this.#executionCtx;
        } else {
          throw Error("This context has no FetchEvent");
        }
      }
      /**
       * @see {@link https://hono.dev/docs/api/context#executionctx}
       * The ExecutionContext associated with the current request.
       *
       * @throws Will throw an error if the context does not have an ExecutionContext.
       */
      get executionCtx() {
        if (this.#executionCtx) {
          return this.#executionCtx;
        } else {
          throw Error("This context has no ExecutionContext");
        }
      }
      /**
       * @see {@link https://hono.dev/docs/api/context#res}
       * The Response object for the current request.
       */
      get res() {
        return this.#res ||= createResponseInstance(null, {
          headers: this.#preparedHeaders ??= new Headers()
        });
      }
      /**
       * Sets the Response object for the current request.
       *
       * @param _res - The Response object to set.
       */
      set res(_res) {
        if (this.#res && _res) {
          _res = createResponseInstance(_res.body, _res);
          for (const [k, v] of this.#res.headers.entries()) {
            if (k === "content-type") {
              continue;
            }
            if (k === "set-cookie") {
              const cookies = this.#res.headers.getSetCookie();
              _res.headers.delete("set-cookie");
              for (const cookie of cookies) {
                _res.headers.append("set-cookie", cookie);
              }
            } else {
              _res.headers.set(k, v);
            }
          }
        }
        this.#res = _res;
        this.finalized = true;
      }
      /**
       * `.render()` can create a response within a layout.
       *
       * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
       *
       * @example
       * ```ts
       * app.get('/', (c) => {
       *   return c.render('Hello!')
       * })
       * ```
       */
      render = /* @__PURE__ */ __name((...args) => {
        this.#renderer ??= (content) => this.html(content);
        return this.#renderer(...args);
      }, "render");
      /**
       * Sets the layout for the response.
       *
       * @param layout - The layout to set.
       * @returns The layout function.
       */
      setLayout = /* @__PURE__ */ __name((layout) => this.#layout = layout, "setLayout");
      /**
       * Gets the current layout for the response.
       *
       * @returns The current layout function.
       */
      getLayout = /* @__PURE__ */ __name(() => this.#layout, "getLayout");
      /**
       * `.setRenderer()` can set the layout in the custom middleware.
       *
       * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
       *
       * @example
       * ```tsx
       * app.use('*', async (c, next) => {
       *   c.setRenderer((content) => {
       *     return c.html(
       *       <html>
       *         <body>
       *           <p>{content}</p>
       *         </body>
       *       </html>
       *     )
       *   })
       *   await next()
       * })
       * ```
       */
      setRenderer = /* @__PURE__ */ __name((renderer) => {
        this.#renderer = renderer;
      }, "setRenderer");
      /**
       * `.header()` can set headers.
       *
       * @see {@link https://hono.dev/docs/api/context#header}
       *
       * @example
       * ```ts
       * app.get('/welcome', (c) => {
       *   // Set headers
       *   c.header('X-Message', 'Hello!')
       *   c.header('Content-Type', 'text/plain')
       *
       *   return c.body('Thank you for coming')
       * })
       * ```
       */
      header = /* @__PURE__ */ __name((name, value, options) => {
        if (this.finalized) {
          this.#res = createResponseInstance(this.#res.body, this.#res);
        }
        const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
        if (value === void 0) {
          headers.delete(name);
        } else if (options?.append) {
          headers.append(name, value);
        } else {
          headers.set(name, value);
        }
      }, "header");
      status = /* @__PURE__ */ __name((status) => {
        this.#status = status;
      }, "status");
      /**
       * `.set()` can set the value specified by the key.
       *
       * @see {@link https://hono.dev/docs/api/context#set-get}
       *
       * @example
       * ```ts
       * app.use('*', async (c, next) => {
       *   c.set('message', 'Hono is hot!!')
       *   await next()
       * })
       * ```
       */
      set = /* @__PURE__ */ __name((key, value) => {
        this.#var ??= /* @__PURE__ */ new Map();
        this.#var.set(key, value);
      }, "set");
      /**
       * `.get()` can use the value specified by the key.
       *
       * @see {@link https://hono.dev/docs/api/context#set-get}
       *
       * @example
       * ```ts
       * app.get('/', (c) => {
       *   const message = c.get('message')
       *   return c.text(`The message is "${message}"`)
       * })
       * ```
       */
      get = /* @__PURE__ */ __name((key) => {
        return this.#var ? this.#var.get(key) : void 0;
      }, "get");
      /**
       * `.var` can access the value of a variable.
       *
       * @see {@link https://hono.dev/docs/api/context#var}
       *
       * @example
       * ```ts
       * const result = c.var.client.oneMethod()
       * ```
       */
      // c.var.propName is a read-only
      get var() {
        if (!this.#var) {
          return {};
        }
        return Object.fromEntries(this.#var);
      }
      #newResponse(data, arg, headers) {
        const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
        if (typeof arg === "object" && "headers" in arg) {
          const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
          for (const [key, value] of argHeaders) {
            if (key.toLowerCase() === "set-cookie") {
              responseHeaders.append(key, value);
            } else {
              responseHeaders.set(key, value);
            }
          }
        }
        if (headers) {
          for (const [k, v] of Object.entries(headers)) {
            if (typeof v === "string") {
              responseHeaders.set(k, v);
            } else {
              responseHeaders.delete(k);
              for (const v2 of v) {
                responseHeaders.append(k, v2);
              }
            }
          }
        }
        const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
        return createResponseInstance(data, { status, headers: responseHeaders });
      }
      newResponse = /* @__PURE__ */ __name((...args) => this.#newResponse(...args), "newResponse");
      /**
       * `.body()` can return the HTTP response.
       * You can set headers with `.header()` and set HTTP status code with `.status`.
       * This can also be set in `.text()`, `.json()` and so on.
       *
       * @see {@link https://hono.dev/docs/api/context#body}
       *
       * @example
       * ```ts
       * app.get('/welcome', (c) => {
       *   // Set headers
       *   c.header('X-Message', 'Hello!')
       *   c.header('Content-Type', 'text/plain')
       *   // Set HTTP status code
       *   c.status(201)
       *
       *   // Return the response body
       *   return c.body('Thank you for coming')
       * })
       * ```
       */
      body = /* @__PURE__ */ __name((data, arg, headers) => this.#newResponse(data, arg, headers), "body");
      /**
       * `.text()` can render text as `Content-Type:text/plain`.
       *
       * @see {@link https://hono.dev/docs/api/context#text}
       *
       * @example
       * ```ts
       * app.get('/say', (c) => {
       *   return c.text('Hello!')
       * })
       * ```
       */
      text = /* @__PURE__ */ __name((text2, arg, headers) => {
        return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text2) : this.#newResponse(
          text2,
          arg,
          setDefaultContentType(TEXT_PLAIN, headers)
        );
      }, "text");
      /**
       * `.json()` can render JSON as `Content-Type:application/json`.
       *
       * @see {@link https://hono.dev/docs/api/context#json}
       *
       * @example
       * ```ts
       * app.get('/api', (c) => {
       *   return c.json({ message: 'Hello!' })
       * })
       * ```
       */
      json = /* @__PURE__ */ __name((object2, arg, headers) => {
        return this.#newResponse(
          JSON.stringify(object2),
          arg,
          setDefaultContentType("application/json", headers)
        );
      }, "json");
      html = /* @__PURE__ */ __name((html, arg, headers) => {
        const res = /* @__PURE__ */ __name((html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers)), "res");
        return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
      }, "html");
      /**
       * `.redirect()` can Redirect, default status code is 302.
       *
       * @see {@link https://hono.dev/docs/api/context#redirect}
       *
       * @example
       * ```ts
       * app.get('/redirect', (c) => {
       *   return c.redirect('/')
       * })
       * app.get('/redirect-permanently', (c) => {
       *   return c.redirect('/', 301)
       * })
       * ```
       */
      redirect = /* @__PURE__ */ __name((location, status) => {
        const locationString = String(location);
        this.header(
          "Location",
          // Multibyes should be encoded
          // eslint-disable-next-line no-control-regex
          !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
        );
        return this.newResponse(null, status ?? 302);
      }, "redirect");
      /**
       * `.notFound()` can return the Not Found Response.
       *
       * @see {@link https://hono.dev/docs/api/context#notfound}
       *
       * @example
       * ```ts
       * app.get('/notfound', (c) => {
       *   return c.notFound()
       * })
       * ```
       */
      notFound = /* @__PURE__ */ __name(() => {
        this.#notFoundHandler ??= () => createResponseInstance();
        return this.#notFoundHandler(this);
      }, "notFound");
    };
  }
});

// ../node_modules/hono/dist/router.js
var METHOD_NAME_ALL, METHOD_NAME_ALL_LOWERCASE, METHODS, MESSAGE_MATCHER_IS_ALREADY_BUILT, UnsupportedPathError;
var init_router = __esm({
  "../node_modules/hono/dist/router.js"() {
    init_functionsRoutes_0_6398490784585695();
    METHOD_NAME_ALL = "ALL";
    METHOD_NAME_ALL_LOWERCASE = "all";
    METHODS = ["get", "post", "put", "delete", "options", "patch"];
    MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
    UnsupportedPathError = class extends Error {
      static {
        __name(this, "UnsupportedPathError");
      }
    };
  }
});

// ../node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER;
var init_constants2 = __esm({
  "../node_modules/hono/dist/utils/constants.js"() {
    init_functionsRoutes_0_6398490784585695();
    COMPOSED_HANDLER = "__COMPOSED_HANDLER";
  }
});

// ../node_modules/hono/dist/hono-base.js
var notFoundHandler, errorHandler, Hono;
var init_hono_base = __esm({
  "../node_modules/hono/dist/hono-base.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_compose();
    init_context();
    init_router();
    init_constants2();
    init_url();
    notFoundHandler = /* @__PURE__ */ __name((c) => {
      return c.text("404 Not Found", 404);
    }, "notFoundHandler");
    errorHandler = /* @__PURE__ */ __name((err, c) => {
      if ("getResponse" in err) {
        const res = err.getResponse();
        return c.newResponse(res.body, res);
      }
      console.error(err);
      return c.text("Internal Server Error", 500);
    }, "errorHandler");
    Hono = class _Hono {
      static {
        __name(this, "_Hono");
      }
      get;
      post;
      put;
      delete;
      options;
      patch;
      all;
      on;
      use;
      /*
        This class is like an abstract class and does not have a router.
        To use it, inherit the class and implement router in the constructor.
      */
      router;
      getPath;
      // Cannot use `#` because it requires visibility at JavaScript runtime.
      _basePath = "/";
      #path = "/";
      routes = [];
      constructor(options = {}) {
        const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
        allMethods.forEach((method) => {
          this[method] = (args1, ...args) => {
            if (typeof args1 === "string") {
              this.#path = args1;
            } else {
              this.#addRoute(method, this.#path, args1);
            }
            args.forEach((handler) => {
              this.#addRoute(method, this.#path, handler);
            });
            return this;
          };
        });
        this.on = (method, path, ...handlers) => {
          for (const p of [path].flat()) {
            this.#path = p;
            for (const m of [method].flat()) {
              handlers.map((handler) => {
                this.#addRoute(m.toUpperCase(), this.#path, handler);
              });
            }
          }
          return this;
        };
        this.use = (arg1, ...handlers) => {
          if (typeof arg1 === "string") {
            this.#path = arg1;
          } else {
            this.#path = "*";
            handlers.unshift(arg1);
          }
          handlers.forEach((handler) => {
            this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
          });
          return this;
        };
        const { strict, ...optionsWithoutStrict } = options;
        Object.assign(this, optionsWithoutStrict);
        this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
      }
      #clone() {
        const clone = new _Hono({
          router: this.router,
          getPath: this.getPath
        });
        clone.errorHandler = this.errorHandler;
        clone.#notFoundHandler = this.#notFoundHandler;
        clone.routes = this.routes;
        return clone;
      }
      #notFoundHandler = notFoundHandler;
      // Cannot use `#` because it requires visibility at JavaScript runtime.
      errorHandler = errorHandler;
      /**
       * `.route()` allows grouping other Hono instance in routes.
       *
       * @see {@link https://hono.dev/docs/api/routing#grouping}
       *
       * @param {string} path - base Path
       * @param {Hono} app - other Hono instance
       * @returns {Hono} routed Hono instance
       *
       * @example
       * ```ts
       * const app = new Hono()
       * const app2 = new Hono()
       *
       * app2.get("/user", (c) => c.text("user"))
       * app.route("/api", app2) // GET /api/user
       * ```
       */
      route(path, app2) {
        const subApp = this.basePath(path);
        app2.routes.map((r) => {
          let handler;
          if (app2.errorHandler === errorHandler) {
            handler = r.handler;
          } else {
            handler = /* @__PURE__ */ __name(async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res, "handler");
            handler[COMPOSED_HANDLER] = r.handler;
          }
          subApp.#addRoute(r.method, r.path, handler);
        });
        return this;
      }
      /**
       * `.basePath()` allows base paths to be specified.
       *
       * @see {@link https://hono.dev/docs/api/routing#base-path}
       *
       * @param {string} path - base Path
       * @returns {Hono} changed Hono instance
       *
       * @example
       * ```ts
       * const api = new Hono().basePath('/api')
       * ```
       */
      basePath(path) {
        const subApp = this.#clone();
        subApp._basePath = mergePath(this._basePath, path);
        return subApp;
      }
      /**
       * `.onError()` handles an error and returns a customized Response.
       *
       * @see {@link https://hono.dev/docs/api/hono#error-handling}
       *
       * @param {ErrorHandler} handler - request Handler for error
       * @returns {Hono} changed Hono instance
       *
       * @example
       * ```ts
       * app.onError((err, c) => {
       *   console.error(`${err}`)
       *   return c.text('Custom Error Message', 500)
       * })
       * ```
       */
      onError = /* @__PURE__ */ __name((handler) => {
        this.errorHandler = handler;
        return this;
      }, "onError");
      /**
       * `.notFound()` allows you to customize a Not Found Response.
       *
       * @see {@link https://hono.dev/docs/api/hono#not-found}
       *
       * @param {NotFoundHandler} handler - request handler for not-found
       * @returns {Hono} changed Hono instance
       *
       * @example
       * ```ts
       * app.notFound((c) => {
       *   return c.text('Custom 404 Message', 404)
       * })
       * ```
       */
      notFound = /* @__PURE__ */ __name((handler) => {
        this.#notFoundHandler = handler;
        return this;
      }, "notFound");
      /**
       * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
       *
       * @see {@link https://hono.dev/docs/api/hono#mount}
       *
       * @param {string} path - base Path
       * @param {Function} applicationHandler - other Request Handler
       * @param {MountOptions} [options] - options of `.mount()`
       * @returns {Hono} mounted Hono instance
       *
       * @example
       * ```ts
       * import { Router as IttyRouter } from 'itty-router'
       * import { Hono } from 'hono'
       * // Create itty-router application
       * const ittyRouter = IttyRouter()
       * // GET /itty-router/hello
       * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
       *
       * const app = new Hono()
       * app.mount('/itty-router', ittyRouter.handle)
       * ```
       *
       * @example
       * ```ts
       * const app = new Hono()
       * // Send the request to another application without modification.
       * app.mount('/app', anotherApp, {
       *   replaceRequest: (req) => req,
       * })
       * ```
       */
      mount(path, applicationHandler, options) {
        let replaceRequest;
        let optionHandler;
        if (options) {
          if (typeof options === "function") {
            optionHandler = options;
          } else {
            optionHandler = options.optionHandler;
            if (options.replaceRequest === false) {
              replaceRequest = /* @__PURE__ */ __name((request) => request, "replaceRequest");
            } else {
              replaceRequest = options.replaceRequest;
            }
          }
        }
        const getOptions = optionHandler ? (c) => {
          const options2 = optionHandler(c);
          return Array.isArray(options2) ? options2 : [options2];
        } : (c) => {
          let executionContext = void 0;
          try {
            executionContext = c.executionCtx;
          } catch {
          }
          return [c.env, executionContext];
        };
        replaceRequest ||= (() => {
          const mergedPath = mergePath(this._basePath, path);
          const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
          return (request) => {
            const url = new URL(request.url);
            url.pathname = url.pathname.slice(pathPrefixLength) || "/";
            return new Request(url, request);
          };
        })();
        const handler = /* @__PURE__ */ __name(async (c, next) => {
          const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
          if (res) {
            return res;
          }
          await next();
        }, "handler");
        this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
        return this;
      }
      #addRoute(method, path, handler) {
        method = method.toUpperCase();
        path = mergePath(this._basePath, path);
        const r = { basePath: this._basePath, path, method, handler };
        this.router.add(method, path, [handler, r]);
        this.routes.push(r);
      }
      #handleError(err, c) {
        if (err instanceof Error) {
          return this.errorHandler(err, c);
        }
        throw err;
      }
      #dispatch(request, executionCtx, env, method) {
        if (method === "HEAD") {
          return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
        }
        const path = this.getPath(request, { env });
        const matchResult = this.router.match(method, path);
        const c = new Context(request, {
          path,
          matchResult,
          env,
          executionCtx,
          notFoundHandler: this.#notFoundHandler
        });
        if (matchResult[0].length === 1) {
          let res;
          try {
            res = matchResult[0][0][0][0](c, async () => {
              c.res = await this.#notFoundHandler(c);
            });
          } catch (err) {
            return this.#handleError(err, c);
          }
          return res instanceof Promise ? res.then(
            (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
          ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
        }
        const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
        return (async () => {
          try {
            const context = await composed(c);
            if (!context.finalized) {
              throw new Error(
                "Context is not finalized. Did you forget to return a Response object or `await next()`?"
              );
            }
            return context.res;
          } catch (err) {
            return this.#handleError(err, c);
          }
        })();
      }
      /**
       * `.fetch()` will be entry point of your app.
       *
       * @see {@link https://hono.dev/docs/api/hono#fetch}
       *
       * @param {Request} request - request Object of request
       * @param {Env} Env - env Object
       * @param {ExecutionContext} - context of execution
       * @returns {Response | Promise<Response>} response of request
       *
       */
      fetch = /* @__PURE__ */ __name((request, ...rest) => {
        return this.#dispatch(request, rest[1], rest[0], request.method);
      }, "fetch");
      /**
       * `.request()` is a useful method for testing.
       * You can pass a URL or pathname to send a GET request.
       * app will return a Response object.
       * ```ts
       * test('GET /hello is ok', async () => {
       *   const res = await app.request('/hello')
       *   expect(res.status).toBe(200)
       * })
       * ```
       * @see https://hono.dev/docs/api/hono#request
       */
      request = /* @__PURE__ */ __name((input, requestInit, Env, executionCtx) => {
        if (input instanceof Request) {
          return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
        }
        input = input.toString();
        return this.fetch(
          new Request(
            /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
            requestInit
          ),
          Env,
          executionCtx
        );
      }, "request");
      /**
       * `.fire()` automatically adds a global fetch event listener.
       * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
       * @deprecated
       * Use `fire` from `hono/service-worker` instead.
       * ```ts
       * import { Hono } from 'hono'
       * import { fire } from 'hono/service-worker'
       *
       * const app = new Hono()
       * // ...
       * fire(app)
       * ```
       * @see https://hono.dev/docs/api/hono#fire
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
       * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
       */
      fire = /* @__PURE__ */ __name(() => {
        addEventListener("fetch", (event) => {
          event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
        });
      }, "fire");
    };
  }
});

// ../node_modules/hono/dist/router/reg-exp-router/matcher.js
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match22 = /* @__PURE__ */ __name(((method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index2 = match3.indexOf("", 1);
    return [matcher[1][index2], match3];
  }), "match2");
  this.match = match22;
  return match22(method, path);
}
var emptyParam;
var init_matcher = __esm({
  "../node_modules/hono/dist/router/reg-exp-router/matcher.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_router();
    emptyParam = [];
    __name(match, "match");
  }
});

// ../node_modules/hono/dist/router/reg-exp-router/node.js
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
var LABEL_REG_EXP_STR, ONLY_WILDCARD_REG_EXP_STR, TAIL_WILDCARD_REG_EXP_STR, PATH_ERROR, regExpMetaChars, Node;
var init_node = __esm({
  "../node_modules/hono/dist/router/reg-exp-router/node.js"() {
    init_functionsRoutes_0_6398490784585695();
    LABEL_REG_EXP_STR = "[^/]+";
    ONLY_WILDCARD_REG_EXP_STR = ".*";
    TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
    PATH_ERROR = /* @__PURE__ */ Symbol();
    regExpMetaChars = new Set(".\\+*[^]$()");
    __name(compareKey, "compareKey");
    Node = class _Node {
      static {
        __name(this, "_Node");
      }
      #index;
      #varIndex;
      #children = /* @__PURE__ */ Object.create(null);
      insert(tokens, index2, paramMap, context, pathErrorCheckOnly) {
        if (tokens.length === 0) {
          if (this.#index !== void 0) {
            throw PATH_ERROR;
          }
          if (pathErrorCheckOnly) {
            return;
          }
          this.#index = index2;
          return;
        }
        const [token, ...restTokens] = tokens;
        const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
        let node;
        if (pattern) {
          const name = pattern[1];
          let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
          if (name && pattern[2]) {
            if (regexpStr === ".*") {
              throw PATH_ERROR;
            }
            regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
            if (/\((?!\?:)/.test(regexpStr)) {
              throw PATH_ERROR;
            }
          }
          node = this.#children[regexpStr];
          if (!node) {
            if (Object.keys(this.#children).some(
              (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
            )) {
              throw PATH_ERROR;
            }
            if (pathErrorCheckOnly) {
              return;
            }
            node = this.#children[regexpStr] = new _Node();
            if (name !== "") {
              node.#varIndex = context.varIndex++;
            }
          }
          if (!pathErrorCheckOnly && name !== "") {
            paramMap.push([name, node.#varIndex]);
          }
        } else {
          node = this.#children[token];
          if (!node) {
            if (Object.keys(this.#children).some(
              (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
            )) {
              throw PATH_ERROR;
            }
            if (pathErrorCheckOnly) {
              return;
            }
            node = this.#children[token] = new _Node();
          }
        }
        node.insert(restTokens, index2, paramMap, context, pathErrorCheckOnly);
      }
      buildRegExpStr() {
        const childKeys = Object.keys(this.#children).sort(compareKey);
        const strList = childKeys.map((k) => {
          const c = this.#children[k];
          return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
        });
        if (typeof this.#index === "number") {
          strList.unshift(`#${this.#index}`);
        }
        if (strList.length === 0) {
          return "";
        }
        if (strList.length === 1) {
          return strList[0];
        }
        return "(?:" + strList.join("|") + ")";
      }
    };
  }
});

// ../node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie;
var init_trie = __esm({
  "../node_modules/hono/dist/router/reg-exp-router/trie.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_node();
    Trie = class {
      static {
        __name(this, "Trie");
      }
      #context = { varIndex: 0 };
      #root = new Node();
      insert(path, index2, pathErrorCheckOnly) {
        const paramAssoc = [];
        const groups = [];
        for (let i = 0; ; ) {
          let replaced = false;
          path = path.replace(/\{[^}]+\}/g, (m) => {
            const mark = `@\\${i}`;
            groups[i] = [mark, m];
            i++;
            replaced = true;
            return mark;
          });
          if (!replaced) {
            break;
          }
        }
        const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
        for (let i = groups.length - 1; i >= 0; i--) {
          const [mark] = groups[i];
          for (let j = tokens.length - 1; j >= 0; j--) {
            if (tokens[j].indexOf(mark) !== -1) {
              tokens[j] = tokens[j].replace(mark, groups[i][1]);
              break;
            }
          }
        }
        this.#root.insert(tokens, index2, paramAssoc, this.#context, pathErrorCheckOnly);
        return paramAssoc;
      }
      buildRegExp() {
        let regexp = this.#root.buildRegExpStr();
        if (regexp === "") {
          return [/^$/, [], []];
        }
        let captureIndex = 0;
        const indexReplacementMap = [];
        const paramReplacementMap = [];
        regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
          if (handlerIndex !== void 0) {
            indexReplacementMap[++captureIndex] = Number(handlerIndex);
            return "$()";
          }
          if (paramIndex !== void 0) {
            paramReplacementMap[Number(paramIndex)] = ++captureIndex;
            return "";
          }
          return "";
        });
        return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
      }
    };
  }
});

// ../node_modules/hono/dist/router/reg-exp-router/router.js
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
function buildMatcherFromPreprocessedRoutes(routes2) {
  const trie = new Trie();
  const handlerData = [];
  if (routes2.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes2.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
var nullMatcher, wildcardRegExpCache, RegExpRouter;
var init_router2 = __esm({
  "../node_modules/hono/dist/router/reg-exp-router/router.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_router();
    init_url();
    init_matcher();
    init_node();
    init_trie();
    nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
    wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
    __name(buildWildcardRegExp, "buildWildcardRegExp");
    __name(clearWildcardRegExpCache, "clearWildcardRegExpCache");
    __name(buildMatcherFromPreprocessedRoutes, "buildMatcherFromPreprocessedRoutes");
    __name(findMiddleware, "findMiddleware");
    RegExpRouter = class {
      static {
        __name(this, "RegExpRouter");
      }
      name = "RegExpRouter";
      #middleware;
      #routes;
      constructor() {
        this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
        this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
      }
      add(method, path, handler) {
        const middleware = this.#middleware;
        const routes2 = this.#routes;
        if (!middleware || !routes2) {
          throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
        }
        if (!middleware[method]) {
          ;
          [middleware, routes2].forEach((handlerMap) => {
            handlerMap[method] = /* @__PURE__ */ Object.create(null);
            Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
              handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
            });
          });
        }
        if (path === "/*") {
          path = "*";
        }
        const paramCount = (path.match(/\/:/g) || []).length;
        if (/\*$/.test(path)) {
          const re = buildWildcardRegExp(path);
          if (method === METHOD_NAME_ALL) {
            Object.keys(middleware).forEach((m) => {
              middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
            });
          } else {
            middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
          }
          Object.keys(middleware).forEach((m) => {
            if (method === METHOD_NAME_ALL || method === m) {
              Object.keys(middleware[m]).forEach((p) => {
                re.test(p) && middleware[m][p].push([handler, paramCount]);
              });
            }
          });
          Object.keys(routes2).forEach((m) => {
            if (method === METHOD_NAME_ALL || method === m) {
              Object.keys(routes2[m]).forEach(
                (p) => re.test(p) && routes2[m][p].push([handler, paramCount])
              );
            }
          });
          return;
        }
        const paths = checkOptionalParameter(path) || [path];
        for (let i = 0, len = paths.length; i < len; i++) {
          const path2 = paths[i];
          Object.keys(routes2).forEach((m) => {
            if (method === METHOD_NAME_ALL || method === m) {
              routes2[m][path2] ||= [
                ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
              ];
              routes2[m][path2].push([handler, paramCount - len + i + 1]);
            }
          });
        }
      }
      match = match;
      buildAllMatchers() {
        const matchers = /* @__PURE__ */ Object.create(null);
        Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
          matchers[method] ||= this.#buildMatcher(method);
        });
        this.#middleware = this.#routes = void 0;
        clearWildcardRegExpCache();
        return matchers;
      }
      #buildMatcher(method) {
        const routes2 = [];
        let hasOwnRoute = method === METHOD_NAME_ALL;
        [this.#middleware, this.#routes].forEach((r) => {
          const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
          if (ownRoute.length !== 0) {
            hasOwnRoute ||= true;
            routes2.push(...ownRoute);
          } else if (method !== METHOD_NAME_ALL) {
            routes2.push(
              ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
            );
          }
        });
        if (!hasOwnRoute) {
          return null;
        } else {
          return buildMatcherFromPreprocessedRoutes(routes2);
        }
      }
    };
  }
});

// ../node_modules/hono/dist/router/reg-exp-router/prepared-router.js
var init_prepared_router = __esm({
  "../node_modules/hono/dist/router/reg-exp-router/prepared-router.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_router();
    init_matcher();
    init_router2();
  }
});

// ../node_modules/hono/dist/router/reg-exp-router/index.js
var init_reg_exp_router = __esm({
  "../node_modules/hono/dist/router/reg-exp-router/index.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_router2();
    init_prepared_router();
  }
});

// ../node_modules/hono/dist/router/smart-router/router.js
var SmartRouter;
var init_router3 = __esm({
  "../node_modules/hono/dist/router/smart-router/router.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_router();
    SmartRouter = class {
      static {
        __name(this, "SmartRouter");
      }
      name = "SmartRouter";
      #routers = [];
      #routes = [];
      constructor(init) {
        this.#routers = init.routers;
      }
      add(method, path, handler) {
        if (!this.#routes) {
          throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
        }
        this.#routes.push([method, path, handler]);
      }
      match(method, path) {
        if (!this.#routes) {
          throw new Error("Fatal error");
        }
        const routers = this.#routers;
        const routes2 = this.#routes;
        const len = routers.length;
        let i = 0;
        let res;
        for (; i < len; i++) {
          const router = routers[i];
          try {
            for (let i2 = 0, len2 = routes2.length; i2 < len2; i2++) {
              router.add(...routes2[i2]);
            }
            res = router.match(method, path);
          } catch (e) {
            if (e instanceof UnsupportedPathError) {
              continue;
            }
            throw e;
          }
          this.match = router.match.bind(router);
          this.#routers = [router];
          this.#routes = void 0;
          break;
        }
        if (i === len) {
          throw new Error("Fatal error");
        }
        this.name = `SmartRouter + ${this.activeRouter.name}`;
        return res;
      }
      get activeRouter() {
        if (this.#routes || this.#routers.length !== 1) {
          throw new Error("No active router has been determined yet.");
        }
        return this.#routers[0];
      }
    };
  }
});

// ../node_modules/hono/dist/router/smart-router/index.js
var init_smart_router = __esm({
  "../node_modules/hono/dist/router/smart-router/index.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_router3();
  }
});

// ../node_modules/hono/dist/router/trie-router/node.js
var emptyParams, hasChildren, Node2;
var init_node2 = __esm({
  "../node_modules/hono/dist/router/trie-router/node.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_router();
    init_url();
    emptyParams = /* @__PURE__ */ Object.create(null);
    hasChildren = /* @__PURE__ */ __name((children) => {
      for (const _ in children) {
        return true;
      }
      return false;
    }, "hasChildren");
    Node2 = class _Node2 {
      static {
        __name(this, "_Node");
      }
      #methods;
      #children;
      #patterns;
      #order = 0;
      #params = emptyParams;
      constructor(method, handler, children) {
        this.#children = children || /* @__PURE__ */ Object.create(null);
        this.#methods = [];
        if (method && handler) {
          const m = /* @__PURE__ */ Object.create(null);
          m[method] = { handler, possibleKeys: [], score: 0 };
          this.#methods = [m];
        }
        this.#patterns = [];
      }
      insert(method, path, handler) {
        this.#order = ++this.#order;
        let curNode = this;
        const parts = splitRoutingPath(path);
        const possibleKeys = [];
        for (let i = 0, len = parts.length; i < len; i++) {
          const p = parts[i];
          const nextP = parts[i + 1];
          const pattern = getPattern(p, nextP);
          const key = Array.isArray(pattern) ? pattern[0] : p;
          if (key in curNode.#children) {
            curNode = curNode.#children[key];
            if (pattern) {
              possibleKeys.push(pattern[1]);
            }
            continue;
          }
          curNode.#children[key] = new _Node2();
          if (pattern) {
            curNode.#patterns.push(pattern);
            possibleKeys.push(pattern[1]);
          }
          curNode = curNode.#children[key];
        }
        curNode.#methods.push({
          [method]: {
            handler,
            possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
            score: this.#order
          }
        });
        return curNode;
      }
      #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
        for (let i = 0, len = node.#methods.length; i < len; i++) {
          const m = node.#methods[i];
          const handlerSet = m[method] || m[METHOD_NAME_ALL];
          const processedSet = {};
          if (handlerSet !== void 0) {
            handlerSet.params = /* @__PURE__ */ Object.create(null);
            handlerSets.push(handlerSet);
            if (nodeParams !== emptyParams || params && params !== emptyParams) {
              for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
                const key = handlerSet.possibleKeys[i2];
                const processed = processedSet[handlerSet.score];
                handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
                processedSet[handlerSet.score] = true;
              }
            }
          }
        }
      }
      search(method, path) {
        const handlerSets = [];
        this.#params = emptyParams;
        const curNode = this;
        let curNodes = [curNode];
        const parts = splitPath(path);
        const curNodesQueue = [];
        const len = parts.length;
        let partOffsets = null;
        for (let i = 0; i < len; i++) {
          const part = parts[i];
          const isLast = i === len - 1;
          const tempNodes = [];
          for (let j = 0, len2 = curNodes.length; j < len2; j++) {
            const node = curNodes[j];
            const nextNode = node.#children[part];
            if (nextNode) {
              nextNode.#params = node.#params;
              if (isLast) {
                if (nextNode.#children["*"]) {
                  this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
                }
                this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
              } else {
                tempNodes.push(nextNode);
              }
            }
            for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
              const pattern = node.#patterns[k];
              const params = node.#params === emptyParams ? {} : { ...node.#params };
              if (pattern === "*") {
                const astNode = node.#children["*"];
                if (astNode) {
                  this.#pushHandlerSets(handlerSets, astNode, method, node.#params);
                  astNode.#params = params;
                  tempNodes.push(astNode);
                }
                continue;
              }
              const [key, name, matcher] = pattern;
              if (!part && !(matcher instanceof RegExp)) {
                continue;
              }
              const child = node.#children[key];
              if (matcher instanceof RegExp) {
                if (partOffsets === null) {
                  partOffsets = new Array(len);
                  let offset = path[0] === "/" ? 1 : 0;
                  for (let p = 0; p < len; p++) {
                    partOffsets[p] = offset;
                    offset += parts[p].length + 1;
                  }
                }
                const restPathString = path.substring(partOffsets[i]);
                const m = matcher.exec(restPathString);
                if (m) {
                  params[name] = m[0];
                  this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
                  if (hasChildren(child.#children)) {
                    child.#params = params;
                    const componentCount = m[0].match(/\//)?.length ?? 0;
                    const targetCurNodes = curNodesQueue[componentCount] ||= [];
                    targetCurNodes.push(child);
                  }
                  continue;
                }
              }
              if (matcher === true || matcher.test(part)) {
                params[name] = part;
                if (isLast) {
                  this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
                  if (child.#children["*"]) {
                    this.#pushHandlerSets(
                      handlerSets,
                      child.#children["*"],
                      method,
                      params,
                      node.#params
                    );
                  }
                } else {
                  child.#params = params;
                  tempNodes.push(child);
                }
              }
            }
          }
          const shifted = curNodesQueue.shift();
          curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
        }
        if (handlerSets.length > 1) {
          handlerSets.sort((a, b) => {
            return a.score - b.score;
          });
        }
        return [handlerSets.map(({ handler, params }) => [handler, params])];
      }
    };
  }
});

// ../node_modules/hono/dist/router/trie-router/router.js
var TrieRouter;
var init_router4 = __esm({
  "../node_modules/hono/dist/router/trie-router/router.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_url();
    init_node2();
    TrieRouter = class {
      static {
        __name(this, "TrieRouter");
      }
      name = "TrieRouter";
      #node;
      constructor() {
        this.#node = new Node2();
      }
      add(method, path, handler) {
        const results = checkOptionalParameter(path);
        if (results) {
          for (let i = 0, len = results.length; i < len; i++) {
            this.#node.insert(method, results[i], handler);
          }
          return;
        }
        this.#node.insert(method, path, handler);
      }
      match(method, path) {
        return this.#node.search(method, path);
      }
    };
  }
});

// ../node_modules/hono/dist/router/trie-router/index.js
var init_trie_router = __esm({
  "../node_modules/hono/dist/router/trie-router/index.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_router4();
  }
});

// ../node_modules/hono/dist/hono.js
var Hono2;
var init_hono = __esm({
  "../node_modules/hono/dist/hono.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_hono_base();
    init_reg_exp_router();
    init_smart_router();
    init_trie_router();
    Hono2 = class extends Hono {
      static {
        __name(this, "Hono");
      }
      /**
       * Creates an instance of the Hono class.
       *
       * @param options - Optional configuration options for the Hono instance.
       */
      constructor(options = {}) {
        super(options);
        this.router = options.router ?? new SmartRouter({
          routers: [new RegExpRouter(), new TrieRouter()]
        });
      }
    };
  }
});

// ../node_modules/hono/dist/index.js
var init_dist = __esm({
  "../node_modules/hono/dist/index.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_hono();
  }
});

// ../node_modules/hono/dist/adapter/cloudflare-pages/handler.js
var handle;
var init_handler = __esm({
  "../node_modules/hono/dist/adapter/cloudflare-pages/handler.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_context();
    init_http_exception();
    handle = /* @__PURE__ */ __name((app2) => (eventContext) => {
      return app2.fetch(
        eventContext.request,
        { ...eventContext.env, eventContext },
        {
          waitUntil: eventContext.waitUntil,
          passThroughOnException: eventContext.passThroughOnException,
          props: {}
        }
      );
    }, "handle");
  }
});

// ../node_modules/hono/dist/adapter/cloudflare-pages/conninfo.js
var init_conninfo = __esm({
  "../node_modules/hono/dist/adapter/cloudflare-pages/conninfo.js"() {
    init_functionsRoutes_0_6398490784585695();
  }
});

// ../node_modules/hono/dist/adapter/cloudflare-pages/index.js
var init_cloudflare_pages = __esm({
  "../node_modules/hono/dist/adapter/cloudflare-pages/index.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_handler();
    init_conninfo();
  }
});

// ../node_modules/hono/dist/middleware/cors/index.js
var cors;
var init_cors = __esm({
  "../node_modules/hono/dist/middleware/cors/index.js"() {
    init_functionsRoutes_0_6398490784585695();
    cors = /* @__PURE__ */ __name((options) => {
      const defaults = {
        origin: "*",
        allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
        allowHeaders: [],
        exposeHeaders: []
      };
      const opts = {
        ...defaults,
        ...options
      };
      const findAllowOrigin = ((optsOrigin) => {
        if (typeof optsOrigin === "string") {
          if (optsOrigin === "*") {
            if (opts.credentials) {
              return (origin) => origin || null;
            }
            return () => optsOrigin;
          } else {
            return (origin) => optsOrigin === origin ? origin : null;
          }
        } else if (typeof optsOrigin === "function") {
          return optsOrigin;
        } else {
          return (origin) => optsOrigin.includes(origin) ? origin : null;
        }
      })(opts.origin);
      const findAllowMethods = ((optsAllowMethods) => {
        if (typeof optsAllowMethods === "function") {
          return optsAllowMethods;
        } else if (Array.isArray(optsAllowMethods)) {
          return () => optsAllowMethods;
        } else {
          return () => [];
        }
      })(opts.allowMethods);
      return /* @__PURE__ */ __name(async function cors2(c, next) {
        function set(key, value) {
          c.res.headers.set(key, value);
        }
        __name(set, "set");
        const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
        if (allowOrigin) {
          set("Access-Control-Allow-Origin", allowOrigin);
        }
        if (opts.credentials) {
          set("Access-Control-Allow-Credentials", "true");
        }
        if (opts.exposeHeaders?.length) {
          set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
        }
        if (c.req.method === "OPTIONS") {
          if (opts.origin !== "*" || opts.credentials) {
            set("Vary", "Origin");
          }
          if (opts.maxAge != null) {
            set("Access-Control-Max-Age", opts.maxAge.toString());
          }
          const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
          if (allowMethods.length) {
            set("Access-Control-Allow-Methods", allowMethods.join(","));
          }
          let headers = opts.allowHeaders;
          if (!headers?.length) {
            const requestHeaders = c.req.header("Access-Control-Request-Headers");
            if (requestHeaders) {
              headers = requestHeaders.split(/\s*,\s*/);
            }
          }
          if (headers?.length) {
            set("Access-Control-Allow-Headers", headers.join(","));
            c.res.headers.append("Vary", "Access-Control-Request-Headers");
          }
          c.res.headers.delete("Content-Length");
          c.res.headers.delete("Content-Type");
          return new Response(null, {
            headers: c.res.headers,
            status: 204,
            statusText: "No Content"
          });
        }
        await next();
        if (opts.origin !== "*" || opts.credentials) {
          c.header("Vary", "Origin", { append: true });
        }
      }, "cors2");
    }, "cors");
  }
});

// ../node_modules/hono/dist/utils/color.js
function getColorEnabled() {
  const { process, Deno: Deno2 } = globalThis;
  const isNoColor = typeof Deno2?.noColor === "boolean" ? Deno2.noColor : process !== void 0 ? (
    // eslint-disable-next-line no-unsafe-optional-chaining
    "NO_COLOR" in process?.env
  ) : false;
  return !isNoColor;
}
async function getColorEnabledAsync() {
  const { navigator: navigator2 } = globalThis;
  const cfWorkers = "cloudflare:workers";
  const isNoColor = navigator2 !== void 0 && navigator2.userAgent === "Cloudflare-Workers" ? await (async () => {
    try {
      return "NO_COLOR" in ((await import(cfWorkers)).env ?? {});
    } catch {
      return false;
    }
  })() : !getColorEnabled();
  return !isNoColor;
}
var init_color = __esm({
  "../node_modules/hono/dist/utils/color.js"() {
    init_functionsRoutes_0_6398490784585695();
    __name(getColorEnabled, "getColorEnabled");
    __name(getColorEnabledAsync, "getColorEnabledAsync");
  }
});

// ../node_modules/hono/dist/middleware/logger/index.js
async function log(fn, prefix, method, path, status = 0, elapsed) {
  const out = prefix === "<--" ? `${prefix} ${method} ${path}` : `${prefix} ${method} ${path} ${await colorStatus(status)} ${elapsed}`;
  fn(out);
}
var humanize, time, colorStatus, logger;
var init_logger = __esm({
  "../node_modules/hono/dist/middleware/logger/index.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_color();
    humanize = /* @__PURE__ */ __name((times) => {
      const [delimiter, separator] = [",", "."];
      const orderTimes = times.map((v) => v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delimiter));
      return orderTimes.join(separator);
    }, "humanize");
    time = /* @__PURE__ */ __name((start) => {
      const delta = Date.now() - start;
      return humanize([delta < 1e3 ? delta + "ms" : Math.round(delta / 1e3) + "s"]);
    }, "time");
    colorStatus = /* @__PURE__ */ __name(async (status) => {
      const colorEnabled = await getColorEnabledAsync();
      if (colorEnabled) {
        switch (status / 100 | 0) {
          case 5:
            return `\x1B[31m${status}\x1B[0m`;
          case 4:
            return `\x1B[33m${status}\x1B[0m`;
          case 3:
            return `\x1B[36m${status}\x1B[0m`;
          case 2:
            return `\x1B[32m${status}\x1B[0m`;
        }
      }
      return `${status}`;
    }, "colorStatus");
    __name(log, "log");
    logger = /* @__PURE__ */ __name((fn = console.log) => {
      return /* @__PURE__ */ __name(async function logger2(c, next) {
        const { method, url } = c.req;
        const path = url.slice(url.indexOf("/", 8));
        await log(fn, "<--", method, path);
        const start = Date.now();
        await next();
        await log(fn, "-->", method, path, c.res.status, time(start));
      }, "logger2");
    }, "logger");
  }
});

// ../node_modules/@libsql/core/lib-esm/api.js
var LibsqlError, LibsqlBatchError;
var init_api = __esm({
  "../node_modules/@libsql/core/lib-esm/api.js"() {
    init_functionsRoutes_0_6398490784585695();
    LibsqlError = class extends Error {
      static {
        __name(this, "LibsqlError");
      }
      /** Machine-readable error code. */
      code;
      /** Extended error code with more specific information (e.g., SQLITE_CONSTRAINT_PRIMARYKEY). */
      extendedCode;
      /** Raw numeric error code */
      rawCode;
      constructor(message, code, extendedCode, rawCode, cause) {
        if (code !== void 0) {
          message = `${code}: ${message}`;
        }
        super(message, { cause });
        this.code = code;
        this.extendedCode = extendedCode;
        this.rawCode = rawCode;
        this.name = "LibsqlError";
      }
    };
    LibsqlBatchError = class extends LibsqlError {
      static {
        __name(this, "LibsqlBatchError");
      }
      /** The zero-based index of the statement that failed in the batch. */
      statementIndex;
      constructor(message, statementIndex, code, extendedCode, rawCode, cause) {
        super(message, code, extendedCode, rawCode, cause);
        this.statementIndex = statementIndex;
        this.name = "LibsqlBatchError";
      }
    };
  }
});

// ../node_modules/@libsql/core/lib-esm/uri.js
function parseUri(text2) {
  const match3 = URI_RE.exec(text2);
  if (match3 === null) {
    throw new LibsqlError(`The URL '${text2}' is not in a valid format`, "URL_INVALID");
  }
  const groups = match3.groups;
  const scheme = groups["scheme"];
  const authority = groups["authority"] !== void 0 ? parseAuthority(groups["authority"]) : void 0;
  const path = percentDecode(groups["path"]);
  const query = groups["query"] !== void 0 ? parseQuery(groups["query"]) : void 0;
  const fragment = groups["fragment"] !== void 0 ? percentDecode(groups["fragment"]) : void 0;
  return { scheme, authority, path, query, fragment };
}
function parseAuthority(text2) {
  const match3 = AUTHORITY_RE.exec(text2);
  if (match3 === null) {
    throw new LibsqlError("The authority part of the URL is not in a valid format", "URL_INVALID");
  }
  const groups = match3.groups;
  const host = percentDecode(groups["host_br"] ?? groups["host"]);
  const port = groups["port"] ? parseInt(groups["port"], 10) : void 0;
  const userinfo = groups["username"] !== void 0 ? {
    username: percentDecode(groups["username"]),
    password: groups["password"] !== void 0 ? percentDecode(groups["password"]) : void 0
  } : void 0;
  return { host, port, userinfo };
}
function parseQuery(text2) {
  const sequences = text2.split("&");
  const pairs = [];
  for (const sequence of sequences) {
    if (sequence === "") {
      continue;
    }
    let key;
    let value;
    const splitIdx = sequence.indexOf("=");
    if (splitIdx < 0) {
      key = sequence;
      value = "";
    } else {
      key = sequence.substring(0, splitIdx);
      value = sequence.substring(splitIdx + 1);
    }
    pairs.push({
      key: percentDecode(key.replaceAll("+", " ")),
      value: percentDecode(value.replaceAll("+", " "))
    });
  }
  return { pairs };
}
function percentDecode(text2) {
  try {
    return decodeURIComponent(text2);
  } catch (e) {
    if (e instanceof URIError) {
      throw new LibsqlError(`URL component has invalid percent encoding: ${e}`, "URL_INVALID", void 0, void 0, e);
    }
    throw e;
  }
}
function encodeBaseUrl(scheme, authority, path) {
  if (authority === void 0) {
    throw new LibsqlError(`URL with scheme ${JSON.stringify(scheme + ":")} requires authority (the "//" part)`, "URL_INVALID");
  }
  const schemeText = `${scheme}:`;
  const hostText = encodeHost(authority.host);
  const portText = encodePort(authority.port);
  const userinfoText = encodeUserinfo(authority.userinfo);
  const authorityText = `//${userinfoText}${hostText}${portText}`;
  let pathText = path.split("/").map(encodeURIComponent).join("/");
  if (pathText !== "" && !pathText.startsWith("/")) {
    pathText = "/" + pathText;
  }
  return new URL(`${schemeText}${authorityText}${pathText}`);
}
function encodeHost(host) {
  return host.includes(":") ? `[${encodeURI(host)}]` : encodeURI(host);
}
function encodePort(port) {
  return port !== void 0 ? `:${port}` : "";
}
function encodeUserinfo(userinfo) {
  if (userinfo === void 0) {
    return "";
  }
  const usernameText = encodeURIComponent(userinfo.username);
  const passwordText = userinfo.password !== void 0 ? `:${encodeURIComponent(userinfo.password)}` : "";
  return `${usernameText}${passwordText}@`;
}
var URI_RE, AUTHORITY_RE;
var init_uri = __esm({
  "../node_modules/@libsql/core/lib-esm/uri.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_api();
    __name(parseUri, "parseUri");
    URI_RE = (() => {
      const SCHEME = "(?<scheme>[A-Za-z][A-Za-z.+-]*)";
      const AUTHORITY = "(?<authority>[^/?#]*)";
      const PATH = "(?<path>[^?#]*)";
      const QUERY = "(?<query>[^#]*)";
      const FRAGMENT = "(?<fragment>.*)";
      return new RegExp(`^${SCHEME}:(//${AUTHORITY})?${PATH}(\\?${QUERY})?(#${FRAGMENT})?$`, "su");
    })();
    __name(parseAuthority, "parseAuthority");
    AUTHORITY_RE = (() => {
      return new RegExp(`^((?<username>[^:]*)(:(?<password>.*))?@)?((?<host>[^:\\[\\]]*)|(\\[(?<host_br>[^\\[\\]]*)\\]))(:(?<port>[0-9]*))?$`, "su");
    })();
    __name(parseQuery, "parseQuery");
    __name(percentDecode, "percentDecode");
    __name(encodeBaseUrl, "encodeBaseUrl");
    __name(encodeHost, "encodeHost");
    __name(encodePort, "encodePort");
    __name(encodeUserinfo, "encodeUserinfo");
  }
});

// ../node_modules/js-base64/base64.mjs
var version, VERSION, _hasBuffer, _TD, _TE, b64ch, b64chs, b64tab, b64re, _fromCC, _U8Afrom, _mkUriSafe, _tidyB64, btoaPolyfill, _btoa, _fromUint8Array, fromUint8Array, cb_utob, re_utob, utob, _encode, encode, encodeURI2, re_btou, cb_btou, btou, atobPolyfill, _atob, _toUint8Array, toUint8Array, _decode, _unURI, decode, isValid, _noEnum, extendString, extendUint8Array, extendBuiltins, gBase64;
var init_base64 = __esm({
  "../node_modules/js-base64/base64.mjs"() {
    init_functionsRoutes_0_6398490784585695();
    version = "3.7.8";
    VERSION = version;
    _hasBuffer = typeof Buffer === "function";
    _TD = typeof TextDecoder === "function" ? new TextDecoder() : void 0;
    _TE = typeof TextEncoder === "function" ? new TextEncoder() : void 0;
    b64ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    b64chs = Array.prototype.slice.call(b64ch);
    b64tab = ((a) => {
      let tab = {};
      a.forEach((c, i) => tab[c] = i);
      return tab;
    })(b64chs);
    b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
    _fromCC = String.fromCharCode.bind(String);
    _U8Afrom = typeof Uint8Array.from === "function" ? Uint8Array.from.bind(Uint8Array) : (it) => new Uint8Array(Array.prototype.slice.call(it, 0));
    _mkUriSafe = /* @__PURE__ */ __name((src) => src.replace(/=/g, "").replace(/[+\/]/g, (m0) => m0 == "+" ? "-" : "_"), "_mkUriSafe");
    _tidyB64 = /* @__PURE__ */ __name((s) => s.replace(/[^A-Za-z0-9\+\/]/g, ""), "_tidyB64");
    btoaPolyfill = /* @__PURE__ */ __name((bin) => {
      let u32, c0, c1, c2, asc2 = "";
      const pad = bin.length % 3;
      for (let i = 0; i < bin.length; ) {
        if ((c0 = bin.charCodeAt(i++)) > 255 || (c1 = bin.charCodeAt(i++)) > 255 || (c2 = bin.charCodeAt(i++)) > 255)
          throw new TypeError("invalid character found");
        u32 = c0 << 16 | c1 << 8 | c2;
        asc2 += b64chs[u32 >> 18 & 63] + b64chs[u32 >> 12 & 63] + b64chs[u32 >> 6 & 63] + b64chs[u32 & 63];
      }
      return pad ? asc2.slice(0, pad - 3) + "===".substring(pad) : asc2;
    }, "btoaPolyfill");
    _btoa = typeof btoa === "function" ? (bin) => btoa(bin) : _hasBuffer ? (bin) => Buffer.from(bin, "binary").toString("base64") : btoaPolyfill;
    _fromUint8Array = _hasBuffer ? (u8a) => Buffer.from(u8a).toString("base64") : (u8a) => {
      const maxargs = 4096;
      let strs = [];
      for (let i = 0, l = u8a.length; i < l; i += maxargs) {
        strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
      }
      return _btoa(strs.join(""));
    };
    fromUint8Array = /* @__PURE__ */ __name((u8a, urlsafe = false) => urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a), "fromUint8Array");
    cb_utob = /* @__PURE__ */ __name((c) => {
      if (c.length < 2) {
        var cc = c.charCodeAt(0);
        return cc < 128 ? c : cc < 2048 ? _fromCC(192 | cc >>> 6) + _fromCC(128 | cc & 63) : _fromCC(224 | cc >>> 12 & 15) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
      } else {
        var cc = 65536 + (c.charCodeAt(0) - 55296) * 1024 + (c.charCodeAt(1) - 56320);
        return _fromCC(240 | cc >>> 18 & 7) + _fromCC(128 | cc >>> 12 & 63) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
      }
    }, "cb_utob");
    re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    utob = /* @__PURE__ */ __name((u) => u.replace(re_utob, cb_utob), "utob");
    _encode = _hasBuffer ? (s) => Buffer.from(s, "utf8").toString("base64") : _TE ? (s) => _fromUint8Array(_TE.encode(s)) : (s) => _btoa(utob(s));
    encode = /* @__PURE__ */ __name((src, urlsafe = false) => urlsafe ? _mkUriSafe(_encode(src)) : _encode(src), "encode");
    encodeURI2 = /* @__PURE__ */ __name((src) => encode(src, true), "encodeURI");
    re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
    cb_btou = /* @__PURE__ */ __name((cccc) => {
      switch (cccc.length) {
        case 4:
          var cp = (7 & cccc.charCodeAt(0)) << 18 | (63 & cccc.charCodeAt(1)) << 12 | (63 & cccc.charCodeAt(2)) << 6 | 63 & cccc.charCodeAt(3), offset = cp - 65536;
          return _fromCC((offset >>> 10) + 55296) + _fromCC((offset & 1023) + 56320);
        case 3:
          return _fromCC((15 & cccc.charCodeAt(0)) << 12 | (63 & cccc.charCodeAt(1)) << 6 | 63 & cccc.charCodeAt(2));
        default:
          return _fromCC((31 & cccc.charCodeAt(0)) << 6 | 63 & cccc.charCodeAt(1));
      }
    }, "cb_btou");
    btou = /* @__PURE__ */ __name((b) => b.replace(re_btou, cb_btou), "btou");
    atobPolyfill = /* @__PURE__ */ __name((asc2) => {
      asc2 = asc2.replace(/\s+/g, "");
      if (!b64re.test(asc2))
        throw new TypeError("malformed base64.");
      asc2 += "==".slice(2 - (asc2.length & 3));
      let u24, r1, r2;
      let binArray = [];
      for (let i = 0; i < asc2.length; ) {
        u24 = b64tab[asc2.charAt(i++)] << 18 | b64tab[asc2.charAt(i++)] << 12 | (r1 = b64tab[asc2.charAt(i++)]) << 6 | (r2 = b64tab[asc2.charAt(i++)]);
        if (r1 === 64) {
          binArray.push(_fromCC(u24 >> 16 & 255));
        } else if (r2 === 64) {
          binArray.push(_fromCC(u24 >> 16 & 255, u24 >> 8 & 255));
        } else {
          binArray.push(_fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255));
        }
      }
      return binArray.join("");
    }, "atobPolyfill");
    _atob = typeof atob === "function" ? (asc2) => atob(_tidyB64(asc2)) : _hasBuffer ? (asc2) => Buffer.from(asc2, "base64").toString("binary") : atobPolyfill;
    _toUint8Array = _hasBuffer ? (a) => _U8Afrom(Buffer.from(a, "base64")) : (a) => _U8Afrom(_atob(a).split("").map((c) => c.charCodeAt(0)));
    toUint8Array = /* @__PURE__ */ __name((a) => _toUint8Array(_unURI(a)), "toUint8Array");
    _decode = _hasBuffer ? (a) => Buffer.from(a, "base64").toString("utf8") : _TD ? (a) => _TD.decode(_toUint8Array(a)) : (a) => btou(_atob(a));
    _unURI = /* @__PURE__ */ __name((a) => _tidyB64(a.replace(/[-_]/g, (m0) => m0 == "-" ? "+" : "/")), "_unURI");
    decode = /* @__PURE__ */ __name((src) => _decode(_unURI(src)), "decode");
    isValid = /* @__PURE__ */ __name((src) => {
      if (typeof src !== "string")
        return false;
      const s = src.replace(/\s+/g, "").replace(/={0,2}$/, "");
      return !/[^\s0-9a-zA-Z\+/]/.test(s) || !/[^\s0-9a-zA-Z\-_]/.test(s);
    }, "isValid");
    _noEnum = /* @__PURE__ */ __name((v) => {
      return {
        value: v,
        enumerable: false,
        writable: true,
        configurable: true
      };
    }, "_noEnum");
    extendString = /* @__PURE__ */ __name(function() {
      const _add = /* @__PURE__ */ __name((name, body) => Object.defineProperty(String.prototype, name, _noEnum(body)), "_add");
      _add("fromBase64", function() {
        return decode(this);
      });
      _add("toBase64", function(urlsafe) {
        return encode(this, urlsafe);
      });
      _add("toBase64URI", function() {
        return encode(this, true);
      });
      _add("toBase64URL", function() {
        return encode(this, true);
      });
      _add("toUint8Array", function() {
        return toUint8Array(this);
      });
    }, "extendString");
    extendUint8Array = /* @__PURE__ */ __name(function() {
      const _add = /* @__PURE__ */ __name((name, body) => Object.defineProperty(Uint8Array.prototype, name, _noEnum(body)), "_add");
      _add("toBase64", function(urlsafe) {
        return fromUint8Array(this, urlsafe);
      });
      _add("toBase64URI", function() {
        return fromUint8Array(this, true);
      });
      _add("toBase64URL", function() {
        return fromUint8Array(this, true);
      });
    }, "extendUint8Array");
    extendBuiltins = /* @__PURE__ */ __name(() => {
      extendString();
      extendUint8Array();
    }, "extendBuiltins");
    gBase64 = {
      version,
      VERSION,
      atob: _atob,
      atobPolyfill,
      btoa: _btoa,
      btoaPolyfill,
      fromBase64: decode,
      toBase64: encode,
      encode,
      encodeURI: encodeURI2,
      encodeURL: encodeURI2,
      utob,
      btou,
      decode,
      isValid,
      fromUint8Array,
      toUint8Array,
      extendString,
      extendUint8Array,
      extendBuiltins
    };
  }
});

// ../node_modules/@libsql/core/lib-esm/util.js
function transactionModeToBegin(mode) {
  if (mode === "write") {
    return "BEGIN IMMEDIATE";
  } else if (mode === "read") {
    return "BEGIN TRANSACTION READONLY";
  } else if (mode === "deferred") {
    return "BEGIN DEFERRED";
  } else {
    throw RangeError('Unknown transaction mode, supported values are "write", "read" and "deferred"');
  }
}
function rowToJson(row) {
  return Array.prototype.map.call(row, valueToJson);
}
function valueToJson(value) {
  if (typeof value === "bigint") {
    return "" + value;
  } else if (value instanceof ArrayBuffer) {
    return gBase64.fromUint8Array(new Uint8Array(value));
  } else {
    return value;
  }
}
var supportedUrlLink, ResultSetImpl;
var init_util = __esm({
  "../node_modules/@libsql/core/lib-esm/util.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_base64();
    supportedUrlLink = "https://github.com/libsql/libsql-client-ts#supported-urls";
    __name(transactionModeToBegin, "transactionModeToBegin");
    ResultSetImpl = class {
      static {
        __name(this, "ResultSetImpl");
      }
      columns;
      columnTypes;
      rows;
      rowsAffected;
      lastInsertRowid;
      constructor(columns, columnTypes, rows, rowsAffected, lastInsertRowid) {
        this.columns = columns;
        this.columnTypes = columnTypes;
        this.rows = rows;
        this.rowsAffected = rowsAffected;
        this.lastInsertRowid = lastInsertRowid;
      }
      toJSON() {
        return {
          columns: this.columns,
          columnTypes: this.columnTypes,
          rows: this.rows.map(rowToJson),
          rowsAffected: this.rowsAffected,
          lastInsertRowid: this.lastInsertRowid !== void 0 ? "" + this.lastInsertRowid : null
        };
      }
    };
    __name(rowToJson, "rowToJson");
    __name(valueToJson, "valueToJson");
  }
});

// ../node_modules/@libsql/core/lib-esm/config.js
function expandConfig(config, preferHttp) {
  if (typeof config !== "object") {
    throw new TypeError(`Expected client configuration as object, got ${typeof config}`);
  }
  let { url, authToken, tls, intMode, concurrency } = config;
  concurrency = Math.max(0, concurrency || 20);
  intMode ??= "number";
  let connectionQueryParams = [];
  if (url === inMemoryMode) {
    url = "file::memory:";
  }
  const uri = parseUri(url);
  const originalUriScheme = uri.scheme.toLowerCase();
  const isInMemoryMode = originalUriScheme === "file" && uri.path === inMemoryMode && uri.authority === void 0;
  let queryParamsDef;
  if (isInMemoryMode) {
    queryParamsDef = {
      cache: {
        values: ["shared", "private"],
        update: /* @__PURE__ */ __name((key, value) => connectionQueryParams.push(`${key}=${value}`), "update")
      }
    };
  } else {
    queryParamsDef = {
      tls: {
        values: ["0", "1"],
        update: /* @__PURE__ */ __name((_, value) => tls = value === "1", "update")
      },
      authToken: {
        update: /* @__PURE__ */ __name((_, value) => authToken = value, "update")
      }
    };
  }
  for (const { key, value } of uri.query?.pairs ?? []) {
    if (!Object.hasOwn(queryParamsDef, key)) {
      throw new LibsqlError(`Unsupported URL query parameter ${JSON.stringify(key)}`, "URL_PARAM_NOT_SUPPORTED");
    }
    const queryParamDef = queryParamsDef[key];
    if (queryParamDef.values !== void 0 && !queryParamDef.values.includes(value)) {
      throw new LibsqlError(`Unknown value for the "${key}" query argument: ${JSON.stringify(value)}. Supported values are: [${queryParamDef.values.map((x) => '"' + x + '"').join(", ")}]`, "URL_INVALID");
    }
    if (queryParamDef.update !== void 0) {
      queryParamDef?.update(key, value);
    }
  }
  const connectionQueryParamsString = connectionQueryParams.length === 0 ? "" : `?${connectionQueryParams.join("&")}`;
  const path = uri.path + connectionQueryParamsString;
  let scheme;
  if (originalUriScheme === "libsql") {
    if (tls === false) {
      if (uri.authority?.port === void 0) {
        throw new LibsqlError('A "libsql:" URL with ?tls=0 must specify an explicit port', "URL_INVALID");
      }
      scheme = preferHttp ? "http" : "ws";
    } else {
      scheme = preferHttp ? "https" : "wss";
    }
  } else {
    scheme = originalUriScheme;
  }
  if (scheme === "http" || scheme === "ws") {
    tls ??= false;
  } else {
    tls ??= true;
  }
  if (scheme !== "http" && scheme !== "ws" && scheme !== "https" && scheme !== "wss" && scheme !== "file") {
    throw new LibsqlError(`The client supports only "libsql:", "wss:", "ws:", "https:", "http:" and "file:" URLs, got ${JSON.stringify(uri.scheme + ":")}. For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
  }
  if (intMode !== "number" && intMode !== "bigint" && intMode !== "string") {
    throw new TypeError(`Invalid value for intMode, expected "number", "bigint" or "string", got ${JSON.stringify(intMode)}`);
  }
  if (uri.fragment !== void 0) {
    throw new LibsqlError(`URL fragments are not supported: ${JSON.stringify("#" + uri.fragment)}`, "URL_INVALID");
  }
  if (isInMemoryMode) {
    return {
      scheme: "file",
      tls: false,
      path,
      intMode,
      concurrency,
      syncUrl: config.syncUrl,
      syncInterval: config.syncInterval,
      readYourWrites: config.readYourWrites,
      offline: config.offline,
      fetch: config.fetch,
      authToken: void 0,
      encryptionKey: void 0,
      remoteEncryptionKey: void 0,
      authority: void 0
    };
  }
  return {
    scheme,
    tls,
    authority: uri.authority,
    path,
    authToken,
    intMode,
    concurrency,
    encryptionKey: config.encryptionKey,
    remoteEncryptionKey: config.remoteEncryptionKey,
    syncUrl: config.syncUrl,
    syncInterval: config.syncInterval,
    readYourWrites: config.readYourWrites,
    offline: config.offline,
    fetch: config.fetch
  };
}
var inMemoryMode;
var init_config = __esm({
  "../node_modules/@libsql/core/lib-esm/config.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_api();
    init_uri();
    init_util();
    inMemoryMode = ":memory:";
    __name(expandConfig, "expandConfig");
  }
});

// ../node_modules/@libsql/isomorphic-ws/web.mjs
var _WebSocket;
var init_web = __esm({
  "../node_modules/@libsql/isomorphic-ws/web.mjs"() {
    init_functionsRoutes_0_6398490784585695();
    if (typeof WebSocket !== "undefined") {
      _WebSocket = WebSocket;
    } else if (typeof global !== "undefined") {
      _WebSocket = global.WebSocket;
    } else if (typeof window !== "undefined") {
      _WebSocket = window.WebSocket;
    } else if (typeof self !== "undefined") {
      _WebSocket = self.WebSocket;
    }
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/client.js
var Client;
var init_client = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/client.js"() {
    init_functionsRoutes_0_6398490784585695();
    Client = class {
      static {
        __name(this, "Client");
      }
      /** @private */
      constructor() {
        this.intMode = "number";
      }
      /** Representation of integers returned from the database. See {@link IntMode}.
       *
       * This value is inherited by {@link Stream} objects created with {@link openStream}, but you can
       * override the integer mode for every stream by setting {@link Stream.intMode} on the stream.
       */
      intMode;
    };
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/errors.js
var ClientError, ProtoError, ResponseError, ClosedError, WebSocketUnsupportedError, WebSocketError, HttpServerError, ProtocolVersionError, InternalError, MisuseError;
var init_errors = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/errors.js"() {
    init_functionsRoutes_0_6398490784585695();
    ClientError = class extends Error {
      static {
        __name(this, "ClientError");
      }
      /** @private */
      constructor(message) {
        super(message);
        this.name = "ClientError";
      }
    };
    ProtoError = class extends ClientError {
      static {
        __name(this, "ProtoError");
      }
      /** @private */
      constructor(message) {
        super(message);
        this.name = "ProtoError";
      }
    };
    ResponseError = class extends ClientError {
      static {
        __name(this, "ResponseError");
      }
      code;
      /** @internal */
      proto;
      /** @private */
      constructor(message, protoError) {
        super(message);
        this.name = "ResponseError";
        this.code = protoError.code;
        this.proto = protoError;
        this.stack = void 0;
      }
    };
    ClosedError = class extends ClientError {
      static {
        __name(this, "ClosedError");
      }
      /** @private */
      constructor(message, cause) {
        if (cause !== void 0) {
          super(`${message}: ${cause}`);
          this.cause = cause;
        } else {
          super(message);
        }
        this.name = "ClosedError";
      }
    };
    WebSocketUnsupportedError = class extends ClientError {
      static {
        __name(this, "WebSocketUnsupportedError");
      }
      /** @private */
      constructor(message) {
        super(message);
        this.name = "WebSocketUnsupportedError";
      }
    };
    WebSocketError = class extends ClientError {
      static {
        __name(this, "WebSocketError");
      }
      /** @private */
      constructor(message) {
        super(message);
        this.name = "WebSocketError";
      }
    };
    HttpServerError = class extends ClientError {
      static {
        __name(this, "HttpServerError");
      }
      status;
      /** @private */
      constructor(message, status) {
        super(message);
        this.status = status;
        this.name = "HttpServerError";
      }
    };
    ProtocolVersionError = class extends ClientError {
      static {
        __name(this, "ProtocolVersionError");
      }
      /** @private */
      constructor(message) {
        super(message);
        this.name = "ProtocolVersionError";
      }
    };
    InternalError = class extends ClientError {
      static {
        __name(this, "InternalError");
      }
      /** @private */
      constructor(message) {
        super(message);
        this.name = "InternalError";
      }
    };
    MisuseError = class extends ClientError {
      static {
        __name(this, "MisuseError");
      }
      /** @private */
      constructor(message) {
        super(message);
        this.name = "MisuseError";
      }
    };
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/encoding/json/decode.js
function string(value) {
  if (typeof value === "string") {
    return value;
  }
  throw typeError(value, "string");
}
function stringOpt(value) {
  if (value === null || value === void 0) {
    return void 0;
  } else if (typeof value === "string") {
    return value;
  }
  throw typeError(value, "string or null");
}
function number(value) {
  if (typeof value === "number") {
    return value;
  }
  throw typeError(value, "number");
}
function boolean(value) {
  if (typeof value === "boolean") {
    return value;
  }
  throw typeError(value, "boolean");
}
function array(value) {
  if (Array.isArray(value)) {
    return value;
  }
  throw typeError(value, "array");
}
function object(value) {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    return value;
  }
  throw typeError(value, "object");
}
function arrayObjectsMap(value, fun) {
  return array(value).map((elemValue) => fun(object(elemValue)));
}
function typeError(value, expected) {
  if (value === void 0) {
    return new ProtoError(`Expected ${expected}, but the property was missing`);
  }
  let received = typeof value;
  if (value === null) {
    received = "null";
  } else if (Array.isArray(value)) {
    received = "array";
  }
  return new ProtoError(`Expected ${expected}, received ${received}`);
}
function readJsonObject(value, fun) {
  return fun(object(value));
}
var init_decode = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/encoding/json/decode.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_errors();
    __name(string, "string");
    __name(stringOpt, "stringOpt");
    __name(number, "number");
    __name(boolean, "boolean");
    __name(array, "array");
    __name(object, "object");
    __name(arrayObjectsMap, "arrayObjectsMap");
    __name(typeError, "typeError");
    __name(readJsonObject, "readJsonObject");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/encoding/json/encode.js
function writeJsonObject(value, fun) {
  const output = [];
  const writer = new ObjectWriter(output);
  writer.begin();
  fun(writer, value);
  writer.end();
  return output.join("");
}
var ObjectWriter;
var init_encode = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/encoding/json/encode.js"() {
    init_functionsRoutes_0_6398490784585695();
    ObjectWriter = class {
      static {
        __name(this, "ObjectWriter");
      }
      #output;
      #isFirst;
      constructor(output) {
        this.#output = output;
        this.#isFirst = false;
      }
      begin() {
        this.#output.push("{");
        this.#isFirst = true;
      }
      end() {
        this.#output.push("}");
        this.#isFirst = false;
      }
      #key(name) {
        if (this.#isFirst) {
          this.#output.push('"');
          this.#isFirst = false;
        } else {
          this.#output.push(',"');
        }
        this.#output.push(name);
        this.#output.push('":');
      }
      string(name, value) {
        this.#key(name);
        this.#output.push(JSON.stringify(value));
      }
      stringRaw(name, value) {
        this.#key(name);
        this.#output.push('"');
        this.#output.push(value);
        this.#output.push('"');
      }
      number(name, value) {
        this.#key(name);
        this.#output.push("" + value);
      }
      boolean(name, value) {
        this.#key(name);
        this.#output.push(value ? "true" : "false");
      }
      object(name, value, valueFun) {
        this.#key(name);
        this.begin();
        valueFun(this, value);
        this.end();
      }
      arrayObjects(name, values, valueFun) {
        this.#key(name);
        this.#output.push("[");
        for (let i = 0; i < values.length; ++i) {
          if (i !== 0) {
            this.#output.push(",");
          }
          this.begin();
          valueFun(this, values[i]);
          this.end();
        }
        this.#output.push("]");
      }
    };
    __name(writeJsonObject, "writeJsonObject");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/encoding/protobuf/util.js
var VARINT, FIXED_64, LENGTH_DELIMITED, FIXED_32;
var init_util2 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/encoding/protobuf/util.js"() {
    init_functionsRoutes_0_6398490784585695();
    VARINT = 0;
    FIXED_64 = 1;
    LENGTH_DELIMITED = 2;
    FIXED_32 = 5;
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/encoding/protobuf/decode.js
function readProtobufMessage(data, def) {
  const msgReader = new MessageReader(data);
  const fieldReader = new FieldReader(msgReader);
  let value = def.default();
  while (!msgReader.eof()) {
    const key = msgReader.varint();
    const tag = key >> 3;
    const wireType = key & 7;
    fieldReader.setup(wireType);
    const tagFun = def[tag];
    if (tagFun !== void 0) {
      const returnedValue = tagFun(fieldReader, value);
      if (returnedValue !== void 0) {
        value = returnedValue;
      }
    }
    fieldReader.maybeSkip();
  }
  return value;
}
var MessageReader, FieldReader;
var init_decode2 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/encoding/protobuf/decode.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_errors();
    init_util2();
    MessageReader = class {
      static {
        __name(this, "MessageReader");
      }
      #array;
      #view;
      #pos;
      constructor(array2) {
        this.#array = array2;
        this.#view = new DataView(array2.buffer, array2.byteOffset, array2.byteLength);
        this.#pos = 0;
      }
      varint() {
        let value = 0;
        for (let shift = 0; ; shift += 7) {
          const byte = this.#array[this.#pos++];
          value |= (byte & 127) << shift;
          if (!(byte & 128)) {
            break;
          }
        }
        return value;
      }
      varintBig() {
        let value = 0n;
        for (let shift = 0n; ; shift += 7n) {
          const byte = this.#array[this.#pos++];
          value |= BigInt(byte & 127) << shift;
          if (!(byte & 128)) {
            break;
          }
        }
        return value;
      }
      bytes(length) {
        const array2 = new Uint8Array(this.#array.buffer, this.#array.byteOffset + this.#pos, length);
        this.#pos += length;
        return array2;
      }
      double() {
        const value = this.#view.getFloat64(this.#pos, true);
        this.#pos += 8;
        return value;
      }
      skipVarint() {
        for (; ; ) {
          const byte = this.#array[this.#pos++];
          if (!(byte & 128)) {
            break;
          }
        }
      }
      skip(count2) {
        this.#pos += count2;
      }
      eof() {
        return this.#pos >= this.#array.byteLength;
      }
    };
    FieldReader = class {
      static {
        __name(this, "FieldReader");
      }
      #reader;
      #wireType;
      constructor(reader) {
        this.#reader = reader;
        this.#wireType = -1;
      }
      setup(wireType) {
        this.#wireType = wireType;
      }
      #expect(expectedWireType) {
        if (this.#wireType !== expectedWireType) {
          throw new ProtoError(`Expected wire type ${expectedWireType}, got ${this.#wireType}`);
        }
        this.#wireType = -1;
      }
      bytes() {
        this.#expect(LENGTH_DELIMITED);
        const length = this.#reader.varint();
        return this.#reader.bytes(length);
      }
      string() {
        return new TextDecoder().decode(this.bytes());
      }
      message(def) {
        return readProtobufMessage(this.bytes(), def);
      }
      int32() {
        this.#expect(VARINT);
        return this.#reader.varint();
      }
      uint32() {
        return this.int32();
      }
      bool() {
        return this.int32() !== 0;
      }
      uint64() {
        this.#expect(VARINT);
        return this.#reader.varintBig();
      }
      sint64() {
        const value = this.uint64();
        return value >> 1n ^ -(value & 1n);
      }
      double() {
        this.#expect(FIXED_64);
        return this.#reader.double();
      }
      maybeSkip() {
        if (this.#wireType < 0) {
          return;
        } else if (this.#wireType === VARINT) {
          this.#reader.skipVarint();
        } else if (this.#wireType === FIXED_64) {
          this.#reader.skip(8);
        } else if (this.#wireType === LENGTH_DELIMITED) {
          const length = this.#reader.varint();
          this.#reader.skip(length);
        } else if (this.#wireType === FIXED_32) {
          this.#reader.skip(4);
        } else {
          throw new ProtoError(`Unexpected wire type ${this.#wireType}`);
        }
        this.#wireType = -1;
      }
    };
    __name(readProtobufMessage, "readProtobufMessage");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/encoding/protobuf/encode.js
function writeProtobufMessage(value, fun) {
  const w = new MessageWriter();
  fun(w, value);
  return w.data();
}
var MessageWriter;
var init_encode2 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/encoding/protobuf/encode.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_util2();
    MessageWriter = class _MessageWriter {
      static {
        __name(this, "MessageWriter");
      }
      #buf;
      #array;
      #view;
      #pos;
      constructor() {
        this.#buf = new ArrayBuffer(256);
        this.#array = new Uint8Array(this.#buf);
        this.#view = new DataView(this.#buf);
        this.#pos = 0;
      }
      #ensure(extra) {
        if (this.#pos + extra <= this.#buf.byteLength) {
          return;
        }
        let newCap = this.#buf.byteLength;
        while (newCap < this.#pos + extra) {
          newCap *= 2;
        }
        const newBuf = new ArrayBuffer(newCap);
        const newArray = new Uint8Array(newBuf);
        const newView = new DataView(newBuf);
        newArray.set(new Uint8Array(this.#buf, 0, this.#pos));
        this.#buf = newBuf;
        this.#array = newArray;
        this.#view = newView;
      }
      #varint(value) {
        this.#ensure(5);
        value = 0 | value;
        do {
          let byte = value & 127;
          value >>>= 7;
          byte |= value ? 128 : 0;
          this.#array[this.#pos++] = byte;
        } while (value);
      }
      #varintBig(value) {
        this.#ensure(10);
        value = value & 0xffffffffffffffffn;
        do {
          let byte = Number(value & 0x7fn);
          value >>= 7n;
          byte |= value ? 128 : 0;
          this.#array[this.#pos++] = byte;
        } while (value);
      }
      #tag(tag, wireType) {
        this.#varint(tag << 3 | wireType);
      }
      bytes(tag, value) {
        this.#tag(tag, LENGTH_DELIMITED);
        this.#varint(value.byteLength);
        this.#ensure(value.byteLength);
        this.#array.set(value, this.#pos);
        this.#pos += value.byteLength;
      }
      string(tag, value) {
        this.bytes(tag, new TextEncoder().encode(value));
      }
      message(tag, value, fun) {
        const writer = new _MessageWriter();
        fun(writer, value);
        this.bytes(tag, writer.data());
      }
      int32(tag, value) {
        this.#tag(tag, VARINT);
        this.#varint(value);
      }
      uint32(tag, value) {
        this.int32(tag, value);
      }
      bool(tag, value) {
        this.int32(tag, value ? 1 : 0);
      }
      sint64(tag, value) {
        this.#tag(tag, VARINT);
        this.#varintBig(value << 1n ^ value >> 63n);
      }
      double(tag, value) {
        this.#tag(tag, FIXED_64);
        this.#ensure(8);
        this.#view.setFloat64(this.#pos, value, true);
        this.#pos += 8;
      }
      data() {
        return new Uint8Array(this.#buf, 0, this.#pos);
      }
    };
    __name(writeProtobufMessage, "writeProtobufMessage");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/encoding/index.js
var init_encoding = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/encoding/index.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_decode();
    init_encode();
    init_decode2();
    init_encode2();
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/id_alloc.js
var IdAlloc;
var init_id_alloc = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/id_alloc.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_errors();
    IdAlloc = class {
      static {
        __name(this, "IdAlloc");
      }
      // Set of all allocated ids
      #usedIds;
      // Set of all free ids lower than `#usedIds.size`
      #freeIds;
      constructor() {
        this.#usedIds = /* @__PURE__ */ new Set();
        this.#freeIds = /* @__PURE__ */ new Set();
      }
      // Returns an id that was free, and marks it as used.
      alloc() {
        for (const freeId2 of this.#freeIds) {
          this.#freeIds.delete(freeId2);
          this.#usedIds.add(freeId2);
          if (!this.#usedIds.has(this.#usedIds.size - 1)) {
            this.#freeIds.add(this.#usedIds.size - 1);
          }
          return freeId2;
        }
        const freeId = this.#usedIds.size;
        this.#usedIds.add(freeId);
        return freeId;
      }
      free(id) {
        if (!this.#usedIds.delete(id)) {
          throw new InternalError("Freeing an id that is not allocated");
        }
        this.#freeIds.delete(this.#usedIds.size);
        if (id < this.#usedIds.size) {
          this.#freeIds.add(id);
        }
      }
    };
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/util.js
function impossible(value, message) {
  throw new InternalError(message);
}
var init_util3 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/util.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_errors();
    __name(impossible, "impossible");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/value.js
function valueToProto(value) {
  if (value === null) {
    return null;
  } else if (typeof value === "string") {
    return value;
  } else if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new RangeError("Only finite numbers (not Infinity or NaN) can be passed as arguments");
    }
    return value;
  } else if (typeof value === "bigint") {
    if (value < minInteger || value > maxInteger) {
      throw new RangeError("This bigint value is too large to be represented as a 64-bit integer and passed as argument");
    }
    return value;
  } else if (typeof value === "boolean") {
    return value ? 1n : 0n;
  } else if (value instanceof ArrayBuffer) {
    return new Uint8Array(value);
  } else if (value instanceof Uint8Array) {
    return value;
  } else if (value instanceof Date) {
    return +value.valueOf();
  } else if (typeof value === "object") {
    return "" + value.toString();
  } else {
    throw new TypeError("Unsupported type of value");
  }
}
function valueFromProto(value, intMode) {
  if (value === null) {
    return null;
  } else if (typeof value === "number") {
    return value;
  } else if (typeof value === "string") {
    return value;
  } else if (typeof value === "bigint") {
    if (intMode === "number") {
      const num = Number(value);
      if (!Number.isSafeInteger(num)) {
        throw new RangeError("Received integer which is too large to be safely represented as a JavaScript number");
      }
      return num;
    } else if (intMode === "bigint") {
      return value;
    } else if (intMode === "string") {
      return "" + value;
    } else {
      throw new MisuseError("Invalid value for IntMode");
    }
  } else if (value instanceof Uint8Array) {
    return value.slice().buffer;
  } else if (value === void 0) {
    throw new ProtoError("Received unrecognized type of Value");
  } else {
    throw impossible(value, "Impossible type of Value");
  }
}
var minInteger, maxInteger;
var init_value = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/value.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_errors();
    init_util3();
    __name(valueToProto, "valueToProto");
    minInteger = -9223372036854775808n;
    maxInteger = 9223372036854775807n;
    __name(valueFromProto, "valueFromProto");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/result.js
function stmtResultFromProto(result) {
  return {
    affectedRowCount: result.affectedRowCount,
    lastInsertRowid: result.lastInsertRowid,
    columnNames: result.cols.map((col) => col.name),
    columnDecltypes: result.cols.map((col) => col.decltype)
  };
}
function rowsResultFromProto(result, intMode) {
  const stmtResult = stmtResultFromProto(result);
  const rows = result.rows.map((row) => rowFromProto(stmtResult.columnNames, row, intMode));
  return { ...stmtResult, rows };
}
function rowResultFromProto(result, intMode) {
  const stmtResult = stmtResultFromProto(result);
  let row;
  if (result.rows.length > 0) {
    row = rowFromProto(stmtResult.columnNames, result.rows[0], intMode);
  }
  return { ...stmtResult, row };
}
function valueResultFromProto(result, intMode) {
  const stmtResult = stmtResultFromProto(result);
  let value;
  if (result.rows.length > 0 && stmtResult.columnNames.length > 0) {
    value = valueFromProto(result.rows[0][0], intMode);
  }
  return { ...stmtResult, value };
}
function rowFromProto(colNames, values, intMode) {
  const row = {};
  Object.defineProperty(row, "length", { value: values.length });
  for (let i = 0; i < values.length; ++i) {
    const value = valueFromProto(values[i], intMode);
    Object.defineProperty(row, i, { value });
    const colName = colNames[i];
    if (colName !== void 0 && !Object.hasOwn(row, colName)) {
      Object.defineProperty(row, colName, { value, enumerable: true, configurable: true, writable: true });
    }
  }
  return row;
}
function errorFromProto(error) {
  return new ResponseError(error.message, error);
}
var init_result = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/result.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_errors();
    init_value();
    __name(stmtResultFromProto, "stmtResultFromProto");
    __name(rowsResultFromProto, "rowsResultFromProto");
    __name(rowResultFromProto, "rowResultFromProto");
    __name(valueResultFromProto, "valueResultFromProto");
    __name(rowFromProto, "rowFromProto");
    __name(errorFromProto, "errorFromProto");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/sql.js
function sqlToProto(owner, sql2) {
  if (sql2 instanceof Sql) {
    return { sqlId: sql2._getSqlId(owner) };
  } else {
    return { sql: "" + sql2 };
  }
}
var Sql;
var init_sql = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/sql.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_errors();
    Sql = class {
      static {
        __name(this, "Sql");
      }
      #owner;
      #sqlId;
      #closed;
      /** @private */
      constructor(owner, sqlId) {
        this.#owner = owner;
        this.#sqlId = sqlId;
        this.#closed = void 0;
      }
      /** @private */
      _getSqlId(owner) {
        if (this.#owner !== owner) {
          throw new MisuseError("Attempted to use SQL text opened with other object");
        } else if (this.#closed !== void 0) {
          throw new ClosedError("SQL text is closed", this.#closed);
        }
        return this.#sqlId;
      }
      /** Remove the SQL text from the server, releasing resouces. */
      close() {
        this._setClosed(new ClientError("SQL text was manually closed"));
      }
      /** @private */
      _setClosed(error) {
        if (this.#closed === void 0) {
          this.#closed = error;
          this.#owner._closeSql(this.#sqlId);
        }
      }
      /** True if the SQL text is closed (removed from the server). */
      get closed() {
        return this.#closed !== void 0;
      }
    };
    __name(sqlToProto, "sqlToProto");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/queue.js
var Queue;
var init_queue = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/queue.js"() {
    init_functionsRoutes_0_6398490784585695();
    Queue = class {
      static {
        __name(this, "Queue");
      }
      #pushStack;
      #shiftStack;
      constructor() {
        this.#pushStack = [];
        this.#shiftStack = [];
      }
      get length() {
        return this.#pushStack.length + this.#shiftStack.length;
      }
      push(elem) {
        this.#pushStack.push(elem);
      }
      shift() {
        if (this.#shiftStack.length === 0 && this.#pushStack.length > 0) {
          this.#shiftStack = this.#pushStack.reverse();
          this.#pushStack = [];
        }
        return this.#shiftStack.pop();
      }
      first() {
        return this.#shiftStack.length !== 0 ? this.#shiftStack[this.#shiftStack.length - 1] : this.#pushStack[0];
      }
    };
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/stmt.js
function stmtToProto(sqlOwner, stmt, wantRows) {
  let inSql;
  let args = [];
  let namedArgs = [];
  if (stmt instanceof Stmt) {
    inSql = stmt.sql;
    args = stmt._args;
    for (const [name, value] of stmt._namedArgs.entries()) {
      namedArgs.push({ name, value });
    }
  } else if (Array.isArray(stmt)) {
    inSql = stmt[0];
    if (Array.isArray(stmt[1])) {
      args = stmt[1].map((arg) => valueToProto(arg));
    } else {
      namedArgs = Object.entries(stmt[1]).map(([name, value]) => {
        return { name, value: valueToProto(value) };
      });
    }
  } else {
    inSql = stmt;
  }
  const { sql: sql2, sqlId } = sqlToProto(sqlOwner, inSql);
  return { sql: sql2, sqlId, args, namedArgs, wantRows };
}
var Stmt;
var init_stmt = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/stmt.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_sql();
    init_value();
    Stmt = class {
      static {
        __name(this, "Stmt");
      }
      /** The SQL statement text. */
      sql;
      /** @private */
      _args;
      /** @private */
      _namedArgs;
      /** Initialize the statement with given SQL text. */
      constructor(sql2) {
        this.sql = sql2;
        this._args = [];
        this._namedArgs = /* @__PURE__ */ new Map();
      }
      /** Binds positional parameters from the given `values`. All previous positional bindings are cleared. */
      bindIndexes(values) {
        this._args.length = 0;
        for (const value of values) {
          this._args.push(valueToProto(value));
        }
        return this;
      }
      /** Binds a parameter by a 1-based index. */
      bindIndex(index2, value) {
        if (index2 !== (index2 | 0) || index2 <= 0) {
          throw new RangeError("Index of a positional argument must be positive integer");
        }
        while (this._args.length < index2) {
          this._args.push(null);
        }
        this._args[index2 - 1] = valueToProto(value);
        return this;
      }
      /** Binds a parameter by name. */
      bindName(name, value) {
        this._namedArgs.set(name, valueToProto(value));
        return this;
      }
      /** Clears all bindings. */
      unbindAll() {
        this._args.length = 0;
        this._namedArgs.clear();
        return this;
      }
    };
    __name(stmtToProto, "stmtToProto");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/batch.js
function executeRegular(stream, steps, batch) {
  return stream._batch(batch).then((result) => {
    for (let step = 0; step < steps.length; ++step) {
      const stepResult = result.stepResults.get(step);
      const stepError = result.stepErrors.get(step);
      steps[step].callback(stepResult, stepError);
    }
  });
}
async function executeCursor(stream, steps, batch) {
  const cursor = await stream._openCursor(batch);
  try {
    let nextStep = 0;
    let beginEntry = void 0;
    let rows = [];
    for (; ; ) {
      const entry = await cursor.next();
      if (entry === void 0) {
        break;
      }
      if (entry.type === "step_begin") {
        if (entry.step < nextStep || entry.step >= steps.length) {
          throw new ProtoError("Server produced StepBeginEntry for unexpected step");
        } else if (beginEntry !== void 0) {
          throw new ProtoError("Server produced StepBeginEntry before terminating previous step");
        }
        for (let step = nextStep; step < entry.step; ++step) {
          steps[step].callback(void 0, void 0);
        }
        nextStep = entry.step + 1;
        beginEntry = entry;
        rows = [];
      } else if (entry.type === "step_end") {
        if (beginEntry === void 0) {
          throw new ProtoError("Server produced StepEndEntry but no step is active");
        }
        const stmtResult = {
          cols: beginEntry.cols,
          rows,
          affectedRowCount: entry.affectedRowCount,
          lastInsertRowid: entry.lastInsertRowid
        };
        steps[beginEntry.step].callback(stmtResult, void 0);
        beginEntry = void 0;
        rows = [];
      } else if (entry.type === "step_error") {
        if (beginEntry === void 0) {
          if (entry.step >= steps.length) {
            throw new ProtoError("Server produced StepErrorEntry for unexpected step");
          }
          for (let step = nextStep; step < entry.step; ++step) {
            steps[step].callback(void 0, void 0);
          }
        } else {
          if (entry.step !== beginEntry.step) {
            throw new ProtoError("Server produced StepErrorEntry for unexpected step");
          }
          beginEntry = void 0;
          rows = [];
        }
        steps[entry.step].callback(void 0, entry.error);
        nextStep = entry.step + 1;
      } else if (entry.type === "row") {
        if (beginEntry === void 0) {
          throw new ProtoError("Server produced RowEntry but no step is active");
        }
        rows.push(entry.row);
      } else if (entry.type === "error") {
        throw errorFromProto(entry.error);
      } else if (entry.type === "none") {
        throw new ProtoError("Server produced unrecognized CursorEntry");
      } else {
        throw impossible(entry, "Impossible CursorEntry");
      }
    }
    if (beginEntry !== void 0) {
      throw new ProtoError("Server closed Cursor before terminating active step");
    }
    for (let step = nextStep; step < steps.length; ++step) {
      steps[step].callback(void 0, void 0);
    }
  } finally {
    cursor.close();
  }
}
function stepIndex(step) {
  if (step._index === void 0) {
    throw new MisuseError("Cannot add a condition referencing a step that has not been added to the batch");
  }
  return step._index;
}
function checkCondBatch(expectedBatch, cond) {
  if (cond._batch !== expectedBatch) {
    throw new MisuseError("Cannot mix BatchCond objects for different Batch objects");
  }
}
var Batch, BatchStep, BatchCond;
var init_batch = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/batch.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_errors();
    init_result();
    init_stmt();
    init_util3();
    Batch = class {
      static {
        __name(this, "Batch");
      }
      /** @private */
      _stream;
      #useCursor;
      /** @private */
      _steps;
      #executed;
      /** @private */
      constructor(stream, useCursor) {
        this._stream = stream;
        this.#useCursor = useCursor;
        this._steps = [];
        this.#executed = false;
      }
      /** Return a builder for adding a step to the batch. */
      step() {
        return new BatchStep(this);
      }
      /** Execute the batch. */
      execute() {
        if (this.#executed) {
          throw new MisuseError("This batch has already been executed");
        }
        this.#executed = true;
        const batch = {
          steps: this._steps.map((step) => step.proto)
        };
        if (this.#useCursor) {
          return executeCursor(this._stream, this._steps, batch);
        } else {
          return executeRegular(this._stream, this._steps, batch);
        }
      }
    };
    __name(executeRegular, "executeRegular");
    __name(executeCursor, "executeCursor");
    BatchStep = class {
      static {
        __name(this, "BatchStep");
      }
      /** @private */
      _batch;
      #conds;
      /** @private */
      _index;
      /** @private */
      constructor(batch) {
        this._batch = batch;
        this.#conds = [];
        this._index = void 0;
      }
      /** Add the condition that needs to be satisfied to execute the statement. If you use this method multiple
       * times, we join the conditions with a logical AND. */
      condition(cond) {
        this.#conds.push(cond._proto);
        return this;
      }
      /** Add a statement that returns rows. */
      query(stmt) {
        return this.#add(stmt, true, rowsResultFromProto);
      }
      /** Add a statement that returns at most a single row. */
      queryRow(stmt) {
        return this.#add(stmt, true, rowResultFromProto);
      }
      /** Add a statement that returns at most a single value. */
      queryValue(stmt) {
        return this.#add(stmt, true, valueResultFromProto);
      }
      /** Add a statement without returning rows. */
      run(stmt) {
        return this.#add(stmt, false, stmtResultFromProto);
      }
      #add(inStmt, wantRows, fromProto) {
        if (this._index !== void 0) {
          throw new MisuseError("This BatchStep has already been added to the batch");
        }
        const stmt = stmtToProto(this._batch._stream._sqlOwner(), inStmt, wantRows);
        let condition;
        if (this.#conds.length === 0) {
          condition = void 0;
        } else if (this.#conds.length === 1) {
          condition = this.#conds[0];
        } else {
          condition = { type: "and", conds: this.#conds.slice() };
        }
        const proto = { stmt, condition };
        return new Promise((outputCallback, errorCallback) => {
          const callback = /* @__PURE__ */ __name((stepResult, stepError) => {
            if (stepResult !== void 0 && stepError !== void 0) {
              errorCallback(new ProtoError("Server returned both result and error"));
            } else if (stepError !== void 0) {
              errorCallback(errorFromProto(stepError));
            } else if (stepResult !== void 0) {
              outputCallback(fromProto(stepResult, this._batch._stream.intMode));
            } else {
              outputCallback(void 0);
            }
          }, "callback");
          this._index = this._batch._steps.length;
          this._batch._steps.push({ proto, callback });
        });
      }
    };
    BatchCond = class _BatchCond {
      static {
        __name(this, "BatchCond");
      }
      /** @private */
      _batch;
      /** @private */
      _proto;
      /** @private */
      constructor(batch, proto) {
        this._batch = batch;
        this._proto = proto;
      }
      /** Create a condition that evaluates to true when the given step executes successfully.
       *
       * If the given step fails error or is skipped because its condition evaluated to false, this
       * condition evaluates to false.
       */
      static ok(step) {
        return new _BatchCond(step._batch, { type: "ok", step: stepIndex(step) });
      }
      /** Create a condition that evaluates to true when the given step fails.
       *
       * If the given step succeeds or is skipped because its condition evaluated to false, this condition
       * evaluates to false.
       */
      static error(step) {
        return new _BatchCond(step._batch, { type: "error", step: stepIndex(step) });
      }
      /** Create a condition that is a logical negation of another condition.
       */
      static not(cond) {
        return new _BatchCond(cond._batch, { type: "not", cond: cond._proto });
      }
      /** Create a condition that is a logical AND of other conditions.
       */
      static and(batch, conds) {
        for (const cond of conds) {
          checkCondBatch(batch, cond);
        }
        return new _BatchCond(batch, { type: "and", conds: conds.map((e) => e._proto) });
      }
      /** Create a condition that is a logical OR of other conditions.
       */
      static or(batch, conds) {
        for (const cond of conds) {
          checkCondBatch(batch, cond);
        }
        return new _BatchCond(batch, { type: "or", conds: conds.map((e) => e._proto) });
      }
      /** Create a condition that evaluates to true when the SQL connection is in autocommit mode (not inside an
       * explicit transaction). This requires protocol version 3 or higher.
       */
      static isAutocommit(batch) {
        batch._stream.client()._ensureVersion(3, "BatchCond.isAutocommit()");
        return new _BatchCond(batch, { type: "is_autocommit" });
      }
    };
    __name(stepIndex, "stepIndex");
    __name(checkCondBatch, "checkCondBatch");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/describe.js
function describeResultFromProto(result) {
  return {
    paramNames: result.params.map((p) => p.name),
    columns: result.cols,
    isExplain: result.isExplain,
    isReadonly: result.isReadonly
  };
}
var init_describe = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/describe.js"() {
    init_functionsRoutes_0_6398490784585695();
    __name(describeResultFromProto, "describeResultFromProto");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/stream.js
var Stream;
var init_stream = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/stream.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_batch();
    init_describe();
    init_result();
    init_sql();
    init_stmt();
    Stream = class {
      static {
        __name(this, "Stream");
      }
      /** @private */
      constructor(intMode) {
        this.intMode = intMode;
      }
      /** Execute a statement and return rows. */
      query(stmt) {
        return this.#execute(stmt, true, rowsResultFromProto);
      }
      /** Execute a statement and return at most a single row. */
      queryRow(stmt) {
        return this.#execute(stmt, true, rowResultFromProto);
      }
      /** Execute a statement and return at most a single value. */
      queryValue(stmt) {
        return this.#execute(stmt, true, valueResultFromProto);
      }
      /** Execute a statement without returning rows. */
      run(stmt) {
        return this.#execute(stmt, false, stmtResultFromProto);
      }
      #execute(inStmt, wantRows, fromProto) {
        const stmt = stmtToProto(this._sqlOwner(), inStmt, wantRows);
        return this._execute(stmt).then((r) => fromProto(r, this.intMode));
      }
      /** Return a builder for creating and executing a batch.
       *
       * If `useCursor` is true, the batch will be executed using a Hrana cursor, which will stream results from
       * the server to the client, which consumes less memory on the server. This requires protocol version 3 or
       * higher.
       */
      batch(useCursor = false) {
        return new Batch(this, useCursor);
      }
      /** Parse and analyze a statement. This requires protocol version 2 or higher. */
      describe(inSql) {
        const protoSql = sqlToProto(this._sqlOwner(), inSql);
        return this._describe(protoSql).then(describeResultFromProto);
      }
      /** Execute a sequence of statements separated by semicolons. This requires protocol version 2 or higher.
       * */
      sequence(inSql) {
        const protoSql = sqlToProto(this._sqlOwner(), inSql);
        return this._sequence(protoSql);
      }
      /** Representation of integers returned from the database. See {@link IntMode}.
       *
       * This value affects the results of all operations on this stream.
       */
      intMode;
    };
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/cursor.js
var Cursor;
var init_cursor = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/cursor.js"() {
    init_functionsRoutes_0_6398490784585695();
    Cursor = class {
      static {
        __name(this, "Cursor");
      }
    };
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/ws/cursor.js
var fetchChunkSize, fetchQueueSize, WsCursor;
var init_cursor2 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/ws/cursor.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_errors();
    init_cursor();
    init_queue();
    fetchChunkSize = 1e3;
    fetchQueueSize = 10;
    WsCursor = class extends Cursor {
      static {
        __name(this, "WsCursor");
      }
      #client;
      #stream;
      #cursorId;
      #entryQueue;
      #fetchQueue;
      #closed;
      #done;
      /** @private */
      constructor(client, stream, cursorId) {
        super();
        this.#client = client;
        this.#stream = stream;
        this.#cursorId = cursorId;
        this.#entryQueue = new Queue();
        this.#fetchQueue = new Queue();
        this.#closed = void 0;
        this.#done = false;
      }
      /** Fetch the next entry from the cursor. */
      async next() {
        for (; ; ) {
          if (this.#closed !== void 0) {
            throw new ClosedError("Cursor is closed", this.#closed);
          }
          while (!this.#done && this.#fetchQueue.length < fetchQueueSize) {
            this.#fetchQueue.push(this.#fetch());
          }
          const entry = this.#entryQueue.shift();
          if (this.#done || entry !== void 0) {
            return entry;
          }
          await this.#fetchQueue.shift().then((response) => {
            if (response === void 0) {
              return;
            }
            for (const entry2 of response.entries) {
              this.#entryQueue.push(entry2);
            }
            this.#done ||= response.done;
          });
        }
      }
      #fetch() {
        return this.#stream._sendCursorRequest(this, {
          type: "fetch_cursor",
          cursorId: this.#cursorId,
          maxCount: fetchChunkSize
        }).then((resp) => resp, (error) => {
          this._setClosed(error);
          return void 0;
        });
      }
      /** @private */
      _setClosed(error) {
        if (this.#closed !== void 0) {
          return;
        }
        this.#closed = error;
        this.#stream._sendCursorRequest(this, {
          type: "close_cursor",
          cursorId: this.#cursorId
        }).catch(() => void 0);
        this.#stream._cursorClosed(this);
      }
      /** Close the cursor. */
      close() {
        this._setClosed(new ClientError("Cursor was manually closed"));
      }
      /** True if the cursor is closed. */
      get closed() {
        return this.#closed !== void 0;
      }
    };
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/ws/stream.js
var WsStream;
var init_stream2 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/ws/stream.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_errors();
    init_queue();
    init_stream();
    init_cursor2();
    WsStream = class _WsStream extends Stream {
      static {
        __name(this, "WsStream");
      }
      #client;
      #streamId;
      #queue;
      #cursor;
      #closing;
      #closed;
      /** @private */
      static open(client) {
        const streamId = client._streamIdAlloc.alloc();
        const stream = new _WsStream(client, streamId);
        const responseCallback = /* @__PURE__ */ __name(() => void 0, "responseCallback");
        const errorCallback = /* @__PURE__ */ __name((e) => stream.#setClosed(e), "errorCallback");
        const request = { type: "open_stream", streamId };
        client._sendRequest(request, { responseCallback, errorCallback });
        return stream;
      }
      /** @private */
      constructor(client, streamId) {
        super(client.intMode);
        this.#client = client;
        this.#streamId = streamId;
        this.#queue = new Queue();
        this.#cursor = void 0;
        this.#closing = false;
        this.#closed = void 0;
      }
      /** Get the {@link WsClient} object that this stream belongs to. */
      client() {
        return this.#client;
      }
      /** @private */
      _sqlOwner() {
        return this.#client;
      }
      /** @private */
      _execute(stmt) {
        return this.#sendStreamRequest({
          type: "execute",
          streamId: this.#streamId,
          stmt
        }).then((response) => {
          return response.result;
        });
      }
      /** @private */
      _batch(batch) {
        return this.#sendStreamRequest({
          type: "batch",
          streamId: this.#streamId,
          batch
        }).then((response) => {
          return response.result;
        });
      }
      /** @private */
      _describe(protoSql) {
        this.#client._ensureVersion(2, "describe()");
        return this.#sendStreamRequest({
          type: "describe",
          streamId: this.#streamId,
          sql: protoSql.sql,
          sqlId: protoSql.sqlId
        }).then((response) => {
          return response.result;
        });
      }
      /** @private */
      _sequence(protoSql) {
        this.#client._ensureVersion(2, "sequence()");
        return this.#sendStreamRequest({
          type: "sequence",
          streamId: this.#streamId,
          sql: protoSql.sql,
          sqlId: protoSql.sqlId
        }).then((_response) => {
          return void 0;
        });
      }
      /** Check whether the SQL connection underlying this stream is in autocommit state (i.e., outside of an
       * explicit transaction). This requires protocol version 3 or higher.
       */
      getAutocommit() {
        this.#client._ensureVersion(3, "getAutocommit()");
        return this.#sendStreamRequest({
          type: "get_autocommit",
          streamId: this.#streamId
        }).then((response) => {
          return response.isAutocommit;
        });
      }
      #sendStreamRequest(request) {
        return new Promise((responseCallback, errorCallback) => {
          this.#pushToQueue({ type: "request", request, responseCallback, errorCallback });
        });
      }
      /** @private */
      _openCursor(batch) {
        this.#client._ensureVersion(3, "cursor");
        return new Promise((cursorCallback, errorCallback) => {
          this.#pushToQueue({ type: "cursor", batch, cursorCallback, errorCallback });
        });
      }
      /** @private */
      _sendCursorRequest(cursor, request) {
        if (cursor !== this.#cursor) {
          throw new InternalError("Cursor not associated with the stream attempted to execute a request");
        }
        return new Promise((responseCallback, errorCallback) => {
          if (this.#closed !== void 0) {
            errorCallback(new ClosedError("Stream is closed", this.#closed));
          } else {
            this.#client._sendRequest(request, { responseCallback, errorCallback });
          }
        });
      }
      /** @private */
      _cursorClosed(cursor) {
        if (cursor !== this.#cursor) {
          throw new InternalError("Cursor was closed, but it was not associated with the stream");
        }
        this.#cursor = void 0;
        this.#flushQueue();
      }
      #pushToQueue(entry) {
        if (this.#closed !== void 0) {
          entry.errorCallback(new ClosedError("Stream is closed", this.#closed));
        } else if (this.#closing) {
          entry.errorCallback(new ClosedError("Stream is closing", void 0));
        } else {
          this.#queue.push(entry);
          this.#flushQueue();
        }
      }
      #flushQueue() {
        for (; ; ) {
          const entry = this.#queue.first();
          if (entry === void 0 && this.#cursor === void 0 && this.#closing) {
            this.#setClosed(new ClientError("Stream was gracefully closed"));
            break;
          } else if (entry?.type === "request" && this.#cursor === void 0) {
            const { request, responseCallback, errorCallback } = entry;
            this.#queue.shift();
            this.#client._sendRequest(request, { responseCallback, errorCallback });
          } else if (entry?.type === "cursor" && this.#cursor === void 0) {
            const { batch, cursorCallback } = entry;
            this.#queue.shift();
            const cursorId = this.#client._cursorIdAlloc.alloc();
            const cursor = new WsCursor(this.#client, this, cursorId);
            const request = {
              type: "open_cursor",
              streamId: this.#streamId,
              cursorId,
              batch
            };
            const responseCallback = /* @__PURE__ */ __name(() => void 0, "responseCallback");
            const errorCallback = /* @__PURE__ */ __name((e) => cursor._setClosed(e), "errorCallback");
            this.#client._sendRequest(request, { responseCallback, errorCallback });
            this.#cursor = cursor;
            cursorCallback(cursor);
          } else {
            break;
          }
        }
      }
      #setClosed(error) {
        if (this.#closed !== void 0) {
          return;
        }
        this.#closed = error;
        if (this.#cursor !== void 0) {
          this.#cursor._setClosed(error);
        }
        for (; ; ) {
          const entry = this.#queue.shift();
          if (entry !== void 0) {
            entry.errorCallback(error);
          } else {
            break;
          }
        }
        const request = { type: "close_stream", streamId: this.#streamId };
        const responseCallback = /* @__PURE__ */ __name(() => this.#client._streamIdAlloc.free(this.#streamId), "responseCallback");
        const errorCallback = /* @__PURE__ */ __name(() => void 0, "errorCallback");
        this.#client._sendRequest(request, { responseCallback, errorCallback });
      }
      /** Immediately close the stream. */
      close() {
        this.#setClosed(new ClientError("Stream was manually closed"));
      }
      /** Gracefully close the stream. */
      closeGracefully() {
        this.#closing = true;
        this.#flushQueue();
      }
      /** True if the stream is closed or closing. */
      get closed() {
        return this.#closed !== void 0 || this.#closing;
      }
    };
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/shared/json_encode.js
function Stmt2(w, msg) {
  if (msg.sql !== void 0) {
    w.string("sql", msg.sql);
  }
  if (msg.sqlId !== void 0) {
    w.number("sql_id", msg.sqlId);
  }
  w.arrayObjects("args", msg.args, Value);
  w.arrayObjects("named_args", msg.namedArgs, NamedArg);
  w.boolean("want_rows", msg.wantRows);
}
function NamedArg(w, msg) {
  w.string("name", msg.name);
  w.object("value", msg.value, Value);
}
function Batch2(w, msg) {
  w.arrayObjects("steps", msg.steps, BatchStep2);
}
function BatchStep2(w, msg) {
  if (msg.condition !== void 0) {
    w.object("condition", msg.condition, BatchCond2);
  }
  w.object("stmt", msg.stmt, Stmt2);
}
function BatchCond2(w, msg) {
  w.stringRaw("type", msg.type);
  if (msg.type === "ok" || msg.type === "error") {
    w.number("step", msg.step);
  } else if (msg.type === "not") {
    w.object("cond", msg.cond, BatchCond2);
  } else if (msg.type === "and" || msg.type === "or") {
    w.arrayObjects("conds", msg.conds, BatchCond2);
  } else if (msg.type === "is_autocommit") {
  } else {
    throw impossible(msg, "Impossible type of BatchCond");
  }
}
function Value(w, msg) {
  if (msg === null) {
    w.stringRaw("type", "null");
  } else if (typeof msg === "bigint") {
    w.stringRaw("type", "integer");
    w.stringRaw("value", "" + msg);
  } else if (typeof msg === "number") {
    w.stringRaw("type", "float");
    w.number("value", msg);
  } else if (typeof msg === "string") {
    w.stringRaw("type", "text");
    w.string("value", msg);
  } else if (msg instanceof Uint8Array) {
    w.stringRaw("type", "blob");
    w.stringRaw("base64", gBase64.fromUint8Array(msg));
  } else if (msg === void 0) {
  } else {
    throw impossible(msg, "Impossible type of Value");
  }
}
var init_json_encode = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/shared/json_encode.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_base64();
    init_util3();
    __name(Stmt2, "Stmt");
    __name(NamedArg, "NamedArg");
    __name(Batch2, "Batch");
    __name(BatchStep2, "BatchStep");
    __name(BatchCond2, "BatchCond");
    __name(Value, "Value");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/ws/json_encode.js
function ClientMsg(w, msg) {
  w.stringRaw("type", msg.type);
  if (msg.type === "hello") {
    if (msg.jwt !== void 0) {
      w.string("jwt", msg.jwt);
    }
  } else if (msg.type === "request") {
    w.number("request_id", msg.requestId);
    w.object("request", msg.request, Request2);
  } else {
    throw impossible(msg, "Impossible type of ClientMsg");
  }
}
function Request2(w, msg) {
  w.stringRaw("type", msg.type);
  if (msg.type === "open_stream") {
    w.number("stream_id", msg.streamId);
  } else if (msg.type === "close_stream") {
    w.number("stream_id", msg.streamId);
  } else if (msg.type === "execute") {
    w.number("stream_id", msg.streamId);
    w.object("stmt", msg.stmt, Stmt2);
  } else if (msg.type === "batch") {
    w.number("stream_id", msg.streamId);
    w.object("batch", msg.batch, Batch2);
  } else if (msg.type === "open_cursor") {
    w.number("stream_id", msg.streamId);
    w.number("cursor_id", msg.cursorId);
    w.object("batch", msg.batch, Batch2);
  } else if (msg.type === "close_cursor") {
    w.number("cursor_id", msg.cursorId);
  } else if (msg.type === "fetch_cursor") {
    w.number("cursor_id", msg.cursorId);
    w.number("max_count", msg.maxCount);
  } else if (msg.type === "sequence") {
    w.number("stream_id", msg.streamId);
    if (msg.sql !== void 0) {
      w.string("sql", msg.sql);
    }
    if (msg.sqlId !== void 0) {
      w.number("sql_id", msg.sqlId);
    }
  } else if (msg.type === "describe") {
    w.number("stream_id", msg.streamId);
    if (msg.sql !== void 0) {
      w.string("sql", msg.sql);
    }
    if (msg.sqlId !== void 0) {
      w.number("sql_id", msg.sqlId);
    }
  } else if (msg.type === "store_sql") {
    w.number("sql_id", msg.sqlId);
    w.string("sql", msg.sql);
  } else if (msg.type === "close_sql") {
    w.number("sql_id", msg.sqlId);
  } else if (msg.type === "get_autocommit") {
    w.number("stream_id", msg.streamId);
  } else {
    throw impossible(msg, "Impossible type of Request");
  }
}
var init_json_encode2 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/ws/json_encode.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_json_encode();
    init_util3();
    __name(ClientMsg, "ClientMsg");
    __name(Request2, "Request");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/shared/protobuf_encode.js
function Stmt3(w, msg) {
  if (msg.sql !== void 0) {
    w.string(1, msg.sql);
  }
  if (msg.sqlId !== void 0) {
    w.int32(2, msg.sqlId);
  }
  for (const arg of msg.args) {
    w.message(3, arg, Value2);
  }
  for (const arg of msg.namedArgs) {
    w.message(4, arg, NamedArg2);
  }
  w.bool(5, msg.wantRows);
}
function NamedArg2(w, msg) {
  w.string(1, msg.name);
  w.message(2, msg.value, Value2);
}
function Batch3(w, msg) {
  for (const step of msg.steps) {
    w.message(1, step, BatchStep3);
  }
}
function BatchStep3(w, msg) {
  if (msg.condition !== void 0) {
    w.message(1, msg.condition, BatchCond3);
  }
  w.message(2, msg.stmt, Stmt3);
}
function BatchCond3(w, msg) {
  if (msg.type === "ok") {
    w.uint32(1, msg.step);
  } else if (msg.type === "error") {
    w.uint32(2, msg.step);
  } else if (msg.type === "not") {
    w.message(3, msg.cond, BatchCond3);
  } else if (msg.type === "and") {
    w.message(4, msg.conds, BatchCondList);
  } else if (msg.type === "or") {
    w.message(5, msg.conds, BatchCondList);
  } else if (msg.type === "is_autocommit") {
    w.message(6, void 0, Empty);
  } else {
    throw impossible(msg, "Impossible type of BatchCond");
  }
}
function BatchCondList(w, msg) {
  for (const cond of msg) {
    w.message(1, cond, BatchCond3);
  }
}
function Value2(w, msg) {
  if (msg === null) {
    w.message(1, void 0, Empty);
  } else if (typeof msg === "bigint") {
    w.sint64(2, msg);
  } else if (typeof msg === "number") {
    w.double(3, msg);
  } else if (typeof msg === "string") {
    w.string(4, msg);
  } else if (msg instanceof Uint8Array) {
    w.bytes(5, msg);
  } else if (msg === void 0) {
  } else {
    throw impossible(msg, "Impossible type of Value");
  }
}
function Empty(_w, _msg) {
}
var init_protobuf_encode = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/shared/protobuf_encode.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_util3();
    __name(Stmt3, "Stmt");
    __name(NamedArg2, "NamedArg");
    __name(Batch3, "Batch");
    __name(BatchStep3, "BatchStep");
    __name(BatchCond3, "BatchCond");
    __name(BatchCondList, "BatchCondList");
    __name(Value2, "Value");
    __name(Empty, "Empty");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/ws/protobuf_encode.js
function ClientMsg2(w, msg) {
  if (msg.type === "hello") {
    w.message(1, msg, HelloMsg);
  } else if (msg.type === "request") {
    w.message(2, msg, RequestMsg);
  } else {
    throw impossible(msg, "Impossible type of ClientMsg");
  }
}
function HelloMsg(w, msg) {
  if (msg.jwt !== void 0) {
    w.string(1, msg.jwt);
  }
}
function RequestMsg(w, msg) {
  w.int32(1, msg.requestId);
  const request = msg.request;
  if (request.type === "open_stream") {
    w.message(2, request, OpenStreamReq);
  } else if (request.type === "close_stream") {
    w.message(3, request, CloseStreamReq);
  } else if (request.type === "execute") {
    w.message(4, request, ExecuteReq);
  } else if (request.type === "batch") {
    w.message(5, request, BatchReq);
  } else if (request.type === "open_cursor") {
    w.message(6, request, OpenCursorReq);
  } else if (request.type === "close_cursor") {
    w.message(7, request, CloseCursorReq);
  } else if (request.type === "fetch_cursor") {
    w.message(8, request, FetchCursorReq);
  } else if (request.type === "sequence") {
    w.message(9, request, SequenceReq);
  } else if (request.type === "describe") {
    w.message(10, request, DescribeReq);
  } else if (request.type === "store_sql") {
    w.message(11, request, StoreSqlReq);
  } else if (request.type === "close_sql") {
    w.message(12, request, CloseSqlReq);
  } else if (request.type === "get_autocommit") {
    w.message(13, request, GetAutocommitReq);
  } else {
    throw impossible(request, "Impossible type of Request");
  }
}
function OpenStreamReq(w, msg) {
  w.int32(1, msg.streamId);
}
function CloseStreamReq(w, msg) {
  w.int32(1, msg.streamId);
}
function ExecuteReq(w, msg) {
  w.int32(1, msg.streamId);
  w.message(2, msg.stmt, Stmt3);
}
function BatchReq(w, msg) {
  w.int32(1, msg.streamId);
  w.message(2, msg.batch, Batch3);
}
function OpenCursorReq(w, msg) {
  w.int32(1, msg.streamId);
  w.int32(2, msg.cursorId);
  w.message(3, msg.batch, Batch3);
}
function CloseCursorReq(w, msg) {
  w.int32(1, msg.cursorId);
}
function FetchCursorReq(w, msg) {
  w.int32(1, msg.cursorId);
  w.uint32(2, msg.maxCount);
}
function SequenceReq(w, msg) {
  w.int32(1, msg.streamId);
  if (msg.sql !== void 0) {
    w.string(2, msg.sql);
  }
  if (msg.sqlId !== void 0) {
    w.int32(3, msg.sqlId);
  }
}
function DescribeReq(w, msg) {
  w.int32(1, msg.streamId);
  if (msg.sql !== void 0) {
    w.string(2, msg.sql);
  }
  if (msg.sqlId !== void 0) {
    w.int32(3, msg.sqlId);
  }
}
function StoreSqlReq(w, msg) {
  w.int32(1, msg.sqlId);
  w.string(2, msg.sql);
}
function CloseSqlReq(w, msg) {
  w.int32(1, msg.sqlId);
}
function GetAutocommitReq(w, msg) {
  w.int32(1, msg.streamId);
}
var init_protobuf_encode2 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/ws/protobuf_encode.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_protobuf_encode();
    init_util3();
    __name(ClientMsg2, "ClientMsg");
    __name(HelloMsg, "HelloMsg");
    __name(RequestMsg, "RequestMsg");
    __name(OpenStreamReq, "OpenStreamReq");
    __name(CloseStreamReq, "CloseStreamReq");
    __name(ExecuteReq, "ExecuteReq");
    __name(BatchReq, "BatchReq");
    __name(OpenCursorReq, "OpenCursorReq");
    __name(CloseCursorReq, "CloseCursorReq");
    __name(FetchCursorReq, "FetchCursorReq");
    __name(SequenceReq, "SequenceReq");
    __name(DescribeReq, "DescribeReq");
    __name(StoreSqlReq, "StoreSqlReq");
    __name(CloseSqlReq, "CloseSqlReq");
    __name(GetAutocommitReq, "GetAutocommitReq");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/shared/json_decode.js
function Error2(obj) {
  const message = string(obj["message"]);
  const code = stringOpt(obj["code"]);
  return { message, code };
}
function StmtResult(obj) {
  const cols = arrayObjectsMap(obj["cols"], Col);
  const rows = array(obj["rows"]).map((rowObj) => arrayObjectsMap(rowObj, Value3));
  const affectedRowCount = number(obj["affected_row_count"]);
  const lastInsertRowidStr = stringOpt(obj["last_insert_rowid"]);
  const lastInsertRowid = lastInsertRowidStr !== void 0 ? BigInt(lastInsertRowidStr) : void 0;
  return { cols, rows, affectedRowCount, lastInsertRowid };
}
function Col(obj) {
  const name = stringOpt(obj["name"]);
  const decltype = stringOpt(obj["decltype"]);
  return { name, decltype };
}
function BatchResult(obj) {
  const stepResults = /* @__PURE__ */ new Map();
  array(obj["step_results"]).forEach((value, i) => {
    if (value !== null) {
      stepResults.set(i, StmtResult(object(value)));
    }
  });
  const stepErrors = /* @__PURE__ */ new Map();
  array(obj["step_errors"]).forEach((value, i) => {
    if (value !== null) {
      stepErrors.set(i, Error2(object(value)));
    }
  });
  return { stepResults, stepErrors };
}
function CursorEntry(obj) {
  const type = string(obj["type"]);
  if (type === "step_begin") {
    const step = number(obj["step"]);
    const cols = arrayObjectsMap(obj["cols"], Col);
    return { type: "step_begin", step, cols };
  } else if (type === "step_end") {
    const affectedRowCount = number(obj["affected_row_count"]);
    const lastInsertRowidStr = stringOpt(obj["last_insert_rowid"]);
    const lastInsertRowid = lastInsertRowidStr !== void 0 ? BigInt(lastInsertRowidStr) : void 0;
    return { type: "step_end", affectedRowCount, lastInsertRowid };
  } else if (type === "step_error") {
    const step = number(obj["step"]);
    const error = Error2(object(obj["error"]));
    return { type: "step_error", step, error };
  } else if (type === "row") {
    const row = arrayObjectsMap(obj["row"], Value3);
    return { type: "row", row };
  } else if (type === "error") {
    const error = Error2(object(obj["error"]));
    return { type: "error", error };
  } else {
    throw new ProtoError("Unexpected type of CursorEntry");
  }
}
function DescribeResult(obj) {
  const params = arrayObjectsMap(obj["params"], DescribeParam);
  const cols = arrayObjectsMap(obj["cols"], DescribeCol);
  const isExplain = boolean(obj["is_explain"]);
  const isReadonly = boolean(obj["is_readonly"]);
  return { params, cols, isExplain, isReadonly };
}
function DescribeParam(obj) {
  const name = stringOpt(obj["name"]);
  return { name };
}
function DescribeCol(obj) {
  const name = string(obj["name"]);
  const decltype = stringOpt(obj["decltype"]);
  return { name, decltype };
}
function Value3(obj) {
  const type = string(obj["type"]);
  if (type === "null") {
    return null;
  } else if (type === "integer") {
    const value = string(obj["value"]);
    return BigInt(value);
  } else if (type === "float") {
    return number(obj["value"]);
  } else if (type === "text") {
    return string(obj["value"]);
  } else if (type === "blob") {
    return gBase64.toUint8Array(string(obj["base64"]));
  } else {
    throw new ProtoError("Unexpected type of Value");
  }
}
var init_json_decode = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/shared/json_decode.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_base64();
    init_errors();
    init_decode();
    __name(Error2, "Error");
    __name(StmtResult, "StmtResult");
    __name(Col, "Col");
    __name(BatchResult, "BatchResult");
    __name(CursorEntry, "CursorEntry");
    __name(DescribeResult, "DescribeResult");
    __name(DescribeParam, "DescribeParam");
    __name(DescribeCol, "DescribeCol");
    __name(Value3, "Value");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/ws/json_decode.js
function ServerMsg(obj) {
  const type = string(obj["type"]);
  if (type === "hello_ok") {
    return { type: "hello_ok" };
  } else if (type === "hello_error") {
    const error = Error2(object(obj["error"]));
    return { type: "hello_error", error };
  } else if (type === "response_ok") {
    const requestId = number(obj["request_id"]);
    const response = Response2(object(obj["response"]));
    return { type: "response_ok", requestId, response };
  } else if (type === "response_error") {
    const requestId = number(obj["request_id"]);
    const error = Error2(object(obj["error"]));
    return { type: "response_error", requestId, error };
  } else {
    throw new ProtoError("Unexpected type of ServerMsg");
  }
}
function Response2(obj) {
  const type = string(obj["type"]);
  if (type === "open_stream") {
    return { type: "open_stream" };
  } else if (type === "close_stream") {
    return { type: "close_stream" };
  } else if (type === "execute") {
    const result = StmtResult(object(obj["result"]));
    return { type: "execute", result };
  } else if (type === "batch") {
    const result = BatchResult(object(obj["result"]));
    return { type: "batch", result };
  } else if (type === "open_cursor") {
    return { type: "open_cursor" };
  } else if (type === "close_cursor") {
    return { type: "close_cursor" };
  } else if (type === "fetch_cursor") {
    const entries = arrayObjectsMap(obj["entries"], CursorEntry);
    const done = boolean(obj["done"]);
    return { type: "fetch_cursor", entries, done };
  } else if (type === "sequence") {
    return { type: "sequence" };
  } else if (type === "describe") {
    const result = DescribeResult(object(obj["result"]));
    return { type: "describe", result };
  } else if (type === "store_sql") {
    return { type: "store_sql" };
  } else if (type === "close_sql") {
    return { type: "close_sql" };
  } else if (type === "get_autocommit") {
    const isAutocommit = boolean(obj["is_autocommit"]);
    return { type: "get_autocommit", isAutocommit };
  } else {
    throw new ProtoError("Unexpected type of Response");
  }
}
var init_json_decode2 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/ws/json_decode.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_errors();
    init_decode();
    init_json_decode();
    __name(ServerMsg, "ServerMsg");
    __name(Response2, "Response");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/shared/protobuf_decode.js
var Error3, StmtResult2, Col2, Row, BatchResult2, BatchResultStepResult, BatchResultStepError, CursorEntry2, StepBeginEntry, StepEndEntry, StepErrorEntry, DescribeResult2, DescribeParam2, DescribeCol2, Value4;
var init_protobuf_decode = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/shared/protobuf_decode.js"() {
    init_functionsRoutes_0_6398490784585695();
    Error3 = {
      default() {
        return { message: "", code: void 0 };
      },
      1(r, msg) {
        msg.message = r.string();
      },
      2(r, msg) {
        msg.code = r.string();
      }
    };
    StmtResult2 = {
      default() {
        return {
          cols: [],
          rows: [],
          affectedRowCount: 0,
          lastInsertRowid: void 0
        };
      },
      1(r, msg) {
        msg.cols.push(r.message(Col2));
      },
      2(r, msg) {
        msg.rows.push(r.message(Row));
      },
      3(r, msg) {
        msg.affectedRowCount = Number(r.uint64());
      },
      4(r, msg) {
        msg.lastInsertRowid = r.sint64();
      }
    };
    Col2 = {
      default() {
        return { name: void 0, decltype: void 0 };
      },
      1(r, msg) {
        msg.name = r.string();
      },
      2(r, msg) {
        msg.decltype = r.string();
      }
    };
    Row = {
      default() {
        return [];
      },
      1(r, msg) {
        msg.push(r.message(Value4));
      }
    };
    BatchResult2 = {
      default() {
        return { stepResults: /* @__PURE__ */ new Map(), stepErrors: /* @__PURE__ */ new Map() };
      },
      1(r, msg) {
        const [key, value] = r.message(BatchResultStepResult);
        msg.stepResults.set(key, value);
      },
      2(r, msg) {
        const [key, value] = r.message(BatchResultStepError);
        msg.stepErrors.set(key, value);
      }
    };
    BatchResultStepResult = {
      default() {
        return [0, StmtResult2.default()];
      },
      1(r, msg) {
        msg[0] = r.uint32();
      },
      2(r, msg) {
        msg[1] = r.message(StmtResult2);
      }
    };
    BatchResultStepError = {
      default() {
        return [0, Error3.default()];
      },
      1(r, msg) {
        msg[0] = r.uint32();
      },
      2(r, msg) {
        msg[1] = r.message(Error3);
      }
    };
    CursorEntry2 = {
      default() {
        return { type: "none" };
      },
      1(r) {
        return r.message(StepBeginEntry);
      },
      2(r) {
        return r.message(StepEndEntry);
      },
      3(r) {
        return r.message(StepErrorEntry);
      },
      4(r) {
        return { type: "row", row: r.message(Row) };
      },
      5(r) {
        return { type: "error", error: r.message(Error3) };
      }
    };
    StepBeginEntry = {
      default() {
        return { type: "step_begin", step: 0, cols: [] };
      },
      1(r, msg) {
        msg.step = r.uint32();
      },
      2(r, msg) {
        msg.cols.push(r.message(Col2));
      }
    };
    StepEndEntry = {
      default() {
        return {
          type: "step_end",
          affectedRowCount: 0,
          lastInsertRowid: void 0
        };
      },
      1(r, msg) {
        msg.affectedRowCount = r.uint32();
      },
      2(r, msg) {
        msg.lastInsertRowid = r.uint64();
      }
    };
    StepErrorEntry = {
      default() {
        return {
          type: "step_error",
          step: 0,
          error: Error3.default()
        };
      },
      1(r, msg) {
        msg.step = r.uint32();
      },
      2(r, msg) {
        msg.error = r.message(Error3);
      }
    };
    DescribeResult2 = {
      default() {
        return {
          params: [],
          cols: [],
          isExplain: false,
          isReadonly: false
        };
      },
      1(r, msg) {
        msg.params.push(r.message(DescribeParam2));
      },
      2(r, msg) {
        msg.cols.push(r.message(DescribeCol2));
      },
      3(r, msg) {
        msg.isExplain = r.bool();
      },
      4(r, msg) {
        msg.isReadonly = r.bool();
      }
    };
    DescribeParam2 = {
      default() {
        return { name: void 0 };
      },
      1(r, msg) {
        msg.name = r.string();
      }
    };
    DescribeCol2 = {
      default() {
        return { name: "", decltype: void 0 };
      },
      1(r, msg) {
        msg.name = r.string();
      },
      2(r, msg) {
        msg.decltype = r.string();
      }
    };
    Value4 = {
      default() {
        return void 0;
      },
      1(r) {
        return null;
      },
      2(r) {
        return r.sint64();
      },
      3(r) {
        return r.double();
      },
      4(r) {
        return r.string();
      },
      5(r) {
        return r.bytes();
      }
    };
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/ws/protobuf_decode.js
var ServerMsg2, HelloErrorMsg, ResponseErrorMsg, ResponseOkMsg, ExecuteResp, BatchResp, FetchCursorResp, DescribeResp, GetAutocommitResp;
var init_protobuf_decode2 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/ws/protobuf_decode.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_protobuf_decode();
    ServerMsg2 = {
      default() {
        return { type: "none" };
      },
      1(r) {
        return { type: "hello_ok" };
      },
      2(r) {
        return r.message(HelloErrorMsg);
      },
      3(r) {
        return r.message(ResponseOkMsg);
      },
      4(r) {
        return r.message(ResponseErrorMsg);
      }
    };
    HelloErrorMsg = {
      default() {
        return { type: "hello_error", error: Error3.default() };
      },
      1(r, msg) {
        msg.error = r.message(Error3);
      }
    };
    ResponseErrorMsg = {
      default() {
        return { type: "response_error", requestId: 0, error: Error3.default() };
      },
      1(r, msg) {
        msg.requestId = r.int32();
      },
      2(r, msg) {
        msg.error = r.message(Error3);
      }
    };
    ResponseOkMsg = {
      default() {
        return {
          type: "response_ok",
          requestId: 0,
          response: { type: "none" }
        };
      },
      1(r, msg) {
        msg.requestId = r.int32();
      },
      2(r, msg) {
        msg.response = { type: "open_stream" };
      },
      3(r, msg) {
        msg.response = { type: "close_stream" };
      },
      4(r, msg) {
        msg.response = r.message(ExecuteResp);
      },
      5(r, msg) {
        msg.response = r.message(BatchResp);
      },
      6(r, msg) {
        msg.response = { type: "open_cursor" };
      },
      7(r, msg) {
        msg.response = { type: "close_cursor" };
      },
      8(r, msg) {
        msg.response = r.message(FetchCursorResp);
      },
      9(r, msg) {
        msg.response = { type: "sequence" };
      },
      10(r, msg) {
        msg.response = r.message(DescribeResp);
      },
      11(r, msg) {
        msg.response = { type: "store_sql" };
      },
      12(r, msg) {
        msg.response = { type: "close_sql" };
      },
      13(r, msg) {
        msg.response = r.message(GetAutocommitResp);
      }
    };
    ExecuteResp = {
      default() {
        return { type: "execute", result: StmtResult2.default() };
      },
      1(r, msg) {
        msg.result = r.message(StmtResult2);
      }
    };
    BatchResp = {
      default() {
        return { type: "batch", result: BatchResult2.default() };
      },
      1(r, msg) {
        msg.result = r.message(BatchResult2);
      }
    };
    FetchCursorResp = {
      default() {
        return { type: "fetch_cursor", entries: [], done: false };
      },
      1(r, msg) {
        msg.entries.push(r.message(CursorEntry2));
      },
      2(r, msg) {
        msg.done = r.bool();
      }
    };
    DescribeResp = {
      default() {
        return { type: "describe", result: DescribeResult2.default() };
      },
      1(r, msg) {
        msg.result = r.message(DescribeResult2);
      }
    };
    GetAutocommitResp = {
      default() {
        return { type: "get_autocommit", isAutocommit: false };
      },
      1(r, msg) {
        msg.isAutocommit = r.bool();
      }
    };
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/ws/client.js
var subprotocolsV2, subprotocolsV3, WsClient;
var init_client2 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/ws/client.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_client();
    init_encoding();
    init_errors();
    init_id_alloc();
    init_result();
    init_sql();
    init_util3();
    init_stream2();
    init_json_encode2();
    init_protobuf_encode2();
    init_json_decode2();
    init_protobuf_decode2();
    subprotocolsV2 = /* @__PURE__ */ new Map([
      ["hrana2", { version: 2, encoding: "json" }],
      ["hrana1", { version: 1, encoding: "json" }]
    ]);
    subprotocolsV3 = /* @__PURE__ */ new Map([
      ["hrana3-protobuf", { version: 3, encoding: "protobuf" }],
      ["hrana3", { version: 3, encoding: "json" }],
      ["hrana2", { version: 2, encoding: "json" }],
      ["hrana1", { version: 1, encoding: "json" }]
    ]);
    WsClient = class extends Client {
      static {
        __name(this, "WsClient");
      }
      #socket;
      // List of callbacks that we queue until the socket transitions from the CONNECTING to the OPEN state.
      #openCallbacks;
      // Have we already transitioned from CONNECTING to OPEN and fired the callbacks in #openCallbacks?
      #opened;
      // Stores the error that caused us to close the client (and the socket). If we are not closed, this is
      // `undefined`.
      #closed;
      // Have we received a response to our "hello" from the server?
      #recvdHello;
      // Subprotocol negotiated with the server. It is only available after the socket transitions to the OPEN
      // state.
      #subprotocol;
      // Has the `getVersion()` function been called? This is only used to validate that the API is used
      // correctly.
      #getVersionCalled;
      // A map from request id to the responses that we expect to receive from the server.
      #responseMap;
      // An allocator of request ids.
      #requestIdAlloc;
      // An allocator of stream ids.
      /** @private */
      _streamIdAlloc;
      // An allocator of cursor ids.
      /** @private */
      _cursorIdAlloc;
      // An allocator of SQL text ids.
      #sqlIdAlloc;
      /** @private */
      constructor(socket, jwt2) {
        super();
        this.#socket = socket;
        this.#openCallbacks = [];
        this.#opened = false;
        this.#closed = void 0;
        this.#recvdHello = false;
        this.#subprotocol = void 0;
        this.#getVersionCalled = false;
        this.#responseMap = /* @__PURE__ */ new Map();
        this.#requestIdAlloc = new IdAlloc();
        this._streamIdAlloc = new IdAlloc();
        this._cursorIdAlloc = new IdAlloc();
        this.#sqlIdAlloc = new IdAlloc();
        this.#socket.binaryType = "arraybuffer";
        this.#socket.addEventListener("open", () => this.#onSocketOpen());
        this.#socket.addEventListener("close", (event) => this.#onSocketClose(event));
        this.#socket.addEventListener("error", (event) => this.#onSocketError(event));
        this.#socket.addEventListener("message", (event) => this.#onSocketMessage(event));
        this.#send({ type: "hello", jwt: jwt2 });
      }
      // Send (or enqueue to send) a message to the server.
      #send(msg) {
        if (this.#closed !== void 0) {
          throw new InternalError("Trying to send a message on a closed client");
        }
        if (this.#opened) {
          this.#sendToSocket(msg);
        } else {
          const openCallback = /* @__PURE__ */ __name(() => this.#sendToSocket(msg), "openCallback");
          const errorCallback = /* @__PURE__ */ __name(() => void 0, "errorCallback");
          this.#openCallbacks.push({ openCallback, errorCallback });
        }
      }
      // The socket transitioned from CONNECTING to OPEN
      #onSocketOpen() {
        const protocol = this.#socket.protocol;
        if (protocol === void 0) {
          this.#setClosed(new ClientError("The `WebSocket.protocol` property is undefined. This most likely means that the WebSocket implementation provided by the environment is broken. If you are using Miniflare 2, please update to Miniflare 3, which fixes this problem."));
          return;
        } else if (protocol === "") {
          this.#subprotocol = { version: 1, encoding: "json" };
        } else {
          this.#subprotocol = subprotocolsV3.get(protocol);
          if (this.#subprotocol === void 0) {
            this.#setClosed(new ProtoError(`Unrecognized WebSocket subprotocol: ${JSON.stringify(protocol)}`));
            return;
          }
        }
        for (const callbacks of this.#openCallbacks) {
          callbacks.openCallback();
        }
        this.#openCallbacks.length = 0;
        this.#opened = true;
      }
      #sendToSocket(msg) {
        const encoding = this.#subprotocol.encoding;
        if (encoding === "json") {
          const jsonMsg = writeJsonObject(msg, ClientMsg);
          this.#socket.send(jsonMsg);
        } else if (encoding === "protobuf") {
          const protobufMsg = writeProtobufMessage(msg, ClientMsg2);
          this.#socket.send(protobufMsg);
        } else {
          throw impossible(encoding, "Impossible encoding");
        }
      }
      /** Get the protocol version negotiated with the server, possibly waiting until the socket is open. */
      getVersion() {
        return new Promise((versionCallback, errorCallback) => {
          this.#getVersionCalled = true;
          if (this.#closed !== void 0) {
            errorCallback(this.#closed);
          } else if (!this.#opened) {
            const openCallback = /* @__PURE__ */ __name(() => versionCallback(this.#subprotocol.version), "openCallback");
            this.#openCallbacks.push({ openCallback, errorCallback });
          } else {
            versionCallback(this.#subprotocol.version);
          }
        });
      }
      // Make sure that the negotiated version is at least `minVersion`.
      /** @private */
      _ensureVersion(minVersion, feature) {
        if (this.#subprotocol === void 0 || !this.#getVersionCalled) {
          throw new ProtocolVersionError(`${feature} is supported only on protocol version ${minVersion} and higher, but the version supported by the WebSocket server is not yet known. Use Client.getVersion() to wait until the version is available.`);
        } else if (this.#subprotocol.version < minVersion) {
          throw new ProtocolVersionError(`${feature} is supported on protocol version ${minVersion} and higher, but the WebSocket server only supports version ${this.#subprotocol.version}`);
        }
      }
      // Send a request to the server and invoke a callback when we get the response.
      /** @private */
      _sendRequest(request, callbacks) {
        if (this.#closed !== void 0) {
          callbacks.errorCallback(new ClosedError("Client is closed", this.#closed));
          return;
        }
        const requestId = this.#requestIdAlloc.alloc();
        this.#responseMap.set(requestId, { ...callbacks, type: request.type });
        this.#send({ type: "request", requestId, request });
      }
      // The socket encountered an error.
      #onSocketError(event) {
        const eventMessage = event.message;
        const message = eventMessage ?? "WebSocket was closed due to an error";
        this.#setClosed(new WebSocketError(message));
      }
      // The socket was closed.
      #onSocketClose(event) {
        let message = `WebSocket was closed with code ${event.code}`;
        if (event.reason) {
          message += `: ${event.reason}`;
        }
        this.#setClosed(new WebSocketError(message));
      }
      // Close the client with the given error.
      #setClosed(error) {
        if (this.#closed !== void 0) {
          return;
        }
        this.#closed = error;
        for (const callbacks of this.#openCallbacks) {
          callbacks.errorCallback(error);
        }
        this.#openCallbacks.length = 0;
        for (const [requestId, responseState] of this.#responseMap.entries()) {
          responseState.errorCallback(error);
          this.#requestIdAlloc.free(requestId);
        }
        this.#responseMap.clear();
        this.#socket.close();
      }
      // We received a message from the socket.
      #onSocketMessage(event) {
        if (this.#closed !== void 0) {
          return;
        }
        try {
          let msg;
          const encoding = this.#subprotocol.encoding;
          if (encoding === "json") {
            if (typeof event.data !== "string") {
              this.#socket.close(3003, "Only text messages are accepted with JSON encoding");
              this.#setClosed(new ProtoError("Received non-text message from server with JSON encoding"));
              return;
            }
            msg = readJsonObject(JSON.parse(event.data), ServerMsg);
          } else if (encoding === "protobuf") {
            if (!(event.data instanceof ArrayBuffer)) {
              this.#socket.close(3003, "Only binary messages are accepted with Protobuf encoding");
              this.#setClosed(new ProtoError("Received non-binary message from server with Protobuf encoding"));
              return;
            }
            msg = readProtobufMessage(new Uint8Array(event.data), ServerMsg2);
          } else {
            throw impossible(encoding, "Impossible encoding");
          }
          this.#handleMsg(msg);
        } catch (e) {
          this.#socket.close(3007, "Could not handle message");
          this.#setClosed(e);
        }
      }
      // Handle a message from the server.
      #handleMsg(msg) {
        if (msg.type === "none") {
          throw new ProtoError("Received an unrecognized ServerMsg");
        } else if (msg.type === "hello_ok" || msg.type === "hello_error") {
          if (this.#recvdHello) {
            throw new ProtoError("Received a duplicated hello response");
          }
          this.#recvdHello = true;
          if (msg.type === "hello_error") {
            throw errorFromProto(msg.error);
          }
          return;
        } else if (!this.#recvdHello) {
          throw new ProtoError("Received a non-hello message before a hello response");
        }
        if (msg.type === "response_ok") {
          const requestId = msg.requestId;
          const responseState = this.#responseMap.get(requestId);
          this.#responseMap.delete(requestId);
          if (responseState === void 0) {
            throw new ProtoError("Received unexpected OK response");
          }
          this.#requestIdAlloc.free(requestId);
          try {
            if (responseState.type !== msg.response.type) {
              console.dir({ responseState, msg });
              throw new ProtoError("Received unexpected type of response");
            }
            responseState.responseCallback(msg.response);
          } catch (e) {
            responseState.errorCallback(e);
            throw e;
          }
        } else if (msg.type === "response_error") {
          const requestId = msg.requestId;
          const responseState = this.#responseMap.get(requestId);
          this.#responseMap.delete(requestId);
          if (responseState === void 0) {
            throw new ProtoError("Received unexpected error response");
          }
          this.#requestIdAlloc.free(requestId);
          responseState.errorCallback(errorFromProto(msg.error));
        } else {
          throw impossible(msg, "Impossible ServerMsg type");
        }
      }
      /** Open a {@link WsStream}, a stream for executing SQL statements. */
      openStream() {
        return WsStream.open(this);
      }
      /** Cache a SQL text on the server. This requires protocol version 2 or higher. */
      storeSql(sql2) {
        this._ensureVersion(2, "storeSql()");
        const sqlId = this.#sqlIdAlloc.alloc();
        const sqlObj = new Sql(this, sqlId);
        const responseCallback = /* @__PURE__ */ __name(() => void 0, "responseCallback");
        const errorCallback = /* @__PURE__ */ __name((e) => sqlObj._setClosed(e), "errorCallback");
        const request = { type: "store_sql", sqlId, sql: sql2 };
        this._sendRequest(request, { responseCallback, errorCallback });
        return sqlObj;
      }
      /** @private */
      _closeSql(sqlId) {
        if (this.#closed !== void 0) {
          return;
        }
        const responseCallback = /* @__PURE__ */ __name(() => this.#sqlIdAlloc.free(sqlId), "responseCallback");
        const errorCallback = /* @__PURE__ */ __name((e) => this.#setClosed(e), "errorCallback");
        const request = { type: "close_sql", sqlId };
        this._sendRequest(request, { responseCallback, errorCallback });
      }
      /** Close the client and the WebSocket. */
      close() {
        this.#setClosed(new ClientError("Client was manually closed"));
      }
      /** True if the client is closed. */
      get closed() {
        return this.#closed !== void 0;
      }
    };
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/queue_microtask.js
var _queueMicrotask;
var init_queue_microtask = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/queue_microtask.js"() {
    init_functionsRoutes_0_6398490784585695();
    if (typeof queueMicrotask !== "undefined") {
      _queueMicrotask = queueMicrotask;
    } else {
      const resolved = Promise.resolve();
      _queueMicrotask = /* @__PURE__ */ __name((callback) => {
        resolved.then(callback);
      }, "_queueMicrotask");
    }
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/byte_queue.js
var ByteQueue;
var init_byte_queue = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/byte_queue.js"() {
    init_functionsRoutes_0_6398490784585695();
    ByteQueue = class {
      static {
        __name(this, "ByteQueue");
      }
      #array;
      #shiftPos;
      #pushPos;
      constructor(initialCap) {
        this.#array = new Uint8Array(new ArrayBuffer(initialCap));
        this.#shiftPos = 0;
        this.#pushPos = 0;
      }
      get length() {
        return this.#pushPos - this.#shiftPos;
      }
      data() {
        return this.#array.slice(this.#shiftPos, this.#pushPos);
      }
      push(chunk) {
        this.#ensurePush(chunk.byteLength);
        this.#array.set(chunk, this.#pushPos);
        this.#pushPos += chunk.byteLength;
      }
      #ensurePush(pushLength) {
        if (this.#pushPos + pushLength <= this.#array.byteLength) {
          return;
        }
        const filledLength = this.#pushPos - this.#shiftPos;
        if (filledLength + pushLength <= this.#array.byteLength && 2 * this.#pushPos >= this.#array.byteLength) {
          this.#array.copyWithin(0, this.#shiftPos, this.#pushPos);
        } else {
          let newCap = this.#array.byteLength;
          do {
            newCap *= 2;
          } while (filledLength + pushLength > newCap);
          const newArray = new Uint8Array(new ArrayBuffer(newCap));
          newArray.set(this.#array.slice(this.#shiftPos, this.#pushPos), 0);
          this.#array = newArray;
        }
        this.#pushPos = filledLength;
        this.#shiftPos = 0;
      }
      shift(length) {
        this.#shiftPos += length;
      }
    };
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/http/json_decode.js
function PipelineRespBody(obj) {
  const baton = stringOpt(obj["baton"]);
  const baseUrl = stringOpt(obj["base_url"]);
  const results = arrayObjectsMap(obj["results"], StreamResult);
  return { baton, baseUrl, results };
}
function StreamResult(obj) {
  const type = string(obj["type"]);
  if (type === "ok") {
    const response = StreamResponse(object(obj["response"]));
    return { type: "ok", response };
  } else if (type === "error") {
    const error = Error2(object(obj["error"]));
    return { type: "error", error };
  } else {
    throw new ProtoError("Unexpected type of StreamResult");
  }
}
function StreamResponse(obj) {
  const type = string(obj["type"]);
  if (type === "close") {
    return { type: "close" };
  } else if (type === "execute") {
    const result = StmtResult(object(obj["result"]));
    return { type: "execute", result };
  } else if (type === "batch") {
    const result = BatchResult(object(obj["result"]));
    return { type: "batch", result };
  } else if (type === "sequence") {
    return { type: "sequence" };
  } else if (type === "describe") {
    const result = DescribeResult(object(obj["result"]));
    return { type: "describe", result };
  } else if (type === "store_sql") {
    return { type: "store_sql" };
  } else if (type === "close_sql") {
    return { type: "close_sql" };
  } else if (type === "get_autocommit") {
    const isAutocommit = boolean(obj["is_autocommit"]);
    return { type: "get_autocommit", isAutocommit };
  } else {
    throw new ProtoError("Unexpected type of StreamResponse");
  }
}
function CursorRespBody(obj) {
  const baton = stringOpt(obj["baton"]);
  const baseUrl = stringOpt(obj["base_url"]);
  return { baton, baseUrl };
}
var init_json_decode3 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/http/json_decode.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_errors();
    init_decode();
    init_json_decode();
    __name(PipelineRespBody, "PipelineRespBody");
    __name(StreamResult, "StreamResult");
    __name(StreamResponse, "StreamResponse");
    __name(CursorRespBody, "CursorRespBody");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/http/protobuf_decode.js
var PipelineRespBody2, StreamResult2, StreamResponse2, ExecuteStreamResp, BatchStreamResp, DescribeStreamResp, GetAutocommitStreamResp, CursorRespBody2;
var init_protobuf_decode3 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/http/protobuf_decode.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_protobuf_decode();
    PipelineRespBody2 = {
      default() {
        return { baton: void 0, baseUrl: void 0, results: [] };
      },
      1(r, msg) {
        msg.baton = r.string();
      },
      2(r, msg) {
        msg.baseUrl = r.string();
      },
      3(r, msg) {
        msg.results.push(r.message(StreamResult2));
      }
    };
    StreamResult2 = {
      default() {
        return { type: "none" };
      },
      1(r) {
        return { type: "ok", response: r.message(StreamResponse2) };
      },
      2(r) {
        return { type: "error", error: r.message(Error3) };
      }
    };
    StreamResponse2 = {
      default() {
        return { type: "none" };
      },
      1(r) {
        return { type: "close" };
      },
      2(r) {
        return r.message(ExecuteStreamResp);
      },
      3(r) {
        return r.message(BatchStreamResp);
      },
      4(r) {
        return { type: "sequence" };
      },
      5(r) {
        return r.message(DescribeStreamResp);
      },
      6(r) {
        return { type: "store_sql" };
      },
      7(r) {
        return { type: "close_sql" };
      },
      8(r) {
        return r.message(GetAutocommitStreamResp);
      }
    };
    ExecuteStreamResp = {
      default() {
        return { type: "execute", result: StmtResult2.default() };
      },
      1(r, msg) {
        msg.result = r.message(StmtResult2);
      }
    };
    BatchStreamResp = {
      default() {
        return { type: "batch", result: BatchResult2.default() };
      },
      1(r, msg) {
        msg.result = r.message(BatchResult2);
      }
    };
    DescribeStreamResp = {
      default() {
        return { type: "describe", result: DescribeResult2.default() };
      },
      1(r, msg) {
        msg.result = r.message(DescribeResult2);
      }
    };
    GetAutocommitStreamResp = {
      default() {
        return { type: "get_autocommit", isAutocommit: false };
      },
      1(r, msg) {
        msg.isAutocommit = r.bool();
      }
    };
    CursorRespBody2 = {
      default() {
        return { baton: void 0, baseUrl: void 0 };
      },
      1(r, msg) {
        msg.baton = r.string();
      },
      2(r, msg) {
        msg.baseUrl = r.string();
      }
    };
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/http/cursor.js
var HttpCursor;
var init_cursor3 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/http/cursor.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_byte_queue();
    init_cursor();
    init_decode();
    init_decode2();
    init_errors();
    init_util3();
    init_json_decode3();
    init_protobuf_decode3();
    init_json_decode();
    init_protobuf_decode();
    HttpCursor = class extends Cursor {
      static {
        __name(this, "HttpCursor");
      }
      #stream;
      #encoding;
      #reader;
      #queue;
      #closed;
      #done;
      /** @private */
      constructor(stream, encoding) {
        super();
        this.#stream = stream;
        this.#encoding = encoding;
        this.#reader = void 0;
        this.#queue = new ByteQueue(16 * 1024);
        this.#closed = void 0;
        this.#done = false;
      }
      async open(response) {
        if (response.body === null) {
          throw new ProtoError("No response body for cursor request");
        }
        this.#reader = response.body[Symbol.asyncIterator]();
        const respBody = await this.#nextItem(CursorRespBody, CursorRespBody2);
        if (respBody === void 0) {
          throw new ProtoError("Empty response to cursor request");
        }
        return respBody;
      }
      /** Fetch the next entry from the cursor. */
      next() {
        return this.#nextItem(CursorEntry, CursorEntry2);
      }
      /** Close the cursor. */
      close() {
        this._setClosed(new ClientError("Cursor was manually closed"));
      }
      /** @private */
      _setClosed(error) {
        if (this.#closed !== void 0) {
          return;
        }
        this.#closed = error;
        this.#stream._cursorClosed(this);
        if (this.#reader !== void 0) {
          this.#reader.return();
        }
      }
      /** True if the cursor is closed. */
      get closed() {
        return this.#closed !== void 0;
      }
      async #nextItem(jsonFun, protobufDef) {
        for (; ; ) {
          if (this.#done) {
            return void 0;
          } else if (this.#closed !== void 0) {
            throw new ClosedError("Cursor is closed", this.#closed);
          }
          if (this.#encoding === "json") {
            const jsonData = this.#parseItemJson();
            if (jsonData !== void 0) {
              const jsonText = new TextDecoder().decode(jsonData);
              const jsonValue = JSON.parse(jsonText);
              return readJsonObject(jsonValue, jsonFun);
            }
          } else if (this.#encoding === "protobuf") {
            const protobufData = this.#parseItemProtobuf();
            if (protobufData !== void 0) {
              return readProtobufMessage(protobufData, protobufDef);
            }
          } else {
            throw impossible(this.#encoding, "Impossible encoding");
          }
          if (this.#reader === void 0) {
            throw new InternalError("Attempted to read from HTTP cursor before it was opened");
          }
          const { value, done } = await this.#reader.next();
          if (done && this.#queue.length === 0) {
            this.#done = true;
          } else if (done) {
            throw new ProtoError("Unexpected end of cursor stream");
          } else {
            this.#queue.push(value);
          }
        }
      }
      #parseItemJson() {
        const data = this.#queue.data();
        const newlineByte = 10;
        const newlinePos = data.indexOf(newlineByte);
        if (newlinePos < 0) {
          return void 0;
        }
        const jsonData = data.slice(0, newlinePos);
        this.#queue.shift(newlinePos + 1);
        return jsonData;
      }
      #parseItemProtobuf() {
        const data = this.#queue.data();
        let varintValue = 0;
        let varintLength = 0;
        for (; ; ) {
          if (varintLength >= data.byteLength) {
            return void 0;
          }
          const byte = data[varintLength];
          varintValue |= (byte & 127) << 7 * varintLength;
          varintLength += 1;
          if (!(byte & 128)) {
            break;
          }
        }
        if (data.byteLength < varintLength + varintValue) {
          return void 0;
        }
        const protobufData = data.slice(varintLength, varintLength + varintValue);
        this.#queue.shift(varintLength + varintValue);
        return protobufData;
      }
    };
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/http/json_encode.js
function PipelineReqBody(w, msg) {
  if (msg.baton !== void 0) {
    w.string("baton", msg.baton);
  }
  w.arrayObjects("requests", msg.requests, StreamRequest);
}
function StreamRequest(w, msg) {
  w.stringRaw("type", msg.type);
  if (msg.type === "close") {
  } else if (msg.type === "execute") {
    w.object("stmt", msg.stmt, Stmt2);
  } else if (msg.type === "batch") {
    w.object("batch", msg.batch, Batch2);
  } else if (msg.type === "sequence") {
    if (msg.sql !== void 0) {
      w.string("sql", msg.sql);
    }
    if (msg.sqlId !== void 0) {
      w.number("sql_id", msg.sqlId);
    }
  } else if (msg.type === "describe") {
    if (msg.sql !== void 0) {
      w.string("sql", msg.sql);
    }
    if (msg.sqlId !== void 0) {
      w.number("sql_id", msg.sqlId);
    }
  } else if (msg.type === "store_sql") {
    w.number("sql_id", msg.sqlId);
    w.string("sql", msg.sql);
  } else if (msg.type === "close_sql") {
    w.number("sql_id", msg.sqlId);
  } else if (msg.type === "get_autocommit") {
  } else {
    throw impossible(msg, "Impossible type of StreamRequest");
  }
}
function CursorReqBody(w, msg) {
  if (msg.baton !== void 0) {
    w.string("baton", msg.baton);
  }
  w.object("batch", msg.batch, Batch2);
}
var init_json_encode3 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/http/json_encode.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_json_encode();
    init_util3();
    __name(PipelineReqBody, "PipelineReqBody");
    __name(StreamRequest, "StreamRequest");
    __name(CursorReqBody, "CursorReqBody");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/http/protobuf_encode.js
function PipelineReqBody2(w, msg) {
  if (msg.baton !== void 0) {
    w.string(1, msg.baton);
  }
  for (const req of msg.requests) {
    w.message(2, req, StreamRequest2);
  }
}
function StreamRequest2(w, msg) {
  if (msg.type === "close") {
    w.message(1, msg, CloseStreamReq2);
  } else if (msg.type === "execute") {
    w.message(2, msg, ExecuteStreamReq);
  } else if (msg.type === "batch") {
    w.message(3, msg, BatchStreamReq);
  } else if (msg.type === "sequence") {
    w.message(4, msg, SequenceStreamReq);
  } else if (msg.type === "describe") {
    w.message(5, msg, DescribeStreamReq);
  } else if (msg.type === "store_sql") {
    w.message(6, msg, StoreSqlStreamReq);
  } else if (msg.type === "close_sql") {
    w.message(7, msg, CloseSqlStreamReq);
  } else if (msg.type === "get_autocommit") {
    w.message(8, msg, GetAutocommitStreamReq);
  } else {
    throw impossible(msg, "Impossible type of StreamRequest");
  }
}
function CloseStreamReq2(_w, _msg) {
}
function ExecuteStreamReq(w, msg) {
  w.message(1, msg.stmt, Stmt3);
}
function BatchStreamReq(w, msg) {
  w.message(1, msg.batch, Batch3);
}
function SequenceStreamReq(w, msg) {
  if (msg.sql !== void 0) {
    w.string(1, msg.sql);
  }
  if (msg.sqlId !== void 0) {
    w.int32(2, msg.sqlId);
  }
}
function DescribeStreamReq(w, msg) {
  if (msg.sql !== void 0) {
    w.string(1, msg.sql);
  }
  if (msg.sqlId !== void 0) {
    w.int32(2, msg.sqlId);
  }
}
function StoreSqlStreamReq(w, msg) {
  w.int32(1, msg.sqlId);
  w.string(2, msg.sql);
}
function CloseSqlStreamReq(w, msg) {
  w.int32(1, msg.sqlId);
}
function GetAutocommitStreamReq(_w, _msg) {
}
function CursorReqBody2(w, msg) {
  if (msg.baton !== void 0) {
    w.string(1, msg.baton);
  }
  w.message(2, msg.batch, Batch3);
}
var init_protobuf_encode3 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/http/protobuf_encode.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_protobuf_encode();
    init_util3();
    __name(PipelineReqBody2, "PipelineReqBody");
    __name(StreamRequest2, "StreamRequest");
    __name(CloseStreamReq2, "CloseStreamReq");
    __name(ExecuteStreamReq, "ExecuteStreamReq");
    __name(BatchStreamReq, "BatchStreamReq");
    __name(SequenceStreamReq, "SequenceStreamReq");
    __name(DescribeStreamReq, "DescribeStreamReq");
    __name(StoreSqlStreamReq, "StoreSqlStreamReq");
    __name(CloseSqlStreamReq, "CloseSqlStreamReq");
    __name(GetAutocommitStreamReq, "GetAutocommitStreamReq");
    __name(CursorReqBody2, "CursorReqBody");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/http/stream.js
function handlePipelineResponse(pipeline, respBody) {
  if (respBody.results.length !== pipeline.length) {
    throw new ProtoError("Server returned unexpected number of pipeline results");
  }
  for (let i = 0; i < pipeline.length; ++i) {
    const result = respBody.results[i];
    const entry = pipeline[i];
    if (result.type === "ok") {
      if (result.response.type !== entry.request.type) {
        throw new ProtoError("Received unexpected type of response");
      }
      entry.responseCallback(result.response);
    } else if (result.type === "error") {
      entry.errorCallback(errorFromProto(result.error));
    } else if (result.type === "none") {
      throw new ProtoError("Received unrecognized type of StreamResult");
    } else {
      throw impossible(result, "Received impossible type of StreamResult");
    }
  }
}
async function decodePipelineResponse(resp, encoding) {
  if (encoding === "json") {
    const respJson = await resp.json();
    return readJsonObject(respJson, PipelineRespBody);
  }
  if (encoding === "protobuf") {
    const respData = await resp.arrayBuffer();
    return readProtobufMessage(new Uint8Array(respData), PipelineRespBody2);
  }
  await resp.body?.cancel();
  throw impossible(encoding, "Impossible encoding");
}
async function errorFromResponse(resp) {
  const respType = resp.headers.get("content-type") ?? "text/plain";
  let message = `Server returned HTTP status ${resp.status}`;
  if (respType === "application/json") {
    const respBody = await resp.json();
    if ("message" in respBody) {
      return errorFromProto(respBody);
    }
    return new HttpServerError(message, resp.status);
  }
  if (respType === "text/plain") {
    const respBody = (await resp.text()).trim();
    if (respBody !== "") {
      message += `: ${respBody}`;
    }
    return new HttpServerError(message, resp.status);
  }
  await resp.body?.cancel();
  return new HttpServerError(message, resp.status);
}
var HttpStream;
var init_stream3 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/http/stream.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_errors();
    init_encoding();
    init_id_alloc();
    init_queue();
    init_queue_microtask();
    init_result();
    init_sql();
    init_stream();
    init_util3();
    init_cursor3();
    init_json_encode3();
    init_protobuf_encode3();
    init_json_encode3();
    init_protobuf_encode3();
    init_json_decode3();
    init_protobuf_decode3();
    HttpStream = class extends Stream {
      static {
        __name(this, "HttpStream");
      }
      #client;
      #baseUrl;
      #jwt;
      #fetch;
      #remoteEncryptionKey;
      #baton;
      #queue;
      #flushing;
      #cursor;
      #closing;
      #closeQueued;
      #closed;
      #sqlIdAlloc;
      /** @private */
      constructor(client, baseUrl, jwt2, customFetch, remoteEncryptionKey) {
        super(client.intMode);
        this.#client = client;
        this.#baseUrl = baseUrl.toString();
        this.#jwt = jwt2;
        this.#fetch = customFetch;
        this.#remoteEncryptionKey = remoteEncryptionKey;
        this.#baton = void 0;
        this.#queue = new Queue();
        this.#flushing = false;
        this.#closing = false;
        this.#closeQueued = false;
        this.#closed = void 0;
        this.#sqlIdAlloc = new IdAlloc();
      }
      /** Get the {@link HttpClient} object that this stream belongs to. */
      client() {
        return this.#client;
      }
      /** @private */
      _sqlOwner() {
        return this;
      }
      /** Cache a SQL text on the server. */
      storeSql(sql2) {
        const sqlId = this.#sqlIdAlloc.alloc();
        this.#sendStreamRequest({ type: "store_sql", sqlId, sql: sql2 }).then(() => void 0, (error) => this._setClosed(error));
        return new Sql(this, sqlId);
      }
      /** @private */
      _closeSql(sqlId) {
        if (this.#closed !== void 0) {
          return;
        }
        this.#sendStreamRequest({ type: "close_sql", sqlId }).then(() => this.#sqlIdAlloc.free(sqlId), (error) => this._setClosed(error));
      }
      /** @private */
      _execute(stmt) {
        return this.#sendStreamRequest({ type: "execute", stmt }).then((response) => {
          return response.result;
        });
      }
      /** @private */
      _batch(batch) {
        return this.#sendStreamRequest({ type: "batch", batch }).then((response) => {
          return response.result;
        });
      }
      /** @private */
      _describe(protoSql) {
        return this.#sendStreamRequest({
          type: "describe",
          sql: protoSql.sql,
          sqlId: protoSql.sqlId
        }).then((response) => {
          return response.result;
        });
      }
      /** @private */
      _sequence(protoSql) {
        return this.#sendStreamRequest({
          type: "sequence",
          sql: protoSql.sql,
          sqlId: protoSql.sqlId
        }).then((_response) => {
          return void 0;
        });
      }
      /** Check whether the SQL connection underlying this stream is in autocommit state (i.e., outside of an
       * explicit transaction). This requires protocol version 3 or higher.
       */
      getAutocommit() {
        this.#client._ensureVersion(3, "getAutocommit()");
        return this.#sendStreamRequest({
          type: "get_autocommit"
        }).then((response) => {
          return response.isAutocommit;
        });
      }
      #sendStreamRequest(request) {
        return new Promise((responseCallback, errorCallback) => {
          this.#pushToQueue({ type: "pipeline", request, responseCallback, errorCallback });
        });
      }
      /** @private */
      _openCursor(batch) {
        return new Promise((cursorCallback, errorCallback) => {
          this.#pushToQueue({ type: "cursor", batch, cursorCallback, errorCallback });
        });
      }
      /** @private */
      _cursorClosed(cursor) {
        if (cursor !== this.#cursor) {
          throw new InternalError("Cursor was closed, but it was not associated with the stream");
        }
        this.#cursor = void 0;
        _queueMicrotask(() => this.#flushQueue());
      }
      /** Immediately close the stream. */
      close() {
        this._setClosed(new ClientError("Stream was manually closed"));
      }
      /** Gracefully close the stream. */
      closeGracefully() {
        this.#closing = true;
        _queueMicrotask(() => this.#flushQueue());
      }
      /** True if the stream is closed. */
      get closed() {
        return this.#closed !== void 0 || this.#closing;
      }
      /** @private */
      _setClosed(error) {
        if (this.#closed !== void 0) {
          return;
        }
        this.#closed = error;
        if (this.#cursor !== void 0) {
          this.#cursor._setClosed(error);
        }
        this.#client._streamClosed(this);
        for (; ; ) {
          const entry = this.#queue.shift();
          if (entry !== void 0) {
            entry.errorCallback(error);
          } else {
            break;
          }
        }
        if ((this.#baton !== void 0 || this.#flushing) && !this.#closeQueued) {
          this.#queue.push({
            type: "pipeline",
            request: { type: "close" },
            responseCallback: /* @__PURE__ */ __name(() => void 0, "responseCallback"),
            errorCallback: /* @__PURE__ */ __name(() => void 0, "errorCallback")
          });
          this.#closeQueued = true;
          _queueMicrotask(() => this.#flushQueue());
        }
      }
      #pushToQueue(entry) {
        if (this.#closed !== void 0) {
          throw new ClosedError("Stream is closed", this.#closed);
        } else if (this.#closing) {
          throw new ClosedError("Stream is closing", void 0);
        } else {
          this.#queue.push(entry);
          _queueMicrotask(() => this.#flushQueue());
        }
      }
      #flushQueue() {
        if (this.#flushing || this.#cursor !== void 0) {
          return;
        }
        if (this.#closing && this.#queue.length === 0) {
          this._setClosed(new ClientError("Stream was gracefully closed"));
          return;
        }
        const endpoint = this.#client._endpoint;
        if (endpoint === void 0) {
          this.#client._endpointPromise.then(() => this.#flushQueue(), (error) => this._setClosed(error));
          return;
        }
        const firstEntry = this.#queue.shift();
        if (firstEntry === void 0) {
          return;
        } else if (firstEntry.type === "pipeline") {
          const pipeline = [firstEntry];
          for (; ; ) {
            const entry = this.#queue.first();
            if (entry !== void 0 && entry.type === "pipeline") {
              pipeline.push(entry);
              this.#queue.shift();
            } else if (entry === void 0 && this.#closing && !this.#closeQueued) {
              pipeline.push({
                type: "pipeline",
                request: { type: "close" },
                responseCallback: /* @__PURE__ */ __name(() => void 0, "responseCallback"),
                errorCallback: /* @__PURE__ */ __name(() => void 0, "errorCallback")
              });
              this.#closeQueued = true;
              break;
            } else {
              break;
            }
          }
          this.#flushPipeline(endpoint, pipeline);
        } else if (firstEntry.type === "cursor") {
          this.#flushCursor(endpoint, firstEntry);
        } else {
          throw impossible(firstEntry, "Impossible type of QueueEntry");
        }
      }
      #flushPipeline(endpoint, pipeline) {
        this.#flush(() => this.#createPipelineRequest(pipeline, endpoint), (resp) => decodePipelineResponse(resp, endpoint.encoding), (respBody) => respBody.baton, (respBody) => respBody.baseUrl, (respBody) => handlePipelineResponse(pipeline, respBody), (error) => pipeline.forEach((entry) => entry.errorCallback(error)));
      }
      #flushCursor(endpoint, entry) {
        const cursor = new HttpCursor(this, endpoint.encoding);
        this.#cursor = cursor;
        this.#flush(() => this.#createCursorRequest(entry, endpoint), (resp) => cursor.open(resp), (respBody) => respBody.baton, (respBody) => respBody.baseUrl, (_respBody) => entry.cursorCallback(cursor), (error) => entry.errorCallback(error));
      }
      #flush(createRequest, decodeResponse, getBaton, getBaseUrl, handleResponse, handleError) {
        let promise;
        try {
          const request = createRequest();
          const fetch2 = this.#fetch;
          promise = fetch2(request);
        } catch (error) {
          promise = Promise.reject(error);
        }
        this.#flushing = true;
        promise.then((resp) => {
          if (!resp.ok) {
            return errorFromResponse(resp).then((error) => {
              throw error;
            });
          }
          return decodeResponse(resp);
        }).then((r) => {
          this.#baton = getBaton(r);
          this.#baseUrl = getBaseUrl(r) ?? this.#baseUrl;
          handleResponse(r);
        }).catch((error) => {
          this._setClosed(error);
          handleError(error);
        }).finally(() => {
          this.#flushing = false;
          this.#flushQueue();
        });
      }
      #createPipelineRequest(pipeline, endpoint) {
        return this.#createRequest(new URL(endpoint.pipelinePath, this.#baseUrl), {
          baton: this.#baton,
          requests: pipeline.map((entry) => entry.request)
        }, endpoint.encoding, PipelineReqBody, PipelineReqBody2);
      }
      #createCursorRequest(entry, endpoint) {
        if (endpoint.cursorPath === void 0) {
          throw new ProtocolVersionError(`Cursors are supported only on protocol version 3 and higher, but the HTTP server only supports version ${endpoint.version}.`);
        }
        return this.#createRequest(new URL(endpoint.cursorPath, this.#baseUrl), {
          baton: this.#baton,
          batch: entry.batch
        }, endpoint.encoding, CursorReqBody, CursorReqBody2);
      }
      #createRequest(url, reqBody, encoding, jsonFun, protobufFun) {
        let bodyData;
        let contentType;
        if (encoding === "json") {
          bodyData = writeJsonObject(reqBody, jsonFun);
          contentType = "application/json";
        } else if (encoding === "protobuf") {
          bodyData = writeProtobufMessage(reqBody, protobufFun);
          contentType = "application/x-protobuf";
        } else {
          throw impossible(encoding, "Impossible encoding");
        }
        const headers = new Headers();
        headers.set("content-type", contentType);
        if (this.#jwt !== void 0) {
          headers.set("authorization", `Bearer ${this.#jwt}`);
        }
        if (this.#remoteEncryptionKey !== void 0) {
          headers.set("x-turso-encryption-key", this.#remoteEncryptionKey);
        }
        return new Request(url.toString(), { method: "POST", headers, body: bodyData });
      }
    };
    __name(handlePipelineResponse, "handlePipelineResponse");
    __name(decodePipelineResponse, "decodePipelineResponse");
    __name(errorFromResponse, "errorFromResponse");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/http/client.js
async function findEndpoint(customFetch, clientUrl) {
  const fetch2 = customFetch;
  for (const endpoint of checkEndpoints) {
    const url = new URL(endpoint.versionPath, clientUrl);
    const request = new Request(url.toString(), { method: "GET" });
    const response = await fetch2(request);
    await response.arrayBuffer();
    if (response.ok) {
      return endpoint;
    }
  }
  return fallbackEndpoint;
}
var checkEndpoints, fallbackEndpoint, HttpClient;
var init_client3 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/http/client.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_client();
    init_errors();
    init_stream3();
    checkEndpoints = [
      {
        versionPath: "v3-protobuf",
        pipelinePath: "v3-protobuf/pipeline",
        cursorPath: "v3-protobuf/cursor",
        version: 3,
        encoding: "protobuf"
      }
      /*
      {
          versionPath: "v3",
          pipelinePath: "v3/pipeline",
          cursorPath: "v3/cursor",
          version: 3,
          encoding: "json",
      },
      */
    ];
    fallbackEndpoint = {
      versionPath: "v2",
      pipelinePath: "v2/pipeline",
      cursorPath: void 0,
      version: 2,
      encoding: "json"
    };
    HttpClient = class extends Client {
      static {
        __name(this, "HttpClient");
      }
      #url;
      #jwt;
      #fetch;
      #remoteEncryptionKey;
      #closed;
      #streams;
      /** @private */
      _endpointPromise;
      /** @private */
      _endpoint;
      /** @private */
      constructor(url, jwt2, customFetch, remoteEncryptionKey, protocolVersion = 2) {
        super();
        this.#url = url;
        this.#jwt = jwt2;
        this.#fetch = customFetch ?? globalThis.fetch;
        this.#remoteEncryptionKey = remoteEncryptionKey;
        this.#closed = void 0;
        this.#streams = /* @__PURE__ */ new Set();
        if (protocolVersion == 3) {
          this._endpointPromise = findEndpoint(this.#fetch, this.#url);
          this._endpointPromise.then((endpoint) => this._endpoint = endpoint, (error) => this.#setClosed(error));
        } else {
          this._endpointPromise = Promise.resolve(fallbackEndpoint);
          this._endpointPromise.then((endpoint) => this._endpoint = endpoint, (error) => this.#setClosed(error));
        }
      }
      /** Get the protocol version supported by the server. */
      async getVersion() {
        if (this._endpoint !== void 0) {
          return this._endpoint.version;
        }
        return (await this._endpointPromise).version;
      }
      // Make sure that the negotiated version is at least `minVersion`.
      /** @private */
      _ensureVersion(minVersion, feature) {
        if (minVersion <= fallbackEndpoint.version) {
          return;
        } else if (this._endpoint === void 0) {
          throw new ProtocolVersionError(`${feature} is supported only on protocol version ${minVersion} and higher, but the version supported by the HTTP server is not yet known. Use Client.getVersion() to wait until the version is available.`);
        } else if (this._endpoint.version < minVersion) {
          throw new ProtocolVersionError(`${feature} is supported only on protocol version ${minVersion} and higher, but the HTTP server only supports version ${this._endpoint.version}.`);
        }
      }
      /** Open a {@link HttpStream}, a stream for executing SQL statements. */
      openStream() {
        if (this.#closed !== void 0) {
          throw new ClosedError("Client is closed", this.#closed);
        }
        const stream = new HttpStream(this, this.#url, this.#jwt, this.#fetch, this.#remoteEncryptionKey);
        this.#streams.add(stream);
        return stream;
      }
      /** @private */
      _streamClosed(stream) {
        this.#streams.delete(stream);
      }
      /** Close the client and all its streams. */
      close() {
        this.#setClosed(new ClientError("Client was manually closed"));
      }
      /** True if the client is closed. */
      get closed() {
        return this.#closed !== void 0;
      }
      #setClosed(error) {
        if (this.#closed !== void 0) {
          return;
        }
        this.#closed = error;
        for (const stream of Array.from(this.#streams)) {
          stream._setClosed(new ClosedError("Client was closed", error));
        }
      }
    };
    __name(findEndpoint, "findEndpoint");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/libsql_url.js
var init_libsql_url = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/libsql_url.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_errors();
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/index.js
function openWs(url, jwt2, protocolVersion = 2) {
  if (typeof _WebSocket === "undefined") {
    throw new WebSocketUnsupportedError("WebSockets are not supported in this environment");
  }
  var subprotocols = void 0;
  if (protocolVersion == 3) {
    subprotocols = Array.from(subprotocolsV3.keys());
  } else {
    subprotocols = Array.from(subprotocolsV2.keys());
  }
  const socket = new _WebSocket(url, subprotocols);
  return new WsClient(socket, jwt2);
}
function openHttp(url, jwt2, customFetch, remoteEncryptionKey, protocolVersion = 2) {
  return new HttpClient(url instanceof URL ? url : new URL(url), jwt2, customFetch, remoteEncryptionKey, protocolVersion);
}
var init_lib_esm = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/index.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_web();
    init_client2();
    init_errors();
    init_client3();
    init_client2();
    init_web();
    init_client();
    init_errors();
    init_batch();
    init_libsql_url();
    init_sql();
    init_stmt();
    init_stream();
    init_client3();
    init_stream3();
    init_client2();
    init_stream2();
    __name(openWs, "openWs");
    __name(openHttp, "openHttp");
  }
});

// ../node_modules/@libsql/client/lib-esm/hrana.js
async function executeHranaBatch(mode, version3, batch, hranaStmts, disableForeignKeys = false) {
  if (disableForeignKeys) {
    batch.step().run("PRAGMA foreign_keys=off");
  }
  const beginStep = batch.step();
  const beginPromise = beginStep.run(transactionModeToBegin(mode));
  let lastStep = beginStep;
  const stmtPromises = hranaStmts.map((hranaStmt) => {
    const stmtStep = batch.step().condition(BatchCond.ok(lastStep));
    if (version3 >= 3) {
      stmtStep.condition(BatchCond.not(BatchCond.isAutocommit(batch)));
    }
    const stmtPromise = stmtStep.query(hranaStmt);
    lastStep = stmtStep;
    return stmtPromise;
  });
  const commitStep = batch.step().condition(BatchCond.ok(lastStep));
  if (version3 >= 3) {
    commitStep.condition(BatchCond.not(BatchCond.isAutocommit(batch)));
  }
  const commitPromise = commitStep.run("COMMIT");
  const rollbackStep = batch.step().condition(BatchCond.not(BatchCond.ok(commitStep)));
  rollbackStep.run("ROLLBACK").catch((_) => void 0);
  if (disableForeignKeys) {
    batch.step().run("PRAGMA foreign_keys=on");
  }
  await batch.execute();
  const resultSets = [];
  await beginPromise;
  for (let i = 0; i < stmtPromises.length; i++) {
    try {
      const hranaRows = await stmtPromises[i];
      if (hranaRows === void 0) {
        throw new LibsqlBatchError("Statement in a batch was not executed, probably because the transaction has been rolled back", i, "TRANSACTION_CLOSED");
      }
      resultSets.push(resultSetFromHrana(hranaRows));
    } catch (e) {
      if (e instanceof LibsqlBatchError) {
        throw e;
      }
      const mappedError = mapHranaError(e);
      if (mappedError instanceof LibsqlError) {
        throw new LibsqlBatchError(mappedError.message, i, mappedError.code, mappedError.extendedCode, mappedError.rawCode, mappedError.cause instanceof Error ? mappedError.cause : void 0);
      }
      throw mappedError;
    }
  }
  await commitPromise;
  return resultSets;
}
function stmtToHrana(stmt) {
  let sql2;
  let args;
  if (Array.isArray(stmt)) {
    [sql2, args] = stmt;
  } else if (typeof stmt === "string") {
    sql2 = stmt;
  } else {
    sql2 = stmt.sql;
    args = stmt.args;
  }
  const hranaStmt = new Stmt(sql2);
  if (args) {
    if (Array.isArray(args)) {
      hranaStmt.bindIndexes(args);
    } else {
      for (const [key, value] of Object.entries(args)) {
        hranaStmt.bindName(key, value);
      }
    }
  }
  return hranaStmt;
}
function resultSetFromHrana(hranaRows) {
  const columns = hranaRows.columnNames.map((c) => c ?? "");
  const columnTypes = hranaRows.columnDecltypes.map((c) => c ?? "");
  const rows = hranaRows.rows;
  const rowsAffected = hranaRows.affectedRowCount;
  const lastInsertRowid = hranaRows.lastInsertRowid !== void 0 ? hranaRows.lastInsertRowid : void 0;
  return new ResultSetImpl(columns, columnTypes, rows, rowsAffected, lastInsertRowid);
}
function mapHranaError(e) {
  if (e instanceof ClientError) {
    const code = mapHranaErrorCode(e);
    return new LibsqlError(e.message, code, void 0, void 0, e);
  }
  return e;
}
function mapHranaErrorCode(e) {
  if (e instanceof ResponseError && e.code !== void 0) {
    return e.code;
  } else if (e instanceof ProtoError) {
    return "HRANA_PROTO_ERROR";
  } else if (e instanceof ClosedError) {
    return e.cause instanceof ClientError ? mapHranaErrorCode(e.cause) : "HRANA_CLOSED_ERROR";
  } else if (e instanceof WebSocketError) {
    return "HRANA_WEBSOCKET_ERROR";
  } else if (e instanceof HttpServerError) {
    return "SERVER_ERROR";
  } else if (e instanceof ProtocolVersionError) {
    return "PROTOCOL_VERSION_ERROR";
  } else if (e instanceof InternalError) {
    return "INTERNAL_ERROR";
  } else {
    return "UNKNOWN";
  }
}
var HranaTransaction;
var init_hrana = __esm({
  "../node_modules/@libsql/client/lib-esm/hrana.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_lib_esm();
    init_api();
    init_util();
    HranaTransaction = class {
      static {
        __name(this, "HranaTransaction");
      }
      #mode;
      #version;
      // Promise that is resolved when the BEGIN statement completes, or `undefined` if we haven't executed the
      // BEGIN statement yet.
      #started;
      /** @private */
      constructor(mode, version3) {
        this.#mode = mode;
        this.#version = version3;
        this.#started = void 0;
      }
      execute(stmt) {
        return this.batch([stmt]).then((results) => results[0]);
      }
      async batch(stmts) {
        const stream = this._getStream();
        if (stream.closed) {
          throw new LibsqlError("Cannot execute statements because the transaction is closed", "TRANSACTION_CLOSED");
        }
        try {
          const hranaStmts = stmts.map(stmtToHrana);
          let rowsPromises;
          if (this.#started === void 0) {
            this._getSqlCache().apply(hranaStmts);
            const batch = stream.batch(this.#version >= 3);
            const beginStep = batch.step();
            const beginPromise = beginStep.run(transactionModeToBegin(this.#mode));
            let lastStep = beginStep;
            rowsPromises = hranaStmts.map((hranaStmt) => {
              const stmtStep = batch.step().condition(BatchCond.ok(lastStep));
              if (this.#version >= 3) {
                stmtStep.condition(BatchCond.not(BatchCond.isAutocommit(batch)));
              }
              const rowsPromise = stmtStep.query(hranaStmt);
              rowsPromise.catch(() => void 0);
              lastStep = stmtStep;
              return rowsPromise;
            });
            this.#started = batch.execute().then(() => beginPromise).then(() => void 0);
            try {
              await this.#started;
            } catch (e) {
              this.close();
              throw e;
            }
          } else {
            if (this.#version < 3) {
              await this.#started;
            } else {
            }
            this._getSqlCache().apply(hranaStmts);
            const batch = stream.batch(this.#version >= 3);
            let lastStep = void 0;
            rowsPromises = hranaStmts.map((hranaStmt) => {
              const stmtStep = batch.step();
              if (lastStep !== void 0) {
                stmtStep.condition(BatchCond.ok(lastStep));
              }
              if (this.#version >= 3) {
                stmtStep.condition(BatchCond.not(BatchCond.isAutocommit(batch)));
              }
              const rowsPromise = stmtStep.query(hranaStmt);
              rowsPromise.catch(() => void 0);
              lastStep = stmtStep;
              return rowsPromise;
            });
            await batch.execute();
          }
          const resultSets = [];
          for (let i = 0; i < rowsPromises.length; i++) {
            try {
              const rows = await rowsPromises[i];
              if (rows === void 0) {
                throw new LibsqlBatchError("Statement in a transaction was not executed, probably because the transaction has been rolled back", i, "TRANSACTION_CLOSED");
              }
              resultSets.push(resultSetFromHrana(rows));
            } catch (e) {
              if (e instanceof LibsqlBatchError) {
                throw e;
              }
              const mappedError = mapHranaError(e);
              if (mappedError instanceof LibsqlError) {
                throw new LibsqlBatchError(mappedError.message, i, mappedError.code, mappedError.extendedCode, mappedError.rawCode, mappedError.cause instanceof Error ? mappedError.cause : void 0);
              }
              throw mappedError;
            }
          }
          return resultSets;
        } catch (e) {
          throw mapHranaError(e);
        }
      }
      async executeMultiple(sql2) {
        const stream = this._getStream();
        if (stream.closed) {
          throw new LibsqlError("Cannot execute statements because the transaction is closed", "TRANSACTION_CLOSED");
        }
        try {
          if (this.#started === void 0) {
            this.#started = stream.run(transactionModeToBegin(this.#mode)).then(() => void 0);
            try {
              await this.#started;
            } catch (e) {
              this.close();
              throw e;
            }
          } else {
            await this.#started;
          }
          await stream.sequence(sql2);
        } catch (e) {
          throw mapHranaError(e);
        }
      }
      async rollback() {
        try {
          const stream = this._getStream();
          if (stream.closed) {
            return;
          }
          if (this.#started !== void 0) {
          } else {
            return;
          }
          const promise = stream.run("ROLLBACK").catch((e) => {
            throw mapHranaError(e);
          });
          stream.closeGracefully();
          await promise;
        } catch (e) {
          throw mapHranaError(e);
        } finally {
          this.close();
        }
      }
      async commit() {
        try {
          const stream = this._getStream();
          if (stream.closed) {
            throw new LibsqlError("Cannot commit the transaction because it is already closed", "TRANSACTION_CLOSED");
          }
          if (this.#started !== void 0) {
            await this.#started;
          } else {
            return;
          }
          const promise = stream.run("COMMIT").catch((e) => {
            throw mapHranaError(e);
          });
          stream.closeGracefully();
          await promise;
        } catch (e) {
          throw mapHranaError(e);
        } finally {
          this.close();
        }
      }
    };
    __name(executeHranaBatch, "executeHranaBatch");
    __name(stmtToHrana, "stmtToHrana");
    __name(resultSetFromHrana, "resultSetFromHrana");
    __name(mapHranaError, "mapHranaError");
    __name(mapHranaErrorCode, "mapHranaErrorCode");
  }
});

// ../node_modules/@libsql/client/lib-esm/sql_cache.js
var SqlCache, Lru;
var init_sql_cache = __esm({
  "../node_modules/@libsql/client/lib-esm/sql_cache.js"() {
    init_functionsRoutes_0_6398490784585695();
    SqlCache = class {
      static {
        __name(this, "SqlCache");
      }
      #owner;
      #sqls;
      capacity;
      constructor(owner, capacity) {
        this.#owner = owner;
        this.#sqls = new Lru();
        this.capacity = capacity;
      }
      // Replaces SQL strings with cached `hrana.Sql` objects in the statements in `hranaStmts`. After this
      // function returns, we guarantee that all `hranaStmts` refer to valid (not closed) `hrana.Sql` objects,
      // but _we may invalidate any other `hrana.Sql` objects_ (by closing them, thus removing them from the
      // server).
      //
      // In practice, this means that after calling this function, you can use the statements only up to the
      // first `await`, because concurrent code may also use the cache and invalidate those statements.
      apply(hranaStmts) {
        if (this.capacity <= 0) {
          return;
        }
        const usedSqlObjs = /* @__PURE__ */ new Set();
        for (const hranaStmt of hranaStmts) {
          if (typeof hranaStmt.sql !== "string") {
            continue;
          }
          const sqlText = hranaStmt.sql;
          if (sqlText.length >= 5e3) {
            continue;
          }
          let sqlObj = this.#sqls.get(sqlText);
          if (sqlObj === void 0) {
            while (this.#sqls.size + 1 > this.capacity) {
              const [evictSqlText, evictSqlObj] = this.#sqls.peekLru();
              if (usedSqlObjs.has(evictSqlObj)) {
                break;
              }
              evictSqlObj.close();
              this.#sqls.delete(evictSqlText);
            }
            if (this.#sqls.size + 1 <= this.capacity) {
              sqlObj = this.#owner.storeSql(sqlText);
              this.#sqls.set(sqlText, sqlObj);
            }
          }
          if (sqlObj !== void 0) {
            hranaStmt.sql = sqlObj;
            usedSqlObjs.add(sqlObj);
          }
        }
      }
    };
    Lru = class {
      static {
        __name(this, "Lru");
      }
      // This maps keys to the cache values. The entries are ordered by their last use (entires that were used
      // most recently are at the end).
      #cache;
      constructor() {
        this.#cache = /* @__PURE__ */ new Map();
      }
      get(key) {
        const value = this.#cache.get(key);
        if (value !== void 0) {
          this.#cache.delete(key);
          this.#cache.set(key, value);
        }
        return value;
      }
      set(key, value) {
        this.#cache.set(key, value);
      }
      peekLru() {
        for (const entry of this.#cache.entries()) {
          return entry;
        }
        return void 0;
      }
      delete(key) {
        this.#cache.delete(key);
      }
      get size() {
        return this.#cache.size;
      }
    };
  }
});

// ../node_modules/promise-limit/index.js
var require_promise_limit = __commonJS({
  "../node_modules/promise-limit/index.js"(exports, module) {
    init_functionsRoutes_0_6398490784585695();
    function limiter(count2) {
      var outstanding = 0;
      var jobs = [];
      function remove() {
        outstanding--;
        if (outstanding < count2) {
          dequeue();
        }
      }
      __name(remove, "remove");
      function dequeue() {
        var job = jobs.shift();
        semaphore.queue = jobs.length;
        if (job) {
          run(job.fn).then(job.resolve).catch(job.reject);
        }
      }
      __name(dequeue, "dequeue");
      function queue(fn) {
        return new Promise(function(resolve, reject) {
          jobs.push({ fn, resolve, reject });
          semaphore.queue = jobs.length;
        });
      }
      __name(queue, "queue");
      function run(fn) {
        outstanding++;
        try {
          return Promise.resolve(fn()).then(function(result) {
            remove();
            return result;
          }, function(error) {
            remove();
            throw error;
          });
        } catch (err) {
          remove();
          return Promise.reject(err);
        }
      }
      __name(run, "run");
      var semaphore = /* @__PURE__ */ __name(function(fn) {
        if (outstanding >= count2) {
          return queue(fn);
        } else {
          return run(fn);
        }
      }, "semaphore");
      return semaphore;
    }
    __name(limiter, "limiter");
    function map(items, mapper) {
      var failed = false;
      var limit = this;
      return Promise.all(items.map(function() {
        var args = arguments;
        return limit(function() {
          if (!failed) {
            return mapper.apply(void 0, args).catch(function(e) {
              failed = true;
              throw e;
            });
          }
        });
      }));
    }
    __name(map, "map");
    function addExtras(fn) {
      fn.queue = 0;
      fn.map = map;
      return fn;
    }
    __name(addExtras, "addExtras");
    module.exports = function(count2) {
      if (count2) {
        return addExtras(limiter(count2));
      } else {
        return addExtras(function(fn) {
          return fn();
        });
      }
    };
  }
});

// ../node_modules/@libsql/client/lib-esm/ws.js
function _createClient(config) {
  if (config.scheme !== "wss" && config.scheme !== "ws") {
    throw new LibsqlError(`The WebSocket client supports only "libsql:", "wss:" and "ws:" URLs, got ${JSON.stringify(config.scheme + ":")}. For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
  }
  if (config.encryptionKey !== void 0) {
    throw new LibsqlError("Encryption key is not supported by the remote client.", "ENCRYPTION_KEY_NOT_SUPPORTED");
  }
  if (config.scheme === "ws" && config.tls) {
    throw new LibsqlError(`A "ws:" URL cannot opt into TLS by using ?tls=1`, "URL_INVALID");
  } else if (config.scheme === "wss" && !config.tls) {
    throw new LibsqlError(`A "wss:" URL cannot opt out of TLS by using ?tls=0`, "URL_INVALID");
  }
  const url = encodeBaseUrl(config.scheme, config.authority, config.path);
  let client;
  try {
    client = openWs(url, config.authToken);
  } catch (e) {
    if (e instanceof WebSocketUnsupportedError) {
      const suggestedScheme = config.scheme === "wss" ? "https" : "http";
      const suggestedUrl = encodeBaseUrl(suggestedScheme, config.authority, config.path);
      throw new LibsqlError(`This environment does not support WebSockets, please switch to the HTTP client by using a "${suggestedScheme}:" URL (${JSON.stringify(suggestedUrl)}). For more information, please read ${supportedUrlLink}`, "WEBSOCKETS_NOT_SUPPORTED");
    }
    throw mapHranaError(e);
  }
  return new WsClient2(client, url, config.authToken, config.intMode, config.concurrency);
}
var import_promise_limit, maxConnAgeMillis, sqlCacheCapacity, WsClient2, WsTransaction;
var init_ws = __esm({
  "../node_modules/@libsql/client/lib-esm/ws.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_lib_esm();
    init_api();
    init_config();
    init_hrana();
    init_sql_cache();
    init_uri();
    init_util();
    import_promise_limit = __toESM(require_promise_limit(), 1);
    init_api();
    __name(_createClient, "_createClient");
    maxConnAgeMillis = 60 * 1e3;
    sqlCacheCapacity = 100;
    WsClient2 = class {
      static {
        __name(this, "WsClient");
      }
      #url;
      #authToken;
      #intMode;
      // State of the current connection. The `hrana.WsClient` inside may be closed at any moment due to an
      // asynchronous error.
      #connState;
      // If defined, this is a connection that will be used in the future, once it is ready.
      #futureConnState;
      closed;
      protocol;
      #isSchemaDatabase;
      #promiseLimitFunction;
      /** @private */
      constructor(client, url, authToken, intMode, concurrency) {
        this.#url = url;
        this.#authToken = authToken;
        this.#intMode = intMode;
        this.#connState = this.#openConn(client);
        this.#futureConnState = void 0;
        this.closed = false;
        this.protocol = "ws";
        this.#promiseLimitFunction = (0, import_promise_limit.default)(concurrency);
      }
      async limit(fn) {
        return this.#promiseLimitFunction(fn);
      }
      async execute(stmtOrSql, args) {
        let stmt;
        if (typeof stmtOrSql === "string") {
          stmt = {
            sql: stmtOrSql,
            args: args || []
          };
        } else {
          stmt = stmtOrSql;
        }
        return this.limit(async () => {
          const streamState = await this.#openStream();
          try {
            const hranaStmt = stmtToHrana(stmt);
            streamState.conn.sqlCache.apply([hranaStmt]);
            const hranaRowsPromise = streamState.stream.query(hranaStmt);
            streamState.stream.closeGracefully();
            const hranaRowsResult = await hranaRowsPromise;
            return resultSetFromHrana(hranaRowsResult);
          } catch (e) {
            throw mapHranaError(e);
          } finally {
            this._closeStream(streamState);
          }
        });
      }
      async batch(stmts, mode = "deferred") {
        return this.limit(async () => {
          const streamState = await this.#openStream();
          try {
            const normalizedStmts = stmts.map((stmt) => {
              if (Array.isArray(stmt)) {
                return {
                  sql: stmt[0],
                  args: stmt[1] || []
                };
              }
              return stmt;
            });
            const hranaStmts = normalizedStmts.map(stmtToHrana);
            const version3 = await streamState.conn.client.getVersion();
            streamState.conn.sqlCache.apply(hranaStmts);
            const batch = streamState.stream.batch(version3 >= 3);
            const resultsPromise = executeHranaBatch(mode, version3, batch, hranaStmts);
            const results = await resultsPromise;
            return results;
          } catch (e) {
            throw mapHranaError(e);
          } finally {
            this._closeStream(streamState);
          }
        });
      }
      async migrate(stmts) {
        return this.limit(async () => {
          const streamState = await this.#openStream();
          try {
            const hranaStmts = stmts.map(stmtToHrana);
            const version3 = await streamState.conn.client.getVersion();
            const batch = streamState.stream.batch(version3 >= 3);
            const resultsPromise = executeHranaBatch("deferred", version3, batch, hranaStmts, true);
            const results = await resultsPromise;
            return results;
          } catch (e) {
            throw mapHranaError(e);
          } finally {
            this._closeStream(streamState);
          }
        });
      }
      async transaction(mode = "write") {
        return this.limit(async () => {
          const streamState = await this.#openStream();
          try {
            const version3 = await streamState.conn.client.getVersion();
            return new WsTransaction(this, streamState, mode, version3);
          } catch (e) {
            this._closeStream(streamState);
            throw mapHranaError(e);
          }
        });
      }
      async executeMultiple(sql2) {
        return this.limit(async () => {
          const streamState = await this.#openStream();
          try {
            const promise = streamState.stream.sequence(sql2);
            streamState.stream.closeGracefully();
            await promise;
          } catch (e) {
            throw mapHranaError(e);
          } finally {
            this._closeStream(streamState);
          }
        });
      }
      sync() {
        throw new LibsqlError("sync not supported in ws mode", "SYNC_NOT_SUPPORTED");
      }
      async #openStream() {
        if (this.closed) {
          throw new LibsqlError("The client is closed", "CLIENT_CLOSED");
        }
        const now = /* @__PURE__ */ new Date();
        const ageMillis = now.valueOf() - this.#connState.openTime.valueOf();
        if (ageMillis > maxConnAgeMillis && this.#futureConnState === void 0) {
          const futureConnState = this.#openConn();
          this.#futureConnState = futureConnState;
          futureConnState.client.getVersion().then((_version) => {
            if (this.#connState !== futureConnState) {
              if (this.#connState.streamStates.size === 0) {
                this.#connState.client.close();
              } else {
              }
            }
            this.#connState = futureConnState;
            this.#futureConnState = void 0;
          }, (_e) => {
            this.#futureConnState = void 0;
          });
        }
        if (this.#connState.client.closed) {
          try {
            if (this.#futureConnState !== void 0) {
              this.#connState = this.#futureConnState;
            } else {
              this.#connState = this.#openConn();
            }
          } catch (e) {
            throw mapHranaError(e);
          }
        }
        const connState = this.#connState;
        try {
          if (connState.useSqlCache === void 0) {
            connState.useSqlCache = await connState.client.getVersion() >= 2;
            if (connState.useSqlCache) {
              connState.sqlCache.capacity = sqlCacheCapacity;
            }
          }
          const stream = connState.client.openStream();
          stream.intMode = this.#intMode;
          const streamState = { conn: connState, stream };
          connState.streamStates.add(streamState);
          return streamState;
        } catch (e) {
          throw mapHranaError(e);
        }
      }
      #openConn(client) {
        try {
          client ??= openWs(this.#url, this.#authToken);
          return {
            client,
            useSqlCache: void 0,
            sqlCache: new SqlCache(client, 0),
            openTime: /* @__PURE__ */ new Date(),
            streamStates: /* @__PURE__ */ new Set()
          };
        } catch (e) {
          throw mapHranaError(e);
        }
      }
      async reconnect() {
        try {
          for (const st of Array.from(this.#connState.streamStates)) {
            try {
              st.stream.close();
            } catch {
            }
          }
          this.#connState.client.close();
        } catch {
        }
        if (this.#futureConnState) {
          try {
            this.#futureConnState.client.close();
          } catch {
          }
          this.#futureConnState = void 0;
        }
        const next = this.#openConn();
        const version3 = await next.client.getVersion();
        next.useSqlCache = version3 >= 2;
        if (next.useSqlCache) {
          next.sqlCache.capacity = sqlCacheCapacity;
        }
        this.#connState = next;
        this.closed = false;
      }
      _closeStream(streamState) {
        streamState.stream.close();
        const connState = streamState.conn;
        connState.streamStates.delete(streamState);
        if (connState.streamStates.size === 0 && connState !== this.#connState) {
          connState.client.close();
        }
      }
      close() {
        this.#connState.client.close();
        this.closed = true;
        if (this.#futureConnState) {
          try {
            this.#futureConnState.client.close();
          } catch {
          }
          this.#futureConnState = void 0;
        }
        this.closed = true;
      }
    };
    WsTransaction = class extends HranaTransaction {
      static {
        __name(this, "WsTransaction");
      }
      #client;
      #streamState;
      /** @private */
      constructor(client, state, mode, version3) {
        super(mode, version3);
        this.#client = client;
        this.#streamState = state;
      }
      /** @private */
      _getStream() {
        return this.#streamState.stream;
      }
      /** @private */
      _getSqlCache() {
        return this.#streamState.conn.sqlCache;
      }
      close() {
        this.#client._closeStream(this.#streamState);
      }
      get closed() {
        return this.#streamState.stream.closed;
      }
    };
  }
});

// ../node_modules/@libsql/client/lib-esm/http.js
function _createClient2(config) {
  if (config.scheme !== "https" && config.scheme !== "http") {
    throw new LibsqlError(`The HTTP client supports only "libsql:", "https:" and "http:" URLs, got ${JSON.stringify(config.scheme + ":")}. For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
  }
  if (config.encryptionKey !== void 0) {
    throw new LibsqlError("Encryption key is not supported by the remote client.", "ENCRYPTION_KEY_NOT_SUPPORTED");
  }
  if (config.scheme === "http" && config.tls) {
    throw new LibsqlError(`A "http:" URL cannot opt into TLS by using ?tls=1`, "URL_INVALID");
  } else if (config.scheme === "https" && !config.tls) {
    throw new LibsqlError(`A "https:" URL cannot opt out of TLS by using ?tls=0`, "URL_INVALID");
  }
  const url = encodeBaseUrl(config.scheme, config.authority, config.path);
  return new HttpClient2(url, config.authToken, config.intMode, config.fetch, config.concurrency, config.remoteEncryptionKey);
}
var import_promise_limit2, sqlCacheCapacity2, HttpClient2, HttpTransaction;
var init_http = __esm({
  "../node_modules/@libsql/client/lib-esm/http.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_lib_esm();
    init_api();
    init_config();
    init_hrana();
    init_sql_cache();
    init_uri();
    init_util();
    import_promise_limit2 = __toESM(require_promise_limit(), 1);
    init_api();
    __name(_createClient2, "_createClient");
    sqlCacheCapacity2 = 30;
    HttpClient2 = class {
      static {
        __name(this, "HttpClient");
      }
      #client;
      protocol;
      #url;
      #intMode;
      #customFetch;
      #concurrency;
      #authToken;
      #remoteEncryptionKey;
      #promiseLimitFunction;
      /** @private */
      constructor(url, authToken, intMode, customFetch, concurrency, remoteEncryptionKey) {
        this.#url = url;
        this.#authToken = authToken;
        this.#intMode = intMode;
        this.#customFetch = customFetch;
        this.#concurrency = concurrency;
        this.#remoteEncryptionKey = remoteEncryptionKey;
        this.#client = openHttp(this.#url, this.#authToken, this.#customFetch, remoteEncryptionKey);
        this.#client.intMode = this.#intMode;
        this.protocol = "http";
        this.#promiseLimitFunction = (0, import_promise_limit2.default)(this.#concurrency);
      }
      async limit(fn) {
        return this.#promiseLimitFunction(fn);
      }
      async execute(stmtOrSql, args) {
        let stmt;
        if (typeof stmtOrSql === "string") {
          stmt = {
            sql: stmtOrSql,
            args: args || []
          };
        } else {
          stmt = stmtOrSql;
        }
        return this.limit(async () => {
          try {
            const hranaStmt = stmtToHrana(stmt);
            let rowsPromise;
            const stream = this.#client.openStream();
            try {
              rowsPromise = stream.query(hranaStmt);
            } finally {
              stream.closeGracefully();
            }
            const rowsResult = await rowsPromise;
            return resultSetFromHrana(rowsResult);
          } catch (e) {
            throw mapHranaError(e);
          }
        });
      }
      async batch(stmts, mode = "deferred") {
        return this.limit(async () => {
          try {
            const normalizedStmts = stmts.map((stmt) => {
              if (Array.isArray(stmt)) {
                return {
                  sql: stmt[0],
                  args: stmt[1] || []
                };
              }
              return stmt;
            });
            const hranaStmts = normalizedStmts.map(stmtToHrana);
            const version3 = await this.#client.getVersion();
            let resultsPromise;
            const stream = this.#client.openStream();
            try {
              const sqlCache = new SqlCache(stream, sqlCacheCapacity2);
              sqlCache.apply(hranaStmts);
              const batch = stream.batch(false);
              resultsPromise = executeHranaBatch(mode, version3, batch, hranaStmts);
            } finally {
              stream.closeGracefully();
            }
            const results = await resultsPromise;
            return results;
          } catch (e) {
            throw mapHranaError(e);
          }
        });
      }
      async migrate(stmts) {
        return this.limit(async () => {
          try {
            const hranaStmts = stmts.map(stmtToHrana);
            const version3 = await this.#client.getVersion();
            let resultsPromise;
            const stream = this.#client.openStream();
            try {
              const batch = stream.batch(false);
              resultsPromise = executeHranaBatch("deferred", version3, batch, hranaStmts, true);
            } finally {
              stream.closeGracefully();
            }
            const results = await resultsPromise;
            return results;
          } catch (e) {
            throw mapHranaError(e);
          }
        });
      }
      async transaction(mode = "write") {
        return this.limit(async () => {
          try {
            const version3 = await this.#client.getVersion();
            return new HttpTransaction(this.#client.openStream(), mode, version3);
          } catch (e) {
            throw mapHranaError(e);
          }
        });
      }
      async executeMultiple(sql2) {
        return this.limit(async () => {
          try {
            let promise;
            const stream = this.#client.openStream();
            try {
              promise = stream.sequence(sql2);
            } finally {
              stream.closeGracefully();
            }
            await promise;
          } catch (e) {
            throw mapHranaError(e);
          }
        });
      }
      sync() {
        throw new LibsqlError("sync not supported in http mode", "SYNC_NOT_SUPPORTED");
      }
      close() {
        this.#client.close();
      }
      async reconnect() {
        try {
          if (!this.closed) {
            this.#client.close();
          }
        } finally {
          this.#client = openHttp(this.#url, this.#authToken, this.#customFetch, this.#remoteEncryptionKey);
          this.#client.intMode = this.#intMode;
        }
      }
      get closed() {
        return this.#client.closed;
      }
    };
    HttpTransaction = class extends HranaTransaction {
      static {
        __name(this, "HttpTransaction");
      }
      #stream;
      #sqlCache;
      /** @private */
      constructor(stream, mode, version3) {
        super(mode, version3);
        this.#stream = stream;
        this.#sqlCache = new SqlCache(stream, sqlCacheCapacity2);
      }
      /** @private */
      _getStream() {
        return this.#stream;
      }
      /** @private */
      _getSqlCache() {
        return this.#sqlCache;
      }
      close() {
        this.#stream.close();
      }
      get closed() {
        return this.#stream.closed;
      }
    };
  }
});

// ../node_modules/@libsql/client/lib-esm/web.js
function createClient(config) {
  return _createClient3(expandConfig(config, true));
}
function _createClient3(config) {
  if (config.scheme === "ws" || config.scheme === "wss") {
    return _createClient(config);
  } else if (config.scheme === "http" || config.scheme === "https") {
    return _createClient2(config);
  } else {
    throw new LibsqlError(`The client that uses Web standard APIs supports only "libsql:", "wss:", "ws:", "https:" and "http:" URLs, got ${JSON.stringify(config.scheme + ":")}. For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
  }
}
var init_web2 = __esm({
  "../node_modules/@libsql/client/lib-esm/web.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_api();
    init_config();
    init_util();
    init_ws();
    init_http();
    init_api();
    __name(createClient, "createClient");
    __name(_createClient3, "_createClient");
  }
});

// ../node_modules/drizzle-orm/entity.js
function is(value, type) {
  if (!value || typeof value !== "object") {
    return false;
  }
  if (value instanceof type) {
    return true;
  }
  if (!Object.prototype.hasOwnProperty.call(type, entityKind)) {
    throw new Error(
      `Class "${type.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`
    );
  }
  let cls = Object.getPrototypeOf(value).constructor;
  if (cls) {
    while (cls) {
      if (entityKind in cls && cls[entityKind] === type[entityKind]) {
        return true;
      }
      cls = Object.getPrototypeOf(cls);
    }
  }
  return false;
}
var entityKind;
var init_entity = __esm({
  "../node_modules/drizzle-orm/entity.js"() {
    init_functionsRoutes_0_6398490784585695();
    entityKind = /* @__PURE__ */ Symbol.for("drizzle:entityKind");
    __name(is, "is");
  }
});

// ../node_modules/drizzle-orm/column.js
var Column;
var init_column = __esm({
  "../node_modules/drizzle-orm/column.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    Column = class {
      static {
        __name(this, "Column");
      }
      constructor(table, config) {
        this.table = table;
        this.config = config;
        this.name = config.name;
        this.keyAsName = config.keyAsName;
        this.notNull = config.notNull;
        this.default = config.default;
        this.defaultFn = config.defaultFn;
        this.onUpdateFn = config.onUpdateFn;
        this.hasDefault = config.hasDefault;
        this.primary = config.primaryKey;
        this.isUnique = config.isUnique;
        this.uniqueName = config.uniqueName;
        this.uniqueType = config.uniqueType;
        this.dataType = config.dataType;
        this.columnType = config.columnType;
        this.generated = config.generated;
        this.generatedIdentity = config.generatedIdentity;
      }
      static [entityKind] = "Column";
      name;
      keyAsName;
      primary;
      notNull;
      default;
      defaultFn;
      onUpdateFn;
      hasDefault;
      isUnique;
      uniqueName;
      uniqueType;
      dataType;
      columnType;
      enumValues = void 0;
      generated = void 0;
      generatedIdentity = void 0;
      config;
      mapFromDriverValue(value) {
        return value;
      }
      mapToDriverValue(value) {
        return value;
      }
      // ** @internal */
      shouldDisableInsert() {
        return this.config.generated !== void 0 && this.config.generated.type !== "byDefault";
      }
    };
  }
});

// ../node_modules/drizzle-orm/column-builder.js
var ColumnBuilder;
var init_column_builder = __esm({
  "../node_modules/drizzle-orm/column-builder.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    ColumnBuilder = class {
      static {
        __name(this, "ColumnBuilder");
      }
      static [entityKind] = "ColumnBuilder";
      config;
      constructor(name, dataType, columnType) {
        this.config = {
          name,
          keyAsName: name === "",
          notNull: false,
          default: void 0,
          hasDefault: false,
          primaryKey: false,
          isUnique: false,
          uniqueName: void 0,
          uniqueType: void 0,
          dataType,
          columnType,
          generated: void 0
        };
      }
      /**
       * Changes the data type of the column. Commonly used with `json` columns. Also, useful for branded types.
       *
       * @example
       * ```ts
       * const users = pgTable('users', {
       * 	id: integer('id').$type<UserId>().primaryKey(),
       * 	details: json('details').$type<UserDetails>().notNull(),
       * });
       * ```
       */
      $type() {
        return this;
      }
      /**
       * Adds a `not null` clause to the column definition.
       *
       * Affects the `select` model of the table - columns *without* `not null` will be nullable on select.
       */
      notNull() {
        this.config.notNull = true;
        return this;
      }
      /**
       * Adds a `default <value>` clause to the column definition.
       *
       * Affects the `insert` model of the table - columns *with* `default` are optional on insert.
       *
       * If you need to set a dynamic default value, use {@link $defaultFn} instead.
       */
      default(value) {
        this.config.default = value;
        this.config.hasDefault = true;
        return this;
      }
      /**
       * Adds a dynamic default value to the column.
       * The function will be called when the row is inserted, and the returned value will be used as the column value.
       *
       * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
       */
      $defaultFn(fn) {
        this.config.defaultFn = fn;
        this.config.hasDefault = true;
        return this;
      }
      /**
       * Alias for {@link $defaultFn}.
       */
      $default = this.$defaultFn;
      /**
       * Adds a dynamic update value to the column.
       * The function will be called when the row is updated, and the returned value will be used as the column value if none is provided.
       * If no `default` (or `$defaultFn`) value is provided, the function will be called when the row is inserted as well, and the returned value will be used as the column value.
       *
       * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
       */
      $onUpdateFn(fn) {
        this.config.onUpdateFn = fn;
        this.config.hasDefault = true;
        return this;
      }
      /**
       * Alias for {@link $onUpdateFn}.
       */
      $onUpdate = this.$onUpdateFn;
      /**
       * Adds a `primary key` clause to the column definition. This implicitly makes the column `not null`.
       *
       * In SQLite, `integer primary key` implicitly makes the column auto-incrementing.
       */
      primaryKey() {
        this.config.primaryKey = true;
        this.config.notNull = true;
        return this;
      }
      /** @internal Sets the name of the column to the key within the table definition if a name was not given. */
      setName(name) {
        if (this.config.name !== "") return;
        this.config.name = name;
      }
    };
  }
});

// ../node_modules/drizzle-orm/table.utils.js
var TableName;
var init_table_utils = __esm({
  "../node_modules/drizzle-orm/table.utils.js"() {
    init_functionsRoutes_0_6398490784585695();
    TableName = /* @__PURE__ */ Symbol.for("drizzle:Name");
  }
});

// ../node_modules/drizzle-orm/pg-core/foreign-keys.js
var ForeignKeyBuilder, ForeignKey;
var init_foreign_keys = __esm({
  "../node_modules/drizzle-orm/pg-core/foreign-keys.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_table_utils();
    ForeignKeyBuilder = class {
      static {
        __name(this, "ForeignKeyBuilder");
      }
      static [entityKind] = "PgForeignKeyBuilder";
      /** @internal */
      reference;
      /** @internal */
      _onUpdate = "no action";
      /** @internal */
      _onDelete = "no action";
      constructor(config, actions) {
        this.reference = () => {
          const { name, columns, foreignColumns } = config();
          return { name, columns, foreignTable: foreignColumns[0].table, foreignColumns };
        };
        if (actions) {
          this._onUpdate = actions.onUpdate;
          this._onDelete = actions.onDelete;
        }
      }
      onUpdate(action) {
        this._onUpdate = action === void 0 ? "no action" : action;
        return this;
      }
      onDelete(action) {
        this._onDelete = action === void 0 ? "no action" : action;
        return this;
      }
      /** @internal */
      build(table) {
        return new ForeignKey(table, this);
      }
    };
    ForeignKey = class {
      static {
        __name(this, "ForeignKey");
      }
      constructor(table, builder) {
        this.table = table;
        this.reference = builder.reference;
        this.onUpdate = builder._onUpdate;
        this.onDelete = builder._onDelete;
      }
      static [entityKind] = "PgForeignKey";
      reference;
      onUpdate;
      onDelete;
      getName() {
        const { name, columns, foreignColumns } = this.reference();
        const columnNames = columns.map((column) => column.name);
        const foreignColumnNames = foreignColumns.map((column) => column.name);
        const chunks = [
          this.table[TableName],
          ...columnNames,
          foreignColumns[0].table[TableName],
          ...foreignColumnNames
        ];
        return name ?? `${chunks.join("_")}_fk`;
      }
    };
  }
});

// ../node_modules/drizzle-orm/tracing-utils.js
function iife(fn, ...args) {
  return fn(...args);
}
var init_tracing_utils = __esm({
  "../node_modules/drizzle-orm/tracing-utils.js"() {
    init_functionsRoutes_0_6398490784585695();
    __name(iife, "iife");
  }
});

// ../node_modules/drizzle-orm/pg-core/unique-constraint.js
function uniqueKeyName(table, columns) {
  return `${table[TableName]}_${columns.join("_")}_unique`;
}
var UniqueConstraintBuilder, UniqueOnConstraintBuilder, UniqueConstraint;
var init_unique_constraint = __esm({
  "../node_modules/drizzle-orm/pg-core/unique-constraint.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_table_utils();
    __name(uniqueKeyName, "uniqueKeyName");
    UniqueConstraintBuilder = class {
      static {
        __name(this, "UniqueConstraintBuilder");
      }
      constructor(columns, name) {
        this.name = name;
        this.columns = columns;
      }
      static [entityKind] = "PgUniqueConstraintBuilder";
      /** @internal */
      columns;
      /** @internal */
      nullsNotDistinctConfig = false;
      nullsNotDistinct() {
        this.nullsNotDistinctConfig = true;
        return this;
      }
      /** @internal */
      build(table) {
        return new UniqueConstraint(table, this.columns, this.nullsNotDistinctConfig, this.name);
      }
    };
    UniqueOnConstraintBuilder = class {
      static {
        __name(this, "UniqueOnConstraintBuilder");
      }
      static [entityKind] = "PgUniqueOnConstraintBuilder";
      /** @internal */
      name;
      constructor(name) {
        this.name = name;
      }
      on(...columns) {
        return new UniqueConstraintBuilder(columns, this.name);
      }
    };
    UniqueConstraint = class {
      static {
        __name(this, "UniqueConstraint");
      }
      constructor(table, columns, nullsNotDistinct, name) {
        this.table = table;
        this.columns = columns;
        this.name = name ?? uniqueKeyName(this.table, this.columns.map((column) => column.name));
        this.nullsNotDistinct = nullsNotDistinct;
      }
      static [entityKind] = "PgUniqueConstraint";
      columns;
      name;
      nullsNotDistinct = false;
      getName() {
        return this.name;
      }
    };
  }
});

// ../node_modules/drizzle-orm/pg-core/utils/array.js
function parsePgArrayValue(arrayString, startFrom, inQuotes) {
  for (let i = startFrom; i < arrayString.length; i++) {
    const char = arrayString[i];
    if (char === "\\") {
      i++;
      continue;
    }
    if (char === '"') {
      return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i + 1];
    }
    if (inQuotes) {
      continue;
    }
    if (char === "," || char === "}") {
      return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i];
    }
  }
  return [arrayString.slice(startFrom).replace(/\\/g, ""), arrayString.length];
}
function parsePgNestedArray(arrayString, startFrom = 0) {
  const result = [];
  let i = startFrom;
  let lastCharIsComma = false;
  while (i < arrayString.length) {
    const char = arrayString[i];
    if (char === ",") {
      if (lastCharIsComma || i === startFrom) {
        result.push("");
      }
      lastCharIsComma = true;
      i++;
      continue;
    }
    lastCharIsComma = false;
    if (char === "\\") {
      i += 2;
      continue;
    }
    if (char === '"') {
      const [value2, startFrom2] = parsePgArrayValue(arrayString, i + 1, true);
      result.push(value2);
      i = startFrom2;
      continue;
    }
    if (char === "}") {
      return [result, i + 1];
    }
    if (char === "{") {
      const [value2, startFrom2] = parsePgNestedArray(arrayString, i + 1);
      result.push(value2);
      i = startFrom2;
      continue;
    }
    const [value, newStartFrom] = parsePgArrayValue(arrayString, i, false);
    result.push(value);
    i = newStartFrom;
  }
  return [result, i];
}
function parsePgArray(arrayString) {
  const [result] = parsePgNestedArray(arrayString, 1);
  return result;
}
function makePgArray(array2) {
  return `{${array2.map((item) => {
    if (Array.isArray(item)) {
      return makePgArray(item);
    }
    if (typeof item === "string") {
      return `"${item.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    }
    return `${item}`;
  }).join(",")}}`;
}
var init_array = __esm({
  "../node_modules/drizzle-orm/pg-core/utils/array.js"() {
    init_functionsRoutes_0_6398490784585695();
    __name(parsePgArrayValue, "parsePgArrayValue");
    __name(parsePgNestedArray, "parsePgNestedArray");
    __name(parsePgArray, "parsePgArray");
    __name(makePgArray, "makePgArray");
  }
});

// ../node_modules/drizzle-orm/pg-core/columns/common.js
var PgColumnBuilder, PgColumn, ExtraConfigColumn, IndexedColumn, PgArrayBuilder, PgArray;
var init_common = __esm({
  "../node_modules/drizzle-orm/pg-core/columns/common.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_column_builder();
    init_column();
    init_entity();
    init_foreign_keys();
    init_tracing_utils();
    init_unique_constraint();
    init_array();
    PgColumnBuilder = class extends ColumnBuilder {
      static {
        __name(this, "PgColumnBuilder");
      }
      foreignKeyConfigs = [];
      static [entityKind] = "PgColumnBuilder";
      array(size) {
        return new PgArrayBuilder(this.config.name, this, size);
      }
      references(ref, actions = {}) {
        this.foreignKeyConfigs.push({ ref, actions });
        return this;
      }
      unique(name, config) {
        this.config.isUnique = true;
        this.config.uniqueName = name;
        this.config.uniqueType = config?.nulls;
        return this;
      }
      generatedAlwaysAs(as) {
        this.config.generated = {
          as,
          type: "always",
          mode: "stored"
        };
        return this;
      }
      /** @internal */
      buildForeignKeys(column, table) {
        return this.foreignKeyConfigs.map(({ ref, actions }) => {
          return iife(
            (ref2, actions2) => {
              const builder = new ForeignKeyBuilder(() => {
                const foreignColumn = ref2();
                return { columns: [column], foreignColumns: [foreignColumn] };
              });
              if (actions2.onUpdate) {
                builder.onUpdate(actions2.onUpdate);
              }
              if (actions2.onDelete) {
                builder.onDelete(actions2.onDelete);
              }
              return builder.build(table);
            },
            ref,
            actions
          );
        });
      }
      /** @internal */
      buildExtraConfigColumn(table) {
        return new ExtraConfigColumn(table, this.config);
      }
    };
    PgColumn = class extends Column {
      static {
        __name(this, "PgColumn");
      }
      constructor(table, config) {
        if (!config.uniqueName) {
          config.uniqueName = uniqueKeyName(table, [config.name]);
        }
        super(table, config);
        this.table = table;
      }
      static [entityKind] = "PgColumn";
    };
    ExtraConfigColumn = class extends PgColumn {
      static {
        __name(this, "ExtraConfigColumn");
      }
      static [entityKind] = "ExtraConfigColumn";
      getSQLType() {
        return this.getSQLType();
      }
      indexConfig = {
        order: this.config.order ?? "asc",
        nulls: this.config.nulls ?? "last",
        opClass: this.config.opClass
      };
      defaultConfig = {
        order: "asc",
        nulls: "last",
        opClass: void 0
      };
      asc() {
        this.indexConfig.order = "asc";
        return this;
      }
      desc() {
        this.indexConfig.order = "desc";
        return this;
      }
      nullsFirst() {
        this.indexConfig.nulls = "first";
        return this;
      }
      nullsLast() {
        this.indexConfig.nulls = "last";
        return this;
      }
      /**
       * ### PostgreSQL documentation quote
       *
       * > An operator class with optional parameters can be specified for each column of an index.
       * The operator class identifies the operators to be used by the index for that column.
       * For example, a B-tree index on four-byte integers would use the int4_ops class;
       * this operator class includes comparison functions for four-byte integers.
       * In practice the default operator class for the column's data type is usually sufficient.
       * The main point of having operator classes is that for some data types, there could be more than one meaningful ordering.
       * For example, we might want to sort a complex-number data type either by absolute value or by real part.
       * We could do this by defining two operator classes for the data type and then selecting the proper class when creating an index.
       * More information about operator classes check:
       *
       * ### Useful links
       * https://www.postgresql.org/docs/current/sql-createindex.html
       *
       * https://www.postgresql.org/docs/current/indexes-opclass.html
       *
       * https://www.postgresql.org/docs/current/xindex.html
       *
       * ### Additional types
       * If you have the `pg_vector` extension installed in your database, you can use the
       * `vector_l2_ops`, `vector_ip_ops`, `vector_cosine_ops`, `vector_l1_ops`, `bit_hamming_ops`, `bit_jaccard_ops`, `halfvec_l2_ops`, `sparsevec_l2_ops` options, which are predefined types.
       *
       * **You can always specify any string you want in the operator class, in case Drizzle doesn't have it natively in its types**
       *
       * @param opClass
       * @returns
       */
      op(opClass) {
        this.indexConfig.opClass = opClass;
        return this;
      }
    };
    IndexedColumn = class {
      static {
        __name(this, "IndexedColumn");
      }
      static [entityKind] = "IndexedColumn";
      constructor(name, keyAsName, type, indexConfig) {
        this.name = name;
        this.keyAsName = keyAsName;
        this.type = type;
        this.indexConfig = indexConfig;
      }
      name;
      keyAsName;
      type;
      indexConfig;
    };
    PgArrayBuilder = class extends PgColumnBuilder {
      static {
        __name(this, "PgArrayBuilder");
      }
      static [entityKind] = "PgArrayBuilder";
      constructor(name, baseBuilder, size) {
        super(name, "array", "PgArray");
        this.config.baseBuilder = baseBuilder;
        this.config.size = size;
      }
      /** @internal */
      build(table) {
        const baseColumn = this.config.baseBuilder.build(table);
        return new PgArray(
          table,
          this.config,
          baseColumn
        );
      }
    };
    PgArray = class _PgArray extends PgColumn {
      static {
        __name(this, "PgArray");
      }
      constructor(table, config, baseColumn, range) {
        super(table, config);
        this.baseColumn = baseColumn;
        this.range = range;
        this.size = config.size;
      }
      size;
      static [entityKind] = "PgArray";
      getSQLType() {
        return `${this.baseColumn.getSQLType()}[${typeof this.size === "number" ? this.size : ""}]`;
      }
      mapFromDriverValue(value) {
        if (typeof value === "string") {
          value = parsePgArray(value);
        }
        return value.map((v) => this.baseColumn.mapFromDriverValue(v));
      }
      mapToDriverValue(value, isNestedArray = false) {
        const a = value.map(
          (v) => v === null ? null : is(this.baseColumn, _PgArray) ? this.baseColumn.mapToDriverValue(v, true) : this.baseColumn.mapToDriverValue(v)
        );
        if (isNestedArray) return a;
        return makePgArray(a);
      }
    };
  }
});

// ../node_modules/drizzle-orm/pg-core/columns/enum.js
function isPgEnum(obj) {
  return !!obj && typeof obj === "function" && isPgEnumSym in obj && obj[isPgEnumSym] === true;
}
var PgEnumObjectColumnBuilder, PgEnumObjectColumn, isPgEnumSym, PgEnumColumnBuilder, PgEnumColumn;
var init_enum = __esm({
  "../node_modules/drizzle-orm/pg-core/columns/enum.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_common();
    PgEnumObjectColumnBuilder = class extends PgColumnBuilder {
      static {
        __name(this, "PgEnumObjectColumnBuilder");
      }
      static [entityKind] = "PgEnumObjectColumnBuilder";
      constructor(name, enumInstance) {
        super(name, "string", "PgEnumObjectColumn");
        this.config.enum = enumInstance;
      }
      /** @internal */
      build(table) {
        return new PgEnumObjectColumn(
          table,
          this.config
        );
      }
    };
    PgEnumObjectColumn = class extends PgColumn {
      static {
        __name(this, "PgEnumObjectColumn");
      }
      static [entityKind] = "PgEnumObjectColumn";
      enum;
      enumValues = this.config.enum.enumValues;
      constructor(table, config) {
        super(table, config);
        this.enum = config.enum;
      }
      getSQLType() {
        return this.enum.enumName;
      }
    };
    isPgEnumSym = /* @__PURE__ */ Symbol.for("drizzle:isPgEnum");
    __name(isPgEnum, "isPgEnum");
    PgEnumColumnBuilder = class extends PgColumnBuilder {
      static {
        __name(this, "PgEnumColumnBuilder");
      }
      static [entityKind] = "PgEnumColumnBuilder";
      constructor(name, enumInstance) {
        super(name, "string", "PgEnumColumn");
        this.config.enum = enumInstance;
      }
      /** @internal */
      build(table) {
        return new PgEnumColumn(
          table,
          this.config
        );
      }
    };
    PgEnumColumn = class extends PgColumn {
      static {
        __name(this, "PgEnumColumn");
      }
      static [entityKind] = "PgEnumColumn";
      enum = this.config.enum;
      enumValues = this.config.enum.enumValues;
      constructor(table, config) {
        super(table, config);
        this.enum = config.enum;
      }
      getSQLType() {
        return this.enum.enumName;
      }
    };
  }
});

// ../node_modules/drizzle-orm/subquery.js
var Subquery, WithSubquery;
var init_subquery = __esm({
  "../node_modules/drizzle-orm/subquery.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    Subquery = class {
      static {
        __name(this, "Subquery");
      }
      static [entityKind] = "Subquery";
      constructor(sql2, fields, alias, isWith = false, usedTables = []) {
        this._ = {
          brand: "Subquery",
          sql: sql2,
          selectedFields: fields,
          alias,
          isWith,
          usedTables
        };
      }
      // getSQL(): SQL<unknown> {
      // 	return new SQL([this]);
      // }
    };
    WithSubquery = class extends Subquery {
      static {
        __name(this, "WithSubquery");
      }
      static [entityKind] = "WithSubquery";
    };
  }
});

// ../node_modules/drizzle-orm/version.js
var version2;
var init_version = __esm({
  "../node_modules/drizzle-orm/version.js"() {
    init_functionsRoutes_0_6398490784585695();
    version2 = "0.45.2";
  }
});

// ../node_modules/drizzle-orm/tracing.js
var otel, rawTracer, tracer;
var init_tracing = __esm({
  "../node_modules/drizzle-orm/tracing.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_tracing_utils();
    init_version();
    tracer = {
      startActiveSpan(name, fn) {
        if (!otel) {
          return fn();
        }
        if (!rawTracer) {
          rawTracer = otel.trace.getTracer("drizzle-orm", version2);
        }
        return iife(
          (otel2, rawTracer2) => rawTracer2.startActiveSpan(
            name,
            (span) => {
              try {
                return fn(span);
              } catch (e) {
                span.setStatus({
                  code: otel2.SpanStatusCode.ERROR,
                  message: e instanceof Error ? e.message : "Unknown error"
                  // eslint-disable-line no-instanceof/no-instanceof
                });
                throw e;
              } finally {
                span.end();
              }
            }
          ),
          otel,
          rawTracer
        );
      }
    };
  }
});

// ../node_modules/drizzle-orm/view-common.js
var ViewBaseConfig;
var init_view_common = __esm({
  "../node_modules/drizzle-orm/view-common.js"() {
    init_functionsRoutes_0_6398490784585695();
    ViewBaseConfig = /* @__PURE__ */ Symbol.for("drizzle:ViewBaseConfig");
  }
});

// ../node_modules/drizzle-orm/table.js
function getTableName(table) {
  return table[TableName];
}
function getTableUniqueName(table) {
  return `${table[Schema] ?? "public"}.${table[TableName]}`;
}
var Schema, Columns, ExtraConfigColumns, OriginalName, BaseName, IsAlias, ExtraConfigBuilder, IsDrizzleTable, Table;
var init_table = __esm({
  "../node_modules/drizzle-orm/table.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_table_utils();
    Schema = /* @__PURE__ */ Symbol.for("drizzle:Schema");
    Columns = /* @__PURE__ */ Symbol.for("drizzle:Columns");
    ExtraConfigColumns = /* @__PURE__ */ Symbol.for("drizzle:ExtraConfigColumns");
    OriginalName = /* @__PURE__ */ Symbol.for("drizzle:OriginalName");
    BaseName = /* @__PURE__ */ Symbol.for("drizzle:BaseName");
    IsAlias = /* @__PURE__ */ Symbol.for("drizzle:IsAlias");
    ExtraConfigBuilder = /* @__PURE__ */ Symbol.for("drizzle:ExtraConfigBuilder");
    IsDrizzleTable = /* @__PURE__ */ Symbol.for("drizzle:IsDrizzleTable");
    Table = class {
      static {
        __name(this, "Table");
      }
      static [entityKind] = "Table";
      /** @internal */
      static Symbol = {
        Name: TableName,
        Schema,
        OriginalName,
        Columns,
        ExtraConfigColumns,
        BaseName,
        IsAlias,
        ExtraConfigBuilder
      };
      /**
       * @internal
       * Can be changed if the table is aliased.
       */
      [TableName];
      /**
       * @internal
       * Used to store the original name of the table, before any aliasing.
       */
      [OriginalName];
      /** @internal */
      [Schema];
      /** @internal */
      [Columns];
      /** @internal */
      [ExtraConfigColumns];
      /**
       *  @internal
       * Used to store the table name before the transformation via the `tableCreator` functions.
       */
      [BaseName];
      /** @internal */
      [IsAlias] = false;
      /** @internal */
      [IsDrizzleTable] = true;
      /** @internal */
      [ExtraConfigBuilder] = void 0;
      constructor(name, schema, baseName) {
        this[TableName] = this[OriginalName] = name;
        this[Schema] = schema;
        this[BaseName] = baseName;
      }
    };
    __name(getTableName, "getTableName");
    __name(getTableUniqueName, "getTableUniqueName");
  }
});

// ../node_modules/drizzle-orm/sql/sql.js
function isSQLWrapper(value) {
  return value !== null && value !== void 0 && typeof value.getSQL === "function";
}
function mergeQueries(queries) {
  const result = { sql: "", params: [] };
  for (const query of queries) {
    result.sql += query.sql;
    result.params.push(...query.params);
    if (query.typings?.length) {
      if (!result.typings) {
        result.typings = [];
      }
      result.typings.push(...query.typings);
    }
  }
  return result;
}
function isDriverValueEncoder(value) {
  return typeof value === "object" && value !== null && "mapToDriverValue" in value && typeof value.mapToDriverValue === "function";
}
function sql(strings, ...params) {
  const queryChunks = [];
  if (params.length > 0 || strings.length > 0 && strings[0] !== "") {
    queryChunks.push(new StringChunk(strings[0]));
  }
  for (const [paramIndex, param2] of params.entries()) {
    queryChunks.push(param2, new StringChunk(strings[paramIndex + 1]));
  }
  return new SQL(queryChunks);
}
function fillPlaceholders(params, values) {
  return params.map((p) => {
    if (is(p, Placeholder)) {
      if (!(p.name in values)) {
        throw new Error(`No value for placeholder "${p.name}" was provided`);
      }
      return values[p.name];
    }
    if (is(p, Param) && is(p.value, Placeholder)) {
      if (!(p.value.name in values)) {
        throw new Error(`No value for placeholder "${p.value.name}" was provided`);
      }
      return p.encoder.mapToDriverValue(values[p.value.name]);
    }
    return p;
  });
}
var FakePrimitiveParam, StringChunk, SQL, Name, noopDecoder, noopEncoder, noopMapper, Param, Placeholder, IsDrizzleView, View;
var init_sql2 = __esm({
  "../node_modules/drizzle-orm/sql/sql.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_enum();
    init_subquery();
    init_tracing();
    init_view_common();
    init_column();
    init_table();
    FakePrimitiveParam = class {
      static {
        __name(this, "FakePrimitiveParam");
      }
      static [entityKind] = "FakePrimitiveParam";
    };
    __name(isSQLWrapper, "isSQLWrapper");
    __name(mergeQueries, "mergeQueries");
    StringChunk = class {
      static {
        __name(this, "StringChunk");
      }
      static [entityKind] = "StringChunk";
      value;
      constructor(value) {
        this.value = Array.isArray(value) ? value : [value];
      }
      getSQL() {
        return new SQL([this]);
      }
    };
    SQL = class _SQL {
      static {
        __name(this, "SQL");
      }
      constructor(queryChunks) {
        this.queryChunks = queryChunks;
        for (const chunk of queryChunks) {
          if (is(chunk, Table)) {
            const schemaName = chunk[Table.Symbol.Schema];
            this.usedTables.push(
              schemaName === void 0 ? chunk[Table.Symbol.Name] : schemaName + "." + chunk[Table.Symbol.Name]
            );
          }
        }
      }
      static [entityKind] = "SQL";
      /** @internal */
      decoder = noopDecoder;
      shouldInlineParams = false;
      /** @internal */
      usedTables = [];
      append(query) {
        this.queryChunks.push(...query.queryChunks);
        return this;
      }
      toQuery(config) {
        return tracer.startActiveSpan("drizzle.buildSQL", (span) => {
          const query = this.buildQueryFromSourceParams(this.queryChunks, config);
          span?.setAttributes({
            "drizzle.query.text": query.sql,
            "drizzle.query.params": JSON.stringify(query.params)
          });
          return query;
        });
      }
      buildQueryFromSourceParams(chunks, _config) {
        const config = Object.assign({}, _config, {
          inlineParams: _config.inlineParams || this.shouldInlineParams,
          paramStartIndex: _config.paramStartIndex || { value: 0 }
        });
        const {
          casing,
          escapeName,
          escapeParam,
          prepareTyping,
          inlineParams,
          paramStartIndex
        } = config;
        return mergeQueries(chunks.map((chunk) => {
          if (is(chunk, StringChunk)) {
            return { sql: chunk.value.join(""), params: [] };
          }
          if (is(chunk, Name)) {
            return { sql: escapeName(chunk.value), params: [] };
          }
          if (chunk === void 0) {
            return { sql: "", params: [] };
          }
          if (Array.isArray(chunk)) {
            const result = [new StringChunk("(")];
            for (const [i, p] of chunk.entries()) {
              result.push(p);
              if (i < chunk.length - 1) {
                result.push(new StringChunk(", "));
              }
            }
            result.push(new StringChunk(")"));
            return this.buildQueryFromSourceParams(result, config);
          }
          if (is(chunk, _SQL)) {
            return this.buildQueryFromSourceParams(chunk.queryChunks, {
              ...config,
              inlineParams: inlineParams || chunk.shouldInlineParams
            });
          }
          if (is(chunk, Table)) {
            const schemaName = chunk[Table.Symbol.Schema];
            const tableName = chunk[Table.Symbol.Name];
            return {
              sql: schemaName === void 0 || chunk[IsAlias] ? escapeName(tableName) : escapeName(schemaName) + "." + escapeName(tableName),
              params: []
            };
          }
          if (is(chunk, Column)) {
            const columnName = casing.getColumnCasing(chunk);
            if (_config.invokeSource === "indexes") {
              return { sql: escapeName(columnName), params: [] };
            }
            const schemaName = chunk.table[Table.Symbol.Schema];
            return {
              sql: chunk.table[IsAlias] || schemaName === void 0 ? escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName) : escapeName(schemaName) + "." + escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName),
              params: []
            };
          }
          if (is(chunk, View)) {
            const schemaName = chunk[ViewBaseConfig].schema;
            const viewName = chunk[ViewBaseConfig].name;
            return {
              sql: schemaName === void 0 || chunk[ViewBaseConfig].isAlias ? escapeName(viewName) : escapeName(schemaName) + "." + escapeName(viewName),
              params: []
            };
          }
          if (is(chunk, Param)) {
            if (is(chunk.value, Placeholder)) {
              return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
            }
            const mappedValue = chunk.value === null ? null : chunk.encoder.mapToDriverValue(chunk.value);
            if (is(mappedValue, _SQL)) {
              return this.buildQueryFromSourceParams([mappedValue], config);
            }
            if (inlineParams) {
              return { sql: this.mapInlineParam(mappedValue, config), params: [] };
            }
            let typings = ["none"];
            if (prepareTyping) {
              typings = [prepareTyping(chunk.encoder)];
            }
            return { sql: escapeParam(paramStartIndex.value++, mappedValue), params: [mappedValue], typings };
          }
          if (is(chunk, Placeholder)) {
            return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
          }
          if (is(chunk, _SQL.Aliased) && chunk.fieldAlias !== void 0) {
            return { sql: escapeName(chunk.fieldAlias), params: [] };
          }
          if (is(chunk, Subquery)) {
            if (chunk._.isWith) {
              return { sql: escapeName(chunk._.alias), params: [] };
            }
            return this.buildQueryFromSourceParams([
              new StringChunk("("),
              chunk._.sql,
              new StringChunk(") "),
              new Name(chunk._.alias)
            ], config);
          }
          if (isPgEnum(chunk)) {
            if (chunk.schema) {
              return { sql: escapeName(chunk.schema) + "." + escapeName(chunk.enumName), params: [] };
            }
            return { sql: escapeName(chunk.enumName), params: [] };
          }
          if (isSQLWrapper(chunk)) {
            if (chunk.shouldOmitSQLParens?.()) {
              return this.buildQueryFromSourceParams([chunk.getSQL()], config);
            }
            return this.buildQueryFromSourceParams([
              new StringChunk("("),
              chunk.getSQL(),
              new StringChunk(")")
            ], config);
          }
          if (inlineParams) {
            return { sql: this.mapInlineParam(chunk, config), params: [] };
          }
          return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
        }));
      }
      mapInlineParam(chunk, { escapeString: escapeString2 }) {
        if (chunk === null) {
          return "null";
        }
        if (typeof chunk === "number" || typeof chunk === "boolean") {
          return chunk.toString();
        }
        if (typeof chunk === "string") {
          return escapeString2(chunk);
        }
        if (typeof chunk === "object") {
          const mappedValueAsString = chunk.toString();
          if (mappedValueAsString === "[object Object]") {
            return escapeString2(JSON.stringify(chunk));
          }
          return escapeString2(mappedValueAsString);
        }
        throw new Error("Unexpected param value: " + chunk);
      }
      getSQL() {
        return this;
      }
      as(alias) {
        if (alias === void 0) {
          return this;
        }
        return new _SQL.Aliased(this, alias);
      }
      mapWith(decoder) {
        this.decoder = typeof decoder === "function" ? { mapFromDriverValue: decoder } : decoder;
        return this;
      }
      inlineParams() {
        this.shouldInlineParams = true;
        return this;
      }
      /**
       * This method is used to conditionally include a part of the query.
       *
       * @param condition - Condition to check
       * @returns itself if the condition is `true`, otherwise `undefined`
       */
      if(condition) {
        return condition ? this : void 0;
      }
    };
    Name = class {
      static {
        __name(this, "Name");
      }
      constructor(value) {
        this.value = value;
      }
      static [entityKind] = "Name";
      brand;
      getSQL() {
        return new SQL([this]);
      }
    };
    __name(isDriverValueEncoder, "isDriverValueEncoder");
    noopDecoder = {
      mapFromDriverValue: /* @__PURE__ */ __name((value) => value, "mapFromDriverValue")
    };
    noopEncoder = {
      mapToDriverValue: /* @__PURE__ */ __name((value) => value, "mapToDriverValue")
    };
    noopMapper = {
      ...noopDecoder,
      ...noopEncoder
    };
    Param = class {
      static {
        __name(this, "Param");
      }
      /**
       * @param value - Parameter value
       * @param encoder - Encoder to convert the value to a driver parameter
       */
      constructor(value, encoder = noopEncoder) {
        this.value = value;
        this.encoder = encoder;
      }
      static [entityKind] = "Param";
      brand;
      getSQL() {
        return new SQL([this]);
      }
    };
    __name(sql, "sql");
    ((sql2) => {
      function empty() {
        return new SQL([]);
      }
      __name(empty, "empty");
      sql2.empty = empty;
      function fromList(list) {
        return new SQL(list);
      }
      __name(fromList, "fromList");
      sql2.fromList = fromList;
      function raw2(str) {
        return new SQL([new StringChunk(str)]);
      }
      __name(raw2, "raw");
      sql2.raw = raw2;
      function join(chunks, separator) {
        const result = [];
        for (const [i, chunk] of chunks.entries()) {
          if (i > 0 && separator !== void 0) {
            result.push(separator);
          }
          result.push(chunk);
        }
        return new SQL(result);
      }
      __name(join, "join");
      sql2.join = join;
      function identifier(value) {
        return new Name(value);
      }
      __name(identifier, "identifier");
      sql2.identifier = identifier;
      function placeholder2(name2) {
        return new Placeholder(name2);
      }
      __name(placeholder2, "placeholder2");
      sql2.placeholder = placeholder2;
      function param2(value, encoder) {
        return new Param(value, encoder);
      }
      __name(param2, "param2");
      sql2.param = param2;
    })(sql || (sql = {}));
    ((SQL2) => {
      class Aliased {
        static {
          __name(this, "Aliased");
        }
        constructor(sql2, fieldAlias) {
          this.sql = sql2;
          this.fieldAlias = fieldAlias;
        }
        static [entityKind] = "SQL.Aliased";
        /** @internal */
        isSelectionField = false;
        getSQL() {
          return this.sql;
        }
        /** @internal */
        clone() {
          return new Aliased(this.sql, this.fieldAlias);
        }
      }
      SQL2.Aliased = Aliased;
    })(SQL || (SQL = {}));
    Placeholder = class {
      static {
        __name(this, "Placeholder");
      }
      constructor(name2) {
        this.name = name2;
      }
      static [entityKind] = "Placeholder";
      getSQL() {
        return new SQL([this]);
      }
    };
    __name(fillPlaceholders, "fillPlaceholders");
    IsDrizzleView = /* @__PURE__ */ Symbol.for("drizzle:IsDrizzleView");
    View = class {
      static {
        __name(this, "View");
      }
      static [entityKind] = "View";
      /** @internal */
      [ViewBaseConfig];
      /** @internal */
      [IsDrizzleView] = true;
      constructor({ name: name2, schema, selectedFields, query }) {
        this[ViewBaseConfig] = {
          name: name2,
          originalName: name2,
          schema,
          selectedFields,
          query,
          isExisting: !query,
          isAlias: false
        };
      }
      getSQL() {
        return new SQL([this]);
      }
    };
    Column.prototype.getSQL = function() {
      return new SQL([this]);
    };
    Table.prototype.getSQL = function() {
      return new SQL([this]);
    };
    Subquery.prototype.getSQL = function() {
      return new SQL([this]);
    };
  }
});

// ../node_modules/drizzle-orm/utils.js
function mapResultRow(columns, row, joinsNotNullableMap) {
  const nullifyMap = {};
  const result = columns.reduce(
    (result2, { path, field }, columnIndex) => {
      let decoder;
      if (is(field, Column)) {
        decoder = field;
      } else if (is(field, SQL)) {
        decoder = field.decoder;
      } else if (is(field, Subquery)) {
        decoder = field._.sql.decoder;
      } else {
        decoder = field.sql.decoder;
      }
      let node = result2;
      for (const [pathChunkIndex, pathChunk] of path.entries()) {
        if (pathChunkIndex < path.length - 1) {
          if (!(pathChunk in node)) {
            node[pathChunk] = {};
          }
          node = node[pathChunk];
        } else {
          const rawValue = row[columnIndex];
          const value = node[pathChunk] = rawValue === null ? null : decoder.mapFromDriverValue(rawValue);
          if (joinsNotNullableMap && is(field, Column) && path.length === 2) {
            const objectName = path[0];
            if (!(objectName in nullifyMap)) {
              nullifyMap[objectName] = value === null ? getTableName(field.table) : false;
            } else if (typeof nullifyMap[objectName] === "string" && nullifyMap[objectName] !== getTableName(field.table)) {
              nullifyMap[objectName] = false;
            }
          }
        }
      }
      return result2;
    },
    {}
  );
  if (joinsNotNullableMap && Object.keys(nullifyMap).length > 0) {
    for (const [objectName, tableName] of Object.entries(nullifyMap)) {
      if (typeof tableName === "string" && !joinsNotNullableMap[tableName]) {
        result[objectName] = null;
      }
    }
  }
  return result;
}
function orderSelectedFields(fields, pathPrefix) {
  return Object.entries(fields).reduce((result, [name, field]) => {
    if (typeof name !== "string") {
      return result;
    }
    const newPath = pathPrefix ? [...pathPrefix, name] : [name];
    if (is(field, Column) || is(field, SQL) || is(field, SQL.Aliased) || is(field, Subquery)) {
      result.push({ path: newPath, field });
    } else if (is(field, Table)) {
      result.push(...orderSelectedFields(field[Table.Symbol.Columns], newPath));
    } else {
      result.push(...orderSelectedFields(field, newPath));
    }
    return result;
  }, []);
}
function haveSameKeys(left, right) {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) {
    return false;
  }
  for (const [index2, key] of leftKeys.entries()) {
    if (key !== rightKeys[index2]) {
      return false;
    }
  }
  return true;
}
function mapUpdateSet(table, values) {
  const entries = Object.entries(values).filter(([, value]) => value !== void 0).map(([key, value]) => {
    if (is(value, SQL) || is(value, Column)) {
      return [key, value];
    } else {
      return [key, new Param(value, table[Table.Symbol.Columns][key])];
    }
  });
  if (entries.length === 0) {
    throw new Error("No values to set");
  }
  return Object.fromEntries(entries);
}
function applyMixins(baseClass, extendedClasses) {
  for (const extendedClass of extendedClasses) {
    for (const name of Object.getOwnPropertyNames(extendedClass.prototype)) {
      if (name === "constructor") continue;
      Object.defineProperty(
        baseClass.prototype,
        name,
        Object.getOwnPropertyDescriptor(extendedClass.prototype, name) || /* @__PURE__ */ Object.create(null)
      );
    }
  }
}
function getTableColumns(table) {
  return table[Table.Symbol.Columns];
}
function getTableLikeName(table) {
  return is(table, Subquery) ? table._.alias : is(table, View) ? table[ViewBaseConfig].name : is(table, SQL) ? void 0 : table[Table.Symbol.IsAlias] ? table[Table.Symbol.Name] : table[Table.Symbol.BaseName];
}
function getColumnNameAndConfig(a, b) {
  return {
    name: typeof a === "string" && a.length > 0 ? a : "",
    config: typeof a === "object" ? a : b
  };
}
function isConfig(data) {
  if (typeof data !== "object" || data === null) return false;
  if (data.constructor.name !== "Object") return false;
  if ("logger" in data) {
    const type = typeof data["logger"];
    if (type !== "boolean" && (type !== "object" || typeof data["logger"]["logQuery"] !== "function") && type !== "undefined") return false;
    return true;
  }
  if ("schema" in data) {
    const type = typeof data["schema"];
    if (type !== "object" && type !== "undefined") return false;
    return true;
  }
  if ("casing" in data) {
    const type = typeof data["casing"];
    if (type !== "string" && type !== "undefined") return false;
    return true;
  }
  if ("mode" in data) {
    if (data["mode"] !== "default" || data["mode"] !== "planetscale" || data["mode"] !== void 0) return false;
    return true;
  }
  if ("connection" in data) {
    const type = typeof data["connection"];
    if (type !== "string" && type !== "object" && type !== "undefined") return false;
    return true;
  }
  if ("client" in data) {
    const type = typeof data["client"];
    if (type !== "object" && type !== "function" && type !== "undefined") return false;
    return true;
  }
  if (Object.keys(data).length === 0) return true;
  return false;
}
var textDecoder;
var init_utils = __esm({
  "../node_modules/drizzle-orm/utils.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_column();
    init_entity();
    init_sql2();
    init_subquery();
    init_table();
    init_view_common();
    __name(mapResultRow, "mapResultRow");
    __name(orderSelectedFields, "orderSelectedFields");
    __name(haveSameKeys, "haveSameKeys");
    __name(mapUpdateSet, "mapUpdateSet");
    __name(applyMixins, "applyMixins");
    __name(getTableColumns, "getTableColumns");
    __name(getTableLikeName, "getTableLikeName");
    __name(getColumnNameAndConfig, "getColumnNameAndConfig");
    __name(isConfig, "isConfig");
    textDecoder = typeof TextDecoder === "undefined" ? null : new TextDecoder();
  }
});

// ../node_modules/drizzle-orm/logger.js
var ConsoleLogWriter, DefaultLogger, NoopLogger;
var init_logger2 = __esm({
  "../node_modules/drizzle-orm/logger.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    ConsoleLogWriter = class {
      static {
        __name(this, "ConsoleLogWriter");
      }
      static [entityKind] = "ConsoleLogWriter";
      write(message) {
        console.log(message);
      }
    };
    DefaultLogger = class {
      static {
        __name(this, "DefaultLogger");
      }
      static [entityKind] = "DefaultLogger";
      writer;
      constructor(config) {
        this.writer = config?.writer ?? new ConsoleLogWriter();
      }
      logQuery(query, params) {
        const stringifiedParams = params.map((p) => {
          try {
            return JSON.stringify(p);
          } catch {
            return String(p);
          }
        });
        const paramsStr = stringifiedParams.length ? ` -- params: [${stringifiedParams.join(", ")}]` : "";
        this.writer.write(`Query: ${query}${paramsStr}`);
      }
    };
    NoopLogger = class {
      static {
        __name(this, "NoopLogger");
      }
      static [entityKind] = "NoopLogger";
      logQuery() {
      }
    };
  }
});

// ../node_modules/drizzle-orm/pg-core/table.js
var InlineForeignKeys, EnableRLS, PgTable;
var init_table2 = __esm({
  "../node_modules/drizzle-orm/pg-core/table.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_table();
    InlineForeignKeys = /* @__PURE__ */ Symbol.for("drizzle:PgInlineForeignKeys");
    EnableRLS = /* @__PURE__ */ Symbol.for("drizzle:EnableRLS");
    PgTable = class extends Table {
      static {
        __name(this, "PgTable");
      }
      static [entityKind] = "PgTable";
      /** @internal */
      static Symbol = Object.assign({}, Table.Symbol, {
        InlineForeignKeys,
        EnableRLS
      });
      /**@internal */
      [InlineForeignKeys] = [];
      /** @internal */
      [EnableRLS] = false;
      /** @internal */
      [Table.Symbol.ExtraConfigBuilder] = void 0;
      /** @internal */
      [Table.Symbol.ExtraConfigColumns] = {};
    };
  }
});

// ../node_modules/drizzle-orm/pg-core/primary-keys.js
var PrimaryKeyBuilder, PrimaryKey;
var init_primary_keys = __esm({
  "../node_modules/drizzle-orm/pg-core/primary-keys.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_table2();
    PrimaryKeyBuilder = class {
      static {
        __name(this, "PrimaryKeyBuilder");
      }
      static [entityKind] = "PgPrimaryKeyBuilder";
      /** @internal */
      columns;
      /** @internal */
      name;
      constructor(columns, name) {
        this.columns = columns;
        this.name = name;
      }
      /** @internal */
      build(table) {
        return new PrimaryKey(table, this.columns, this.name);
      }
    };
    PrimaryKey = class {
      static {
        __name(this, "PrimaryKey");
      }
      constructor(table, columns, name) {
        this.table = table;
        this.columns = columns;
        this.name = name;
      }
      static [entityKind] = "PgPrimaryKey";
      columns;
      name;
      getName() {
        return this.name ?? `${this.table[PgTable.Symbol.Name]}_${this.columns.map((column) => column.name).join("_")}_pk`;
      }
    };
  }
});

// ../node_modules/drizzle-orm/sql/expressions/conditions.js
function bindIfParam(value, column) {
  if (isDriverValueEncoder(column) && !isSQLWrapper(value) && !is(value, Param) && !is(value, Placeholder) && !is(value, Column) && !is(value, Table) && !is(value, View)) {
    return new Param(value, column);
  }
  return value;
}
function and(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter(
    (c) => c !== void 0
  );
  if (conditions.length === 0) {
    return void 0;
  }
  if (conditions.length === 1) {
    return new SQL(conditions);
  }
  return new SQL([
    new StringChunk("("),
    sql.join(conditions, new StringChunk(" and ")),
    new StringChunk(")")
  ]);
}
function or(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter(
    (c) => c !== void 0
  );
  if (conditions.length === 0) {
    return void 0;
  }
  if (conditions.length === 1) {
    return new SQL(conditions);
  }
  return new SQL([
    new StringChunk("("),
    sql.join(conditions, new StringChunk(" or ")),
    new StringChunk(")")
  ]);
}
function not(condition) {
  return sql`not ${condition}`;
}
function inArray(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0) {
      return sql`false`;
    }
    return sql`${column} in ${values.map((v) => bindIfParam(v, column))}`;
  }
  return sql`${column} in ${bindIfParam(values, column)}`;
}
function notInArray(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0) {
      return sql`true`;
    }
    return sql`${column} not in ${values.map((v) => bindIfParam(v, column))}`;
  }
  return sql`${column} not in ${bindIfParam(values, column)}`;
}
function isNull(value) {
  return sql`${value} is null`;
}
function isNotNull(value) {
  return sql`${value} is not null`;
}
function exists(subquery) {
  return sql`exists ${subquery}`;
}
function notExists(subquery) {
  return sql`not exists ${subquery}`;
}
function between(column, min, max) {
  return sql`${column} between ${bindIfParam(min, column)} and ${bindIfParam(
    max,
    column
  )}`;
}
function notBetween(column, min, max) {
  return sql`${column} not between ${bindIfParam(
    min,
    column
  )} and ${bindIfParam(max, column)}`;
}
function like(column, value) {
  return sql`${column} like ${value}`;
}
function notLike(column, value) {
  return sql`${column} not like ${value}`;
}
function ilike(column, value) {
  return sql`${column} ilike ${value}`;
}
function notIlike(column, value) {
  return sql`${column} not ilike ${value}`;
}
var eq, ne, gt, gte, lt, lte;
var init_conditions = __esm({
  "../node_modules/drizzle-orm/sql/expressions/conditions.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_column();
    init_entity();
    init_table();
    init_sql2();
    __name(bindIfParam, "bindIfParam");
    eq = /* @__PURE__ */ __name((left, right) => {
      return sql`${left} = ${bindIfParam(right, left)}`;
    }, "eq");
    ne = /* @__PURE__ */ __name((left, right) => {
      return sql`${left} <> ${bindIfParam(right, left)}`;
    }, "ne");
    __name(and, "and");
    __name(or, "or");
    __name(not, "not");
    gt = /* @__PURE__ */ __name((left, right) => {
      return sql`${left} > ${bindIfParam(right, left)}`;
    }, "gt");
    gte = /* @__PURE__ */ __name((left, right) => {
      return sql`${left} >= ${bindIfParam(right, left)}`;
    }, "gte");
    lt = /* @__PURE__ */ __name((left, right) => {
      return sql`${left} < ${bindIfParam(right, left)}`;
    }, "lt");
    lte = /* @__PURE__ */ __name((left, right) => {
      return sql`${left} <= ${bindIfParam(right, left)}`;
    }, "lte");
    __name(inArray, "inArray");
    __name(notInArray, "notInArray");
    __name(isNull, "isNull");
    __name(isNotNull, "isNotNull");
    __name(exists, "exists");
    __name(notExists, "notExists");
    __name(between, "between");
    __name(notBetween, "notBetween");
    __name(like, "like");
    __name(notLike, "notLike");
    __name(ilike, "ilike");
    __name(notIlike, "notIlike");
  }
});

// ../node_modules/drizzle-orm/sql/expressions/select.js
function asc(column) {
  return sql`${column} asc`;
}
function desc(column) {
  return sql`${column} desc`;
}
var init_select = __esm({
  "../node_modules/drizzle-orm/sql/expressions/select.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_sql2();
    __name(asc, "asc");
    __name(desc, "desc");
  }
});

// ../node_modules/drizzle-orm/sql/expressions/index.js
var init_expressions = __esm({
  "../node_modules/drizzle-orm/sql/expressions/index.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_conditions();
    init_select();
  }
});

// ../node_modules/drizzle-orm/relations.js
function getOperators() {
  return {
    and,
    between,
    eq,
    exists,
    gt,
    gte,
    ilike,
    inArray,
    isNull,
    isNotNull,
    like,
    lt,
    lte,
    ne,
    not,
    notBetween,
    notExists,
    notLike,
    notIlike,
    notInArray,
    or,
    sql
  };
}
function getOrderByOperators() {
  return {
    sql,
    asc,
    desc
  };
}
function extractTablesRelationalConfig(schema, configHelpers) {
  if (Object.keys(schema).length === 1 && "default" in schema && !is(schema["default"], Table)) {
    schema = schema["default"];
  }
  const tableNamesMap = {};
  const relationsBuffer = {};
  const tablesConfig = {};
  for (const [key, value] of Object.entries(schema)) {
    if (is(value, Table)) {
      const dbName = getTableUniqueName(value);
      const bufferedRelations = relationsBuffer[dbName];
      tableNamesMap[dbName] = key;
      tablesConfig[key] = {
        tsName: key,
        dbName: value[Table.Symbol.Name],
        schema: value[Table.Symbol.Schema],
        columns: value[Table.Symbol.Columns],
        relations: bufferedRelations?.relations ?? {},
        primaryKey: bufferedRelations?.primaryKey ?? []
      };
      for (const column of Object.values(
        value[Table.Symbol.Columns]
      )) {
        if (column.primary) {
          tablesConfig[key].primaryKey.push(column);
        }
      }
      const extraConfig = value[Table.Symbol.ExtraConfigBuilder]?.(value[Table.Symbol.ExtraConfigColumns]);
      if (extraConfig) {
        for (const configEntry of Object.values(extraConfig)) {
          if (is(configEntry, PrimaryKeyBuilder)) {
            tablesConfig[key].primaryKey.push(...configEntry.columns);
          }
        }
      }
    } else if (is(value, Relations)) {
      const dbName = getTableUniqueName(value.table);
      const tableName = tableNamesMap[dbName];
      const relations2 = value.config(
        configHelpers(value.table)
      );
      let primaryKey;
      for (const [relationName, relation] of Object.entries(relations2)) {
        if (tableName) {
          const tableConfig = tablesConfig[tableName];
          tableConfig.relations[relationName] = relation;
          if (primaryKey) {
            tableConfig.primaryKey.push(...primaryKey);
          }
        } else {
          if (!(dbName in relationsBuffer)) {
            relationsBuffer[dbName] = {
              relations: {},
              primaryKey
            };
          }
          relationsBuffer[dbName].relations[relationName] = relation;
        }
      }
    }
  }
  return { tables: tablesConfig, tableNamesMap };
}
function relations(table, relations2) {
  return new Relations(
    table,
    (helpers) => Object.fromEntries(
      Object.entries(relations2(helpers)).map(([key, value]) => [
        key,
        value.withFieldName(key)
      ])
    )
  );
}
function createOne(sourceTable) {
  return /* @__PURE__ */ __name(function one(table, config) {
    return new One(
      sourceTable,
      table,
      config,
      config?.fields.reduce((res, f) => res && f.notNull, true) ?? false
    );
  }, "one");
}
function createMany(sourceTable) {
  return /* @__PURE__ */ __name(function many(referencedTable, config) {
    return new Many(sourceTable, referencedTable, config);
  }, "many");
}
function normalizeRelation(schema, tableNamesMap, relation) {
  if (is(relation, One) && relation.config) {
    return {
      fields: relation.config.fields,
      references: relation.config.references
    };
  }
  const referencedTableTsName = tableNamesMap[getTableUniqueName(relation.referencedTable)];
  if (!referencedTableTsName) {
    throw new Error(
      `Table "${relation.referencedTable[Table.Symbol.Name]}" not found in schema`
    );
  }
  const referencedTableConfig = schema[referencedTableTsName];
  if (!referencedTableConfig) {
    throw new Error(`Table "${referencedTableTsName}" not found in schema`);
  }
  const sourceTable = relation.sourceTable;
  const sourceTableTsName = tableNamesMap[getTableUniqueName(sourceTable)];
  if (!sourceTableTsName) {
    throw new Error(
      `Table "${sourceTable[Table.Symbol.Name]}" not found in schema`
    );
  }
  const reverseRelations = [];
  for (const referencedTableRelation of Object.values(
    referencedTableConfig.relations
  )) {
    if (relation.relationName && relation !== referencedTableRelation && referencedTableRelation.relationName === relation.relationName || !relation.relationName && referencedTableRelation.referencedTable === relation.sourceTable) {
      reverseRelations.push(referencedTableRelation);
    }
  }
  if (reverseRelations.length > 1) {
    throw relation.relationName ? new Error(
      `There are multiple relations with name "${relation.relationName}" in table "${referencedTableTsName}"`
    ) : new Error(
      `There are multiple relations between "${referencedTableTsName}" and "${relation.sourceTable[Table.Symbol.Name]}". Please specify relation name`
    );
  }
  if (reverseRelations[0] && is(reverseRelations[0], One) && reverseRelations[0].config) {
    return {
      fields: reverseRelations[0].config.references,
      references: reverseRelations[0].config.fields
    };
  }
  throw new Error(
    `There is not enough information to infer relation "${sourceTableTsName}.${relation.fieldName}"`
  );
}
function createTableRelationsHelpers(sourceTable) {
  return {
    one: createOne(sourceTable),
    many: createMany(sourceTable)
  };
}
function mapRelationalRow(tablesConfig, tableConfig, row, buildQueryResultSelection, mapColumnValue = (value) => value) {
  const result = {};
  for (const [
    selectionItemIndex,
    selectionItem
  ] of buildQueryResultSelection.entries()) {
    if (selectionItem.isJson) {
      const relation = tableConfig.relations[selectionItem.tsKey];
      const rawSubRows = row[selectionItemIndex];
      const subRows = typeof rawSubRows === "string" ? JSON.parse(rawSubRows) : rawSubRows;
      result[selectionItem.tsKey] = is(relation, One) ? subRows && mapRelationalRow(
        tablesConfig,
        tablesConfig[selectionItem.relationTableTsKey],
        subRows,
        selectionItem.selection,
        mapColumnValue
      ) : subRows.map(
        (subRow) => mapRelationalRow(
          tablesConfig,
          tablesConfig[selectionItem.relationTableTsKey],
          subRow,
          selectionItem.selection,
          mapColumnValue
        )
      );
    } else {
      const value = mapColumnValue(row[selectionItemIndex]);
      const field = selectionItem.field;
      let decoder;
      if (is(field, Column)) {
        decoder = field;
      } else if (is(field, SQL)) {
        decoder = field.decoder;
      } else {
        decoder = field.sql.decoder;
      }
      result[selectionItem.tsKey] = value === null ? null : decoder.mapFromDriverValue(value);
    }
  }
  return result;
}
var Relation, Relations, One, Many;
var init_relations = __esm({
  "../node_modules/drizzle-orm/relations.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_table();
    init_column();
    init_entity();
    init_primary_keys();
    init_expressions();
    init_sql2();
    Relation = class {
      static {
        __name(this, "Relation");
      }
      constructor(sourceTable, referencedTable, relationName) {
        this.sourceTable = sourceTable;
        this.referencedTable = referencedTable;
        this.relationName = relationName;
        this.referencedTableName = referencedTable[Table.Symbol.Name];
      }
      static [entityKind] = "Relation";
      referencedTableName;
      fieldName;
    };
    Relations = class {
      static {
        __name(this, "Relations");
      }
      constructor(table, config) {
        this.table = table;
        this.config = config;
      }
      static [entityKind] = "Relations";
    };
    One = class _One extends Relation {
      static {
        __name(this, "One");
      }
      constructor(sourceTable, referencedTable, config, isNullable) {
        super(sourceTable, referencedTable, config?.relationName);
        this.config = config;
        this.isNullable = isNullable;
      }
      static [entityKind] = "One";
      withFieldName(fieldName) {
        const relation = new _One(
          this.sourceTable,
          this.referencedTable,
          this.config,
          this.isNullable
        );
        relation.fieldName = fieldName;
        return relation;
      }
    };
    Many = class _Many extends Relation {
      static {
        __name(this, "Many");
      }
      constructor(sourceTable, referencedTable, config) {
        super(sourceTable, referencedTable, config?.relationName);
        this.config = config;
      }
      static [entityKind] = "Many";
      withFieldName(fieldName) {
        const relation = new _Many(
          this.sourceTable,
          this.referencedTable,
          this.config
        );
        relation.fieldName = fieldName;
        return relation;
      }
    };
    __name(getOperators, "getOperators");
    __name(getOrderByOperators, "getOrderByOperators");
    __name(extractTablesRelationalConfig, "extractTablesRelationalConfig");
    __name(relations, "relations");
    __name(createOne, "createOne");
    __name(createMany, "createMany");
    __name(normalizeRelation, "normalizeRelation");
    __name(createTableRelationsHelpers, "createTableRelationsHelpers");
    __name(mapRelationalRow, "mapRelationalRow");
  }
});

// ../node_modules/drizzle-orm/alias.js
function aliasedTable(table, tableAlias) {
  return new Proxy(table, new TableAliasProxyHandler(tableAlias, false));
}
function aliasedTableColumn(column, tableAlias) {
  return new Proxy(
    column,
    new ColumnAliasProxyHandler(new Proxy(column.table, new TableAliasProxyHandler(tableAlias, false)))
  );
}
function mapColumnsInAliasedSQLToAlias(query, alias) {
  return new SQL.Aliased(mapColumnsInSQLToAlias(query.sql, alias), query.fieldAlias);
}
function mapColumnsInSQLToAlias(query, alias) {
  return sql.join(query.queryChunks.map((c) => {
    if (is(c, Column)) {
      return aliasedTableColumn(c, alias);
    }
    if (is(c, SQL)) {
      return mapColumnsInSQLToAlias(c, alias);
    }
    if (is(c, SQL.Aliased)) {
      return mapColumnsInAliasedSQLToAlias(c, alias);
    }
    return c;
  }));
}
var ColumnAliasProxyHandler, TableAliasProxyHandler, RelationTableAliasProxyHandler;
var init_alias = __esm({
  "../node_modules/drizzle-orm/alias.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_column();
    init_entity();
    init_sql2();
    init_table();
    init_view_common();
    ColumnAliasProxyHandler = class {
      static {
        __name(this, "ColumnAliasProxyHandler");
      }
      constructor(table) {
        this.table = table;
      }
      static [entityKind] = "ColumnAliasProxyHandler";
      get(columnObj, prop) {
        if (prop === "table") {
          return this.table;
        }
        return columnObj[prop];
      }
    };
    TableAliasProxyHandler = class {
      static {
        __name(this, "TableAliasProxyHandler");
      }
      constructor(alias, replaceOriginalName) {
        this.alias = alias;
        this.replaceOriginalName = replaceOriginalName;
      }
      static [entityKind] = "TableAliasProxyHandler";
      get(target, prop) {
        if (prop === Table.Symbol.IsAlias) {
          return true;
        }
        if (prop === Table.Symbol.Name) {
          return this.alias;
        }
        if (this.replaceOriginalName && prop === Table.Symbol.OriginalName) {
          return this.alias;
        }
        if (prop === ViewBaseConfig) {
          return {
            ...target[ViewBaseConfig],
            name: this.alias,
            isAlias: true
          };
        }
        if (prop === Table.Symbol.Columns) {
          const columns = target[Table.Symbol.Columns];
          if (!columns) {
            return columns;
          }
          const proxiedColumns = {};
          Object.keys(columns).map((key) => {
            proxiedColumns[key] = new Proxy(
              columns[key],
              new ColumnAliasProxyHandler(new Proxy(target, this))
            );
          });
          return proxiedColumns;
        }
        const value = target[prop];
        if (is(value, Column)) {
          return new Proxy(value, new ColumnAliasProxyHandler(new Proxy(target, this)));
        }
        return value;
      }
    };
    RelationTableAliasProxyHandler = class {
      static {
        __name(this, "RelationTableAliasProxyHandler");
      }
      constructor(alias) {
        this.alias = alias;
      }
      static [entityKind] = "RelationTableAliasProxyHandler";
      get(target, prop) {
        if (prop === "sourceTable") {
          return aliasedTable(target.sourceTable, this.alias);
        }
        return target[prop];
      }
    };
    __name(aliasedTable, "aliasedTable");
    __name(aliasedTableColumn, "aliasedTableColumn");
    __name(mapColumnsInAliasedSQLToAlias, "mapColumnsInAliasedSQLToAlias");
    __name(mapColumnsInSQLToAlias, "mapColumnsInSQLToAlias");
  }
});

// ../node_modules/drizzle-orm/selection-proxy.js
var SelectionProxyHandler;
var init_selection_proxy = __esm({
  "../node_modules/drizzle-orm/selection-proxy.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_alias();
    init_column();
    init_entity();
    init_sql2();
    init_subquery();
    init_view_common();
    SelectionProxyHandler = class _SelectionProxyHandler {
      static {
        __name(this, "SelectionProxyHandler");
      }
      static [entityKind] = "SelectionProxyHandler";
      config;
      constructor(config) {
        this.config = { ...config };
      }
      get(subquery, prop) {
        if (prop === "_") {
          return {
            ...subquery["_"],
            selectedFields: new Proxy(
              subquery._.selectedFields,
              this
            )
          };
        }
        if (prop === ViewBaseConfig) {
          return {
            ...subquery[ViewBaseConfig],
            selectedFields: new Proxy(
              subquery[ViewBaseConfig].selectedFields,
              this
            )
          };
        }
        if (typeof prop === "symbol") {
          return subquery[prop];
        }
        const columns = is(subquery, Subquery) ? subquery._.selectedFields : is(subquery, View) ? subquery[ViewBaseConfig].selectedFields : subquery;
        const value = columns[prop];
        if (is(value, SQL.Aliased)) {
          if (this.config.sqlAliasedBehavior === "sql" && !value.isSelectionField) {
            return value.sql;
          }
          const newValue = value.clone();
          newValue.isSelectionField = true;
          return newValue;
        }
        if (is(value, SQL)) {
          if (this.config.sqlBehavior === "sql") {
            return value;
          }
          throw new Error(
            `You tried to reference "${prop}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`
          );
        }
        if (is(value, Column)) {
          if (this.config.alias) {
            return new Proxy(
              value,
              new ColumnAliasProxyHandler(
                new Proxy(
                  value.table,
                  new TableAliasProxyHandler(this.config.alias, this.config.replaceOriginalName ?? false)
                )
              )
            );
          }
          return value;
        }
        if (typeof value !== "object" || value === null) {
          return value;
        }
        return new Proxy(value, new _SelectionProxyHandler(this.config));
      }
    };
  }
});

// ../node_modules/drizzle-orm/query-promise.js
var QueryPromise;
var init_query_promise = __esm({
  "../node_modules/drizzle-orm/query-promise.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    QueryPromise = class {
      static {
        __name(this, "QueryPromise");
      }
      static [entityKind] = "QueryPromise";
      [Symbol.toStringTag] = "QueryPromise";
      catch(onRejected) {
        return this.then(void 0, onRejected);
      }
      finally(onFinally) {
        return this.then(
          (value) => {
            onFinally?.();
            return value;
          },
          (reason) => {
            onFinally?.();
            throw reason;
          }
        );
      }
      then(onFulfilled, onRejected) {
        return this.execute().then(onFulfilled, onRejected);
      }
    };
  }
});

// ../node_modules/drizzle-orm/sqlite-core/foreign-keys.js
var ForeignKeyBuilder2, ForeignKey2;
var init_foreign_keys2 = __esm({
  "../node_modules/drizzle-orm/sqlite-core/foreign-keys.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_table_utils();
    ForeignKeyBuilder2 = class {
      static {
        __name(this, "ForeignKeyBuilder");
      }
      static [entityKind] = "SQLiteForeignKeyBuilder";
      /** @internal */
      reference;
      /** @internal */
      _onUpdate;
      /** @internal */
      _onDelete;
      constructor(config, actions) {
        this.reference = () => {
          const { name, columns, foreignColumns } = config();
          return { name, columns, foreignTable: foreignColumns[0].table, foreignColumns };
        };
        if (actions) {
          this._onUpdate = actions.onUpdate;
          this._onDelete = actions.onDelete;
        }
      }
      onUpdate(action) {
        this._onUpdate = action;
        return this;
      }
      onDelete(action) {
        this._onDelete = action;
        return this;
      }
      /** @internal */
      build(table) {
        return new ForeignKey2(table, this);
      }
    };
    ForeignKey2 = class {
      static {
        __name(this, "ForeignKey");
      }
      constructor(table, builder) {
        this.table = table;
        this.reference = builder.reference;
        this.onUpdate = builder._onUpdate;
        this.onDelete = builder._onDelete;
      }
      static [entityKind] = "SQLiteForeignKey";
      reference;
      onUpdate;
      onDelete;
      getName() {
        const { name, columns, foreignColumns } = this.reference();
        const columnNames = columns.map((column) => column.name);
        const foreignColumnNames = foreignColumns.map((column) => column.name);
        const chunks = [
          this.table[TableName],
          ...columnNames,
          foreignColumns[0].table[TableName],
          ...foreignColumnNames
        ];
        return name ?? `${chunks.join("_")}_fk`;
      }
    };
  }
});

// ../node_modules/drizzle-orm/sqlite-core/unique-constraint.js
function uniqueKeyName2(table, columns) {
  return `${table[TableName]}_${columns.join("_")}_unique`;
}
var UniqueConstraintBuilder2, UniqueOnConstraintBuilder2, UniqueConstraint2;
var init_unique_constraint2 = __esm({
  "../node_modules/drizzle-orm/sqlite-core/unique-constraint.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_table_utils();
    __name(uniqueKeyName2, "uniqueKeyName");
    UniqueConstraintBuilder2 = class {
      static {
        __name(this, "UniqueConstraintBuilder");
      }
      constructor(columns, name) {
        this.name = name;
        this.columns = columns;
      }
      static [entityKind] = "SQLiteUniqueConstraintBuilder";
      /** @internal */
      columns;
      /** @internal */
      build(table) {
        return new UniqueConstraint2(table, this.columns, this.name);
      }
    };
    UniqueOnConstraintBuilder2 = class {
      static {
        __name(this, "UniqueOnConstraintBuilder");
      }
      static [entityKind] = "SQLiteUniqueOnConstraintBuilder";
      /** @internal */
      name;
      constructor(name) {
        this.name = name;
      }
      on(...columns) {
        return new UniqueConstraintBuilder2(columns, this.name);
      }
    };
    UniqueConstraint2 = class {
      static {
        __name(this, "UniqueConstraint");
      }
      constructor(table, columns, name) {
        this.table = table;
        this.columns = columns;
        this.name = name ?? uniqueKeyName2(this.table, this.columns.map((column) => column.name));
      }
      static [entityKind] = "SQLiteUniqueConstraint";
      columns;
      name;
      getName() {
        return this.name;
      }
    };
  }
});

// ../node_modules/drizzle-orm/sqlite-core/columns/common.js
var SQLiteColumnBuilder, SQLiteColumn;
var init_common2 = __esm({
  "../node_modules/drizzle-orm/sqlite-core/columns/common.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_column_builder();
    init_column();
    init_entity();
    init_foreign_keys2();
    init_unique_constraint2();
    SQLiteColumnBuilder = class extends ColumnBuilder {
      static {
        __name(this, "SQLiteColumnBuilder");
      }
      static [entityKind] = "SQLiteColumnBuilder";
      foreignKeyConfigs = [];
      references(ref, actions = {}) {
        this.foreignKeyConfigs.push({ ref, actions });
        return this;
      }
      unique(name) {
        this.config.isUnique = true;
        this.config.uniqueName = name;
        return this;
      }
      generatedAlwaysAs(as, config) {
        this.config.generated = {
          as,
          type: "always",
          mode: config?.mode ?? "virtual"
        };
        return this;
      }
      /** @internal */
      buildForeignKeys(column, table) {
        return this.foreignKeyConfigs.map(({ ref, actions }) => {
          return ((ref2, actions2) => {
            const builder = new ForeignKeyBuilder2(() => {
              const foreignColumn = ref2();
              return { columns: [column], foreignColumns: [foreignColumn] };
            });
            if (actions2.onUpdate) {
              builder.onUpdate(actions2.onUpdate);
            }
            if (actions2.onDelete) {
              builder.onDelete(actions2.onDelete);
            }
            return builder.build(table);
          })(ref, actions);
        });
      }
    };
    SQLiteColumn = class extends Column {
      static {
        __name(this, "SQLiteColumn");
      }
      constructor(table, config) {
        if (!config.uniqueName) {
          config.uniqueName = uniqueKeyName2(table, [config.name]);
        }
        super(table, config);
        this.table = table;
      }
      static [entityKind] = "SQLiteColumn";
    };
  }
});

// ../node_modules/drizzle-orm/sqlite-core/columns/blob.js
function blob(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  if (config?.mode === "json") {
    return new SQLiteBlobJsonBuilder(name);
  }
  if (config?.mode === "bigint") {
    return new SQLiteBigIntBuilder(name);
  }
  return new SQLiteBlobBufferBuilder(name);
}
var SQLiteBigIntBuilder, SQLiteBigInt, SQLiteBlobJsonBuilder, SQLiteBlobJson, SQLiteBlobBufferBuilder, SQLiteBlobBuffer;
var init_blob = __esm({
  "../node_modules/drizzle-orm/sqlite-core/columns/blob.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_utils();
    init_common2();
    SQLiteBigIntBuilder = class extends SQLiteColumnBuilder {
      static {
        __name(this, "SQLiteBigIntBuilder");
      }
      static [entityKind] = "SQLiteBigIntBuilder";
      constructor(name) {
        super(name, "bigint", "SQLiteBigInt");
      }
      /** @internal */
      build(table) {
        return new SQLiteBigInt(table, this.config);
      }
    };
    SQLiteBigInt = class extends SQLiteColumn {
      static {
        __name(this, "SQLiteBigInt");
      }
      static [entityKind] = "SQLiteBigInt";
      getSQLType() {
        return "blob";
      }
      mapFromDriverValue(value) {
        if (typeof Buffer !== "undefined" && Buffer.from) {
          const buf = Buffer.isBuffer(value) ? value : value instanceof ArrayBuffer ? Buffer.from(value) : value.buffer ? Buffer.from(value.buffer, value.byteOffset, value.byteLength) : Buffer.from(value);
          return BigInt(buf.toString("utf8"));
        }
        return BigInt(textDecoder.decode(value));
      }
      mapToDriverValue(value) {
        return Buffer.from(value.toString());
      }
    };
    SQLiteBlobJsonBuilder = class extends SQLiteColumnBuilder {
      static {
        __name(this, "SQLiteBlobJsonBuilder");
      }
      static [entityKind] = "SQLiteBlobJsonBuilder";
      constructor(name) {
        super(name, "json", "SQLiteBlobJson");
      }
      /** @internal */
      build(table) {
        return new SQLiteBlobJson(
          table,
          this.config
        );
      }
    };
    SQLiteBlobJson = class extends SQLiteColumn {
      static {
        __name(this, "SQLiteBlobJson");
      }
      static [entityKind] = "SQLiteBlobJson";
      getSQLType() {
        return "blob";
      }
      mapFromDriverValue(value) {
        if (typeof Buffer !== "undefined" && Buffer.from) {
          const buf = Buffer.isBuffer(value) ? value : value instanceof ArrayBuffer ? Buffer.from(value) : value.buffer ? Buffer.from(value.buffer, value.byteOffset, value.byteLength) : Buffer.from(value);
          return JSON.parse(buf.toString("utf8"));
        }
        return JSON.parse(textDecoder.decode(value));
      }
      mapToDriverValue(value) {
        return Buffer.from(JSON.stringify(value));
      }
    };
    SQLiteBlobBufferBuilder = class extends SQLiteColumnBuilder {
      static {
        __name(this, "SQLiteBlobBufferBuilder");
      }
      static [entityKind] = "SQLiteBlobBufferBuilder";
      constructor(name) {
        super(name, "buffer", "SQLiteBlobBuffer");
      }
      /** @internal */
      build(table) {
        return new SQLiteBlobBuffer(table, this.config);
      }
    };
    SQLiteBlobBuffer = class extends SQLiteColumn {
      static {
        __name(this, "SQLiteBlobBuffer");
      }
      static [entityKind] = "SQLiteBlobBuffer";
      mapFromDriverValue(value) {
        if (Buffer.isBuffer(value)) {
          return value;
        }
        return Buffer.from(value);
      }
      getSQLType() {
        return "blob";
      }
    };
    __name(blob, "blob");
  }
});

// ../node_modules/drizzle-orm/sqlite-core/columns/custom.js
function customType(customTypeParams) {
  return (a, b) => {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new SQLiteCustomColumnBuilder(
      name,
      config,
      customTypeParams
    );
  };
}
var SQLiteCustomColumnBuilder, SQLiteCustomColumn;
var init_custom = __esm({
  "../node_modules/drizzle-orm/sqlite-core/columns/custom.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_utils();
    init_common2();
    SQLiteCustomColumnBuilder = class extends SQLiteColumnBuilder {
      static {
        __name(this, "SQLiteCustomColumnBuilder");
      }
      static [entityKind] = "SQLiteCustomColumnBuilder";
      constructor(name, fieldConfig, customTypeParams) {
        super(name, "custom", "SQLiteCustomColumn");
        this.config.fieldConfig = fieldConfig;
        this.config.customTypeParams = customTypeParams;
      }
      /** @internal */
      build(table) {
        return new SQLiteCustomColumn(
          table,
          this.config
        );
      }
    };
    SQLiteCustomColumn = class extends SQLiteColumn {
      static {
        __name(this, "SQLiteCustomColumn");
      }
      static [entityKind] = "SQLiteCustomColumn";
      sqlName;
      mapTo;
      mapFrom;
      constructor(table, config) {
        super(table, config);
        this.sqlName = config.customTypeParams.dataType(config.fieldConfig);
        this.mapTo = config.customTypeParams.toDriver;
        this.mapFrom = config.customTypeParams.fromDriver;
      }
      getSQLType() {
        return this.sqlName;
      }
      mapFromDriverValue(value) {
        return typeof this.mapFrom === "function" ? this.mapFrom(value) : value;
      }
      mapToDriverValue(value) {
        return typeof this.mapTo === "function" ? this.mapTo(value) : value;
      }
    };
    __name(customType, "customType");
  }
});

// ../node_modules/drizzle-orm/sqlite-core/columns/integer.js
function integer(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  if (config?.mode === "timestamp" || config?.mode === "timestamp_ms") {
    return new SQLiteTimestampBuilder(name, config.mode);
  }
  if (config?.mode === "boolean") {
    return new SQLiteBooleanBuilder(name, config.mode);
  }
  return new SQLiteIntegerBuilder(name);
}
var SQLiteBaseIntegerBuilder, SQLiteBaseInteger, SQLiteIntegerBuilder, SQLiteInteger, SQLiteTimestampBuilder, SQLiteTimestamp, SQLiteBooleanBuilder, SQLiteBoolean;
var init_integer = __esm({
  "../node_modules/drizzle-orm/sqlite-core/columns/integer.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_sql2();
    init_utils();
    init_common2();
    SQLiteBaseIntegerBuilder = class extends SQLiteColumnBuilder {
      static {
        __name(this, "SQLiteBaseIntegerBuilder");
      }
      static [entityKind] = "SQLiteBaseIntegerBuilder";
      constructor(name, dataType, columnType) {
        super(name, dataType, columnType);
        this.config.autoIncrement = false;
      }
      primaryKey(config) {
        if (config?.autoIncrement) {
          this.config.autoIncrement = true;
        }
        this.config.hasDefault = true;
        return super.primaryKey();
      }
    };
    SQLiteBaseInteger = class extends SQLiteColumn {
      static {
        __name(this, "SQLiteBaseInteger");
      }
      static [entityKind] = "SQLiteBaseInteger";
      autoIncrement = this.config.autoIncrement;
      getSQLType() {
        return "integer";
      }
    };
    SQLiteIntegerBuilder = class extends SQLiteBaseIntegerBuilder {
      static {
        __name(this, "SQLiteIntegerBuilder");
      }
      static [entityKind] = "SQLiteIntegerBuilder";
      constructor(name) {
        super(name, "number", "SQLiteInteger");
      }
      build(table) {
        return new SQLiteInteger(
          table,
          this.config
        );
      }
    };
    SQLiteInteger = class extends SQLiteBaseInteger {
      static {
        __name(this, "SQLiteInteger");
      }
      static [entityKind] = "SQLiteInteger";
    };
    SQLiteTimestampBuilder = class extends SQLiteBaseIntegerBuilder {
      static {
        __name(this, "SQLiteTimestampBuilder");
      }
      static [entityKind] = "SQLiteTimestampBuilder";
      constructor(name, mode) {
        super(name, "date", "SQLiteTimestamp");
        this.config.mode = mode;
      }
      /**
       * @deprecated Use `default()` with your own expression instead.
       *
       * Adds `DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))` to the column, which is the current epoch timestamp in milliseconds.
       */
      defaultNow() {
        return this.default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`);
      }
      build(table) {
        return new SQLiteTimestamp(
          table,
          this.config
        );
      }
    };
    SQLiteTimestamp = class extends SQLiteBaseInteger {
      static {
        __name(this, "SQLiteTimestamp");
      }
      static [entityKind] = "SQLiteTimestamp";
      mode = this.config.mode;
      mapFromDriverValue(value) {
        if (this.config.mode === "timestamp") {
          return new Date(value * 1e3);
        }
        return new Date(value);
      }
      mapToDriverValue(value) {
        const unix = value.getTime();
        if (this.config.mode === "timestamp") {
          return Math.floor(unix / 1e3);
        }
        return unix;
      }
    };
    SQLiteBooleanBuilder = class extends SQLiteBaseIntegerBuilder {
      static {
        __name(this, "SQLiteBooleanBuilder");
      }
      static [entityKind] = "SQLiteBooleanBuilder";
      constructor(name, mode) {
        super(name, "boolean", "SQLiteBoolean");
        this.config.mode = mode;
      }
      build(table) {
        return new SQLiteBoolean(
          table,
          this.config
        );
      }
    };
    SQLiteBoolean = class extends SQLiteBaseInteger {
      static {
        __name(this, "SQLiteBoolean");
      }
      static [entityKind] = "SQLiteBoolean";
      mode = this.config.mode;
      mapFromDriverValue(value) {
        return Number(value) === 1;
      }
      mapToDriverValue(value) {
        return value ? 1 : 0;
      }
    };
    __name(integer, "integer");
  }
});

// ../node_modules/drizzle-orm/sqlite-core/columns/numeric.js
function numeric(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  const mode = config?.mode;
  return mode === "number" ? new SQLiteNumericNumberBuilder(name) : mode === "bigint" ? new SQLiteNumericBigIntBuilder(name) : new SQLiteNumericBuilder(name);
}
var SQLiteNumericBuilder, SQLiteNumeric, SQLiteNumericNumberBuilder, SQLiteNumericNumber, SQLiteNumericBigIntBuilder, SQLiteNumericBigInt;
var init_numeric = __esm({
  "../node_modules/drizzle-orm/sqlite-core/columns/numeric.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_utils();
    init_common2();
    SQLiteNumericBuilder = class extends SQLiteColumnBuilder {
      static {
        __name(this, "SQLiteNumericBuilder");
      }
      static [entityKind] = "SQLiteNumericBuilder";
      constructor(name) {
        super(name, "string", "SQLiteNumeric");
      }
      /** @internal */
      build(table) {
        return new SQLiteNumeric(
          table,
          this.config
        );
      }
    };
    SQLiteNumeric = class extends SQLiteColumn {
      static {
        __name(this, "SQLiteNumeric");
      }
      static [entityKind] = "SQLiteNumeric";
      mapFromDriverValue(value) {
        if (typeof value === "string") return value;
        return String(value);
      }
      getSQLType() {
        return "numeric";
      }
    };
    SQLiteNumericNumberBuilder = class extends SQLiteColumnBuilder {
      static {
        __name(this, "SQLiteNumericNumberBuilder");
      }
      static [entityKind] = "SQLiteNumericNumberBuilder";
      constructor(name) {
        super(name, "number", "SQLiteNumericNumber");
      }
      /** @internal */
      build(table) {
        return new SQLiteNumericNumber(
          table,
          this.config
        );
      }
    };
    SQLiteNumericNumber = class extends SQLiteColumn {
      static {
        __name(this, "SQLiteNumericNumber");
      }
      static [entityKind] = "SQLiteNumericNumber";
      mapFromDriverValue(value) {
        if (typeof value === "number") return value;
        return Number(value);
      }
      mapToDriverValue = String;
      getSQLType() {
        return "numeric";
      }
    };
    SQLiteNumericBigIntBuilder = class extends SQLiteColumnBuilder {
      static {
        __name(this, "SQLiteNumericBigIntBuilder");
      }
      static [entityKind] = "SQLiteNumericBigIntBuilder";
      constructor(name) {
        super(name, "bigint", "SQLiteNumericBigInt");
      }
      /** @internal */
      build(table) {
        return new SQLiteNumericBigInt(
          table,
          this.config
        );
      }
    };
    SQLiteNumericBigInt = class extends SQLiteColumn {
      static {
        __name(this, "SQLiteNumericBigInt");
      }
      static [entityKind] = "SQLiteNumericBigInt";
      mapFromDriverValue = BigInt;
      mapToDriverValue = String;
      getSQLType() {
        return "numeric";
      }
    };
    __name(numeric, "numeric");
  }
});

// ../node_modules/drizzle-orm/sqlite-core/columns/real.js
function real(name) {
  return new SQLiteRealBuilder(name ?? "");
}
var SQLiteRealBuilder, SQLiteReal;
var init_real = __esm({
  "../node_modules/drizzle-orm/sqlite-core/columns/real.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_common2();
    SQLiteRealBuilder = class extends SQLiteColumnBuilder {
      static {
        __name(this, "SQLiteRealBuilder");
      }
      static [entityKind] = "SQLiteRealBuilder";
      constructor(name) {
        super(name, "number", "SQLiteReal");
      }
      /** @internal */
      build(table) {
        return new SQLiteReal(table, this.config);
      }
    };
    SQLiteReal = class extends SQLiteColumn {
      static {
        __name(this, "SQLiteReal");
      }
      static [entityKind] = "SQLiteReal";
      getSQLType() {
        return "real";
      }
    };
    __name(real, "real");
  }
});

// ../node_modules/drizzle-orm/sqlite-core/columns/text.js
function text(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(a, b);
  if (config.mode === "json") {
    return new SQLiteTextJsonBuilder(name);
  }
  return new SQLiteTextBuilder(name, config);
}
var SQLiteTextBuilder, SQLiteText, SQLiteTextJsonBuilder, SQLiteTextJson;
var init_text = __esm({
  "../node_modules/drizzle-orm/sqlite-core/columns/text.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_utils();
    init_common2();
    SQLiteTextBuilder = class extends SQLiteColumnBuilder {
      static {
        __name(this, "SQLiteTextBuilder");
      }
      static [entityKind] = "SQLiteTextBuilder";
      constructor(name, config) {
        super(name, "string", "SQLiteText");
        this.config.enumValues = config.enum;
        this.config.length = config.length;
      }
      /** @internal */
      build(table) {
        return new SQLiteText(
          table,
          this.config
        );
      }
    };
    SQLiteText = class extends SQLiteColumn {
      static {
        __name(this, "SQLiteText");
      }
      static [entityKind] = "SQLiteText";
      enumValues = this.config.enumValues;
      length = this.config.length;
      constructor(table, config) {
        super(table, config);
      }
      getSQLType() {
        return `text${this.config.length ? `(${this.config.length})` : ""}`;
      }
    };
    SQLiteTextJsonBuilder = class extends SQLiteColumnBuilder {
      static {
        __name(this, "SQLiteTextJsonBuilder");
      }
      static [entityKind] = "SQLiteTextJsonBuilder";
      constructor(name) {
        super(name, "json", "SQLiteTextJson");
      }
      /** @internal */
      build(table) {
        return new SQLiteTextJson(
          table,
          this.config
        );
      }
    };
    SQLiteTextJson = class extends SQLiteColumn {
      static {
        __name(this, "SQLiteTextJson");
      }
      static [entityKind] = "SQLiteTextJson";
      getSQLType() {
        return "text";
      }
      mapFromDriverValue(value) {
        return JSON.parse(value);
      }
      mapToDriverValue(value) {
        return JSON.stringify(value);
      }
    };
    __name(text, "text");
  }
});

// ../node_modules/drizzle-orm/sqlite-core/columns/all.js
function getSQLiteColumnBuilders() {
  return {
    blob,
    customType,
    integer,
    numeric,
    real,
    text
  };
}
var init_all = __esm({
  "../node_modules/drizzle-orm/sqlite-core/columns/all.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_blob();
    init_custom();
    init_integer();
    init_numeric();
    init_real();
    init_text();
    __name(getSQLiteColumnBuilders, "getSQLiteColumnBuilders");
  }
});

// ../node_modules/drizzle-orm/sqlite-core/table.js
function sqliteTableBase(name, columns, extraConfig, schema, baseName = name) {
  const rawTable = new SQLiteTable(name, schema, baseName);
  const parsedColumns = typeof columns === "function" ? columns(getSQLiteColumnBuilders()) : columns;
  const builtColumns = Object.fromEntries(
    Object.entries(parsedColumns).map(([name2, colBuilderBase]) => {
      const colBuilder = colBuilderBase;
      colBuilder.setName(name2);
      const column = colBuilder.build(rawTable);
      rawTable[InlineForeignKeys2].push(...colBuilder.buildForeignKeys(column, rawTable));
      return [name2, column];
    })
  );
  const table = Object.assign(rawTable, builtColumns);
  table[Table.Symbol.Columns] = builtColumns;
  table[Table.Symbol.ExtraConfigColumns] = builtColumns;
  if (extraConfig) {
    table[SQLiteTable.Symbol.ExtraConfigBuilder] = extraConfig;
  }
  return table;
}
var InlineForeignKeys2, SQLiteTable, sqliteTable;
var init_table3 = __esm({
  "../node_modules/drizzle-orm/sqlite-core/table.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_table();
    init_all();
    InlineForeignKeys2 = /* @__PURE__ */ Symbol.for("drizzle:SQLiteInlineForeignKeys");
    SQLiteTable = class extends Table {
      static {
        __name(this, "SQLiteTable");
      }
      static [entityKind] = "SQLiteTable";
      /** @internal */
      static Symbol = Object.assign({}, Table.Symbol, {
        InlineForeignKeys: InlineForeignKeys2
      });
      /** @internal */
      [Table.Symbol.Columns];
      /** @internal */
      [InlineForeignKeys2] = [];
      /** @internal */
      [Table.Symbol.ExtraConfigBuilder] = void 0;
    };
    __name(sqliteTableBase, "sqliteTableBase");
    sqliteTable = /* @__PURE__ */ __name((name, columns, extraConfig) => {
      return sqliteTableBase(name, columns, extraConfig);
    }, "sqliteTable");
  }
});

// ../node_modules/drizzle-orm/sqlite-core/checks.js
var CheckBuilder, Check;
var init_checks = __esm({
  "../node_modules/drizzle-orm/sqlite-core/checks.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    CheckBuilder = class {
      static {
        __name(this, "CheckBuilder");
      }
      constructor(name, value) {
        this.name = name;
        this.value = value;
      }
      static [entityKind] = "SQLiteCheckBuilder";
      brand;
      build(table) {
        return new Check(table, this);
      }
    };
    Check = class {
      static {
        __name(this, "Check");
      }
      constructor(table, builder) {
        this.table = table;
        this.name = builder.name;
        this.value = builder.value;
      }
      static [entityKind] = "SQLiteCheck";
      name;
      value;
    };
  }
});

// ../node_modules/drizzle-orm/sqlite-core/indexes.js
function index(name) {
  return new IndexBuilderOn(name, false);
}
var IndexBuilderOn, IndexBuilder, Index;
var init_indexes = __esm({
  "../node_modules/drizzle-orm/sqlite-core/indexes.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    IndexBuilderOn = class {
      static {
        __name(this, "IndexBuilderOn");
      }
      constructor(name, unique) {
        this.name = name;
        this.unique = unique;
      }
      static [entityKind] = "SQLiteIndexBuilderOn";
      on(...columns) {
        return new IndexBuilder(this.name, columns, this.unique);
      }
    };
    IndexBuilder = class {
      static {
        __name(this, "IndexBuilder");
      }
      static [entityKind] = "SQLiteIndexBuilder";
      /** @internal */
      config;
      constructor(name, columns, unique) {
        this.config = {
          name,
          columns,
          unique,
          where: void 0
        };
      }
      /**
       * Condition for partial index.
       */
      where(condition) {
        this.config.where = condition;
        return this;
      }
      /** @internal */
      build(table) {
        return new Index(this.config, table);
      }
    };
    Index = class {
      static {
        __name(this, "Index");
      }
      static [entityKind] = "SQLiteIndex";
      config;
      constructor(config, table) {
        this.config = { ...config, table };
      }
    };
    __name(index, "index");
  }
});

// ../node_modules/drizzle-orm/sqlite-core/primary-keys.js
var PrimaryKeyBuilder2, PrimaryKey2;
var init_primary_keys2 = __esm({
  "../node_modules/drizzle-orm/sqlite-core/primary-keys.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_table3();
    PrimaryKeyBuilder2 = class {
      static {
        __name(this, "PrimaryKeyBuilder");
      }
      static [entityKind] = "SQLitePrimaryKeyBuilder";
      /** @internal */
      columns;
      /** @internal */
      name;
      constructor(columns, name) {
        this.columns = columns;
        this.name = name;
      }
      /** @internal */
      build(table) {
        return new PrimaryKey2(table, this.columns, this.name);
      }
    };
    PrimaryKey2 = class {
      static {
        __name(this, "PrimaryKey");
      }
      constructor(table, columns, name) {
        this.table = table;
        this.columns = columns;
        this.name = name;
      }
      static [entityKind] = "SQLitePrimaryKey";
      columns;
      name;
      getName() {
        return this.name ?? `${this.table[SQLiteTable.Symbol.Name]}_${this.columns.map((column) => column.name).join("_")}_pk`;
      }
    };
  }
});

// ../node_modules/drizzle-orm/sqlite-core/utils.js
function extractUsedTable(table) {
  if (is(table, SQLiteTable)) {
    return [`${table[Table.Symbol.BaseName]}`];
  }
  if (is(table, Subquery)) {
    return table._.usedTables ?? [];
  }
  if (is(table, SQL)) {
    return table.usedTables ?? [];
  }
  return [];
}
var init_utils2 = __esm({
  "../node_modules/drizzle-orm/sqlite-core/utils.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_sql2();
    init_subquery();
    init_table();
    init_table3();
    __name(extractUsedTable, "extractUsedTable");
  }
});

// ../node_modules/drizzle-orm/sqlite-core/query-builders/delete.js
var SQLiteDeleteBase;
var init_delete = __esm({
  "../node_modules/drizzle-orm/sqlite-core/query-builders/delete.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_query_promise();
    init_selection_proxy();
    init_table3();
    init_table();
    init_utils();
    init_utils2();
    SQLiteDeleteBase = class extends QueryPromise {
      static {
        __name(this, "SQLiteDeleteBase");
      }
      constructor(table, session, dialect, withList) {
        super();
        this.table = table;
        this.session = session;
        this.dialect = dialect;
        this.config = { table, withList };
      }
      static [entityKind] = "SQLiteDelete";
      /** @internal */
      config;
      /**
       * Adds a `where` clause to the query.
       *
       * Calling this method will delete only those rows that fulfill a specified condition.
       *
       * See docs: {@link https://orm.drizzle.team/docs/delete}
       *
       * @param where the `where` clause.
       *
       * @example
       * You can use conditional operators and `sql function` to filter the rows to be deleted.
       *
       * ```ts
       * // Delete all cars with green color
       * db.delete(cars).where(eq(cars.color, 'green'));
       * // or
       * db.delete(cars).where(sql`${cars.color} = 'green'`)
       * ```
       *
       * You can logically combine conditional operators with `and()` and `or()` operators:
       *
       * ```ts
       * // Delete all BMW cars with a green color
       * db.delete(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
       *
       * // Delete all cars with the green or blue color
       * db.delete(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
       * ```
       */
      where(where) {
        this.config.where = where;
        return this;
      }
      orderBy(...columns) {
        if (typeof columns[0] === "function") {
          const orderBy = columns[0](
            new Proxy(
              this.config.table[Table.Symbol.Columns],
              new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
            )
          );
          const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
          this.config.orderBy = orderByArray;
        } else {
          const orderByArray = columns;
          this.config.orderBy = orderByArray;
        }
        return this;
      }
      limit(limit) {
        this.config.limit = limit;
        return this;
      }
      returning(fields = this.table[SQLiteTable.Symbol.Columns]) {
        this.config.returning = orderSelectedFields(fields);
        return this;
      }
      /** @internal */
      getSQL() {
        return this.dialect.buildDeleteQuery(this.config);
      }
      toSQL() {
        const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
        return rest;
      }
      /** @internal */
      _prepare(isOneTimeQuery = true) {
        return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
          this.dialect.sqlToQuery(this.getSQL()),
          this.config.returning,
          this.config.returning ? "all" : "run",
          true,
          void 0,
          {
            type: "delete",
            tables: extractUsedTable(this.config.table)
          }
        );
      }
      prepare() {
        return this._prepare(false);
      }
      run = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().run(placeholderValues);
      }, "run");
      all = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().all(placeholderValues);
      }, "all");
      get = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().get(placeholderValues);
      }, "get");
      values = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().values(placeholderValues);
      }, "values");
      async execute(placeholderValues) {
        return this._prepare().execute(placeholderValues);
      }
      $dynamic() {
        return this;
      }
    };
  }
});

// ../node_modules/drizzle-orm/casing.js
function toSnakeCase(input) {
  const words = input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? [];
  return words.map((word) => word.toLowerCase()).join("_");
}
function toCamelCase(input) {
  const words = input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? [];
  return words.reduce((acc, word, i) => {
    const formattedWord = i === 0 ? word.toLowerCase() : `${word[0].toUpperCase()}${word.slice(1)}`;
    return acc + formattedWord;
  }, "");
}
function noopCase(input) {
  return input;
}
var CasingCache;
var init_casing = __esm({
  "../node_modules/drizzle-orm/casing.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_table();
    __name(toSnakeCase, "toSnakeCase");
    __name(toCamelCase, "toCamelCase");
    __name(noopCase, "noopCase");
    CasingCache = class {
      static {
        __name(this, "CasingCache");
      }
      static [entityKind] = "CasingCache";
      /** @internal */
      cache = {};
      cachedTables = {};
      convert;
      constructor(casing) {
        this.convert = casing === "snake_case" ? toSnakeCase : casing === "camelCase" ? toCamelCase : noopCase;
      }
      getColumnCasing(column) {
        if (!column.keyAsName) return column.name;
        const schema = column.table[Table.Symbol.Schema] ?? "public";
        const tableName = column.table[Table.Symbol.OriginalName];
        const key = `${schema}.${tableName}.${column.name}`;
        if (!this.cache[key]) {
          this.cacheTable(column.table);
        }
        return this.cache[key];
      }
      cacheTable(table) {
        const schema = table[Table.Symbol.Schema] ?? "public";
        const tableName = table[Table.Symbol.OriginalName];
        const tableKey = `${schema}.${tableName}`;
        if (!this.cachedTables[tableKey]) {
          for (const column of Object.values(table[Table.Symbol.Columns])) {
            const columnKey = `${tableKey}.${column.name}`;
            this.cache[columnKey] = this.convert(column.name);
          }
          this.cachedTables[tableKey] = true;
        }
      }
      clearCache() {
        this.cache = {};
        this.cachedTables = {};
      }
    };
  }
});

// ../node_modules/drizzle-orm/errors.js
var DrizzleError, DrizzleQueryError, TransactionRollbackError;
var init_errors2 = __esm({
  "../node_modules/drizzle-orm/errors.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    DrizzleError = class extends Error {
      static {
        __name(this, "DrizzleError");
      }
      static [entityKind] = "DrizzleError";
      constructor({ message, cause }) {
        super(message);
        this.name = "DrizzleError";
        this.cause = cause;
      }
    };
    DrizzleQueryError = class _DrizzleQueryError extends Error {
      static {
        __name(this, "DrizzleQueryError");
      }
      constructor(query, params, cause) {
        super(`Failed query: ${query}
params: ${params}`);
        this.query = query;
        this.params = params;
        this.cause = cause;
        Error.captureStackTrace(this, _DrizzleQueryError);
        if (cause) this.cause = cause;
      }
    };
    TransactionRollbackError = class extends DrizzleError {
      static {
        __name(this, "TransactionRollbackError");
      }
      static [entityKind] = "TransactionRollbackError";
      constructor() {
        super({ message: "Rollback" });
      }
    };
  }
});

// ../node_modules/drizzle-orm/sql/functions/aggregate.js
function count(expression) {
  return sql`count(${expression || sql.raw("*")})`.mapWith(Number);
}
var init_aggregate = __esm({
  "../node_modules/drizzle-orm/sql/functions/aggregate.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_sql2();
    __name(count, "count");
  }
});

// ../node_modules/drizzle-orm/sql/functions/vector.js
var init_vector = __esm({
  "../node_modules/drizzle-orm/sql/functions/vector.js"() {
    init_functionsRoutes_0_6398490784585695();
  }
});

// ../node_modules/drizzle-orm/sql/functions/index.js
var init_functions = __esm({
  "../node_modules/drizzle-orm/sql/functions/index.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_aggregate();
    init_vector();
  }
});

// ../node_modules/drizzle-orm/sql/index.js
var init_sql3 = __esm({
  "../node_modules/drizzle-orm/sql/index.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_expressions();
    init_functions();
    init_sql2();
  }
});

// ../node_modules/drizzle-orm/sqlite-core/columns/index.js
var init_columns = __esm({
  "../node_modules/drizzle-orm/sqlite-core/columns/index.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_blob();
    init_common2();
    init_custom();
    init_integer();
    init_numeric();
    init_real();
    init_text();
  }
});

// ../node_modules/drizzle-orm/sqlite-core/view-base.js
var SQLiteViewBase;
var init_view_base = __esm({
  "../node_modules/drizzle-orm/sqlite-core/view-base.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_sql2();
    SQLiteViewBase = class extends View {
      static {
        __name(this, "SQLiteViewBase");
      }
      static [entityKind] = "SQLiteViewBase";
    };
  }
});

// ../node_modules/drizzle-orm/sqlite-core/dialect.js
var SQLiteDialect, SQLiteSyncDialect, SQLiteAsyncDialect;
var init_dialect = __esm({
  "../node_modules/drizzle-orm/sqlite-core/dialect.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_alias();
    init_casing();
    init_column();
    init_entity();
    init_errors2();
    init_relations();
    init_sql3();
    init_sql2();
    init_columns();
    init_table3();
    init_subquery();
    init_table();
    init_utils();
    init_view_common();
    init_view_base();
    SQLiteDialect = class {
      static {
        __name(this, "SQLiteDialect");
      }
      static [entityKind] = "SQLiteDialect";
      /** @internal */
      casing;
      constructor(config) {
        this.casing = new CasingCache(config?.casing);
      }
      escapeName(name) {
        return `"${name.replace(/"/g, '""')}"`;
      }
      escapeParam(_num) {
        return "?";
      }
      escapeString(str) {
        return `'${str.replace(/'/g, "''")}'`;
      }
      buildWithCTE(queries) {
        if (!queries?.length) return void 0;
        const withSqlChunks = [sql`with `];
        for (const [i, w] of queries.entries()) {
          withSqlChunks.push(sql`${sql.identifier(w._.alias)} as (${w._.sql})`);
          if (i < queries.length - 1) {
            withSqlChunks.push(sql`, `);
          }
        }
        withSqlChunks.push(sql` `);
        return sql.join(withSqlChunks);
      }
      buildDeleteQuery({
        table,
        where,
        returning,
        withList,
        limit,
        orderBy
      }) {
        const withSql = this.buildWithCTE(withList);
        const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
        const whereSql = where ? sql` where ${where}` : void 0;
        const orderBySql = this.buildOrderBy(orderBy);
        const limitSql = this.buildLimit(limit);
        return sql`${withSql}delete from ${table}${whereSql}${returningSql}${orderBySql}${limitSql}`;
      }
      buildUpdateSet(table, set) {
        const tableColumns = table[Table.Symbol.Columns];
        const columnNames = Object.keys(tableColumns).filter(
          (colName) => set[colName] !== void 0 || tableColumns[colName]?.onUpdateFn !== void 0
        );
        const setSize = columnNames.length;
        return sql.join(
          columnNames.flatMap((colName, i) => {
            const col = tableColumns[colName];
            const onUpdateFnResult = col.onUpdateFn?.();
            const value = set[colName] ?? (is(onUpdateFnResult, SQL) ? onUpdateFnResult : sql.param(onUpdateFnResult, col));
            const res = sql`${sql.identifier(this.casing.getColumnCasing(col))} = ${value}`;
            if (i < setSize - 1) {
              return [res, sql.raw(", ")];
            }
            return [res];
          })
        );
      }
      buildUpdateQuery({
        table,
        set,
        where,
        returning,
        withList,
        joins,
        from,
        limit,
        orderBy
      }) {
        const withSql = this.buildWithCTE(withList);
        const setSql = this.buildUpdateSet(table, set);
        const fromSql = from && sql.join([sql.raw(" from "), this.buildFromTable(from)]);
        const joinsSql = this.buildJoins(joins);
        const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
        const whereSql = where ? sql` where ${where}` : void 0;
        const orderBySql = this.buildOrderBy(orderBy);
        const limitSql = this.buildLimit(limit);
        return sql`${withSql}update ${table} set ${setSql}${fromSql}${joinsSql}${whereSql}${returningSql}${orderBySql}${limitSql}`;
      }
      /**
       * Builds selection SQL with provided fields/expressions
       *
       * Examples:
       *
       * `select <selection> from`
       *
       * `insert ... returning <selection>`
       *
       * If `isSingleTable` is true, then columns won't be prefixed with table name
       */
      buildSelection(fields, { isSingleTable = false } = {}) {
        const columnsLen = fields.length;
        const chunks = fields.flatMap(({ field }, i) => {
          const chunk = [];
          if (is(field, SQL.Aliased) && field.isSelectionField) {
            chunk.push(sql.identifier(field.fieldAlias));
          } else if (is(field, SQL.Aliased) || is(field, SQL)) {
            const query = is(field, SQL.Aliased) ? field.sql : field;
            if (isSingleTable) {
              chunk.push(
                new SQL(
                  query.queryChunks.map((c) => {
                    if (is(c, Column)) {
                      return sql.identifier(this.casing.getColumnCasing(c));
                    }
                    return c;
                  })
                )
              );
            } else {
              chunk.push(query);
            }
            if (is(field, SQL.Aliased)) {
              chunk.push(sql` as ${sql.identifier(field.fieldAlias)}`);
            }
          } else if (is(field, Column)) {
            const tableName = field.table[Table.Symbol.Name];
            if (field.columnType === "SQLiteNumericBigInt") {
              if (isSingleTable) {
                chunk.push(
                  sql`cast(${sql.identifier(this.casing.getColumnCasing(field))} as text)`
                );
              } else {
                chunk.push(
                  sql`cast(${sql.identifier(tableName)}.${sql.identifier(this.casing.getColumnCasing(field))} as text)`
                );
              }
            } else {
              if (isSingleTable) {
                chunk.push(sql.identifier(this.casing.getColumnCasing(field)));
              } else {
                chunk.push(
                  sql`${sql.identifier(tableName)}.${sql.identifier(this.casing.getColumnCasing(field))}`
                );
              }
            }
          } else if (is(field, Subquery)) {
            const entries = Object.entries(field._.selectedFields);
            if (entries.length === 1) {
              const entry = entries[0][1];
              const fieldDecoder = is(entry, SQL) ? entry.decoder : is(entry, Column) ? { mapFromDriverValue: /* @__PURE__ */ __name((v) => entry.mapFromDriverValue(v), "mapFromDriverValue") } : entry.sql.decoder;
              if (fieldDecoder) field._.sql.decoder = fieldDecoder;
            }
            chunk.push(field);
          }
          if (i < columnsLen - 1) {
            chunk.push(sql`, `);
          }
          return chunk;
        });
        return sql.join(chunks);
      }
      buildJoins(joins) {
        if (!joins || joins.length === 0) {
          return void 0;
        }
        const joinsArray = [];
        if (joins) {
          for (const [index2, joinMeta] of joins.entries()) {
            if (index2 === 0) {
              joinsArray.push(sql` `);
            }
            const table = joinMeta.table;
            const onSql = joinMeta.on ? sql` on ${joinMeta.on}` : void 0;
            if (is(table, SQLiteTable)) {
              const tableName = table[SQLiteTable.Symbol.Name];
              const tableSchema = table[SQLiteTable.Symbol.Schema];
              const origTableName = table[SQLiteTable.Symbol.OriginalName];
              const alias = tableName === origTableName ? void 0 : joinMeta.alias;
              joinsArray.push(
                sql`${sql.raw(joinMeta.joinType)} join ${tableSchema ? sql`${sql.identifier(tableSchema)}.` : void 0}${sql.identifier(
                  origTableName
                )}${alias && sql` ${sql.identifier(alias)}`}${onSql}`
              );
            } else {
              joinsArray.push(
                sql`${sql.raw(joinMeta.joinType)} join ${table}${onSql}`
              );
            }
            if (index2 < joins.length - 1) {
              joinsArray.push(sql` `);
            }
          }
        }
        return sql.join(joinsArray);
      }
      buildLimit(limit) {
        return typeof limit === "object" || typeof limit === "number" && limit >= 0 ? sql` limit ${limit}` : void 0;
      }
      buildOrderBy(orderBy) {
        const orderByList = [];
        if (orderBy) {
          for (const [index2, orderByValue] of orderBy.entries()) {
            orderByList.push(orderByValue);
            if (index2 < orderBy.length - 1) {
              orderByList.push(sql`, `);
            }
          }
        }
        return orderByList.length > 0 ? sql` order by ${sql.join(orderByList)}` : void 0;
      }
      buildFromTable(table) {
        if (is(table, Table) && table[Table.Symbol.IsAlias]) {
          return sql`${sql`${sql.identifier(table[Table.Symbol.Schema] ?? "")}.`.if(table[Table.Symbol.Schema])}${sql.identifier(
            table[Table.Symbol.OriginalName]
          )} ${sql.identifier(table[Table.Symbol.Name])}`;
        }
        return table;
      }
      buildSelectQuery({
        withList,
        fields,
        fieldsFlat,
        where,
        having,
        table,
        joins,
        orderBy,
        groupBy,
        limit,
        offset,
        distinct,
        setOperators
      }) {
        const fieldsList = fieldsFlat ?? orderSelectedFields(fields);
        for (const f of fieldsList) {
          if (is(f.field, Column) && getTableName(f.field.table) !== (is(table, Subquery) ? table._.alias : is(table, SQLiteViewBase) ? table[ViewBaseConfig].name : is(table, SQL) ? void 0 : getTableName(table)) && !((table2) => joins?.some(
            ({ alias }) => alias === (table2[Table.Symbol.IsAlias] ? getTableName(table2) : table2[Table.Symbol.BaseName])
          ))(f.field.table)) {
            const tableName = getTableName(f.field.table);
            throw new Error(
              `Your "${f.path.join(
                "->"
              )}" field references a column "${tableName}"."${f.field.name}", but the table "${tableName}" is not part of the query! Did you forget to join it?`
            );
          }
        }
        const isSingleTable = !joins || joins.length === 0;
        const withSql = this.buildWithCTE(withList);
        const distinctSql = distinct ? sql` distinct` : void 0;
        const selection = this.buildSelection(fieldsList, { isSingleTable });
        const tableSql = this.buildFromTable(table);
        const joinsSql = this.buildJoins(joins);
        const whereSql = where ? sql` where ${where}` : void 0;
        const havingSql = having ? sql` having ${having}` : void 0;
        const groupByList = [];
        if (groupBy) {
          for (const [index2, groupByValue] of groupBy.entries()) {
            groupByList.push(groupByValue);
            if (index2 < groupBy.length - 1) {
              groupByList.push(sql`, `);
            }
          }
        }
        const groupBySql = groupByList.length > 0 ? sql` group by ${sql.join(groupByList)}` : void 0;
        const orderBySql = this.buildOrderBy(orderBy);
        const limitSql = this.buildLimit(limit);
        const offsetSql = offset ? sql` offset ${offset}` : void 0;
        const finalQuery = sql`${withSql}select${distinctSql} ${selection} from ${tableSql}${joinsSql}${whereSql}${groupBySql}${havingSql}${orderBySql}${limitSql}${offsetSql}`;
        if (setOperators.length > 0) {
          return this.buildSetOperations(finalQuery, setOperators);
        }
        return finalQuery;
      }
      buildSetOperations(leftSelect, setOperators) {
        const [setOperator, ...rest] = setOperators;
        if (!setOperator) {
          throw new Error("Cannot pass undefined values to any set operator");
        }
        if (rest.length === 0) {
          return this.buildSetOperationQuery({ leftSelect, setOperator });
        }
        return this.buildSetOperations(
          this.buildSetOperationQuery({ leftSelect, setOperator }),
          rest
        );
      }
      buildSetOperationQuery({
        leftSelect,
        setOperator: { type, isAll, rightSelect, limit, orderBy, offset }
      }) {
        const leftChunk = sql`${leftSelect.getSQL()} `;
        const rightChunk = sql`${rightSelect.getSQL()}`;
        let orderBySql;
        if (orderBy && orderBy.length > 0) {
          const orderByValues = [];
          for (const singleOrderBy of orderBy) {
            if (is(singleOrderBy, SQLiteColumn)) {
              orderByValues.push(sql.identifier(singleOrderBy.name));
            } else if (is(singleOrderBy, SQL)) {
              for (let i = 0; i < singleOrderBy.queryChunks.length; i++) {
                const chunk = singleOrderBy.queryChunks[i];
                if (is(chunk, SQLiteColumn)) {
                  singleOrderBy.queryChunks[i] = sql.identifier(
                    this.casing.getColumnCasing(chunk)
                  );
                }
              }
              orderByValues.push(sql`${singleOrderBy}`);
            } else {
              orderByValues.push(sql`${singleOrderBy}`);
            }
          }
          orderBySql = sql` order by ${sql.join(orderByValues, sql`, `)}`;
        }
        const limitSql = typeof limit === "object" || typeof limit === "number" && limit >= 0 ? sql` limit ${limit}` : void 0;
        const operatorChunk = sql.raw(`${type} ${isAll ? "all " : ""}`);
        const offsetSql = offset ? sql` offset ${offset}` : void 0;
        return sql`${leftChunk}${operatorChunk}${rightChunk}${orderBySql}${limitSql}${offsetSql}`;
      }
      buildInsertQuery({
        table,
        values: valuesOrSelect,
        onConflict,
        returning,
        withList,
        select
      }) {
        const valuesSqlList = [];
        const columns = table[Table.Symbol.Columns];
        const colEntries = Object.entries(columns).filter(
          ([_, col]) => !col.shouldDisableInsert()
        );
        const insertOrder = colEntries.map(([, column]) => sql.identifier(this.casing.getColumnCasing(column)));
        if (select) {
          const select2 = valuesOrSelect;
          if (is(select2, SQL)) {
            valuesSqlList.push(select2);
          } else {
            valuesSqlList.push(select2.getSQL());
          }
        } else {
          const values = valuesOrSelect;
          valuesSqlList.push(sql.raw("values "));
          for (const [valueIndex, value] of values.entries()) {
            const valueList = [];
            for (const [fieldName, col] of colEntries) {
              const colValue = value[fieldName];
              if (colValue === void 0 || is(colValue, Param) && colValue.value === void 0) {
                let defaultValue;
                if (col.default !== null && col.default !== void 0) {
                  defaultValue = is(col.default, SQL) ? col.default : sql.param(col.default, col);
                } else if (col.defaultFn !== void 0) {
                  const defaultFnResult = col.defaultFn();
                  defaultValue = is(defaultFnResult, SQL) ? defaultFnResult : sql.param(defaultFnResult, col);
                } else if (!col.default && col.onUpdateFn !== void 0) {
                  const onUpdateFnResult = col.onUpdateFn();
                  defaultValue = is(onUpdateFnResult, SQL) ? onUpdateFnResult : sql.param(onUpdateFnResult, col);
                } else {
                  defaultValue = sql`null`;
                }
                valueList.push(defaultValue);
              } else {
                valueList.push(colValue);
              }
            }
            valuesSqlList.push(valueList);
            if (valueIndex < values.length - 1) {
              valuesSqlList.push(sql`, `);
            }
          }
        }
        const withSql = this.buildWithCTE(withList);
        const valuesSql = sql.join(valuesSqlList);
        const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
        const onConflictSql = onConflict?.length ? sql.join(onConflict) : void 0;
        return sql`${withSql}insert into ${table} ${insertOrder} ${valuesSql}${onConflictSql}${returningSql}`;
      }
      sqlToQuery(sql2, invokeSource) {
        return sql2.toQuery({
          casing: this.casing,
          escapeName: this.escapeName,
          escapeParam: this.escapeParam,
          escapeString: this.escapeString,
          invokeSource
        });
      }
      buildRelationalQuery({
        fullSchema,
        schema,
        tableNamesMap,
        table,
        tableConfig,
        queryConfig: config,
        tableAlias,
        nestedQueryRelation,
        joinOn
      }) {
        let selection = [];
        let limit, offset, orderBy = [], where;
        const joins = [];
        if (config === true) {
          const selectionEntries = Object.entries(tableConfig.columns);
          selection = selectionEntries.map(([key, value]) => ({
            dbKey: value.name,
            tsKey: key,
            field: aliasedTableColumn(value, tableAlias),
            relationTableTsKey: void 0,
            isJson: false,
            selection: []
          }));
        } else {
          const aliasedColumns = Object.fromEntries(
            Object.entries(tableConfig.columns).map(([key, value]) => [
              key,
              aliasedTableColumn(value, tableAlias)
            ])
          );
          if (config.where) {
            const whereSql = typeof config.where === "function" ? config.where(aliasedColumns, getOperators()) : config.where;
            where = whereSql && mapColumnsInSQLToAlias(whereSql, tableAlias);
          }
          const fieldsSelection = [];
          let selectedColumns = [];
          if (config.columns) {
            let isIncludeMode = false;
            for (const [field, value] of Object.entries(config.columns)) {
              if (value === void 0) {
                continue;
              }
              if (field in tableConfig.columns) {
                if (!isIncludeMode && value === true) {
                  isIncludeMode = true;
                }
                selectedColumns.push(field);
              }
            }
            if (selectedColumns.length > 0) {
              selectedColumns = isIncludeMode ? selectedColumns.filter((c) => config.columns?.[c] === true) : Object.keys(tableConfig.columns).filter(
                (key) => !selectedColumns.includes(key)
              );
            }
          } else {
            selectedColumns = Object.keys(tableConfig.columns);
          }
          for (const field of selectedColumns) {
            const column = tableConfig.columns[field];
            fieldsSelection.push({ tsKey: field, value: column });
          }
          let selectedRelations = [];
          if (config.with) {
            selectedRelations = Object.entries(config.with).filter(
              (entry) => !!entry[1]
            ).map(([tsKey, queryConfig]) => ({
              tsKey,
              queryConfig,
              relation: tableConfig.relations[tsKey]
            }));
          }
          let extras;
          if (config.extras) {
            extras = typeof config.extras === "function" ? config.extras(aliasedColumns, { sql }) : config.extras;
            for (const [tsKey, value] of Object.entries(extras)) {
              fieldsSelection.push({
                tsKey,
                value: mapColumnsInAliasedSQLToAlias(value, tableAlias)
              });
            }
          }
          for (const { tsKey, value } of fieldsSelection) {
            selection.push({
              dbKey: is(value, SQL.Aliased) ? value.fieldAlias : tableConfig.columns[tsKey].name,
              tsKey,
              field: is(value, Column) ? aliasedTableColumn(value, tableAlias) : value,
              relationTableTsKey: void 0,
              isJson: false,
              selection: []
            });
          }
          let orderByOrig = typeof config.orderBy === "function" ? config.orderBy(aliasedColumns, getOrderByOperators()) : config.orderBy ?? [];
          if (!Array.isArray(orderByOrig)) {
            orderByOrig = [orderByOrig];
          }
          orderBy = orderByOrig.map((orderByValue) => {
            if (is(orderByValue, Column)) {
              return aliasedTableColumn(orderByValue, tableAlias);
            }
            return mapColumnsInSQLToAlias(orderByValue, tableAlias);
          });
          limit = config.limit;
          offset = config.offset;
          for (const {
            tsKey: selectedRelationTsKey,
            queryConfig: selectedRelationConfigValue,
            relation
          } of selectedRelations) {
            const normalizedRelation = normalizeRelation(
              schema,
              tableNamesMap,
              relation
            );
            const relationTableName = getTableUniqueName(relation.referencedTable);
            const relationTableTsName = tableNamesMap[relationTableName];
            const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
            const joinOn2 = and(
              ...normalizedRelation.fields.map(
                (field2, i) => eq(
                  aliasedTableColumn(
                    normalizedRelation.references[i],
                    relationTableAlias
                  ),
                  aliasedTableColumn(field2, tableAlias)
                )
              )
            );
            const builtRelation = this.buildRelationalQuery({
              fullSchema,
              schema,
              tableNamesMap,
              table: fullSchema[relationTableTsName],
              tableConfig: schema[relationTableTsName],
              queryConfig: is(relation, One) ? selectedRelationConfigValue === true ? { limit: 1 } : { ...selectedRelationConfigValue, limit: 1 } : selectedRelationConfigValue,
              tableAlias: relationTableAlias,
              joinOn: joinOn2,
              nestedQueryRelation: relation
            });
            const field = sql`(${builtRelation.sql})`.as(selectedRelationTsKey);
            selection.push({
              dbKey: selectedRelationTsKey,
              tsKey: selectedRelationTsKey,
              field,
              relationTableTsKey: relationTableTsName,
              isJson: true,
              selection: builtRelation.selection
            });
          }
        }
        if (selection.length === 0) {
          throw new DrizzleError({
            message: `No fields selected for table "${tableConfig.tsName}" ("${tableAlias}"). You need to have at least one item in "columns", "with" or "extras". If you need to select all columns, omit the "columns" key or set it to undefined.`
          });
        }
        let result;
        where = and(joinOn, where);
        if (nestedQueryRelation) {
          let field = sql`json_array(${sql.join(
            selection.map(
              ({ field: field2 }) => is(field2, SQLiteColumn) ? sql.identifier(this.casing.getColumnCasing(field2)) : is(field2, SQL.Aliased) ? field2.sql : field2
            ),
            sql`, `
          )})`;
          if (is(nestedQueryRelation, Many)) {
            field = sql`coalesce(json_group_array(${field}), json_array())`;
          }
          const nestedSelection = [
            {
              dbKey: "data",
              tsKey: "data",
              field: field.as("data"),
              isJson: true,
              relationTableTsKey: tableConfig.tsName,
              selection
            }
          ];
          const needsSubquery = limit !== void 0 || offset !== void 0 || orderBy.length > 0;
          if (needsSubquery) {
            result = this.buildSelectQuery({
              table: aliasedTable(table, tableAlias),
              fields: {},
              fieldsFlat: [
                {
                  path: [],
                  field: sql.raw("*")
                }
              ],
              where,
              limit,
              offset,
              orderBy,
              setOperators: []
            });
            where = void 0;
            limit = void 0;
            offset = void 0;
            orderBy = void 0;
          } else {
            result = aliasedTable(table, tableAlias);
          }
          result = this.buildSelectQuery({
            table: is(result, SQLiteTable) ? result : new Subquery(result, {}, tableAlias),
            fields: {},
            fieldsFlat: nestedSelection.map(({ field: field2 }) => ({
              path: [],
              field: is(field2, Column) ? aliasedTableColumn(field2, tableAlias) : field2
            })),
            joins,
            where,
            limit,
            offset,
            orderBy,
            setOperators: []
          });
        } else {
          result = this.buildSelectQuery({
            table: aliasedTable(table, tableAlias),
            fields: {},
            fieldsFlat: selection.map(({ field }) => ({
              path: [],
              field: is(field, Column) ? aliasedTableColumn(field, tableAlias) : field
            })),
            joins,
            where,
            limit,
            offset,
            orderBy,
            setOperators: []
          });
        }
        return {
          tableTsKey: tableConfig.tsName,
          sql: result,
          selection
        };
      }
    };
    SQLiteSyncDialect = class extends SQLiteDialect {
      static {
        __name(this, "SQLiteSyncDialect");
      }
      static [entityKind] = "SQLiteSyncDialect";
      migrate(migrations, session, config) {
        const migrationsTable = config === void 0 ? "__drizzle_migrations" : typeof config === "string" ? "__drizzle_migrations" : config.migrationsTable ?? "__drizzle_migrations";
        const migrationTableCreate = sql`
			CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsTable)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			)
		`;
        session.run(migrationTableCreate);
        const dbMigrations = session.values(
          sql`SELECT id, hash, created_at FROM ${sql.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`
        );
        const lastDbMigration = dbMigrations[0] ?? void 0;
        session.run(sql`BEGIN`);
        try {
          for (const migration of migrations) {
            if (!lastDbMigration || Number(lastDbMigration[2]) < migration.folderMillis) {
              for (const stmt of migration.sql) {
                session.run(sql.raw(stmt));
              }
              session.run(
                sql`INSERT INTO ${sql.identifier(
                  migrationsTable
                )} ("hash", "created_at") VALUES(${migration.hash}, ${migration.folderMillis})`
              );
            }
          }
          session.run(sql`COMMIT`);
        } catch (e) {
          session.run(sql`ROLLBACK`);
          throw e;
        }
      }
    };
    SQLiteAsyncDialect = class extends SQLiteDialect {
      static {
        __name(this, "SQLiteAsyncDialect");
      }
      static [entityKind] = "SQLiteAsyncDialect";
      async migrate(migrations, session, config) {
        const migrationsTable = config === void 0 ? "__drizzle_migrations" : typeof config === "string" ? "__drizzle_migrations" : config.migrationsTable ?? "__drizzle_migrations";
        const migrationTableCreate = sql`
			CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsTable)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			)
		`;
        await session.run(migrationTableCreate);
        const dbMigrations = await session.values(
          sql`SELECT id, hash, created_at FROM ${sql.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`
        );
        const lastDbMigration = dbMigrations[0] ?? void 0;
        await session.transaction(async (tx) => {
          for (const migration of migrations) {
            if (!lastDbMigration || Number(lastDbMigration[2]) < migration.folderMillis) {
              for (const stmt of migration.sql) {
                await tx.run(sql.raw(stmt));
              }
              await tx.run(
                sql`INSERT INTO ${sql.identifier(
                  migrationsTable
                )} ("hash", "created_at") VALUES(${migration.hash}, ${migration.folderMillis})`
              );
            }
          }
        });
      }
    };
  }
});

// ../node_modules/drizzle-orm/query-builders/query-builder.js
var TypedQueryBuilder;
var init_query_builder = __esm({
  "../node_modules/drizzle-orm/query-builders/query-builder.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    TypedQueryBuilder = class {
      static {
        __name(this, "TypedQueryBuilder");
      }
      static [entityKind] = "TypedQueryBuilder";
      /** @internal */
      getSelectedFields() {
        return this._.selectedFields;
      }
    };
  }
});

// ../node_modules/drizzle-orm/sqlite-core/query-builders/select.js
function createSetOperator(type, isAll) {
  return (leftSelect, rightSelect, ...restSelects) => {
    const setOperators = [rightSelect, ...restSelects].map((select) => ({
      type,
      isAll,
      rightSelect: select
    }));
    for (const setOperator of setOperators) {
      if (!haveSameKeys(leftSelect.getSelectedFields(), setOperator.rightSelect.getSelectedFields())) {
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
      }
    }
    return leftSelect.addSetOperators(setOperators);
  };
}
var SQLiteSelectBuilder, SQLiteSelectQueryBuilderBase, SQLiteSelectBase, getSQLiteSetOperators, union, unionAll, intersect, except;
var init_select2 = __esm({
  "../node_modules/drizzle-orm/sqlite-core/query-builders/select.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_query_builder();
    init_query_promise();
    init_selection_proxy();
    init_sql2();
    init_subquery();
    init_table();
    init_utils();
    init_view_common();
    init_utils2();
    init_view_base();
    SQLiteSelectBuilder = class {
      static {
        __name(this, "SQLiteSelectBuilder");
      }
      static [entityKind] = "SQLiteSelectBuilder";
      fields;
      session;
      dialect;
      withList;
      distinct;
      constructor(config) {
        this.fields = config.fields;
        this.session = config.session;
        this.dialect = config.dialect;
        this.withList = config.withList;
        this.distinct = config.distinct;
      }
      from(source) {
        const isPartialSelect = !!this.fields;
        let fields;
        if (this.fields) {
          fields = this.fields;
        } else if (is(source, Subquery)) {
          fields = Object.fromEntries(
            Object.keys(source._.selectedFields).map((key) => [key, source[key]])
          );
        } else if (is(source, SQLiteViewBase)) {
          fields = source[ViewBaseConfig].selectedFields;
        } else if (is(source, SQL)) {
          fields = {};
        } else {
          fields = getTableColumns(source);
        }
        return new SQLiteSelectBase({
          table: source,
          fields,
          isPartialSelect,
          session: this.session,
          dialect: this.dialect,
          withList: this.withList,
          distinct: this.distinct
        });
      }
    };
    SQLiteSelectQueryBuilderBase = class extends TypedQueryBuilder {
      static {
        __name(this, "SQLiteSelectQueryBuilderBase");
      }
      static [entityKind] = "SQLiteSelectQueryBuilder";
      _;
      /** @internal */
      config;
      joinsNotNullableMap;
      tableName;
      isPartialSelect;
      session;
      dialect;
      cacheConfig = void 0;
      usedTables = /* @__PURE__ */ new Set();
      constructor({ table, fields, isPartialSelect, session, dialect, withList, distinct }) {
        super();
        this.config = {
          withList,
          table,
          fields: { ...fields },
          distinct,
          setOperators: []
        };
        this.isPartialSelect = isPartialSelect;
        this.session = session;
        this.dialect = dialect;
        this._ = {
          selectedFields: fields,
          config: this.config
        };
        this.tableName = getTableLikeName(table);
        this.joinsNotNullableMap = typeof this.tableName === "string" ? { [this.tableName]: true } : {};
        for (const item of extractUsedTable(table)) this.usedTables.add(item);
      }
      /** @internal */
      getUsedTables() {
        return [...this.usedTables];
      }
      createJoin(joinType) {
        return (table, on) => {
          const baseTableName = this.tableName;
          const tableName = getTableLikeName(table);
          for (const item of extractUsedTable(table)) this.usedTables.add(item);
          if (typeof tableName === "string" && this.config.joins?.some((join) => join.alias === tableName)) {
            throw new Error(`Alias "${tableName}" is already used in this query`);
          }
          if (!this.isPartialSelect) {
            if (Object.keys(this.joinsNotNullableMap).length === 1 && typeof baseTableName === "string") {
              this.config.fields = {
                [baseTableName]: this.config.fields
              };
            }
            if (typeof tableName === "string" && !is(table, SQL)) {
              const selection = is(table, Subquery) ? table._.selectedFields : is(table, View) ? table[ViewBaseConfig].selectedFields : table[Table.Symbol.Columns];
              this.config.fields[tableName] = selection;
            }
          }
          if (typeof on === "function") {
            on = on(
              new Proxy(
                this.config.fields,
                new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
              )
            );
          }
          if (!this.config.joins) {
            this.config.joins = [];
          }
          this.config.joins.push({ on, table, joinType, alias: tableName });
          if (typeof tableName === "string") {
            switch (joinType) {
              case "left": {
                this.joinsNotNullableMap[tableName] = false;
                break;
              }
              case "right": {
                this.joinsNotNullableMap = Object.fromEntries(
                  Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
                );
                this.joinsNotNullableMap[tableName] = true;
                break;
              }
              case "cross":
              case "inner": {
                this.joinsNotNullableMap[tableName] = true;
                break;
              }
              case "full": {
                this.joinsNotNullableMap = Object.fromEntries(
                  Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
                );
                this.joinsNotNullableMap[tableName] = false;
                break;
              }
            }
          }
          return this;
        };
      }
      /**
       * Executes a `left join` operation by adding another table to the current query.
       *
       * Calling this method associates each row of the table with the corresponding row from the joined table, if a match is found. If no matching row exists, it sets all columns of the joined table to null.
       *
       * See docs: {@link https://orm.drizzle.team/docs/joins#left-join}
       *
       * @param table the table to join.
       * @param on the `on` clause.
       *
       * @example
       *
       * ```ts
       * // Select all users and their pets
       * const usersWithPets: { user: User; pets: Pet | null; }[] = await db.select()
       *   .from(users)
       *   .leftJoin(pets, eq(users.id, pets.ownerId))
       *
       * // Select userId and petId
       * const usersIdsAndPetIds: { userId: number; petId: number | null; }[] = await db.select({
       *   userId: users.id,
       *   petId: pets.id,
       * })
       *   .from(users)
       *   .leftJoin(pets, eq(users.id, pets.ownerId))
       * ```
       */
      leftJoin = this.createJoin("left");
      /**
       * Executes a `right join` operation by adding another table to the current query.
       *
       * Calling this method associates each row of the joined table with the corresponding row from the main table, if a match is found. If no matching row exists, it sets all columns of the main table to null.
       *
       * See docs: {@link https://orm.drizzle.team/docs/joins#right-join}
       *
       * @param table the table to join.
       * @param on the `on` clause.
       *
       * @example
       *
       * ```ts
       * // Select all users and their pets
       * const usersWithPets: { user: User | null; pets: Pet; }[] = await db.select()
       *   .from(users)
       *   .rightJoin(pets, eq(users.id, pets.ownerId))
       *
       * // Select userId and petId
       * const usersIdsAndPetIds: { userId: number | null; petId: number; }[] = await db.select({
       *   userId: users.id,
       *   petId: pets.id,
       * })
       *   .from(users)
       *   .rightJoin(pets, eq(users.id, pets.ownerId))
       * ```
       */
      rightJoin = this.createJoin("right");
      /**
       * Executes an `inner join` operation, creating a new table by combining rows from two tables that have matching values.
       *
       * Calling this method retrieves rows that have corresponding entries in both joined tables. Rows without matching entries in either table are excluded, resulting in a table that includes only matching pairs.
       *
       * See docs: {@link https://orm.drizzle.team/docs/joins#inner-join}
       *
       * @param table the table to join.
       * @param on the `on` clause.
       *
       * @example
       *
       * ```ts
       * // Select all users and their pets
       * const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
       *   .from(users)
       *   .innerJoin(pets, eq(users.id, pets.ownerId))
       *
       * // Select userId and petId
       * const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
       *   userId: users.id,
       *   petId: pets.id,
       * })
       *   .from(users)
       *   .innerJoin(pets, eq(users.id, pets.ownerId))
       * ```
       */
      innerJoin = this.createJoin("inner");
      /**
       * Executes a `full join` operation by combining rows from two tables into a new table.
       *
       * Calling this method retrieves all rows from both main and joined tables, merging rows with matching values and filling in `null` for non-matching columns.
       *
       * See docs: {@link https://orm.drizzle.team/docs/joins#full-join}
       *
       * @param table the table to join.
       * @param on the `on` clause.
       *
       * @example
       *
       * ```ts
       * // Select all users and their pets
       * const usersWithPets: { user: User | null; pets: Pet | null; }[] = await db.select()
       *   .from(users)
       *   .fullJoin(pets, eq(users.id, pets.ownerId))
       *
       * // Select userId and petId
       * const usersIdsAndPetIds: { userId: number | null; petId: number | null; }[] = await db.select({
       *   userId: users.id,
       *   petId: pets.id,
       * })
       *   .from(users)
       *   .fullJoin(pets, eq(users.id, pets.ownerId))
       * ```
       */
      fullJoin = this.createJoin("full");
      /**
       * Executes a `cross join` operation by combining rows from two tables into a new table.
       *
       * Calling this method retrieves all rows from both main and joined tables, merging all rows from each table.
       *
       * See docs: {@link https://orm.drizzle.team/docs/joins#cross-join}
       *
       * @param table the table to join.
       *
       * @example
       *
       * ```ts
       * // Select all users, each user with every pet
       * const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
       *   .from(users)
       *   .crossJoin(pets)
       *
       * // Select userId and petId
       * const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
       *   userId: users.id,
       *   petId: pets.id,
       * })
       *   .from(users)
       *   .crossJoin(pets)
       * ```
       */
      crossJoin = this.createJoin("cross");
      createSetOperator(type, isAll) {
        return (rightSelection) => {
          const rightSelect = typeof rightSelection === "function" ? rightSelection(getSQLiteSetOperators()) : rightSelection;
          if (!haveSameKeys(this.getSelectedFields(), rightSelect.getSelectedFields())) {
            throw new Error(
              "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
            );
          }
          this.config.setOperators.push({ type, isAll, rightSelect });
          return this;
        };
      }
      /**
       * Adds `union` set operator to the query.
       *
       * Calling this method will combine the result sets of the `select` statements and remove any duplicate rows that appear across them.
       *
       * See docs: {@link https://orm.drizzle.team/docs/set-operations#union}
       *
       * @example
       *
       * ```ts
       * // Select all unique names from customers and users tables
       * await db.select({ name: users.name })
       *   .from(users)
       *   .union(
       *     db.select({ name: customers.name }).from(customers)
       *   );
       * // or
       * import { union } from 'drizzle-orm/sqlite-core'
       *
       * await union(
       *   db.select({ name: users.name }).from(users),
       *   db.select({ name: customers.name }).from(customers)
       * );
       * ```
       */
      union = this.createSetOperator("union", false);
      /**
       * Adds `union all` set operator to the query.
       *
       * Calling this method will combine the result-set of the `select` statements and keep all duplicate rows that appear across them.
       *
       * See docs: {@link https://orm.drizzle.team/docs/set-operations#union-all}
       *
       * @example
       *
       * ```ts
       * // Select all transaction ids from both online and in-store sales
       * await db.select({ transaction: onlineSales.transactionId })
       *   .from(onlineSales)
       *   .unionAll(
       *     db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
       *   );
       * // or
       * import { unionAll } from 'drizzle-orm/sqlite-core'
       *
       * await unionAll(
       *   db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
       *   db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
       * );
       * ```
       */
      unionAll = this.createSetOperator("union", true);
      /**
       * Adds `intersect` set operator to the query.
       *
       * Calling this method will retain only the rows that are present in both result sets and eliminate duplicates.
       *
       * See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect}
       *
       * @example
       *
       * ```ts
       * // Select course names that are offered in both departments A and B
       * await db.select({ courseName: depA.courseName })
       *   .from(depA)
       *   .intersect(
       *     db.select({ courseName: depB.courseName }).from(depB)
       *   );
       * // or
       * import { intersect } from 'drizzle-orm/sqlite-core'
       *
       * await intersect(
       *   db.select({ courseName: depA.courseName }).from(depA),
       *   db.select({ courseName: depB.courseName }).from(depB)
       * );
       * ```
       */
      intersect = this.createSetOperator("intersect", false);
      /**
       * Adds `except` set operator to the query.
       *
       * Calling this method will retrieve all unique rows from the left query, except for the rows that are present in the result set of the right query.
       *
       * See docs: {@link https://orm.drizzle.team/docs/set-operations#except}
       *
       * @example
       *
       * ```ts
       * // Select all courses offered in department A but not in department B
       * await db.select({ courseName: depA.courseName })
       *   .from(depA)
       *   .except(
       *     db.select({ courseName: depB.courseName }).from(depB)
       *   );
       * // or
       * import { except } from 'drizzle-orm/sqlite-core'
       *
       * await except(
       *   db.select({ courseName: depA.courseName }).from(depA),
       *   db.select({ courseName: depB.courseName }).from(depB)
       * );
       * ```
       */
      except = this.createSetOperator("except", false);
      /** @internal */
      addSetOperators(setOperators) {
        this.config.setOperators.push(...setOperators);
        return this;
      }
      /**
       * Adds a `where` clause to the query.
       *
       * Calling this method will select only those rows that fulfill a specified condition.
       *
       * See docs: {@link https://orm.drizzle.team/docs/select#filtering}
       *
       * @param where the `where` clause.
       *
       * @example
       * You can use conditional operators and `sql function` to filter the rows to be selected.
       *
       * ```ts
       * // Select all cars with green color
       * await db.select().from(cars).where(eq(cars.color, 'green'));
       * // or
       * await db.select().from(cars).where(sql`${cars.color} = 'green'`)
       * ```
       *
       * You can logically combine conditional operators with `and()` and `or()` operators:
       *
       * ```ts
       * // Select all BMW cars with a green color
       * await db.select().from(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
       *
       * // Select all cars with the green or blue color
       * await db.select().from(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
       * ```
       */
      where(where) {
        if (typeof where === "function") {
          where = where(
            new Proxy(
              this.config.fields,
              new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
            )
          );
        }
        this.config.where = where;
        return this;
      }
      /**
       * Adds a `having` clause to the query.
       *
       * Calling this method will select only those rows that fulfill a specified condition. It is typically used with aggregate functions to filter the aggregated data based on a specified condition.
       *
       * See docs: {@link https://orm.drizzle.team/docs/select#aggregations}
       *
       * @param having the `having` clause.
       *
       * @example
       *
       * ```ts
       * // Select all brands with more than one car
       * await db.select({
       * 	brand: cars.brand,
       * 	count: sql<number>`cast(count(${cars.id}) as int)`,
       * })
       *   .from(cars)
       *   .groupBy(cars.brand)
       *   .having(({ count }) => gt(count, 1));
       * ```
       */
      having(having) {
        if (typeof having === "function") {
          having = having(
            new Proxy(
              this.config.fields,
              new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
            )
          );
        }
        this.config.having = having;
        return this;
      }
      groupBy(...columns) {
        if (typeof columns[0] === "function") {
          const groupBy = columns[0](
            new Proxy(
              this.config.fields,
              new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
            )
          );
          this.config.groupBy = Array.isArray(groupBy) ? groupBy : [groupBy];
        } else {
          this.config.groupBy = columns;
        }
        return this;
      }
      orderBy(...columns) {
        if (typeof columns[0] === "function") {
          const orderBy = columns[0](
            new Proxy(
              this.config.fields,
              new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
            )
          );
          const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
          if (this.config.setOperators.length > 0) {
            this.config.setOperators.at(-1).orderBy = orderByArray;
          } else {
            this.config.orderBy = orderByArray;
          }
        } else {
          const orderByArray = columns;
          if (this.config.setOperators.length > 0) {
            this.config.setOperators.at(-1).orderBy = orderByArray;
          } else {
            this.config.orderBy = orderByArray;
          }
        }
        return this;
      }
      /**
       * Adds a `limit` clause to the query.
       *
       * Calling this method will set the maximum number of rows that will be returned by this query.
       *
       * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
       *
       * @param limit the `limit` clause.
       *
       * @example
       *
       * ```ts
       * // Get the first 10 people from this query.
       * await db.select().from(people).limit(10);
       * ```
       */
      limit(limit) {
        if (this.config.setOperators.length > 0) {
          this.config.setOperators.at(-1).limit = limit;
        } else {
          this.config.limit = limit;
        }
        return this;
      }
      /**
       * Adds an `offset` clause to the query.
       *
       * Calling this method will skip a number of rows when returning results from this query.
       *
       * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
       *
       * @param offset the `offset` clause.
       *
       * @example
       *
       * ```ts
       * // Get the 10th-20th people from this query.
       * await db.select().from(people).offset(10).limit(10);
       * ```
       */
      offset(offset) {
        if (this.config.setOperators.length > 0) {
          this.config.setOperators.at(-1).offset = offset;
        } else {
          this.config.offset = offset;
        }
        return this;
      }
      /** @internal */
      getSQL() {
        return this.dialect.buildSelectQuery(this.config);
      }
      toSQL() {
        const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
        return rest;
      }
      as(alias) {
        const usedTables = [];
        usedTables.push(...extractUsedTable(this.config.table));
        if (this.config.joins) {
          for (const it of this.config.joins) usedTables.push(...extractUsedTable(it.table));
        }
        return new Proxy(
          new Subquery(this.getSQL(), this.config.fields, alias, false, [...new Set(usedTables)]),
          new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
        );
      }
      /** @internal */
      getSelectedFields() {
        return new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ alias: this.tableName, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
        );
      }
      $dynamic() {
        return this;
      }
    };
    SQLiteSelectBase = class extends SQLiteSelectQueryBuilderBase {
      static {
        __name(this, "SQLiteSelectBase");
      }
      static [entityKind] = "SQLiteSelect";
      /** @internal */
      _prepare(isOneTimeQuery = true) {
        if (!this.session) {
          throw new Error("Cannot execute a query on a query builder. Please use a database instance instead.");
        }
        const fieldsList = orderSelectedFields(this.config.fields);
        const query = this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
          this.dialect.sqlToQuery(this.getSQL()),
          fieldsList,
          "all",
          true,
          void 0,
          {
            type: "select",
            tables: [...this.usedTables]
          },
          this.cacheConfig
        );
        query.joinsNotNullableMap = this.joinsNotNullableMap;
        return query;
      }
      $withCache(config) {
        this.cacheConfig = config === void 0 ? { config: {}, enable: true, autoInvalidate: true } : config === false ? { enable: false } : { enable: true, autoInvalidate: true, ...config };
        return this;
      }
      prepare() {
        return this._prepare(false);
      }
      run = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().run(placeholderValues);
      }, "run");
      all = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().all(placeholderValues);
      }, "all");
      get = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().get(placeholderValues);
      }, "get");
      values = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().values(placeholderValues);
      }, "values");
      async execute() {
        return this.all();
      }
    };
    applyMixins(SQLiteSelectBase, [QueryPromise]);
    __name(createSetOperator, "createSetOperator");
    getSQLiteSetOperators = /* @__PURE__ */ __name(() => ({
      union,
      unionAll,
      intersect,
      except
    }), "getSQLiteSetOperators");
    union = createSetOperator("union", false);
    unionAll = createSetOperator("union", true);
    intersect = createSetOperator("intersect", false);
    except = createSetOperator("except", false);
  }
});

// ../node_modules/drizzle-orm/sqlite-core/query-builders/query-builder.js
var QueryBuilder;
var init_query_builder2 = __esm({
  "../node_modules/drizzle-orm/sqlite-core/query-builders/query-builder.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_selection_proxy();
    init_dialect();
    init_subquery();
    init_select2();
    QueryBuilder = class {
      static {
        __name(this, "QueryBuilder");
      }
      static [entityKind] = "SQLiteQueryBuilder";
      dialect;
      dialectConfig;
      constructor(dialect) {
        this.dialect = is(dialect, SQLiteDialect) ? dialect : void 0;
        this.dialectConfig = is(dialect, SQLiteDialect) ? void 0 : dialect;
      }
      $with = /* @__PURE__ */ __name((alias, selection) => {
        const queryBuilder = this;
        const as = /* @__PURE__ */ __name((qb) => {
          if (typeof qb === "function") {
            qb = qb(queryBuilder);
          }
          return new Proxy(
            new WithSubquery(
              qb.getSQL(),
              selection ?? ("getSelectedFields" in qb ? qb.getSelectedFields() ?? {} : {}),
              alias,
              true
            ),
            new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
          );
        }, "as");
        return { as };
      }, "$with");
      with(...queries) {
        const self2 = this;
        function select(fields) {
          return new SQLiteSelectBuilder({
            fields: fields ?? void 0,
            session: void 0,
            dialect: self2.getDialect(),
            withList: queries
          });
        }
        __name(select, "select");
        function selectDistinct(fields) {
          return new SQLiteSelectBuilder({
            fields: fields ?? void 0,
            session: void 0,
            dialect: self2.getDialect(),
            withList: queries,
            distinct: true
          });
        }
        __name(selectDistinct, "selectDistinct");
        return { select, selectDistinct };
      }
      select(fields) {
        return new SQLiteSelectBuilder({ fields: fields ?? void 0, session: void 0, dialect: this.getDialect() });
      }
      selectDistinct(fields) {
        return new SQLiteSelectBuilder({
          fields: fields ?? void 0,
          session: void 0,
          dialect: this.getDialect(),
          distinct: true
        });
      }
      // Lazy load dialect to avoid circular dependency
      getDialect() {
        if (!this.dialect) {
          this.dialect = new SQLiteSyncDialect(this.dialectConfig);
        }
        return this.dialect;
      }
    };
  }
});

// ../node_modules/drizzle-orm/sqlite-core/query-builders/insert.js
var SQLiteInsertBuilder, SQLiteInsertBase;
var init_insert = __esm({
  "../node_modules/drizzle-orm/sqlite-core/query-builders/insert.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_query_promise();
    init_sql2();
    init_table3();
    init_table();
    init_utils();
    init_utils2();
    init_query_builder2();
    SQLiteInsertBuilder = class {
      static {
        __name(this, "SQLiteInsertBuilder");
      }
      constructor(table, session, dialect, withList) {
        this.table = table;
        this.session = session;
        this.dialect = dialect;
        this.withList = withList;
      }
      static [entityKind] = "SQLiteInsertBuilder";
      values(values) {
        values = Array.isArray(values) ? values : [values];
        if (values.length === 0) {
          throw new Error("values() must be called with at least one value");
        }
        const mappedValues = values.map((entry) => {
          const result = {};
          const cols = this.table[Table.Symbol.Columns];
          for (const colKey of Object.keys(entry)) {
            const colValue = entry[colKey];
            result[colKey] = is(colValue, SQL) ? colValue : new Param(colValue, cols[colKey]);
          }
          return result;
        });
        return new SQLiteInsertBase(this.table, mappedValues, this.session, this.dialect, this.withList);
      }
      select(selectQuery) {
        const select = typeof selectQuery === "function" ? selectQuery(new QueryBuilder()) : selectQuery;
        if (!is(select, SQL) && !haveSameKeys(this.table[Columns], select._.selectedFields)) {
          throw new Error(
            "Insert select error: selected fields are not the same or are in a different order compared to the table definition"
          );
        }
        return new SQLiteInsertBase(this.table, select, this.session, this.dialect, this.withList, true);
      }
    };
    SQLiteInsertBase = class extends QueryPromise {
      static {
        __name(this, "SQLiteInsertBase");
      }
      constructor(table, values, session, dialect, withList, select) {
        super();
        this.session = session;
        this.dialect = dialect;
        this.config = { table, values, withList, select };
      }
      static [entityKind] = "SQLiteInsert";
      /** @internal */
      config;
      returning(fields = this.config.table[SQLiteTable.Symbol.Columns]) {
        this.config.returning = orderSelectedFields(fields);
        return this;
      }
      /**
       * Adds an `on conflict do nothing` clause to the query.
       *
       * Calling this method simply avoids inserting a row as its alternative action.
       *
       * See docs: {@link https://orm.drizzle.team/docs/insert#on-conflict-do-nothing}
       *
       * @param config The `target` and `where` clauses.
       *
       * @example
       * ```ts
       * // Insert one row and cancel the insert if there's a conflict
       * await db.insert(cars)
       *   .values({ id: 1, brand: 'BMW' })
       *   .onConflictDoNothing();
       *
       * // Explicitly specify conflict target
       * await db.insert(cars)
       *   .values({ id: 1, brand: 'BMW' })
       *   .onConflictDoNothing({ target: cars.id });
       * ```
       */
      onConflictDoNothing(config = {}) {
        if (!this.config.onConflict) this.config.onConflict = [];
        if (config.target === void 0) {
          this.config.onConflict.push(sql` on conflict do nothing`);
        } else {
          const targetSql = Array.isArray(config.target) ? sql`${config.target}` : sql`${[config.target]}`;
          const whereSql = config.where ? sql` where ${config.where}` : sql``;
          this.config.onConflict.push(sql` on conflict ${targetSql} do nothing${whereSql}`);
        }
        return this;
      }
      /**
       * Adds an `on conflict do update` clause to the query.
       *
       * Calling this method will update the existing row that conflicts with the row proposed for insertion as its alternative action.
       *
       * See docs: {@link https://orm.drizzle.team/docs/insert#upserts-and-conflicts}
       *
       * @param config The `target`, `set` and `where` clauses.
       *
       * @example
       * ```ts
       * // Update the row if there's a conflict
       * await db.insert(cars)
       *   .values({ id: 1, brand: 'BMW' })
       *   .onConflictDoUpdate({
       *     target: cars.id,
       *     set: { brand: 'Porsche' }
       *   });
       *
       * // Upsert with 'where' clause
       * await db.insert(cars)
       *   .values({ id: 1, brand: 'BMW' })
       *   .onConflictDoUpdate({
       *     target: cars.id,
       *     set: { brand: 'newBMW' },
       *     where: sql`${cars.createdAt} > '2023-01-01'::date`,
       *   });
       * ```
       */
      onConflictDoUpdate(config) {
        if (config.where && (config.targetWhere || config.setWhere)) {
          throw new Error(
            'You cannot use both "where" and "targetWhere"/"setWhere" at the same time - "where" is deprecated, use "targetWhere" or "setWhere" instead.'
          );
        }
        if (!this.config.onConflict) this.config.onConflict = [];
        const whereSql = config.where ? sql` where ${config.where}` : void 0;
        const targetWhereSql = config.targetWhere ? sql` where ${config.targetWhere}` : void 0;
        const setWhereSql = config.setWhere ? sql` where ${config.setWhere}` : void 0;
        const targetSql = Array.isArray(config.target) ? sql`${config.target}` : sql`${[config.target]}`;
        const setSql = this.dialect.buildUpdateSet(this.config.table, mapUpdateSet(this.config.table, config.set));
        this.config.onConflict.push(
          sql` on conflict ${targetSql}${targetWhereSql} do update set ${setSql}${whereSql}${setWhereSql}`
        );
        return this;
      }
      /** @internal */
      getSQL() {
        return this.dialect.buildInsertQuery(this.config);
      }
      toSQL() {
        const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
        return rest;
      }
      /** @internal */
      _prepare(isOneTimeQuery = true) {
        return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
          this.dialect.sqlToQuery(this.getSQL()),
          this.config.returning,
          this.config.returning ? "all" : "run",
          true,
          void 0,
          {
            type: "insert",
            tables: extractUsedTable(this.config.table)
          }
        );
      }
      prepare() {
        return this._prepare(false);
      }
      run = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().run(placeholderValues);
      }, "run");
      all = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().all(placeholderValues);
      }, "all");
      get = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().get(placeholderValues);
      }, "get");
      values = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().values(placeholderValues);
      }, "values");
      async execute() {
        return this.config.returning ? this.all() : this.run();
      }
      $dynamic() {
        return this;
      }
    };
  }
});

// ../node_modules/drizzle-orm/sqlite-core/query-builders/select.types.js
var init_select_types = __esm({
  "../node_modules/drizzle-orm/sqlite-core/query-builders/select.types.js"() {
    init_functionsRoutes_0_6398490784585695();
  }
});

// ../node_modules/drizzle-orm/sqlite-core/query-builders/update.js
var SQLiteUpdateBuilder, SQLiteUpdateBase;
var init_update = __esm({
  "../node_modules/drizzle-orm/sqlite-core/query-builders/update.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_query_promise();
    init_selection_proxy();
    init_table3();
    init_subquery();
    init_table();
    init_utils();
    init_view_common();
    init_utils2();
    init_view_base();
    SQLiteUpdateBuilder = class {
      static {
        __name(this, "SQLiteUpdateBuilder");
      }
      constructor(table, session, dialect, withList) {
        this.table = table;
        this.session = session;
        this.dialect = dialect;
        this.withList = withList;
      }
      static [entityKind] = "SQLiteUpdateBuilder";
      set(values) {
        return new SQLiteUpdateBase(
          this.table,
          mapUpdateSet(this.table, values),
          this.session,
          this.dialect,
          this.withList
        );
      }
    };
    SQLiteUpdateBase = class extends QueryPromise {
      static {
        __name(this, "SQLiteUpdateBase");
      }
      constructor(table, set, session, dialect, withList) {
        super();
        this.session = session;
        this.dialect = dialect;
        this.config = { set, table, withList, joins: [] };
      }
      static [entityKind] = "SQLiteUpdate";
      /** @internal */
      config;
      from(source) {
        this.config.from = source;
        return this;
      }
      createJoin(joinType) {
        return (table, on) => {
          const tableName = getTableLikeName(table);
          if (typeof tableName === "string" && this.config.joins.some((join) => join.alias === tableName)) {
            throw new Error(`Alias "${tableName}" is already used in this query`);
          }
          if (typeof on === "function") {
            const from = this.config.from ? is(table, SQLiteTable) ? table[Table.Symbol.Columns] : is(table, Subquery) ? table._.selectedFields : is(table, SQLiteViewBase) ? table[ViewBaseConfig].selectedFields : void 0 : void 0;
            on = on(
              new Proxy(
                this.config.table[Table.Symbol.Columns],
                new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
              ),
              from && new Proxy(
                from,
                new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
              )
            );
          }
          this.config.joins.push({ on, table, joinType, alias: tableName });
          return this;
        };
      }
      leftJoin = this.createJoin("left");
      rightJoin = this.createJoin("right");
      innerJoin = this.createJoin("inner");
      fullJoin = this.createJoin("full");
      /**
       * Adds a 'where' clause to the query.
       *
       * Calling this method will update only those rows that fulfill a specified condition.
       *
       * See docs: {@link https://orm.drizzle.team/docs/update}
       *
       * @param where the 'where' clause.
       *
       * @example
       * You can use conditional operators and `sql function` to filter the rows to be updated.
       *
       * ```ts
       * // Update all cars with green color
       * db.update(cars).set({ color: 'red' })
       *   .where(eq(cars.color, 'green'));
       * // or
       * db.update(cars).set({ color: 'red' })
       *   .where(sql`${cars.color} = 'green'`)
       * ```
       *
       * You can logically combine conditional operators with `and()` and `or()` operators:
       *
       * ```ts
       * // Update all BMW cars with a green color
       * db.update(cars).set({ color: 'red' })
       *   .where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
       *
       * // Update all cars with the green or blue color
       * db.update(cars).set({ color: 'red' })
       *   .where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
       * ```
       */
      where(where) {
        this.config.where = where;
        return this;
      }
      orderBy(...columns) {
        if (typeof columns[0] === "function") {
          const orderBy = columns[0](
            new Proxy(
              this.config.table[Table.Symbol.Columns],
              new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
            )
          );
          const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
          this.config.orderBy = orderByArray;
        } else {
          const orderByArray = columns;
          this.config.orderBy = orderByArray;
        }
        return this;
      }
      limit(limit) {
        this.config.limit = limit;
        return this;
      }
      returning(fields = this.config.table[SQLiteTable.Symbol.Columns]) {
        this.config.returning = orderSelectedFields(fields);
        return this;
      }
      /** @internal */
      getSQL() {
        return this.dialect.buildUpdateQuery(this.config);
      }
      toSQL() {
        const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
        return rest;
      }
      /** @internal */
      _prepare(isOneTimeQuery = true) {
        return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
          this.dialect.sqlToQuery(this.getSQL()),
          this.config.returning,
          this.config.returning ? "all" : "run",
          true,
          void 0,
          {
            type: "insert",
            tables: extractUsedTable(this.config.table)
          }
        );
      }
      prepare() {
        return this._prepare(false);
      }
      run = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().run(placeholderValues);
      }, "run");
      all = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().all(placeholderValues);
      }, "all");
      get = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().get(placeholderValues);
      }, "get");
      values = /* @__PURE__ */ __name((placeholderValues) => {
        return this._prepare().values(placeholderValues);
      }, "values");
      async execute() {
        return this.config.returning ? this.all() : this.run();
      }
      $dynamic() {
        return this;
      }
    };
  }
});

// ../node_modules/drizzle-orm/sqlite-core/query-builders/index.js
var init_query_builders = __esm({
  "../node_modules/drizzle-orm/sqlite-core/query-builders/index.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_delete();
    init_insert();
    init_query_builder2();
    init_select2();
    init_select_types();
    init_update();
  }
});

// ../node_modules/drizzle-orm/sqlite-core/query-builders/count.js
var SQLiteCountBuilder;
var init_count = __esm({
  "../node_modules/drizzle-orm/sqlite-core/query-builders/count.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_sql2();
    SQLiteCountBuilder = class _SQLiteCountBuilder extends SQL {
      static {
        __name(this, "SQLiteCountBuilder");
      }
      constructor(params) {
        super(_SQLiteCountBuilder.buildEmbeddedCount(params.source, params.filters).queryChunks);
        this.params = params;
        this.session = params.session;
        this.sql = _SQLiteCountBuilder.buildCount(
          params.source,
          params.filters
        );
      }
      sql;
      static [entityKind] = "SQLiteCountBuilderAsync";
      [Symbol.toStringTag] = "SQLiteCountBuilderAsync";
      session;
      static buildEmbeddedCount(source, filters) {
        return sql`(select count(*) from ${source}${sql.raw(" where ").if(filters)}${filters})`;
      }
      static buildCount(source, filters) {
        return sql`select count(*) from ${source}${sql.raw(" where ").if(filters)}${filters}`;
      }
      then(onfulfilled, onrejected) {
        return Promise.resolve(this.session.count(this.sql)).then(
          onfulfilled,
          onrejected
        );
      }
      catch(onRejected) {
        return this.then(void 0, onRejected);
      }
      finally(onFinally) {
        return this.then(
          (value) => {
            onFinally?.();
            return value;
          },
          (reason) => {
            onFinally?.();
            throw reason;
          }
        );
      }
    };
  }
});

// ../node_modules/drizzle-orm/sqlite-core/query-builders/query.js
var RelationalQueryBuilder, SQLiteRelationalQuery, SQLiteSyncRelationalQuery;
var init_query = __esm({
  "../node_modules/drizzle-orm/sqlite-core/query-builders/query.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_query_promise();
    init_relations();
    RelationalQueryBuilder = class {
      static {
        __name(this, "RelationalQueryBuilder");
      }
      constructor(mode, fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session) {
        this.mode = mode;
        this.fullSchema = fullSchema;
        this.schema = schema;
        this.tableNamesMap = tableNamesMap;
        this.table = table;
        this.tableConfig = tableConfig;
        this.dialect = dialect;
        this.session = session;
      }
      static [entityKind] = "SQLiteAsyncRelationalQueryBuilder";
      findMany(config) {
        return this.mode === "sync" ? new SQLiteSyncRelationalQuery(
          this.fullSchema,
          this.schema,
          this.tableNamesMap,
          this.table,
          this.tableConfig,
          this.dialect,
          this.session,
          config ? config : {},
          "many"
        ) : new SQLiteRelationalQuery(
          this.fullSchema,
          this.schema,
          this.tableNamesMap,
          this.table,
          this.tableConfig,
          this.dialect,
          this.session,
          config ? config : {},
          "many"
        );
      }
      findFirst(config) {
        return this.mode === "sync" ? new SQLiteSyncRelationalQuery(
          this.fullSchema,
          this.schema,
          this.tableNamesMap,
          this.table,
          this.tableConfig,
          this.dialect,
          this.session,
          config ? { ...config, limit: 1 } : { limit: 1 },
          "first"
        ) : new SQLiteRelationalQuery(
          this.fullSchema,
          this.schema,
          this.tableNamesMap,
          this.table,
          this.tableConfig,
          this.dialect,
          this.session,
          config ? { ...config, limit: 1 } : { limit: 1 },
          "first"
        );
      }
    };
    SQLiteRelationalQuery = class extends QueryPromise {
      static {
        __name(this, "SQLiteRelationalQuery");
      }
      constructor(fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session, config, mode) {
        super();
        this.fullSchema = fullSchema;
        this.schema = schema;
        this.tableNamesMap = tableNamesMap;
        this.table = table;
        this.tableConfig = tableConfig;
        this.dialect = dialect;
        this.session = session;
        this.config = config;
        this.mode = mode;
      }
      static [entityKind] = "SQLiteAsyncRelationalQuery";
      /** @internal */
      mode;
      /** @internal */
      getSQL() {
        return this.dialect.buildRelationalQuery({
          fullSchema: this.fullSchema,
          schema: this.schema,
          tableNamesMap: this.tableNamesMap,
          table: this.table,
          tableConfig: this.tableConfig,
          queryConfig: this.config,
          tableAlias: this.tableConfig.tsName
        }).sql;
      }
      /** @internal */
      _prepare(isOneTimeQuery = false) {
        const { query, builtQuery } = this._toSQL();
        return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
          builtQuery,
          void 0,
          this.mode === "first" ? "get" : "all",
          true,
          (rawRows, mapColumnValue) => {
            const rows = rawRows.map(
              (row) => mapRelationalRow(this.schema, this.tableConfig, row, query.selection, mapColumnValue)
            );
            if (this.mode === "first") {
              return rows[0];
            }
            return rows;
          }
        );
      }
      prepare() {
        return this._prepare(false);
      }
      _toSQL() {
        const query = this.dialect.buildRelationalQuery({
          fullSchema: this.fullSchema,
          schema: this.schema,
          tableNamesMap: this.tableNamesMap,
          table: this.table,
          tableConfig: this.tableConfig,
          queryConfig: this.config,
          tableAlias: this.tableConfig.tsName
        });
        const builtQuery = this.dialect.sqlToQuery(query.sql);
        return { query, builtQuery };
      }
      toSQL() {
        return this._toSQL().builtQuery;
      }
      /** @internal */
      executeRaw() {
        if (this.mode === "first") {
          return this._prepare(false).get();
        }
        return this._prepare(false).all();
      }
      async execute() {
        return this.executeRaw();
      }
    };
    SQLiteSyncRelationalQuery = class extends SQLiteRelationalQuery {
      static {
        __name(this, "SQLiteSyncRelationalQuery");
      }
      static [entityKind] = "SQLiteSyncRelationalQuery";
      sync() {
        return this.executeRaw();
      }
    };
  }
});

// ../node_modules/drizzle-orm/sqlite-core/query-builders/raw.js
var SQLiteRaw;
var init_raw = __esm({
  "../node_modules/drizzle-orm/sqlite-core/query-builders/raw.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_query_promise();
    SQLiteRaw = class extends QueryPromise {
      static {
        __name(this, "SQLiteRaw");
      }
      constructor(execute, getSQL, action, dialect, mapBatchResult) {
        super();
        this.execute = execute;
        this.getSQL = getSQL;
        this.dialect = dialect;
        this.mapBatchResult = mapBatchResult;
        this.config = { action };
      }
      static [entityKind] = "SQLiteRaw";
      /** @internal */
      config;
      getQuery() {
        return { ...this.dialect.sqlToQuery(this.getSQL()), method: this.config.action };
      }
      mapResult(result, isFromBatch) {
        return isFromBatch ? this.mapBatchResult(result) : result;
      }
      _prepare() {
        return this;
      }
      /** @internal */
      isResponseInArrayMode() {
        return false;
      }
    };
  }
});

// ../node_modules/drizzle-orm/sqlite-core/db.js
var BaseSQLiteDatabase;
var init_db = __esm({
  "../node_modules/drizzle-orm/sqlite-core/db.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_selection_proxy();
    init_sql2();
    init_query_builders();
    init_subquery();
    init_count();
    init_query();
    init_raw();
    BaseSQLiteDatabase = class {
      static {
        __name(this, "BaseSQLiteDatabase");
      }
      constructor(resultKind, dialect, session, schema) {
        this.resultKind = resultKind;
        this.dialect = dialect;
        this.session = session;
        this._ = schema ? {
          schema: schema.schema,
          fullSchema: schema.fullSchema,
          tableNamesMap: schema.tableNamesMap
        } : {
          schema: void 0,
          fullSchema: {},
          tableNamesMap: {}
        };
        this.query = {};
        const query = this.query;
        if (this._.schema) {
          for (const [tableName, columns] of Object.entries(this._.schema)) {
            query[tableName] = new RelationalQueryBuilder(
              resultKind,
              schema.fullSchema,
              this._.schema,
              this._.tableNamesMap,
              schema.fullSchema[tableName],
              columns,
              dialect,
              session
            );
          }
        }
        this.$cache = { invalidate: /* @__PURE__ */ __name(async (_params) => {
        }, "invalidate") };
      }
      static [entityKind] = "BaseSQLiteDatabase";
      query;
      /**
       * Creates a subquery that defines a temporary named result set as a CTE.
       *
       * It is useful for breaking down complex queries into simpler parts and for reusing the result set in subsequent parts of the query.
       *
       * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
       *
       * @param alias The alias for the subquery.
       *
       * Failure to provide an alias will result in a DrizzleTypeError, preventing the subquery from being referenced in other queries.
       *
       * @example
       *
       * ```ts
       * // Create a subquery with alias 'sq' and use it in the select query
       * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
       *
       * const result = await db.with(sq).select().from(sq);
       * ```
       *
       * To select arbitrary SQL values as fields in a CTE and reference them in other CTEs or in the main query, you need to add aliases to them:
       *
       * ```ts
       * // Select an arbitrary SQL value as a field in a CTE and reference it in the main query
       * const sq = db.$with('sq').as(db.select({
       *   name: sql<string>`upper(${users.name})`.as('name'),
       * })
       * .from(users));
       *
       * const result = await db.with(sq).select({ name: sq.name }).from(sq);
       * ```
       */
      $with = /* @__PURE__ */ __name((alias, selection) => {
        const self2 = this;
        const as = /* @__PURE__ */ __name((qb) => {
          if (typeof qb === "function") {
            qb = qb(new QueryBuilder(self2.dialect));
          }
          return new Proxy(
            new WithSubquery(
              qb.getSQL(),
              selection ?? ("getSelectedFields" in qb ? qb.getSelectedFields() ?? {} : {}),
              alias,
              true
            ),
            new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
          );
        }, "as");
        return { as };
      }, "$with");
      $count(source, filters) {
        return new SQLiteCountBuilder({ source, filters, session: this.session });
      }
      /**
       * Incorporates a previously defined CTE (using `$with`) into the main query.
       *
       * This method allows the main query to reference a temporary named result set.
       *
       * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
       *
       * @param queries The CTEs to incorporate into the main query.
       *
       * @example
       *
       * ```ts
       * // Define a subquery 'sq' as a CTE using $with
       * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
       *
       * // Incorporate the CTE 'sq' into the main query and select from it
       * const result = await db.with(sq).select().from(sq);
       * ```
       */
      with(...queries) {
        const self2 = this;
        function select(fields) {
          return new SQLiteSelectBuilder({
            fields: fields ?? void 0,
            session: self2.session,
            dialect: self2.dialect,
            withList: queries
          });
        }
        __name(select, "select");
        function selectDistinct(fields) {
          return new SQLiteSelectBuilder({
            fields: fields ?? void 0,
            session: self2.session,
            dialect: self2.dialect,
            withList: queries,
            distinct: true
          });
        }
        __name(selectDistinct, "selectDistinct");
        function update(table) {
          return new SQLiteUpdateBuilder(table, self2.session, self2.dialect, queries);
        }
        __name(update, "update");
        function insert(into) {
          return new SQLiteInsertBuilder(into, self2.session, self2.dialect, queries);
        }
        __name(insert, "insert");
        function delete_(from) {
          return new SQLiteDeleteBase(from, self2.session, self2.dialect, queries);
        }
        __name(delete_, "delete_");
        return { select, selectDistinct, update, insert, delete: delete_ };
      }
      select(fields) {
        return new SQLiteSelectBuilder({ fields: fields ?? void 0, session: this.session, dialect: this.dialect });
      }
      selectDistinct(fields) {
        return new SQLiteSelectBuilder({
          fields: fields ?? void 0,
          session: this.session,
          dialect: this.dialect,
          distinct: true
        });
      }
      /**
       * Creates an update query.
       *
       * Calling this method without `.where()` clause will update all rows in a table. The `.where()` clause specifies which rows should be updated.
       *
       * Use `.set()` method to specify which values to update.
       *
       * See docs: {@link https://orm.drizzle.team/docs/update}
       *
       * @param table The table to update.
       *
       * @example
       *
       * ```ts
       * // Update all rows in the 'cars' table
       * await db.update(cars).set({ color: 'red' });
       *
       * // Update rows with filters and conditions
       * await db.update(cars).set({ color: 'red' }).where(eq(cars.brand, 'BMW'));
       *
       * // Update with returning clause
       * const updatedCar: Car[] = await db.update(cars)
       *   .set({ color: 'red' })
       *   .where(eq(cars.id, 1))
       *   .returning();
       * ```
       */
      update(table) {
        return new SQLiteUpdateBuilder(table, this.session, this.dialect);
      }
      $cache;
      /**
       * Creates an insert query.
       *
       * Calling this method will create new rows in a table. Use `.values()` method to specify which values to insert.
       *
       * See docs: {@link https://orm.drizzle.team/docs/insert}
       *
       * @param table The table to insert into.
       *
       * @example
       *
       * ```ts
       * // Insert one row
       * await db.insert(cars).values({ brand: 'BMW' });
       *
       * // Insert multiple rows
       * await db.insert(cars).values([{ brand: 'BMW' }, { brand: 'Porsche' }]);
       *
       * // Insert with returning clause
       * const insertedCar: Car[] = await db.insert(cars)
       *   .values({ brand: 'BMW' })
       *   .returning();
       * ```
       */
      insert(into) {
        return new SQLiteInsertBuilder(into, this.session, this.dialect);
      }
      /**
       * Creates a delete query.
       *
       * Calling this method without `.where()` clause will delete all rows in a table. The `.where()` clause specifies which rows should be deleted.
       *
       * See docs: {@link https://orm.drizzle.team/docs/delete}
       *
       * @param table The table to delete from.
       *
       * @example
       *
       * ```ts
       * // Delete all rows in the 'cars' table
       * await db.delete(cars);
       *
       * // Delete rows with filters and conditions
       * await db.delete(cars).where(eq(cars.color, 'green'));
       *
       * // Delete with returning clause
       * const deletedCar: Car[] = await db.delete(cars)
       *   .where(eq(cars.id, 1))
       *   .returning();
       * ```
       */
      delete(from) {
        return new SQLiteDeleteBase(from, this.session, this.dialect);
      }
      run(query) {
        const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
        if (this.resultKind === "async") {
          return new SQLiteRaw(
            async () => this.session.run(sequel),
            () => sequel,
            "run",
            this.dialect,
            this.session.extractRawRunValueFromBatchResult.bind(this.session)
          );
        }
        return this.session.run(sequel);
      }
      all(query) {
        const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
        if (this.resultKind === "async") {
          return new SQLiteRaw(
            async () => this.session.all(sequel),
            () => sequel,
            "all",
            this.dialect,
            this.session.extractRawAllValueFromBatchResult.bind(this.session)
          );
        }
        return this.session.all(sequel);
      }
      get(query) {
        const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
        if (this.resultKind === "async") {
          return new SQLiteRaw(
            async () => this.session.get(sequel),
            () => sequel,
            "get",
            this.dialect,
            this.session.extractRawGetValueFromBatchResult.bind(this.session)
          );
        }
        return this.session.get(sequel);
      }
      values(query) {
        const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
        if (this.resultKind === "async") {
          return new SQLiteRaw(
            async () => this.session.values(sequel),
            () => sequel,
            "values",
            this.dialect,
            this.session.extractRawValuesValueFromBatchResult.bind(this.session)
          );
        }
        return this.session.values(sequel);
      }
      transaction(transaction, config) {
        return this.session.transaction(transaction, config);
      }
    };
  }
});

// ../node_modules/drizzle-orm/cache/core/cache.js
async function hashQuery(sql2, params) {
  const dataToHash = `${sql2}-${JSON.stringify(params)}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(dataToHash);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = [...new Uint8Array(hashBuffer)];
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
var Cache, NoopCache;
var init_cache = __esm({
  "../node_modules/drizzle-orm/cache/core/cache.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    Cache = class {
      static {
        __name(this, "Cache");
      }
      static [entityKind] = "Cache";
    };
    NoopCache = class extends Cache {
      static {
        __name(this, "NoopCache");
      }
      strategy() {
        return "all";
      }
      static [entityKind] = "NoopCache";
      async get(_key) {
        return void 0;
      }
      async put(_hashedQuery, _response, _tables, _config) {
      }
      async onMutate(_params) {
      }
    };
    __name(hashQuery, "hashQuery");
  }
});

// ../node_modules/drizzle-orm/cache/core/index.js
var init_core = __esm({
  "../node_modules/drizzle-orm/cache/core/index.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_cache();
  }
});

// ../node_modules/drizzle-orm/sqlite-core/alias.js
var init_alias2 = __esm({
  "../node_modules/drizzle-orm/sqlite-core/alias.js"() {
    init_functionsRoutes_0_6398490784585695();
  }
});

// ../node_modules/drizzle-orm/sqlite-core/session.js
var ExecuteResultSync, SQLitePreparedQuery, SQLiteSession, SQLiteTransaction;
var init_session = __esm({
  "../node_modules/drizzle-orm/sqlite-core/session.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_cache();
    init_entity();
    init_errors2();
    init_query_promise();
    init_db();
    ExecuteResultSync = class extends QueryPromise {
      static {
        __name(this, "ExecuteResultSync");
      }
      constructor(resultCb) {
        super();
        this.resultCb = resultCb;
      }
      static [entityKind] = "ExecuteResultSync";
      async execute() {
        return this.resultCb();
      }
      sync() {
        return this.resultCb();
      }
    };
    SQLitePreparedQuery = class {
      static {
        __name(this, "SQLitePreparedQuery");
      }
      constructor(mode, executeMethod, query, cache, queryMetadata, cacheConfig) {
        this.mode = mode;
        this.executeMethod = executeMethod;
        this.query = query;
        this.cache = cache;
        this.queryMetadata = queryMetadata;
        this.cacheConfig = cacheConfig;
        if (cache && cache.strategy() === "all" && cacheConfig === void 0) {
          this.cacheConfig = { enable: true, autoInvalidate: true };
        }
        if (!this.cacheConfig?.enable) {
          this.cacheConfig = void 0;
        }
      }
      static [entityKind] = "PreparedQuery";
      /** @internal */
      joinsNotNullableMap;
      /** @internal */
      async queryWithCache(queryString, params, query) {
        if (this.cache === void 0 || is(this.cache, NoopCache) || this.queryMetadata === void 0) {
          try {
            return await query();
          } catch (e) {
            throw new DrizzleQueryError(queryString, params, e);
          }
        }
        if (this.cacheConfig && !this.cacheConfig.enable) {
          try {
            return await query();
          } catch (e) {
            throw new DrizzleQueryError(queryString, params, e);
          }
        }
        if ((this.queryMetadata.type === "insert" || this.queryMetadata.type === "update" || this.queryMetadata.type === "delete") && this.queryMetadata.tables.length > 0) {
          try {
            const [res] = await Promise.all([
              query(),
              this.cache.onMutate({ tables: this.queryMetadata.tables })
            ]);
            return res;
          } catch (e) {
            throw new DrizzleQueryError(queryString, params, e);
          }
        }
        if (!this.cacheConfig) {
          try {
            return await query();
          } catch (e) {
            throw new DrizzleQueryError(queryString, params, e);
          }
        }
        if (this.queryMetadata.type === "select") {
          const fromCache = await this.cache.get(
            this.cacheConfig.tag ?? await hashQuery(queryString, params),
            this.queryMetadata.tables,
            this.cacheConfig.tag !== void 0,
            this.cacheConfig.autoInvalidate
          );
          if (fromCache === void 0) {
            let result;
            try {
              result = await query();
            } catch (e) {
              throw new DrizzleQueryError(queryString, params, e);
            }
            await this.cache.put(
              this.cacheConfig.tag ?? await hashQuery(queryString, params),
              result,
              // make sure we send tables that were used in a query only if user wants to invalidate it on each write
              this.cacheConfig.autoInvalidate ? this.queryMetadata.tables : [],
              this.cacheConfig.tag !== void 0,
              this.cacheConfig.config
            );
            return result;
          }
          return fromCache;
        }
        try {
          return await query();
        } catch (e) {
          throw new DrizzleQueryError(queryString, params, e);
        }
      }
      getQuery() {
        return this.query;
      }
      mapRunResult(result, _isFromBatch) {
        return result;
      }
      mapAllResult(_result, _isFromBatch) {
        throw new Error("Not implemented");
      }
      mapGetResult(_result, _isFromBatch) {
        throw new Error("Not implemented");
      }
      execute(placeholderValues) {
        if (this.mode === "async") {
          return this[this.executeMethod](placeholderValues);
        }
        return new ExecuteResultSync(() => this[this.executeMethod](placeholderValues));
      }
      mapResult(response, isFromBatch) {
        switch (this.executeMethod) {
          case "run": {
            return this.mapRunResult(response, isFromBatch);
          }
          case "all": {
            return this.mapAllResult(response, isFromBatch);
          }
          case "get": {
            return this.mapGetResult(response, isFromBatch);
          }
        }
      }
    };
    SQLiteSession = class {
      static {
        __name(this, "SQLiteSession");
      }
      constructor(dialect) {
        this.dialect = dialect;
      }
      static [entityKind] = "SQLiteSession";
      prepareOneTimeQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
        return this.prepareQuery(
          query,
          fields,
          executeMethod,
          isResponseInArrayMode,
          customResultMapper,
          queryMetadata,
          cacheConfig
        );
      }
      run(query) {
        const staticQuery = this.dialect.sqlToQuery(query);
        try {
          return this.prepareOneTimeQuery(staticQuery, void 0, "run", false).run();
        } catch (err) {
          throw new DrizzleError({ cause: err, message: `Failed to run the query '${staticQuery.sql}'` });
        }
      }
      /** @internal */
      extractRawRunValueFromBatchResult(result) {
        return result;
      }
      all(query) {
        return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).all();
      }
      /** @internal */
      extractRawAllValueFromBatchResult(_result) {
        throw new Error("Not implemented");
      }
      get(query) {
        return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).get();
      }
      /** @internal */
      extractRawGetValueFromBatchResult(_result) {
        throw new Error("Not implemented");
      }
      values(query) {
        return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).values();
      }
      async count(sql2) {
        const result = await this.values(sql2);
        return result[0][0];
      }
      /** @internal */
      extractRawValuesValueFromBatchResult(_result) {
        throw new Error("Not implemented");
      }
    };
    SQLiteTransaction = class extends BaseSQLiteDatabase {
      static {
        __name(this, "SQLiteTransaction");
      }
      constructor(resultType, dialect, session, schema, nestedIndex = 0) {
        super(resultType, dialect, session, schema);
        this.schema = schema;
        this.nestedIndex = nestedIndex;
      }
      static [entityKind] = "SQLiteTransaction";
      rollback() {
        throw new TransactionRollbackError();
      }
    };
  }
});

// ../node_modules/drizzle-orm/sqlite-core/subquery.js
var init_subquery2 = __esm({
  "../node_modules/drizzle-orm/sqlite-core/subquery.js"() {
    init_functionsRoutes_0_6398490784585695();
  }
});

// ../node_modules/drizzle-orm/sqlite-core/view.js
var ViewBuilderCore, ViewBuilder, ManualViewBuilder, SQLiteView;
var init_view = __esm({
  "../node_modules/drizzle-orm/sqlite-core/view.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_selection_proxy();
    init_utils();
    init_query_builder2();
    init_table3();
    init_view_base();
    ViewBuilderCore = class {
      static {
        __name(this, "ViewBuilderCore");
      }
      constructor(name) {
        this.name = name;
      }
      static [entityKind] = "SQLiteViewBuilderCore";
      config = {};
    };
    ViewBuilder = class extends ViewBuilderCore {
      static {
        __name(this, "ViewBuilder");
      }
      static [entityKind] = "SQLiteViewBuilder";
      as(qb) {
        if (typeof qb === "function") {
          qb = qb(new QueryBuilder());
        }
        const selectionProxy = new SelectionProxyHandler({
          alias: this.name,
          sqlBehavior: "error",
          sqlAliasedBehavior: "alias",
          replaceOriginalName: true
        });
        const aliasedSelectedFields = qb.getSelectedFields();
        return new Proxy(
          new SQLiteView({
            // sqliteConfig: this.config,
            config: {
              name: this.name,
              schema: void 0,
              selectedFields: aliasedSelectedFields,
              query: qb.getSQL().inlineParams()
            }
          }),
          selectionProxy
        );
      }
    };
    ManualViewBuilder = class extends ViewBuilderCore {
      static {
        __name(this, "ManualViewBuilder");
      }
      static [entityKind] = "SQLiteManualViewBuilder";
      columns;
      constructor(name, columns) {
        super(name);
        this.columns = getTableColumns(sqliteTable(name, columns));
      }
      existing() {
        return new Proxy(
          new SQLiteView({
            config: {
              name: this.name,
              schema: void 0,
              selectedFields: this.columns,
              query: void 0
            }
          }),
          new SelectionProxyHandler({
            alias: this.name,
            sqlBehavior: "error",
            sqlAliasedBehavior: "alias",
            replaceOriginalName: true
          })
        );
      }
      as(query) {
        return new Proxy(
          new SQLiteView({
            config: {
              name: this.name,
              schema: void 0,
              selectedFields: this.columns,
              query: query.inlineParams()
            }
          }),
          new SelectionProxyHandler({
            alias: this.name,
            sqlBehavior: "error",
            sqlAliasedBehavior: "alias",
            replaceOriginalName: true
          })
        );
      }
    };
    SQLiteView = class extends SQLiteViewBase {
      static {
        __name(this, "SQLiteView");
      }
      static [entityKind] = "SQLiteView";
      constructor({ config }) {
        super(config);
      }
    };
  }
});

// ../node_modules/drizzle-orm/sqlite-core/index.js
var init_sqlite_core = __esm({
  "../node_modules/drizzle-orm/sqlite-core/index.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_alias2();
    init_checks();
    init_columns();
    init_db();
    init_dialect();
    init_foreign_keys2();
    init_indexes();
    init_primary_keys2();
    init_query_builders();
    init_session();
    init_subquery2();
    init_table3();
    init_unique_constraint2();
    init_utils2();
    init_view();
  }
});

// ../node_modules/drizzle-orm/libsql/session.js
function normalizeRow(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    if (Object.prototype.propertyIsEnumerable.call(obj, key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}
function normalizeFieldValue(value) {
  if (typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer) {
    if (typeof Buffer !== "undefined") {
      if (!(value instanceof Buffer)) {
        return Buffer.from(value);
      }
      return value;
    }
    if (typeof TextDecoder !== "undefined") {
      return new TextDecoder().decode(value);
    }
    throw new Error("TextDecoder is not available. Please provide either Buffer or TextDecoder polyfill.");
  }
  return value;
}
var LibSQLSession, LibSQLTransaction, LibSQLPreparedQuery;
var init_session2 = __esm({
  "../node_modules/drizzle-orm/libsql/session.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_core();
    init_entity();
    init_logger2();
    init_sql2();
    init_sqlite_core();
    init_session();
    init_utils();
    LibSQLSession = class _LibSQLSession extends SQLiteSession {
      static {
        __name(this, "LibSQLSession");
      }
      constructor(client, dialect, schema, options, tx) {
        super(dialect);
        this.client = client;
        this.schema = schema;
        this.options = options;
        this.tx = tx;
        this.logger = options.logger ?? new NoopLogger();
        this.cache = options.cache ?? new NoopCache();
      }
      static [entityKind] = "LibSQLSession";
      logger;
      cache;
      prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
        return new LibSQLPreparedQuery(
          this.client,
          query,
          this.logger,
          this.cache,
          queryMetadata,
          cacheConfig,
          fields,
          this.tx,
          executeMethod,
          isResponseInArrayMode,
          customResultMapper
        );
      }
      async batch(queries) {
        const preparedQueries = [];
        const builtQueries = [];
        for (const query of queries) {
          const preparedQuery = query._prepare();
          const builtQuery = preparedQuery.getQuery();
          preparedQueries.push(preparedQuery);
          builtQueries.push({ sql: builtQuery.sql, args: builtQuery.params });
        }
        const batchResults = await this.client.batch(builtQueries);
        return batchResults.map((result, i) => preparedQueries[i].mapResult(result, true));
      }
      async migrate(queries) {
        const preparedQueries = [];
        const builtQueries = [];
        for (const query of queries) {
          const preparedQuery = query._prepare();
          const builtQuery = preparedQuery.getQuery();
          preparedQueries.push(preparedQuery);
          builtQueries.push({ sql: builtQuery.sql, args: builtQuery.params });
        }
        const batchResults = await this.client.migrate(builtQueries);
        return batchResults.map((result, i) => preparedQueries[i].mapResult(result, true));
      }
      async transaction(transaction, _config) {
        const libsqlTx = await this.client.transaction();
        const session = new _LibSQLSession(
          this.client,
          this.dialect,
          this.schema,
          this.options,
          libsqlTx
        );
        const tx = new LibSQLTransaction("async", this.dialect, session, this.schema);
        try {
          const result = await transaction(tx);
          await libsqlTx.commit();
          return result;
        } catch (err) {
          await libsqlTx.rollback();
          throw err;
        }
      }
      extractRawAllValueFromBatchResult(result) {
        return result.rows;
      }
      extractRawGetValueFromBatchResult(result) {
        return result.rows[0];
      }
      extractRawValuesValueFromBatchResult(result) {
        return result.rows;
      }
    };
    LibSQLTransaction = class _LibSQLTransaction extends SQLiteTransaction {
      static {
        __name(this, "LibSQLTransaction");
      }
      static [entityKind] = "LibSQLTransaction";
      async transaction(transaction) {
        const savepointName = `sp${this.nestedIndex}`;
        const tx = new _LibSQLTransaction("async", this.dialect, this.session, this.schema, this.nestedIndex + 1);
        await this.session.run(sql.raw(`savepoint ${savepointName}`));
        try {
          const result = await transaction(tx);
          await this.session.run(sql.raw(`release savepoint ${savepointName}`));
          return result;
        } catch (err) {
          await this.session.run(sql.raw(`rollback to savepoint ${savepointName}`));
          throw err;
        }
      }
    };
    LibSQLPreparedQuery = class extends SQLitePreparedQuery {
      static {
        __name(this, "LibSQLPreparedQuery");
      }
      constructor(client, query, logger2, cache, queryMetadata, cacheConfig, fields, tx, executeMethod, _isResponseInArrayMode, customResultMapper) {
        super("async", executeMethod, query, cache, queryMetadata, cacheConfig);
        this.client = client;
        this.logger = logger2;
        this.fields = fields;
        this.tx = tx;
        this._isResponseInArrayMode = _isResponseInArrayMode;
        this.customResultMapper = customResultMapper;
        this.customResultMapper = customResultMapper;
        this.fields = fields;
      }
      static [entityKind] = "LibSQLPreparedQuery";
      async run(placeholderValues) {
        const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
        this.logger.logQuery(this.query.sql, params);
        return await this.queryWithCache(this.query.sql, params, async () => {
          const stmt = { sql: this.query.sql, args: params };
          return this.tx ? this.tx.execute(stmt) : this.client.execute(stmt);
        });
      }
      async all(placeholderValues) {
        const { fields, logger: logger2, query, tx, client, customResultMapper } = this;
        if (!fields && !customResultMapper) {
          const params = fillPlaceholders(query.params, placeholderValues ?? {});
          logger2.logQuery(query.sql, params);
          return await this.queryWithCache(query.sql, params, async () => {
            const stmt = { sql: query.sql, args: params };
            return (tx ? tx.execute(stmt) : client.execute(stmt)).then(({ rows: rows2 }) => this.mapAllResult(rows2));
          });
        }
        const rows = await this.values(placeholderValues);
        return this.mapAllResult(rows);
      }
      mapAllResult(rows, isFromBatch) {
        if (isFromBatch) {
          rows = rows.rows;
        }
        if (!this.fields && !this.customResultMapper) {
          return rows.map((row) => normalizeRow(row));
        }
        if (this.customResultMapper) {
          return this.customResultMapper(rows, normalizeFieldValue);
        }
        return rows.map((row) => {
          return mapResultRow(
            this.fields,
            Array.prototype.slice.call(row).map((v) => normalizeFieldValue(v)),
            this.joinsNotNullableMap
          );
        });
      }
      async get(placeholderValues) {
        const { fields, logger: logger2, query, tx, client, customResultMapper } = this;
        if (!fields && !customResultMapper) {
          const params = fillPlaceholders(query.params, placeholderValues ?? {});
          logger2.logQuery(query.sql, params);
          return await this.queryWithCache(query.sql, params, async () => {
            const stmt = { sql: query.sql, args: params };
            return (tx ? tx.execute(stmt) : client.execute(stmt)).then(({ rows: rows2 }) => this.mapGetResult(rows2));
          });
        }
        const rows = await this.values(placeholderValues);
        return this.mapGetResult(rows);
      }
      mapGetResult(rows, isFromBatch) {
        if (isFromBatch) {
          rows = rows.rows;
        }
        const row = rows[0];
        if (!this.fields && !this.customResultMapper) {
          return normalizeRow(row);
        }
        if (!row) {
          return void 0;
        }
        if (this.customResultMapper) {
          return this.customResultMapper(rows, normalizeFieldValue);
        }
        return mapResultRow(
          this.fields,
          Array.prototype.slice.call(row).map((v) => normalizeFieldValue(v)),
          this.joinsNotNullableMap
        );
      }
      async values(placeholderValues) {
        const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
        this.logger.logQuery(this.query.sql, params);
        return await this.queryWithCache(this.query.sql, params, async () => {
          const stmt = { sql: this.query.sql, args: params };
          return (this.tx ? this.tx.execute(stmt) : this.client.execute(stmt)).then(({ rows }) => rows);
        });
      }
      /** @internal */
      isResponseInArrayMode() {
        return this._isResponseInArrayMode;
      }
    };
    __name(normalizeRow, "normalizeRow");
    __name(normalizeFieldValue, "normalizeFieldValue");
  }
});

// ../node_modules/drizzle-orm/libsql/driver-core.js
function construct(client, config = {}) {
  const dialect = new SQLiteAsyncDialect({ casing: config.casing });
  let logger2;
  if (config.logger === true) {
    logger2 = new DefaultLogger();
  } else if (config.logger !== false) {
    logger2 = config.logger;
  }
  let schema;
  if (config.schema) {
    const tablesConfig = extractTablesRelationalConfig(
      config.schema,
      createTableRelationsHelpers
    );
    schema = {
      fullSchema: config.schema,
      schema: tablesConfig.tables,
      tableNamesMap: tablesConfig.tableNamesMap
    };
  }
  const session = new LibSQLSession(client, dialect, schema, { logger: logger2, cache: config.cache }, void 0);
  const db = new LibSQLDatabase("async", dialect, session, schema);
  db.$client = client;
  db.$cache = config.cache;
  if (db.$cache) {
    db.$cache["invalidate"] = config.cache?.onMutate;
  }
  return db;
}
var LibSQLDatabase;
var init_driver_core = __esm({
  "../node_modules/drizzle-orm/libsql/driver-core.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_entity();
    init_logger2();
    init_relations();
    init_db();
    init_dialect();
    init_session2();
    LibSQLDatabase = class extends BaseSQLiteDatabase {
      static {
        __name(this, "LibSQLDatabase");
      }
      static [entityKind] = "LibSQLDatabase";
      async batch(batch) {
        return this.session.batch(batch);
      }
    };
    __name(construct, "construct");
  }
});

// ../node_modules/drizzle-orm/libsql/driver.js
function drizzle(...params) {
  if (typeof params[0] === "string") {
    const instance = createClient({
      url: params[0]
    });
    return construct(instance, params[1]);
  }
  if (isConfig(params[0])) {
    const { connection, client, ...drizzleConfig } = params[0];
    if (client) return construct(client, drizzleConfig);
    const instance = typeof connection === "string" ? createClient({ url: connection }) : createClient(connection);
    return construct(instance, drizzleConfig);
  }
  return construct(params[0], params[1]);
}
var init_driver = __esm({
  "../node_modules/drizzle-orm/libsql/driver.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_web2();
    init_utils();
    init_driver_core();
    __name(drizzle, "drizzle");
    ((drizzle2) => {
      function mock(config) {
        return construct({}, config);
      }
      __name(mock, "mock");
      drizzle2.mock = mock;
    })(drizzle || (drizzle = {}));
  }
});

// ../node_modules/drizzle-orm/libsql/index.js
var init_libsql = __esm({
  "../node_modules/drizzle-orm/libsql/index.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_driver();
    init_session2();
  }
});

// ../backend/server/db/schemas/banners.ts
var banners;
var init_banners = __esm({
  "../backend/server/db/schemas/banners.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_sqlite_core();
    banners = sqliteTable("banners", {
      id: text("id").primaryKey(),
      image: text("image").notNull(),
      link: text("link"),
      position: text("position"),
      // hero | mid-1 | mid-2
      order: integer("order").default(0),
      isActive: integer("is_active").default(1)
    });
  }
});

// ../backend/server/db/schemas/categories.ts
var categories;
var init_categories = __esm({
  "../backend/server/db/schemas/categories.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_sqlite_core();
    categories = sqliteTable("categories", {
      id: text("id").primaryKey(),
      name: text("name").notNull(),
      slug: text("slug").notNull().unique(),
      parentId: text("parent_id"),
      image: text("image"),
      isFeatured: integer("is_featured").default(0),
      isActive: integer("is_active").default(1)
    });
  }
});

// ../backend/server/db/schemas/products.ts
var products;
var init_products = __esm({
  "../backend/server/db/schemas/products.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_sqlite_core();
    products = sqliteTable("products", {
      id: text("id").primaryKey(),
      title: text("title").notNull(),
      slug: text("slug").notNull().unique(),
      categoryId: text("category_id"),
      brand: text("brand"),
      price: real("price").notNull(),
      salePrice: real("sale_price"),
      stock: integer("stock").default(0),
      lowStockThreshold: integer("low_stock_threshold").default(5),
      // Alert when stock falls below
      images: text("images"),
      // JSON string → string[]
      tags: text("tags"),
      // JSON string → string[]
      rating: real("rating").default(0),
      reviewCount: integer("review_count").default(0),
      soldCount: integer("sold_count").default(0),
      overview: text("overview"),
      specification: text("specification"),
      highlights: text("highlights"),
      // JSON string -> { icon, title, description }[]
      howItWorks: text("how_it_works"),
      // JSON string -> { step, title, description }[]
      benefits: text("benefits"),
      // JSON string -> string[]
      videoUrl: text("video_url"),
      faqs: text("faqs"),
      // JSON string -> { question, answer }[]
      specSheetUrl: text("spec_sheet_url"),
      comparisonData: text("comparison_data"),
      // JSON string -> { headers: string[], rows: string[][] }
      bundleProducts: text("bundle_products"),
      // JSON string -> string[] (product IDs)
      qna: text("qna"),
      // JSON string -> { question, answer, date }[]
      deliveryInfo: text("delivery_info"),
      // Short text like "৩-৫ দিনে ডেলিভারি"
      warrantyInfo: text("warranty_info"),
      // Short text like "1 Year Warranty"
      offerDeadline: integer("offer_deadline", { mode: "timestamp" }),
      // Countdown timer deadline
      trustBadges: text("trust_badges"),
      // JSON string -> { icon, label }[]
      isActive: integer("is_active").default(1),
      createdAt: integer("created_at", { mode: "timestamp" }),
      updatedAt: integer("updated_at", { mode: "timestamp" })
    }, (table) => {
      return {
        categoryIdx: index("product_category_idx").on(table.categoryId),
        brandIdx: index("product_brand_idx").on(table.brand),
        priceIdx: index("product_price_idx").on(table.price),
        activeIdx: index("product_active_idx").on(table.isActive)
      };
    });
  }
});

// ../node_modules/drizzle-orm/operations.js
var init_operations = __esm({
  "../node_modules/drizzle-orm/operations.js"() {
    init_functionsRoutes_0_6398490784585695();
  }
});

// ../node_modules/drizzle-orm/index.js
var init_drizzle_orm = __esm({
  "../node_modules/drizzle-orm/index.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_alias();
    init_column_builder();
    init_column();
    init_entity();
    init_errors2();
    init_logger2();
    init_operations();
    init_query_promise();
    init_relations();
    init_sql3();
    init_subquery();
    init_table();
    init_utils();
    init_view_common();
  }
});

// ../backend/server/db/schemas/orders.ts
var orders, orderItems, trackings, ordersRelations, orderItemsRelations, trackingsRelations;
var init_orders = __esm({
  "../backend/server/db/schemas/orders.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_sqlite_core();
    init_drizzle_orm();
    orders = sqliteTable("orders", {
      id: text("id").primaryKey(),
      invoiceId: text("invoice_id").unique(),
      userId: text("user_id"),
      // links to users table (nullable for guest checkout)
      customerName: text("customer_name").notNull(),
      customerEmail: text("customer_email"),
      customerPhone: text("customer_phone").notNull(),
      shippingAddress: text("shipping_address").notNull(),
      totalAmount: real("total_amount").notNull(),
      status: text("status").default("pending"),
      // pending, processing, shipped, delivered, cancelled
      paymentMethod: text("payment_method").default("cod"),
      // cod, bkash, nagad, wallet
      paymentPhone: text("payment_phone"),
      // phone number used to send money
      paymentTrxId: text("payment_trx_id"),
      // bKash/Nagad transaction ID
      internalNote: text("internal_note"),
      // admin-only notes
      courierId: text("courier_id"),
      // e.g. Pathao/Steadfast ID
      courierLink: text("courier_link"),
      // link to tracking
      createdAt: integer("created_at", { mode: "timestamp" })
    }, (table) => {
      return {
        userIdIdx: index("order_user_id_idx").on(table.userId),
        customerNameIdx: index("order_customer_name_idx").on(table.customerName),
        customerEmailIdx: index("order_customer_email_idx").on(table.customerEmail),
        statusIdx: index("order_status_idx").on(table.status),
        createdAtIdx: index("order_created_at_idx").on(table.createdAt)
      };
    });
    orderItems = sqliteTable("order_items", {
      id: text("id").primaryKey(),
      orderId: text("order_id").notNull(),
      productId: text("product_id").notNull(),
      quantity: integer("quantity").notNull(),
      price: real("price").notNull()
    }, (table) => {
      return {
        orderIdIdx: index("order_item_order_id_idx").on(table.orderId),
        productIdIdx: index("order_item_product_id_idx").on(table.productId)
      };
    });
    trackings = sqliteTable("trackings", {
      id: text("id").primaryKey(),
      orderId: text("order_id").notNull(),
      status: text("status").notNull(),
      // Order Placed, Processing, Shipped, Out for Delivery, Delivered
      message: text("message"),
      location: text("location"),
      createdAt: integer("created_at", { mode: "timestamp" })
    }, (table) => {
      return {
        orderIdIdx: index("tracking_order_id_idx").on(table.orderId)
      };
    });
    ordersRelations = relations(orders, ({ many }) => ({
      items: many(orderItems),
      trackings: many(trackings)
    }));
    orderItemsRelations = relations(orderItems, ({ one }) => ({
      order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id]
      })
    }));
    trackingsRelations = relations(trackings, ({ one }) => ({
      order: one(orders, {
        fields: [trackings.orderId],
        references: [orders.id]
      })
    }));
  }
});

// ../backend/server/db/schemas/users.ts
var users;
var init_users = __esm({
  "../backend/server/db/schemas/users.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_sqlite_core();
    users = sqliteTable("users", {
      id: text("id").primaryKey(),
      username: text("username").notNull().unique(),
      email: text("email").unique(),
      phone: text("phone"),
      passwordHash: text("password_hash").notNull(),
      fullName: text("full_name"),
      avatar: text("avatar"),
      role: text("role").default("user"),
      // "user" | "admin"
      isVerified: integer("is_verified").default(0),
      isBlocked: integer("is_blocked").default(0),
      // 0 = active, 1 = blocked
      createdAt: integer("created_at", { mode: "timestamp" })
    });
  }
});

// ../backend/server/db/schemas/addresses.ts
var addresses;
var init_addresses = __esm({
  "../backend/server/db/schemas/addresses.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_sqlite_core();
    addresses = sqliteTable("addresses", {
      id: text("id").primaryKey(),
      userId: text("user_id").notNull(),
      label: text("label"),
      // "Home", "Office", etc.
      fullName: text("full_name").notNull(),
      phone: text("phone").notNull(),
      address: text("address").notNull(),
      city: text("city"),
      postalCode: text("postal_code"),
      isDefault: integer("is_default").default(0),
      createdAt: integer("created_at", { mode: "timestamp" })
    }, (table) => {
      return {
        userIdIdx: index("address_user_idx").on(table.userId)
      };
    });
  }
});

// ../backend/server/db/schemas/reviews.ts
var reviews;
var init_reviews = __esm({
  "../backend/server/db/schemas/reviews.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_sqlite_core();
    reviews = sqliteTable("reviews", {
      id: text("id").primaryKey(),
      productId: text("product_id").notNull(),
      userId: text("user_id").notNull(),
      username: text("username").notNull(),
      rating: integer("rating").notNull(),
      // 1-5
      title: text("title"),
      content: text("content"),
      images: text("images"),
      // JSON string → string[]
      isVerified: integer("is_verified").default(0),
      // Verified Purchase badge
      orderId: text("order_id"),
      // Link to specific order
      helpfulCount: integer("helpful_count").default(0),
      status: text("status").default("approved"),
      // "pending" | "approved" | "flagged" | "rejected"
      createdAt: integer("created_at", { mode: "timestamp" })
    }, (table) => {
      return {
        productIdx: index("review_product_idx").on(table.productId),
        userIdIdx: index("review_user_idx").on(table.userId),
        statusIdx: index("review_status_idx").on(table.status),
        productStatusIdx: index("review_product_status_idx").on(table.productId, table.status)
      };
    });
  }
});

// ../backend/server/db/schemas/returns.ts
var returns;
var init_returns = __esm({
  "../backend/server/db/schemas/returns.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_sqlite_core();
    returns = sqliteTable("returns", {
      id: text("id").primaryKey(),
      orderId: text("order_id").notNull(),
      userId: text("user_id").notNull(),
      reason: text("reason").notNull(),
      details: text("details"),
      // Additional text from user
      images: text("images"),
      // Evidence images (JSON string → string[])
      status: text("status").default("Requested"),
      // Requested, Approved, Rejected, Completed
      type: text("type").notNull(),
      // "return" | "cancellation"
      adminNotes: text("admin_notes"),
      // Admin response
      createdAt: integer("created_at", { mode: "timestamp" })
    }, (table) => {
      return {
        userIdIdx: index("return_user_idx").on(table.userId),
        typeIdx: index("return_type_idx").on(table.type)
      };
    });
  }
});

// ../backend/server/db/schemas/wallet.ts
var walletTransactions;
var init_wallet = __esm({
  "../backend/server/db/schemas/wallet.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_sqlite_core();
    walletTransactions = sqliteTable("wallet_transactions", {
      id: text("id").primaryKey(),
      userId: text("user_id").notNull(),
      amount: real("amount").notNull(),
      type: text("type").notNull(),
      // "credit" | "debit"
      reference: text("reference"),
      // e.g. "Refund for order #INV-XXX", "Top-up"
      balanceAfter: real("balance_after"),
      // Running balance after this txn
      createdAt: integer("created_at", { mode: "timestamp" })
    }, (table) => {
      return {
        userIdIdx: index("wallet_user_idx").on(table.userId)
      };
    });
  }
});

// ../backend/server/db/schemas/otp.ts
var otpCodes;
var init_otp = __esm({
  "../backend/server/db/schemas/otp.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_sqlite_core();
    otpCodes = sqliteTable("otp_codes", {
      id: text("id").primaryKey(),
      userId: text("user_id").notNull(),
      code: text("code").notNull(),
      // 6-digit code
      type: text("type").notNull(),
      // "email_verify" | "password_reset"
      expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
      metadata: text("metadata"),
      // JSON string for pending data
      used: integer("used").default(0),
      // 0 or 1
      createdAt: integer("created_at", { mode: "timestamp" })
    });
  }
});

// ../backend/server/db/schemas/coupons.ts
var coupons;
var init_coupons = __esm({
  "../backend/server/db/schemas/coupons.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_sqlite_core();
    coupons = sqliteTable("coupons", {
      id: text("id").primaryKey(),
      code: text("code").notNull().unique(),
      // e.g. "SAVE10"
      description: text("description"),
      // Readable label
      type: text("type").notNull(),
      // "percentage" | "fixed"
      value: real("value").notNull(),
      // 10 (%) or 5.00 ($)
      minOrderAmount: real("min_order_amount").default(0),
      // Minimum order to apply
      maxDiscount: real("max_discount"),
      // Cap for percentage coupons
      usageLimit: integer("usage_limit"),
      // null = unlimited
      usedCount: integer("used_count").default(0),
      isActive: integer("is_active").default(1),
      // 0 = disabled
      applicableType: text("applicable_type").notNull().default("all"),
      // "all" | "product" | "category"
      applicableIds: text("applicable_ids", { mode: "json" }),
      // JSON array of string IDs
      startsAt: integer("starts_at", { mode: "timestamp" }),
      expiresAt: integer("expires_at", { mode: "timestamp" }),
      createdAt: integer("created_at", { mode: "timestamp" })
    });
  }
});

// ../backend/server/db/schemas/adminLogs.ts
var adminLogs;
var init_adminLogs = __esm({
  "../backend/server/db/schemas/adminLogs.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_sqlite_core();
    adminLogs = sqliteTable("admin_logs", {
      id: text("id").primaryKey(),
      adminId: text("admin_id"),
      // Who performed the action
      action: text("action").notNull(),
      // e.g. "order.approve", "review.flag", "user.block"
      entity: text("entity"),
      // e.g. "order", "review", "user", "product"
      entityId: text("entity_id"),
      // ID of the affected record
      details: text("details"),
      // JSON or free-text description
      ipAddress: text("ip_address"),
      createdAt: integer("created_at", { mode: "timestamp" })
    });
  }
});

// ../backend/server/db/schemas/notifications.ts
var notifications;
var init_notifications = __esm({
  "../backend/server/db/schemas/notifications.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_sqlite_core();
    notifications = sqliteTable("notifications", {
      id: text("id").primaryKey(),
      userId: text("user_id"),
      // can be null for all/broadcast
      title: text("title").notNull(),
      message: text("message").notNull(),
      type: text("type").notNull().default("info"),
      // 'offer', 'order_status', 'info'
      isRead: integer("is_read").notNull().default(0),
      orderId: text("order_id"),
      createdAt: text("created_at")
    }, (table) => {
      return {
        userIdIdx: index("notification_user_idx").on(table.userId),
        isReadIdx: index("notification_is_read_idx").on(table.isRead)
      };
    });
  }
});

// ../backend/server/db/schemas/productSales.ts
var productSales;
var init_productSales = __esm({
  "../backend/server/db/schemas/productSales.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_sqlite_core();
    productSales = sqliteTable("product_sales", {
      id: text("id").primaryKey(),
      productId: text("product_id").notNull(),
      orderId: text("order_id").notNull(),
      userId: text("user_id"),
      customerName: text("customer_name").notNull(),
      customerEmail: text("customer_email"),
      customerPhone: text("customer_phone").notNull(),
      invoiceId: text("invoice_id").notNull(),
      price: real("price").notNull(),
      quantity: integer("quantity").notNull(),
      total: real("total").notNull(),
      createdAt: integer("created_at", { mode: "timestamp" })
    });
  }
});

// ../backend/server/db/schemas/popupSettings.ts
var popupSettings;
var init_popupSettings = __esm({
  "../backend/server/db/schemas/popupSettings.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_sqlite_core();
    popupSettings = sqliteTable("popup_settings", {
      id: integer("id").primaryKey({ autoIncrement: true }),
      title: text("title").notNull(),
      description: text("description").notNull(),
      buttonText: text("button_text").notNull(),
      link: text("link"),
      // Can be a product URL or any link
      imageUrl: text("image_url"),
      isActive: integer("is_active").default(1),
      // 1 for true, 0 for false
      updatedAt: text("updated_at")
    });
  }
});

// ../backend/server/db/schemas/interactions.ts
var userInteractions, productSimilarity;
var init_interactions = __esm({
  "../backend/server/db/schemas/interactions.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_sqlite_core();
    userInteractions = sqliteTable("user_interactions", {
      id: text("id").primaryKey(),
      userId: text("user_id"),
      // Can be null for guests
      sessionId: text("session_id"),
      // To track guests
      productId: text("product_id").notNull(),
      interactionType: text("interaction_type").notNull(),
      // 'view', 'add_to_cart', 'purchase'
      weight: integer("weight").notNull().default(1),
      // view=1, cart=3, purchase=10
      createdAt: integer("created_at", { mode: "timestamp" }).notNull()
    });
    productSimilarity = sqliteTable("product_similarity", {
      id: text("id").primaryKey(),
      productA: text("product_a").notNull(),
      productB: text("product_b").notNull(),
      score: real("score").notNull(),
      // Similarity score
      updatedAt: integer("updated_at", { mode: "timestamp" }).notNull()
    });
  }
});

// ../backend/server/db/schemas/cache.ts
var systemCache;
var init_cache2 = __esm({
  "../backend/server/db/schemas/cache.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_sqlite_core();
    systemCache = sqliteTable("system_cache", {
      key: text("key").primaryKey(),
      data: text("data").notNull(),
      // Store pre-formatted JSON
      updatedAt: integer("updated_at", { mode: "timestamp" }).notNull()
    });
  }
});

// ../backend/server/db/schemas/systemSettings.ts
var systemSettings;
var init_systemSettings = __esm({
  "../backend/server/db/schemas/systemSettings.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_sqlite_core();
    systemSettings = sqliteTable("system_settings", {
      id: text("id").primaryKey(),
      key: text("key").unique().notNull(),
      // e.g., 'bkash_number', 'nagad_number'
      value: text("value").notNull(),
      updatedAt: text("updated_at").notNull()
    });
  }
});

// ../backend/server/db/schemas/newsletterLeads.ts
var newsletterLeads;
var init_newsletterLeads = __esm({
  "../backend/server/db/schemas/newsletterLeads.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_sqlite_core();
    newsletterLeads = sqliteTable("newsletter_leads", {
      id: text("id").primaryKey(),
      email: text("email").notNull().unique(),
      source: text("source").default("footer"),
      // "footer" | "popup" | "checkout"
      isActive: integer("is_active").default(1),
      // 1 = subscribed, 0 = unsubscribed
      subscribedAt: text("subscribed_at"),
      unsubscribedAt: text("unsubscribed_at")
    });
  }
});

// ../backend/server/db/schemas/index.ts
var init_schemas = __esm({
  "../backend/server/db/schemas/index.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_banners();
    init_categories();
    init_products();
    init_orders();
    init_users();
    init_addresses();
    init_reviews();
    init_returns();
    init_wallet();
    init_otp();
    init_coupons();
    init_adminLogs();
    init_notifications();
    init_productSales();
    init_popupSettings();
    init_interactions();
    init_cache2();
    init_systemSettings();
    init_newsletterLeads();
  }
});

// ../backend/server/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  addresses: () => addresses,
  adminLogs: () => adminLogs,
  banners: () => banners,
  categories: () => categories,
  coupons: () => coupons,
  newsletterLeads: () => newsletterLeads,
  notifications: () => notifications,
  orderItems: () => orderItems,
  orderItemsRelations: () => orderItemsRelations,
  orders: () => orders,
  ordersRelations: () => ordersRelations,
  otpCodes: () => otpCodes,
  popupSettings: () => popupSettings,
  productSales: () => productSales,
  productSimilarity: () => productSimilarity,
  products: () => products,
  returns: () => returns,
  reviews: () => reviews,
  systemCache: () => systemCache,
  systemSettings: () => systemSettings,
  trackings: () => trackings,
  trackingsRelations: () => trackingsRelations,
  userInteractions: () => userInteractions,
  users: () => users,
  walletTransactions: () => walletTransactions
});
var init_schema = __esm({
  "../backend/server/db/schema.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_schemas();
  }
});

// ../node_modules/hono/dist/utils/cookie.js
var init_cookie = __esm({
  "../node_modules/hono/dist/utils/cookie.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_url();
  }
});

// ../node_modules/hono/dist/helper/cookie/index.js
var init_cookie2 = __esm({
  "../node_modules/hono/dist/helper/cookie/index.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_cookie();
  }
});

// ../node_modules/hono/dist/utils/encode.js
var decodeBase64Url, encodeBase64Url, encodeBase64, decodeBase64;
var init_encode3 = __esm({
  "../node_modules/hono/dist/utils/encode.js"() {
    init_functionsRoutes_0_6398490784585695();
    decodeBase64Url = /* @__PURE__ */ __name((str) => {
      return decodeBase64(str.replace(/_|-/g, (m) => ({ _: "/", "-": "+" })[m] ?? m));
    }, "decodeBase64Url");
    encodeBase64Url = /* @__PURE__ */ __name((buf) => encodeBase64(buf).replace(/\/|\+/g, (m) => ({ "/": "_", "+": "-" })[m] ?? m), "encodeBase64Url");
    encodeBase64 = /* @__PURE__ */ __name((buf) => {
      let binary = "";
      const bytes = new Uint8Array(buf);
      for (let i = 0, len = bytes.length; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    }, "encodeBase64");
    decodeBase64 = /* @__PURE__ */ __name((str) => {
      const binary = atob(str);
      const bytes = new Uint8Array(new ArrayBuffer(binary.length));
      const half = binary.length / 2;
      for (let i = 0, j = binary.length - 1; i <= half; i++, j--) {
        bytes[i] = binary.charCodeAt(i);
        bytes[j] = binary.charCodeAt(j);
      }
      return bytes;
    }, "decodeBase64");
  }
});

// ../node_modules/hono/dist/utils/jwt/jwa.js
var AlgorithmTypes;
var init_jwa = __esm({
  "../node_modules/hono/dist/utils/jwt/jwa.js"() {
    init_functionsRoutes_0_6398490784585695();
    AlgorithmTypes = /* @__PURE__ */ ((AlgorithmTypes2) => {
      AlgorithmTypes2["HS256"] = "HS256";
      AlgorithmTypes2["HS384"] = "HS384";
      AlgorithmTypes2["HS512"] = "HS512";
      AlgorithmTypes2["RS256"] = "RS256";
      AlgorithmTypes2["RS384"] = "RS384";
      AlgorithmTypes2["RS512"] = "RS512";
      AlgorithmTypes2["PS256"] = "PS256";
      AlgorithmTypes2["PS384"] = "PS384";
      AlgorithmTypes2["PS512"] = "PS512";
      AlgorithmTypes2["ES256"] = "ES256";
      AlgorithmTypes2["ES384"] = "ES384";
      AlgorithmTypes2["ES512"] = "ES512";
      AlgorithmTypes2["EdDSA"] = "EdDSA";
      return AlgorithmTypes2;
    })(AlgorithmTypes || {});
  }
});

// ../node_modules/hono/dist/helper/adapter/index.js
var knownUserAgents, getRuntimeKey, checkUserAgentEquals;
var init_adapter = __esm({
  "../node_modules/hono/dist/helper/adapter/index.js"() {
    init_functionsRoutes_0_6398490784585695();
    knownUserAgents = {
      deno: "Deno",
      bun: "Bun",
      workerd: "Cloudflare-Workers",
      node: "Node.js"
    };
    getRuntimeKey = /* @__PURE__ */ __name(() => {
      const global2 = globalThis;
      const userAgentSupported = typeof navigator !== "undefined" && true;
      if (userAgentSupported) {
        for (const [runtimeKey, userAgent] of Object.entries(knownUserAgents)) {
          if (checkUserAgentEquals(userAgent)) {
            return runtimeKey;
          }
        }
      }
      if (typeof global2?.EdgeRuntime === "string") {
        return "edge-light";
      }
      if (global2?.fastly !== void 0) {
        return "fastly";
      }
      if (global2?.process?.release?.name === "node") {
        return "node";
      }
      return "other";
    }, "getRuntimeKey");
    checkUserAgentEquals = /* @__PURE__ */ __name((platform) => {
      const userAgent = "Cloudflare-Workers";
      return userAgent.startsWith(platform);
    }, "checkUserAgentEquals");
  }
});

// ../node_modules/hono/dist/utils/jwt/types.js
var JwtAlgorithmNotImplemented, JwtAlgorithmRequired, JwtAlgorithmMismatch, JwtTokenInvalid, JwtTokenNotBefore, JwtTokenExpired, JwtTokenIssuedAt, JwtTokenIssuer, JwtHeaderInvalid, JwtHeaderRequiresKid, JwtSymmetricAlgorithmNotAllowed, JwtAlgorithmNotAllowed, JwtTokenSignatureMismatched, JwtPayloadRequiresAud, JwtTokenAudience, CryptoKeyUsage;
var init_types = __esm({
  "../node_modules/hono/dist/utils/jwt/types.js"() {
    init_functionsRoutes_0_6398490784585695();
    JwtAlgorithmNotImplemented = class extends Error {
      static {
        __name(this, "JwtAlgorithmNotImplemented");
      }
      constructor(alg) {
        super(`${alg} is not an implemented algorithm`);
        this.name = "JwtAlgorithmNotImplemented";
      }
    };
    JwtAlgorithmRequired = class extends Error {
      static {
        __name(this, "JwtAlgorithmRequired");
      }
      constructor() {
        super('JWT verification requires "alg" option to be specified');
        this.name = "JwtAlgorithmRequired";
      }
    };
    JwtAlgorithmMismatch = class extends Error {
      static {
        __name(this, "JwtAlgorithmMismatch");
      }
      constructor(expected, actual) {
        super(`JWT algorithm mismatch: expected "${expected}", got "${actual}"`);
        this.name = "JwtAlgorithmMismatch";
      }
    };
    JwtTokenInvalid = class extends Error {
      static {
        __name(this, "JwtTokenInvalid");
      }
      constructor(token) {
        super(`invalid JWT token: ${token}`);
        this.name = "JwtTokenInvalid";
      }
    };
    JwtTokenNotBefore = class extends Error {
      static {
        __name(this, "JwtTokenNotBefore");
      }
      constructor(token) {
        super(`token (${token}) is being used before it's valid`);
        this.name = "JwtTokenNotBefore";
      }
    };
    JwtTokenExpired = class extends Error {
      static {
        __name(this, "JwtTokenExpired");
      }
      constructor(token) {
        super(`token (${token}) expired`);
        this.name = "JwtTokenExpired";
      }
    };
    JwtTokenIssuedAt = class extends Error {
      static {
        __name(this, "JwtTokenIssuedAt");
      }
      constructor(currentTimestamp, iat) {
        super(
          `Invalid "iat" claim, must be a valid number lower than "${currentTimestamp}" (iat: "${iat}")`
        );
        this.name = "JwtTokenIssuedAt";
      }
    };
    JwtTokenIssuer = class extends Error {
      static {
        __name(this, "JwtTokenIssuer");
      }
      constructor(expected, iss) {
        super(`expected issuer "${expected}", got ${iss ? `"${iss}"` : "none"} `);
        this.name = "JwtTokenIssuer";
      }
    };
    JwtHeaderInvalid = class extends Error {
      static {
        __name(this, "JwtHeaderInvalid");
      }
      constructor(header) {
        super(`jwt header is invalid: ${JSON.stringify(header)}`);
        this.name = "JwtHeaderInvalid";
      }
    };
    JwtHeaderRequiresKid = class extends Error {
      static {
        __name(this, "JwtHeaderRequiresKid");
      }
      constructor(header) {
        super(`required "kid" in jwt header: ${JSON.stringify(header)}`);
        this.name = "JwtHeaderRequiresKid";
      }
    };
    JwtSymmetricAlgorithmNotAllowed = class extends Error {
      static {
        __name(this, "JwtSymmetricAlgorithmNotAllowed");
      }
      constructor(alg) {
        super(`symmetric algorithm "${alg}" is not allowed for JWK verification`);
        this.name = "JwtSymmetricAlgorithmNotAllowed";
      }
    };
    JwtAlgorithmNotAllowed = class extends Error {
      static {
        __name(this, "JwtAlgorithmNotAllowed");
      }
      constructor(alg, allowedAlgorithms) {
        super(`algorithm "${alg}" is not in the allowed list: [${allowedAlgorithms.join(", ")}]`);
        this.name = "JwtAlgorithmNotAllowed";
      }
    };
    JwtTokenSignatureMismatched = class extends Error {
      static {
        __name(this, "JwtTokenSignatureMismatched");
      }
      constructor(token) {
        super(`token(${token}) signature mismatched`);
        this.name = "JwtTokenSignatureMismatched";
      }
    };
    JwtPayloadRequiresAud = class extends Error {
      static {
        __name(this, "JwtPayloadRequiresAud");
      }
      constructor(payload) {
        super(`required "aud" in jwt payload: ${JSON.stringify(payload)}`);
        this.name = "JwtPayloadRequiresAud";
      }
    };
    JwtTokenAudience = class extends Error {
      static {
        __name(this, "JwtTokenAudience");
      }
      constructor(expected, aud) {
        super(
          `expected audience "${Array.isArray(expected) ? expected.join(", ") : expected}", got "${aud}"`
        );
        this.name = "JwtTokenAudience";
      }
    };
    CryptoKeyUsage = /* @__PURE__ */ ((CryptoKeyUsage2) => {
      CryptoKeyUsage2["Encrypt"] = "encrypt";
      CryptoKeyUsage2["Decrypt"] = "decrypt";
      CryptoKeyUsage2["Sign"] = "sign";
      CryptoKeyUsage2["Verify"] = "verify";
      CryptoKeyUsage2["DeriveKey"] = "deriveKey";
      CryptoKeyUsage2["DeriveBits"] = "deriveBits";
      CryptoKeyUsage2["WrapKey"] = "wrapKey";
      CryptoKeyUsage2["UnwrapKey"] = "unwrapKey";
      return CryptoKeyUsage2;
    })(CryptoKeyUsage || {});
  }
});

// ../node_modules/hono/dist/utils/jwt/utf8.js
var utf8Encoder, utf8Decoder;
var init_utf8 = __esm({
  "../node_modules/hono/dist/utils/jwt/utf8.js"() {
    init_functionsRoutes_0_6398490784585695();
    utf8Encoder = new TextEncoder();
    utf8Decoder = new TextDecoder();
  }
});

// ../node_modules/hono/dist/utils/jwt/jws.js
async function signing(privateKey, alg, data) {
  const algorithm = getKeyAlgorithm(alg);
  const cryptoKey = await importPrivateKey(privateKey, algorithm);
  return await crypto.subtle.sign(algorithm, cryptoKey, data);
}
async function verifying(publicKey, alg, signature, data) {
  const algorithm = getKeyAlgorithm(alg);
  const cryptoKey = await importPublicKey(publicKey, algorithm);
  return await crypto.subtle.verify(algorithm, cryptoKey, signature, data);
}
function pemToBinary(pem) {
  return decodeBase64(pem.replace(/-+(BEGIN|END).*?-+/g, "").replace(/\s/g, ""));
}
async function importPrivateKey(key, alg) {
  if (!crypto.subtle || !crypto.subtle.importKey) {
    throw new Error("`crypto.subtle.importKey` is undefined. JWT auth middleware requires it.");
  }
  if (isCryptoKey(key)) {
    if (key.type !== "private" && key.type !== "secret") {
      throw new Error(
        `unexpected key type: CryptoKey.type is ${key.type}, expected private or secret`
      );
    }
    return key;
  }
  const usages = [CryptoKeyUsage.Sign];
  if (typeof key === "object") {
    return await crypto.subtle.importKey("jwk", key, alg, false, usages);
  }
  if (key.includes("PRIVATE")) {
    return await crypto.subtle.importKey("pkcs8", pemToBinary(key), alg, false, usages);
  }
  return await crypto.subtle.importKey("raw", utf8Encoder.encode(key), alg, false, usages);
}
async function importPublicKey(key, alg) {
  if (!crypto.subtle || !crypto.subtle.importKey) {
    throw new Error("`crypto.subtle.importKey` is undefined. JWT auth middleware requires it.");
  }
  if (isCryptoKey(key)) {
    if (key.type === "public" || key.type === "secret") {
      return key;
    }
    key = await exportPublicJwkFrom(key);
  }
  if (typeof key === "string" && key.includes("PRIVATE")) {
    const privateKey = await crypto.subtle.importKey("pkcs8", pemToBinary(key), alg, true, [
      CryptoKeyUsage.Sign
    ]);
    key = await exportPublicJwkFrom(privateKey);
  }
  const usages = [CryptoKeyUsage.Verify];
  if (typeof key === "object") {
    return await crypto.subtle.importKey("jwk", key, alg, false, usages);
  }
  if (key.includes("PUBLIC")) {
    return await crypto.subtle.importKey("spki", pemToBinary(key), alg, false, usages);
  }
  return await crypto.subtle.importKey("raw", utf8Encoder.encode(key), alg, false, usages);
}
async function exportPublicJwkFrom(privateKey) {
  if (privateKey.type !== "private") {
    throw new Error(`unexpected key type: ${privateKey.type}`);
  }
  if (!privateKey.extractable) {
    throw new Error("unexpected private key is unextractable");
  }
  const jwk = await crypto.subtle.exportKey("jwk", privateKey);
  const { kty } = jwk;
  const { alg, e, n } = jwk;
  const { crv, x, y } = jwk;
  return { kty, alg, e, n, crv, x, y, key_ops: [CryptoKeyUsage.Verify] };
}
function getKeyAlgorithm(name) {
  switch (name) {
    case "HS256":
      return {
        name: "HMAC",
        hash: {
          name: "SHA-256"
        }
      };
    case "HS384":
      return {
        name: "HMAC",
        hash: {
          name: "SHA-384"
        }
      };
    case "HS512":
      return {
        name: "HMAC",
        hash: {
          name: "SHA-512"
        }
      };
    case "RS256":
      return {
        name: "RSASSA-PKCS1-v1_5",
        hash: {
          name: "SHA-256"
        }
      };
    case "RS384":
      return {
        name: "RSASSA-PKCS1-v1_5",
        hash: {
          name: "SHA-384"
        }
      };
    case "RS512":
      return {
        name: "RSASSA-PKCS1-v1_5",
        hash: {
          name: "SHA-512"
        }
      };
    case "PS256":
      return {
        name: "RSA-PSS",
        hash: {
          name: "SHA-256"
        },
        saltLength: 32
        // 256 >> 3
      };
    case "PS384":
      return {
        name: "RSA-PSS",
        hash: {
          name: "SHA-384"
        },
        saltLength: 48
        // 384 >> 3
      };
    case "PS512":
      return {
        name: "RSA-PSS",
        hash: {
          name: "SHA-512"
        },
        saltLength: 64
        // 512 >> 3,
      };
    case "ES256":
      return {
        name: "ECDSA",
        hash: {
          name: "SHA-256"
        },
        namedCurve: "P-256"
      };
    case "ES384":
      return {
        name: "ECDSA",
        hash: {
          name: "SHA-384"
        },
        namedCurve: "P-384"
      };
    case "ES512":
      return {
        name: "ECDSA",
        hash: {
          name: "SHA-512"
        },
        namedCurve: "P-521"
      };
    case "EdDSA":
      return {
        name: "Ed25519",
        namedCurve: "Ed25519"
      };
    default:
      throw new JwtAlgorithmNotImplemented(name);
  }
}
function isCryptoKey(key) {
  const runtime = getRuntimeKey();
  if (runtime === "node" && !!crypto.webcrypto) {
    return key instanceof crypto.webcrypto.CryptoKey;
  }
  return key instanceof CryptoKey;
}
var init_jws = __esm({
  "../node_modules/hono/dist/utils/jwt/jws.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_adapter();
    init_encode3();
    init_types();
    init_utf8();
    __name(signing, "signing");
    __name(verifying, "verifying");
    __name(pemToBinary, "pemToBinary");
    __name(importPrivateKey, "importPrivateKey");
    __name(importPublicKey, "importPublicKey");
    __name(exportPublicJwkFrom, "exportPublicJwkFrom");
    __name(getKeyAlgorithm, "getKeyAlgorithm");
    __name(isCryptoKey, "isCryptoKey");
  }
});

// ../node_modules/hono/dist/utils/jwt/jwt.js
function isTokenHeader(obj) {
  if (typeof obj === "object" && obj !== null) {
    const objWithAlg = obj;
    return "alg" in objWithAlg && Object.values(AlgorithmTypes).includes(objWithAlg.alg) && (!("typ" in objWithAlg) || objWithAlg.typ === "JWT");
  }
  return false;
}
var encodeJwtPart, encodeSignaturePart, decodeJwtPart, sign, verify, symmetricAlgorithms, verifyWithJwks, decode2, decodeHeader;
var init_jwt = __esm({
  "../node_modules/hono/dist/utils/jwt/jwt.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_encode3();
    init_jwa();
    init_jws();
    init_types();
    init_utf8();
    encodeJwtPart = /* @__PURE__ */ __name((part) => encodeBase64Url(utf8Encoder.encode(JSON.stringify(part)).buffer).replace(/=/g, ""), "encodeJwtPart");
    encodeSignaturePart = /* @__PURE__ */ __name((buf) => encodeBase64Url(buf).replace(/=/g, ""), "encodeSignaturePart");
    decodeJwtPart = /* @__PURE__ */ __name((part) => JSON.parse(utf8Decoder.decode(decodeBase64Url(part))), "decodeJwtPart");
    __name(isTokenHeader, "isTokenHeader");
    sign = /* @__PURE__ */ __name(async (payload, privateKey, alg = "HS256") => {
      const encodedPayload = encodeJwtPart(payload);
      let encodedHeader;
      if (typeof privateKey === "object" && "alg" in privateKey) {
        alg = privateKey.alg;
        encodedHeader = encodeJwtPart({ alg, typ: "JWT", kid: privateKey.kid });
      } else {
        encodedHeader = encodeJwtPart({ alg, typ: "JWT" });
      }
      const partialToken = `${encodedHeader}.${encodedPayload}`;
      const signaturePart = await signing(privateKey, alg, utf8Encoder.encode(partialToken));
      const signature = encodeSignaturePart(signaturePart);
      return `${partialToken}.${signature}`;
    }, "sign");
    verify = /* @__PURE__ */ __name(async (token, publicKey, algOrOptions) => {
      if (!algOrOptions) {
        throw new JwtAlgorithmRequired();
      }
      const {
        alg,
        iss,
        nbf = true,
        exp = true,
        iat = true,
        aud
      } = typeof algOrOptions === "string" ? { alg: algOrOptions } : algOrOptions;
      if (!alg) {
        throw new JwtAlgorithmRequired();
      }
      const tokenParts = token.split(".");
      if (tokenParts.length !== 3) {
        throw new JwtTokenInvalid(token);
      }
      const { header, payload } = decode2(token);
      if (!isTokenHeader(header)) {
        throw new JwtHeaderInvalid(header);
      }
      if (header.alg !== alg) {
        throw new JwtAlgorithmMismatch(alg, header.alg);
      }
      const now = Math.floor(Date.now() / 1e3);
      if (nbf && payload.nbf && payload.nbf > now) {
        throw new JwtTokenNotBefore(token);
      }
      if (exp && payload.exp && payload.exp <= now) {
        throw new JwtTokenExpired(token);
      }
      if (iat && payload.iat && now < payload.iat) {
        throw new JwtTokenIssuedAt(now, payload.iat);
      }
      if (iss) {
        if (!payload.iss) {
          throw new JwtTokenIssuer(iss, null);
        }
        if (typeof iss === "string" && payload.iss !== iss) {
          throw new JwtTokenIssuer(iss, payload.iss);
        }
        if (iss instanceof RegExp && !iss.test(payload.iss)) {
          throw new JwtTokenIssuer(iss, payload.iss);
        }
      }
      if (aud) {
        if (!payload.aud) {
          throw new JwtPayloadRequiresAud(payload);
        }
        const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
        const matched = audiences.some(
          (payloadAud) => aud instanceof RegExp ? aud.test(payloadAud) : typeof aud === "string" ? payloadAud === aud : Array.isArray(aud) && aud.includes(payloadAud)
        );
        if (!matched) {
          throw new JwtTokenAudience(aud, payload.aud);
        }
      }
      const headerPayload = token.substring(0, token.lastIndexOf("."));
      const verified = await verifying(
        publicKey,
        alg,
        decodeBase64Url(tokenParts[2]),
        utf8Encoder.encode(headerPayload)
      );
      if (!verified) {
        throw new JwtTokenSignatureMismatched(token);
      }
      return payload;
    }, "verify");
    symmetricAlgorithms = [
      AlgorithmTypes.HS256,
      AlgorithmTypes.HS384,
      AlgorithmTypes.HS512
    ];
    verifyWithJwks = /* @__PURE__ */ __name(async (token, options, init) => {
      const verifyOpts = options.verification || {};
      const header = decodeHeader(token);
      if (!isTokenHeader(header)) {
        throw new JwtHeaderInvalid(header);
      }
      if (!header.kid) {
        throw new JwtHeaderRequiresKid(header);
      }
      if (symmetricAlgorithms.includes(header.alg)) {
        throw new JwtSymmetricAlgorithmNotAllowed(header.alg);
      }
      if (!options.allowedAlgorithms.includes(header.alg)) {
        throw new JwtAlgorithmNotAllowed(header.alg, options.allowedAlgorithms);
      }
      let verifyKeys = options.keys ? [...options.keys] : void 0;
      if (options.jwks_uri) {
        const response = await fetch(options.jwks_uri, init);
        if (!response.ok) {
          throw new Error(`failed to fetch JWKS from ${options.jwks_uri}`);
        }
        const data = await response.json();
        if (!data.keys) {
          throw new Error('invalid JWKS response. "keys" field is missing');
        }
        if (!Array.isArray(data.keys)) {
          throw new Error('invalid JWKS response. "keys" field is not an array');
        }
        verifyKeys ??= [];
        verifyKeys.push(...data.keys);
      } else if (!verifyKeys) {
        throw new Error('verifyWithJwks requires options for either "keys" or "jwks_uri" or both');
      }
      const matchingKey = verifyKeys.find((key) => key.kid === header.kid);
      if (!matchingKey) {
        throw new JwtTokenInvalid(token);
      }
      if (matchingKey.alg && matchingKey.alg !== header.alg) {
        throw new JwtAlgorithmMismatch(matchingKey.alg, header.alg);
      }
      return await verify(token, matchingKey, {
        alg: header.alg,
        ...verifyOpts
      });
    }, "verifyWithJwks");
    decode2 = /* @__PURE__ */ __name((token) => {
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new JwtTokenInvalid(token);
      }
      try {
        const header = decodeJwtPart(parts[0]);
        const payload = decodeJwtPart(parts[1]);
        return {
          header,
          payload
        };
      } catch {
        throw new JwtTokenInvalid(token);
      }
    }, "decode");
    decodeHeader = /* @__PURE__ */ __name((token) => {
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new JwtTokenInvalid(token);
      }
      try {
        return decodeJwtPart(parts[0]);
      } catch {
        throw new JwtTokenInvalid(token);
      }
    }, "decodeHeader");
  }
});

// ../node_modules/hono/dist/utils/jwt/index.js
var Jwt;
var init_jwt2 = __esm({
  "../node_modules/hono/dist/utils/jwt/index.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_jwt();
    Jwt = { sign, verify, decode: decode2, verifyWithJwks };
  }
});

// ../node_modules/hono/dist/middleware/jwt/jwt.js
var verifyWithJwks2, verify2, decode3, sign2;
var init_jwt3 = __esm({
  "../node_modules/hono/dist/middleware/jwt/jwt.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_cookie2();
    init_http_exception();
    init_jwt2();
    init_context();
    verifyWithJwks2 = Jwt.verifyWithJwks;
    verify2 = Jwt.verify;
    decode3 = Jwt.decode;
    sign2 = Jwt.sign;
  }
});

// ../node_modules/hono/dist/middleware/jwt/index.js
var init_jwt4 = __esm({
  "../node_modules/hono/dist/middleware/jwt/index.js"() {
    init_functionsRoutes_0_6398490784585695();
    init_jwt3();
    init_jwa();
  }
});

// api/utils/helpers.ts
var formatLinks, createPaginatedResponse, invalidateHomeCache;
var init_helpers = __esm({
  "api/utils/helpers.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_drizzle_orm();
    formatLinks = /* @__PURE__ */ __name((c, path, id) => {
      const baseUrl = new URL(c.req.url).origin + "/api/v1";
      const self2 = id ? `${baseUrl}${path}/${id}` : `${baseUrl}${path}`;
      return {
        self: self2,
        collection: id ? `${baseUrl}${path}` : void 0
      };
    }, "formatLinks");
    createPaginatedResponse = /* @__PURE__ */ __name((items, total, page, limit, links) => {
      const pages = Math.ceil(total / limit);
      return {
        items,
        pagination: {
          total,
          page,
          limit,
          pages,
          has_next: page < pages,
          has_prev: page > 1
        },
        _links: links
      };
    }, "createPaginatedResponse");
    invalidateHomeCache = /* @__PURE__ */ __name(async (db, schema) => {
      try {
        await db.delete(schema.systemCache).where(eq(schema.systemCache.key, "home_bulk"));
      } catch (err) {
        console.error("Cache Invalidation Error:", err);
      }
    }, "invalidateHomeCache");
  }
});

// api/utils/rateLimiter.ts
function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of rateLimitMap) {
    if (entry.resetAt < now) rateLimitMap.delete(key);
  }
}
function checkRateLimit(key, limit = 5, windowMs = 6e4) {
  cleanup();
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, remaining: limit - 1, resetAt: now + windowMs };
  }
  entry.count++;
  if (entry.count > limit) {
    return { limited: true, remaining: 0, resetAt: entry.resetAt };
  }
  return { limited: false, remaining: limit - entry.count, resetAt: entry.resetAt };
}
var rateLimitMap, CLEANUP_INTERVAL, lastCleanup;
var init_rateLimiter = __esm({
  "api/utils/rateLimiter.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    rateLimitMap = /* @__PURE__ */ new Map();
    CLEANUP_INTERVAL = 6e4;
    lastCleanup = Date.now();
    __name(cleanup, "cleanup");
    __name(checkRateLimit, "checkRateLimit");
  }
});

// api/utils/email.ts
async function sendEmail(scriptUrl, webhookSecret, payload) {
  if (!scriptUrl) {
    console.warn("[EMAIL] GOOGLE_SCRIPT_URL not set \u2014 email skipped:", payload.subject);
    return false;
  }
  try {
    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: webhookSecret,
        to: payload.to,
        subject: payload.subject,
        text: payload.text,
        html: payload.html || payload.text,
        htmlBody: payload.html || payload.text,
        // Some scripts expect htmlBody
        isHtml: !!payload.html,
        senderName: payload.senderName || "PlayPen House"
      })
    });
    if (!res.ok) {
      console.error("[EMAIL] Script returned non-OK:", res.status, await res.text());
      return false;
    }
    console.log("[EMAIL] Sent successfully to:", payload.to, "subject:", payload.subject);
    return true;
  } catch (err) {
    console.error("[EMAIL] Failed to send:", err.message);
    return false;
  }
}
function otpEmailHtml(code, username) {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #fff; border-radius: 16px; border: 1px solid #eee;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #1a1a2e; font-size: 24px; margin: 0;">\u{1F3E0} PlayPen House</h1>
        <p style="color: #888; font-size: 14px; margin: 8px 0 0;">Email Verification</p>
      </div>
      <p style="color: #333; font-size: 15px; line-height: 1.6;">Hi <strong>${username}</strong>,</p>
      <p style="color: #333; font-size: 15px; line-height: 1.6;">Your verification code is:</p>
      <div style="text-align: center; margin: 24px 0;">
        <div style="display: inline-block; background: linear-gradient(135deg, #1a1a2e, #16213e); color: #fff; font-size: 32px; font-weight: 900; letter-spacing: 8px; padding: 16px 32px; border-radius: 12px;">
          ${code}
        </div>
      </div>
      <p style="color: #888; font-size: 13px; text-align: center;">This code expires in <strong>10 minutes</strong>.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="color: #aaa; font-size: 11px; text-align: center;">If you didn't request this, please ignore this email.</p>
    </div>
  `;
}
function passwordResetEmailHtml(code, email) {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #fff; border-radius: 16px; border: 1px solid #eee;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #1a1a2e; font-size: 24px; margin: 0;">\u{1F3E0} PlayPen House</h1>
        <p style="color: #888; font-size: 14px; margin: 8px 0 0;">Password Reset</p>
      </div>
      <p style="color: #333; font-size: 15px; line-height: 1.6;">A password reset was requested for <strong>${email}</strong>.</p>
      <p style="color: #333; font-size: 15px; line-height: 1.6;">Your reset code is:</p>
      <div style="text-align: center; margin: 24px 0;">
        <div style="display: inline-block; background: linear-gradient(135deg, #e74c3c, #c0392b); color: #fff; font-size: 32px; font-weight: 900; letter-spacing: 8px; padding: 16px 32px; border-radius: 12px;">
          ${code}
        </div>
      </div>
      <p style="color: #888; font-size: 13px; text-align: center;">This code expires in <strong>10 minutes</strong>.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="color: #aaa; font-size: 11px; text-align: center;">If you didn't request this, please ignore this email.</p>
    </div>
  `;
}
function orderConfirmationEmailHtml(invoiceId, customerName, totalAmount, items) {
  const itemRows = items.map(
    (item) => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0; font-size: 14px;">${item.name}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0; font-size: 14px; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0; font-size: 14px; text-align: right;">$${item.price.toFixed(2)}</td>
      </tr>`
  ).join("");
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #fff; border-radius: 16px; border: 1px solid #eee;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #1a1a2e; font-size: 24px; margin: 0;">\u{1F3E0} PlayPen House</h1>
        <p style="color: #22c55e; font-size: 14px; font-weight: 700; margin: 8px 0 0;">\u2705 Order Confirmed</p>
      </div>
      <p style="color: #333; font-size: 15px;">Hi <strong>${customerName}</strong>,</p>
      <p style="color: #333; font-size: 15px;">Your order <strong>${invoiceId}</strong> has been placed successfully and is awaiting approval.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <thead>
          <tr style="background: #f8f9fa;">
            <th style="padding: 8px 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #888;">Item</th>
            <th style="padding: 8px 12px; text-align: center; font-size: 12px; text-transform: uppercase; color: #888;">Qty</th>
            <th style="padding: 8px 12px; text-align: right; font-size: 12px; text-transform: uppercase; color: #888;">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
      <div style="text-align: right; margin-top: 12px; font-size: 18px; font-weight: 900; color: #1a1a2e;">
        Total: $${totalAmount.toFixed(2)}
      </div>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="color: #aaa; font-size: 11px; text-align: center;">Thank you for shopping with PlayPen House!</p>
    </div>
  `;
}
function adminNewOrderEmailHtml(invoiceId, customerName, totalAmount, itemCount) {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #fff; border-radius: 16px; border: 2px solid #f59e0b;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #1a1a2e; font-size: 24px; margin: 0;">\u{1F3E0} PlayPen House \u2014 Admin</h1>
        <p style="color: #f59e0b; font-size: 14px; font-weight: 700; margin: 8px 0 0;">\u{1F514} New Order Awaiting Approval</p>
      </div>
      <table style="width: 100%; font-size: 15px; color: #333;">
        <tr><td style="padding: 6px 0; font-weight: 700;">Invoice</td><td>${invoiceId}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 700;">Customer</td><td>${customerName}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 700;">Items</td><td>${itemCount} item(s)</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 700;">Total</td><td style="font-size: 18px; font-weight: 900; color: #22c55e;">$${totalAmount.toFixed(2)}</td></tr>
      </table>
      <div style="text-align: center; margin-top: 24px;">
        <p style="color: #888; font-size: 13px;">Please log in to the Admin Panel to approve or reject this order.</p>
      </div>
    </div>
  `;
}
function orderStatusUpdateEmailHtml(invoiceId, customerName, newStatus, message) {
  const statusColors = {
    Processing: "#3b82f6",
    Shipped: "#8b5cf6",
    "Out for Delivery": "#f59e0b",
    Delivered: "#22c55e",
    Cancelled: "#ef4444"
  };
  const color = statusColors[newStatus] || "#6b7280";
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #fff; border-radius: 16px; border: 1px solid #eee;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #1a1a2e; font-size: 24px; margin: 0;">\u{1F3E0} PlayPen House</h1>
        <p style="color: #888; font-size: 14px; margin: 8px 0 0;">Order Update</p>
      </div>
      <p style="color: #333; font-size: 15px;">Hi <strong>${customerName}</strong>,</p>
      <p style="color: #333; font-size: 15px;">Your order <strong>${invoiceId}</strong> has been updated:</p>
      <div style="text-align: center; margin: 24px 0;">
        <span style="display: inline-block; background: ${color}; color: #fff; font-size: 16px; font-weight: 700; padding: 10px 28px; border-radius: 999px;">
          ${newStatus}
        </span>
      </div>
      ${message ? `<p style="color: #555; font-size: 14px; text-align: center; font-style: italic;">"${message}"</p>` : ""}
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="color: #aaa; font-size: 11px; text-align: center;">Thank you for shopping with PlayPen House!</p>
    </div>
  `;
}
var init_email = __esm({
  "api/utils/email.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    __name(sendEmail, "sendEmail");
    __name(otpEmailHtml, "otpEmailHtml");
    __name(passwordResetEmailHtml, "passwordResetEmailHtml");
    __name(orderConfirmationEmailHtml, "orderConfirmationEmailHtml");
    __name(adminNewOrderEmailHtml, "adminNewOrderEmailHtml");
    __name(orderStatusUpdateEmailHtml, "orderStatusUpdateEmailHtml");
  }
});

// api/routers/auth.ts
async function generateToken(user, secret) {
  const payload = {
    sub: user.id,
    username: user.username,
    email: user.email || void 0,
    role: user.role || "user",
    iat: Math.floor(Date.now() / 1e3),
    exp: Math.floor(Date.now() / 1e3) + 7 * 24 * 60 * 60
    // 7 days
  };
  return await sign2(payload, secret);
}
var authRouter;
var init_auth = __esm({
  "api/routers/auth.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_dist();
    init_drizzle_orm();
    init_jwt4();
    init_schema();
    init_helpers();
    init_rateLimiter();
    init_email();
    authRouter = new Hono2();
    authRouter.use("*", async (c, next) => {
      const ip = c.req.header("cf-connecting-ip") || c.req.header("x-forwarded-for") || "unknown";
      const path = c.req.path;
      const key = `auth:${ip}:${path}`;
      const { limited, remaining, resetAt } = checkRateLimit(key, 10, 6e4);
      c.header("X-RateLimit-Remaining", String(remaining));
      c.header("X-RateLimit-Reset", String(Math.ceil(resetAt / 1e3)));
      if (limited) {
        return c.json({
          error: "TooManyRequests",
          message: "Too many attempts. Please wait a moment and try again."
        }, 429);
      }
      await next();
    });
    __name(generateToken, "generateToken");
    authRouter.post("/register", async (c) => {
      const db = c.get("db");
      const body = await c.req.json().catch(() => null);
      if (!body?.username || !body?.password) {
        throw new Error("VAL: Username and password are required.");
      }
      const [existing] = await db.select().from(users).where(eq(users.username, body.username));
      if (existing) {
        throw new Error("VAL: A user with this username already exists.");
      }
      if (body.email) {
        const [emailExists] = await db.select().from(users).where(eq(users.email, body.email));
        if (emailExists) {
          throw new Error("VAL: A user with this email already exists.");
        }
      }
      const encoder = new TextEncoder();
      const data = encoder.encode(body.password + "playpen-salt-2026");
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const passwordHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      const tempId = crypto.randomUUID();
      const registrationData = {
        username: body.username,
        email: body.email || null,
        phone: body.phone || null,
        passwordHash,
        fullName: body.fullName || body.username,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      if (body.email) {
        const code = String(Math.floor(1e5 + Math.random() * 9e5));
        const expiresAt = new Date(Date.now() + 10 * 60 * 1e3);
        await db.insert(otpCodes).values({
          id: crypto.randomUUID(),
          userId: tempId,
          // Use tempId to track this pending registration
          code,
          type: "email_verify",
          metadata: JSON.stringify(registrationData),
          expiresAt,
          createdAt: /* @__PURE__ */ new Date()
        });
        const verifyEmailPromise = sendEmail(c.env.GOOGLE_SCRIPT_URL, c.env.EMAIL_WEBHOOK_SECRET, {
          to: body.email,
          subject: "PlayPen House \u2014 Verify Your Email",
          text: `Your verification code is: ${code}. It expires in 10 minutes.`,
          html: otpEmailHtml(code, body.username)
        }).catch((err) => console.error("[EMAIL] Registration verify email failed:", err));
        if (c.executionCtx) c.executionCtx.waitUntil(verifyEmailPromise);
        return c.json({
          id: tempId,
          username: body.username,
          message: "Check your email for the verification code. Your account will be created once verified.",
          _links: formatLinks(c, "/users", tempId)
        }, 201);
      } else {
        throw new Error("VAL: Email is required for registration verification.");
      }
    });
    authRouter.post("/login", async (c) => {
      const db = c.get("db");
      const body = await c.req.json().catch(() => null);
      if (!body?.username || !body?.password) {
        throw new Error("VAL: Username/email and password are required.");
      }
      let user;
      const [byUsername] = await db.select().from(users).where(eq(users.username, body.username));
      if (byUsername) {
        user = byUsername;
      } else if (body.username.includes("@")) {
        const [byEmail] = await db.select().from(users).where(eq(users.email, body.username));
        user = byEmail;
      }
      if (!user) {
        return c.json({ error: "Unauthorized", message: "Invalid credentials" }, 401);
      }
      const encoder = new TextEncoder();
      const data = encoder.encode(body.password + "playpen-salt-2026");
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const passwordHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      if (passwordHash !== user.passwordHash) {
        return c.json({ error: "Unauthorized", message: "Invalid credentials" }, 401);
      }
      const token = await generateToken(
        { id: user.id, username: user.username, email: user.email },
        c.env.JWT_SECRET || "fallback-dev-secret-change-me"
      );
      return c.json({
        token,
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        avatar: user.avatar,
        isVerified: user.isVerified,
        role: "user",
        message: "Login successful"
      });
    });
    authRouter.post("/verify-otp", async (c) => {
      const db = c.get("db");
      const body = await c.req.json().catch(() => null);
      if (!body?.userId || !body?.code) {
        throw new Error("VAL: userId and code are required.");
      }
      const otpRecords = await db.select().from(otpCodes).where(eq(otpCodes.userId, body.userId));
      const validOtp = otpRecords.find(
        (otp) => otp.code === body.code && !otp.used && otp.type === "email_verify" && new Date(otp.expiresAt).getTime() > Date.now()
      );
      if (!validOtp) {
        return c.json({ error: "ValidationError", message: "Invalid or expired OTP code." }, 422);
      }
      if (validOtp.type === "email_verify" && validOtp.metadata) {
        try {
          const data = JSON.parse(validOtp.metadata);
          const [existingUser] = await db.select().from(users).where(eq(users.username, data.username));
          const [existingEmail] = data.email ? await db.select().from(users).where(eq(users.email, data.email)) : [null];
          if (existingUser || existingEmail) {
            return c.json({
              error: "Conflict",
              message: "This username or email has already been taken. Please register again with different details."
            }, 409);
          }
          await db.insert(users).values({
            id: body.userId,
            // Use the tempId from registration
            username: data.username,
            email: data.email,
            phone: data.phone,
            passwordHash: data.passwordHash,
            fullName: data.fullName,
            isVerified: 1,
            createdAt: new Date(data.createdAt || Date.now())
          });
        } catch (err) {
          console.error("Failed to create user from metadata:", err);
          throw new Error("InternalServerError: Failed to finalize registration.");
        }
      } else {
        await db.update(users).set({ isVerified: 1 }).where(eq(users.id, body.userId));
      }
      await db.update(otpCodes).set({ used: 1 }).where(eq(otpCodes.id, validOtp.id));
      return c.json({ message: "Email verified successfully. Your account is now active." });
    });
    authRouter.post("/resend-otp", async (c) => {
      const db = c.get("db");
      const body = await c.req.json().catch(() => null);
      if (!body?.userId) {
        throw new Error("VAL: userId is required.");
      }
      const [user] = await db.select().from(users).where(eq(users.id, body.userId));
      let email = user?.email;
      let username = user?.username || "User";
      if (!user) {
        const [pendingOtp] = await db.select().from(otpCodes).where(eq(otpCodes.userId, body.userId)).limit(1);
        if (pendingOtp?.metadata) {
          const data = JSON.parse(pendingOtp.metadata);
          email = data.email;
          username = data.username;
        } else {
          throw new Error("User not found");
        }
      }
      const code = String(Math.floor(1e5 + Math.random() * 9e5));
      const expiresAt = new Date(Date.now() + 10 * 60 * 1e3);
      const [lastOtp] = await db.select().from(otpCodes).where(eq(otpCodes.userId, body.userId)).orderBy(desc(otpCodes.createdAt)).limit(1);
      await db.insert(otpCodes).values({
        id: crypto.randomUUID(),
        userId: body.userId,
        code,
        type: "email_verify",
        metadata: lastOtp?.metadata || null,
        expiresAt,
        createdAt: /* @__PURE__ */ new Date()
      });
      if (email) {
        const resendOtpPromise = sendEmail(c.env.GOOGLE_SCRIPT_URL, c.env.EMAIL_WEBHOOK_SECRET, {
          to: email,
          subject: "PlayPen House \u2014 Your Verification Code",
          text: `Your verification code is: ${code}. It expires in 10 minutes.`,
          html: otpEmailHtml(code, username)
        }).catch((err) => console.error("[EMAIL] Resend OTP email failed:", err));
        if (c.executionCtx) c.executionCtx.waitUntil(resendOtpPromise);
      }
      return c.json({ message: "OTP sent successfully." });
    });
    authRouter.post("/forgot-password", async (c) => {
      const db = c.get("db");
      const body = await c.req.json().catch(() => null);
      if (!body?.email) {
        throw new Error("VAL: Email is required.");
      }
      const [user] = await db.select().from(users).where(eq(users.email, body.email));
      if (!user) {
        return c.json({ message: "If an account with that email exists, a reset code has been sent." });
      }
      const code = String(Math.floor(1e5 + Math.random() * 9e5));
      const expiresAt = new Date(Date.now() + 10 * 60 * 1e3);
      await db.insert(otpCodes).values({
        id: crypto.randomUUID(),
        userId: user.id,
        code,
        type: "password_reset",
        expiresAt,
        createdAt: /* @__PURE__ */ new Date()
      });
      const forgotPasswordPromise = sendEmail(c.env.GOOGLE_SCRIPT_URL, c.env.EMAIL_WEBHOOK_SECRET, {
        to: user.email,
        subject: "PlayPen House \u2014 Password Reset Code",
        text: `Your password reset code is: ${code}. It expires in 10 minutes.`,
        html: passwordResetEmailHtml(code, user.email)
      }).catch((err) => console.error("[EMAIL] Forgot password email failed:", err));
      if (c.executionCtx) c.executionCtx.waitUntil(forgotPasswordPromise);
      return c.json({ message: "If an account with that email exists, a reset code has been sent." });
    });
    authRouter.post("/reset-password", async (c) => {
      const db = c.get("db");
      const body = await c.req.json().catch(() => null);
      if (!body?.email || !body?.code || !body?.newPassword) {
        throw new Error("VAL: email, code and newPassword are required.");
      }
      const [user] = await db.select().from(users).where(eq(users.email, body.email));
      if (!user) {
        return c.json({ error: "ValidationError", message: "Invalid email or code." }, 422);
      }
      const otpRecords = await db.select().from(otpCodes).where(eq(otpCodes.userId, user.id));
      const validOtp = otpRecords.find(
        (otp) => otp.code === body.code && !otp.used && otp.type === "password_reset" && new Date(otp.expiresAt).getTime() > Date.now()
      );
      if (!validOtp) {
        return c.json({ error: "ValidationError", message: "Invalid or expired reset code." }, 422);
      }
      const encoder = new TextEncoder();
      const data = encoder.encode(body.newPassword + "playpen-salt-2026");
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const passwordHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      await db.update(users).set({ passwordHash }).where(eq(users.id, user.id));
      await db.update(otpCodes).set({ used: 1 }).where(eq(otpCodes.id, validOtp.id));
      return c.json({ message: "Password reset successful." });
    });
  }
});

// api/routers/users.ts
var usersRouter;
var init_users2 = __esm({
  "api/routers/users.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_dist();
    init_drizzle_orm();
    init_schema();
    init_helpers();
    usersRouter = new Hono2();
    usersRouter.get("/", async (c) => {
      const db = c.get("db");
      const search = c.req.query("search");
      const page = parseInt(c.req.query("page") || "1");
      const limit = parseInt(c.req.query("limit") || "20");
      const offset = (page - 1) * limit;
      let countResult;
      if (search) {
        countResult = await db.select({ count: sql`count(*)` }).from(users).where(like(users.username, `%${search}%`));
      } else {
        countResult = await db.select({ count: sql`count(*)` }).from(users);
      }
      const total = countResult[0]?.count || 0;
      let query = db.select({
        id: users.id,
        username: users.username,
        email: users.email,
        phone: users.phone,
        fullName: users.fullName,
        avatar: users.avatar,
        role: users.role,
        isVerified: users.isVerified,
        isBlocked: users.isBlocked,
        createdAt: users.createdAt
      }).from(users);
      if (search) {
        query = query.where(like(users.username, `%${search}%`));
      }
      const rows = await query.orderBy(desc(users.createdAt)).limit(limit).offset(offset);
      return c.json(createPaginatedResponse(
        rows.map((r) => ({ ...r, _links: formatLinks(c, "/users", r.id) })),
        total,
        page,
        limit,
        formatLinks(c, "/users")
      ));
    });
    usersRouter.get("/:id", async (c) => {
      const id = c.req.param("id");
      const db = c.get("db");
      const [user] = await db.select({
        id: users.id,
        username: users.username,
        email: users.email,
        phone: users.phone,
        fullName: users.fullName,
        avatar: users.avatar,
        role: users.role,
        isVerified: users.isVerified,
        isBlocked: users.isBlocked,
        createdAt: users.createdAt
      }).from(users).where(eq(users.id, id));
      if (!user) throw new Error(`User with ID ${id} not found`);
      return c.json({ ...user, _links: formatLinks(c, "/users", id) });
    });
    usersRouter.patch("/:id", async (c) => {
      const id = c.req.param("id");
      const db = c.get("db");
      const body = await c.req.json();
      const [existing] = await db.select().from(users).where(eq(users.id, id));
      if (!existing) throw new Error(`User with ID ${id} not found`);
      const updates = {};
      if (body.fullName !== void 0) updates.fullName = body.fullName;
      if (body.phone !== void 0) updates.phone = body.phone;
      if (body.avatar !== void 0) updates.avatar = body.avatar;
      if (body.isVerified !== void 0) updates.isVerified = body.isVerified;
      if (body.isBlocked !== void 0) updates.isBlocked = body.isBlocked;
      if (body.role !== void 0) updates.role = body.role;
      if (Object.keys(updates).length > 0) {
        await db.update(users).set(updates).where(eq(users.id, id));
      }
      return c.json({
        message: "User updated successfully",
        _links: formatLinks(c, "/users", id)
      });
    });
    usersRouter.patch("/:id/password", async (c) => {
      const id = c.req.param("id");
      const db = c.get("db");
      const body = await c.req.json();
      if (!body?.currentPassword || !body?.newPassword) {
        throw new Error("VAL: Current password and new password are required.");
      }
      const [user] = await db.select().from(users).where(eq(users.id, id));
      if (!user) throw new Error(`User with ID ${id} not found`);
      const encoder = new TextEncoder();
      const currentData = encoder.encode(body.currentPassword + "playpen-salt-2026");
      const currentHash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", currentData))).map((b) => b.toString(16).padStart(2, "0")).join("");
      if (currentHash !== user.passwordHash) {
        return c.json({ error: "Unauthorized", message: "Current password is incorrect" }, 401);
      }
      const newData = encoder.encode(body.newPassword + "playpen-salt-2026");
      const newHash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", newData))).map((b) => b.toString(16).padStart(2, "0")).join("");
      await db.update(users).set({ passwordHash: newHash }).where(eq(users.id, id));
      return c.json({ message: "Password updated successfully" });
    });
    usersRouter.patch("/:id/block", async (c) => {
      const id = c.req.param("id");
      const db = c.get("db");
      const [user] = await db.select().from(users).where(eq(users.id, id));
      if (!user) throw new Error(`User with ID ${id} not found`);
      const newStatus = user.isBlocked ? 0 : 1;
      await db.update(users).set({ isBlocked: newStatus }).where(eq(users.id, id));
      return c.json({
        message: newStatus ? "User blocked successfully" : "User unblocked successfully",
        isBlocked: newStatus
      });
    });
    usersRouter.patch("/:id/verify", async (c) => {
      const id = c.req.param("id");
      const db = c.get("db");
      const [user] = await db.select().from(users).where(eq(users.id, id));
      if (!user) throw new Error(`User with ID ${id} not found`);
      const newStatus = user.isVerified ? 0 : 1;
      await db.update(users).set({ isVerified: newStatus }).where(eq(users.id, id));
      return c.json({
        message: newStatus ? "User verified successfully" : "User unverified",
        isVerified: newStatus
      });
    });
  }
});

// api/routers/products.ts
var productsRouter;
var init_products2 = __esm({
  "api/routers/products.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_dist();
    init_drizzle_orm();
    init_schema();
    init_helpers();
    productsRouter = new Hono2();
    productsRouter.get("/", async (c) => {
      try {
        const db = c.get("db");
        const page = Math.max(1, Number(c.req.query("page") || 1));
        const limit = Math.min(100, Math.max(1, Number(c.req.query("limit") || 12)));
        const offset = (page - 1) * limit;
        const { category, tag, sort, q, hasOffer } = c.req.query();
        let conditions = [];
        if (category) {
          conditions.push(eq(products.categoryId, category));
        }
        if (q) {
          conditions.push(
            or(
              like(products.title, `%${q}%`),
              like(products.brand, `%${q}%`)
            )
          );
        }
        if (tag) {
          conditions.push(like(products.tags, `%"${tag}"%`));
        }
        if (hasOffer === "true") {
          conditions.push(isNotNull(products.salePrice));
        }
        const whereClause = conditions.length > 0 ? and(...conditions) : void 0;
        const [totalRes] = await db.select({ count: count() }).from(products).where(whereClause);
        const total = totalRes.count;
        const rows = await db.query.products.findMany({
          where: whereClause,
          limit,
          offset,
          orderBy: /* @__PURE__ */ __name((p, { desc: desc7, asc: asc2 }) => {
            if (sort === "newest") return [desc7(p.createdAt)];
            if (sort === "price-low") return [asc2(p.price)];
            if (sort === "price-high") return [desc7(p.price)];
            if (sort === "best-selling") return [desc7(p.soldCount)];
            if (sort === "trending") return [desc7(p.rating)];
            return [desc7(p.createdAt)];
          }, "orderBy")
        });
        return c.json(createPaginatedResponse(
          rows.map((r) => ({ ...r, _links: formatLinks(c, "/products", r.id) })),
          total,
          page,
          limit,
          formatLinks(c, "/products")
        ));
      } catch (error) {
        console.error("Fetch products error:", error.message);
        return c.json(createPaginatedResponse([], 0, 1, 12, formatLinks(c, "/products")));
      }
    });
    productsRouter.get("/search", async (c) => {
      try {
        const q = c.req.query("q") ?? "";
        const db = c.get("db");
        const rows = await db.query.products.findMany({
          where: /* @__PURE__ */ __name((p, { like: like2, or: or3 }) => or3(
            like2(p.title, `%${q}%`),
            like2(p.brand, `%${q}%`)
          ), "where"),
          limit: 10
        });
        return c.json({
          items: rows.map((r) => ({ ...r, _links: formatLinks(c, "/products", r.id) })),
          query: q,
          _links: formatLinks(c, "/products/search")
        });
      } catch (error) {
        console.error("Search products error:", error.message);
        return c.json({ items: [], query: c.req.query("q") ?? "", _links: formatLinks(c, "/products/search") });
      }
    });
    productsRouter.get("/by-slug/:slug/bulk", async (c) => {
      try {
        const slug = c.req.param("slug");
        const recentlyViewedIds = (c.req.query("recentlyViewed") || "").split(",").filter(Boolean);
        const db = c.get("db");
        const [product] = await db.select().from(products).where(eq(products.slug, slug));
        if (!product) return c.json({ error: "Product not found" }, 404);
        const cacheKey = `product_bulk_${product.id}`;
        const [cached] = await db.select().from(systemCache).where(eq(systemCache.key, cacheKey));
        let candidates, reviews2, reviewStatsRaw;
        const now = /* @__PURE__ */ new Date();
        const cacheTTL = 10 * 60 * 1e3;
        if (cached && now.getTime() - new Date(cached.updatedAt).getTime() < cacheTTL) {
          const cachedData = JSON.parse(cached.data);
          candidates = cachedData.candidates;
          reviews2 = cachedData.reviews;
          reviewStatsRaw = cachedData.reviewStatsRaw;
        } else {
          const queryTags = JSON.parse(product.tags || "[]").slice(0, 5);
          const [fCandidates, fReviews, fReviewStatsRaw] = await Promise.all([
            // Candidates for related products
            db.query.products.findMany({
              where: and(
                eq(products.isActive, 1),
                not(eq(products.id, product.id)),
                or(
                  ...product.categoryId ? [eq(products.categoryId, product.categoryId)] : [],
                  ...queryTags.map((tag) => like(products.tags, `%"${tag}"%`))
                )
              ),
              limit: 12
            }),
            // Latest 10 reviews
            db.select().from(reviews).where(and(eq(reviews.productId, product.id), eq(reviews.status, "approved"))).orderBy(desc(reviews.createdAt)).limit(10),
            // Review statistics (counts per star and average)
            db.select({
              rating: reviews.rating,
              count: count()
            }).from(reviews).where(and(eq(reviews.productId, product.id), eq(reviews.status, "approved"))).groupBy(reviews.rating)
          ]);
          candidates = fCandidates;
          reviews2 = fReviews;
          reviewStatsRaw = fReviewStatsRaw;
          await db.insert(systemCache).values({
            key: cacheKey,
            data: JSON.stringify({ candidates, reviews: reviews2, reviewStatsRaw }),
            updatedAt: /* @__PURE__ */ new Date()
          }).onConflictDoUpdate({
            target: systemCache.key,
            set: { data: JSON.stringify({ candidates, reviews: reviews2, reviewStatsRaw }), updatedAt: /* @__PURE__ */ new Date() }
          });
        }
        const currentUserId = c.req.query("userId");
        const [userOrder] = await Promise.all([
          // Check if user has purchased this (for review eligibility)
          currentUserId ? db.select({ id: orders.id }).from(orders).innerJoin(orderItems, eq(orders.id, orderItems.orderId)).where(and(
            eq(orders.userId, currentUserId),
            eq(orders.status, "delivered"),
            eq(orderItems.productId, product.id)
          )).limit(1) : Promise.resolve([])
        ]);
        const productTags = JSON.parse(product.tags || "[]");
        const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let totalReviews = 0;
        let sumRating = 0;
        reviewStatsRaw.forEach((row) => {
          const r = Number(row.rating);
          const c2 = Number(row.count);
          if (r >= 1 && r <= 5) {
            starCounts[r] = c2;
            totalReviews += c2;
            sumRating += r * c2;
          }
        });
        const stats = {
          averageRating: totalReviews > 0 ? Math.round(sumRating / totalReviews * 10) / 10 : 0,
          totalReviews,
          distribution: [1, 2, 3, 4, 5].map((star) => ({
            stars: star,
            count: starCounts[star],
            percentage: totalReviews > 0 ? Math.round(starCounts[star] / totalReviews * 100) : 0
          }))
        };
        const scoredRelated = candidates.map((p) => {
          let score = 0;
          if (p.categoryId === product.categoryId) score += 10;
          const pTags = JSON.parse(p.tags || "[]");
          const tagMatches = pTags.filter((t) => productTags.includes(t)).length;
          score += tagMatches * 5;
          if (recentlyViewedIds.includes(p.id)) score -= 5;
          score += (p.soldCount || 0) * 0.1;
          score += (p.rating || 0) * 2;
          const priceDiff = Math.abs(p.price - product.price) / product.price;
          if (priceDiff < 0.2) score += 5;
          return { ...p, score };
        }).sort((a, b) => b.score - a.score).slice(0, 4);
        let canReview = false;
        let reviewRestrictionReason = "Login to write a review";
        if (currentUserId) {
          if (userOrder && userOrder.length > 0) {
            const [existingReview] = await db.select().from(reviews).where(and(eq(reviews.userId, currentUserId), eq(reviews.productId, product.id))).limit(1);
            if (existingReview) {
              canReview = false;
              reviewRestrictionReason = "You have already reviewed this product";
            } else {
              canReview = true;
              reviewRestrictionReason = "";
            }
          } else {
            canReview = false;
            reviewRestrictionReason = "Only verified purchasers can leave a review";
          }
        }
        return c.json({
          product: { ...product, _links: formatLinks(c, "/products", product.id) },
          relatedProducts: scoredRelated.map((r) => ({ ...r, _links: formatLinks(c, "/products", r.id) })),
          reviews: { items: reviews2, stats },
          canReview,
          reviewRestrictionReason
        });
      } catch (error) {
        console.error("Bulk fetch error:", error.message);
        return c.json({ error: "Failed to fetch bulk data" }, 500);
      }
    });
    productsRouter.get("/by-slug/:slug", async (c) => {
      const slug = c.req.param("slug");
      const db = c.get("db");
      const [product] = await db.select().from(products).where(eq(products.slug, slug));
      if (!product) {
        return c.json({ error: "Product not found" }, 404);
      }
      return c.json({
        ...product,
        _links: formatLinks(c, "/products", product.id)
      });
    });
    productsRouter.get("/:id", async (c) => {
      const id = c.req.param("id");
      const db = c.get("db");
      const [product] = await db.select().from(products).where(eq(products.id, id));
      if (!product) throw new Error(`Product with ID ${id} not found`);
      return c.json({
        ...product,
        _links: formatLinks(c, "/products", id)
      });
    });
    productsRouter.post("/", async (c) => {
      const db = c.get("db");
      const body = await c.req.json().catch(() => null);
      if (!body?.title || !body?.price) {
        throw new Error("VAL: Title and price are required fields.");
      }
      const id = crypto.randomUUID();
      const slug = body.title.toLowerCase().replace(/ /g, "-") + "-" + id.slice(0, 5);
      await db.insert(products).values({
        id,
        title: body.title,
        slug: body.slug || slug,
        categoryId: body.categoryId || null,
        brand: body.brand || "Generic",
        price: Number(body.price),
        salePrice: body.salePrice ? Number(body.salePrice) : null,
        stock: Number(body.stock) || 0,
        images: body.images ? typeof body.images === "string" ? body.images : JSON.stringify(body.images) : "[]",
        tags: body.tags ? typeof body.tags === "string" ? body.tags : JSON.stringify(body.tags) : "[]",
        overview: body.overview || null,
        specification: body.specification || null,
        highlights: body.highlights ? typeof body.highlights === "string" ? body.highlights : JSON.stringify(body.highlights) : null,
        howItWorks: body.howItWorks ? typeof body.howItWorks === "string" ? body.howItWorks : JSON.stringify(body.howItWorks) : null,
        benefits: body.benefits ? typeof body.benefits === "string" ? body.benefits : JSON.stringify(body.benefits) : null,
        videoUrl: body.videoUrl || null,
        faqs: body.faqs ? typeof body.faqs === "string" ? body.faqs : JSON.stringify(body.faqs) : null,
        specSheetUrl: body.specSheetUrl || null,
        comparisonData: body.comparisonData ? typeof body.comparisonData === "string" ? body.comparisonData : JSON.stringify(body.comparisonData) : null,
        bundleProducts: body.bundleProducts ? typeof body.bundleProducts === "string" ? body.bundleProducts : JSON.stringify(body.bundleProducts) : null,
        qna: body.qna ? typeof body.qna === "string" ? body.qna : JSON.stringify(body.qna) : null,
        deliveryInfo: body.deliveryInfo || null,
        warrantyInfo: body.warrantyInfo || null,
        offerDeadline: body.offerDeadline ? new Date(body.offerDeadline) : null,
        trustBadges: body.trustBadges ? typeof body.trustBadges === "string" ? body.trustBadges : JSON.stringify(body.trustBadges) : null,
        rating: 0,
        reviewCount: 0,
        soldCount: body.soldCount || 0,
        lowStockThreshold: body.lowStockThreshold !== void 0 ? Number(body.lowStockThreshold) : 5,
        isActive: 1,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      });
      await invalidateHomeCache(db, schema_exports);
      return c.json({
        id,
        message: "Product created successfully",
        _links: formatLinks(c, "/products", id)
      }, 201);
    });
    productsRouter.patch("/:id", async (c) => {
      const id = c.req.param("id");
      const db = c.get("db");
      const body = await c.req.json();
      const [existing] = await db.select().from(products).where(eq(products.id, id));
      if (!existing) throw new Error(`Product with ID ${id} not found`);
      await db.update(products).set({
        title: body.title ?? existing.title,
        slug: body.slug ?? existing.slug,
        categoryId: body.categoryId ?? existing.categoryId,
        brand: body.brand ?? existing.brand,
        price: body.price !== void 0 ? Number(body.price) : existing.price,
        salePrice: body.salePrice !== void 0 ? body.salePrice ? Number(body.salePrice) : null : existing.salePrice,
        stock: body.stock !== void 0 ? Number(body.stock) : existing.stock,
        images: body.images !== void 0 ? typeof body.images === "string" ? body.images : JSON.stringify(body.images) : existing.images,
        tags: body.tags !== void 0 ? typeof body.tags === "string" ? body.tags : JSON.stringify(body.tags) : existing.tags,
        overview: body.overview !== void 0 ? body.overview : existing.overview,
        specification: body.specification !== void 0 ? body.specification : existing.specification,
        highlights: body.highlights !== void 0 ? typeof body.highlights === "string" ? body.highlights : JSON.stringify(body.highlights) : existing.highlights,
        howItWorks: body.howItWorks !== void 0 ? typeof body.howItWorks === "string" ? body.howItWorks : JSON.stringify(body.howItWorks) : existing.howItWorks,
        benefits: body.benefits !== void 0 ? typeof body.benefits === "string" ? body.benefits : JSON.stringify(body.benefits) : existing.benefits,
        videoUrl: body.videoUrl !== void 0 ? body.videoUrl : existing.videoUrl,
        faqs: body.faqs !== void 0 ? typeof body.faqs === "string" ? body.faqs : JSON.stringify(body.faqs) : existing.faqs,
        specSheetUrl: body.specSheetUrl !== void 0 ? body.specSheetUrl : existing.specSheetUrl,
        comparisonData: body.comparisonData !== void 0 ? typeof body.comparisonData === "string" ? body.comparisonData : JSON.stringify(body.comparisonData) : existing.comparisonData,
        bundleProducts: body.bundleProducts !== void 0 ? typeof body.bundleProducts === "string" ? body.bundleProducts : JSON.stringify(body.bundleProducts) : existing.bundleProducts,
        qna: body.qna !== void 0 ? typeof body.qna === "string" ? body.qna : JSON.stringify(body.qna) : existing.qna,
        deliveryInfo: body.deliveryInfo !== void 0 ? body.deliveryInfo : existing.deliveryInfo,
        warrantyInfo: body.warrantyInfo !== void 0 ? body.warrantyInfo : existing.warrantyInfo,
        offerDeadline: body.offerDeadline !== void 0 ? body.offerDeadline ? new Date(body.offerDeadline) : null : existing.offerDeadline,
        trustBadges: body.trustBadges !== void 0 ? typeof body.trustBadges === "string" ? body.trustBadges : JSON.stringify(body.trustBadges) : existing.trustBadges,
        soldCount: body.soldCount !== void 0 ? Number(body.soldCount) : existing.soldCount,
        lowStockThreshold: body.lowStockThreshold !== void 0 ? Number(body.lowStockThreshold) : existing.lowStockThreshold,
        isActive: body.isActive !== void 0 ? body.isActive ? 1 : 0 : existing.isActive,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(products.id, id));
      await invalidateHomeCache(db, schema_exports);
      return c.json({
        message: "Product updated successfully",
        _links: formatLinks(c, "/products", id)
      });
    });
    productsRouter.delete("/:id", async (c) => {
      const id = c.req.param("id");
      const db = c.get("db");
      await db.delete(products).where(eq(products.id, id));
      await invalidateHomeCache(db, schema_exports);
      return c.body(null, 204);
    });
    productsRouter.post("/interactions", async (c) => {
      const db = c.get("db");
      const body = await c.req.json();
      const { productId, type, userId, sessionId } = body;
      if (!productId || !type) return c.json({ error: "Missing data" }, 400);
      const weight = type === "purchase" ? 10 : type === "add_to_cart" ? 3 : 1;
      await db.insert(userInteractions).values({
        id: crypto.randomUUID(),
        productId,
        interactionType: type,
        userId: userId || null,
        sessionId: sessionId || null,
        weight,
        createdAt: /* @__PURE__ */ new Date()
      });
      return c.json({ success: true });
    });
  }
});

// api/routers/categories.ts
var categoriesRouter;
var init_categories2 = __esm({
  "api/routers/categories.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_dist();
    init_drizzle_orm();
    init_schema();
    init_helpers();
    categoriesRouter = new Hono2();
    categoriesRouter.get("/", async (c) => {
      try {
        const db = c.get("db");
        const featured = c.req.query("featured") === "true";
        const showAll = c.req.query("all") === "true";
        const rows = await db.query.categories.findMany({
          where: /* @__PURE__ */ __name((cat, { eq: eq2, and: and3 }) => {
            if (showAll && !featured) return void 0;
            const filters = [];
            if (!showAll) filters.push(eq2(cat.isActive, 1));
            if (featured) filters.push(eq2(cat.isFeatured, 1));
            return filters.length > 0 ? and3(...filters) : void 0;
          }, "where")
        });
        return c.json({
          items: rows.map((r) => ({
            ...r,
            _links: formatLinks(c, "/categories", r.id)
          })),
          _links: formatLinks(c, "/categories")
        });
      } catch (error) {
        console.error("Fetch categories error:", error.message);
        return c.json({ items: [], _links: formatLinks(c, "/categories") });
      }
    });
    categoriesRouter.post("/", async (c) => {
      const db = c.get("db");
      const body = await c.req.json().catch(() => null);
      if (!body?.name) {
        throw new Error("VAL: Category name is required.");
      }
      const id = crypto.randomUUID();
      const slug = body.name.toLowerCase().replace(/ /g, "-") + "-" + id.slice(0, 5);
      await db.insert(categories).values({
        id,
        name: body.name,
        slug: body.slug || slug,
        parentId: body.parentId || null,
        image: body.image || null,
        isFeatured: body.isFeatured ? 1 : 0,
        isActive: body.isActive !== void 0 ? body.isActive ? 1 : 0 : 1
      });
      await invalidateHomeCache(db, schema_exports);
      return c.json({
        id,
        message: "Category created successfully",
        _links: formatLinks(c, "/categories", id)
      }, 201);
    });
    categoriesRouter.patch("/:id", async (c) => {
      const id = c.req.param("id");
      const db = c.get("db");
      const body = await c.req.json();
      const [existing] = await db.select().from(categories).where(eq(categories.id, id));
      if (!existing) throw new Error(`Category with ID ${id} not found`);
      await db.update(categories).set({
        name: body.name ?? existing.name,
        slug: body.slug ?? existing.slug,
        parentId: body.parentId !== void 0 ? body.parentId : existing.parentId,
        image: body.image ?? existing.image,
        isFeatured: body.isFeatured !== void 0 ? body.isFeatured ? 1 : 0 : existing.isFeatured,
        isActive: body.isActive !== void 0 ? body.isActive ? 1 : 0 : existing.isActive
      }).where(eq(categories.id, id));
      await invalidateHomeCache(db, schema_exports);
      return c.json({
        message: "Category updated successfully",
        _links: formatLinks(c, "/categories", id)
      });
    });
    categoriesRouter.delete("/:id", async (c) => {
      const id = c.req.param("id");
      const db = c.get("db");
      await db.delete(categories).where(eq(categories.id, id));
      await invalidateHomeCache(db, schema_exports);
      return c.body(null, 204);
    });
  }
});

// api/routers/banners.ts
var bannersRouter;
var init_banners2 = __esm({
  "api/routers/banners.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_dist();
    init_drizzle_orm();
    init_schema();
    init_helpers();
    bannersRouter = new Hono2();
    bannersRouter.get("/", async (c) => {
      try {
        const position = c.req.query("position");
        const db = c.get("db");
        const rows = await db.query.banners.findMany({
          where: position ? (b, { eq: eq2 }) => eq2(b.position, position) : void 0,
          orderBy: /* @__PURE__ */ __name((b, { asc: asc2 }) => [asc2(b.order)], "orderBy")
        });
        return c.json({
          items: rows.map((r) => ({
            ...r,
            _links: formatLinks(c, "/banners", r.id)
          })),
          _links: formatLinks(c, "/banners")
        });
      } catch (error) {
        console.error("Fetch banners error:", error.message);
        return c.json({ items: [], _links: formatLinks(c, "/banners") });
      }
    });
    bannersRouter.post("/", async (c) => {
      const db = c.get("db");
      const body = await c.req.json().catch(() => null);
      if (!body?.image || !body?.position) {
        throw new Error("VAL: Image and position are required fields.");
      }
      const id = crypto.randomUUID();
      await db.insert(banners).values({
        id,
        image: body.image,
        link: body.link || null,
        position: body.position,
        order: Number(body.order) || 0,
        isActive: 1
      });
      await invalidateHomeCache(db, schema_exports);
      return c.json({
        id,
        message: "Banner created successfully",
        _links: formatLinks(c, "/banners", id)
      }, 201);
    });
    bannersRouter.patch("/:id", async (c) => {
      const id = c.req.param("id");
      const db = c.get("db");
      const body = await c.req.json();
      const [existing] = await db.select().from(banners).where(eq(banners.id, id));
      if (!existing) throw new Error(`Banner with ID ${id} not found`);
      await db.update(banners).set({
        image: body.image ?? existing.image,
        link: body.link ?? existing.link,
        position: body.position ?? existing.position,
        order: body.order !== void 0 ? Number(body.order) : existing.order,
        isActive: body.isActive !== void 0 ? body.isActive ? 1 : 0 : existing.isActive
      }).where(eq(banners.id, id));
      await invalidateHomeCache(db, schema_exports);
      return c.json({
        message: "Banner updated successfully",
        _links: formatLinks(c, "/banners", id)
      });
    });
    bannersRouter.delete("/:id", async (c) => {
      const id = c.req.param("id");
      const db = c.get("db");
      await db.delete(banners).where(eq(banners.id, id));
      await invalidateHomeCache(db, schema_exports);
      return c.body(null, 204);
    });
  }
});

// api/routers/orders.ts
var ordersRouter;
var init_orders2 = __esm({
  "api/routers/orders.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_dist();
    init_drizzle_orm();
    init_jwt4();
    init_schema();
    init_helpers();
    init_email();
    ordersRouter = new Hono2();
    ordersRouter.get("/", async (c) => {
      try {
        const db = c.get("db");
        const customerName = c.req.query("customerName");
        const userId = c.req.query("userId");
        const rows = await db.query.orders.findMany({
          where: /* @__PURE__ */ __name((o, { eq: eq2, and: and3 }) => {
            const filters = [];
            if (customerName && customerName.trim() !== "") filters.push(eq2(o.customerName, customerName));
            if (userId && userId.trim() !== "") filters.push(eq2(o.userId, userId));
            return filters.length > 0 ? and3(...filters) : void 0;
          }, "where"),
          orderBy: /* @__PURE__ */ __name((o, { desc: desc7 }) => [desc7(o.createdAt)], "orderBy")
        });
        return c.json({
          items: rows.map((r) => ({
            ...r,
            totalAmount: Number(r.totalAmount || 0),
            _links: formatLinks(c, "/orders", r.id)
          })),
          _links: formatLinks(c, "/orders")
        });
      } catch (error) {
        console.error("Fetch orders error:", error);
        return c.json({ items: [], _links: formatLinks(c, "/orders") });
      }
    });
    ordersRouter.get("/:id", async (c) => {
      const id = c.req.param("id");
      const db = c.get("db");
      const [order] = await db.select().from(orders).where(eq(orders.id, id));
      if (!order) throw new Error(`Order with ID ${id} not found`);
      const orderItemsList = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
      const itemsWithProduct = await Promise.all(orderItemsList.map(async (item) => {
        const [product] = await db.select().from(products).where(eq(products.id, item.productId));
        return {
          ...item,
          productName: product ? product.title : "Deleted Product",
          productImage: product ? (() => {
            try {
              const imgs = JSON.parse(product.images || "[]");
              return imgs[0] || null;
            } catch {
              return null;
            }
          })() : null
        };
      }));
      const trackings2 = await db.select().from(trackings).where(eq(trackings.orderId, id));
      return c.json({
        ...order,
        items: itemsWithProduct,
        trackings: trackings2.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        // newest first
        _links: formatLinks(c, "/orders", id)
      });
    });
    ordersRouter.post("/", async (c) => {
      const db = c.get("db");
      const body = await c.req.json().catch(() => null);
      if (!body?.customerName || !body?.shippingAddress || !body?.items || !body.items.length) {
        throw new Error("VAL: Customer name, shipping address, and items are required fields.");
      }
      for (const item of body.items) {
        const [product] = await db.select().from(products).where(eq(products.id, item.productId));
        if (!product) {
          throw new Error(`VAL: Product "${item.productName || item.productId}" not found.`);
        }
        const availableStock = (product.stock ?? 0) - (product.soldCount ?? 0);
        if (availableStock < item.quantity) {
          throw new Error(
            `VAL: Insufficient stock for "${product.title}". Available: ${availableStock}, Requested: ${item.quantity}.`
          );
        }
      }
      for (const item of body.items) {
        const [product] = await db.select().from(products).where(eq(products.id, item.productId));
        await db.update(products).set({
          soldCount: (product.soldCount ?? 0) + item.quantity
        }).where(eq(products.id, item.productId));
      }
      const id = crypto.randomUUID();
      const d = /* @__PURE__ */ new Date();
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      const allOrders = await db.select().from(orders);
      const orderNum = String(allOrders.length + 1).padStart(3, "0");
      const invoiceId = `${dd}${mm}${yyyy}-${orderNum}`;
      const totalAmount = body.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      let userId = body.userId;
      if (!userId) {
        const authHeader = c.req.header("Authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
          const token = authHeader.split(" ")[1];
          try {
            const payload = await verify2(token, c.env.JWT_SECRET || "fallback-dev-secret-change-me", "HS256");
            if (payload && payload.sub) {
              userId = payload.sub;
            }
          } catch (e) {
          }
        }
      }
      await db.insert(orders).values({
        id,
        invoiceId,
        userId: userId || null,
        customerName: body.customerName,
        customerEmail: body.customerEmail || null,
        customerPhone: body.customerPhone || "N/A",
        shippingAddress: body.shippingAddress,
        totalAmount,
        status: body.paymentMethod && body.paymentMethod !== "cod" && body.paymentMethod !== "wallet" ? "Pending Verification" : "Pending",
        paymentMethod: body.paymentMethod || "cod",
        paymentPhone: body.paymentPhone || null,
        paymentTrxId: body.paymentTrxId || null,
        createdAt: /* @__PURE__ */ new Date()
      });
      try {
        await db.insert(notifications).values({
          id: crypto.randomUUID(),
          userId: null,
          // Global/Admin
          title: `New Order: ${invoiceId}`,
          message: `A new order has been placed by ${body.customerName} for $${totalAmount.toFixed(2)}.`,
          type: "new_order",
          orderId: id,
          isRead: 0,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        });
      } catch (err) {
        console.error("Failed to insert admin order notification:", err);
      }
      for (const item of body.items) {
        await db.insert(orderItems).values({
          id: crypto.randomUUID(),
          orderId: id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        });
      }
      await db.insert(trackings).values({
        id: crypto.randomUUID(),
        orderId: id,
        status: "Order Placed",
        message: "Your order has been placed successfully and is awaiting approval.",
        createdAt: /* @__PURE__ */ new Date()
      });
      if (body.customerEmail && c.env.GOOGLE_SCRIPT_URL) {
        const itemSummary = body.items.map((item) => ({
          name: item.productName || item.productId,
          quantity: item.quantity,
          price: item.price
        }));
        const customerEmailPromise = sendEmail(c.env.GOOGLE_SCRIPT_URL, c.env.EMAIL_WEBHOOK_SECRET, {
          to: body.customerEmail,
          subject: `PlayPen House \u2014 Order Confirmed (${invoiceId})`,
          text: `Hi ${body.customerName}, your order ${invoiceId} has been placed! Total: $${totalAmount.toFixed(2)}`,
          html: orderConfirmationEmailHtml(invoiceId, body.customerName, totalAmount, itemSummary)
        }).catch((err) => console.error("[EMAIL] Customer confirmation failed:", err));
        if (c.executionCtx) c.executionCtx.waitUntil(customerEmailPromise);
      }
      const adminEmail = c.env.ADMIN_NOTIFICATION_EMAIL;
      if (adminEmail && c.env.GOOGLE_SCRIPT_URL) {
        const adminEmailPromise = sendEmail(c.env.GOOGLE_SCRIPT_URL, c.env.EMAIL_WEBHOOK_SECRET, {
          to: adminEmail,
          subject: `\u{1F514} New Order Awaiting Approval \u2014 ${invoiceId}`,
          text: `New order from ${body.customerName}. Invoice: ${invoiceId}. Total: $${totalAmount.toFixed(2)}. ${body.items.length} item(s). Please log in to approve.`,
          html: adminNewOrderEmailHtml(invoiceId, body.customerName, totalAmount, body.items.length)
        }).catch((err) => console.error("[EMAIL] Admin notification failed:", err));
        if (c.executionCtx) c.executionCtx.waitUntil(adminEmailPromise);
      }
      return c.json({
        id,
        invoiceId,
        message: "Order placed successfully",
        _links: formatLinks(c, "/orders", id)
      }, 201);
    });
    ordersRouter.patch("/:id/status", async (c) => {
      const id = c.req.param("id");
      const db = c.get("db");
      const body = await c.req.json();
      const authHeader = c.req.header("Authorization");
      const apiKey = c.env.ADMIN_API_KEY;
      let isAdmin = apiKey && authHeader === `Bearer ${apiKey}`;
      if (!isAdmin && authHeader?.startsWith("Bearer ")) {
        try {
          const token = authHeader.split(" ")[1];
          const payload = await verify2(token, c.env.JWT_SECRET || "fallback-dev-secret-change-me", "HS256");
          if (payload.role === "admin") isAdmin = true;
        } catch {
        }
      }
      if (!isAdmin) {
        return c.json({ error: "Unauthorized", message: "Only admins can update order status directly." }, 401);
      }
      const [existing] = await db.select().from(orders).where(eq(orders.id, id));
      if (!existing) throw new Error(`Order with ID ${id} not found`);
      const newStatus = body.status ?? existing.status;
      await db.update(orders).set({
        status: newStatus
      }).where(eq(orders.id, id));
      if (newStatus !== existing.status) {
        await db.insert(trackings).values({
          id: crypto.randomUUID(),
          orderId: id,
          status: newStatus,
          message: body.message || `Order status updated to ${newStatus}.`,
          location: body.location || null,
          createdAt: /* @__PURE__ */ new Date()
        });
      }
      try {
        let notifyUserId = null;
        if (existing.customerEmail) {
          const [usr] = await db.select().from(users).where(eq(users.email, existing.customerEmail));
          if (usr) notifyUserId = usr.id;
        }
        await db.insert(notifications).values({
          id: crypto.randomUUID(),
          userId: notifyUserId,
          title: `Order Status Updated \u2014 ${existing.invoiceId}`,
          message: `Your order ${existing.invoiceId} status is now: ${newStatus}.`,
          type: "order_status",
          orderId: id,
          isRead: 0,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        });
      } catch (err) {
        console.error("Failed to insert notification:", err);
      }
      if (existing.customerEmail && c.env.GOOGLE_SCRIPT_URL && newStatus !== existing.status) {
        const statusUpdatePromise = sendEmail(c.env.GOOGLE_SCRIPT_URL, c.env.EMAIL_WEBHOOK_SECRET, {
          to: existing.customerEmail,
          subject: `PlayPen House \u2014 Order ${existing.invoiceId} is now "${newStatus}"`,
          text: `Hi ${existing.customerName}, your order ${existing.invoiceId} status has been updated to: ${newStatus}.`,
          html: orderStatusUpdateEmailHtml(
            existing.invoiceId,
            existing.customerName,
            newStatus,
            body.message
          )
        }).catch((err) => console.error("[EMAIL] Status update email failed:", err));
        if (c.executionCtx) c.executionCtx.waitUntil(statusUpdatePromise);
      }
      return c.json({
        message: "Order status updated successfully",
        _links: formatLinks(c, "/orders", id)
      });
    });
    ordersRouter.patch("/:id", async (c) => {
      const id = c.req.param("id");
      const db = c.get("db");
      const body = await c.req.json();
      const authHeader = c.req.header("Authorization");
      const apiKey = c.env.ADMIN_API_KEY;
      let isAdmin = apiKey && authHeader === `Bearer ${apiKey}`;
      if (!isAdmin && authHeader?.startsWith("Bearer ")) {
        try {
          const token = authHeader.split(" ")[1];
          const payload = await verify2(token, c.env.JWT_SECRET || "fallback-dev-secret-change-me", "HS256");
          if (payload.role === "admin") isAdmin = true;
        } catch {
        }
      }
      if (!isAdmin) {
        return c.json({ error: "Unauthorized", message: "Only admins can update order details." }, 401);
      }
      const [existing] = await db.select().from(orders).where(eq(orders.id, id));
      if (!existing) throw new Error(`Order with ID ${id} not found`);
      await db.update(orders).set({
        customerPhone: body.customerPhone ?? existing.customerPhone,
        shippingAddress: body.shippingAddress ?? existing.shippingAddress,
        internalNote: body.internalNote ?? existing.internalNote,
        courierId: body.courierId ?? existing.courierId,
        courierLink: body.courierLink ?? existing.courierLink,
        status: body.status ?? existing.status
      }).where(eq(orders.id, id));
      return c.json({
        message: "Order updated successfully",
        _links: formatLinks(c, "/orders", id)
      });
    });
    ordersRouter.post("/:id/trackings", async (c) => {
      const id = c.req.param("id");
      const db = c.get("db");
      const body = await c.req.json();
      const authHeader = c.req.header("Authorization");
      const apiKey = c.env.ADMIN_API_KEY;
      let isAdmin = apiKey && authHeader === `Bearer ${apiKey}`;
      if (!isAdmin && authHeader?.startsWith("Bearer ")) {
        try {
          const token = authHeader.split(" ")[1];
          const payload = await verify2(token, c.env.JWT_SECRET || "fallback-dev-secret-change-me", "HS256");
          if (payload.role === "admin") isAdmin = true;
        } catch {
        }
      }
      if (!isAdmin) {
        return c.json({ error: "Unauthorized", message: "Only admins can add tracking updates." }, 401);
      }
      const [existing] = await db.select().from(orders).where(eq(orders.id, id));
      if (!existing) throw new Error(`Order with ID ${id} not found`);
      if (!body?.status) {
        throw new Error("VAL: Tracking status is required.");
      }
      const trackingId = crypto.randomUUID();
      await db.insert(trackings).values({
        id: trackingId,
        orderId: id,
        status: body.status,
        message: body.message || null,
        location: body.location || null,
        createdAt: /* @__PURE__ */ new Date()
      });
      await db.update(orders).set({ status: body.status }).where(eq(orders.id, id));
      try {
        let notifyUserId = null;
        if (existing.customerEmail) {
          const [usr] = await db.select().from(users).where(eq(users.email, existing.customerEmail));
          if (usr) notifyUserId = usr.id;
        }
        await db.insert(notifications).values({
          id: crypto.randomUUID(),
          userId: notifyUserId,
          title: `Order Tracking Updated \u2014 ${existing.invoiceId}`,
          message: `Your order ${existing.invoiceId} tracking status is now: ${body.status}. ${body.message || ""}`,
          type: "order_status",
          orderId: id,
          isRead: 0,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        });
      } catch (err) {
        console.error("Failed to insert notification:", err);
      }
      if (existing.customerEmail && c.env.GOOGLE_SCRIPT_URL) {
        const trackingUpdatePromise = sendEmail(c.env.GOOGLE_SCRIPT_URL, c.env.EMAIL_WEBHOOK_SECRET, {
          to: existing.customerEmail,
          subject: `PlayPen House \u2014 Tracking Update for ${existing.invoiceId}`,
          text: `Hi ${existing.customerName}, your order ${existing.invoiceId} status: ${body.status}. ${body.message || ""}`,
          html: orderStatusUpdateEmailHtml(
            existing.invoiceId,
            existing.customerName,
            body.status,
            body.message
          )
        }).catch((err) => console.error("[EMAIL] Tracking update email failed:", err));
        if (c.executionCtx) c.executionCtx.waitUntil(trackingUpdatePromise);
      }
      return c.json({
        id: trackingId,
        message: "Tracking added successfully",
        _links: formatLinks(c, "/orders", id)
      }, 201);
    });
    ordersRouter.post("/:id/cancel", async (c) => {
      const id = c.req.param("id");
      const db = c.get("db");
      const body = await c.req.json().catch(() => ({}));
      const [order] = await db.select().from(orders).where(eq(orders.id, id));
      if (!order) throw new Error(`Order with ID ${id} not found`);
      const status = order.status?.toLowerCase();
      const authHeader = c.req.header("Authorization");
      const apiKey = c.env.ADMIN_API_KEY;
      let isAdmin = apiKey && authHeader === `Bearer ${apiKey}`;
      if (!isAdmin && authHeader?.startsWith("Bearer ")) {
        try {
          const token = authHeader.split(" ")[1];
          const payload = await verify2(token, c.env.JWT_SECRET || "fallback-dev-secret-change-me", "HS256");
          if (payload.role === "admin") isAdmin = true;
        } catch {
        }
      }
      if (!isAdmin && status !== "pending") {
        return c.json({
          error: "ValidationError",
          message: `Cannot cancel an order with status "${order.status}". Only Pending orders can be cancelled by the user.`
        }, 422);
      }
      await db.update(orders).set({ status: "Cancelled" }).where(eq(orders.id, id));
      await db.insert(trackings).values({
        id: crypto.randomUUID(),
        orderId: id,
        status: "Cancelled",
        message: body.reason ? `Order cancelled by customer. Reason: ${body.reason}` : "Order cancelled by customer.",
        createdAt: /* @__PURE__ */ new Date()
      });
      const orderItemsList = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
      for (const item of orderItemsList) {
        const [product] = await db.select().from(products).where(eq(products.id, item.productId));
        if (product) {
          await db.update(products).set({
            soldCount: Math.max(0, (product.soldCount ?? 0) - item.quantity)
          }).where(eq(products.id, item.productId));
        }
      }
      if (order.customerEmail && c.env.GOOGLE_SCRIPT_URL) {
        const cancellationPromise = sendEmail(c.env.GOOGLE_SCRIPT_URL, c.env.EMAIL_WEBHOOK_SECRET, {
          to: order.customerEmail,
          subject: `PlayPen House \u2014 Order ${order.invoiceId} Cancelled`,
          text: `Hi ${order.customerName}, your order ${order.invoiceId} has been cancelled.`,
          html: orderStatusUpdateEmailHtml(
            order.invoiceId,
            order.customerName,
            "Cancelled",
            body.reason || "Cancelled by customer"
          )
        }).catch((err) => console.error("[EMAIL] Cancellation email failed:", err));
        if (c.executionCtx) c.executionCtx.waitUntil(cancellationPromise);
      }
      return c.json({
        message: "Order cancelled successfully.",
        _links: formatLinks(c, "/orders", id)
      });
    });
    ordersRouter.post("/:id/reopen", async (c) => {
      const id = c.req.param("id");
      const db = c.get("db");
      const body = await c.req.json().catch(() => ({}));
      const authHeader = c.req.header("Authorization");
      const apiKey = c.env.ADMIN_API_KEY;
      let isAdmin = apiKey && authHeader === `Bearer ${apiKey}`;
      if (!isAdmin && authHeader?.startsWith("Bearer ")) {
        try {
          const token = authHeader.split(" ")[1];
          const payload = await verify2(token, c.env.JWT_SECRET || "fallback-dev-secret-change-me", "HS256");
          if (payload.role === "admin") isAdmin = true;
        } catch {
        }
      }
      if (!isAdmin) {
        return c.json({ error: "Unauthorized", message: "Only admins can re-open orders." }, 401);
      }
      const [order] = await db.select().from(orders).where(eq(orders.id, id));
      if (!order) throw new Error(`Order with ID ${id} not found`);
      if (order.status?.toLowerCase() !== "cancelled") {
        return c.json({
          error: "ValidationError",
          message: "Only cancelled orders can be re-opened."
        }, 422);
      }
      const orderItemsList = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
      for (const item of orderItemsList) {
        const [product] = await db.select().from(products).where(eq(products.id, item.productId));
        if (!product) throw new Error(`Product ${item.productId} not found`);
        const availableStock = (product.stock ?? 0) - (product.soldCount ?? 0);
        if (availableStock < item.quantity) {
          throw new Error(`Insufficient stock to re-open order. Product "${product.title}" only has ${availableStock} left.`);
        }
      }
      await db.update(orders).set({ status: "Pending" }).where(eq(orders.id, id));
      for (const item of orderItemsList) {
        const [product] = await db.select().from(products).where(eq(products.id, item.productId));
        await db.update(products).set({
          soldCount: (product.soldCount ?? 0) + item.quantity
        }).where(eq(products.id, item.productId));
      }
      await db.insert(trackings).values({
        id: crypto.randomUUID(),
        orderId: id,
        status: "Order Re-opened",
        message: body.reason || "Order re-opened by administrator.",
        createdAt: /* @__PURE__ */ new Date()
      });
      return c.json({
        message: "Order re-opened successfully.",
        _links: formatLinks(c, "/orders", id)
      });
    });
  }
});

// api/routers/addresses.ts
var addressesRouter;
var init_addresses2 = __esm({
  "api/routers/addresses.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_dist();
    init_drizzle_orm();
    init_schema();
    init_helpers();
    addressesRouter = new Hono2();
    addressesRouter.get("/", async (c) => {
      const db = c.get("db");
      const userId = c.req.query("userId");
      if (!userId) {
        throw new Error("VAL: userId query parameter is required.");
      }
      const rows = await db.query.addresses.findMany({
        where: /* @__PURE__ */ __name((a, { eq: eq2 }) => eq2(a.userId, userId), "where"),
        orderBy: /* @__PURE__ */ __name((a, { desc: desc7 }) => [desc7(a.isDefault), desc7(a.createdAt)], "orderBy")
      });
      return c.json({
        items: rows.map((r) => ({ ...r, _links: formatLinks(c, "/addresses", r.id) })),
        _links: formatLinks(c, "/addresses")
      });
    });
    addressesRouter.post("/", async (c) => {
      const db = c.get("db");
      const body = await c.req.json().catch(() => null);
      if (!body?.userId || !body?.fullName || !body?.phone || !body?.address) {
        throw new Error("VAL: userId, fullName, phone, and address are required.");
      }
      const id = crypto.randomUUID();
      if (body.isDefault) {
        await db.update(addresses).set({ isDefault: 0 }).where(eq(addresses.userId, body.userId));
      }
      await db.insert(addresses).values({
        id,
        userId: body.userId,
        label: body.label || "Home",
        fullName: body.fullName,
        phone: body.phone,
        address: body.address,
        city: body.city || null,
        postalCode: body.postalCode || null,
        isDefault: body.isDefault ? 1 : 0,
        createdAt: /* @__PURE__ */ new Date()
      });
      return c.json({
        id,
        message: "Address added successfully",
        _links: formatLinks(c, "/addresses", id)
      }, 201);
    });
    addressesRouter.patch("/:id", async (c) => {
      const id = c.req.param("id");
      const db = c.get("db");
      const body = await c.req.json();
      const [existing] = await db.select().from(addresses).where(eq(addresses.id, id));
      if (!existing) throw new Error(`Address with ID ${id} not found`);
      const updates = {};
      if (body.label !== void 0) updates.label = body.label;
      if (body.fullName !== void 0) updates.fullName = body.fullName;
      if (body.phone !== void 0) updates.phone = body.phone;
      if (body.address !== void 0) updates.address = body.address;
      if (body.city !== void 0) updates.city = body.city;
      if (body.postalCode !== void 0) updates.postalCode = body.postalCode;
      if (body.isDefault) {
        await db.update(addresses).set({ isDefault: 0 }).where(eq(addresses.userId, existing.userId));
        updates.isDefault = 1;
      }
      if (Object.keys(updates).length > 0) {
        await db.update(addresses).set(updates).where(eq(addresses.id, id));
      }
      return c.json({
        message: "Address updated successfully",
        _links: formatLinks(c, "/addresses", id)
      });
    });
    addressesRouter.delete("/:id", async (c) => {
      const id = c.req.param("id");
      const db = c.get("db");
      const [existing] = await db.select().from(addresses).where(eq(addresses.id, id));
      if (!existing) throw new Error(`Address with ID ${id} not found`);
      await db.delete(addresses).where(eq(addresses.id, id));
      return c.json({ message: "Address deleted successfully" });
    });
  }
});

// api/routers/reviews.ts
var reviewsRouter;
var init_reviews2 = __esm({
  "api/routers/reviews.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_dist();
    init_drizzle_orm();
    init_schema();
    init_helpers();
    reviewsRouter = new Hono2();
    reviewsRouter.get("/", async (c) => {
      const db = c.get("db");
      const productId = c.req.query("productId");
      const userId = c.req.query("userId");
      const sort = c.req.query("sort");
      const hasImages = c.req.query("hasImages") === "true";
      const conds = [];
      if (productId) conds.push(eq(reviews.productId, productId));
      if (userId) conds.push(eq(reviews.userId, userId));
      if (productId && !userId) conds.push(eq(reviews.status, "approved"));
      if (hasImages) {
        conds.push(not(isNull(reviews.images)));
        conds.push(not(eq(reviews.images, "[]")));
      }
      const rows = await db.select({
        id: reviews.id,
        productId: reviews.productId,
        userId: reviews.userId,
        username: reviews.username,
        rating: reviews.rating,
        title: reviews.title,
        content: reviews.content,
        images: reviews.images,
        isVerified: reviews.isVerified,
        helpfulCount: reviews.helpfulCount,
        status: reviews.status,
        createdAt: reviews.createdAt,
        productName: products.title
      }).from(reviews).leftJoin(products, eq(reviews.productId, products.id)).where(conds.length > 0 ? and(...conds) : void 0).orderBy(sort === "helpful" ? desc(reviews.helpfulCount) : desc(reviews.createdAt));
      let stats = null;
      if (productId) {
        const allApproved = await db.select().from(reviews).where(and(eq(reviews.productId, productId), eq(reviews.status, "approved")));
        if (allApproved.length > 0) {
          const total = allApproved.length;
          const avgRating = allApproved.reduce((sum, r) => sum + r.rating, 0) / total;
          const distribution = [1, 2, 3, 4, 5].map((star) => ({
            stars: star,
            count: allApproved.filter((r) => r.rating === star).length,
            percentage: Math.round(allApproved.filter((r) => r.rating === star).length / total * 100)
          }));
          stats = { averageRating: Math.round(avgRating * 10) / 10, totalReviews: total, distribution };
        } else {
          stats = { averageRating: 0, totalReviews: 0, distribution: [1, 2, 3, 4, 5].map((s) => ({ stars: s, count: 0, percentage: 0 })) };
        }
      }
      return c.json({
        items: rows.map((r) => ({ ...r, _links: formatLinks(c, "/reviews", r.id) })),
        stats,
        _links: formatLinks(c, "/reviews")
      });
    });
    reviewsRouter.post("/", async (c) => {
      const db = c.get("db");
      const body = await c.req.json().catch(() => null);
      if (!body?.productId || !body?.userId || !body?.rating) {
        throw new Error("VAL: productId, userId, and rating are required.");
      }
      if (body.rating < 1 || body.rating > 5) {
        throw new Error("VAL: Rating must be between 1 and 5.");
      }
      let username = body.username;
      if (!username) {
        const [user] = await db.select().from(users).where(eq(users.id, body.userId));
        username = user?.username || "Guest";
      }
      const deliveredOrders = await db.select({
        orderId: orders.id
      }).from(orders).innerJoin(orderItems, eq(orders.id, orderItems.orderId)).where(and(
        eq(orders.userId, body.userId),
        eq(orders.status, "delivered"),
        eq(orderItems.productId, body.productId)
      )).limit(1);
      if (deliveredOrders.length === 0) {
        throw new Error("VAL: You can only review products you have purchased and received.");
      }
      const [existingReview] = await db.select().from(reviews).where(and(eq(reviews.userId, body.userId), eq(reviews.productId, body.productId))).limit(1);
      if (existingReview) {
        throw new Error("VAL: You have already reviewed this product.");
      }
      const id = crypto.randomUUID();
      await db.insert(reviews).values({
        id,
        productId: body.productId,
        userId: body.userId,
        username,
        rating: body.rating,
        title: body.title || null,
        content: body.content || body.comment || null,
        images: body.images ? typeof body.images === "string" ? body.images : JSON.stringify(body.images) : "[]",
        isVerified: 1,
        // Automatically verified since we checked the order
        orderId: deliveredOrders[0].orderId,
        status: "pending",
        // All new reviews require approval
        createdAt: /* @__PURE__ */ new Date()
      });
      try {
        await db.insert(notifications).values({
          id: crypto.randomUUID(),
          userId: null,
          // Global/Admin
          title: `New Review for Product`,
          message: `User ${username} has submitted a new review for moderation.`,
          type: "new_review",
          orderId: deliveredOrders[0].orderId,
          isRead: 0,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        });
      } catch (err) {
        console.error("Failed to insert admin review notification:", err);
      }
      return c.json({
        id,
        message: "Review submitted successfully and is awaiting approval.",
        _links: formatLinks(c, "/reviews", id)
      }, 201);
    });
    reviewsRouter.patch("/:id/status", async (c) => {
      const id = c.req.param("id");
      const db = c.get("db");
      const body = await c.req.json();
      if (!body?.status) throw new Error("VAL: Status is required.");
      const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
      if (!review) throw new Error(`Review with ID ${id} not found`);
      await db.update(reviews).set({ status: body.status }).where(eq(reviews.id, id));
      if (body.status === "approved" || review.status === "approved") {
        const productId = review.productId;
        const allApproved = await db.select().from(reviews).where(and(eq(reviews.productId, productId), eq(reviews.status, "approved")));
        const countVal = allApproved.length;
        const avgVal = countVal > 0 ? allApproved.reduce((s, r) => s + r.rating, 0) / countVal : 0;
        await db.update(products).set({
          rating: Number(avgVal.toFixed(1)),
          reviewCount: countVal
        }).where(eq(products.id, productId));
      }
      return c.json({ message: "Review status updated successfully." });
    });
    reviewsRouter.patch("/:id/helpful", async (c) => {
      const id = c.req.param("id");
      const db = c.get("db");
      const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
      if (!review) throw new Error(`Review with ID ${id} not found`);
      await db.update(reviews).set({ helpfulCount: (review.helpfulCount || 0) + 1 }).where(eq(reviews.id, id));
      return c.json({ message: "Review marked as helpful." });
    });
    reviewsRouter.delete("/:id", async (c) => {
      const id = c.req.param("id");
      const db = c.get("db");
      const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
      if (!review) throw new Error(`Review with ID ${id} not found`);
      await db.delete(reviews).where(eq(reviews.id, id));
      if (review.status === "approved") {
        const productId = review.productId;
        const allApproved = await db.select().from(reviews).where(and(eq(reviews.productId, productId), eq(reviews.status, "approved")));
        const countVal = allApproved.length;
        const avgVal = countVal > 0 ? allApproved.reduce((s, r) => s + r.rating, 0) / countVal : 0;
        await db.update(products).set({
          rating: Number(avgVal.toFixed(1)),
          reviewCount: countVal
        }).where(eq(products.id, productId));
      }
      return c.json({ message: "Review deleted successfully" });
    });
  }
});

// api/routers/returns.ts
var returnsRouter;
var init_returns2 = __esm({
  "api/routers/returns.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_dist();
    init_drizzle_orm();
    init_schema();
    init_helpers();
    returnsRouter = new Hono2();
    returnsRouter.get("/", async (c) => {
      const db = c.get("db");
      const userId = c.req.query("userId");
      const type = c.req.query("type");
      const rows = await db.query.returns.findMany({
        where: /* @__PURE__ */ __name((r, { eq: eq2, and: and3 }) => {
          const conditions = [];
          if (userId) conditions.push(eq2(r.userId, userId));
          if (type) conditions.push(eq2(r.type, type));
          return conditions.length > 1 ? and3(...conditions) : conditions[0];
        }, "where"),
        orderBy: /* @__PURE__ */ __name((r, { desc: desc7 }) => [desc7(r.createdAt)], "orderBy")
      });
      return c.json({
        items: rows.map((r) => ({ ...r, _links: formatLinks(c, "/returns", r.id) })),
        _links: formatLinks(c, "/returns")
      });
    });
    returnsRouter.post("/", async (c) => {
      const db = c.get("db");
      const body = await c.req.json().catch(() => null);
      if (!body?.orderId || !body?.userId || !body?.reason || !body?.type) {
        throw new Error("VAL: orderId, userId, reason, and type are required.");
      }
      if (!["return", "cancellation"].includes(body.type)) {
        throw new Error("VAL: type must be 'return' or 'cancellation'.");
      }
      const [order] = await db.select().from(orders).where(eq(orders.id, body.orderId));
      if (!order) throw new Error(`Order with ID ${body.orderId} not found`);
      const status = order.status?.toLowerCase();
      if (body.type === "cancellation") {
        if (status !== "pending" && status !== "processing") {
          throw new Error("VAL: Orders can only be cancelled when in Pending or Processing status.");
        }
      } else if (body.type === "return") {
        if (status !== "delivered") {
          throw new Error("VAL: Returns can only be requested for Delivered orders.");
        }
        if (order.createdAt) {
          const deliveredDate = new Date(order.createdAt);
          const daysSince = (Date.now() - deliveredDate.getTime()) / (1e3 * 60 * 60 * 24);
          if (daysSince > 7) {
            throw new Error("VAL: Return window has expired (7 days from delivery).");
          }
        }
      }
      const existingReturns = await db.select().from(returns).where(and(
        eq(returns.orderId, body.orderId),
        eq(returns.type, body.type)
      ));
      if (existingReturns.length > 0) {
        throw new Error(`VAL: A ${body.type} request already exists for this order.`);
      }
      const id = crypto.randomUUID();
      await db.insert(returns).values({
        id,
        orderId: body.orderId,
        userId: body.userId,
        reason: body.reason,
        details: body.details || null,
        images: body.images ? typeof body.images === "string" ? body.images : JSON.stringify(body.images) : null,
        status: "Requested",
        type: body.type,
        createdAt: /* @__PURE__ */ new Date()
      });
      try {
        await db.insert(notifications).values({
          id: crypto.randomUUID(),
          userId: null,
          // Global/Admin
          title: body.type === "cancellation" ? "New Cancellation" : "New Return Request",
          message: `${body.type === "cancellation" ? "Cancellation" : "Return"} request for order ${order.invoiceId} by user ${body.userId}. Reason: ${body.reason}`,
          type: body.type === "cancellation" ? "new_cancellation" : "new_return",
          orderId: body.orderId,
          isRead: 0,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        });
      } catch (err) {
        console.error("Failed to insert admin return/cancellation notification:", err);
      }
      if (body.type === "cancellation") {
        await db.update(orders).set({ status: "Cancelled" }).where(eq(orders.id, body.orderId));
        await db.insert(trackings).values({
          id: crypto.randomUUID(),
          orderId: body.orderId,
          status: "Cancelled",
          message: `Order cancelled by customer. Reason: ${body.reason}`,
          createdAt: /* @__PURE__ */ new Date()
        });
      }
      return c.json({
        id,
        message: `${body.type === "cancellation" ? "Cancellation" : "Return"} request submitted successfully`,
        _links: formatLinks(c, "/returns", id)
      }, 201);
    });
    returnsRouter.patch("/:id", async (c) => {
      const id = c.req.param("id");
      const db = c.get("db");
      const body = await c.req.json();
      const [existing] = await db.select().from(returns).where(eq(returns.id, id));
      if (!existing) throw new Error(`Return request with ID ${id} not found`);
      const updates = {};
      if (body.status) updates.status = body.status;
      if (body.adminNotes !== void 0) updates.adminNotes = body.adminNotes;
      if (Object.keys(updates).length > 0) {
        await db.update(returns).set(updates).where(eq(returns.id, id));
      }
      return c.json({
        message: "Return request updated successfully",
        _links: formatLinks(c, "/returns", id)
      });
    });
    returnsRouter.patch("/:id/status", async (c) => {
      const id = c.req.param("id");
      const db = c.get("db");
      const body = await c.req.json();
      const [existing] = await db.select().from(returns).where(eq(returns.id, id));
      if (!existing) throw new Error(`Return request with ID ${id} not found`);
      const updates = {};
      if (body.status) updates.status = body.status;
      if (body.adminNotes) updates.adminNotes = body.adminNotes;
      if (Object.keys(updates).length > 0) {
        await db.update(returns).set(updates).where(eq(returns.id, id));
      }
      return c.json({
        message: "Return request updated successfully",
        _links: formatLinks(c, "/returns", id)
      });
    });
  }
});

// api/routers/settings.ts
var settingsRouter;
var init_settings = __esm({
  "api/routers/settings.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_dist();
    init_drizzle_orm();
    init_schema();
    init_email();
    settingsRouter = new Hono2();
    settingsRouter.get("/", async (c) => {
      const db = c.get("db");
      const rows = await db.select().from(systemSettings);
      const settings = rows.reduce((acc, row) => {
        acc[row.key] = row.value;
        return acc;
      }, {});
      return c.json(settings);
    });
    settingsRouter.post("/", async (c) => {
      const db = c.get("db");
      const body = await c.req.json().catch(() => null);
      if (!body || typeof body !== "object") {
        throw new Error("VAL: Settings object is required.");
      }
      const entries = Object.entries(body);
      for (const [key, value] of entries) {
        if (typeof value !== "string") continue;
        const [existing] = await db.select().from(systemSettings).where(eq(systemSettings.key, key));
        if (existing) {
          await db.update(systemSettings).set({ value, updatedAt: (/* @__PURE__ */ new Date()).toISOString() }).where(eq(systemSettings.key, key));
        } else {
          await db.insert(systemSettings).values({
            id: crypto.randomUUID(),
            key,
            value,
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          });
        }
      }
      return c.json({ message: "Settings updated successfully" });
    });
    settingsRouter.post("/test-email", async (c) => {
      const body = await c.req.json().catch(() => null);
      if (!body?.email) {
        throw new Error("VAL: Email address is required.");
      }
      if (!c.env.GOOGLE_SCRIPT_URL) {
        return c.json({
          error: "ConfigError",
          message: "GOOGLE_SCRIPT_URL is not configured. Please set it in your environment variables."
        }, 503);
      }
      const success = await sendEmail(c.env.GOOGLE_SCRIPT_URL, c.env.EMAIL_WEBHOOK_SECRET, {
        to: body.email,
        subject: "PlayPen House - Test Email",
        text: "If you received this, your email notifications are working correctly!",
        html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #fff; border-radius: 16px; border: 2px solid #22c55e;">
        <div style="text-align: center;">
          <h1 style="color: #1a1a2e; font-size: 24px; margin: 0;">PlayPen House</h1>
          <p style="color: #22c55e; font-size: 20px; font-weight: 700; margin: 16px 0;">Email Integration Working!</p>
          <p style="color: #666; font-size: 14px;">This is a test email from your admin panel. Your notification system is configured correctly.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #aaa; font-size: 11px;">Sent at: ${(/* @__PURE__ */ new Date()).toISOString()}</p>
        </div>
      </div>
    `
      });
      if (success) {
        return c.json({ message: "Test email sent successfully!" });
      } else {
        return c.json({ error: "EmailError", message: "Failed to send test email. Check your GOOGLE_SCRIPT_URL configuration." }, 500);
      }
    });
  }
});

// api/routers/coupons.ts
var couponsRouter;
var init_coupons2 = __esm({
  "api/routers/coupons.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_dist();
    init_drizzle_orm();
    init_schema();
    init_helpers();
    couponsRouter = new Hono2();
    couponsRouter.get("/", async (c) => {
      const db = c.get("db");
      const rows = await db.query.coupons.findMany({
        orderBy: /* @__PURE__ */ __name((cp, { desc: desc7 }) => [desc7(cp.createdAt)], "orderBy")
      });
      return c.json({
        items: rows.map((r) => ({ ...r, _links: formatLinks(c, "/coupons", r.id) })),
        _links: formatLinks(c, "/coupons")
      });
    });
    couponsRouter.get("/validate", async (c) => {
      const db = c.get("db");
      const code = c.req.query("code")?.toUpperCase();
      const orderTotal = parseFloat(c.req.query("total") || "0");
      if (!code) throw new Error("VAL: Coupon code is required.");
      const [coupon] = await db.select().from(coupons).where(eq(coupons.code, code));
      if (!coupon || !coupon.isActive) {
        return c.json({ valid: false, message: "Invalid or expired coupon code." }, 404);
      }
      if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
        return c.json({ valid: false, message: "This coupon has expired." });
      }
      if (coupon.startsAt && new Date(coupon.startsAt).getTime() > Date.now()) {
        return c.json({ valid: false, message: "This coupon is not yet active." });
      }
      if (coupon.usageLimit && (coupon.usedCount ?? 0) >= coupon.usageLimit) {
        return c.json({ valid: false, message: "This coupon has reached its usage limit." });
      }
      if (coupon.minOrderAmount && orderTotal < coupon.minOrderAmount) {
        return c.json({
          valid: false,
          message: `Minimum order amount of \u09F3${coupon.minOrderAmount.toLocaleString()} required.`
        });
      }
      let discount = 0;
      if (coupon.type === "percentage") {
        discount = orderTotal * coupon.value / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = coupon.value;
      }
      discount = Math.min(discount, orderTotal);
      return c.json({
        valid: true,
        coupon: {
          code: coupon.code,
          description: coupon.description,
          type: coupon.type,
          value: coupon.value
        },
        discount: Math.round(discount * 100) / 100,
        message: `Coupon applied! You save \u09F3${discount.toLocaleString()}.`
      });
    });
    couponsRouter.post("/", async (c) => {
      const db = c.get("db");
      const body = await c.req.json().catch(() => null);
      if (!body?.code || !body?.type || body?.value === void 0) {
        throw new Error("VAL: Code, type, and value are required.");
      }
      const id = crypto.randomUUID();
      await db.insert(coupons).values({
        id,
        code: body.code.toUpperCase(),
        description: body.description || null,
        type: body.type,
        value: body.value,
        minOrderAmount: body.minOrderAmount || 0,
        maxDiscount: body.maxDiscount || null,
        usageLimit: body.usageLimit || null,
        isActive: body.isActive ?? 1,
        startsAt: body.startsAt ? new Date(body.startsAt) : null,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        createdAt: /* @__PURE__ */ new Date()
      });
      return c.json({ id, message: "Coupon created successfully", _links: formatLinks(c, "/coupons", id) }, 201);
    });
    couponsRouter.patch("/:id", async (c) => {
      const id = c.req.param("id");
      const db = c.get("db");
      const body = await c.req.json();
      const [existing] = await db.select().from(coupons).where(eq(coupons.id, id));
      if (!existing) throw new Error(`Coupon with ID ${id} not found`);
      const updates = {};
      if (body.code !== void 0) updates.code = body.code.toUpperCase();
      if (body.description !== void 0) updates.description = body.description;
      if (body.type !== void 0) updates.type = body.type;
      if (body.value !== void 0) updates.value = body.value;
      if (body.minOrderAmount !== void 0) updates.minOrderAmount = body.minOrderAmount;
      if (body.maxDiscount !== void 0) updates.maxDiscount = body.maxDiscount;
      if (body.usageLimit !== void 0) updates.usageLimit = body.usageLimit;
      if (body.isActive !== void 0) updates.isActive = body.isActive;
      if (body.startsAt !== void 0) updates.startsAt = body.startsAt ? new Date(body.startsAt) : null;
      if (body.expiresAt !== void 0) updates.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;
      if (Object.keys(updates).length > 0) {
        await db.update(coupons).set(updates).where(eq(coupons.id, id));
      }
      return c.json({ message: "Coupon updated successfully", _links: formatLinks(c, "/coupons", id) });
    });
    couponsRouter.delete("/:id", async (c) => {
      const id = c.req.param("id");
      const db = c.get("db");
      await db.delete(coupons).where(eq(coupons.id, id));
      return c.json({ message: "Coupon deleted successfully" });
    });
  }
});

// api/routers/dashboard.ts
var dashboardRouter;
var init_dashboard = __esm({
  "api/routers/dashboard.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_dist();
    init_drizzle_orm();
    init_schema();
    dashboardRouter = new Hono2();
    dashboardRouter.get("/stats", async (c) => {
      const db = c.get("db");
      const from = c.req.query("from") ? new Date(parseInt(c.req.query("from"))) : null;
      const to = c.req.query("to") ? new Date(parseInt(c.req.query("to"))) : null;
      const [prodCount] = await db.select({ count: sql`count(*)` }).from(products);
      const [catCount] = await db.select({ count: sql`count(*)` }).from(categories);
      const [userCount] = await db.select({ count: sql`count(*)` }).from(users);
      const [orderCount] = await db.select({ count: sql`count(*)` }).from(orders);
      const [reviewCount] = await db.select({ count: sql`count(*)` }).from(reviews);
      const [totalSold] = await db.select({ total: sql`sum(quantity)` }).from(orderItems);
      let revenueQuery = db.select({ total: sql`sum(total_amount)` }).from(orders);
      if (from) revenueQuery = revenueQuery.where(sql`created_at >= ${from.getTime() / 1e3}`);
      if (to) revenueQuery = revenueQuery.where(sql`created_at <= ${to.getTime() / 1e3}`);
      const [revenueResult] = await revenueQuery;
      let statusQuery = db.select({
        status: orders.status,
        count: sql`count(*)`
      }).from(orders).groupBy(orders.status);
      if (from) statusQuery = statusQuery.where(sql`created_at >= ${from.getTime() / 1e3}`);
      if (to) statusQuery = statusQuery.where(sql`created_at <= ${to.getTime() / 1e3}`);
      const statusResults = await statusQuery;
      const ordersByStatus = statusResults.reduce((acc, curr) => {
        acc[curr.status] = curr.count;
        return acc;
      }, {});
      let monthlyQuery = db.select({
        month: sql`strftime('%Y-%m', datetime(created_at, 'unixepoch'))`,
        total: sql`sum(total_amount)`,
        count: sql`count(*)`
      }).from(orders);
      if (from) monthlyQuery = monthlyQuery.where(sql`created_at >= ${from.getTime() / 1e3}`);
      if (to) monthlyQuery = monthlyQuery.where(sql`created_at <= ${to.getTime() / 1e3}`);
      const monthlyRevenue = await monthlyQuery.groupBy(sql`strftime('%Y-%m', datetime(created_at, 'unixepoch'))`).orderBy(sql`strftime('%Y-%m', datetime(created_at, 'unixepoch'))`);
      const recentOrders = await db.select({
        id: orders.id,
        invoiceId: orders.invoiceId,
        customerName: orders.customerName,
        status: orders.status,
        totalAmount: orders.totalAmount
      }).from(orders).orderBy(sql`created_at DESC`).limit(5);
      const lowStockProducts = await db.select({
        id: products.id,
        title: products.title,
        stock: products.stock
      }).from(products).where(sql`stock <= 5`).limit(5);
      return c.json({
        counts: {
          products: prodCount?.count || 0,
          categories: catCount?.count || 0,
          users: userCount?.count || 0,
          orders: orderCount?.count || 0,
          reviews: reviewCount?.count || 0,
          totalSold: totalSold?.total || 0
        },
        revenue: {
          total: revenueResult?.total || 0,
          currency: "BDT"
        },
        ordersByStatus,
        recentOrders,
        lowStockProducts,
        monthlyRevenue,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    });
  }
});

// api/routers/wallet.ts
var walletRouter;
var init_wallet2 = __esm({
  "api/routers/wallet.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_dist();
    init_schema();
    init_helpers();
    walletRouter = new Hono2();
    walletRouter.get("/", async (c) => {
      const db = c.get("db");
      const userId = c.req.query("userId");
      if (!userId) {
        throw new Error("VAL: userId query parameter is required.");
      }
      const rows = await db.query.walletTransactions.findMany({
        where: /* @__PURE__ */ __name((t, { eq: eq2 }) => eq2(t.userId, userId), "where"),
        orderBy: /* @__PURE__ */ __name((t, { desc: desc7 }) => [desc7(t.createdAt)], "orderBy")
      });
      const balance = rows.length > 0 ? rows[0].balanceAfter ?? 0 : 0;
      return c.json({
        balance,
        items: rows.map((r) => ({ ...r, _links: formatLinks(c, "/wallet", r.id) })),
        _links: formatLinks(c, "/wallet")
      });
    });
    walletRouter.post("/topup", async (c) => {
      const db = c.get("db");
      const body = await c.req.json().catch(() => null);
      if (!body?.userId || !body?.amount || body.amount <= 0) {
        throw new Error("VAL: userId and a positive amount are required.");
      }
      const id = crypto.randomUUID();
      const userId = body.userId;
      const amount = Number(body.amount);
      const rows = await db.query.walletTransactions.findMany({
        where: /* @__PURE__ */ __name((t, { eq: eq2 }) => eq2(t.userId, userId), "where"),
        orderBy: /* @__PURE__ */ __name((t, { desc: desc7 }) => [desc7(t.createdAt)], "orderBy"),
        limit: 1
      });
      const currentBalance = rows.length > 0 ? rows[0].balanceAfter ?? 0 : 0;
      const newBalance = currentBalance + amount;
      await db.insert(walletTransactions).values({
        id,
        userId,
        amount,
        type: "credit",
        reference: body.reference || "Top-up",
        balanceAfter: newBalance,
        createdAt: /* @__PURE__ */ new Date()
      });
      return c.json({
        id,
        balanceAfter: newBalance,
        message: "Wallet topped up successfully",
        _links: formatLinks(c, "/wallet", id)
      }, 201);
    });
    walletRouter.post("/charge", async (c) => {
      const db = c.get("db");
      const body = await c.req.json().catch(() => null);
      if (!body?.userId || !body?.amount || body.amount <= 0) {
        throw new Error("VAL: userId and a positive amount are required.");
      }
      const id = crypto.randomUUID();
      const userId = body.userId;
      const amount = Number(body.amount);
      const rows = await db.query.walletTransactions.findMany({
        where: /* @__PURE__ */ __name((t, { eq: eq2 }) => eq2(t.userId, userId), "where"),
        orderBy: /* @__PURE__ */ __name((t, { desc: desc7 }) => [desc7(t.createdAt)], "orderBy"),
        limit: 1
      });
      const currentBalance = rows.length > 0 ? rows[0].balanceAfter ?? 0 : 0;
      if (currentBalance < amount) {
        throw new Error("VAL: Insufficient wallet balance.");
      }
      const newBalance = currentBalance - amount;
      await db.insert(walletTransactions).values({
        id,
        userId,
        amount,
        type: "debit",
        reference: body.reference || "Payment",
        balanceAfter: newBalance,
        createdAt: /* @__PURE__ */ new Date()
      });
      return c.json({
        id,
        balanceAfter: newBalance,
        message: "Wallet charged successfully",
        _links: formatLinks(c, "/wallet", id)
      }, 201);
    });
  }
});

// api/routers/notifications.ts
var notificationsRouter;
var init_notifications2 = __esm({
  "api/routers/notifications.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_dist();
    init_drizzle_orm();
    init_schema();
    notificationsRouter = new Hono2();
    notificationsRouter.get("/", async (c) => {
      try {
        const db = c.get("db");
        const userId = c.req.query("userId");
        const isAdminView = c.req.query("all") === "true";
        const rows = await db.query.notifications.findMany({
          where: isAdminView ? void 0 : userId ? or(eq(notifications.userId, userId), isNull(notifications.userId)) : isNull(notifications.userId),
          orderBy: /* @__PURE__ */ __name((n, { desc: desc7 }) => [desc7(n.createdAt)], "orderBy")
        });
        return c.json({ items: rows });
      } catch (error) {
        console.error("Fetch notifications error:", error.message);
        return c.json({ items: [] });
      }
    });
    notificationsRouter.get("/check", async (c) => {
      try {
        const db = c.get("db");
        const userId = c.req.query("userId");
        const whereFilter = userId ? or(eq(notifications.userId, userId), isNull(notifications.userId)) : isNull(notifications.userId);
        const [unreadResult] = await db.select({ value: count() }).from(notifications).where(and(whereFilter, eq(notifications.isRead, 0)));
        const latest = await db.query.notifications.findFirst({
          where: whereFilter,
          orderBy: /* @__PURE__ */ __name((n, { desc: desc7 }) => [desc7(n.createdAt)], "orderBy"),
          columns: { id: true, createdAt: true }
        });
        return c.json({
          unreadCount: unreadResult?.value ?? 0,
          latestId: latest?.id ?? null,
          latestAt: latest?.createdAt ?? null
        });
      } catch (error) {
        console.error("Check notifications error:", error.message);
        return c.json({ unreadCount: 0, latestId: null, latestAt: null });
      }
    });
    notificationsRouter.post("/", async (c) => {
      try {
        const db = c.get("db");
        const body = await c.req.json().catch(() => null);
        if (!body?.title || !body?.message) {
          throw new Error("VAL: Title and message are required.");
        }
        const id = crypto.randomUUID();
        await db.insert(notifications).values({
          id,
          userId: body.userId || null,
          title: body.title,
          message: body.message,
          type: body.type || "info",
          isRead: 0,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        });
        return c.json({ id, message: "Notification sent successfully" }, 201);
      } catch (error) {
        console.error("Create notification error:", error.message);
        return c.json({ error: error.message }, 400);
      }
    });
    notificationsRouter.post("/:id/read", async (c) => {
      try {
        const id = c.req.param("id");
        const db = c.get("db");
        await db.update(notifications).set({ isRead: 1 }).where(eq(notifications.id, id));
        return c.json({ message: "Notification marked as read." });
      } catch (error) {
        return c.json({ error: error.message }, 400);
      }
    });
    notificationsRouter.post("/read-all", async (c) => {
      try {
        const db = c.get("db");
        const userId = c.req.query("userId");
        const whereFilter = userId ? and(eq(notifications.userId, userId), eq(notifications.isRead, 0)) : and(isNull(notifications.userId), eq(notifications.isRead, 0));
        await db.update(notifications).set({ isRead: 1 }).where(whereFilter);
        return c.json({ message: "All notifications marked as read." });
      } catch (error) {
        console.error("Mark read all error:", error.message);
        return c.json({ error: error.message }, 400);
      }
    });
  }
});

// api/routers/bulk.ts
var bulkRouter;
var init_bulk = __esm({
  "api/routers/bulk.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_dist();
    init_drizzle_orm();
    init_schema();
    bulkRouter = new Hono2();
    bulkRouter.get("/user", async (c) => {
      const db = c.get("db");
      const userId = c.req.query("userId");
      const customerName = c.req.query("customerName");
      const email = c.req.query("email");
      if (!userId) {
        return c.json({ error: "userId query parameter is required" }, 400);
      }
      try {
        const [
          userProfile,
          walletTransactions2,
          addresses2,
          orders2,
          returns2,
          cancellations,
          reviews2,
          notificationCount
        ] = await Promise.all([
          // 1. User Profile
          db.query.users.findFirst({
            where: /* @__PURE__ */ __name((u, { eq: eq2 }) => eq2(u.id, userId), "where")
          }),
          // 2. Wallet Transactions & Balance
          db.query.walletTransactions.findMany({
            where: /* @__PURE__ */ __name((t, { eq: eq2 }) => eq2(t.userId, userId), "where"),
            orderBy: /* @__PURE__ */ __name((t, { desc: desc7 }) => [desc7(t.createdAt)], "orderBy")
          }),
          // 3. Addresses
          db.query.addresses.findMany({
            where: /* @__PURE__ */ __name((a, { eq: eq2 }) => eq2(a.userId, userId), "where"),
            orderBy: /* @__PURE__ */ __name((a, { desc: desc7 }) => [desc7(a.createdAt)], "orderBy")
          }),
          // 4. Orders (Unified query for registered & guest checkouts)
          db.query.orders.findMany({
            where: /* @__PURE__ */ __name((o, { eq: eq2, or: or3 }) => {
              const conds = [];
              if (userId && userId.trim() !== "") conds.push(eq2(o.userId, userId));
              if (customerName && customerName.trim() !== "") conds.push(eq2(o.customerName, customerName));
              if (email && email.trim() !== "") conds.push(eq2(o.customerEmail, email));
              return conds.length > 0 ? or3(...conds) : void 0;
            }, "where"),
            with: {
              items: true
            },
            orderBy: /* @__PURE__ */ __name((o, { desc: desc7 }) => [desc7(o.createdAt)], "orderBy")
          }),
          // 5. Returns
          db.query.returns.findMany({
            where: /* @__PURE__ */ __name((r, { eq: eq2, and: and3 }) => and3(eq2(r.userId, userId), eq2(r.type, "return")), "where"),
            orderBy: /* @__PURE__ */ __name((r, { desc: desc7 }) => [desc7(r.createdAt)], "orderBy")
          }),
          // 6. Cancellations
          db.query.returns.findMany({
            where: /* @__PURE__ */ __name((r, { eq: eq2, and: and3 }) => and3(eq2(r.userId, userId), eq2(r.type, "cancellation")), "where"),
            orderBy: /* @__PURE__ */ __name((r, { desc: desc7 }) => [desc7(r.createdAt)], "orderBy")
          }),
          // 7. Reviews
          db.query.reviews.findMany({
            where: /* @__PURE__ */ __name((r, { eq: eq2 }) => eq2(r.userId, userId), "where"),
            orderBy: /* @__PURE__ */ __name((r, { desc: desc7 }) => [desc7(r.createdAt)], "orderBy")
          }),
          // 8. Unread Notifications Count
          db.query.notifications.findMany({
            where: /* @__PURE__ */ __name((n, { eq: eq2, and: and3, or: or3, isNull: isNull2 }) => and3(
              eq2(n.isRead, 0),
              or3(eq2(n.userId, userId), isNull2(n.userId))
            ), "where")
          })
        ]);
        return c.json({
          profile: userProfile || null,
          wallet: {
            balance: walletTransactions2.length > 0 ? walletTransactions2[0].balanceAfter ?? 0 : 0,
            transactions: walletTransactions2
          },
          addresses: { items: addresses2 },
          orders: { items: orders2 },
          returns: { items: returns2 },
          cancellations: { items: cancellations },
          reviews: { items: reviews2 },
          notifications: {
            unreadCount: notificationCount.length,
            latest: notificationCount.slice(0, 5)
          },
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      } catch (error) {
        return c.json({ error: "Bulk user fetch failed", details: error.message }, 500);
      }
    });
    bulkRouter.get("/admin/stats", async (c) => {
      const db = c.get("db");
      try {
        const [
          pendingOrders,
          pendingReturns,
          pendingReviews,
          unreadNotifications
        ] = await Promise.all([
          // 1. Pending Orders
          db.select({ value: sql`count(*)` }).from(orders).where(or(
            eq(orders.status, "Pending"),
            eq(orders.status, "pending"),
            eq(orders.status, "Pending Verification"),
            eq(orders.status, "Processing"),
            eq(orders.status, "processing")
          )),
          // 2. Pending Returns
          db.select({ value: sql`count(*)` }).from(returns).where(eq(returns.status, "Requested")),
          // 3. Pending Reviews
          db.select({ value: sql`count(*)` }).from(reviews).where(or(
            eq(reviews.status, "pending"),
            eq(reviews.status, "Pending")
          )),
          // 4. Unread Admin Notifications
          db.select({ value: sql`count(*)` }).from(notifications).where(and(
            isNull(notifications.userId),
            eq(notifications.isRead, 0)
          ))
        ]);
        return c.json({
          orders: pendingOrders[0]?.value ?? 0,
          returns: pendingReturns[0]?.value ?? 0,
          reviews: pendingReviews[0]?.value ?? 0,
          notifications: unreadNotifications[0]?.value ?? 0,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      } catch (error) {
        console.error("Admin stats fetch error:", error.message);
        return c.json({ orders: 0, returns: 0, reviews: 0, notifications: 0 }, 500);
      }
    });
    bulkRouter.get("/home", async (c) => {
      const db = c.get("db");
      try {
        const [cached] = await db.select().from(systemCache).where(eq(systemCache.key, "home_bulk"));
        const now = /* @__PURE__ */ new Date();
        const isStale = cached && new Date(cached.updatedAt).toDateString() !== now.toDateString();
        if (cached && !isStale) {
          return c.json({
            ...JSON.parse(cached.data),
            _cached: true,
            _updatedAt: cached.updatedAt
          });
        }
        const [banners2, categories2, newProducts, popularProducts, bestSelling, [popup]] = await Promise.all([
          db.select().from(banners).where(eq(banners.isActive, 1)),
          db.select().from(categories).where(eq(categories.isActive, 1)),
          db.query.products.findMany({
            where: /* @__PURE__ */ __name((p, { eq: eq2 }) => eq2(p.isActive, 1), "where"),
            limit: 8,
            orderBy: /* @__PURE__ */ __name((p, { desc: desc7 }) => [desc7(p.createdAt)], "orderBy")
          }),
          db.query.products.findMany({
            where: /* @__PURE__ */ __name((p, { eq: eq2 }) => eq2(p.isActive, 1), "where"),
            limit: 8,
            orderBy: /* @__PURE__ */ __name((p, { desc: desc7 }) => [desc7(p.rating)], "orderBy")
          }),
          db.query.products.findMany({
            where: /* @__PURE__ */ __name((p, { eq: eq2 }) => eq2(p.isActive, 1), "where"),
            limit: 8,
            orderBy: /* @__PURE__ */ __name((p, { desc: desc7 }) => [desc7(p.soldCount)], "orderBy")
          }),
          db.select().from(popupSettings).where(eq(popupSettings.isActive, 1)).limit(1)
        ]);
        const structuredData = {
          banners: {
            hero: banners2.filter((b) => b.position === "hero").sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
            mid1: banners2.filter((b) => b.position === "mid-1").sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
            mid2: banners2.filter((b) => b.position === "mid-2").sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          },
          categories: { items: categories2 },
          products: {
            trending: { items: popularProducts },
            newArrivals: { items: newProducts },
            specialOffers: { items: newProducts.filter((p) => p.salePrice !== null) },
            bestSelling: { items: bestSelling },
            flashSales: { items: [] }
            // Placeholder or fetch if needed
          },
          popup: popup || null,
          notifications: { items: [] },
          // Placeholder
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
        await db.insert(systemCache).values({
          key: "home_bulk",
          data: JSON.stringify(structuredData),
          updatedAt: /* @__PURE__ */ new Date()
        }).onConflictDoUpdate({
          target: systemCache.key,
          set: { data: JSON.stringify(structuredData), updatedAt: /* @__PURE__ */ new Date() }
        });
        return c.json({ ...structuredData, _cached: false });
      } catch (error) {
        console.error("Home bulk fetch error:", error);
        return c.json({ error: "Home bulk fetch failed", details: error.message }, 500);
      }
    });
  }
});

// api/routers/system.ts
var systemRouter;
var init_system = __esm({
  "api/routers/system.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_dist();
    init_drizzle_orm();
    init_schema();
    systemRouter = new Hono2();
    systemRouter.post("/refresh-cache", async (c) => {
      const db = c.get("db");
      try {
        const [banners2, categories2, newProducts, popularProducts] = await Promise.all([
          db.select().from(banners).where(eq(banners.isActive, 1)),
          db.select().from(categories),
          db.query.products.findMany({ limit: 8, orderBy: /* @__PURE__ */ __name((p, { desc: desc7 }) => [desc7(p.createdAt)], "orderBy") }),
          db.query.products.findMany({ limit: 8, orderBy: /* @__PURE__ */ __name((p, { desc: desc7 }) => [desc7(p.soldCount)], "orderBy") })
        ]);
        const homeData = { banners: banners2, categories: categories2, newProducts, popularProducts };
        await db.insert(systemCache).values({
          key: "home_bulk",
          data: JSON.stringify(homeData),
          updatedAt: /* @__PURE__ */ new Date()
        }).onConflictDoUpdate({
          target: systemCache.key,
          set: { data: JSON.stringify(homeData), updatedAt: /* @__PURE__ */ new Date() }
        });
        return c.json({ success: true, message: "Cache updated successfully" });
      } catch (error) {
        console.error("Cache Refresh Error:", error);
        return c.json({ error: "Failed to refresh cache" }, 500);
      }
    });
    systemRouter.get("/cache-status", async (c) => {
      const db = c.get("db");
      const cache = await db.select().from(systemCache);
      return c.json(cache);
    });
  }
});

// api/routers/popup.ts
var popupRouter;
var init_popup = __esm({
  "api/routers/popup.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_dist();
    init_drizzle_orm();
    init_schema();
    popupRouter = new Hono2();
    popupRouter.get("/", async (c) => {
      try {
        const db = c.get("db");
        const [settings] = await db.select().from(popupSettings).where(eq(popupSettings.id, 1));
        if (!settings) {
          return c.json({
            id: 1,
            title: "Special Offer! \u{1F389}",
            description: "Get Free Shipping on all orders over \u09F35000. Limited time offer!",
            buttonText: "Claim Offer Now",
            link: "/products",
            imageUrl: "",
            isActive: 1
          });
        }
        return c.json(settings);
      } catch (error) {
        console.error("Fetch popup settings error:", error.message);
        return c.json({ error: "FetchError", message: error.message }, 500);
      }
    });
    popupRouter.put("/", async (c) => {
      try {
        const db = c.get("db");
        const body = await c.req.json().catch(() => null);
        if (!body) throw new Error("VAL: Request body is required.");
        const [existing] = await db.select().from(popupSettings).where(eq(popupSettings.id, 1));
        const values = {
          title: body.title,
          description: body.description,
          buttonText: body.buttonText,
          link: body.link,
          imageUrl: body.imageUrl,
          isActive: body.isActive ? 1 : 0,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        if (existing) {
          await db.update(popupSettings).set(values).where(eq(popupSettings.id, 1));
        } else {
          await db.insert(popupSettings).values({ id: 1, ...values });
        }
        return c.json({ message: "Popup settings updated successfully" });
      } catch (error) {
        console.error("Update popup settings error:", error.message);
        return c.json({ error: "UpdateError", message: error.message }, 500);
      }
    });
  }
});

// api/routers/newsletter.ts
var newsletterRouter;
var init_newsletter = __esm({
  "api/routers/newsletter.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_dist();
    init_drizzle_orm();
    init_schema();
    newsletterRouter = new Hono2();
    newsletterRouter.post("/subscribe", async (c) => {
      try {
        const db = c.get("db");
        const body = await c.req.json().catch(() => null);
        if (!body?.email) throw new Error("VAL: Email is required.");
        const email = body.email.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          throw new Error("VAL: Please provide a valid email address.");
        }
        const [existing] = await db.select().from(newsletterLeads).where(eq(newsletterLeads.email, email));
        if (existing) {
          if (existing.isActive === 1) {
            return c.json({ message: "You're already subscribed!" });
          }
          await db.update(newsletterLeads).set({ isActive: 1, subscribedAt: (/* @__PURE__ */ new Date()).toISOString(), unsubscribedAt: null }).where(eq(newsletterLeads.id, existing.id));
          return c.json({ message: "Welcome back! You've been re-subscribed." });
        }
        const id = crypto.randomUUID();
        await db.insert(newsletterLeads).values({
          id,
          email,
          source: body.source || "footer",
          isActive: 1,
          subscribedAt: (/* @__PURE__ */ new Date()).toISOString()
        });
        return c.json({ message: "Successfully subscribed! \u{1F389}" });
      } catch (error) {
        console.error("Newsletter subscribe error:", error.message);
        if (error.message.startsWith("VAL:")) throw error;
        return c.json({ error: "SubscribeError", message: error.message }, 500);
      }
    });
    newsletterRouter.get("/", async (c) => {
      try {
        const db = c.get("db");
        const leads = await db.select().from(newsletterLeads).orderBy(desc(newsletterLeads.subscribedAt));
        const [totalResult] = await db.select({ value: count() }).from(newsletterLeads);
        const [activeResult] = await db.select({ value: count() }).from(newsletterLeads).where(eq(newsletterLeads.isActive, 1));
        return c.json({
          items: leads,
          total: totalResult?.value || 0,
          activeCount: activeResult?.value || 0
        });
      } catch (error) {
        console.error("Fetch newsletter leads error:", error.message);
        return c.json({ error: "FetchError", message: error.message }, 500);
      }
    });
    newsletterRouter.delete("/:id", async (c) => {
      try {
        const db = c.get("db");
        const id = c.req.param("id");
        await db.delete(newsletterLeads).where(eq(newsletterLeads.id, id));
        return c.json({ message: "Lead deleted." });
      } catch (error) {
        console.error("Delete newsletter lead error:", error.message);
        return c.json({ error: "DeleteError", message: error.message }, 500);
      }
    });
    newsletterRouter.patch("/:id/toggle", async (c) => {
      try {
        const db = c.get("db");
        const id = c.req.param("id");
        const [lead] = await db.select().from(newsletterLeads).where(eq(newsletterLeads.id, id));
        if (!lead) throw new Error("Lead not found");
        const newStatus = lead.isActive === 1 ? 0 : 1;
        await db.update(newsletterLeads).set({
          isActive: newStatus,
          ...newStatus === 0 ? { unsubscribedAt: (/* @__PURE__ */ new Date()).toISOString() } : { unsubscribedAt: null }
        }).where(eq(newsletterLeads.id, id));
        return c.json({ message: `Lead ${newStatus === 1 ? "activated" : "deactivated"}.` });
      } catch (error) {
        console.error("Toggle newsletter lead error:", error.message);
        return c.json({ error: "ToggleError", message: error.message }, 500);
      }
    });
  }
});

// api/app.ts
var app, dbClient, dbInstance, v1, onRequest;
var init_app = __esm({
  "api/app.ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_dist();
    init_cloudflare_pages();
    init_cors();
    init_logger();
    init_libsql();
    init_web2();
    init_schema();
    init_auth();
    init_users2();
    init_products2();
    init_categories2();
    init_banners2();
    init_orders2();
    init_addresses2();
    init_reviews2();
    init_returns2();
    init_settings();
    init_coupons2();
    init_dashboard();
    init_wallet2();
    init_notifications2();
    init_bulk();
    init_system();
    init_popup();
    init_newsletter();
    app = new Hono2();
    dbClient = null;
    dbInstance = null;
    app.use("*", cors());
    app.on(["GET", "HEAD"], ["/api/health", "/api/v1/health"], (c) => {
      return c.json({ status: "ok", version: "v1.mod", time: (/* @__PURE__ */ new Date()).toISOString() });
    });
    app.use("*", logger());
    app.use("*", async (c, next) => {
      if (c.req.path === "/api/health" || c.req.path === "/api/v1/health") {
        return await next();
      }
      const url = c.env.TURSO_URL;
      const authToken = c.env.TURSO_AUTH_TOKEN;
      if (!url || !authToken) {
        console.error("TURSO_URL or TURSO_AUTH_TOKEN not found in environment");
        return await next();
      }
      try {
        if (!dbClient) {
          dbClient = createClient({ url, authToken });
          dbInstance = drizzle(dbClient, { schema: schema_exports });
        }
        c.set("db", dbInstance);
        await next();
      } catch (error) {
        console.error("DB Initialization Error:", error);
        await next();
      }
    });
    app.onError((err, c) => {
      console.error("API Error:", err);
      if (err.message.startsWith("VAL:")) {
        return c.json({
          error: "ValidationError",
          message: err.message.replace("VAL:", "").trim(),
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          path: c.req.path
        }, 422);
      }
      if (err.message.includes("not found")) {
        return c.json({
          error: "NotFound",
          message: err.message,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          path: c.req.path
        }, 404);
      }
      return c.json({
        error: "InternalServerError",
        message: "An unexpected error occurred.",
        details: c.env.NODE_ENV === "development" ? err.message : void 0,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        path: c.req.path
      }, 500);
    });
    v1 = new Hono2();
    v1.use("*", async (c, next) => {
      const method = c.req.method;
      if (method === "GET") return await next();
      const path = c.req.path;
      const publicPaths = [
        "/api/v1/auth/",
        "/api/v1/orders",
        "/api/v1/reviews",
        "/api/v1/returns",
        "/api/v1/addresses",
        "/api/v1/users/",
        "/api/v1/coupons/validate",
        "/api/v1/notifications",
        "/api/v1/newsletter/subscribe",
        "/api/v1/products/interactions"
      ];
      const isPublic = publicPaths.some((p) => path.startsWith(p));
      if (isPublic) return await next();
      const authHeader = c.req.header("Authorization");
      const apiKey = c.env.ADMIN_API_KEY;
      if (!apiKey || authHeader !== `Bearer ${apiKey}`) {
        return c.json({
          error: "Unauthorized",
          message: "Invalid or missing API key"
        }, 401);
      }
      await next();
    });
    v1.route("/", systemRouter);
    v1.route("/auth", authRouter);
    v1.route("/users", usersRouter);
    v1.route("/products", productsRouter);
    v1.route("/categories", categoriesRouter);
    v1.route("/banners", bannersRouter);
    v1.route("/orders", ordersRouter);
    v1.route("/addresses", addressesRouter);
    v1.route("/reviews", reviewsRouter);
    v1.route("/returns", returnsRouter);
    v1.route("/settings", settingsRouter);
    v1.route("/coupons", couponsRouter);
    v1.route("/dashboard", dashboardRouter);
    v1.route("/wallet", walletRouter);
    v1.route("/notifications", notificationsRouter);
    v1.route("/bulk", bulkRouter);
    v1.route("/popup", popupRouter);
    v1.route("/newsletter", newsletterRouter);
    v1.route("/system", systemRouter);
    app.route("/api/v1", v1);
    onRequest = handle(app);
  }
});

// api/[[route]].ts
var init_route = __esm({
  "api/[[route]].ts"() {
    "use strict";
    init_functionsRoutes_0_6398490784585695();
    init_app();
  }
});

// product/[[slug]].ts
var onRequest2;
var init_slug = __esm({
  "product/[[slug]].ts"() {
    init_functionsRoutes_0_6398490784585695();
    onRequest2 = /* @__PURE__ */ __name(async (context) => {
      const { request, env, params } = context;
      const url = new URL(request.url);
      const slug = params.slug;
      if (!env.TURSO_URL || !slug) {
        return context.next();
      }
      try {
        const apiBase = `${url.origin}/api/v1`;
        const res = await fetch(`${apiBase}/products`);
        if (!res.ok) return context.next();
        const data = await res.json();
        const product = data.items?.find((p) => p.slug === slug);
        if (!product) {
          return context.next();
        }
        const response = await context.next();
        if (response.status !== 200) return response;
        const html = await response.text();
        let images = [];
        try {
          images = JSON.parse(product.images || "[]");
        } catch (e) {
          images = [];
        }
        const imageUrl = images[0] || "";
        const metaTags = `
      <title>${product.title} | PlayPen House</title>
      <meta name="description" content="${product.brand || "Premium Baby PlayPen"}">
      <meta property="og:title" content="${product.title}">
      <meta property="og:description" content="Get the best ${product.title} for your baby at PlayPen House.">
      <meta property="og:image" content="${imageUrl}">
      <meta property="og:type" content="product">
      <meta property="og:url" content="${request.url}">
      <meta name="twitter:card" content="summary_large_image">
    `;
        const updatedHtml = html.replace("<head>", `<head>${metaTags}`);
        return new Response(updatedHtml, {
          headers: { "Content-Type": "text/html" }
        });
      } catch (error) {
        console.error("SEO Injection Error:", error);
        return context.next();
      }
    }, "onRequest");
  }
});

// ../.wrangler/tmp/pages-eVPckr/functionsRoutes-0.6398490784585695.mjs
var routes;
var init_functionsRoutes_0_6398490784585695 = __esm({
  "../.wrangler/tmp/pages-eVPckr/functionsRoutes-0.6398490784585695.mjs"() {
    init_app();
    init_route();
    init_slug();
    routes = [
      {
        routePath: "/api/app",
        mountPath: "/api",
        method: "",
        middlewares: [],
        modules: [onRequest]
      },
      {
        routePath: "/api/:route*",
        mountPath: "/api",
        method: "",
        middlewares: [],
        modules: [onRequest]
      },
      {
        routePath: "/product/:slug*",
        mountPath: "/product",
        method: "",
        middlewares: [],
        modules: [onRequest2]
      }
    ];
  }
});

// ../.wrangler/tmp/bundle-ghLXeT/middleware-loader.entry.ts
init_functionsRoutes_0_6398490784585695();

// ../.wrangler/tmp/bundle-ghLXeT/middleware-insertion-facade.js
init_functionsRoutes_0_6398490784585695();

// ../node_modules/wrangler/templates/pages-template-worker.ts
init_functionsRoutes_0_6398490784585695();

// ../node_modules/path-to-regexp/dist.es2015/index.js
init_functionsRoutes_0_6398490784585695();
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count2 = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count2--;
          if (count2 === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count2++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count2)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse2(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index2 = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index2, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse2, "parse");
function match2(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match2, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode4 = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index2 = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode4(value, key);
        });
      } else {
        params[key.name] = decode4(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index: index2, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index2 = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index2++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse2(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode2 = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode2(token));
    } else {
      var prefix = escapeString(encode2(token.prefix));
      var suffix = escapeString(encode2(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match2(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match2(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match2(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match2(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");

// ../node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_functionsRoutes_0_6398490784585695();
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_functionsRoutes_0_6398490784585695();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// ../.wrangler/tmp/bundle-ghLXeT/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;

// ../node_modules/wrangler/templates/middleware/common.ts
init_functionsRoutes_0_6398490784585695();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// ../.wrangler/tmp/bundle-ghLXeT/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=functionsWorker-0.6076071657299976.mjs.map
