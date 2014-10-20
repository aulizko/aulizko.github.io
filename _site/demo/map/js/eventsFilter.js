(function () {

    var $ = /* jQuery */ipoevents.jQuery;

    /**
     * Business logic for the events filtering
     */
    window.EventsFilter = {
        PLUS_CSS_CLASS : 'plus',
        MINUS_CSS_CLASS : 'minus',
        EXPAND_CSS_CLASS : 'expandIcon',
        HIDEABLE_CSS_CLASS : 'hideAble',

        CONDITIONS_FULL : 'All',

        EVENTS_TYPE_LOCALIZED : {
            'common' : 'Common',
            'sectoral' : 'Sectoral',
            'joint' : 'Joint',
            'roadshow' : 'Roadshow'
        },

        EVENTS_COUNT : 'Events',

        EVENTS_TYPE_ID_PART : 'EventType',

        CHECKED_CSS_CLASS : 'magicCheckBoxChecked',
        UN_CHECKED_CSS_CLASS : 'magicCheckBox',

        ORGANIZERS_WE : 'We',
        ORGANIZERS_PARTNERS : 'Partners',

        CURRENT_TABLE_TITLE : 'Current',

        FUTURE_TABLE_TITLE : 'Upcoming',

        PAST_TABLE_TITLE : 'Recent',

        TABLE_TEMPLATE : '<div class="subMenuFieldTableTitle">%{title}</div><table width="610px">%{content}</table>',

        SEPARATE_EVENT_TEMPLATE :  '<tr id="event-%{id}">\
                                        <td width="30px"><div class="%{cssClass}"></div></td>\
                                        <td width="140px">%{startDate} - %{endDate}</td>\
                                        <td width="340px">%{title}</td>\
                                        <td width="101px">%{city}</td>\
                                    </tr>',

        ROADSHOW_TITLE_TEMPLATE : '<tr id="roadshow-%{id}" class="expanded">\
                                        <td width="30px"><div class="expandIcon plus"></div></td>\
                                        <td width="140px">%{startDate} - %{endDate}</td>\
                                        <td width="340px">%{title}</td>\
                                        <td width="101px"></td>\
                                    </tr>',
        HIDDEN_EVENT_TEMPLATE : '<tr id="event-%{id}" class="hideAble hidden">\
                                    <td width="30px"></td>\
                                    <td width="140px"><div class="%{cssClass} inExpanded"></div>%{startDate} - %{endDate}</td>\
                                    <td width="340px">%{title}</td>\
                                    <td width="101px">%{city}</td>\
                                </tr>',

        TABLE_SEPARATOR_TEMPLATE : '<div class="subMenuFieldTableSeparator"></div>',

        input : null,
        inputWrapper : null,
        list : null,
        organizersSelector : null,
        organizersList : null,
        organizersListWrapper : null,

        eventsTypeSelector : null,
        eventsTypeList : null,
        eventsTypeListWrapper : null,

        showTimes : {
            past : true,
            present : true,
            future : true
        },

        showPresentEventsSelector : null,
        showFutureEventsSelector : null,
        showPastEventsSelector : null,


        isAllTimeFiltersOn : true,

        turnOnAllTimeFiltersSelector : null,

        body : null,
        handlers : {},

        wasListShowedAtLeastOneTime : false,

        visibilityRegister : {
            organizer : false,
            eventsType : false,
            eventsList : false
        },

        cache : {},

        selectorTitles : {
            organizers : null,
            eventsType : null
        },

        eventsTypeCheckBoxes : null,

        idsFilterNames : {
            'showEventsWithCommonType' : 'common',
            'showEventsWichIsIncludedAtRoadShow' : 'roadshow',
            'showEventsWityTypeSectoral' : 'sectoral',
            'showJointEvents' : 'joint'
        },

        timeCssClasses : {
            future : 'yellow',
            past : 'grey',
            present : 'red'
        },

        eventTypes : ['common', 'joint', 'sectoral', 'roadshow'],
        organizerTypes : ['partnersAreOrganizers', 'weAreOrganizers'],

        conditions : {
            common : true,
            roadshow : true,
            sectoral : true,
            joint : true,
            partnersAreOrganizers : true,
            weAreOrganizers : true,
            present : true,
            future : true,
            past : true,
            searchTerm : ''
        },

        filteredEvents : null,

        performFilterTimer : null,

        highlightRegExp : null,

        objectsDOMId : [],

        currentObjectIndex : null,

        filteredRoadshows : {},

        initializeDOMReferences : function () {
            this.input = $('#eventFilterInput');
            this.inputWrapper = $('.regionSelector');
            this.list = $('#eventsTable');
            this.organizersSelector = $('#organizersSection');
            this.organizersList = this.organizersSelector.find('ul');
            this.organizersListWrapper = this.organizersSelector.find('.subMenuField');

            this.eventsTypeSelector = $('#eventsSection');
            this.eventsTypeList = this.eventsTypeSelector.find('ul');
            this.eventsTypeListWrapper = this.eventsTypeSelector.find('.subMenuField');

            this.showPresentEventsSelector = $('#showPresentEvents');
            this.showFutureEventsSelector = $('#showFutureEvents');
            this.showPastEventsSelector = $('#showPastEvents');

            this.turnOnAllTimeFiltersSelector = $('#turnOnAllTimeFilters');

            this.body = $('body');

            this.selectorTitles.organizers = $('#organizersSelectorTitle');
            this.selectorTitles.eventsType = $('#eventsTypeSelectorTitle');

            this.eventsTypeCheckBoxes = $('#showEventsWithCommonType, #showEventsWichIsIncludedAtRoadShow, #showEventsWityTypeSectoral, #showJointEvents');


            this.input.keyup(this.catchKeyUpOnTheInput.bind(this));
        },

        bindEventListeners : function () {
            this.input.click(function (e) {
                if (!EventsFilter.visibilityRegister.eventsList) {
	                this.select();
                    EventsFilter.showList();
                }

                e.cancelBubble = true;
                if (e.stopPropagation) { e.stopPropagation(); }
            });
            this.inputWrapper.click(function () {
                if (this.visibilityRegister.eventsList) {
                    this.hideList();
                } else {
                    this.showList();
                }
            }.bind(this));


            this.organizersSelector.click(this.toggleOrganizersListVisibility.bind(this));
            this.highlightMenuItemOnMouseover(this.organizersList);
            this.organizersList.click(this.catchClickOnTheOrganizersTypeMenu.bind(this));
            this.eventsTypeSelector.click(this.toggleEventsTypeListVisibility.bind(this));
            this.highlightMenuItemOnMouseover(this.eventsTypeList);

            this.showPresentEventsSelector.click(this.toggleEventsTimeSelector);
            this.showFutureEventsSelector.click(this.toggleEventsTimeSelector);
            this.showPastEventsSelector.click(this.toggleEventsTimeSelector);

            this.turnOnAllTimeFiltersSelector.click(function () {
                if (this.isAllTimeFiltersOn) {
                    this.turnOffAlltimeFilters();
                } else {
                    this.turnOnAllTimeFilters();
                }
            }.bind(this));


            var boundedDivClickHandler = this.catchClickOnTheExpandObject.bind(this),
                boundedTableRowHandler = this.catchClickOnTheTableRow.bind(this);
            $('.scrollingArea').click(function (e) {
                boundedDivClickHandler(e);
                boundedTableRowHandler(e);
            });

            this.eventsTypeList.click(this.catchClickOnTheEventsTypeMenu.bind(this));
        },

        showList : function () {
            Utilites.generateClickHandlerForEveryObjectButList(this.inputWrapper[0], this.hideList.bind(this));

            this.conditions.searchTerm = '';
            this.performFilter(true);

            this.inputWrapper.addClass(ObjectsFilter.ACTIVE_CSS_CLASS);
            this.list.removeClass(ObjectsFilter.HIDDEN_CSS_CLASS);
            this.visibilityRegister.eventsList = true;



            if (this.wasListShowedAtLeastOneTime) {
            } else {
                CustomScroll.calculateConstants();
                CustomScroll.calculateVariables();
                CustomScroll.mapContentHeightToTheScroll();
                CustomScroll.recalculateChangeableVariables();
                this.wasListShowedAtLeastOneTime = true;
            }
            this.input.val('');
            this.input.focus();
        },

        hideList : function () {
            this.inputWrapper.removeClass(ObjectsFilter.ACTIVE_CSS_CLASS);
            this.list.addClass(ObjectsFilter.HIDDEN_CSS_CLASS);
            this.visibilityRegister.eventsList = false;

            this.input.val('');
            this.input.blur();

            this.conditions.searchTerm = '';
            this.performFilter();
        },

        toggleOrganizersListVisibility : function () {
            if (this.visibilityRegister.organizer) {
                this.hideOrganizersList();
            } else {
                this.showOrganizersList();
            }
        },

        showOrganizersList : function () {
            Utilites.generateClickHandlerForEveryObjectButList(this.organizersSelector[0], this.hideOrganizersList.bind(this));
            this.organizersSelector.addClass(ObjectsFilter.ACTIVE_CSS_CLASS);
            this.organizersListWrapper.removeClass(ObjectsFilter.HIDDEN_CSS_CLASS);
            this.visibilityRegister.organizer = true;
        },

        hideOrganizersList : function () {
            this.organizersSelector.removeClass(ObjectsFilter.ACTIVE_CSS_CLASS);
            this.organizersListWrapper.addClass(ObjectsFilter.HIDDEN_CSS_CLASS);
            this.visibilityRegister.organizer = false;
        },

        toggleEventsTypeListVisibility : function () {
            if (this.visibilityRegister.eventsType) {
                this.hideEventsTypeList();
            } else {
                this.showEventsTypeList();
            }
        },

        showEventsTypeList : function () {
            Utilites.generateClickHandlerForEveryObjectButList(this.eventsTypeSelector[0], this.hideEventsTypeList.bind(this));
            this.eventsTypeSelector.addClass(ObjectsFilter.ACTIVE_CSS_CLASS);
            this.eventsTypeListWrapper.removeClass(ObjectsFilter.HIDDEN_CSS_CLASS);
            this.visibilityRegister.eventsType = true;
        },

        hideEventsTypeList : function () {
            this.eventsTypeSelector.removeClass(ObjectsFilter.ACTIVE_CSS_CLASS);
            this.eventsTypeListWrapper.addClass(ObjectsFilter.HIDDEN_CSS_CLASS);
            this.visibilityRegister.eventsType = false;
        },

        toggleEventsTimeSelector : function () {
            $(this).toggleClass(ObjectsFilter.ACTIVE_CSS_CLASS);
            EventsFilter.recalculateEventsVisibilityByTime();
            EventsFilter.checkIfWeNeedToSwitchShowAllTimerButtonState();

            EventsFilter.performFilter();
        },

        recalculateEventsVisibilityByTime : function () {
            Utilites.each(this.showTimes, function (filter, name) {
                this.conditions[name] = this.showTimes[name] = this['show' + Utilites.capitalize(name) + 'EventsSelector'].hasClass(ObjectsFilter.ACTIVE_CSS_CLASS);
            }, this);
        },

        turnOnAllTimeFilters : function () {
            this.turnOnAllTimeFiltersSelector.find('.subMenuElementContent').text(ObjectsFilter.SHOW_ALL_BUTTON_TEXT);
            this.turnOnAllTimeFiltersSelector.addClass(ObjectsFilter.ACTIVE_CSS_CLASS);

            Utilites.each(this.showTimes, function (filter, name) {
                this.conditions[name] = this.showTimes[name] = true;
                this['show' + Utilites.capitalize(name) + 'EventsSelector'].addClass(ObjectsFilter.ACTIVE_CSS_CLASS);
            }, this);
            
            this.isAllTimeFiltersOn = true;

            this.performFilter();
        },

        turnOffAlltimeFilters : function () {
            this.turnOnAllTimeFiltersSelector.find('.subMenuElementContent').text(ObjectsFilter.HIDE_ALL_BUTTON_TEXT);
            this.turnOnAllTimeFiltersSelector.removeClass(ObjectsFilter.ACTIVE_CSS_CLASS);

            Utilites.each(this.showTimes, function (filter, name) {
                this.conditions[name] = this.showTimes[name] = false;
                this['show' + Utilites.capitalize(name) + 'EventsSelector'].removeClass(ObjectsFilter.ACTIVE_CSS_CLASS);
            }, this);

            this.isAllTimeFiltersOn = false;

            this.performFilter();
        },

        checkIfWeNeedToSwitchShowAllTimerButtonState : function () {
            var output = true;

            Utilites.each(this.showTimes, function (value) {
                output &= value;
            }, this);

            if (output) {
                this.turnOnAllTimeFilters();
            }

            output = false;

            Utilites.each(this.showTimes, function (value) {
                output |= value;
            }, this);

            if (!output) {
                this.turnOffAlltimeFilters();
            }
        },

        catchClickOnTheExpandObject : function (e) {
            var el = e.target;

            if (el && el.nodeName && el.nodeName == 'DIV' && el.className.indexOf(this.EXPAND_CSS_CLASS) != -1) {
                if (el.className.indexOf(this.PLUS_CSS_CLASS) != -1) { // plus
                    // change type of the icon
                    el.className = this.EXPAND_CSS_CLASS + ' ' + this.MINUS_CSS_CLASS;

                    Utilites.each(this.getNextHideAbleTableRows($(el).parents('tr')[0]), function (row) {
                        row.className = this.HIDEABLE_CSS_CLASS;
                    }, this);

                } else { // minus
                    el.className = this.EXPAND_CSS_CLASS + ' ' + this.PLUS_CSS_CLASS;

                    Utilites.each(this.getNextHideAbleTableRows($(el).parents('tr')[0]), function (row) {
                        row.className = row.className + ' ' + ObjectsFilter.HIDDEN_CSS_CLASS;
                    }, this);
                }

                CustomScroll.calculateVariables();
                CustomScroll.mapContentHeightToTheScroll();
                CustomScroll.recalculateChangeableVariables();

                e.cancelBubble = true;
                if (e.stopPropagation) { e.stopPropagation(); }
                if (e.preventDefault) { e.preventDefault(); }
                return false;
            }
        },

        getNextHideAbleTableRows : function (row) {
            var result = [];
            while (row.nextSibling) {
                row = row.nextSibling;
                if (row && row.nodeName && row.nodeName === 'TR') {
                    if (row.className.indexOf(this.HIDEABLE_CSS_CLASS) != -1) {
                        result.push(row);
                    } else {
                        break;
                    }

                }
            }
            return result;
        },

        highlightMenuItemOnMouseover : function (menu) {
            var uid = Utilites.generateUID();
            menu = $(menu);

            menu.mouseover(function (e) {
                var el = e.target;
                if (el && el.nodeName && el.nodeName === 'LI') {
                    // dehighlight previous list item
                    if (EventsFilter.cache[uid]) { EventsFilter.cache[uid].className = ''; }

                    // highlight current list item
                    el.className = ObjectsFilter.ACTIVE_CSS_CLASS;
                    EventsFilter.cache[uid] = el;
                }
            });

            // add mouseleave event handler to the menu itself
            menu.mouseleave(function () {
                if (EventsFilter.cache[uid]) { EventsFilter.cache[uid].className = ''; }
            });
        },

        pickNewValueForTheOrganizersMenu : function () {
            if (this.conditions.partnersAreOrganizers && this.conditions.weAreOrganizers) {
                this.setNewTitleForSelector('organizers', this.CONDITIONS_FULL);

            } else if (this.conditions.partnersAreOrganizers && !this.conditions.weAreOrganizers) {
                this.setNewTitleForSelector('organizers', $('#partnersAreOrganizers').text());
            } else if (!this.conditions.partnersAreOrganizers && this.conditions.weAreOrganizers) {
                this.setNewTitleForSelector('organizers', $('#weAreOrganizers').text());
            }
        },

        catchClickOnTheEventsTypeMenu : function (e) {
            var el = e.target;
            if (el && el.nodeName) {
                if (el.nodeName === 'LI') {
                    el = $(el);
                } else if (el.nodeName === 'LABEL' || el.nodeName === 'DIV') {
                    el = $(el).parents('li');
                }

                if (el.length) {
                    var checkbox = el.children('div'),
                        id = el.attr('id');

                    id = id.substr(0, id.length - 9);

                    if (!checkbox.hasClass(this.CHECKED_CSS_CLASS)) {
                        this.conditions[id] = true;
                        checkbox.attr('className', this.CHECKED_CSS_CLASS);
                    } else {
                        if (Utilites.filter(this.eventTypes, function (val) { return this.conditions[val]; }, this).length != 1) {
                            this.conditions[id] = false;
                            checkbox.attr('className', this.UN_CHECKED_CSS_CLASS);
                        }
                    }

                    this.pickNewTitleForEventsTypeSelector();
                    this.performFilter();


                    e.cancelBubble = true;
                    if (e.stopPropagation) { e.stopPropagation(); }
                }

            }
        },

        catchClickOnTheOrganizersTypeMenu : function (e) {
            var el = e.target;
            if (el && el.nodeName) {
                if (el.nodeName === 'LI') {
                    el = $(el);
                } else if (el.nodeName === 'LABEL' || el.nodeName === 'DIV') {
                    el = $(el).parents('li');
                }

                if (el.length) {
                    var checkbox = el.children('div'),
                        id = el.attr('id');

                    if (!checkbox.hasClass(this.CHECKED_CSS_CLASS)) {
                        this.conditions[id] = true;
                        checkbox.attr('className', this.CHECKED_CSS_CLASS);
                    } else {
                        if (Utilites.filter(this.organizerTypes, function (val) { return this.conditions[val]; }, this).length != 1) {
                            this.conditions[id] = false;
                            checkbox.attr('className', this.UN_CHECKED_CSS_CLASS);
                        }
                    }

                    this.pickNewValueForTheOrganizersMenu();
                    this.performFilter();


                    e.cancelBubble = true;
                    if (e.stopPropagation) { e.stopPropagation(); }
                }

            }
        },

        setNewTitleForSelector : function (selectorName, value) {
            this.selectorTitles[selectorName].text(value);
        },

        pickNewTitleForEventsTypeSelector : function () {
            var conditionsNames = this.eventTypes,
                pickedNames = [],
                length;

            Utilites.each(conditionsNames, function (name) {
                if (this.conditions[name]) {
                    pickedNames.push(name);
                }
            }, this);

            length = pickedNames.length;

            if (length == 1) {
                this.setNewTitleForSelector('eventsType', this.EVENTS_TYPE_LOCALIZED[pickedNames[0]]);
            } else if (length == 2) {
                this.setNewTitleForSelector('eventsType', this.EVENTS_TYPE_LOCALIZED[pickedNames[0]] + ', ' + this.EVENTS_TYPE_LOCALIZED[pickedNames[1]]);
            } else if (length == 3) {
                this.setNewTitleForSelector('eventsType', this.EVENTS_TYPE_LOCALIZED[pickedNames[0]] + ', ' + this.EVENTS_TYPE_LOCALIZED[pickedNames[1]] + '...');
            } else if (length == 4) {
                this.setNewTitleForSelector('eventsType', this.CONDITIONS_FULL);
            }

        },

        mapConditionsValueToTheDOM : function () {
            // organizers selector
            if (this.conditions.weAreOrganizers && this.conditions.partnersAreOrganizers) {
                this.setNewTitleForSelector('organizers', this.CONDITIONS_FULL);
            } else if (this.conditions.weAreOrganizers && !this.conditions.partnersAreOrganizers) {
                this.setNewTitleForSelector('organizers', this.ORGANIZERS_WE);
            } else if (!this.conditions.weAreOrganizers && this.conditions.partnersAreOrganizers) {
                this.setNewTitleForSelector('organizers', this.ORGANIZERS_PARTNERS);
            }

            // eventsTypeSelector
            var conditionsNames = this.eventTypes;
            Utilites.each(conditionsNames, function (name) {
                var id = name + this.EVENTS_TYPE_ID_PART,
                    div = $('#' + id).children('div');

                if (this.conditions[name]) {
                    div.attr('className', this.CHECKED_CSS_CLASS);
                } else {
                    div.attr('className', this.UN_CHECKED_CSS_CLASS);
                }
            }, this);

            conditionsNames = this.organizerTypes;
            Utilites.each(conditionsNames, function (name) {
                var div = $('#' + name).children('div');

                if (this.conditions[name]) {
                    div.attr('className', this.CHECKED_CSS_CLASS);
                } else {
                    div.attr('className', this.UN_CHECKED_CSS_CLASS);
                }
            }, this);

            this.pickNewTitleForEventsTypeSelector();
        },

        passEventsThroughConditions : function () {
            return Utilites.filter(regionalMapJson.events, function (event) {
                var result = true,
                    processingResult = false;

                // pass through organizers
                Utilites.each(this.organizerTypes, function (name) {
                    processingResult |= this.conditions[name] && (this.conditions[name] == event[name]);
                }, this);


                result &= processingResult;

                if (result) {
                    // pass through event types
                    processingResult = false;

                    Utilites.each(this.eventTypes, function (name) {
                        processingResult |= this.conditions[name] && (this.conditions[name] == !!event[name]);
                    }, this);

                    result &= processingResult;

                    if (result) {
                        // pass through search term
                        if (this.conditions.searchTerm && this.conditions.searchTerm.length) {
                            var regExp = new RegExp('(' + this.conditions.searchTerm + ')', 'i');
                            this.highlightRegExp = regExp;
                            result &= regExp.test(event.title);
                        } else {
                            this.highlightRegExp = null;
                            this.conditions.searchTerm = '';
                            result &= true;
                        }

                        // pass through time
                        result &= this.conditions[event.timePlace];
                    }
                }

                return result;
            }, this);
        },



        performFilter : function (isActivatedFromInput) {
            var events = this.passEventsThroughConditions(),
                objectsToDraw = {},
                eventsLength = Utilites.getKeysFromObject(events).length;

            if (!isActivatedFromInput) {
                this.setSearchTermInputTitle(this.EVENTS_COUNT + ((eventsLength) ? (' (' + eventsLength + ')') : ''));
            }



            Utilites.each(events, function (event, id) {
                Utilites.each(regionalMapJson.subjects, function (subject, subjectId) {
                    if (Utilites.indexOf(subject.events, parseInt(id)) != -1) {
                        if (!objectsToDraw[subjectId]) {
                            objectsToDraw[subjectId] = [];
                            objectsToDraw[subjectId].renderedCssClasses = {};
                        }

                        var cssClass = this.timeCssClasses[event.timePlace];

                        if (objectsToDraw[subjectId].length == 0 ||
                                !objectsToDraw[subjectId].renderedCssClasses[cssClass]) {
                            objectsToDraw[subjectId].push({
                                type : 'flag',
                                message : id,
                                cssClass : cssClass
                            });

                            objectsToDraw[subjectId].renderedCssClasses[cssClass] = true;
                        }


                    }
                }, this);
            }, this);

            this.filteredEvents = events;

            this.filteredRoadshows = {};

            this.generateAndRenderHTMLForList();

            Map.prepareToRender();

            Utilites.each(objectsToDraw, function (objects, subjectId) {
                Map.displayObjectOnSubjectAndHighlightIt(objects, subjectId);
            }, this);

            Map.startRender();
        },

        setSearchTermInputTitle : function (title) {
            this.input.val(title);
        },

        generateAndRenderHTMLForList : function () {
            var html = '',
                presentTableCode = '',
                futureTableCode = '';

            this.objectsDOMId.length = 0;

            if (this.conditions.present) {
                presentTableCode = this.generatePresentEventsTable(this.objectsDOMId);
                html += presentTableCode;
            }

            if (this.conditions.present && (this.conditions.future || this.conditions.past) && presentTableCode.length) {
                html += this.TABLE_SEPARATOR_TEMPLATE;
            }

            if (this.conditions.future) {
                futureTableCode = this.generateFutureEventsTable(this.objectsDOMId);
                html += futureTableCode;
            }

            if (this.conditions.future && this.conditions.past && futureTableCode.length) {
                html += this.TABLE_SEPARATOR_TEMPLATE;
            }

            if (this.conditions.past) {
                html += this.generatePastEventsTable(this.objectsDOMId);
            }


            this.list.find('.scrollingArea')[0].innerHTML = html;
        },

        generatePresentEventsTable : function (objectsDOMId) {
            var events = Utilites.filter(this.filteredEvents, function (event) {
                return event.timePlace == 'present';
            }, this);

            // sort events
            var dates = [];

            Utilites.each(events, function (event) {
                dates.push(Utilites.Date.parseDate(event.startDate, BriefWindow.DATE_FORMAT));
            }, this);

            dates.sort();

            var tempEvents = [];

            Utilites.each(dates, function (date) {
                var matchedEvents = Utilites.filter(events, function (event) {
                    return Utilites.Date.parseDate(event.startDate, BriefWindow.DATE_FORMAT).toGMTString() == date.toGMTString();
                }, this);

                var id = Utilites.getKeysFromObject(matchedEvents)[0];

                tempEvents.push(Utilites.merge(events[id], { id : id }));
                delete events[id];
            }, this);

            // build html code

            var content = '';
            Utilites.each(tempEvents, function (event) {
                objectsDOMId.push('event-' + event.id);
                content += this.SEPARATE_EVENT_TEMPLATE
                               .replace(/%\{id\}/, event.id)
                               .replace(/%\{cssClass\}/, 'redFlagIcon')
                               .replace(/%\{startDate\}/, event.startDate)
                               .replace(/%\{endDate\}/, event.endDate)
                               .replace(/%\{city\}/, event.city)
                               .replace(/%\{title\}/, this.highlightPartOfTitle(event.title));
            }, this);

            if (content.length == '') { return ''; }
            else {
                return this.TABLE_TEMPLATE.replace(/%\{title\}/, this.CURRENT_TABLE_TITLE)
                               .replace(/%\{content\}/, content);
            }
        },

        generateFutureEventsTable : function (objectsDOMId) {
            var events = Utilites.filter(this.filteredEvents, function (event, id) {
                return event.timePlace == 'future';
            }, this);


            // check roadshows
            var now = new Date();

            if (this.conditions.roadshow) {
                var roadshows = Utilites.filter(regionalMapJson.roadshows, function (roadshow) {
                    return Utilites.Date.parseDate(roadshow.endDate, BriefWindow.DATE_FORMAT) > now;
                }, this);

                // remove events that are inside roadshow
                var roadshowEventMap = {};
                Utilites.each(roadshows, function (roadshow, roadshowId) {
                    var ev = roadshow.events;
                    if (ev && ev.length) {
                        roadshowEventMap[roadshowId] = [];
                        Utilites.each(ev, function (id) {
                            if (events[id]) {
                                roadshowEventMap[roadshowId].push(Utilites.merge(events[id], { id : id }));
                                delete events[id];
                            }
                        }, this);

                        if (roadshowEventMap[roadshowId].length == 0) {
                            delete roadshowEventMap[roadshowId];
                            delete roadshows[roadshowId];
                        }
                    } else {
                        delete roadshows[roadshowId];
                    }
                }, this);


                Utilites.each(roadshowEventMap, function (t, roadshowId) {
                    this.filteredRoadshows[roadshowId] = regionalMapJson.roadshows[roadshowId];
                }, this);
            }

            // sort events
            var dates = [];

            Utilites.each(events, function (event) {
                dates.push(Utilites.Date.parseDate(event.startDate, BriefWindow.DATE_FORMAT));
            }, this);

            if (this.conditions.roadshow) {
                Utilites.each(roadshows, function (roadshow) {
                    dates.push(Utilites.Date.parseDate(roadshow.startDate, BriefWindow.DATE_FORMAT));
                }, this);
            }

            dates.sort();

            dates.reverse();

            var tempEvents = [];

            Utilites.each(dates, function (date) {
                var matched = Utilites.filter(roadshows, function (roadshow) {
                    return Utilites.Date.parseDate(roadshow.startDate, BriefWindow.DATE_FORMAT).toGMTString() == date.toGMTString();
                }, this);
                var id = Utilites.getKeysFromObject(matched)[0];

                if (id) {
                    tempEvents.push(Utilites.merge(roadshows[id], { roadshow : true, id : id }));
                    delete events[id];
                } else { // assume that is event
                    matched = Utilites.filter(events, function (event) {
                        return Utilites.Date.parseDate(event.startDate, BriefWindow.DATE_FORMAT).toGMTString() == date.toGMTString();
                    }, this);

                    id = Utilites.getKeysFromObject(matched)[0];

                    if (id) {
                        tempEvents.push(Utilites.merge(events[id], { id : id }));
                        delete events[id];
                    }
                }
            }, this);

            // build html code

            var content = '';
            Utilites.each(tempEvents, function (obj) {
                if (obj.roadshow) {
                    objectsDOMId.push('roadshow-' + obj.id);
                    content += this.ROADSHOW_TITLE_TEMPLATE
                               .replace(/%\{id\}/, obj.id)
                               .replace(/%\{startDate\}/, obj.startDate)
                               .replace(/%\{endDate\}/, obj.endDate)
                               .replace(/%\{title\}/, this.highlightPartOfTitle(obj.title));

                    // add hidden events that are belongs to that roadshow
                    Utilites.each(roadshowEventMap[obj.id], function (obj) {
                        content += this.HIDDEN_EVENT_TEMPLATE
                               .replace(/%\{id\}/, obj.id)
                               .replace(/%\{cssClass\}/, 'yellowFlagIcon')
                               .replace(/%\{startDate\}/, obj.startDate)
                               .replace(/%\{endDate\}/, obj.endDate)
                               .replace(/%\{city\}/, obj.city)
                               .replace(/%\{title\}/, this.highlightPartOfTitle(obj.title));
                    }, this);
                } else {
                    objectsDOMId.push('event-' + obj.id);
                    content += this.SEPARATE_EVENT_TEMPLATE
                               .replace(/%\{id\}/, obj.id)
                               .replace(/%\{cssClass\}/, 'yellowFlagIcon')
                               .replace(/%\{startDate\}/, obj.startDate)
                               .replace(/%\{endDate\}/, obj.endDate)
                               .replace(/%\{city\}/, obj.city)
                               .replace(/%\{title\}/, this.highlightPartOfTitle(obj.title));
                }

            }, this);

            if (content.length == '') { return ''; }
            else {
                return this.TABLE_TEMPLATE.replace(/%\{title\}/, this.FUTURE_TABLE_TITLE)
                               .replace(/%\{content\}/, content);
            }
        },

        generatePastEventsTable : function (objectsDOMId) {
            var events = Utilites.filter(this.filteredEvents, function (event) {
                return event.timePlace == 'past';
            }, this);


            // check roadshows
            var now = new Date();

            if (this.conditions.roadshow) {
                var roadshows = Utilites.filter(regionalMapJson.roadshows, function (roadshow) {
                    return Utilites.Date.parseDate(roadshow.startDate, BriefWindow.DATE_FORMAT) < now;
                }, this);

                // remove events that are inside roadshow

                var roadshowEventMap = {};
                Utilites.each(roadshows, function (roadshow, roadshowId) {
                    var ev = roadshow.events;
                    if (ev && ev.length) {
                        roadshowEventMap[roadshowId] = [];
                        Utilites.each(ev, function (id) {
                            if (events[id]) {
                                roadshowEventMap[roadshowId].push(Utilites.merge(events[id], { id : id }));
                                delete events[id];
                            }
                        }, this);

                        if (roadshowEventMap[roadshowId].length == 0) {
                            delete roadshowEventMap[roadshowId];
                            delete roadshows[roadshowId];
                        }
                    } else {
                        delete roadshows[roadshowId];
                    }
                }, this);

                Utilites.each(roadshowEventMap, function (t, roadshowId) {
                    this.filteredRoadshows[roadshowId] = regionalMapJson.roadshows[roadshowId];
                }, this);
            }

            // sort events
            var dates = [];

            Utilites.each(events, function (event) {
                dates.push(Utilites.Date.parseDate(event.startDate, BriefWindow.DATE_FORMAT));
            }, this);

            if (this.conditions.roadshow) {
                Utilites.each(roadshows, function (roadshow) {
                    dates.push(Utilites.Date.parseDate(roadshow.startDate, BriefWindow.DATE_FORMAT));
                }, this);
            }

            dates.sort();


            var tempEvents = [];

            Utilites.each(dates, function (date) {
                var matched = Utilites.filter(roadshows, function (roadshow) {
                    return Utilites.Date.parseDate(roadshow.startDate, BriefWindow.DATE_FORMAT).toGMTString() == date.toGMTString();
                }, this);
                var id = Utilites.getKeysFromObject(matched)[0];

                if (id) {
                    tempEvents.push(Utilites.merge(roadshows[id], { roadshow : true, id : id }));
                    delete events[id];
                } else { // assume that is event
                    matched = Utilites.filter(events, function (event) {
                        return Utilites.Date.parseDate(event.startDate, BriefWindow.DATE_FORMAT).toGMTString() == date.toGMTString();
                    }, this);

                    id = Utilites.getKeysFromObject(matched)[0];

                    if (id) {
                        tempEvents.push(Utilites.merge(events[id], { id : id }));
                        delete events[id];
                    }
                }
            }, this);

            // build html code

            var content = '';
            Utilites.each(tempEvents, function (obj) {
                if (obj.roadshow) {
                    objectsDOMId.push('roadshow-' + obj.id);
                    content += this.ROADSHOW_TITLE_TEMPLATE
                               .replace(/%\{id\}/, obj.id)
                               .replace(/%\{startDate\}/, obj.startDate)
                               .replace(/%\{endDate\}/, obj.endDate)
                               .replace(/%\{title\}/, this.highlightPartOfTitle(obj.title));

                    // add hidden events that are belongs to that roadshow
                    Utilites.each(roadshowEventMap[obj.id], function (obj) {
                        content += this.HIDDEN_EVENT_TEMPLATE
                               .replace(/%\{id\}/, obj.id)
                               .replace(/%\{cssClass\}/, 'greyFlagIcon')
                               .replace(/%\{startDate\}/, obj.startDate)
                               .replace(/%\{endDate\}/, obj.endDate)
                               .replace(/%\{city\}/, obj.city)
                               .replace(/%\{title\}/, this.highlightPartOfTitle(obj.title));
                    }, this);
                } else {
                    objectsDOMId.push('event-' + obj.id);
                    content += this.SEPARATE_EVENT_TEMPLATE
                               .replace(/%\{id\}/, obj.id)
                               .replace(/%\{cssClass\}/, 'greyFlagIcon')
                               .replace(/%\{startDate\}/, obj.startDate)
                               .replace(/%\{endDate\}/, obj.endDate)
                               .replace(/%\{city\}/, obj.city)
                               .replace(/%\{title\}/, this.highlightPartOfTitle(obj.title));
                }

            }, this);

            if (content.length == '') { return ''; }
            else {
                return this.TABLE_TEMPLATE.replace(/%\{title\}/, this.PAST_TABLE_TITLE)
                               .replace(/%\{content\}/, content);
            }
        },


        catchKeyUpOnTheInput : function (e) {
            var key = e.which;

            switch (key) {
                case 40: // down key
                        if (this.currentObjectIndex != null) {
                            // disable previous region
                            var previousObject = this.objectsDOMId[this.currentObjectIndex];
                            $('#' + previousObject).removeClass(GUI.HIGHLIGHTED_TABLE_ROW_CSS_CLASS);
                        } else {
                            this.currentObjectIndex = -1;
                        }
                        // highlight new region
                        if (this.currentObjectIndex != (this.objectsDOMId.length - 1)) {
                            this.currentObjectIndex++;
                        }

                        var nextObject = this.objectsDOMId[this.currentObjectIndex];
                        $('#' + nextObject).addClass(GUI.HIGHLIGHTED_TABLE_ROW_CSS_CLASS);

                        var id = parseInt(/(\d+)$/.exec(this.objectsDOMId[this.currentObjectIndex])[1]);

                        var obj = this.filteredEvents[id];
                        if (!obj) {
                            obj = this.filteredRoadshows[id];
                        }
                        if (obj) {
                            this.input.val(obj.title);
                        } else {
                            this.input.val('');
                        }

                    break;
                case 38: // up key
                        if (this.currentObjectIndex != null) {
                            // disable previous region
                            previousObject = this.objectsDOMId[this.currentObjectIndex];
                            $('#' + previousObject).removeClass(GUI.HIGHLIGHTED_TABLE_ROW_CSS_CLASS);
                        } else {
                            this.currentObjectIndex = this.objectsDOMId.length;
                        }
                        // highlight new region
                        if (this.currentObjectIndex != 0) {
                            this.currentObjectIndex--;
                        }

                        nextObject = this.objectsDOMId[this.currentObjectIndex];
                        $('#' + nextObject).addClass(GUI.HIGHLIGHTED_TABLE_ROW_CSS_CLASS);

                        id = parseInt(/(\d+)$/.exec(this.objectsDOMId[this.currentObjectIndex])[1]);

                        obj = this.filteredEvents[id];
                        if (!obj) {
                            obj = this.filteredRoadshows[id];
                        }
                        if (obj) {
                            this.input.val(obj.title);
                        } else {
                            this.input.val('');
                        }
                    break;
                case 13 : // enter key
                        this.catchClickOrEnterKeyPressOnEvent(parseInt(/(\d+)$/.exec(this.objectsDOMId[this.currentObjectIndex])[1]));
                    break;
                case 27:  // esc key
                        this.hideList();
                    break;
                default:
                        this.launchPerformFilterTimer();
            };
        },

        launchPerformFilterTimer : function () {
            if (this.performFilterTimer === null) {
                this.performFilterTimer = setTimeout(EventsFilter.filterRegionsBySearchQuery.bind(EventsFilter), ObjectsFilter.TIMEOUT);
            } else {
                clearTimeout(this.performFilterTimer);
                this.performFilterTimer = setTimeout(EventsFilter.filterRegionsBySearchQuery.bind(EventsFilter), ObjectsFilter.TIMEOUT);
            }
        },

        filterRegionsBySearchQuery : function () {
            clearTimeout(this.performFilterTimer);
            this.performFilterTimer = null;

            this.conditions.searchTerm = this.input.val();
            this.performFilter(true);
        },

        highlightPartOfTitle : function (src) {
            if (this.highlightRegExp) {
                return src.replace(this.highlightRegExp, '<span class="highlighted">$1</span>');
            } else {
                return src;
            }
        },

        catchClickOrEnterKeyPressOnEvent : function (id) {
            var obj = this.filteredEvents[id];

            if (obj) {
                window.location = '/events/' + id;
            } else {
                obj = this.filteredRoadshows[id];
                if (obj) {
                    window.location = '/roadshows/' + id;
                }
            }
        },

        catchClickOnTheTableRow : function (e) {
            var el = e.target;
            if (el && el.nodeName && el.nodeName === 'DIV' && el.className.indexOf(this.EXPAND_CSS_CLASS) != -1) { return; }
            if (el && el.nodeName && el.nodeName !== 'TR') {
                while (el && el.nodeName && el.nodeName != 'BODY') {
                    el = el.parentNode;
                    if (el.nodeName == 'TR') {
                        break;
                    }
                }
            }

            if (el && el.nodeName && el.nodeName === 'TR') {
                var id = el.id,
                    result = /(\d+)$/.exec(id);
                if (result[1]) {
                    id = parseInt(result[1]);
                    if (id) {
                        this.catchClickOrEnterKeyPressOnEvent(id);
                    }
                }
            }
        },

        initialize : function () {
            this.initializeDOMReferences();

            if (!this.input.length) { return; }
            this.bindEventListeners();

            this.mapConditionsValueToTheDOM();

            this.performFilter();
        }
    };

})();