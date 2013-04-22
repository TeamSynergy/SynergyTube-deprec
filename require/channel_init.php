<?php
	require("config.inc.php");

	$channel_exists = false;
	$channel_error = false;
	$channel_url = $_GET['c'];

	$con = new mysqli($db_host, $db_user, $db_password, $db_table);
	if(!$con)
		$channel_error = true;
	$_set = $con->query("SELECT * FROM tblChannels WHERE custom_url = '".$con->real_escape_string($channel_url)."'");
	if($con->error)
		$channel_error = true;
	elseif ($_set->num_rows == 1)
	{
		$_channel = mysqli_fetch_object($_set);
		$channel_exists = true;
		$channel_id = $_channel->_id;
		$channel_description = htmlentities($_channel->description);
		$channel_title = htmlentities($_channel->name);
		$channel_cover_id = htmlentities($_channel->cover_id);
		$channel_cover_repeat = htmlentities($_channel->cover_repeat);
		$channel_cover_pos_x = htmlentities($_channel->cover_pos_x);
		$channel_cover_pos_y = htmlentities($_channel->cover_pos_y);
	}
?>