<?php
	$db_host = "localhost";
	$db_user = "root";
	$db_password = "";
	$db_table = "test";
	$enable_mod_rewrite = false;
  $sgtube_host = '//'.$_SERVER['SERVER_NAME'];
  $sgtube_root = $sgtube_host.substr($_SERVER['SCRIPT_NAME'],0,strrpos($_SERVER['SCRIPT_NAME'],'/'));
?>