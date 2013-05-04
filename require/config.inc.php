<?php
	// Database-Connection variables
	$db_host = "localhost";
	$db_user = "root";
	$db_password = "root";
	$db_table = "synergy";

	// Use mod_rewrite for url rewriting?
	// eg: host.com/c/channel-name instead of host.com/channe.php?c=channel-name when enabled.
	$enable_mod_rewrite = true;

	// Don't even think about touching this Values!
  $sgtube_host = '//'.$_SERVER['SERVER_NAME'];
  $sgtube_root = $sgtube_host.substr($_SERVER['SCRIPT_NAME'],0,strrpos($_SERVER['SCRIPT_NAME'],'/'));
?>