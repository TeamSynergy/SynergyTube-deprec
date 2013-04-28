<?php
	require("config.inc.php");
	$con = new mysqli($db_host, $db_user, $db_password, $db_table) or die("Error, Database-Connection failed!");

	if($_GET['m'] == 'validate' && strlen($_GET['p']) == 64)
	{
		$con->query("UPDATE tblUser SET validate_hash = '', is_valid = 1 WHERE validate_hash = '".$con->real_escape_string($_GET['p'])."'");
		header("location: /");
	}
?>