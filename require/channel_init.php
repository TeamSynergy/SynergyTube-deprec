<?php
	// http://ipinfodb.com/ip_location_api.php for tracking ip to geolocation?
	require("config.inc.php");

	$channel_exists = false;
	$channel_error = false;
	$channel_error_msg = "";
	$channel_url = $_GET['c'];
	$channel_id = -1;
	$channel_title = "";
	
	$con = new mysqli($db_host, $db_user, $db_password, $db_table);
	if(!$con){
		$channel_error = true;
		$channel_error_msg = "Error 500 - Database Error :(";
	}
	$_set = $con->query("SELECT * FROM tblChannels WHERE custom_url = '".$con->real_escape_string($channel_url)."'");
	if($con->error){
		$channel_error = true;
		$channel_error_msg = "Error 500 - Query Error :(";
	}
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
		$ip_hash = hash('sha256', $_SERVER['REMOTE_ADDR']);
		if(!is_bot())
			$con->query("INSERT INTO tblTracking (ip_hash, channel_id, timestamp) VALUES ('".$ip_hash."', '".$channel_id."', NOW())");
	} else {
		$channel_error = true;
		$channel_error_msg = "Error 404 - Channel not found :(";
	}

	function is_bot()
	{
		$botlist = array("Teoma", "alexa", "froogle", "Gigabot", "inktomi", "looksmart", "URL_Spider_SQL", "Firefly", "NationalDirectory", "Ask Jeeves", "TECNOSEEK", "InfoSeek", "WebFindBot", "girafabot", "crawler", "www.galaxy.com", "Googlebot", "Scooter", "Slurp", "msnbot", "appie", "FAST", "WebBug", "Spade", "ZyBorg", "rabaz", "Baiduspider", "Feedfetcher-Google", "TechnoratiSnoop", "Rankivabot", "Mediapartners-Google", "Sogou web spider", "WebAlta Crawler","TweetmemeBot", "Butterfly","Twitturls","Me.dium","Twiceler");
		foreach($botlist as $bot)
			if(strpos($_SERVER['HTTP_USER_AGENT'], $bot) !== false)
				return true;
		return false;
	}

?>
