(function () {
    var $ = ipoevents.jQuery;

    /**
     * This module contains utilites which is used to control mouse movement around the map,
     * map object display and some other stuff.
     * @module map
     */
    window.Map = {
        LEFT_REGEXP : /%\{left\}/,
        CSS_CLASS_REGEXP : /%\{cssClass\}/,
        TOP_REGEXP : /%\{top\}/,
        MESSAGE_REGEXP : /%\{message\}/,
        UID_REGEXP : /%\{id\}/,
        TEMPLATES : {
            /* html template for flag object */
            flag : '<div id="%{id}" class="mapFlag %{cssClass}" style="left: %{left}px; top: %{top}px;">\
                            <div class="mapFlagstaff"></div>\
                            <div class="flagContent">&nbsp;</div>\
                            <div class="flagEnd"></div>\
                        </div>',
            partner : '<div id="%{id}" class="mapPointer partnersPointer" style="left: %{left}px; top: %{top}px;"></div>',
            gr : '<div id="%{id}" class="mapPointer grPointer" style="left: %{left}px; top: %{top}px;"></div>',
            project : '<div id="%{id}" class="mapPointer projectsPointer" style="left: %{left}px; top: %{top}px;"></div>',
            listedCompany : '<div id="%{id}" class="mapPointer listedPointer" style="left: %{left}px; top: %{top}px;"></div>',
            monitoring : '<div id="%{id}" class="mapPointer monitoringPointer" style="left: %{left}px; top: %{top}px;"></div>'
        },
        /* default radius for the small regions on central region of Russia or Causas */
        DEFAULT_SUBJECT_RADIUS : 4,
        /* delay in milliseconds to show hint when region is already highlighted */
        SHOW_HINT_TIMEOUT : 200,
        /* used to hide/show object by setting or removing that class */
        HIDDEN_CSS_CLASS : 'hidden',

        PATH_TO_IMAGES : 'MAPImages/',

        PATH_TO_EMPTY_IMAGE : 'img/empty.png',

        MAP_CONTAINER : null,
        /**
         * Used to cache dom reference to the image which display current highlighted region
         * @property selectedRegionImage
         */
        selectedRegionImage : null,
        /**
         * Used to cache dom references to the map wrapper div
         * (which is usefull to add some object to the map)
         * @property mapWrapper
         */
        mapWrapper : null,

        /**
         * Used to cache dom references to the hint window
         * @property messageWindow
         */
        hintWindow: null,

        hintWindowAditionalContent : null,

        toggleBordersButton : $('#toggleBorders'),
        toggleTextHintsButton : $('#toggleTextHints'),


        bordersLayer : null,
        titlesLayer : null,


        activeSubjects : {},


        DRAW_CANVAS : null,


        /**
         * Main handler of the "mouseover" event on the map.
         * That method also highlight region, shows tip (usually region's name) and start briefing window scrolling
         * @method catchMouseOverEvent
         * @param e {Event} MouseMove DOM Event which is used to define current target
         */
        catchMouseOverEvent : function (e) {
            var el = e.target;
            if (el && el.nodeName && el.nodeName === 'AREA') {
                // convert hash part of url to the region number
                var subjectId = Utilites.getRegionIdHref(el.href);
                if (subjectId) {
                    this.highlightSubject(subjectId);
                    this.checkRelevanceOfTheTip(subjectId);
                    BriefWindow.checkRelevanceOfTheData(subjectId);
                    setTimeout(function () {
                        Map.showHint(subjectId, (regionalMapJson.subjects[subjectId]) ? regionalMapJson.subjects[subjectId].title : '');
                    }, this.SHOW_HINT_TIMEOUT);
                    BriefWindow.startTimer(subjectId);

                    this.currentSelectedSubjectId = subjectId;
                }
            }
        },
        /**
         * Shows hint right above the region
         * @method showHint
         * @param subject {Number} id of the region
         * @param message {String} text to display
         */
        showHint : function (subject, message) {
            if (!subject || !message) { return; }
            if (this.currentSelectedSubjectId && this.currentSelectedSubjectId !== subject) { return; }

            var coordinates = SubjectsGeometry[subject].center;

            if (!coordinates) { return; }
            this.hintWindowContent[0].innerHTML = message;
            this.hintWindowAditionalContent[0].innerHTML = message;
            this.hintWindow.css({
                left : coordinates.x - (this.hintWindow.width() / 2),
                top : coordinates.y + 10
            });

            this.hintWindow.removeClass(this.HIDDEN_CSS_CLASS);
        },
        /**
         * Hides current showed hint
         * @method clearHint
         */
        clearHint : function () {
            this.hintWindow.addClass(this.HIDDEN_CSS_CLASS);
        },
        /**
         * Check if the region that is hint window asked to show on is still current region or not (used when we display
         * And clear current showed hint if necessary
         * @param regionId {Number} id of the region which is below mouse
         */
        checkRelevanceOfTheTip : function (regionId) {
            if (this.currentSelectedSubjectId && this.currentSelectedSubjectId !== regionId) { this.clearHint(); }
        },

        /**
         * Initialize some properties with real-life values
         * @method initializeDomReferences
         */
        initializeDomReferences : function () {
            this.hintWindow = $('.mapHint');
            this.hintWindowContent = this.hintWindow.find('.mapHintContent');
            this.hintWindowAditionalContent = this.hintWindow.find('.mapHintText');
            this.mapWrapper = $('.mapWrapper .map');
            this.mapTag = $('#m_map');
            this.selectedRegionImage = $('#image-highlight')[0];

            this.toggleBordersButton = $('#toggleBorders');
            this.toggleTextHintsButton = $('#toggleTextHints');
            this.bordersLayer = $('.mapRegions');
            this.titlesLayer = $('.mapTitles');

            this.MAP_CONTAINER = $('.map')[0];
        },


        /**
         * Bind event handlers to the dom objects
         * @method bindEventListeners
         */
        bindEventListeners : function () {



            this.mapTag.mousemove(this.catchMouseOverEvent.bind(this));

            this.mapTag.click(this.clickListener.bind(this));

            $('.map').mouseleave(this.mouseLeaveHandler.bind(this));

            this.toggleBordersButton.click(this.toggleBorders.bind(this));
            this.toggleTextHintsButton.click(this.toggleTextHints.bind(this));
        },
        /**
         * Bind click listener to the regions
         * @method bindClickListener
         */
        bindClickListener : function () {
            this.mapTag.click(this.clickListener.bind(this));
        },
        /**
         * Highlight mouseovered region
         * @method highlightSubject
         * @param subjectId {Number} Region to highlight (warn: this value is cached so that method actually does it's stuff
         * only if input is different from last call)
         */
        highlightSubject : function (subjectId) {
            if (this.currentSelectedSubjectId) {
                if (this.currentSelectedSubjectId === subjectId) { return; }
                if (CachedImages.highlight[this.currentSelectedSubjectId].parentNode) {
                    this.MAP_CONTAINER.removeChild(CachedImages.highlight[this.currentSelectedSubjectId]);
                }
            }

            this.MAP_CONTAINER.appendChild(CachedImages.highlight[subjectId]);
//            this.selectedRegionImage = CachedImages.highlight[subjectId];
//            this.selectedRegionImage.src = this.PATH_TO_IMAGES + subjectId + '_a.png';
        },
        /**
         * Make all region unselected
         * @method deHighlightCurrentSubject
         */
        deHighlightCurrentSubject : function () {
            if (this.currentSelectedSubjectId) {
                if (CachedImages.highlight[this.currentSelectedSubjectId].parentNode) {
                    this.MAP_CONTAINER.removeChild(CachedImages.highlight[this.currentSelectedSubjectId]);
                    this.currentSelectedSubjectId = null;
                }
            }
        },
        /**
         * Highlight region with green color
         * @method drawSubject
         * @param subjectId {Number} Subject id
         */
        drawSubject : function (subjectId) {
            if (CachedImages.draw[subjectId]) {
                this.DRAW_CANVAS[0].appendChild(CachedImages.draw[subjectId]);
            }
        },
        /**
         * Displayes object on the specified coordinates
         * @method displayObject
         * @param type {String} type of the object
         * @param message {String} Text on the object (if applicable)
         * @param cssClass {String} css class of the object (usually it's color)
         * @param coordinates {Object} hash which contain to params: { x, y } which define where to place flag
         */
        displayObject : function (type, message, cssClass, coordinates) {
            var top = new Number(coordinates.y),
                left = new Number(coordinates.x);

            top -= 18;
            left -= 4;

            var uid = Utilites.generateUID();

            var html = this.TEMPLATES[type]
                .replace(this.TOP_REGEXP, (Utilites.isUndefined(top)) ? '' : top)
                .replace(this.LEFT_REGEXP, (Utilites.isUndefined(left)) ? '' : left)
                .replace(this.CSS_CLASS_REGEXP, (Utilites.isUndefined(cssClass)) ? '' : cssClass)
                .replace(this.UID_REGEXP, uid);

            this.DRAW_CANVAS.append(html);
        },
        /**
         * Remove all displayed objects
         * @method clearObjects
         */
        clearObjects : function () {
            var drawCanvasDOMNode = (this.DRAW_CANVAS) ? this.DRAW_CANVAS[0] : {hasChildNodes : function () { return false; }};

            while (drawCanvasDOMNode.hasChildNodes()) {
                drawCanvasDOMNode.removeChild(drawCanvasDOMNode.firstChild);
            }
        },
        /**
         * Removes all highlight from all objects
         * @method unDrawAllSubjects
         */
        unDrawAllSubjects : function () {
//            Utilites.each(this.activeSubjects, function (subjectImage) {
//                subjectImage.addClass(this.HIDDEN_CSS_CLASS);
//            }, this);
        },
        /**
         * Displays flag on the center of region, specified by it's Id
         * @method displayFlagByRegionId
         * @param type {String} Type of the object
         * @param message {String} Text on the flag
         * @param cssClass {String} css color of the flag (usually it's color)
         * @param subjectId {Number} subject id
         */
        displayObjectBySubjectId : function (type, message, cssClass, subjectId) {
            var coordinates = SubjectsGeometry[subjectId].center;
            this.displayObject(type, message, cssClass, coordinates);
        },
        /**
         * Displays multiple object on the region (thus method correctly handled multiple and single objects)
         * @method displayMultipleObjectsOnSubject
         * @param objectToDisplay {Array} array of the objects
         * @param subjectId {Number} id of the subject
         */
        displayMultipleObjectsOnSubject : function (objectToDisplay, subjectId) {
            objectToDisplay = Utilites.convertToArray(objectToDisplay);

            var subject = SubjectsGeometry[subjectId],
                delta,
                alpha,
                length = objectToDisplay.length,
                radius = (subject.radius || this.DEFAULT_SUBJECT_RADIUS);

            if (length == 1) {
                var obj = objectToDisplay[0];
                this.displayObjectBySubjectId(obj.type, obj.message, obj.cssClass, subjectId);
            } else {
                // caclulate positions of the object, using radius of the region and it center coordinates
                delta = (2 * Math.PI) / length;

                Utilites.each(objectToDisplay, function (object, index) {
                    alpha = (index) * delta; // define angle


                    this.displayObject(object.type, object.message, object.cssClass, {
                        x : Math.round(radius * Math.sin((Math.PI / 2) - alpha)) + subject.center.x,
                        y : Math.round(radius * Math.sin(alpha)) + subject.center.y + 4
                    });
                }, this);
            }
        },
        /**
         * Display objects on the region and highlight that region
         * @method displayObjectOnRegionAndHighlightIt
         * @param objects {Array} array of the objects
         * @param subjectId {Number} id of the subject
         */
        displayObjectOnSubjectAndHighlightIt : function (objects, subjectId) {
            if ((objects && !Utilites.isArray(objects)) || (Utilites.isArray(objects) && objects.length)) {
                this.displayMultipleObjectsOnSubject(objects, subjectId);
                this.drawSubject(subjectId);
            }
        },
        /**
         * Redirect browser to the page of the region which user clicks
         * @method clickListener
         * @param e
         */
        clickListener : function (e) {
            var el = e.target;

            if (el && el.nodeName && el.nodeName === 'AREA') {
                var hashObject = Utilites.getObjectFromHashTag(el.href);
                if (hashObject && hashObject.region) {
                    window.location = '/regions/' + hashObject.region;
                }
            }
        },

        /**
         * Toggle visibility of borders (used as event listener on the "toggle borders" button
         * @method toggleBorders
         */
        toggleBorders : function () {
            this.toggleBordersButton.toggleClass(ObjectsFilter.ACTIVE_CSS_CLASS);
            this.bordersLayer.toggleClass(this.HIDDEN_CSS_CLASS);
        },

        /**
         * Toggles visibility of the regions centers and their's titles
         * @method toggleTextHints
         */
        toggleTextHints : function () {
            this.toggleTextHintsButton.toggleClass('active');
            this.titlesLayer.toggleClass(this.HIDDEN_CSS_CLASS);
        },
        /**
         * removes all highlighted regions from map, stops animation on brief window
         * @method mouseLeaveHandler
         */
        mouseLeaveHandler : function () {
            this.deHighlightCurrentSubject();
            setTimeout(this.clearHint.bind(this), this.SHOW_HINT_TIMEOUT);

            setTimeout(function () {
                BriefWindow.shutDown(true);
            }, BriefWindow.SHOW_REGION_INFO_TIMEOUT);
        },
        
        prepareToRender : function () {
            this.DRAW_CANVAS.addClass(ObjectsFilter.HIDDEN_CSS_CLASS);
            this.clearObjects();
        },

        startRender : function () {
            this.DRAW_CANVAS.removeClass(ObjectsFilter.HIDDEN_CSS_CLASS);
        },
        /**
         * Start of the map work.
         * This method initializes dom references, bindes event listeners and displays current active regions.
         * @method initialize
         */
        initialize : function () {
            this.initializeDomReferences();
            this.bindEventListeners();

            this.DRAW_CANVAS = $(document.createElement('div'));
            this.mapWrapper.append(this.DRAW_CANVAS);
        }
    };

})();