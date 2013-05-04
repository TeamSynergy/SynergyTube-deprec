<?php
	require("config.inc.php");
	$out_message = "You shouldn't be here..";
	$con = new mysqli($db_host, $db_user, $db_password, $db_table) or die("Error, Database-Connection failed!");
	if(!$con)
		$out_message = "Database Error";
	if(array_key_exists('m', $_GET) && array_key_exists('p', $_GET))
		if($_GET['m'] == 'validate')
			if(strlen($_GET['p']) !== 64)
				$out_message = "Invalid Activation-ID. It should be 64 Chars long.";
			else {
				$con->query("UPDATE tblUser SET validate_hash = '', is_valid = 1 WHERE validate_hash = '".$con->real_escape_string($_GET['p'])."'");
				$out_message = "We successfully activated your account!<br><a href=\"".$sgtube_root."/..\">Return</a>";
			}
?>

<!DOCTYPE html>
<html>
<head>
  <link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.min.css" rel="stylesheet">
  <link href="<?php echo $sgtube_root; ?>/../assets/css/custom.css" rel="stylesheet">
  <link href="<?php echo $sgtube_root; ?>/../assets/css/style.css" rel="stylesheet">
  <link href="http://fonts.googleapis.com/css?family=PT+Sans+Narrow:regular,bold" rel="stylesheet">
</head>
<body>
<div class="wrap-the-load">
  <div class="loading-border">
		<div class="loading-image">
			<img src="<?php echo $sgtube_root; ?>/../assets/img/cloud_pre.png">
		</div>
		<div class="loading-lower">
			<span class="txt-init"><?php print $out_message ?></span><br>
			<hr class="lower-hr">
			<span class="txt-copy">&copy;2013 <a href="mailto:screeny05@gmail.com">Screeny</a>; <a href="https://github.com/screeny05/SynergyTube">Fork me on GitHub</a></span>
		</div>
	</div>
</div>
</body>
</html>