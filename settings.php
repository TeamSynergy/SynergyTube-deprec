<?php require("require/config.inc.php");?>
<!DOCTYPE html>
<html ng-app="syn_app">
<head>
	<title>SynergyTube | Settings</title>
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
	<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
	<link href="assets/css/normalize.css" rel="stylesheet"/>
	<link href="assets/css/rewrite.css" rel="stylesheet"/>
	<link href="//netdna.bootstrapcdn.com/font-awesome/3.0.2/css/font-awesome.css" rel="stylesheet">
	<link href='http://fonts.googleapis.com/css?family=Cabin|PT+Sans|PT+Sans+Narrow' rel='stylesheet' type='text/css'>
</head>
<body>
	<div class="top-bar" ng-controller="navbar_controller" on-resize="collapsableResize()">
		<a href="."><img src="assets/img/logo.png"></a>
		<a href="" ng-click="menuToggle()" class="menu-toggle"><i class="icon-double-angle-down icon-2x"></i></a>
		<div class="top-bar-collapse">
			<ul class="nav" click-children="processLink" selector="li">
				<li><a href="#">Create a Channel</a></li>
				<li><form class="user-form" class="no-collapse" style="display:none">
					<input type="text" class="no-collapse" placeholder="User" name="user" required>
					<input type="password" class="no-collapse" placeholder="Password" name="pw" required>
				</form></li>
				<li><a href="#" class="login-form-button no-collapse">Login <i class="icon-chevron-right chevron" style="display:none"></i></a></li>
				<li><a href="#" class="login-form-button no-collapse">Create Account <i class="icon-chevron-right chevron" style="display:none"></i></a></li>
			</ul>
			<div class="clearfix"></div>
		</div>
	</div>

	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.0.5/angular.min.js"></script>
	<script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="<?php echo $sgtube_host; ?>:8080/socket.io/socket.io.js"></script>
	<script src="<?php echo $sgtube_root;?>/assets/js/settings.js"></script>
</body>
</html>
