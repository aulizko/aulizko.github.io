jQuery.extend({
	createUploadIframe: function(id, uri)
	{
		//create frame
		var frameId = 'jUploadFrame' + id;

		if(window.ActiveXObject) {
			var io = document.createElement('<iframe id="' + frameId + '" name="' + frameId + '" />');
			if(typeof uri== 'boolean'){
				io.src = 'javascript:false';
			}
			else if(typeof uri== 'string'){
				io.src = uri;
			}
		}
		else {
			var io = document.createElement('iframe');
			io.id = frameId;
			io.name = frameId;
		}
		io.style.position = 'absolute';
		io.style.top = '-1000px';
		io.style.left = '-1000px';

		document.body.appendChild(io);

		return io
	},

	createUploadForm: function(id, $inputs, data)
	{
		//create form
		var formId = 'jUploadForm' + id;
		var $form = jQuery('<form  action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data" accept-charset="UTF-8"></form>');
		//set attributes
		$form.css({ position: 'absolute', top: '-1200px', left: '-1200px' }).appendTo('body');

        // Managed passed inputs
		$inputs.each(function(i) {
			var fileId = this.id ? this.id : 'jUploadFile' + id + i;
			var $oldElement = jQuery(this);
			var $newElement = $oldElement.clone();
			$oldElement.attr('id', fileId).before($newElement).appendTo($form);
		});

        // Manage passed parameters, if any
        if (data) {
            var pairs = data.split('&');
            for (var i = 0; i < pairs.length; i ++) {
                var pair = pairs[i].split('='), name = pair[0], value = pair[1];
                var uniqueId = 'jUploadFile' + id + i;
                var $newElement = jQuery('<input name="' + name + '" value="' + value + '" id="' + uniqueId + '" />');
                $newElement.appendTo($form);
            }
        }
        
		return $form;
	},

	ajaxFileUpload: function(s) {
		// TODO introduce global settings, allowing the client to modify them for all requests, not only timeout
		s = jQuery.extend({}, jQuery.ajaxSettings, s);
		var id = new Date().getTime()
		var form = jQuery.createUploadForm(id, s.inputs, s.data);
		var io = jQuery.createUploadIframe(id, s.secureuri);
		var frameId = 'jUploadFrame' + id;
		var formId = 'jUploadForm' + id;
		// Watch for a new set of requests
		if ( s.global && ! jQuery.active++ )
		{
			jQuery.event.trigger( "ajaxStart" );
		}
		var requestDone = false;
		// Create the request object
		var xml = {}
		if ( s.global ) {			
			jQuery.event.trigger("ajaxSend", [xml, s]);
		}
		// Wait for a response to come back
		var uploadCallback = function(isTimeout)
		{
			var io = document.getElementById(frameId);
			try {
				if (io.contentWindow) {
					xml.responseText = io.contentWindow.document.body ? io.contentWindow.document.body.innerHTML : null;
					xml.responseXML = io.contentWindow.document.XMLDocument?io.contentWindow.document.XMLDocument:io.contentWindow.document;
				}
				else if (io.contentDocument) {
					xml.responseText = io.contentDocument.document.body ? io.contentDocument.document.body.innerHTML : null;
					xml.responseXML = io.contentDocument.document.XMLDocument?io.contentDocument.document.XMLDocument:io.contentDocument.document;
				}
			}
			catch(e) {
				jQuery.handleError(s, xml, null, e);
			}
			if ( xml || isTimeout == "timeout")
			{
				requestDone = true;
				var status;
				try {
					status = isTimeout != "timeout" ? "success" : "error";
					// Make sure that the request was successful or notmodified
					if (status != "error") {
						// process the data (runs the xml through httpData regardless of callback)
						var data = jQuery.uploadHttpData( xml, s.dataType );
						// If a local callback was specified, fire it and pass it the data
						if (s.success) {
							s.success(data, status);
						}

						// Fire the global callback
						if (s.global) {
							jQuery.event.trigger( "ajaxSuccess", [xml, s]);
						}
					} else {
						jQuery.handleError(s, xml, status);
					}
				}
				catch(e) {
					status = "error";
					jQuery.handleError(s, xml, status, e);
				}

				// The request was completed
				if( s.global )
				jQuery.event.trigger( "ajaxComplete", [xml, s] );

				// Handle the global AJAX counter
				if ( s.global && ! --jQuery.active )
				jQuery.event.trigger( "ajaxStop" );

				// Process result
				if ( s.complete )
				s.complete(xml, status);

				jQuery(io).unbind();

				setTimeout(function() {
					try {
						jQuery(io).remove();
						jQuery(form).remove();

					}
					catch(e) {
						jQuery.handleError(s, xml, null, e);
					}
				}, 100);

				xml = null;

			}
		};
		// Timeout checker
		if ( s.timeout > 0 )
		{
			setTimeout(function(){
				// Check to see if the request is still happening
				if( !requestDone ) uploadCallback( "timeout" );
			}, s.timeout);
		}
		try
		{
			// var io = jQuery('#' + frameId);
			var form = jQuery('#' + formId);
			jQuery(form).attr('action', s.url);
			jQuery(form).attr('method', 'POST');
			jQuery(form).attr('target', frameId);
			jQuery(form).attr('accept-charset', 'UTF-8');
			if(form.encoding)
			{
				form.encoding = 'multipart/form-data';
			}
			else
			{
				form.enctype = 'multipart/form-data';
			}
			jQuery(form).submit();

		} catch(e)
		{
			jQuery.handleError(s, xml, null, e);
		}
		if(window.attachEvent){
			document.getElementById(frameId).attachEvent('onload', uploadCallback);
		}
		else{
			document.getElementById(frameId).addEventListener('load', uploadCallback, false);
		}
		return {abort: function () {}};

	},

	uploadHttpData: function( r, type ) {
		var isXml = type == "xml" || !type && ct && ct.indexOf("xml") >= 0, isJson = type == "json";
		var data = isXml || isJson ? r.responseXML : r.responseText;
		
		if ( isXml && data.documentElement.tagName == "parsererror" )
		throw "parsererror";

		if ( type == "script" )
		jQuery.globalEval( data );

		if ( type == "json" ) {
            var json = jQuery(data).find('pre').text();
            data = eval("(" + json + ")");
        }

		return data;
	}
});

