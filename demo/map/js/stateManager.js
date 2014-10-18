(function () {

    window.StateManager = {
        /**
         * Cookie name used to store current application state
         * @property COOKIE_NAME
         */
        COOKIE_NAME : 'regional-map-state',
        /**
         * Used to store application state hash and application change callbacks for each registered module
         * @property listeners
         * @private
         */
        listeners : {},
        /**
         * Read application state from cookie, and call each registered callback and pass appropriate state hash to it.
         * @method read
         */
        read : function () {
            var states = JSON.parse(Utilites.Cookie.get(this.COOKIE_NAME));
            Utilites.each(states, function (parameters, moduleName) {
                var module = this.listeners[moduleName];
                if (module) {
                    module.params = parameters;
                    module.callback(parameters);
                }
            }, this);
        },
        /**
         * Writes current regional map state as serialized object to the cookie for current domain
         * @method persist
         */
        persist : function () {
            var states = {};
            Utilites.each(this.listeners, function (listener, name) {
                states[name] = listener.params;
            }, this);
            Utilites.Cookie.set(this.COOKIE_NAME, JSON.stringify(states), {
                expires : Utilites.generateFutureYearDate().toGMTString()
            });
        },
        /**
         * Register listener
         * @method addListener
         * @param moduleName {String} name of the module (should be used to store current params on state manager).
         * Also that name should be used to define which cookie name to use.
         * @param defaultParameters {Object} list of the params which should be stored to cookie
         * @param callback {Function} function that should be called when state changed.
         * StateManager should pass state as object to that function.
         * @return {Function} callback function that allows to update and change
         */
        addListener : function (moduleName, defaultParameters, callback) {
            var module = this.listeners[moduleName] = {};
            module.params = defaultParameters;
            module.callback = callback;
            this.persist();

            return function (parameters) {
                // check if listener is not already stripped out
                if (!this.listeners[moduleName]) { return; }
                var oldParameters = module.params;
                Utilites.each(parameters, function (value, key) {
                    oldParameters[key] = value;
                }, this);
                this.persist();
            }.bind(this);
        },
        /**
         * Remove listener and all its callbacks
         * @method removeListener
         * @param moduleName
         */
        removeListener : function (moduleName) {
            this.listeners[moduleName] = null;
            delete this.listeners[moduleName];
        },

        initialize : function (listOfModulesToRegister) {}
    };

})();