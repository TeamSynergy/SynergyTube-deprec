<?php
	require("config.inc.php");
	$con = new mysqli($db_host, $db_user, $db_password, $db_table);
	$_set = $con->query("SELECT * FROM tblChannels");
	while($row = $_set->fetch_object())
	{
		$now_playing = mysqli_fetch_object($con->query("SELECT url, media_type FROM tblMedia WHERE channel_id = '".$row->_id."' ORDER BY start_time DESC LIMIT 0,1"));
		$count_favs = mysqli_fetch_object($con->query("SELECT COUNT(*) AS '_c' FROM relFavourites WHERE channel_id = '".$row->_id."'"));
		$count_media = mysqli_fetch_object($con->query("SELECT COUNT(*) AS '_c' FROM tblMedia WHERE channel_id = '".$row->_id."'"));
		$count_unique_views = mysqli_fetch_object($con->query("SELECT COUNT(DISTINCT ip_hash) AS '_c' FROM tblTracking WHERE channel_id = '".$row->_id."'"));
		$url = "";
		if($enable_mod_rewrite)
			$url = $sgtube_root."/c/".$row->custom_url;
		else
			$url = $sgtube_root."/channel.php?c=".$row->custom_url;
		?>
		<li><div class="preview">
			<a href="<?php print $url ?>"><div class="caption-wrapper"><img src="//img.youtube.com/vi/<?php print $now_playing->url ?>/mqdefault.jpg"><div class="play-overlay"><i class="icon-play-circle icon-white"></i></div></div></a>
			<p class="info-bar"><span class="_tt" data-toggle="tooltip" title="<?php print $count_favs->_c ?> Favourites"><i class="icon-star"></i> <?php print $count_favs->_c ?> </span>|<span class="_tt" data-toggle="tooltip" title="<?php print $count_unique_views->_c ?> Unique Visitors"> <i class="icon-globe"></i> <?php print $count_unique_views->_c ?> </span>|<span class="_tt" data-toggle="tooltip" title="<?php print $count_media->_c ?> Items in Playlist"> <i class="icon-th-list"></i> <?php print $count_media->_c ?></span></p>
			<a href="<?php print $url ?>"><h3><?php print $row->name ?></h3></a>
			<p class="description"><?php print $row->description ?></p>
		</div></li>
		<?php
	}
?>