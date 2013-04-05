<?php
  $con = new mysqli("localhost", "root", "root", "synergy");
  if($con->connect_errno)
    print("<h1>Error: DB-Fuckup</h1>");
  $channel = mysqli_fetch_object($con->query("SELECT count(*) AS '_c', _id, name, cover_id, description, views FROM tblChannels WHERE custom_url = '".$con->real_escape_string($_GET['c'])."'"));
?>

<!DOCTYPE html>
<html ng-app="channel" ng-controller="channel_controller">
<head>
  <title>SynergyTube | Channel: <?php if($channel != null && ($channel->_c > 0)) print($channel->name); ?></title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.min.css" rel="stylesheet">
  <link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-responsive.min.css" rel="stylesheet">
  <link href="/assets/css/custom.css" rel="stylesheet">
  <link href="/assets/css/style.css" rel="stylesheet">
  <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=PT+Sans+Narrow:regular,bold">
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
        <a class="brand" href="/">SynergyTube</a>
        <div class="nav-collapse collapse">
          <ul class="nav">
            <li><a href="/">Channels</a></li>
            <li><a href="/categories">Categories</a></li>
          </ul>
          <ul class="nav pull-right">
            <li><a href="#">Log In</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div class="content-wrap">
      <div class="channel-cover">
        <div class="channel-cover-text">
		  <div class="container">
            <h1><?php if($channel != null && ($channel->_c > 0)) print($channel->name); else print("Error - Channel not found!");?></h1>
            <p><?php if($channel != null && ($channel->_c > 0)) print($channel->description); ?></p>
          </div>
		</div>
      </div>
    <div class="container content">
      <div class="alert-stack">
        <div ng-repeat="alert in alert_stack" class="alert alert-info" style="margin:0">
          <a href="" class="close" ng-click="dismiss_alert(alert)">&times;</a>
          <strong>Error {{alert.status}}:</strong> {{alert.content.code}}
        </div>
      </div>
        <div class="channel-second">
          <div class="sp2 youtube-player">
            <div id="replace-player">
              <p><h1>An Error happened</h1>
              You need Flash player 8+ and JavaScript enabled to use SynergyTube.</p>
            </div>

			    <div class="playlist">
				    <table class="table table-striped table-condensed">
					    <thead>
						<tr>
							<th></th>
							<th>Video</th>
							<th>Length</th>
							<th>User</th>
							<th><a href="#addItem"><i class="icon-plus-sign"></i></a></th>
						</tr>
					</thead>
					<tbody dnd-list="playlist">
						<tr ng-repeat="item in playlist | orderBy:'position'" ng-class="{playc: item._id == active_item}">
							<td>{{item.position}}</td>
							<td><a href="{{item.url}}">{{item.caption}}</a></td>
							<td>{{getLength(item.duration)}}</td>
							<td><a href="/user/{{item.login_name}}">{{item.display_name}}</a></td>
							<td><a href="" ng-click="playItem(item._id)"><i class="icon-play"></i></a></td>
						</tr>
					<tbody>
				</table>
			</div>
          </div>
          <div class="sp2 channel-chat">
              <h3>Chat:</h3>
              <ul class="unstyled">
			        <li ng-repeat="message in chat | orderBy:'timestamp'"><p><strong>{{message.display_name}}</strong> <small class="muted">{{getTime(message.timestamp)}}</small><br>
                {{message.content}}</p></li>
              </ul>

              <form class="chat-submit" ng-submit="sendMessage()">
                <div class="input-append">
                  <input type="text" ng-model="message" placeholder="New Message..." class="input-block-level">
                  <button class="btn btn-primary" type="submit" value="send">Submit</button>
                </div>
              </form>
		  </div>
		  
		  <div class="sp1">
            <div class="channel-user">
              <h3>Online:</h3>
              <ul class="unstyled user-list">
                <li ng-repeat="user in online | orderBy:'display_name'">{{user.display_name}}</li>
              </ul>
            </div>
			
          </div>
        </div>

    </div>
    <div class="footer-pusher"></div>
  </div>

  <div class="footer">
    <div class="container footer-container">
      <p>&copy; SynergyTube by Screeny05; Fork me on <a href="https://github.com/screeny05/synergyTube">GitHub</a></p>
    </div>
  </div>

  <script><?php 
    if($channel->_c > 0) print("var channel_id = ".$channel->_id.";");
  ?></script>
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
  <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js"></script>
  <script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>
  <script>window.jQuery || document.write('<script type="text/javascript" src="/assets/js/jquery.min.js"><\/script>')</script>
  <script>$.fn.modal || document.write('<script type="text/javascript" src="/assets/js/bootstrap.min.js"><\/script>')</script>
  <script>document.write('<script type="text/javascript" src="//' + document.location.host + ':8080/socket.io/socket.io.js"><\/script>');</script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.5/angular.min.js"></script>
  <script src="/assets/js/jquery.ddd.min.js"></script>
  <script src="/assets/js/channel.js"></script>
</body>
</html>
