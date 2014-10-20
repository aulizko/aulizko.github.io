(function () {
    var Dom = {
        get : function (el) { 
            return (el && el.nodeType) ? el : document.getElementById(el); 
        },
        addListener : function (el, type, fn) { 
                if (document.body.addEventListener) { 
                    return function (el, type, fn) { 
                        el.addEventListener(type, fn, false); 
                    }; 
                } else if (document.body.attachEvent) { 
                    return function (el, type, fn) { 
                        el.attachEvent('on' + type, fn); 
                    }; 
                } else { 
                    return function (el, type, fn) { 
                        el['on' + type] = fn; 
                    }; 
                } 
            }(),
        removeListener : function (el, type, fn) { 
                if (document.body.removeEventListener){ 
                    return function (el, type, fn) { 
                        el.removeEventListener(type, fn, false); 
                    }; 
                } else if (document.body.detachEvent) { 
                    return function (el, type, fn) { 
                        el.detachEvent('on' + type, fn); 
                    }; 
                } else { 
                    return function (el, type, fn) { 
                        el['on' + type] = function () { return true; }; 
                    }; 
                } 
            }(),
        hide : function (el) {
            el.style.display = 'none';
        },
        show : function (el) {
            el.style.display = 'block';
        }
    },
    
    allThat = window.allThat;
    
    allThat.Bookmarklet = function () {
        // where to send user data and where from take wishlists list
        var wishlistsLocation = allThat.server + 'wishlists/',
        sendTo = allThat.server + 'wishes/',
        
        // bookmarklet window html code
        innerHTML = '<div id="allthat-wish"><div class="allthat-saving" id="allthat-throbber">saving...</div><div id="allthat-logo"><span>AllThat</span></div><button title="close" id="allthat-close"><span>close</span></button><h1><span>Add To Wishlist</span></h1><form action=""><div class="allthat-field"><label for="allthat-product">Product Name:</label><br /><input type="text" name="product" value="(Ex: Black iPhone Adapter)" class="allthat-sample-value" id="allthat-product" /></div>	<div class="allthat-field"><label for="allthat-wishlist">Add to List:</label><br /><select name="wishlist" id="allthat-wishlist"></select></div><fieldset id="allthat-low-price">	<h2>Low Price Alerts!</h2>			<div class="allthat-field" id="allthat-range"><label for="allthat-minprice">How much would you like to pay?</label><br /><input type="text" name="minprice" value="(min)" class="allthat-sample-value" id="allthat-minprice" />to<input type="text" name="maxprice" value="(max)" class="allthat-sample-value" id="allthat-maxprice" /></div><h3>Alert me via:</h3><fieldset id="allthat-alerts"><input type="checkbox" name="email" id="allthat-email" /><label for="allthat-email" id="allthat-email-label">Email</label><br /><input type="checkbox" name="sms" id="allthat-sms" /><label for="allthat-sms" id="allthat-sms-label">SMS</label><br /><input type="checkbox" name="twitter" id="allthat-twitter" /><label for="allthat-twitter" id="allthat-twitter-label">Twitter</label><br /><select name="frequency" id="allthat-frequency"><option value="0" selected="selected">-- Alert Frequency --</option><option value="1">Daily</option><option value="7">Weekly</option><option value="30">Monthly</option></select></fieldset></fieldset><button title="Add" id="allthat-add"><span>Add</span></button></form><div id="allthat-errors" style="color:red;"/></div>',
        
        // dom elements:
        container = document.createElement('div'),
        errorDiv,
        alertFrequencyDropdown,
        wishlistsDropdown,
        wishlistsWrapper,
        savingThrobber,
        closeButton,
        titleInput,
        minPriceInput,
        maxPriceInput,
        sendButton,
        alerts = {},
        
        // input default values:
        titleDefaultValue = '(Ex: Black iPhone Adapter)',
        minPriceDefaultValue = '(min)',
        maxPriceDefaultValue = '(max)',
        
        // errors array - used for validation
        errors = [],
        errorMessages = {
            titleEmpty : 'Please enter product name',
            wishlistNotSelected : 'Please chose list',
            frequencyNonSelected : 'Please chose alert frequency'
        };
        
        // append bookmarklet window html to the target page
        function createTemplate () {
            container.innerHTML = innerHTML;
            document.body.appendChild(container);
        };
        // initialize javascript references to the Dom elements
        function initializeDomElementsReferences () {
            errorDiv = Dom.get('allthat-errors');
            alertFrequencyDropdown = Dom.get('allthat-frequency');
            wishlistsDropdown = Dom.get('allthat-wishlist');
            wishlistsWrapper = wishlistsDropdown.parentNode;
            savingThrobber = Dom.get('allthat-throbber');
            closeButton = Dom.get('allthat-close');
            titleInput = Dom.get('allthat-product');
            minPriceInput = Dom.get('allthat-minprice');
            maxPriceInput = Dom.get('allthat-maxprice');
            sendButton = Dom.get('allthat-add');
            alerts.email = Dom.get('allthat-email');
            alerts.sms = Dom.get('allthat-sms');
            alerts.twitter = Dom.get('allthat-twitter');
        };
        // disable wishlist dropdown before server response with wishlists array doesn't arrive
        function initializeGUI () {
            wishlistsDropdown.disabled = 'disabled';
            wishlistsDropdown.style.width = '90%';
            wishlistsWrapper = wishlistsDropdown.parentNode;
            wishlistsWrapper.style.background = 'transparent url(' + allThat.server + 'images/bookmarklet/ajax-loader-blue.gif) no-repeat right';
            Dom.hide(savingThrobber);
        };
        // bind event listeners to the controls
        function attachListeners () {
            Dom.addListener(closeButton, 'click', destroy);
            Dom.addListener(titleInput, 'focus', function () {if (titleInput.value == titleDefaultValue) activateInput(titleInput);});
            Dom.addListener(minPriceInput, 'focus', function () {if (minPriceInput.value == minPriceDefaultValue) activateInput(minPriceInput);});
            Dom.addListener(maxPriceInput, 'focus', function () {if (maxPriceInput.value == maxPriceDefaultValue) activateInput(maxPriceInput);});
            Dom.addListener(sendButton, 'click', function (e) { e = e || window.event; if (e.preventDefault) e.preventDefault(); addItemToList(); return false;});
        };
        
        // validators
        function validateItemTitlePresence () {
            var t = titleInput.value;
            if (t.replace(/^\s+|\s+$/, '').length == 0 || t == titleDefaultValue) errors.push(errorMessages.titleEmpty);
        };
        
        function validateWishlistPresence () {
            if (typeof wishlistsDropdown.value === 'undefined') errors.push(errorMessages.wishlistNotSelected);
        };
        
        function validateFrequencyPresence () {
            for (var alert in alerts) { 
                if (alerts[alert].checked && alertFrequencyDropdown.value == 0) {
                    errors.push(errorMessages.frequencyNonSelected); 
                    return;
                }
            }
        };
        
        function validate () {
            errors.length = 0;
            validateItemTitlePresence();
            validateWishlistPresence();
            validateFrequencyPresence();
            return errors.length == 0;
        };
        
        function displayErrors () {
            var output = '', error, i = 0;
            while (error = errors[i++]) {
                output += error + '<br/>';
            }
            
            errorDiv.innerHTML = output;
        };
        
        // this function called if user clicks on the 'send' button
        // so that we need to validate data, and, if it's all ok,
        // send request to server. Also, we show throbber and setup callback which would stop it
        function addItemToList () {
            if (validate()) {
                sendItemOnServer();
            }
            displayErrors();
        };
        
        // serialize data into string, show loader and call sendRequest method
        function sendItemOnServer () {
            var data = 'title=' + encodeURIComponent(titleInput.value) + '&wishlist=' + wishlistsDropdown.value;
            
            var temp = minPriceInput.value;
            data += (temp == '' || temp == minPriceDefaultValue) ? '' : ('&minPrice=' + temp);
            temp = maxPriceInput.value;
            data += (temp == '' || temp == maxPriceDefaultValue) ? '' : ('&maxPrice=' + temp);
            
            data += '&alerts=[';
            for (var alert in alerts) { 
                var a = alerts[alert];
                if (a.checked) {
                    data += a.name;
                }
            }
            data += ']';
            data += '&alertFrequency=' + alertFrequencyDropdown.value;
            
            showLoader();
            sendRequest(sendTo, data, 'itemAdded');
        };
        
        // clear inputs
        function clearFields () {
            hideLoader();
            activateInput (titleInput);
            activateInput (minPriceInput);
            activateInput (maxPriceInput);
            for (var alert in alerts) alerts[alert].checked = false;
        };
        
        // misc - remove default value and make font color black
        function activateInput (el) {
            el.className = '';
            el.value = '';
        };
        
        // feed wishlists dropdown with data and enable it
        function activateWhishlistsDropdown (response) {
            var w = response.wishlists, 
                i = 0, 
                wishlist, 
                opt;
            while(wishlist = w[i++]) {
                opt = document.createElement("option");
				opt.appendChild(document.createTextNode(wishlist.title));
				opt.setAttribute("value", wishlist.id);
				wishlistsDropdown.appendChild(opt);
            }
            wishlistsDropdown.disabled = false;
            wishlistsDropdown.style.width = '100%';
            wishlistsWrapper.style.background = '';
        };
        
        // remove every track of bookmarklet from the page
        function destroy () {
            removeEventListeners();
            removeDOMReferences();
            container.parentNode.removeChild(container);
            allThat.css.parentNode.removeChild(allThat.css);
            allThat.script.parentNode.removeChild(allThat.script);
            allThat = null;
        };
        // to prevent memory leaks on ie6 - remove all js to dom references
        function removeDOMReferences () {
            errorDiv = null;
            alertFrequencyDropdown = null;
            wishlistsDropdown = null;
            wishlistsWrapper = null;
            savingThrobber = null;
            closeButton = null;
            titleInput = null;
            minPriceInput = null;
            maxPriceInput = null;
            sendButton = null;
            alerts.email = null;
            alerts.sms = null;
            alerts.twitter = null;
        };
        // to prevent memory leaks - remove all event listeners
        function removeEventListeners () {
            Dom.removeListener(closeButton, 'click', destroy);
            Dom.removeListener(titleInput, 'focus', function () {if (titleInput.value == titleDefaultValue) activateInput(titleInput);});
            Dom.removeListener(minPriceInput, 'focus', function () {if (minPriceInput.value == minPriceDefaultValue) activateInput(minPriceInput);});
            Dom.removeListener(maxPriceInput, 'focus', function () {if (maxPriceInput.value == maxPriceDefaultValue) activateInput(maxPriceInput);});
            Dom.removeListener(sendButton, 'click', function (e) { e = e || window.event; if (e.preventDefault) e.preventDefault(); addItemToList(); return false;});
        };
        
        // create dynamic script element and remove it immediately after it load
        function sendRequest (url, data, callback) {
            var head = document.getElementsByTagName('head')[0],
                script = document.createElement('script'),
                noCacheIE = '&noCacheIE=' + (new Date()).getTime(),
                fullUrl = url + '?callback=' + encodeURIComponent(callback) + '&userId=' + allThat.userId+ ((data) ? ('&' + data) : '') + noCacheIE;
                
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('src', fullUrl);
            script.setAttribute('charset', 'utf-8');
            alert(fullUrl);
            head.appendChild(script);
            script.onload = script.onreadystatechange = function(){
                alert('bo!');
                // prevent memory leaks in ie
				script.onload = script.onreadystatechange = null;
                // head.removeChild( script );
				script = null;
				head = null;
			};
        };
        
        // misc - hide send button and show saving throbber instead
        function showLoader () {
            Dom.show(savingThrobber);
            Dom.hide(sendButton);
        };
        // misc - hide saving throbber and show send button instead
        function hideLoader () {
            Dom.hide(savingThrobber);
            Dom.show(sendButton);
        };
        
        return {
            initialize : function () {
                createTemplate();
                initializeDomElementsReferences();
                initializeGUI();
                attachListeners();
                sendRequest(wishlistsLocation, null, 'loadWishlists');
            },
            
            destroy : function () {
                destroy();
            },
            
            loadWishlists : activateWhishlistsDropdown,
            
            itemAdded : clearFields
        };
    }();
    
    // to prevent memory leaks, remove all js <-> dom references, including dom elements references and event listeners
    Dom.addListener(window, 'unload', function () {
        if (allThat) allThat.Bookmarklet.destroy();
        Dom.removeListener(window, 'unload', arguments.callee);
    });
    
    
    allThat.Bookmarklet.initialize(); // show bookmarklet - this is visual start of the application
    
})();