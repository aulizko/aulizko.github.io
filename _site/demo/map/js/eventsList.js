(function () {

    var $ = ipoevents.jQuery;
    
    /**
     * Scrollable events list implementation
     */
    window.EventsList = {
        ITEM_WIDTH : 183 + (($.browser.msie && ($.browser.version == 6 || $.browser.version == 7)) ? 21 : 0),
        TIMEOUT : 5 * 1000 /* 5 sec */,
        RELEASE_TIMEOUT : 20 * 1000 /* 20 sec */,
        LENGTH : 0,
        INDEX : 1,
        TIMER : null,
        RELEASE_TIMER : null,

        DEFAULT_EVENT_HTML : '<li>\
                                <div class="eventsListFlag"></div>\
                                <div class="eventsListTitle"></div>\
                                <p>Sorry, there are no more events now</p>\
                                <br/>\
                                <a href="">All Events</a>\
                              </li>',
        list : null,
        leftButton : null,
        rightButton : null,
        scrollLeft : function () {
            if (this.INDEX != 1) {
                this.list.animate({
                    'marginLeft': (-1 * (--this.INDEX + 1) * this.ITEM_WIDTH) + 'px'
                }, 'fast');
            } else {
//                this.scrollToEnd();
            }

            this.updateButtonsState();
        },
        scrollRight : function () {
            if (this.INDEX != this.LENGTH) {
                this.list.animate({
                    'marginLeft': (-1 * (++this.INDEX - 1) * this.ITEM_WIDTH) + 'px'
                }, 'fast');
            } else {
//                this.scrollToBeginning();
            }

            this.updateButtonsState();
        },
        scrollToBeginning : function () {
            this.list.animate({
                'marginLeft': '0px'
            }, 'fast');
            this.INDEX = 1;
            this.updateButtonsState();
        },
        scrollToEnd : function () {
            this.list.animate({
                'marginLeft': (-1 * (this.LENGTH) * this.ITEM_WIDTH) + 'px'
            }, 'fast');
            this.INDEX = this.LENGTH;
            this.updateButtonsState();
        },
        initializeDOMReferences : function () {
            this.list = $('.eventsList ul');
            this.leftButton = $('.eventsListLeftArrow');
            this.rightButton = $('.eventsListRightArrow');
        },
        bindEventListeners : function () {
            this.leftButton.click(function () {
                EventsList.pause();
                EventsList.scrollLeft();
            });
            this.rightButton.click(function () {
                EventsList.pause();
                EventsList.scrollRight();
            });

            this.leftButton.mousedown(function () {
                this.className = 'eventsListLeftArrowPushed';
                return true;
            });

            this.leftButton.mouseup(function () {
                this.className = (EventsList.INDEX == 1) ? 'eventsListLeftArrowNoMore' : 'eventsListLeftArrow';
                return true;
            });

            this.rightButton.mousedown(function () {
                this.className = 'eventsListRightArrowPushed';
                return true;
            });

            this.rightButton.mouseup(function () {
                this.className = (EventsList.INDEX == EventsList.LENGTH) ? 'eventsListRightArrowNoMore' : 'eventsListRightArrow';
                return true;
            });
        },

        activateLeftButton : function () {
            this.leftButton.attr('className', 'eventsListLeftArrow');
        },

        disableLeftButton : function () {
            this.leftButton.attr('className','eventsListLeftArrowNoMore');
        },

        activateRightButton : function () {
            this.rightButton.attr('className','eventsListRightArrow');
        },

        disableRightButton : function () {
            this.rightButton.attr('className','eventsListRightArrowNoMore');
        },

        updateButtonsState : function () {
            if (this.INDEX != this.LENGTH) {
                this.activateRightButton();
            } else {
                this.disableRightButton();
            }
            if (this.INDEX != 1) {
                this.activateLeftButton();
            } else {
                this.disableLeftButton();
            }
        },

        startAutomation : function () {
            this.TIMER = setInterval(this.scrollRight.bind(this), this.TIMEOUT);
        },
        stopAnimation : function () {
            clearInterval(this.TIMER);
        },

        pause : function () {
            if (this.RELEASE_TIMER != null) {
                clearTimeout(this.RELEASE_TIMER);
                this.RELEASE_TIMER = null;
            }
            this.RELEASE_TIMER = setTimeout(this.release.bind(this), this.RELEASE_TIMEOUT);
            this.stopAnimation();
        },

        release : function () {
            clearTimeout(this.RELEASE_TIMER);
            this.RELEASE_TIMER = null;

            this.startAutomation();
        },

        prepareContent : function () {
            var html = '',
                dates = [],
                events = Utilites.filter(regionalMapJson.events, function (event) {
                    if (event.timePlace == 'future' || event.timePlace == 'present') {
                        dates.push(Utilites.Date.parseDate(event.startDate, BriefWindow.DATE_FORMAT));
                        return true;
                    }
                    return false;
                }, this);

            dates.sort();

            var tempEvents = [];

            Utilites.each(dates, function (date) {
                var matchedEvents = Utilites.filter(events, function (event) {
                    return Utilites.Date.parseDate(event.startDate, BriefWindow.DATE_FORMAT).toGMTString() == date.toGMTString();
                }, this);

                var id = Utilites.getKeysFromObject(matchedEvents)[0];
                if (id && events[id]) {
                    tempEvents.push(Utilites.merge(events[id], { id: id }));
                    delete events[id];
                }


            }, this);


            Utilites.each(tempEvents, function (event) {
                
                html += '<li>' + BriefWindow.generateFlagHTMLByEvent(event) + '<div class="eventsListTitle">' +
                        event.startDate + ' - ' + event.endDate + ', ' + event.city + '</div><p><a href="/events/' + event.id + '">' +
                        event.title + '</a></p><br/><a href="/events">All Events</a></li>';
            }, this);

            return html || this.DEFAULT_EVENT_HTML;
        },
        
        initialize : function () {
            this.initializeDOMReferences();
            this.bindEventListeners();

            this.list[0].innerHTML = this.prepareContent();
            
            this.LENGTH = $('.eventsList ul li').length;

            this.updateButtonsState();

            this.leftButton.removeClass(Map.HIDDEN_CSS_CLASS);
            this.rightButton.removeClass(Map.HIDDEN_CSS_CLASS);

            if (this.LENGTH != 1) {
                this.startAutomation();
            }
        }

    };

})();