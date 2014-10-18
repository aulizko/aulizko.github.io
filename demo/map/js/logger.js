(function () {

    var $ = ipoevents.jQuery;

    window.Logger = {
        HIDDEN_CSS_CLASS : 'hidden',
        /**
         * Used to cache dom references to the message window
         * @property messageWindow
         */
        messageWindow : null,

        /* welcome message to show first-time logined user */
        WELCOME_MESSAGE : 'You can use the interactive map to access the info. \
            Move the cursor through the map and find breaf info in this window. \
            Click on a region to see more.',

        shouldWeShowMessage : false,

        /**
         * Shows pop-up message
         * @method showMessage
         * @param message {String} Message to show (can be html)
         * @param priorityLevel {String} should be "info", "warn", "error". Unused now, reserved for future use.
         * @param delay {Number} Delay in milliseconds to show popup window after event
         */
        showMessage : function (message, priorityLevel, delay) {
            var contentWrapper = this.messageWindow.find('.mapMessageWindowContent'),
                contentAdditionalWrapper = this.messageWindow.find('.mapMessageWindowText');
            function showMessage (message) {
                contentWrapper.html(message);
                contentAdditionalWrapper.html(message);
                Logger.messageWindow.removeClass(Logger.HIDDEN_CSS_CLASS);
            };
            if (delay) {
                setTimeout(function () { showMessage(message); }, delay);
            } else {
                showMessage(message);
            }
        },
        /**
         * Hide message window (this method is binded to the first click on the map and
         * to the close icon at upper right corner of the message window.
         * @method hideMessage
         */
        hideMessage : function () {
            this.messageWindow.addClass(this.HIDDEN_CSS_CLASS);
        },

        readFromCookie : function () {
            this.shouldWeShowMessage = !Utilites.Cookie.get('welcomeMessageHasBeenShown');
        },
        initializeDOMReferences : function () {
            this.messageWindow = $('#messageWindow');
        },
        bindEventListeners : function () {
            var boundedHideMessageFunction = this.hideMessage.bind(this);
            this.messageWindow.click(function (e) {
                if (Logger.shouldWeShowMessage) {
                    Utilites.Cookie.set('welcomeMessageHasBeenShown', true, {
                        expires : Utilites.generateFutureYearDate().toGMTString()
                    });
                }
                boundedHideMessageFunction();
                if (e.preventDefault) { e.preventDefault(); }
                return false;
            });
        },

        showWelcomeMessage : function () {
            if (this.shouldWeShowMessage) {
                this.showMessage(this.WELCOME_MESSAGE);
            }
        },

        initialize : function () {
            this.initializeDOMReferences();
            this.bindEventListeners();
            this.readFromCookie();
        }
    };

})();