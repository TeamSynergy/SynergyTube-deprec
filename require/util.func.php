<?php
  function p(){
    foreach(func_get_args() as $arg){
      print($arg);
    }
  }
  function pe(){
    foreach(func_get_args() as $arg){
      print(htmlspecialchars($arg, ENT_QUOTES, "UTF-8"));
    }
  }
  function purl(){
    foreach(func_get_args() as $arg){
      print(urlencode($arg));
    }
  }
?>