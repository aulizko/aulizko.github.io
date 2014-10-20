(function () {
    /**
     * Entry point for application
     */
    window.MapManager = {
        initialize : function () {
            GUI.initialize();

            Logger.initialize();
            Logger.showMessage('<div class="loaderIndicator"></div><span class="loaderPercentage">0</span>  / 100% is loaded.');

            var percentageLoader = ipoevents.jQuery('.loaderPercentage');
            var cachedPercent = 0;

            ImageLoader.initialize(function () {
                var percent = ((this.COUNTER / this.LENGTH) * 100).toFixed(0);
                if (cachedPercent != percent) {
                    percentageLoader.text(percent);
                    cachedPercent = percent;
                }
            }, function () {
                Logger.hideMessage();
                Logger.showWelcomeMessage();

                BriefWindow.initialize();
                Map.initialize();
                ObjectsFilter.initialize();
                EventsList.initialize();
                CustomScroll.initialize();
                EventsFilter.initialize();
            });

            ImageLoader.start();
        }
    };

})();