<?php


/*

v'это - было --самое <b test="123'123" test='123"123'>настоящее</b> хобби(tm),   <big>отдушина</big>(c), он не мог не "писать"  "<b>писать</b>" ,
и он не предполагал,
что <i>когда-нибудь</i>
маска журн    <i>алиста</i> 'понадобится' 22' дюйма" "go" 'went' ty ему для его игр

*/

setlocale(LC_CTYPE ,'ru_RU'.'.UTF8');
mb_internal_encoding('UTF-8');
header('Content-Type: text/html; charset=utf-8');
include 'typo.php';


if(isset($_POST['text']))
if (get_magic_quotes_gpc())
$_POST['text']=stripslashes($_POST['text']);

function my_t($text)
{

return post_typo(typo(trim($text)));
}

?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head>
  <title>Auto typograf</title>
  <meta http-equiv="content-type" content="text/html; charset=utf-8" />
<style>
span.sbrace {margin-right: 0.4em}
span.hbrace {margin-left: -0.4em}

span.slaquo {margin-right: 0.44em}
span.hlaquo {margin-left: -0.44em}
span.slaquo-s {margin-right: 0.6em}
span.hlaquo-s {margin-left: -0.6em}
span.slaquo-b {margin-left: 0.85em}
span.hlaquo-b {margin-left: -0.85em}

span.sbdquo {margin-right: 0.35em}
span.hbdquo {margin-left: -0.35em}
span.sbdquo-s {margin-right: 0.35em}
span.sbdquo-s {margin-left: -0.35em}

span.squot {margin-right: 0.32em}
span.hquot {margin-left: -0.32em}

span.sowc {margin-right: 0.04em}
span.howc {margin-left: -0.04em}

span.sowcr {margin-right: 0.05em}
span.howcr {margin-left: -0.05em}
</style>
</head>
<body>
<!--by Maxim Popov http://ecto.ru/-->

<table border="0" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:30px;">
<form method="post">
<tr>
<td width="3%"></td>
<td width="70%" style="padding-bottom:10px;" height="50%"><textarea name="text" style="height:300px;width:100%;" wrap="on"><?php if(isset($_POST['text']))echo htmlspecialchars(unpost_typo($rez=my_t($_POST['text'])),ENT_QUOTES);

else
echo '
"-" - это минус . Почитайте статью в wiki(tm)
<a href="http://ru.wikipedia.org/wiki/%D0%9C%D0%B8%D0%BD%D1%83%D1%81">"про минус"</a> !
<br>Ми́нус (от лат. minus "менее ,меньше") - математический cимвол " -" .
<br>Между тем ,внутри "елочек" дюймы остаются - "Монитор 21""!

';

?></textarea></td>
<td width="27%"></td>
</tr>
<tr>
<td width="3%"></td>
<td><input type="submit" value="Привести в порядок!" style="width:200px;height:30px;">
</td>
<td></td>
</tr>
</form>
</table>

<? if(isset($_POST['text'])){?>

<table border="0" width="100%"  cellpadding="0" cellspacing="0">
<tr>
<td width="3%"></td>
<td width="45%" style="padding-bottom:10px;"><big>Было</big></td>
<td width="4%"></td>
<td width="45%"><big>Стало</big></td>
<td width="3%"></td>
</tr>
<tr>
<td></td>
<td><? echo $_POST['text']; ?></td>
<td></td>
<td><? echo $rez; ?></td>
<td></td>
</tr>
</table>


<table border="0" width="100%"  cellpadding="0" cellspacing="0">
<tr>
<td width="3%"></td>
<td width="45%" style="padding-bottom:10px;"></td>
<td width="4%"></td>
<td width="45%"></td>
<td width="3%"></td>
</tr>

<tr>
<td></td>
<td><textarea style="width:100%;height:200px;"><? echo htmlspecialchars(htmlentities($_POST['text'],ENT_QUOTES,'UTF-8'),ENT_QUOTES); ?></textarea></td>
<td></td>
<td><textarea style="width:100%;height:200px;"><? echo htmlspecialchars(typo($rez,array('cleen_utf'=>false)),ENT_QUOTES); ?></textarea></td>
<td></td>
</tr>
</table>


<?php } ?>
</body>
</html>