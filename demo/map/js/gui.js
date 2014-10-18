(function () {

    var $ = ipoevents.jQuery;
    /**
     * Module, which contains non-business logic functionality, which is related to user interface.
     */
    window.GUI = {
        contentArrows : null,
        CONTENT_CLUSTER_CSS_CLASS : 'contentCluster',
        HIDEABLE_CONTENT_CSS_CLASS : 'hideAbleContent',
        HIGHLIGHTED_TABLE_ROW_CSS_CLASS : 'highlighted',
        dropDownMenu : null,
        cachedHighlightedDropDownMenuTableRow : null,

        eventListLeftButton : null,

        eventListRightButton : null,

        toggleMapVisibilityButton : null,

        isShown : true,

        useAnimation : ($.browser.msie) ? false : true,

        ANIMATION_SPEED : 100,

        cachedCSSProperties : {
            streamBarButtonsBackgroundImageAddress : null,

            streamBarCssTop : null,

            mapWrapperHeight : null,

            eventsListHeight : null,

            joinTheCommunityHeight : null,

            eventsStreamHeight : null,

            contentElementBackgroundImage : null
        },
        

        initializeDOMReferences : function () {
            this.contentArrows = $('.contentArrow');
            this.dropDownMenu = $('.subMenuFieldTable');

            this.eventListLeftButton = $('.eventsListLeftArrowNoMore');
            this.eventListRightButton = $('.eventsListRightArrow');
            this.toggleMapVisibilityButton = $('.hideMap');
        },
        bindEventListeners : function () {
            this.contentArrows.click(this.toggleContentVisibility);
            this.dropDownMenu.mouseover(this.highlightTableRow);
            
            this.toggleMapVisibilityButton.click(this.toggleMapVisibility.bind(this));
        },
        toggleContentVisibility : function () {
            $(this).parents('.' + GUI.CONTENT_CLUSTER_CSS_CLASS)
                   .find('.' + GUI.HIDEABLE_CONTENT_CSS_CLASS)
                       .slideToggle('fast', function () {
                            $(this).parents('.' + GUI.CONTENT_CLUSTER_CSS_CLASS).toggleClass('open');
                        });
        },
        
        tableWorks : function() {
            $('.tableWrapper table.separatedTable th:not(.noSeparated)').each(function () {
                var $this = $(this),
                    elOffset = $this.position();
                    height = $this.height(),
                    el = document.createElement('div');
                el.className = 'tableSeparator';
                el = $(el);
                el.height(height+20);
                el.css("left", elOffset.left+20);
                $this.append(el);
            });

            $('.tableWrapper table.separatedTable').each(function () {
                var $h = $(this).find('tr').height(),
                    $this = $(this),
                    el1 = document.createElement('div');
                    el2 = document.createElement('div');
                    el3 = document.createElement('div');
                    el4 = document.createElement('div');
                el1.className = 'leftTopTableCorner';
                el2.className = 'rightTopTableCorner';
                el3.className = 'leftBottomTableCorner';
                el4.className = 'rightBottomTableCorner';
                $(el3).css('top', $h-3);
                $(el4).css('top', $h-3);
                el1 = $(el1);
                el2 = $(el2);
                el3 = $(el3);
                el4 = $(el4);
                $this.parent('.tableWrapper').append(el1);
                $this.parent('.tableWrapper').append(el2);
                $this.parent('.tableWrapper').append(el3);
                $this.parent('.tableWrapper').append(el4);
            });
        },
        highlightTableRow : function (e) {
            var el = e.target;
            if (el && el.nodeName && el.nodeName == 'TD') {
                while (el && el.nodeName && el.nodeName != 'DOCUMENT') {
                    el = el.parentNode;
                    if (el.nodeName == 'TR') { break; }
                }

                if (GUI.cachedHighlightedDropDownMenuTableRow) {
                    GUI.cachedHighlightedDropDownMenuTableRow.className = GUI.cachedHighlightedDropDownMenuTableRow.className.replace(GUI.HIGHLIGHTED_TABLE_ROW_CSS_CLASS, '');
                }
                GUI.cachedHighlightedDropDownMenuTableRow = el;
                el.className += ' ' + GUI.HIGHLIGHTED_TABLE_ROW_CSS_CLASS;
            }
        },

        dontAllowToSelectTextOnMenuButtons : function () {


            if ($.browser.msie) {
                $('#eventFilter, #toggleAllButton, #partnerFilter, #grFilter, #projectFilter, #listedCompanyFilter, #monitoringFilter, \
                   #organizersSection, #eventsSection, #showPresentEvents, #showFutureEvents, #showPastEvents, #turnOnAllTimeFilters').each(function () {
                    this.onselectstart = function () { return false; };
                });
            } else {
                $('#eventFilter, #toggleAllButton, #partnerFilter, #grFilter, #projectFilter, #listedCompanyFilter, #monitoringFilter, \
                   #organizersSection, #eventsSection, #showPresentEvents, #showFutureEvents, #showPastEvents, #turnOnAllTimeFilters').mousedown(function () {
                    return false;
                });
            }

        },

        /**
         * Hide map, brief window, object filter
         * @method hideAll
         * @param animate {String} should we do animation or not
         */
        hideAll : function (animate) {
            if (animate) {

                $('.eventsList').animate({
                    height : 0
                }, GUI.ANIMATION_SPEED, function () {
                    $('.eventsList').css('display', 'none');
                });

                $('.joinTheComunity').animate({
                    height : 0
                }, GUI.ANIMATION_SPEED, function () {
                    $('.joinTheComunity').css('display', 'none');
                });

                GUI.eventListLeftButton.addClass(Map.HIDDEN_CSS_CLASS);
                GUI.eventListRightButton.addClass(Map.HIDDEN_CSS_CLASS);

                $('.eventsStream').animate({
                    height : 0
                }, GUI.ANIMATION_SPEED, function () {
                    $('.eventsStream').css('display', 'none');
                    Map.toggleBordersButton.addClass(Map.HIDDEN_CSS_CLASS);
                    Map.toggleTextHintsButton.addClass(Map.HIDDEN_CSS_CLASS);
                    $('.streamBarButtons').css('background-image', 'url(' + Map.PATH_TO_EMPTY_IMAGE + ')');
                    $('.subMenu').hide('slide', {
                        direction : 'right'
                    }, 'fast', function () {
                        $('.content').find('.contentCluster:first .contentElement').css('background-image', 'url(' + Map.PATH_TO_EMPTY_IMAGE + ')');

                        $('.streamBar').css('top', '105px');

                        $('.mapWrapper').animate({
                            height : 0
                        }, GUI.ANIMATION_SPEED, function () {
                            $('.mapWrapper').hide();
                        });
                    });
                });
            } else {
                $('.eventsList').addClass(Map.HIDDEN_CSS_CLASS);
                $('.joinTheComunity').addClass(Map.HIDDEN_CSS_CLASS);
                $('.eventsStream').addClass(Map.HIDDEN_CSS_CLASS);
                Map.toggleBordersButton.addClass(Map.HIDDEN_CSS_CLASS);
                Map.toggleTextHintsButton.addClass(Map.HIDDEN_CSS_CLASS);
                $('.streamBarButtons').css('background-image', 'url(' + Map.PATH_TO_EMPTY_IMAGE + ')');
                $('.subMenu').addClass(Map.HIDDEN_CSS_CLASS);
                $('.content').find('.contentCluster:first .contentElement').css('background-image', 'url(' + Map.PATH_TO_EMPTY_IMAGE + ')');
                $('.streamBar').css('top', '105px');
                $('.mapWrapper').addClass(Map.HIDDEN_CSS_CLASS);

                GUI.eventListLeftButton.addClass(Map.HIDDEN_CSS_CLASS);
                GUI.eventListRightButton.addClass(Map.HIDDEN_CSS_CLASS);
            }
        },
        /**
         * Show map, brief window, objects filter
         * @method showAll
         * @param animate {String} should we do animation or not
         */
        showAll : function (animate) {
            if (animate) {
                $('.subMenu').show('slide', GUI.ANIMATION_SPEED, function () {
                    $('.streamBar').css('top', GUI.cachedCSSProperties.streamBarCssTop);
                    $('.content').find('.contentCluster:first .contentElement').css('background-image', GUI.cachedCSSProperties.contentElementBackgroundImage);
                    Map.toggleBordersButton.removeClass(Map.HIDDEN_CSS_CLASS);
                    Map.toggleTextHintsButton.removeClass(Map.HIDDEN_CSS_CLASS);
                    $('.streamBarButtons').css('background-image', GUI.cachedCSSProperties.streamBarButtonsBackgroundImageAddress);

                    $('.mapWrapper').animate({
                        height : GUI.cachedCSSProperties.mapWrapperHeight
                    }, GUI.ANIMATION_SPEED, function () {
                        $('.eventsList').animate({
                            height : GUI.cachedCSSProperties.eventsListHeight
                        }, GUI.ANIMATION_SPEED, function () {
                            $('.eventsList').css('display', 'block');
                        });

                        $('.joinTheComunity').animate({
                            height : GUI.cachedCSSProperties.joinTheCommunityHeight
                        }, GUI.ANIMATION_SPEED, function () {
                            $('.joinTheComunity').css('display', 'block');
                        });

                        $('.eventsStream').animate({
                            height : GUI.cachedCSSProperties.eventsStreamHeight
                        }, function () {
                            $('.eventsStream').css('display', 'block');

                        });

                        GUI.eventListLeftButton.removeClass(Map.HIDDEN_CSS_CLASS);
                        GUI.eventListRightButton.removeClass(Map.HIDDEN_CSS_CLASS);
                    });
                });
            } else {
                $('.eventsList').removeClass(Map.HIDDEN_CSS_CLASS);
                $('.joinTheComunity').removeClass(Map.HIDDEN_CSS_CLASS);
                $('.eventsStream').removeClass(Map.HIDDEN_CSS_CLASS);
                Map.toggleBordersButton.removeClass(Map.HIDDEN_CSS_CLASS);
                Map.toggleTextHintsButton.removeClass(Map.HIDDEN_CSS_CLASS);
                $('.streamBarButtons').css('background-image', GUI.cachedCSSProperties.streamBarButtonsBackgroundImageAddress);
                $('.subMenu').removeClass(Map.HIDDEN_CSS_CLASS);
                $('.streamBar').css('top', GUI.cachedCSSProperties.streamBarCssTop);
                $('.mapWrapper').removeClass(Map.HIDDEN_CSS_CLASS);

                GUI.eventListLeftButton.removeClass(Map.HIDDEN_CSS_CLASS);
                GUI.eventListRightButton.removeClass(Map.HIDDEN_CSS_CLASS);
            }
        },

        /**
         * Toggle map, brief window and objects filter visibility
         * @method toggleMapVisibility
         */
        toggleMapVisibility : function () {
            if (this.isShown) {
                BriefWindow.stopAnimation();
                this.hideAll(this.useAnimation);
                this.isShown = false;
            } else {
                this.showAll(this.useAnimation);
                this.isShown = true;
            }
        },

        applyFonts : function () {
            Cufon.replace('.megaTitle');
            Cufon.replace('.megaSubTitle');
            Cufon.replace('.mainMenuContent li');
            Cufon.replace('.sponsorsName');
            Cufon.replace('.sponsorsPost');
            Cufon.replace('.right h3');
            Cufon.replace('.aboutMenu');
            Cufon.replace('.aboutLinks');
            Cufon.replace('.partnersTitle');
            Cufon.replace('h1');
            Cufon.replace('h2');
        },

        /**
         * Remember css properties of the map (like height, width etc.)
         * @method initializeCSSProperties
         */
        initializeCSSProperties : function () {
            this.cachedCSSProperties.streamBarButtonsBackgroundImageAddress = $('.streamBarButtons').css('background-image');
            this.cachedCSSProperties.streamBarCssTop = $('.streamBar').css('top');
            this.cachedCSSProperties.mapWrapperHeight = $('.mapWrapper').height();
            this.cachedCSSProperties.eventsListHeight = $('.eventsList').height();
            this.cachedCSSProperties.joinTheCommunityHeight = $('.joinTheComunity').height();
            this.cachedCSSProperties.eventsStreamHeight = $('.eventsStream').height();
            this.cachedCSSProperties.contentElementBackgroundImage = $('.content').find('.contentCluster:first .contentElement').css('background-image');
        },

        initialize : function () {
	        this.applyFonts();
            this.dontAllowToSelectTextOnMenuButtons();
            this.initializeDOMReferences();
            this.initializeCSSProperties();
            this.bindEventListeners();
            this.tableWorks();
        }
    };
})();