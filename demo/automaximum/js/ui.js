var postFloaterTimeout = 0;
$(function() {
	$(window).load(adjustSiteWidth).resize(adjustSiteWidth);
		
	// Rounded corners
	if (navigator.userAgent.indexOf('Chrome') == -1) {
		$('.area.community').corners('14px');
		$('.area.dashboard, .area.twocolumn').corners('14px bottom');		
	}
	
	// Login floater
	$('.signin').click(function(e) {
		e.preventDefault();
		$(this).siblings('.floater').toggle();
	});
	
	// Fake hover
	$('.supermenu li, .tabset > dt, .recent > li, .answers > li, .superfooter .meta li, .carfilter label, .carfilter .column li, .cars tr')
	.hover(function() {
			$(this).addClass('hover');
		},
		function() {
			$(this).removeClass('hover');
		});
	
	// IE6 top current hover fix
	$('.supermenu li:first').hover(function() {
			$(this).addClass('hover_top');
		},
		function() {
			$(this).removeClass('hover_top');
		});
	
	// Floater with timeout
	$('.forum .posts tr').hover(function(e) {
			var $target = $(this);
			postFloaterTimeout = setTimeout(function() {
				$($target).addClass('hover');
			}, 700);
		},
		function() {
			clearTimeout(postFloaterTimeout);
			$(this).removeClass('hover');
		});
	
	// Slideshow
	$('.slideshow .close').click(function() {
		$(this).parents('.slideshow:first').hide();
		});
	
	// TODO animation
	$('.gallery .enlarge').click(function() {
		$(this).parents('.gallery:first').find('.slideshow').show();
		});
	
	// Input example value
	$('input.example').focus(clearExampleValue);
	
	// Tabset
	$('dl.tabset dt').click(function(e) {
			e.preventDefault();
			$(this).siblings().removeClass('current').end().addClass('current').next().addClass('current');
		});
	
	// Feedback
	$('.feedback a.showEmail').click(function(e) {
			e.preventDefault();
			var $email = $(this).parents('.message:first').find('.email');
			if ($email.is(':hidden')) {
				$email.show();
			}
			else {
				$email.hide();
			}
		});
	// Carfilter critaria expand / collapse
	$('.carfilter .criteria h3').click(function() {
			$(this).parent().toggleClass('collapsed');
		});
	
	// Carfilter car make list
	$('.carfilter .seller label, .carfilter .column li, .carfilter .age label.new').click(function() {
			$(this).toggleClass('checked');
		});
	
	// Cars catalogue
	$('.cars .showContacts').click(function(e) {
			e.preventDefault();
			$(this).next().toggle();
		});
	
	// PNG automatic full urls for IE6 AlphaImageLoader
	$('.deco, .filmstrip .left, .filmstrip .right').each(function() {
		var $this = $(this), url = window.location.href,
			imagesUrl = url.substring(0, url.lastIndexOf('/')) + '/css/images/', value = $this.css('filter');
			value.replace(/src=\'(.?)\'/g, imagesUrl);
			$this.css('filter', value);
		});
	
});

function clearExampleValue() {
	$(this).val('').removeClass('example').unbind('focus', clearExampleValue);
}

function adjustSiteWidth() {
	var width = $(this).width(), $body = $('body'), $supercontainer = $body.children('.supercontainer');
	if (width < 980) {
		$body.removeClass('lo-res mid-res hi-res').addClass('xlo-res');
	}
	else if (width < 1180) {
		$body.removeClass('xlo-res mid-res hi-res').addClass('lo-res');
	}
	else if (width < 1400) {
		$body.removeClass('xlo-res lo-res hi-res').addClass('mid-res');
	}
	else {
		$body.removeClass('xlo-res lo-res mid-res').addClass('hi-res');
	}
	

}