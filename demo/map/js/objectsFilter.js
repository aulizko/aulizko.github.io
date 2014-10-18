(function () {

    var $ = ipoevents.jQuery;
    /**
     * Business logic for the objects filtering
     */
    window.ObjectsFilter = {
        ACTIVE_CSS_CLASS : 'active',
        HIDE_ALL_BUTTON_TEXT : 'Hide All',
        SHOW_ALL_BUTTON_TEXT : 'Show All',
        HIDDEN_CSS_CLASS : 'hidden',
        REGIONS_TITLE : 'Регионы',
        SHOW_ALL_REGIONS_TEXT : 'Показать все',
        filter : {
            event : true,
            partner : true,
            gr : true,
            project : true,
            listedCompany : true,
            monitoring : true
        },
        eventFilterButton : null,
        partnerFilterButton : null,
        grFilterButton : null,
        projectFilterButton : null,
        listedCompanyFilterButton : null,
        monitoringFilterButton : null,
        toggleAllButtonButton : null,

        regionsListContainer : null,

        regionsList : null,

        toggleRegionsListButton : null,
        
        showAll : true,

        isRegionsListVisible : false,

        regionsFilterInput : null,

        regionsFilterInputWrapper : null,

        regions : [],

        backupRegions : [],

        filteredRegions : [],

        regionIndex : [],

        currentRegionIndex : null,

        searchTimer : null,

        TIMEOUT : 200,

        boundedBlurHandler : null,

        isBinded : true,

        isShowAllOptionShowed : false,

        TIME_TO_CSS_CONVERTER : {
            future : 'yellow',
            present : 'red',
            past : 'grey'
        },

        initializeDOMReferences : function () {
            this.eventFilterButton = $('#eventFilter');
            this.partnerFilterButton = $('#partnerFilter');
            this.grFilterButton = $('#grFilter');
            this.projectFilterButton = $('#projectFilter');
            this.listedCompanyFilterButton = $('#listedCompanyFilter');
            this.monitoringFilterButton = $('#monitoringFilter');
            this.toggleAllButtonButton = $('#toggleAllButton');

            this.regionsListContainer = $('.regionSelector .subMenuField ');
            this.regionsList = $('#regionsList');
            this.toggleRegionsListButton = $('.regionSelector');
            this.regionsFilterInput = $('#regionFilter');
            this.regionsFilterInputWrapper = $('#regionsFilterInputWrapper');
        },

        bindEventListeners : function () {
            this.toggleAllButtonButton.click(this.toggleAllButtonClickListener.bind(this));

            this.regionsFilterInput.click(function (e) {
                if (!ObjectsFilter.isRegionsListVisible) {
                    ObjectsFilter.showRegionsList();
                }
                e.cancelBubble = true;
                if (e.stopPropagation) { e.stopPropagation(); }
            });


            this.eventFilterButton.click(this.toggleFilterClickListener);
            this.partnerFilterButton.click(this.toggleFilterClickListener);
            this.grFilterButton.click(this.toggleFilterClickListener);
            this.projectFilterButton.click(this.toggleFilterClickListener);
            this.listedCompanyFilterButton.click(this.toggleFilterClickListener);
            this.monitoringFilterButton.click(this.toggleFilterClickListener);

            this.toggleRegionsListButton.click(this.toggleRegionsListButtonClickListener);

            this.regionsFilterInput.keyup(this.catchRegionsFilterKeyUp);

            this.regionsList.mouseover(this.catchMouseOver);
            this.regionsList.click(this.catchClickOnRegionsList);
            this.regionsList.mouseleave(this.catchMouseOutOnRegionsList);
        },

        representFilterStateToDOM : function () {
            Utilites.each(this.filter, function (value, name) {
                this[name + 'FilterButton'][(value) ? 'addClass' : 'removeClass'](this.ACTIVE_CSS_CLASS);
            }, this);
        },

        activateAll : function () {
            Utilites.each(this.filter, function (filter, name) {
                this.filter[name] = true;
            }, this);

            this.representFilterStateToDOM();

            this.filterList();
        },

        disableAll : function () {
            Utilites.each(this.filter, function (filter, name) {
                this.filter[name] = false;
            }, this);

            this.representFilterStateToDOM();

            this.filterList();
        },

        toggleAllButtonClickListener : function (e) {
            var text = this.HIDE_ALL_BUTTON_TEXT,
                method = 'activateAll',
                cssMethod = 'addClass';

            if (this.showAll) {
                text = this.SHOW_ALL_BUTTON_TEXT;
                method = 'disableAll';
                cssMethod = 'removeClass';
            }

            this.toggleAllButtonButton.find('.subMenuElementContent').html(text);
            this.toggleAllButtonButton[cssMethod](this.ACTIVE_CSS_CLASS);
            this.showAll = !this.showAll;
            this[method]();

            if (e.preventDefault) { e.preventDefault(); }
            return false;
        },

        toggleFilterClickListener : function (e) {
            var filterName = this.id.substr(0, this.id.length - 6);
            var button = ObjectsFilter[this.id + 'Button'];

            button.toggleClass(ObjectsFilter.ACTIVE_CSS_CLASS);
            ObjectsFilter.filter[filterName] = !ObjectsFilter.filter[filterName];

            ObjectsFilter.checkIfAllFiltersIsEnabled();

            ObjectsFilter.filterList();

            if (e.preventDefault) { e.preventDefault(); }
            return false;
        },

        checkIfAllFiltersIsEnabled : function () {
            var isAllEnabled = true, isAllDisabled = true;
            Utilites.each(this.filter, function (value) {
                isAllDisabled &= !value;
                isAllEnabled &= value;
            }, this);
            if (isAllEnabled) {
                this.showAll = true;
                this.toggleAllButtonButton.find('.subMenuElementContent').html(this.HIDE_ALL_BUTTON_TEXT);
                this.toggleAllButtonButton.addClass(this.ACTIVE_CSS_CLASS);

            } else if (isAllDisabled) {
                this.showAll = false;
                this.toggleAllButtonButton.find('.subMenuElementContent').html(this.SHOW_ALL_BUTTON_TEXT);
                this.toggleAllButtonButton.removeClass(this.ACTIVE_CSS_CLASS);
            }
        },

        toggleRegionsListButtonClickListener : function (e) {
            if (ObjectsFilter.isRegionsListVisible) {
                ObjectsFilter.regionsFilterInput.blur();
            } else {
                ObjectsFilter.showRegionsList();
            }

            if (e.preventDefault) { e.preventDefault(); }
            return false;
        },

        showRegionsList : function () {
            this.regionsFilterInput.val('');
            this.regionsFilterInput.focus();
            this.regionsFilterInputWrapper.addClass(ObjectsFilter.ACTIVE_CSS_CLASS);
            this.filterList(true);

            Utilites.generateClickHandlerForEveryObjectButList(this.toggleRegionsListButton[0], this.hideRegionsList.bind(this));
            this.regionsListContainer.removeClass(this.HIDDEN_CSS_CLASS);

            this.isRegionsListVisible = true;
        },

        hideRegionsList : function () {
            $('#regionFilter-0').remove();
            this.regions.shift();
            this.regionIndex.shift();
            this.isShowAllOptionShowed = false;
            this.filterList(true);
            this.mapRegionsNumberToTheInput();
            this.regionsFilterInput.blur();
            this.regionsFilterInputWrapper.removeClass(ObjectsFilter.ACTIVE_CSS_CLASS);
            this.regionsListContainer.addClass(this.HIDDEN_CSS_CLASS);
            this.isRegionsListVisible = false;
        },

        representRegionsListToDOM : function (regularExpression) {
            var html = '';

            Utilites.each(this.regions, function (region) {
                html += '<li id="regionFilter-' + region.id + '"><label>' + ((regularExpression) ? (region.title.replace(regularExpression, '<span class="highlighted">$1</span>')) : region.title) + '</label></li>';
            }, this);

            if (this.regions.length > 20) {
                this.regionsList.css({
                    height : '600px'
                });
            } else {
                this.regionsList.css({
                    height : ''
                });
            }

            this.regionsList[0].innerHTML = html;
        },

        catchRegionsFilterKeyUp : function (e) {
            var keyCode = e.which;

            switch (keyCode) {
                case 40: // down key
                    if (ObjectsFilter.currentRegionIndex != null) {
                        // disable previous region
                        var previousRegionId = ObjectsFilter.regionIndex[ObjectsFilter.currentRegionIndex];
                        $('#regionFilter-' + previousRegionId).removeClass('active');
                    } else {
                        ObjectsFilter.currentRegionIndex = -1;
                    }
                    // highlight new region
                    if (ObjectsFilter.currentRegionIndex != (ObjectsFilter.regionIndex.length - 1)) {
                        ObjectsFilter.currentRegionIndex++;
                    }

                    var nextRegionId = ObjectsFilter.regionIndex[ObjectsFilter.currentRegionIndex];
                    $('#regionFilter-' + nextRegionId).addClass('active');

                    this.value = ObjectsFilter.regions[ObjectsFilter.currentRegionIndex].title;
                    break;
                case 38: // up key
                    if (ObjectsFilter.currentRegionIndex != null) {
                        // disable previous region
                        previousRegionId = ObjectsFilter.regionIndex[ObjectsFilter.currentRegionIndex];
                        $('#regionFilter-' + previousRegionId).removeClass('active');
                    } else {
                        ObjectsFilter.currentRegionIndex = ObjectsFilter.regionIndex.length;
                    }
                    // highlight new region
                    if (ObjectsFilter.currentRegionIndex != 0) {
                        ObjectsFilter.currentRegionIndex--;
                    }
                    nextRegionId = ObjectsFilter.regionIndex[ObjectsFilter.currentRegionIndex];
                    $('#regionFilter-' + nextRegionId).addClass('active');
                    this.value = ObjectsFilter.regions[ObjectsFilter.currentRegionIndex].title;
                    break;
                case 13: // enter key
                    ObjectsFilter.processRegionIdClickOrEnterKeyPress(ObjectsFilter.regionIndex[ObjectsFilter.currentRegionIndex]);
                    break;
                case 27:  // esc key
                    ObjectsFilter.hideRegionsList();
                    break;
                default:
                    ObjectsFilter.launchRegionsListFilter();
            }
        },

        launchRegionsListFilter : function () {
            if (ObjectsFilter.searchTimer == null) {
                ObjectsFilter.searchTimer = setTimeout(ObjectsFilter.filterRegionsBySearchQuery.bind(ObjectsFilter), ObjectsFilter.TIMEOUT);
            } else {
                clearTimeout(ObjectsFilter.searchTimer);
                ObjectsFilter.searchTimer = setTimeout(ObjectsFilter.filterRegionsBySearchQuery.bind(ObjectsFilter), ObjectsFilter.TIMEOUT);
            }
        },

        filterRegionsBySearchQuery : function () {
            clearTimeout(this.searchTimer);
            this.searchTimer = null;


            var searchRegex = new RegExp('(' + this.regionsFilterInput.val() + ')', 'i');

            this.regionIndex.length = 0;

            this.regions = Utilites.arrayFilter(this.filteredRegions, function (region) {
                if (searchRegex.test(region.title)) {
                    this.regionIndex.push(region.id);
                    return true;
                }
            }, this);

            this.currentRegionIndex = null;

            this.representRegionsListToDOM(searchRegex);
        },

        addObjectsToRenderIfFilterIsOn : function (preparedForRenderSubjects, subjectId, subject, filter, objectType) {
            if (!preparedForRenderSubjects[subjectId]) {
                preparedForRenderSubjects[subjectId] = [];
                preparedForRenderSubjects[subjectId].renderedCssClasses = {};
            }


            var filterValue = subject[filter];

            if (Utilites.isArray(filterValue)) { // assume that is events


                Utilites.each(filterValue, function (eventId) {
                    var cssClass = this.TIME_TO_CSS_CONVERTER[regionalMapJson.events[eventId].timePlace];

                    if ((preparedForRenderSubjects[subjectId].length == 0) ||
                            !preparedForRenderSubjects[subjectId].renderedCssClasses[cssClass]) { // test if we already has same time place event

                        preparedForRenderSubjects[subjectId].push({
                            type : objectType,
                            cssClass : cssClass
                        });

                        preparedForRenderSubjects[subjectId].renderedCssClasses[cssClass] = true;
                    }
                }, this);
            } else if (filterValue) {
                preparedForRenderSubjects[subjectId].push({
                    type : objectType
                });
            }

            if (preparedForRenderSubjects[subjectId].length == 0) {
                delete preparedForRenderSubjects[subjectId];
            }
        },

        filterList : function (addShowAllOption) {
            // run through data
            var preparedForRenderSubjects = {};

            Utilites.each(regionalMapJson.subjects, function (subject, subjectId) {
                this.applyFiltersToSubject(preparedForRenderSubjects, subjectId, subject);
            }, this);


            var regionsIds = Utilites.getKeysFromObject(preparedForRenderSubjects);
            this.filteredRegions.length = 0;

            Utilites.each(this.backupRegions, function (region) {
                var indexOf = Utilites.indexOf(regionsIds, region.id);
                if (indexOf != -1) {
                    this.filteredRegions.push({
                        id : region.id,
                        title : region.title
                    });

                    regionsIds.splice(indexOf, 1);
                }
            }, this);

            this.regionsFilterInput.val('');

            if (addShowAllOption) {
                this.filteredRegions.unshift(this.SHOW_ALL_ITEM);
                this.regionIndex.unshift(0);
                this.isShowAllOptionShowed = true;
            } else {
                this.isShowAllOptionShowed = false;
            }

            this.filterRegionsBySearchQuery();

            this.mapRegionsNumberToTheInput();

            Map.prepareToRender();

            Utilites.each(preparedForRenderSubjects, function (objects, subjectId) {
                Map.displayObjectOnSubjectAndHighlightIt(objects, subjectId);
            }, this);

            Map.startRender();
        },

        mapRegionsNumberToTheInput : function () {
            var regionsLength = this.regions.length - ((this.isShowAllOptionShowed) ? 1 : 0);


            this.regionsFilterInput.val(this.REGIONS_TITLE + ((regionsLength) ? (' (' + regionsLength + ')') : ''));
        },

        catchMouseOver : function (e) {
            var el = $(e.target);
            if (el.is('li')) {
                if (ObjectsFilter.isBinded) {
                    ObjectsFilter.regionsFilterInput.unbind('blur', ObjectsFilter.boundedBlurHandler);
                    ObjectsFilter.isBinded = false;
                }
                // shutdown highlight on the old highlighted region
                if (ObjectsFilter.currentRegionIndex != null) {
                    $('#regionFilter-' + ObjectsFilter.currentRegionIndex).removeClass(ObjectsFilter.ACTIVE_CSS_CLASS);
                }

                var id = el.attr('id');

                ObjectsFilter.currentRegionIndex = id.substr(id.indexOf('-') + 1);
                el.addClass('active');
            }
        },

        catchClickOnRegionsList : function (e) {
            var el = $(e.target);
            if (el.is('li')) {
                var id = el.attr('id');
                var regionId = id.substr(id.indexOf('-') + 1);
                ObjectsFilter.processRegionIdClickOrEnterKeyPress(regionId);
            }
        },

        processRegionIdClickOrEnterKeyPress : function (regionId) {
            if (regionId != 0) {
                window.location = '/regions/' + regionId;
            } else {
                this.filteredRegions.length = 0;

                Utilites.each(this.backupRegions, function (region) {
                    this.filteredRegions.push({ id : region.id, title : region.title });
                }, this);

                this.regionsFilterInput.val('');

                this.filterRegionsBySearchQuery();

                this.mapRegionsNumberToTheInput();
            }
        },

        applyFiltersToSubject : function (result, subjectId, subject, force) {
            if (this.filter.event || force) {
                this.addObjectsToRenderIfFilterIsOn(result, subjectId, subject, 'events', 'flag');
            }
            if (this.filter.partner || force) {
                this.addObjectsToRenderIfFilterIsOn(result, subjectId, subject, 'partners', 'partner');
            }
            if (this.filter.project || force) {
                this.addObjectsToRenderIfFilterIsOn(result, subjectId, subject, 'projects', 'partner');
            }
            if (this.filter.gr || force) {
                this.addObjectsToRenderIfFilterIsOn(result, subjectId, subject, 'gr', 'gr');
            }
            if (this.filter.listedCompany || force) {
                this.addObjectsToRenderIfFilterIsOn(result, subjectId, subject, 'listedCompanies', 'listedCompany');
            }
            if (this.filter.monitoring || force) {
                this.addObjectsToRenderIfFilterIsOn(result, subjectId, subject, 'monitoring', 'monitoring');
            }
        },

        drawSubjectAndAllObjectsOnIt : function (subjectId) {
            var subject = regionalMapJson.subjects[subjectId],
                result = {};

            this.applyFiltersToSubject(result, subjectId, subject, true);

            Map.prepareToRender();

            Utilites.each(result, function (objects, subjectId) {
                Map.displayObjectOnSubjectAndHighlightIt(objects, subjectId);
            }, this);

            Map.startRender();
        },

        catchMouseOutOnRegionsList : function () {
            ObjectsFilter.regionsFilterInput.blur(ObjectsFilter.boundedBlurHandler);
            ObjectsFilter.isBinded = true;
        },

        initialize : function (subjectId) {
            this.initializeDOMReferences();

            if (!this.regionsFilterInput.length) { return; }

            this.bindEventListeners();

            this.SHOW_ALL_ITEM = { id: 0, title : this.SHOW_ALL_REGIONS_TEXT };

            Utilites.each(regionalMapJson.subjects, function (region, id) {
                this.backupRegions.push({ id: id, title : region.title });
            }, this);

            if (subjectId) {
                Utilites.each(this.filter, function (filter, filterName) {
                    this.filter[filterName] = false;
                }, this);
                this.drawSubjectAndAllObjectsOnIt(subjectId);
                Map.drawSubject(subjectId);
            } else {
                this.filterList();
            }

            this.representFilterStateToDOM();
        }
    };
})();
