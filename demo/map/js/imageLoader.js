(function () {

    var $ = ipoevents.jQuery;

    window.CachedImages = {
        draw : {},
        highlight : {}
    };
    /**
     * Preload images before map initialization
     * todo: implement DUI Stream ( http://github.com/digg/stream )  for non-ie browsers.
     */
    window.ImageLoader = {
        PATH_TO_IMAGE_DIRECTORY : 'MAPImages/',
        IMAGES_URLS : [
            "100_a.png",
            "100_h.png",
            "101_a.png",
            "101_h.png",
            "102_a.png",
            "102_h.png",
            "103_a.png",
            "103_h.png",
            "104_a.png",
            "104_h.png",
            "105_a.png",
            "105_h.png",
            "106_a.png",
            "106_h.png",
            "107_a.png",
            "107_h.png",
            "108_a.png",
            "108_h.png",
            "109_a.png",
            "109_h.png",
            "10_a.png",
            "10_h.png",
            "110_a.png",
            "110_h.png",
            "11_a.png",
            "11_h.png",
            "12_a.png",
            "12_h.png",
            "13_a.png",
            "13_h.png",
            "14_a.png",
            "14_h.png",
            "15_a.png",
            "15_h.png",
            "16_a.png",
            "16_h.png",
            "17_a.png",
            "17_h.png",
            "18_a.png",
            "18_h.png",
            "19_a.png",
            "19_h.png",
            "1_a.png",
            "1_h.png",
            "21_a.png",
            "21_h.png",
            "22_a.png",
            "22_h.png",
            "23_a.png",
            "23_h.png",
            "24_a.png",
            "24_h.png",
            "25_a.png",
            "25_h.png",
            "26_a.png",
            "26_h.png",
            "27_a.png",
            "27_h.png",
            "28_a.png",
            "28_h.png",
            "29_a.png",
            "29_h.png",
            "2_a.png",
            "2_h.png",
            "30_a.png",
            "30_h.png",
            "31_a.png",
            "31_h.png",
            "32_a.png",
            "32_h.png",
            "33_a.png",
            "33_h.png",
            "34_a.png",
            "34_h.png",
            "35_a.png",
            "35_h.png",
            "36_a.png",
            "36_h.png",
            "37_a.png",
            "37_h.png",
            "38_a.png",
            "38_h.png",
            "39_a.png",
            "39_h.png",
            "3_a.png",
            "3_h.png",
            "40_a.png",
            "40_h.png",
            "41_a.png",
            "41_h.png",
            "42_a.png",
            "42_h.png",
            "43_a.png",
            "43_h.png",
            "44_a.png",
            "44_h.png",
            "45_a.png",
            "45_h.png",
            "46_a.png",
            "46_h.png",
            "47_a.png",
            "47_h.png",
            "48_a.png",
            "48_h.png",
            "49_a.png",
            "49_h.png",
            "4_a.png",
            "4_h.png",
            "50_a.png",
            "50_h.png",
            "51_a.png",
            "51_h.png",
            "52_a.png",
            "52_h.png",
            "53_a.png",
            "53_h.png",
            "54_a.png",
            "54_h.png",
            "55_a.png",
            "55_h.png",
            "56_a.png",
            "56_h.png",
            "57_a.png",
            "57_h.png",
            "58_a.png",
            "58_h.png",
            "59_a.png",
            "59_h.png",
            "5_a.png",
            "5_h.png",
            "60_a.png",
            "60_h.png",
            "61_a.png",
            "61_h.png",
            "62_a.png",
            "62_h.png",
            "63_a.png",
            "63_h.png",
            "64_a.png",
            "64_h.png",
            "65_a.png",
            "65_h.png",
            "66_a.png",
            "66_h.png",
            "67_a.png",
            "67_h.png",
            "68_a.png",
            "68_h.png",
            "69_a.png",
            "69_h.png",
            "6_a.png",
            "6_h.png",
            "70_a.png",
            "70_h.png",
            "71_a.png",
            "71_h.png",
            "72_a.png",
            "72_h.png",
            "73_a.png",
            "73_h.png",
            "74_a.png",
            "74_h.png",
            "75_a.png",
            "75_h.png",
            "76_a.png",
            "76_h.png",
            "79_a.png",
            "79_h.png",
            "7_a.png",
            "7_h.png",
            "83_a.png",
            "83_h.png",
            "86_a.png",
            "86_h.png",
            "87_a.png",
            "87_h.png",
            "89_a.png",
            "89_h.png",
            "8_a.png",
            "8_h.png",
            "9_a.png",
            "9_h.png"
        ],
        COUNTER : 0,
        TIMER : null,
        DELAY : 999, // handles 404 errors on IE
        UPDATE_INTERVAL : null,
        UPDATE_TIMEOUT : 200,
        UPDATE : function () {
        },
        FINAL_CALLBACK : function () {
        },
        LENGTH : 0,
        BOUNDED_ON_COMPLETE : null,
        LOADED_INDEXES : {},
        CONNECTIONS_NUMBER : 1,
        load : function (index) {
            if (this.IMAGES_URLS[index]) {
                var url = this.IMAGES_URLS[index];
                var img = new Image();
                img.style.zIndex = 25;
                img.style.top = 0;
                img.style.left = 0;
                img.style.position = 'absolute';
                img.setAttribute('width', '761px');
                img.setAttribute('height', '452px');

                img.id = 'image-highlight-' + url.split('.', 1)[0];

                var fn = this.generateHandler(img, index);
                $(img).bind('error load onreadystatechange', fn);
                this.TIMER = setTimeout(fn, this.DELAY);
                img.src = this.PATH_TO_IMAGE_DIRECTORY + url;
            }
        },
        onComplete : function (img, index) {
            clearTimeout(this.TIMER);
            if (!this.LOADED_INDEXES[index]) {
                this.LOADED_INDEXES[index] = true;
                if (this.isImageOk(img)) {
                    var imageDetails = img.id.split('-', 3)[2].split('_', 2),
                        subjectId = imageDetails[0],
                        type = (imageDetails[1] == 'h') ? 'draw' : 'highlight';

                    CachedImages[type][subjectId] = img;

                    this.load(++this.COUNTER);
                }
            }

            if (this.COUNTER == this.LENGTH) {
                clearInterval(this.UPDATE_INTERVAL);
                this.UPDATE_INTERVAL = null;
                this.FINAL_CALLBACK();
            }
        },

        generateHandler : function (img, index) {
            return function () {
                ImageLoader.BOUNDED_ON_COMPLETE(img, index);
            };
        },
        initialize : function (update, finalCallback) {
            this.setUpdate(update);
            this.setFinalCallback(finalCallback);
            this.LENGTH = this.IMAGES_URLS.length;
            this.BOUNDED_ON_COMPLETE = this.onComplete.bind(this);
            this.defineNumberOfSimultaneousConnections();
        },

        setUpdate : function (update) {
            this.UPDATE = update || this.UPDATE;
        },
        setFinalCallback : function (callback) {
            this.FINAL_CALLBACK = callback || this.FINAL_CALLBACK;
        },
        start : function () {
            for (var i = 0; i < this.CONNECTIONS_NUMBER; i++) {
                this.load(i);
            }            

            this.UPDATE_INTERVAL = setInterval(this.UPDATE.bind(this), this.UPDATE_TIMEOUT);
        },
        defineNumberOfSimultaneousConnections : function () {
            if ($.browser.msie && parseInt($.browser.version, 0) == 8) {
                this.CONNECTIONS_NUMBER = 5;
            } else if ($.browser.safari) {
                this.CONNECTIONS_NUMBER = 3;
            } else if ($.browser.mozilla) {
                this.CONNECTIONS_NUMBER = 5;
            }
        },
        isImageOk : function (img) {
            // During the onload event, IE correctly identifies any images that
            // weren't downloaded as not complete. Others should too. Gecko-based
            // browsers act like NS4 in that they report this incorrectly.
            // todo: properly test it. I've commented it out 'cause it have introduced strange bugs on ie7.
            /*if (!img.complete) {
                return false;
            }*/

            // However, they do have two very useful properties: naturalWidth and
            // naturalHeight. These give the true size of the image. If it failed
            // to load, either of these should be zero.
            if (typeof img.naturalWidth != 'undefined' && img.naturalWidth == 0) {
                return false;
            }
            
            // No other way of checking: assume it's ok.
            return true;
        }
    };

})();