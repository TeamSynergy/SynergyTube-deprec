<?php
  function _(){
    //Let's use this for localization whenever we get around to implementing that.
  }

  function p(){
    foreach(func_get_args() as $arg){
      print $arg;
    }
  }  
  function pe(){
    foreach(func_get_args() as $arg){
      print htmlentities($arg);
    }
  }
  function purl(){
    foreach(func_get_args() as $arg){
      print urlencode($arg);
    }
  }
?>
