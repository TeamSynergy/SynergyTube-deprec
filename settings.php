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
	<link href='http://fonts.googleapis.com/css?family=Cabin|PT+Sans|PT+Sans+Narrow|Raleway:600' rel='stylesheet' type='text/css'>
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
				<li><a href="" class="login-form-button form-button no-collapse" ng-click="userForm(false)">Login <i class="icon-chevron-right chevron" style="display:none"></i></a></li>
				<li><a href="" class="register-form-button form-button no-collapse" ng-click="userForm(true)">Create Account <i class="icon-chevron-right chevron" style="display:none"></i></a></li>
			</ul>
			<div class="clearfix"></div>
		</div>
	</div>

	<div class="container content-offset settings-container" ng-controller="settings_controller">

		<div class="row tab-bar-header">
			<div class="title">
				<h2>Profile Settings</h2>
			</div>
		</div>

		<div class="row">
			<ul class="tab-bar column span_3">
				<li class="active"><a href="#profile"><i class="icon-user"></i> Profile</a></li>
				<li><a href="#channels"><i class="icon-th-list"></i> Channels</a></li>
				<li><a href="#synch"><i class="icon-tasks"></i> Synchronization</a></li>
				<li><a href="#synergy"><i class="icon-cloud"></i> SynergyTube</a></li>
			</ul>

			<div class="column span_13 view-container">
				<div class="view-container-spinner">
					<i class="icon-repeat icon-spin"></i>
				</div>

				<div id="profile" class="view-container-content">
					<form enctype="multipart/form-data">
						<img class="img-rounded pull-left avatar-change-help" id="imgShow" alt="Preview" ng-src="{{orgPicture}}">
						<p><strong>Change Avatar</strong><br>You can Upload GIF, PNG and JPG. (File Size Limit is 2mb)</p>
						<input type="file" id="imgInp" alt-change="imageUpload">
					</form>
					
					<div class="credentials row">
						<div class="column span_8">
							<label for="txtName">Change <abbr title="The name that's displayed for everyone. Warning! Not the Login Name - You can't change that.">Displayname</abbr>:</label>
							<input id="txtName" ng-model="txtName" type="text" placeholder="New Displayname">

							<label for="txtEmail">Change Email:</label>
							<input id="txtEmail" ng-model="txtEmail" type="text" placeholder="New Email" on-change="show_confirm()">

							<label for="txtPassword">Change Password:</label>
							<input id="txtPassword" ng-model="txtPassword" type="password" placeholder="New Password" on-change="show_confirm()">
						</div>
						<div class="confirmation column span_8" style="display:none">
							<label>Enter Password:</label>
							<input type="password" id="pw_1" ng-model="pw_1" placeholder="Enter (old) Password">
							<label>Repeat Password:</label>
							<input type="password" ng-model="pw_2" placeholder="Repeat (old) Password">
						</div>
					</div>
					<span class="text-error"></span>
				</div>

				<div id="channels" class="view-container-content" style="display:none">
					<table class="table">
						<thead>
							<tr>
								<td>Title</td>
								<td>Playlist Length</td>
								<td>Description</td>
								<td>Settings</td>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Bronies BW</td>
								<td>22</td>
								<td>Official German Pony-Music Channel from BroniesBW! We play everything f...</td>
								<td><a href=""><i class="icon-cogs"></i></a></td>
							</tr>
						</tbody>
						<tbody>
							<tr>
								<td>Powermetal is best Metal</td>
								<td>2</td>
								<td>In the name of Metal! Beware of hard beats and fast rhythms on this channel.</td>
								<td><a href=""><i class="icon-cogs"></i></a></td>
							</tr>
						</tbody>
					</table>
				</div>


				<div class="view-submit">
					<div class="submit-buttons">
						<a href="" ng-click="valid_submit()" class="button button-dark" id="frmSubmit">Save</a>
						<a href="" ng-click="cancel()" class="button button-red" id="frmCancel">Cancel</a>
					</div>
				</div>
			</div>

		</div>
	</div>

	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.0.5/angular.min.js"></script>
	<script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="<?php echo $sgtube_host ?>:8080/socket.io/socket.io.js"></script>
	<script src="assets/js/global.js"></script>
	<script src="assets/js/settings.js"></script>
</body>
</html>
