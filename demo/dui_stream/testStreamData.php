<?php

header('MIME-Version: 1.0');
header('Content-Type: multipart/mixed; boundary="|||"');

$count = 1024 * 3;


/* $imgFile = file_get_contents('img/32x32-digg-guy.gif');

for($i = 0; $i < 300 ; $i++) {
    echo "--|||
Content-Type: image/gif
" . base64_encode($imgFile);
}

echo '--|||--';
exit; */

/* echo "--|||
Content-Type: text/javascript */
/*";
for($i = 0; $i < $count ; $i++) {
    echo 'Y';
}
echo "*/
/* console.log('huuurrrr');"; */

/* for($i = 1; $i < $payloads; $i++) {
    echo '
--|||
Content-Type: text/html
';
    
    echo '<em>';
    
    for($j = 0; $j < $count ; $j++) {
        echo 'X';
    }
    
    echo '</em>';
}

echo '--|||--'; */



//Let's store our heinous chunk of text down here
$lipsum = "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque congue nunc ut justo. In placerat tincidunt enim. Praesent a risus nec leo interdum tincidunt. Pellentesque faucibus neque. Suspendisse risus. Aenean fermentum pharetra mi. Aliquam erat volutpat. Praesent eleifend est a ligula. Donec quis lacus. Nullam vitae nulla. Mauris id ipsum. Sed lobortis varius nisi. Integer vitae erat sed elit sollicitudin faucibus. Donec in turpis iaculis massa iaculis pulvinar. Curabitur tincidunt quam dictum massa. Suspendisse ac est. Nunc urna. Nullam euismod feugiat nisi. In hac habitasse platea dictumst. Aliquam erat volutpat.</p>

<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque quis nulla porttitor sapien facilisis tempus. Duis dapibus ligula ut diam. Nunc libero diam, consequat in, bibendum vel, commodo ut, nulla. Nam mollis nulla vehicula leo. Morbi imperdiet condimentum lorem. Maecenas molestie accumsan lorem. Proin nunc nisi, condimentum sed, laoreet ac, adipiscing vitae, sem. Aliquam fermentum. Phasellus dui. Morbi volutpat, tortor vel ultrices ultricies, diam dolor bibendum arcu, sit amet congue ante lorem vel leo. Phasellus urna. Aliquam posuere, purus mattis condimentum rutrum, turpis diam luctus risus, sit amet faucibus nulla diam nec purus. Mauris ac lacus.</p>

<p>Quisque quis nisi. Suspendisse tortor ipsum, consequat non, mattis eu, dapibus ac, diam. Praesent ac elit sed justo venenatis laoreet. Cras ante. Phasellus lorem neque, faucibus at, mattis ac, elementum sed, libero. Suspendisse potenti. In feugiat sem eu diam. Mauris sodales. Praesent vehicula varius leo. Nulla erat velit, suscipit at, posuere vel, consequat commodo, tellus. Donec quam. Donec imperdiet sem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dictum mattis justo.</p>

<p>Etiam magna nulla, convallis non, vestibulum id, placerat eu, risus. Fusce pellentesque felis eu mi. Donec adipiscing, dui eu varius elementum, justo eros facilisis quam, at sodales odio odio vel ipsum. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed molestie ligula vitae purus. Morbi posuere. Duis dolor orci, porta vitae, scelerisque nec, dignissim non, lectus. Nunc vestibulum. Praesent quis urna. Duis pretium. Vivamus ac lorem. Phasellus enim. Donec faucibus porta libero. Aliquam condimentum eros non quam. Vestibulum luctus lorem eget sapien.</p>

<p>Aliquam erat. Sed condimentum risus non nunc. Proin tellus lacus, sodales at, elementum quis, fermentum in, nulla. Maecenas urna quam, tincidunt nec, varius sed, varius at, justo. Etiam vel turpis. Mauris dui dolor, venenatis at, pellentesque ac, laoreet sit amet, sem. Mauris et enim eget lorem mollis dignissim. Donec adipiscing. Phasellus bibendum rhoncus quam. Donec purus tellus, ultricies eu, rhoncus et, dapibus in, ante. Aliquam feugiat, lacus ut sodales ornare, enim orci consequat felis, quis accumsan ante tellus et diam. Donec mauris. Nunc imperdiet lacinia erat. Maecenas ac nunc quis ligula condimentum blandit. Mauris faucibus, neque sed iaculis suscipit, tortor mi adipiscing nunc, consequat aliquet eros nisl nec diam. In magna. Duis pharetra. Vivamus vel mauris ac nulla pharetra commodo. Nullam diam sem, luctus vel, congue vel, porta non, mauris.</p>

<p>Curabitur lobortis neque a felis vestibulum sollicitudin. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dapibus enim id quam. Donec lacinia elit at lorem. Maecenas lorem massa, pharetra sed, rutrum id, pharetra sit amet, justo. Aliquam gravida cursus dui. Nullam vel nulla nec neque eleifend interdum. Fusce aliquam ante eget odio. Etiam ac mi vitae risus vulputate rhoncus. Maecenas sem leo, porttitor vel, ornare non, blandit eu, mi. Aliquam varius, nisi at egestas laoreet, est velit accumsan erat, sed faucibus ante mauris et sapien. Mauris neque mauris, dignissim ac, rhoncus ac, lacinia sit amet, ligula. Integer eget nisl. Morbi sapien arcu, mollis at, malesuada vitae, convallis id, justo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>

<p>Proin adipiscing dapibus augue. Nunc pharetra sagittis purus. Cras euismod, justo ut faucibus lacinia, nulla lectus bibendum ligula, ac aliquam elit nulla ac tellus. Nunc lobortis, est nec rutrum ornare, tellus est varius diam, ut hendrerit elit diam sit amet neque. Ut dictum nulla sed nisi. Nulla facilisi. In tristique neque in leo. Nullam feugiat lorem sed nisl. Vestibulum vitae magna ac ligula laoreet elementum. Integer nec risus at felis ornare tincidunt. Cras malesuada tristique tortor.</p>

<p>Quisque at massa. Cras eu libero sed diam bibendum luctus. Integer viverra, lacus in varius luctus, elit ipsum euismod eros, et vulputate nisi nulla mattis eros. Proin mauris neque, auctor nec, convallis vitae, molestie eget, nulla. Fusce tempor ipsum a sem. Mauris elit velit, accumsan nec, eleifend ac, facilisis vel, tortor. Morbi nec orci. In faucibus odio a nisl. Donec vel mauris. Suspendisse potenti. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus elit nisi, sagittis eget, vehicula vitae, convallis posuere, urna. Donec interdum. Nam augue nisl, rutrum et, rhoncus eu, bibendum iaculis, massa. Suspendisse a orci. Vestibulum sodales eros non justo. Maecenas id tortor nec orci pharetra vestibulum.</p>

<p>Pellentesque tortor. Donec blandit massa vitae urna. Ut iaculis ipsum. Curabitur sem nisi, fringilla nec, pretium vel, faucibus pulvinar, leo. Nullam egestas. Aliquam faucibus dignissim odio. Maecenas non massa. Proin tristique augue. Morbi rhoncus. Proin malesuada vestibulum nunc. Vestibulum aliquam sagittis nunc. Integer id felis. Maecenas eu velit. Fusce convallis elit sit amet nulla.</p>

<p>Proin fermentum, felis quis auctor blandit, tortor dui ornare est, non porta augue erat nec est. Curabitur eu justo. Etiam dignissim dolor a justo. Pellentesque a lectus. Duis elementum elementum nisl. Fusce urna nibh, aliquam a, luctus non, facilisis quis, nulla. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed eu massa eget nisl volutpat rhoncus. Nunc orci. Aenean a metus sit amet est volutpat tincidunt. Donec vel tellus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam non eros ut mi venenatis blandit. Cras vel purus non odio viverra lacinia. Nullam fringilla, ligula eu viverra adipiscing, arcu augue luctus sem, vulputate venenatis dolor justo a libero.</p>";

for($i = 0; $i <= 10; $i++) {
    echo '
--|||
Content-Type: text/html
' . $lipsum;
}

?>