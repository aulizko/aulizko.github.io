(function () {

    var $ = ipoevents.jQuery;
    /**
     * Usefull modules
     */
    window.Utilites = {
        Native : Array.prototype,
        OBJECT : 'object',
        ARRAY_TOSTRING : '[object Array]',
        FUNCTION_TOSTRING : '[object Function]',
        OP : Object.prototype
    };

    Utilites.cycle = function (condition, step, callback) {
        function iterate () {
            step();
            if (condition()) {
                setTimeout(iterate, 0);
            } else {
                setTimeout(callback, 0);
            }
        };

        setTimeout(iterate, 0);
    };

    /**
     * Returns date a year toward from now
     * @method generateFutureYearDate
     * @return {Date}
     */
    Utilites.generateFutureYearDate = function () {
        var now = new Date();

        return new Date(now.getFullYear() + 1, now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
    };

    Utilites.getKeysFromObject = function (o) {
        var a=[], i;
        for (i in o) {
            if (o.hasOwnProperty(i)) {
                a.push(i);
            }
        }

        return a;
    };

    Utilites.getRegionIdHref = function (input) {
        return input.split('/').pop();
    };

    // Utilites.getRegionIdHref.memoize(); // todo: bench

    /**
     * Utility which convert url-like params string to the dictionary
     * For example, input equal region=35&event=18 should produce { region : 35, event : 18 } literal object
     * @method getObjectFromHashTag
     * @param input {String} url-like param string to parse
     * @return {Object} hash object
     */
    Utilites.getObjectFromHashTag = function(input) {
        var indexOfSharp = input.indexOf('#');
        if (indexOfSharp == -1) { return null; }

        var hash = decodeURIComponent(input.substr(indexOfSharp + 1));

        if (hash.length) {

            // split string into object pairs
            var pairs = hash.split('&');
            var output = {}, temp;

            for (var i = 0, length = pairs.length; i < length; i++) {
                temp = pairs[i].split('=');
                if (temp[0] && temp[1]) { output[temp[0]] = temp[1]; }
            }
            return output;
        }
        return null;
    };

    Utilites.indexOf = (Utilites.Native.indexOf) ?
        function (a, val, from) {
            return (from) ? a.indexOf(val, from) : a.indexOf(val);
        } :
        function(a, val, from) {
            var length = a.length;

            var whereFrom = Number(from) || 0;
            whereFrom = (whereFrom < 0)
                 ? Math.ceil(whereFrom)
                 : Math.floor(whereFrom);
            if (whereFrom < 0)
              whereFrom += len;


            for (; whereFrom < length; whereFrom++) {
              if (whereFrom in this &&
                  this[whereFrom] === val)
                return whereFrom;
            }
            return -1;
        };

    /**
     * Executes the supplied function on each item in the array.
     * @method arrayEach
     * @static
     * @param a {Array} input array
     * @param f {Function} function which will be executed on each item
     * @param o {Object} this context for supplied function (opt)
     * @return {AP} the AP instance
     */
    Utilites.arrayEach = (Utilites.Native.forEach) ?
        function (a, f, o) {
            Utilites.Native.forEach.call(a, f, o || Utilites);
            return Utilites;
        } :
        function (a, f, o) {
            var l = a.length, i;
            for (i = 0; i < l; i=i+1) {
                f.call(o || Utilites, a[i], i, a);
            }
            return Utilites;
        };
    /**
     * Executes a function on each item. The function
     * receives the value, the key, and the object
     * as paramters (in that order).
     * @method objectEach
     * @static
     * @param o the object to iterate
     * @param f {Function} the function to execute
     * @param c the execution context
     * @param proto {Boolean} include proto
     * @return {AP} the AP instance
     */
    Utilites.objectEach = function (o, f, c, proto) {
        var s = c || Utilites;

        for (var i in o) {
            if (proto || o.hasOwnProperty(i)) {
                f.call(s, o[i], i, o);
            }
        }
        return Utilites;
    };

    /**
     * Evaluates the input to determine if it is an array, array-like, or
     * something else.  This is used to handle the arguments collection
     * available within functions, and HTMLElement collections
     *
     * @method Array.test
     * @static
     *
     * todo current implementation (intenionally) will not implicitly
     * handle html elements that are array-like (forms, selects, etc).
     *
     * @return {int} a number indicating the results:
     * 0: Not an array or an array-like collection
     * 1: A real array.
     * 2: array-like collection.
     */
    Utilites.test = function(o) {
        var r = 0;
        if (Utilites.isObject(o, true)) {
            if (Utilites.isArray(o)) {
                r = 1;
            } else {
                try {

                    // indexed, but no tagName (element) or alert (window)
                    if ("length" in o &&
                        !("tagName" in o) &&
                        !("alert" in o)) {
                            r = 2;
                    }

                } catch(ex) {}
            }
        }
        return r;
    };

    Utilites.convertToArray = function(o, i, al) {
        var t = (al) ? 2 : Utilites.test(o);
        if (t) {
            return Utilites.Native.slice.call(o, i || 0);
        } else {
            return [o];
        }
    };

    /**
     * Iterate through object, array, array-like collection (currently only nodeList supported)
     * @method each
     * @param obj {Object} object to iterate through
     * @param fn {Function} Function which will be called on each object item
     * @param context {Object} optional. Context on which function-handler should be invocated. I recommend to omit it in favor to "Function.bind".
     */
    Utilites.each = function (obj, fn, context) {
        if (obj.each) { // say it object has each method implemented (like `map` data structure)
            if (context) {
                return obj.each.call(obj, fn, context);
            } else {
                return obj.each(fn);
            }
        }
        var t = Utilites.test(obj);

        switch (t) {
            case 1: // regular array
                return Utilites.arrayEach(obj, fn, context);
            case 2: // array-like collection
                return Utilites.arrayEach(Utilites.convertToArray(obj, 0, true), fn, context);
            default:
                return Utilites.objectEach(obj, fn, context);
        }
    };

    /**
     * Determines whether or not the provided object is of type object
     * or function
     * @method isObject
     * @static
     * @param o The object to test
     * @param failfn {boolean} fail if the input is a function
     * @return {boolean} true if o is an object
     */
    Utilites.isObject = function (o, failfn) {
        return (o && (typeof o === Utilites.OBJECT || (!failfn && Utilites.isFunction(o)))) || false;
    };

    /**
     * Determines whether or not the provided object is an array.
     * Testing typeof/instanceof/constructor of arrays across frame
     * boundaries isn't possible in Safari unless you have a reference
     * to the other frame to test against its Array prototype.  To
     * handle this case, we test well-known array properties instead.
     * properties.
     * @TODO can we kill this cross frame hack?
     * @method isArray
     * @static
     * @param o The object to test
     * @return {boolean} true if o is an array
     */
    Utilites.isArray = function (o) {
        return Utilites.OP.toString.apply(o) === Utilites.ARRAY_TOSTRING;
    };

    /**
     * Determines whether or not the provided object is a function
     * Note: Internet Explorer thinks certain functions are objects:
     *
     * var obj = document.createElement("object");
     * AP.Lang.isFunction(obj.getAttribute) // reports false in IE
     *
     * var input = document.createElement("input"); // append to body
     * AP.Lang.isFunction(input.focus) // reports false in IE
     *
     * You will have to implement additional tests if these functions
     * matter to you.
     *
     * @method isFunction
     * @static
     * @param o The object to test
     * @return {boolean} true if o is a function
     */
    Utilites.isFunction = function (o) {
        return Utilites.OP.toString.apply(o) === Utilites.FUNCTION_TOSTRING;
    };
    /**
     * Creates a new array with all elements that pass the test implemented by the provided function
     * @method arrayFilter
     * @param a {Array} array to work with
     * @param fn {Function} function that called once for each element. If func return true, than that element will be in output. Keep it boolean.
     * func will receive next params:<ul>
     * <li>value {Object} the value of the element.</li>
     * <li>index {Number} the index of the element.
     * <li>container {Array} the Array object being traversed</li>
     * </ul>
     * @param c {Object} Context object. (opt)
     */
    Utilites.arrayFilter = (Utilites.Native.filter) ?
        function (a, fn, c) {
            return a.filter(fn, c || Utilites);
        } :
        function (a, fn, c) {
            var result = [], i = a.length;
            while(i--) {
                if (i in a && fn.call(c || Utilites, a[i], i, a)) result.push(a[i]);
            }
            return result;
        };

    Utilites.getObjectFromHashTag.memoize();


    Utilites.hashFilter = function (hash, fn, context) {
        var result = {},
            value,
            key;

        for (key in hash) {
            value = hash[key];
            if (fn.call(context || window, value, key, hash)) {
                result[key] = value;
            }
        }

        return result;
    };


    Utilites.filter = function (obj, fn, context) {
        var t = Utilites.test(obj);

        switch (t) {
            case 1: // regular array
                return Utilites.arrayFilter(obj, fn, context);
            case 2: // array-like collection
                return Utilites.arrayFilter(Utilites.convertToArray(obj, 0, true), fn, context);
            default:
                return Utilites.hashFilter(obj, fn, context);
        }
    };

    /**
     * Determines whether or not the provided object is undefined
     * @method isUndefined
     * @static
     * @param o The object to test
     * @return {boolean} true if o is undefined
     */
    Utilites.isUndefined = function (o) {
        return typeof o === 'undefined';
    };

    /**
     * Determines whether or not the provided object is a string
     * @method isString
     * @static
     * @param o The object to test
     * @return {boolean} true if o is a string
     */
    Utilites.isString = function (o) {
        return typeof o === 'string';
    };

    Utilites.prefix = 'ipoevents';
    Utilites.index = 0;

    Utilites.generateUID = function () {
        return this.prefix + '-' + this.index++;
    };

    Utilites.capitalize = function (input) {
        return input.substr(0, 1).toUpperCase() + input.substr(1);
    };

    // Utilites.capitalize.memoize(); // todo: bench


    Utilites.isAscendOrElement = function (el, target) {
        if (el == target) {
            return true;
        }

        while (el && el.nodeName && el.nodeName !== 'BODY') {
            el = el.parentNode;
            if (el == target) {
                return true;
            }
        }
        return false;
    };

    Utilites.body = $('body');
    Utilites.handlers = {};


    Utilites.generateClickHandlerForEveryObjectButList = function (element, hideFunction) {
        var generatedUID = Utilites.generateUID();
        this.handlers[generatedUID] = function (/* Event */e) {
            var el = e.target;
            if (!Utilites.isAscendOrElement(el, element)) {
                // remove handler from the body
                Utilites.body.unbind('click', Utilites.handlers[generatedUID]);
                // hide appropriate object
                hideFunction();
            }
        };

        this.body.click(this.handlers[generatedUID]);
    };

    Utilites.extend = function (original, extended) {
        for (var key in (extended || {})) original[key] = extended[key];
        return original;
    };

    Utilites.merge = function () {
        var output = {};
        for (var i = 0, length = arguments.length; i < length; i++) {
            Utilites.extend(output, arguments[i]);
        }
        return output;
    };

})();