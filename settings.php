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
				<li><a href="">Create a Channel</a></li>
				<li class="divider"></li>
				<li><form class="user-form no-collapse" style="display:none">
					<input type="text" class="no-collapse" placeholder="User" ng-model="userName" required>
					<input type="password" class="no-collapse" placeholder="Password" ng-model="userPassword" required>
				</form></li>
				<li><a href="" class="login-form-button no-collapse" ng-click="userForm(false)">Login <i class="icon-chevron-right chevron" style="display:none"></i></a></li>
				<li><a href="" class="login-form-button no-collapse" ng-click="userForm(true)">Create Account <i class="icon-chevron-right chevron" style="display:none"></i></a></li>
			</ul>
			<div class="clearfix"></div>
		</div>
	</div>

	<div class="container content-offset" ng-controller="settings_controller">
		<h1>Settings</h1>
		<hr>
		<ul class="tab-bar">
			<li class="active"><a href="">Profile</a></li>
			<li><a href="">Channels</a></li>
			<li><a href="">Synch</a></li>
			<li><a href="">SynergyTube</a></li>
		</ul>
		<div class="view-container">
			<h2>Profile Settings</h2>
			<p><img src="https://secure.gravatar.com/avatar/ac012582f341845987532c33f0acde3a?d=mm">
			Change Profile Picture</p>
			<p>Change Login-Data:</p>
			<input type="text" placeholder="Displayname"><br>
			<input type="password" placeholder="Password"><br>
			<input type="password" placeholder="Repeat Password">
		</div>

	</div>

	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.0.5/angular.min.js"></script>
	<script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>
	<!--<script type="text/javascript" src="<?php echo $sgtube_host ?>:8080/socket.io/socket.io.js"></script>-->
	<script src="assets/js/settings.js"></script>
</body>
</html>
