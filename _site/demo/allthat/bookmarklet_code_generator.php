<?php

    function generateBookmarkletCode ($user_hash, $server_address) {
        $script_location = "js/bookmarklet.7.js";
        $css_location = "css/bookmarklet.3.css";
        
        $bookmarklet_address_code = "javascript:(function(){var a = window.allThat={userId:'" . $user_hash;
        $bookmarklet_address_code .= "',server:'" . $server_address;

        $bookmarklet_address_code .= "',css:document.createElement('link'),script:document.createElement('script')},h=document.getElementsByTagName('head')[0];a.css.rel='stylesheet';a.css.href=a.server+'$css_location';h.appendChild(a.css);a.script.src=a.server+'$script_location';h.appendChild(a.script);h=null;})()";
        
        echo $bookmarklet_address_code;
    }
?>

