<?php
$callback = $_GET['callback'];

$data = "{wishlists:[{id:1,title:'public wishlist'},{id:3,title:'absolutely secret wishlist'},{id:12,title:'TOP SECRET! NO ONE CAN SEE IT'}]}";

echo 'allThat.Bookmarklet.' . $callback . '(' . $data . ');';

?>