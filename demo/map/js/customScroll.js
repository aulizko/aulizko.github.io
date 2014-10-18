(function () {

    var $ = ipoevents.jQuery;

	/**
	 * Custom scroll implementation (used for events filter)
	 */
    window.CustomScroll = {
        /* DOM references */
        scroll : null,
        scrollButtonMiddle : null,
        scrollButton : null,
        scrollingArea : null,
        scrollableContent : null,
        scrollBody : null,

        /* CONSTANTS */
        DROP_DOWN_MENU_HEIGHT : 400,


        /* variables used to show scroll */
        scrollButtonHeight : null,
        initialOffset : null,
        scrollHeight : null,
        /* unchangeable after page load variables */
        DEFAULT_SCROLLING_AREA_HEIGHT : 380,
        CONTENT_HEIGHT : null,
        SCROLL_STEP : null,



        initializeDOMReferences : function () {
            this.scrollButton = $('.scrollButton');
            this.scrollButtonMiddle = $('.scrollButtonMiddle');
            this.scroll = $('.subMenuScroll');
            this.scrollingArea = $('.scrollingArea');
            this.scrollableContent = $('.scrollAbleContent');
            this.scrollBody = $('.scrollBody');
        },

        calculateConstants : function () {
        },

        calculateVariables : function () {
            this.recalculateChangeableVariables();
            this.initialOffset = this.scrollButton.offset().top;
            this.CONTENT_HEIGHT = this.scrollingArea.height() - 40;
            this.SCROLL_STEP = parseFloat(CustomScroll.scrollableContent.css('lineHeight')) || 14;
        },

        recalculateChangeableVariables : function () {
            this.scrollButtonHeight = this.scrollButton.height();
            this.scrollHeight = this.scrollBody.height() - this.scrollButtonHeight + 4;
        },

        moveScrollButton : function (e) {
            var y = e.pageY - CustomScroll.initialOffset;
            if (y <= 0) {
                y = 0;
            } else if (y > CustomScroll.scrollHeight) {
                y = CustomScroll.scrollHeight;
            }
            CustomScroll.scrollButton.css('top', y);
            CustomScroll.scrollDownContent(y / CustomScroll.scrollButtonHeight);

            if (e.preventDefault) { e.preventDefault(); }
            return false;
        },

        mapContentHeightToTheScroll : function() {
            if (this.CONTENT_HEIGHT < this.DEFAULT_SCROLLING_AREA_HEIGHT) {
                this.scroll.hide();
                this.scrollableContent.css('height', 'auto');
            } else {
                this.scrollableContent.css('height', this.DEFAULT_SCROLLING_AREA_HEIGHT);
                this.scroll.show();
                // map height of the visible content to the height of the scroll button
                var newScrollButtonHeight = Math.round((this.DEFAULT_SCROLLING_AREA_HEIGHT / this.CONTENT_HEIGHT) * (this.scrollBody.height() + 4)),
                    oldScrollButtonHeight = parseFloat(this.scrollButtonMiddle.height());

                this.scrollButtonMiddle.height(newScrollButtonHeight);

                var oldValue = parseFloat(this.scrollButton.css('top')),
                    scrollHeightTotal = this.scrollBody.height() + 4,
                    newValue;

                if (newScrollButtonHeight > oldScrollButtonHeight) {
                    newValue = Math.round(oldValue * (scrollHeightTotal - newScrollButtonHeight) / (scrollHeightTotal - oldScrollButtonHeight));
                } else {
                    newValue = Math.round(oldValue * (newScrollButtonHeight) / (oldScrollButtonHeight));
                }

                this.scrollButton.css('top', newValue); 
            }
        },

        bindEventListeners : function () {
            this.scrollButton.mousedown(function () {
                CustomScroll.blockTextSelectionOnIe();
                Utilites.body.mousemove(CustomScroll.moveScrollButton).mouseup(function () {
                    Utilites.body.unbind('mousemove', CustomScroll.moveScrollButton);
                    CustomScroll.unBlockTextSelectionOnIe();
                });
                return false;
            });
            this.scrollButton.click(this.blockClickOnTheScrollButton);
            this.scrollBody.click(this.handleClickToTheScrollBody);
            $('.subMenuFieldTable').bind('DOMMouseScroll mousewheel', this.handleScrollEvent);
        },

        scrollDownContent : function (percent) {
            this.scrollableContent.scrollTo(Math.round(percent * this.CONTENT_HEIGHT));
        },

        handleClickToTheScrollBody : function (e) {
            if (e.pageY - CustomScroll.initialOffset) {}

            var y = e.pageY - CustomScroll.initialOffset;
            if (y <= 0 || y > CustomScroll.scrollHeight + CustomScroll.scrollButtonHeight) { return; }

            var scrollTop = parseFloat(CustomScroll.scrollButton.css('top'));
            if (y < scrollTop) { // users clicks upper than scrollbutton
                CustomScroll.pageUp();
            } else if (y > scrollTop + CustomScroll.scrollButtonHeight) { // user clicks downer than scroll button

                CustomScroll.pageDown();
            }
        },

        blockClickOnTheScrollButton : function (e) {
            if (e.preventDefault) { e.preventDefault(); }
            if (e.stopPropagation) { e.stopPropagation(); }
            e.cancelBubble = true;

            return false;
        },

        // scroll handle alghorithm taken from http://adomas.org/javascript-mouse-wheel/
        handleScrollEvent : function (e) {
            var delta;
            if (e.wheelDelta) { /* IE/Opera. */
                delta = -e.wheelDelta / 120;
                // In Opera 9, delta differs in sign as compared to IE.
                if ($.browser.opera && Math.floor($.browser.version - 0) == 9) {
                    delta = -delta;
                }

            } else if (e.detail) { /** Mozilla case. */
                /**
                 * In Mozilla, sign of delta is different than in IE.
                 * Also, delta is multiple of 3.
                 */
                delta = e.detail/3;
            }

            var oldTop = parseFloat(CustomScroll.scrollButton.css('top'));

            delta = delta * CustomScroll.SCROLL_STEP;
            var newTop = oldTop + delta;

            if (newTop <= 0) {
                newTop = 0;
            } else if (newTop >= CustomScroll.scrollHeight) {
                newTop = CustomScroll.scrollHeight;
            } 

            var percent = parseFloat(newTop) / parseFloat(CustomScroll.scrollHeight);

            CustomScroll.scrollButton.css('top', newTop);
            CustomScroll.scrollDownContent(percent);
            
            if (e.preventDefault) {
                e.preventDefault();
            }
            return false;
        },

        blockTextSelectionOnIe : $.browser.msie ? function () { this.scrollableContent[0].onselectstart = function () { return false; } } : function () {},
        unBlockTextSelectionOnIe : $.browser.msie ? function () { this.scrollableContent[0].onselectstart = function () {return true; } } : function () {},

        pageUp : function () {
            var scrollTop = parseFloat(this.scrollButton.css('top')),
                height = this.scrollButtonHeight;

            if (height > scrollTop) {
                this.scrollButton.css('top', 0);
                this.scrollDownContent(0);
            } else {
                var newHeight = scrollTop - height;
                this.scrollButton.css('top', newHeight);
                this.scrollDownContent(newHeight / this.scrollHeight);
            }
        },

        pageDown : function () {
            var scrollTop = parseFloat(this.scrollButton.css('top')),
                height = this.scrollButtonHeight;

            if (scrollTop + 2 * height > this.scrollHeight) {
                this.scrollButton.css('top', this.scrollHeight);
                this.scrollDownContent(100);
            } else {
                var newHeight = scrollTop + height;
                this.scrollButton.css('top', newHeight);
                this.scrollDownContent(newHeight / this.scrollHeight);
            }
        },

        initialize : function () {
            this.initializeDOMReferences();
            if (!this.scrollableContent.length) { return; }
            this.scrollableContent.scrollTo(0);

            this.calculateConstants();

            this.calculateVariables();
            this.mapContentHeightToTheScroll();
            this.recalculateChangeableVariables();
            this.bindEventListeners();
        }
    };

})();
