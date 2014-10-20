/**
 * Module that manipulates data on the regions brief info
 */
(function () {
    var $ = ipoevents.jQuery;

    window.BriefWindow = {
        ANIMATION_SPEED : 24,

        DEFAULT_NEWS_STRING : 'There is no news for that region for current period. Stay tuned!',

        DEFAULT_EVENTS_STRING : 'There is no events on that regions for now. Sorry. Stay tuned!',

        DATE_FORMAT : 'yyyy-mm-dd',

        FUTURE_TIME_COLOR : 'Yellow',

        PRESENT_TIME_COLOR : 'Red',

        PAST_TIME_COLOR : 'Grey',

        FLAG_CSS_CLASS : 'eventsListFlag',

        contentContainer : null,

        visibleMenu : null,

        eventsStreamMenuButton : null,

        currentCategory : 'Brief Info',

        animationHelperElement : null,

        currentSubject : null,

        data : null,

        categories : ['Brief Info', 'News', 'Events'],

        defaultMessage : 'Welcome to the Russia & CIS Regional Community of investors, advisors and businesses! Here you will find regional access to industry and regions’ knowledge, contacts and expertise.',

        dataLength : 0,

        hiddenMenu : null,

        hiddenMenuContent : null,

        toggleHiddenMenuVisibilityButton : null,

        isHiddenMenuShown : false,

        cachedContent : {},

        timeout : null,

        SHOW_REGION_INFO_TIMEOUT : 200,

        initializeDOMReference : function () {
            this.contentContainer = $('.eventsStreamContent');
            this.visibleMenu = $('.eventsStreamMenu');
            this.eventsStreamMenuButton = $('.eventsStreamMenuButton');
            this.animationHelperElement = $('#streamAnimationHelper');
            this.hiddenMenu = $('.eventsStreamMenuField');
            this.hiddenMenuContent = this.hiddenMenu.find('ul');
            this.toggleHiddenMenuVisibilityButton = $('#eventsStreamMenuButton');
        },

        bindEventListeners : function () {
            this.boundedClickOnTheMenuHandler = this.catchClickOnTheMenu.bind(this);
            this.visibleMenu.click(this.boundedClickOnTheMenuHandler);
            this.hiddenMenuContent.click(this.boundedClickOnTheMenuHandler);
            this.toggleHiddenMenuVisibilityButton.click(this.toggleHiddenMenuVisibility.bind(this));
        },

        initialize : function () {
            this.initializeDOMReference();
            this.bindEventListeners();

            this.prepareContentForEachSubject();

            this.showDefaultContent();
        },

        mapDataToTheDOM : function (data) {
            this.stopAnimation();

            this.placeDataOnTheDOM(data);

            this.startAnimation();
        },

        mapDataToTheDomBySubjectId : function (subjectId) {
            if (this.currentSubject && this.currentSubject === subjectId) { return; }
            if (this.cachedContent[subjectId]) {
                this.mapDataToTheDOM(this.cachedContent[subjectId]);
                this.currentSubject = subjectId;
            } else {
                this.showDefaultContent();
                this.currentSubject = subjectId;
            }
        },

        placeDataOnTheDOM : function (data) {
            var temp = '',
                currentCategoryData;

            if (!data || !(currentCategoryData = data[this.currentCategory])) {
                temp = this.defaultMessage;
            } else {
                temp = currentCategoryData;
            }

            this.dataLength = temp.length;
            this.contentContainer[0].innerHTML = temp;
        },

        generateMenuHTMLAndPlaceToDOM : function () {
            var menuHTML = '',
                hiddenMenuHTML = '';

            Utilites.each(this.categories, function (value, index) {
                if (index < 3) { menuHTML += this.generateHTMLListItemFromCategory(value); }
                else {
                    hiddenMenuHTML += this.generateHTMLListItemFromCategory(value);
                }
            }, this);

            this.visibleMenu.find('li').remove();
            this.visibleMenu.prepend(menuHTML);
            this.hiddenMenuContent[0].innerHTML = hiddenMenuHTML;
        },

        checkRelevanceOfTheData : function (regionId) {
            if (this.currentSubject && this.currentSubject !== regionId) { this.shutDown(); }
        },

        selectCategory : function (category) {
            this.currentCategory = category;

            this.generateMenuHTMLAndPlaceToDOM();

            this.stopAnimation();

            this.placeDataOnTheDOM();

            this.startAnimation();
        },

        catchClickOnTheMenu : function (e) {
            var el = $(e.target);
            if (el.is('a')) {
                var hashObject = Utilites.getObjectFromHashTag(el.attr('href'));
                if (hashObject && hashObject.briefWindowCategory) {
                    this.selectCategory(hashObject.briefWindowCategory);
                }
            }
        },

        generateHTMLListItemFromCategory : function (category) {
            var result = '';
            result += '<li>';
            if (category !== this.currentCategory) {
                result += '<a href="#briefWindowCategory=' + encodeURIComponent(category) + '">' + category + '</a>';
            } else {
                result += category;
            }
            result += '</li>';

            return result;
        },

        stopAnimation : function () {
            this.contentContainer.stop();
        },

        startAnimation : function () {
//            this.contentContainer.scrollTo('100%', { duration : this.dataLength * this.ANIMATION_SPEED, axis : 'y'});
        },

        showDefaultContent : function () {
            this.mapDataToTheDOM();
        },

        toggleHiddenMenuVisibility : function () {
            if (this.isHiddenMenuShown) {
                this.hideHiddenMenu();
                this.isHiddenMenuShown = false;
            } else {
                this.showHiddenMenu();
                this.isHiddenMenuShown = true;
            }
        },

        showHiddenMenu : function () {
            this.toggleHiddenMenuVisibilityButton.addClass(ObjectsFilter.ACTIVE_CSS_CLASS);
            this.hiddenMenu.removeClass(ObjectsFilter.HIDDEN_CSS_CLASS);
        },

        hideHiddenMenu : function () {
            this.toggleHiddenMenuVisibilityButton.removeClass(ObjectsFilter.ACTIVE_CSS_CLASS);
            this.hiddenMenu.addClass(ObjectsFilter.HIDDEN_CSS_CLASS);
        },

        emptyHiddenMenu : function () {
            this.hiddenMenuContent.find('li').remove();
        },

        shutDown : function (showDefaultMessage) {
            this.currentSubject = null;
            this.stopAnimation();
            
            if (showDefaultMessage) {
                this.showDefaultContent();
            }

            this.emptyHiddenMenu();
            this.stopTimer();
        },

        generateNewsStringForSubject : function (subject) {
            var newsIds = subject.news,
                result = '';
            Utilites.each(newsIds, function (newsId) {
                result += regionalMapJson.news[newsId].title;
            }, this);

            return (result) ? result : this.DEFAULT_NEWS_STRING;
        },

        generateEventsStringForSubject : function (subject) {
            var eventsIds = subject.events,
                result = '';

            Utilites.each(eventsIds, function (eventId) {
                var event = regionalMapJson.events[eventId];

                result += this.generateFlagHTMLByEvent(event) + event.startDate + ' - ' + event.endDate + '<br/>' + event.title + '<br/>';
            }, this);

            return (result) ? result : this.DEFAULT_EVENTS_STRING;
        },

        generateFlagHTMLByEvent : function (event) {
            if (!event) { return; }
            var startDate = Utilites.Date.parseDate(event.registrationStartDate, this.DATE_FORMAT),
                endDate = Utilites.Date.parseDate(event.endDate, this.DATE_FORMAT),
                flagColor = this.FLAG_CSS_CLASS + "",
                now = new Date();

            if (startDate > now) { // future
                event.timePlace = 'future';
                flagColor += this.FUTURE_TIME_COLOR;
            } else if (startDate <= now && endDate >= now) { // present time
                event.timePlace = 'present';
                flagColor += this.PRESENT_TIME_COLOR;
            } else { // past
                event.timePlace = 'past';
                flagColor += this.PAST_TIME_COLOR;
            }

            return '<div class="' + flagColor + '"></div>';
        },

        prepareContentForEachSubject : function () {
            Utilites.each(regionalMapJson.subjects, function (subject, subjectId) {
                this.cachedContent[subjectId] = {
                    'Brief Info' : subject.briefInfo,
                    'Events' : this.generateEventsStringForSubject(subject),
                    'News' : this.generateNewsStringForSubject(subject)
                };
            }, this);
        },

        startTimer : function (/* Number */ subjectId) {
            this.timeout = setTimeout(function () {
                BriefWindow.mapDataToTheDomBySubjectId(subjectId);
            }, this.SHOW_REGION_INFO_TIMEOUT);
        },

        stopTimer : function () {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    };

    BriefWindow.generateHTMLListItemFromCategory.memoize();

})();