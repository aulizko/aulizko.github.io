(function () {
    /**
     * Few function to make live easier a while:
     * @module Native
     */

    /**
     * Bring the power of the memoization to this dark creepy place
     * To see, what the memoization itself is, look here: http://en.wikipedia.org/wiki/Memoization
     * Current realization thankfully taken from Keith Gaughan http://talideon.com/weblog/2005/07/javascript-memoization.cfm
     * @method memoize
     */
    Function.prototype.memoize = function () {
        var pad  = {};
        var self = this;
        var obj  = arguments.length > 0 ? arguments[i] : null;

        var memoizedFn = function() {
            // Copy the arguments object into an array: allows it to be used as
            // a cache key.
            var args = [];
            for (var i = 0; i < arguments.length; i++) {
                args[i] = arguments[i];
            }

            // Evaluate the memoized function if it hasn't been evaluated with
            // these arguments before.
            if (!(args in pad)) {
                pad[args] = self.apply(obj, arguments);
            }

            return pad[args];
        };

        memoizedFn.unmemoize = function() {
            return self;
        };

        return memoizedFn;
    };

    /**
     * @method bind
     * Bind context of the function to the provided
     * This method is "inspired" by MooTools
     */
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (context) {
            if (typeof context === 'undefined') { return this; }

            var __method = this;
            return function() {
              return __method.apply(context, arguments);
            };
        };
    }
})();