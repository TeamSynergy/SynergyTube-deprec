<?php
function p()
{
  foreach(func_get_args() as $a)
    print($a);
}
function pe()
{
  foreach(func_get_args() as $a)
    print(htmlspecialchars($a, ENT_QUOTES, "UTF-8"));
}
function purl()
{
  foreach(func_get_args() as $a)
    print(urlencode($a));
}
?>