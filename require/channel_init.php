<?php
	// http://ipinfodb.com/ip_location_api.php for tracking ip to geolocation?
require_once("config.inc.php");

$channelpage_url = "";
if($enable_mod_rewrite)
    $channelpage_url = $sgtube_root."/c/";
else
    $channelpage_url = $sgtube_root."/channel.php?c=";
	$channel_exists = false;
	$channel_error = false;
	$channel_error_msg = "";
	$channel_url = $_GET['c'];
	$channel_id = -1;
	$channel_title = "";
	if(!$con){
		$channel_error = true;
		$channel_error_msg = "Error 500 - Database Error :(";
	} else {
		$_set = $con->query("SELECT tblChannels.*, tblUser.display_name AS 'owner_name' FROM tblChannels LEFT JOIN tblUser ON tblUser._id=tblChannels.owner_id WHERE custom_url = '".$con->real_escape_string($channel_url)."'");
    	
		if($con->error){
			$channel_error = true;
			$channel_error_msg = "Error 500 - Query Error :(";
		}elseif ($_set->num_rows == 1){
			$_channel = mysqli_fetch_object($_set);
			$channel_exists = true;
			$channel_id = $_channel->_id;
			$channel_description = htmlspecialchars($_channel->description, ENT_QUOTES, "UTF-8");
			$channel_tags = "";
			$channel_owner = htmlspecialchars($_channel->owner_name, ENT_QUOTES, "UTF-8");
			$channel_title = htmlspecialchars($_channel->name, ENT_QUOTES, "UTF-8");
			$channel_cover_id = $_channel->cover_id;
			$channel_cover_repeat = $_channel->cover_repeat;
			$channel_cover_pos_x = $_channel->cover_pos_x;
			$channel_cover_pos_y = $_channel->cover_pos_y;
			$ip_hash = hash('sha256', $_SERVER['REMOTE_ADDR']);
			if(!is_bot())
				$con->query("INSERT INTO tblTracking (ip_hash, channel_id, timestamp) VALUES ('".$ip_hash."', '".$channel_id."', NOW())");
		}elseif($_set->num_rows > 1){
			$channel_error = true;
			$channel_error_msg = "Error - Channel-ID is not unique?";
		} else {
			$channel_error = true;
			$channel_error_msg = "Error 404 - Channel not found :(";
		}
	}
	function is_bot(){
		$botlist = array("Teoma", "alexa", "froogle", "Gigabot", "inktomi", "looksmart", "URL_Spider_SQL", "Firefly", "NationalDirectory", "Ask Jeeves", "TECNOSEEK", "InfoSeek", "WebFindBot", "girafabot", "crawler", "www.galaxy.com", "Googlebot", "Scooter", "Slurp", "msnbot", "appie", "FAST", "WebBug", "Spade", "ZyBorg", "rabaz", "Baiduspider", "Feedfetcher-Google", "TechnoratiSnoop", "Rankivabot", "Mediapartners-Google", "Sogou web spider", "WebAlta Crawler","TweetmemeBot", "Butterfly","Twitturls","Me.dium","Twiceler");
		foreach($botlist as $bot)
			if(strpos($_SERVER['HTTP_USER_AGENT'], $bot) !== false)
				return true;
		return false;
	}

?>
