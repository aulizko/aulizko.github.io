(function($){$.fn.extend({thickbox:function(options){var defaults={loaderImagePath:'images/loadingAnimation.gif',closeLinkTitle:'close',closeLinkHint:'or Esc Key'};var options=$.extend(defaults,options);var imgLoader=new Image();imgLoader.src=defaults.loaderImagePath;var ie6=jQuery.browser.msie&&jQuery.browser.version<7;function showThickBox(caption,url){try{if(ie6){$("body","html").css({height:"100%",width:"100%"});$("html").css("overflow","hidden");if(document.getElementById("TB_HideSelect")===null){$("body").append("<iframe id='TB_HideSelect'></iframe><div id='TB_overlay'></div><div id='TB_window'></div>");}}else{if(document.getElementById("TB_overlay")===null){$("body").append("<div id='TB_overlay'></div><div id='TB_window'></div>");}}
var overlay=$("#TB_overlay");overlay.click(removeThickBox);overlay.addClass(detectMacFF()?'TB_overlayMacFFBGHack':'TB_overlayBG');if(caption===null){caption="";}
var loader=$('<div id="TB_load"><img src="'+imgLoader.src+'" /></div>');loader.appendTo('body').show();var baseURL,queryStart=url.indexOf("?");if(queryStart!==-1){baseURL=url.substr(0,queryStart);}else{baseURL=url;}
var queryString=url.replace(/^[^\?]+\??/,'');var params=parseQuery(queryString);var WIDTH=(params['width']*1)+30||630;var HEIGHT=(params['height']*1)+40||440;var ajaxContentW=WIDTH-30;var ajaxContentH=HEIGHT-45;if(url.indexOf('TB_iframe')!=-1){var urlNoQuery=url.split('TB_');$("#TB_iframeContent").remove();$("#TB_window").append("<div id='TB_title'><div id='TB_ajaxWindowTitle'>"+caption+"</div><div id='TB_closeAjaxWindow'><a href='#' id='TB_closeWindowButton' title='Close'>"+options.closeLinkTitle+"</a>"+(options.closeLinkHint.length?' ':'')+options.closeLinkHint+"</div></div><iframe frameborder='0' hspace='0' src='"+urlNoQuery[0]+"' id='TB_iframeContent' name='TB_iframeContent"+Math.round(Math.random()*1000)+"' onload='tb_showIframe()' style='width:"+(ajaxContentW+29)+"px;height:"+(ajaxContentH+17)+"px;' > </iframe>");}else{if($("#TB_window").css("display")!="block"){if(params['modal']!="true"){$("#TB_window").append("<div id='TB_title'><div id='TB_ajaxWindowTitle'>"+caption+"</div><div id='TB_closeAjaxWindow'><a href='#' id='TB_closeWindowButton'>"+options.closeLinkTitle+"</a>"+(options.closeLinkHint.length?' ':'')+options.closeLinkHint+"</div></div><div id='TB_ajaxContent' style='width:"+ajaxContentW+"px;height:"+ajaxContentH+"px'></div>");}}else{var ajaxContentWindow=$('#TB_ajaxContent');ajaxContentWindow[0].style.width=ajaxContentW+"px";ajaxContentWindow[0].style.height=ajaxContentH+"px";ajaxContentWindow[0].scrollTop=0;$("#TB_ajaxWindowTitle").html(caption);}}
$("#TB_closeWindowButton").click(removeThickBox);if(url.indexOf('TB_iframe')!=-1){position(WIDTH,HEIGHT);if($.browser.safari){loader.remove();$("#TB_window").css({display:"block"});}}else{$("#TB_ajaxContent").load(url+="&random="+(new Date().getTime()),function(){position(WIDTH,HEIGHT);loader.remove();$("#TB_ajaxContent a.thickbox").thickbox({loaderImagePath:options.loaderImagePath,closeLinkTitle:options.closeLinkTitle,closeLinkHint:options.closeLinkHint});$("#TB_window").css({display:"block"});});}
document.onkeyup=function(e){if(e==null){keycode=event.keyCode;}else{keycode=e.which;}
if(keycode==27){removeThickBox();}};}catch(e){}};window['tb_showIframe']=function(){$("#TB_load").remove();$("#TB_window").css({display:"block"});};function removeThickBox(){$("#TB_imageOff").unbind("click");$("#TB_closeWindowButton").unbind("click");$("#TB_window").fadeOut("fast",function(){$('#TB_window,#TB_overlay,#TB_HideSelect').trigger("unload").unbind().remove();});$("#TB_load").remove();if(ie6){$("body","html").css({height:"auto",width:"auto"});$("html").css("overflow","");}
document.onkeydown="";document.onkeyup="";return false;};function detectMacFF(){var userAgent=navigator.userAgent.toLowerCase();if(userAgent.indexOf('mac')!=-1&&userAgent.indexOf('firefox')!=-1){return true;}};function parseQuery(query){var Params={};if(!query){return Params;}
var Pairs=query.split(/[;&]/);for(var i=0;i<Pairs.length;i++){var KeyVal=Pairs[i].split('=');if(!KeyVal||KeyVal.length!=2){continue;}
var key=unescape(KeyVal[0]);var val=unescape(KeyVal[1]);val=val.replace(/\+/g,' ');Params[key]=val;}
return Params;};function position(width,height){$("#TB_window").css({marginLeft:'-'+parseInt((width/2),10)+'px',width:width+'px'});if(!ie6){$("#TB_window").css({marginTop:'-'+parseInt((height/2),10)+'px'});}};return this.each(function(){$(this).click(function(){showThickBox(this.title||this.name||null,this.href||this.alt);this.blur();return false;});});}});})(jQuery);