if (typeof DEMO == "undefined" || !DEMO) {
    var DEMO = {};
}

DEMO.Lang = typeof DEMO.Lang != 'undefined' && DEMO.Lang ? DEMO.Lang : {
    isUndefined : function (o) {
        return typeof o === 'undefined';
    },
    isString : function (o) {
        return typeof o === 'string';
    }
};

DEMO.DOM = typeof DEMO.DOM != 'undefined' && DEMO.DOM ? DEMO.DOM : {
    get : function (el) {
        return (el && el.nodeType) ? el : document.getElementById(el);
    },
    
    addListener : function (el, type, fn) {
        if (DEMO.Lang.isString(el)) { el = this.get(el); }

        if (el.addEventListener) {
            el.addEventListener(type, fn, false);
        } else if (el.attachEvent) {
            el.attachEvent('on' + type, fn);
        } else {
            el['on' + type] = fn;
        }
    },
    
    removeListener : function (el, type, fn) {
        if (DEMO.Lang.isString(el)) { el = this.get(el); }

        if (el.removeEventListener){
            el.removeEventListener(type, fn, false);
        } else if (el.detachEvent) {
            el.detachEvent('on' + type, fn);
        } else {
            el['on' + type] = function () { return true; };
        }
    },
    
    purge : function (d) {
        var a = d.attributes, i, l, n;
        if (a) {
            l = a.length;
            for (i = 0; i < l; i += 1) {
                n = a[i].name;
                if (typeof d[n] === 'function') {
                    d[n] = null;
                }
            }
        }
        a = d.childNodes;
        if (a) {
            l = a.length;
            for (i = 0; i < l; i += 1) {
                DEMO.DOM.purge(d.childNodes[i]);
            }
        }
    },
    
    setInnerHTML : function (el, html) {
        if (!el || typeof html !== 'string') {
            return null;
        }

        // удаляем циклические ссылки, чтобы избежать утечек памяти в ie6
        (function (o) {

            var a = o.attributes, i, l, n, c;
            if (a) {
                l = a.length;
                for (i = 0; i < l; i += 1) {
                    n = a[i].name;
                    if (typeof o[n] === 'function') {
                        o[n] = null;
                    }
                }
            }

            a = o.childNodes;

            if (a) {
                l = a.length;
                for (i = 0; i < l; i += 1) {
                    c = o.childNodes[i];

                    // delete child nodes
                    arguments.callee(c);

                    // remove event handlers
                    DEMO.DOM.purge(c);
                }
            }

        })(el);

        // Удаляем все скрипты из HTML-строки и выставляем свойство innerHTML
        el.innerHTML = html.replace(/<script[^>]*>[\S\s]*?<\/script[^>]*>/ig, "");

        // Возвращаем ссылку на первый дочерний узел
        return el.firstChild;
    }
};