<?php
	$_set = $con->query("SELECT * FROM tblChannels");
	while($row = $_set->fetch_object())
	{
		if(!($now_playing = mysqli_fetch_object($con->query("SELECT url, media_type FROM tblMedia WHERE channel_id = '".$row->_id."' ORDER BY start_time DESC LIMIT 0,1")))){
			$now_playing = new stdClass;
			$now_playing->url = 'nothing';
		}

		$count_favs = mysqli_fetch_object($con->query("SELECT COUNT(*) AS '_c' FROM relFavourites WHERE channel_id = '".$row->_id."'"))->_c;

		$count_media = mysqli_fetch_object($con->query("SELECT COUNT(*) AS '_c' FROM tblMedia WHERE channel_id = '".$row->_id."'"))->_c;

		$count_unique_views = mysqli_fetch_object($con->query("SELECT COUNT(DISTINCT ip_hash) AS '_c' FROM tblTracking WHERE channel_id = '".$row->_id."'"))->_c;
		$url = "";
		if($enable_mod_rewrite)
			$url = $sgtube_root."/c/".$row->custom_url;
		else
			$url = $sgtube_root."/channel.php?c=".$row->custom_url;
		?>
		<li>
			<div class="preview">
				<a href="<?php pe($url)?>">
					<div class="caption-wrapper">
						<img src="//img.youtube.com/vi/<?php p($now_playing->url) ?>/mqdefault.jpg"/>
						<div class="play-overlay">
							<i class="icon-play-circle icon-white"></i>
						</div>
					</div>
				</a>
				<p class="info-bar">
					<span class="_tt" data-toggle="tooltip" title="<?php pe($count_favs)?> Favourites">
						<i class="icon-star"></i> <?php pe($count_favs)?>
					</span>
					|
					<span class="_tt" data-toggle="tooltip" title="<?php pe($count_unique_views)?> Unique Visitors">
						<i class="icon-globe"></i> <?php pe($count_unique_views)?> 
					</span>
					|
					<span class="_tt" data-toggle="tooltip" title="<?php pe($count_media)?> Items in Playlist">
						<i class="icon-th-list"></i> <?php pe($count_media)?>
					</span>
				</p>
				<a href="<?php pe($url) ?>">
					<h3><?php pe($row->name); ?></h3>
				</a>
				<p class="description">
					<?php pe($row->description); ?>
				</p>
			</div>
		</li>
<?php
	}
?>
