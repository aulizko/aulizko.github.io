<?php
    require_once('bookmarklet_code_generator.php');
    $user_hash = "1231lfdjvr12";
    $server_address = "http://ulizko.com/demo/allthat/";
?>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"
    "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html>
    <head>
        <meta http-equiv="Content-type" content="text/html; charset=utf-8">
        <title>bookmarklet test</title>
    </head>
    <body>
        <p>Hi. If you want to try out a demo, drag and drop this <a href="<?php generateBookmarkletCode($user_hash, $server_address); ?>">link</a> to your bookmarklet's bar.</p>
    </body>
</html>