<?php require_once("require/channel_init.php"); require("require/util.func.php");?>
<!DOCTYPE html>
<html ng-app="channel" ng-controller="channel_controller">
<head>
	<title>SynergyTube | Loading Channel...</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
	<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
	<meta name="description" content="<?php pe($channel_description)?>"/>
	<meta name="keywords" content="<?php pe($channel_tags)?>"/>
	<meta name="author" content="<?php pe($channel_owner)?>"/>
	<link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.min.css" rel="stylesheet"/>
	<link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-responsive.min.css" rel="stylesheet"/>
	<link href="//netdna.bootstrapcdn.com/font-awesome/3.0.2/css/font-awesome.css" rel="stylesheet">
	<link href="<?php echo $sgtube_root;?>/assets/css/style.css" rel="stylesheet"/>
	<link href="<?php echo $sgtube_root;?>/assets/css/lionbars.css" rel="stylesheet"/>
	<link href="http://fonts.googleapis.com/css?family=PT+Sans+Narrow:regular,bold" rel="stylesheet"/>
	<style type="text/css">.channel-cover{background:<?php p("url(".$sgtube_root."/assets/img/".$channel_cover_id.") ".$channel_cover_repeat." ".$channel_cover_pos_x." ".$channel_cover_pos_y); ?>;-webkit-background-size: cover;-moz-background-size: cover;-o-background-size: cover;background-size: cover;}</style>
</head>
<body>
  <div class="navbar">
    <div class="navbar-inner">
      <div class="container">
        <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </a>
        <a class="brand" href="<?php echo $sgtube_root; ?>">SynergyTube</a>
        <div class="nav-collapse collapse">
          <ul class="nav">
            <li><a href="<?php echo $sgtube_root; ?>/categories">Categories</a></li>
          </ul>
          <ul class="nav pull-right">
            <li class="dropdown" ng-show="!logged_in"><a href="#" class="dropdown-toggle" data-toggle="dropdown">Login<b class="caret"></b></a>
              <div class="dropdown-menu login-dropdown">
                <form ng-submit="login()">
                  <input type="text" placeholder="Username or Email" name="username" ng-model="txtlogin_name" required>
                  <input type="password" placeholder="Password" name="password" ng-model="password" required>
                  <input class="btn btn-primary btn-block" type="submit" value="Login">
                  <p class="text-center">or</p>
                  <a href="" class="btn btn-block">Login with Facebook</a>
                  <a href="" class="btn btn-block">Login with Twitter</a>
                  <a href="" class="btn btn-block">Login with Google</a>
                </form>
              </div>
            </li>
            <li class="dropdown create-an-account-dropdown" ng-show="!logged_in"><a href="#" class="dropdown-toggle" data-toggle="dropdown">Create an Account<b class="caret"></b></a>
              <div class="dropdown-menu login-dropdown">
                <form ng-submit="create_account()">
                  <input type="text" placeholder="Username" name="username" ng-model="create_login_name" required>
                  <input type="email" placeholder="Email" name="email" ng-model="email" required>
                  <input type="password" placeholder="Password" name="password" ng-model="create_password" required>
                  <input class="btn btn-primary btn-block" type="submit" value="Create Account">
                </form>
              </div>
            </li>
            <li class="dropdown" ng-show="logged_in">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                <i class="icon-star"></i> Favourites<b class="caret"></b>
              </a>
              <ul class="dropdown-menu favourite-list" role="menu">
                <li ng-show="favourites.length == 0"><p>You haven't faved any Channels yet. To Fav a Channel click on the empty star in the control-bar under the media-container.</p></li>
                <li ng-repeat="item in favourites" ng-class="{current: item.channel_id == channel_id}">
                  <a href="<?php echo $channelpage_url; ?>{{item.custom_url}}">
                    <h5>
                      <i ng-show="item.channel_id == channel_id" class="icon-play"></i>
                      {{item.name}}
                    </h5>
                    <p>
                      {{item.description}}
                    </p>
                  </a>
                  <hr ng-hide="$index == favourites.length - 1">
                </li>
              </ul>
            </li>
            <li class="dropdown" ng-show="logged_in">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown">{{display_name}}<b class="caret"></b></a>
              <ul class="dropdown-menu" role="menu">
                <li><a href="<?php echo $sgtube_root; ?>/profile"><i class="icon-user"></i> Profile</a></li>
                <li><a href="<?php echo $sgtube_root; ?>/create_channel"><i class="icon-plus-sign"></i> Create Channel</a></li>
                <li class="divider"></li>
                <li><a href="" ng-click="logout()"><i class="icon-off"></i> Log Out</a></li>
              </ul>
            </li>
            <li><a href="" ng-click='toggle_cp()'><i class="" ng-class='{"icon-remove": show_cp == true, "icon-wrench": show_cp == false}'></i></a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>


	<div class="wrap-the-load">
		<div class="loading-border">
			<div class="loading-image">
				<img src="<?php echo $sgtube_root; ?>/assets/img/cloud_pre.png">
			</div>
			<div class="loading-lower">
				<span class="txt-init">Initializing <i>the</i> Channel</span><br>
				<hr class="upper-hr">
				<span class="txt-status">Waiting for Server...</span>
				<div class="progress progress-striped active">
					<div class="bar"></div>
				</div>
				<hr class="lower-hr">
				<span class="txt-copy">&copy;2013 <a href="mailto:screeny05@gmail.com">TeamSynergy!</a> <a href="https://github.com/screeny05/SynergyTube">Fork us on GitHub</a></span>
			</div>
		</div>
	</div>

  <div class="content-wrap">
    <div class="channel-cover">
      <div class='channel-cover-cp'>
        <div class="container">
        <div class="tabbable tabs-left">
          <ul class="nav nav-tabs">
            <li class='active'><a href="#tab1" data-toggle="tab">Profile</a></li>
            <li><a href="#tab2" data-toggle="tab">Viewing</a></li>
            <li><a href="#tab3" data-toggle="tab">Browsing</a></li>
            <li><a href="#tab3" data-toggle="tab" ng-show='logged_in'>And add tabs</a></li>
            <li><a href="#tab3" data-toggle="tab" ng-show='owns_channel||is_admin'>According to </a></li>
            <li><a href="#tab3" data-toggle="tab" ng-show='is_admin'>permissions</a></li>
          </ul>
          <div class="tab-content">
            <div class="tab-pane active fade in" id="tab1">
              <a href="" ng-click='toggle_cp()' style='float:right; margin-right:24px;'><i ng-class='{"icon-remove": show_cp == true}'></i></a>
              <form class="form-horizontal">
                <fieldset>
                  <legend>Profile Settings</legend>
                  <div class="control-group">
                    <label class="control-label" for="inputDP">Display Name</label>
                    <div class="controls">
                      <p>Current display name: <b>{{display_name}}</b></p>
                      <input type="text" id="inputDP" placeholder="New display name?"/>
                    </div>
                  </div>
                  <div class="control-group">
                    <label class="control-label" for="inputGravatar">Gravatar</label>
                    <div class="controls">
                      <img ng-src="//secure.gravatar.com/avatar/{{email_hash}}?d=mm&s=128"/>
                      <img ng-src="//secure.gravatar.com/avatar/{{email_hash}}?d=mm&s=78"/>
                      <img ng-src="//secure.gravatar.com/avatar/{{email_hash}}?d=mm&s=28"/>
                      <label class="checkbox">
                        <input type="checkbox"> disable gravatar?
                      </label>
                    </div>
                  </div>
                  <div class="control-group">
                    <label class="control-label" for="inputEmail">Email</label>
                    <div class="controls">
                      <p>Current Email: <b>{{email}}</b></p>
                      <input type="text" id="inputEmail" placeholder="New email?"/>
                    </div>
                  </div>
                  <div class="control-group">
                    <label class="control-label" for="inputNewPassword">Password</label>
                    <div class="controls">
                      <input type="password" id="inputNewPassword" placeholder="New password"/><br/>
                      <input type="password" id="inputNewPassword2" placeholder="Repeat new password"/>
                    </div>
                  </div>
                  <div class="control-group">
                    <div class="controls">
                      <input type="password" id="inputPassword" placeholder="Current password"/><br/>
                      <button type="submit" class="btn">Update</button>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>
            <div class="tab-pane fade" id="tab2">
              <form class="form-horizontal">
                <fieldset>
                  <legend>Of course it's a bad idea to even populate these tabs if the user doesn't have the permissions.</legend>
                  <div class="control-group">
                    <label class="control-label" for="inputEmail">Email</label>
                    <div class="controls">
                      <input type="text" id="inputEmail" placeholder="Email">
                    </div>
                  </div>
                  <div class="control-group">
                    <label class="control-label" for="inputPassword">Password</label>
                    <div class="controls">
                      <input type="password" id="inputPassword" placeholder="Password">
                    </div>
                  </div>
                  <div class="control-group">
                    <div class="controls">
                      <label class="checkbox">
                        <input type="checkbox"> über awesome mega party client mode
                      </label>
                      <button type="submit" class="btn">Update</button>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>
            <div class="tab-pane fade" id="tab3">
              <form class="form-horizontal">
                <fieldset>
                  <legend>So maybe we shouldn't even send them the contents if they don't?</legend>
                  <div class="control-group">
                    <label class="control-label" for="inputEmail">Email</label>
                    <div class="controls">
                      <input type="text" id="inputEmail" placeholder="Email">
                    </div>
                  </div>
                  <div class="control-group">
                    <label class="control-label" for="inputPassword">Password</label>
                    <div class="controls">
                      <input type="password" id="inputPassword" placeholder="Password">
                    </div>
                  </div>
                  <div class="control-group">
                    <div class="controls">
                      <label class="checkbox">
                        <input type="checkbox"> Remember me
                      </label>
                      <button type="submit" class="btn">Update</button>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>							
            <div class="tab-pane fade" id="tab4">
              <form class="form-horizontal">
                <fieldset>
                  <legend>Maybe populate the "privileged" tabs html in php</legend>
                  <div class="control-group">
                    <label class="control-label" for="inputEmail">Email</label>
                    <div class="controls">
                      <input type="text" id="inputEmail" placeholder="Email">
                    </div>
                  </div>
                  <div class="control-group">
                    <label class="control-label" for="inputPassword">Password</label>
                    <div class="controls">
                      <input type="password" id="inputPassword" placeholder="Password">
                    </div>
                  </div>
                  <div class="control-group">
                    <div class="controls">
                      <label class="checkbox">
                        <input type="checkbox"> Remember me
                      </label>
                      <button type="submit" class="btn">Update</button>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>							
            <div class="tab-pane fade" id="tab5">
              <form class="form-horizontal">
                <fieldset>
                  <legend>So maybe we shouldn't even send them the contents if they don't?</legend>
                  <div class="control-group">
                    <label class="control-label" for="inputEmail">Email</label>
                    <div class="controls">
                      <input type="text" id="inputEmail" placeholder="Email">
                    </div>
                  </div>
                  <div class="control-group">
                    <label class="control-label" for="inputPassword">Password</label>
                    <div class="controls">
                      <input type="password" id="inputPassword" placeholder="Password">
                    </div>
                  </div>
                  <div class="control-group">
                    <div class="controls">
                      <label class="checkbox">
                        <input type="checkbox"> Remember me
                      </label>
                      <button type="submit" class="btn">Update</button>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>							
            <div class="tab-pane fade" id="tab6">
              <form class="form-horizontal">
                <fieldset>
                  <legend>So maybe we shouldn't even send them the contents if they don't?</legend>
                  <div class="control-group">
                    <label class="control-label" for="inputEmail">Email</label>
                    <div class="controls">
                      <input type="text" id="inputEmail" placeholder="Email">
                    </div>
                  </div>
                  <div class="control-group">
                    <label class="control-label" for="inputPassword">Password</label>
                    <div class="controls">
                      <input type="password" id="inputPassword" placeholder="Password">
                    </div>
                  </div>
                  <div class="control-group">
                    <div class="controls">
                      <label class="checkbox">
                        <input type="checkbox"> Remember me
                      </label>
                      <button type="submit" class="btn">Update</button>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>							
          </div>
        </div>
        </div>
      </div>
      <div class="channel-cover-text">
        <div class="container">
          <h1><?php print($channel_title);?></h1>
          <p><?php  print($channel_description); ?></p>
        </div>
      </div>
    </div>
    <div class="container content">
      <div class="alert-stack">
        <div ng-repeat="alert in alert_stack" class="alert alert-info" style="margin:0">
          <a href="" class="close" ng-click="dismiss_alert(alert)">&times;</a>
          <strong ng-show="alert.strong">{{alert.strong}}:</strong> {{alert.text}}
        </div>
      </div>
      <div class="channel-second">
        <div class="sp2 youtube-player">
          <div id="replace-player">
            <p><h1>An Error happened</h1>
            You need Flash player 8+ and JavaScript enabled to use SynergyTube.</p>
          </div><div class="playlist">
						<div class="info-bar-channel" style='text-align: center;'>
							<div class="pull-left">
								<span class="_tt" data-toggle="tooltip" title="Favourites">
									<a href="" ng-click="fav_this()">
										<i class="icon-star-empty" ng-show="!already_faved"></i><i class="icon-star" ng-show="already_faved"></i>
										{{favs}}</a>
								</span><span class="_tt" data-toggle="tooltip" title="Unique Visitors">
									<i class="icon-globe"></i> {{views}}
								</span><span class="_tt" data-toggle="tooltip" title="Online Users">
									<i class="icon-eye-open"></i> {{online.length + guests}}
								</span><span class="_tt" data-toggle="tooltip" title="Items in Playlist">
									<i class="icon-th-list"></i> {{playlist.length}}
								</span>
							</div>
								<a id='skips' class="_tt" href="" ng-click="skip_vote()" data-toggle="tooltip" title="Skip ({{skip.votes}} out of {{skip.goal}})">
									<span>{{skip.votes}} </span><i class="icon-road"></i><span> {{skip.goal}}</span>
								</a>
							<div class="pull-right">
								<a class="_tt" href="" data-toggle="tooltip" ng-show="is_admin" title="Play last"><i class="icon-backward"></i></a>
								<a class="_tt" href="" data-toggle="tooltip" ng-show="is_admin" title="Pause"> <i class="icon-pause"></i></a>
								<a class="_tt" href="" data-toggle="tooltip" ng-show="is_admin" title="Play next"><i class="icon-forward"></i></a><span ng-show="is_admin"> |</span>
								<a href="" class="_tt" data-toggle="tooltip" ng-show="is_admin" title="Add new Item" ng-click="show_pl_bars(true,false)"><i class="icon-plus"></i></a><span ng-show="is_admin"> |</span>
								<a href="" class="_tt" data-toggle="tooltip" ng-click="show_pl_bars(false,true)" title="Search Item"><i class="icon-search"></i></a>
							</div>
						</div>

						<form class="form-append form-horizontal" name="appendForm" ng-submit="add_new_item()" ng-show="show_add">
							<label class="control-label" for="addTextbox">Item URL:</label>
							<div class="controls">
								<input type="url" class="input-block-level pull-left" id="addTextbox" on-change="itemUrlCallback()" placeholder="Item-URL" id="itemURL" ng-model="itemURL" required>
								<div class="input-append">
									<button type="submit" class="btn btn-primary pull-right" ng-disabled="!add_item.valid">Add Item</button>
								</div>
								<span class="help-block" ng-show="add_item.valid">Caption: {{add_item.caption}}, Duration: {{getLength(add_item.duration)}}</span>
							</div>
						</form>

						<form class="form-append form-horizontal" ng-show="show_search">
							<input type="text" class="input-block-level" id="searchTextbox" placeholder="Search" ng-model="searchTitle">
						</form>

						<table class="table table-striped table-condensed playlist-table">
							<tbody dnd-list="playlist">
								<tr ng-repeat="item in playlist | filter:searchTitle | orderBy:'position'" ng-class="{playc: item._id == active_item}">
									<td>{{item.position}}</td>
									<td><a ng-href="http://www.youtube.com/watch?v={{item.url}}">{{item.caption}}</a></td>
									<td>{{getLength(item.duration)}}</td>
									<td><a href="<?php echo $sgtube_root; ?>/user/{{item.login_name}}">{{item.display_name}}</a></td>
									<td><a class="_tt" data-toggle="tooltip" ng-show="is_admin" title="Play this" href="" ng-click="play_item(item._id)"><i class="icon-play"></i></a></td>
									<td><a class="_tt" data-toggle="tooltip" ng-show="is_admin" title="Remove this" href="" ng-click="remove_item(item._id)"><i class="icon-trash"></i></a></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div><div class="sp2">
          <div class="channel-chat">
            <h4>Chat:</h4>
            <div class='channel-chat-inner'>
              <ul class="unstyled" on-scroll="load_messages()">
                <li ng-repeat="message in chat | orderBy:'timestamp'">
                  <div class="chat-content">
                    <div class='chat-header' ng-hide='message.display_name == chat[chat.length - $index].display_name'>
                      <strong>{{message.display_name}}</strong>
                      <hr/>
                    </div>
                    <small class="muted pull-right" data-toggle="tooltip" title="{{getDate(message.timestamp)}}">{{getTime(message.timestamp)}}</small>
                    <p parse-url="_blank">{{message.content}}</p>
                  </div>
                </li>
              </ul>
              <form class="chat-submit" ng-submit="sendMessage()" ng-show="logged_in">
                <input type="text" ng-model="message" placeholder="Chat" class="input-block-level">
              </form>
            </div>
          </div><div class="channel-user">
            <h4>Who's Here?</h4>
            <ul class="unstyled user-list">
              <li ng-repeat="user in online | orderBy:'display_name'" ng-class="{elevated: user.is_admin}">
                <hr>
                <div class="avatar"><img ng-src="//secure.gravatar.com/avatar/{{user.email_hash}}?d=mm"></div>
                <p>{{user.display_name}}</p>
              </li>
              <!-- less damned pluralization -->
              <li><p ng-pluralize count="guests"
     when="{'0': 'No Guests.',
                 'one': '1 Guest.',
                 'other': '{} Guests.'}"></p></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-pusher"></div>
  </div>

	<div class="footer">
		<div class="container footer-container">
			<p>&copy; SynergyTube by TeamSynergy (It's v0.2); Fork us on <a href="https://github.com/screeny05/synergyTube">GitHub</a></p>
		</div>
	</div>

	
	<script>var channel_error_msg = "<?php print $channel_error_msg ?>", channel_id = <?php print $channel_id ?>, channel_title = "<?php print $channel_title ?>";</script>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js"></script>
  <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.0.5/angular.min.js"></script>
	<script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>
	<script>window.jQuery || document.write('<script type="text/javascript" src="/assets/js/jquery.min.js"><\/script>')</script>
	<script>$.fn.modal || document.write('<script type="text/javascript" src="/assets/js/bootstrap.min.js"><\/script>')</script>
	<script type="text/javascript" src="<?php echo $sgtube_host; ?>:8080/socket.io/socket.io.js"></script>
	<script src="<?php echo $sgtube_root;?>/assets/js/jquery.ddd.min.js"></script>
	<script src="<?php echo $sgtube_root;?>/assets/js/jquery.lionbars.min.js"></script>
	<script src="<?php echo $sgtube_root;?>/assets/js/global.js"></script>
	<script src="<?php echo $sgtube_root;?>/assets/js/channel.js"></script>
</body>
</html>
