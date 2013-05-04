<?php require("require/channel_init.php"); ?>

<!DOCTYPE html>
<html ng-app="channel" ng-controller="channel_controller">
<head>
  <title>SynergyTube | Loading Channel...</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.min.css" rel="stylesheet">
  <link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-responsive.min.css" rel="stylesheet">
  <link href="<?php echo $sgtube_root; ?>/assets/css/custom.css" rel="stylesheet">
  <link href="<?php echo $sgtube_root; ?>/assets/css/style.css" rel="stylesheet">
  <link href="<?php echo $sgtube_root; ?>/assets/css/lionbars.css" rel="stylesheet">
  <link href="http://fonts.googleapis.com/css?family=PT+Sans+Narrow:regular,bold" rel="stylesheet">
  <style type="text/css">.channel-cover{background:<?php print("url(".$sgtube_root."/assets/img/".$channel_cover_id.") ".$channel_cover_repeat." ".$channel_cover_pos_x." ".$channel_cover_pos_y); ?>;-webkit-background-size: cover;-moz-background-size: cover;-o-background-size: cover;background-size: cover;}</style>
</head>
<body style="overflow:hidden;">

<div class="wrap-the-load">
  <div class="loading-border">
		<div class="loading-image">
			<img src="<?php echo $sgtube_root; ?>/assets/img/cloud_pre.png">
		</div>
		<div class="loading-lower">
			<span class="txt-init">Initializing <i>the</i> Awesome!</span><br>
			<hr class="upper-hr">
			<span class="txt-status">Waiting for Server...</span>
			<div class="progress progress-striped active">
				<div class="bar"></div>
			</div>
			<hr class="lower-hr">
			<span class="txt-copy">&copy;2013 <a href="mailto:screeny05@gmail.com">Screeny</a>; <a href="https://github.com/screeny05/SynergyTube">Fork me on GitHub</a></span>
		</div>
	</div>
</div>

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
            <li><a href="<?php echo $sgtube_root; ?>/">Channels</a></li>
            <li><a href="<?php echo $sgtube_root; ?>/categories">Categories</a></li>
          </ul>
          <ul class="nav pull-right">
            <li ng-show="logged_in"><a href="<?php echo $sgtube_root; ?>/create_channel">Create Channel</a></li>
            <li class="dropdown" ng-show="!logged_in"><a href="#" class="dropdown-toggle" data-toggle="dropdown">Login<b class="caret"></b></a>
              <div class="dropdown-menu login-dropdown">
                <form ng-submit="login()">
                  <input type="text" placeholder="Username" name="username" ng-model="txtlogin_name" required>
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
            <li class="dropdown" ng-show="logged_in"><a href="#" class="dropdown-toggle" data-toggle="dropdown">{{display_name}}<b class="caret"></b></a>
              <ul class="dropdown-menu" role="menu">
                <li><a href=""><i class="icon-user"></i> Profile</a></li>
                <li><a href=""><i class="icon-heart"></i> Favourites</a></li>
                <li class="divider"></li>
                <li><a href="" ng-click="logout()"><i class="icon-off"></i> Log Out</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div class="content-wrap">
    <div class="channel-cover">
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
          </div>

          <div class="playlist">
            <div class="info-bar">
              <div class="pull-left">
                <a href="" class="_tt" data-toggle="tooltip" title="Favourites" ng-click="fav_this()"><i class="icon-heart"></i> {{favs}} - <span ng-show="already_faved">Unfav this</span><span ng-show="!already_faved">Fav this</span></a> |
                <span class="_tt" data-toggle="tooltip" title="Unique Visitors"><i class="icon-globe"></i> {{views}}</span> |
                <span class="_tt" data-toggle="tooltip" title="Online Users"><i class="icon-eye-open"></i> {{online.length + guests}}</span> |
                <span class="_tt" data-toggle="tooltip" title="Items in Playlist"><i class="icon-th-list"></i> {{playlist.length}}</span>
              </div>
              <div class="pull-right">
                <a class="_tt" href="" data-toggle="tooltip" ng-show="is_admin" title="Play last"><i class="icon-backward"></i></a>
                <a class="_tt" href="" data-toggle="tooltip" ng-show="is_admin" title="Pause"> <i class="icon-pause"></i></a>
                <a class="_tt" href="" data-toggle="tooltip" ng-show="is_admin" title="Play next"><i class="icon-forward"></i></a><span ng-show="is_admin"> |</span>
                <a href="" class="_tt" data-toggle="tooltip" ng-show="is_admin" title="Add new Item" ng-click="show_pl_bars(true,false)"><i class="icon-plus"></i></a><span ng-show="is_admin"> |</span>
                <a href="" class="_tt" data-toggle="tooltip" ng-click="show_pl_bars(false,true)" title="Search Item"><i class="icon-search"></i></a>
              </div>
            </div>

            <form class="form-append form-horizontal" name="appendForm" ng-submit="add_new_item()" ng-show="show_add">
              <label class="control-label" for="itemURL">Item-URL</label>
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
                  <td><a href="http://www.youtube.com/watch?v={{item.url}}">{{item.caption}}</a></td>
                  <td>{{getLength(item.duration)}}</td>
                  <td><a href="<?php echo $sgtube_root; ?>/user/{{item.login_name}}">{{item.display_name}}</a></td>
                  <td><a class="_tt" data-toggle="tooltip" ng-show="is_admin" title="Play this" href="" ng-click="play_item(item._id)"><i class="icon-play"></i></a></td>
                  <td><a class="_tt" data-toggle="tooltip" ng-show="is_admin" title="Remove this" href="" ng-click="remove_item(item._id)"><i class="icon-trash"></i></a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="sp2">
          <div class="channel-chat">
            <h4>Chat:</h4>
            <ul class="unstyled" on-scroll="load_messages()">
              <li ng-repeat="message in chat | orderBy:'timestamp'">
                <div class="chat-content"><hr><p><strong>{{message.display_name}}</strong> <small class="muted _tt" data-toggle="tooltip" title="{{getDate(message.timestamp)}}">{{getTime(message.timestamp)}}</small><br>
                {{message.content}}</p></div>
              </li>
            </ul>
            <form class="chat-submit" ng-submit="sendMessage()" ng-show="logged_in">
              <input type="text" ng-model="message" placeholder="Chat" class="input-block-level">
            </form>
          </div>
          <div class="channel-user">
            <h4>Who's Here?</h4>
            <ul class="unstyled user-list">
              <li ng-repeat="user in online | orderBy:'display_name'" ng-class="{elevated: user.is_admin}">
                <hr>
                <div class="avatar"><img src="//secure.gravatar.com/avatar/{{user.email}}?d=mm"></div>
                <p>{{user.display_name}}</p>
              </li>
              <!-- damned pluralization -->
              <li ng-show="guests == 1"><p>1 Guest</p></li>
              <li ng-show="guests > 1"><p>{{guests}} Guests</p></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-pusher"></div>
  </div>

  <div class="footer">
    <div class="container footer-container">
      <p>&copy; SynergyTube by Screeny05 (It's v0.2); Fork me on <a href="https://github.com/screeny05/synergyTube">GitHub</a></p>
    </div>
  </div>

  
  <script>var channel_error_msg = "<?php print $channel_error_msg ?>", channel_id = <?php print $channel_id ?>, channel_title = "<?php print $channel_title ?>";</script>
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
  <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js"></script>
  <script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>
  <script>window.jQuery || document.write('<script type="text/javascript" src="/assets/js/jquery.min.js"><\/script>')</script>
  <script>$.fn.modal || document.write('<script type="text/javascript" src="/assets/js/bootstrap.min.js"><\/script>')</script>
  <script>document.write('<script type="text/javascript" src="//<?php echo $sgtube_host; ?>:8080/socket.io/socket.io.js"><\/script>');</script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.5/angular.min.js"></script>
  <script src="<?php echo $sgtube_root; ?>/assets/js/jquery.ddd.min.js"></script>
  <script src="<?php echo $sgtube_root; ?>/assets/js/jquery.lionbars.min.js"></script>
  <script src="<?php echo $sgtube_root; ?>/assets/js/channel.js"></script>
</body>
</html>
