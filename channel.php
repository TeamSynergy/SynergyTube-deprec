<!DOCTYPE html>
<html ng-app="channel" ng-controller="channel_controller">
<head>
  <meta charset="utf-8">
  <title>SynergyTube | Channel: BroniesBW</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="//netdna.bootstrapcdn.com/bootswatch/2.3.1/cyborg/bootstrap.min.css" rel="stylesheet">
  <link href="//netdna.bootstrapcdn.com/font-awesome/3.0.2/css/font-awesome.css" rel="stylesheet">
  <link href="/assets/css/custom.css" rel="stylesheet">
  <link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-responsive.min.css" rel="stylesheet">
  <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=PT+Sans+Narrow:regular,bold">

</head>
<body>
  <div class="navbar navbar-fixed-top navbar-inverse">
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
    <div class="container content">
      <div class="channel-cover">
        <div class="channel-cover-text">
          <h1>Bronies BW</h1>
          <p>Official German Pony-Music Channel from BroniesBW! We play everything from Ponystep to Ponywhat. Pinkie Pie, Applejack, Twilight Sparkle, Derpy Hooves, Rarity, Sweetie Bell, Big Macintosh, Rainbow Dash, Scootalo, Princess Luna, Princess Celestia</p>
        </div>
      </div>
      <div class="alert-stack">
        <div ng-repeat="alert in alert_stack" class="alert alert-info" style="margin:0">
          <a href="" class="close" ng-click="dismiss_alert(alert)">&times;</a>
          <strong>Error {{alert.status}}:</strong> {{alert.content.code}}
        </div>
      </div>
        <div class="channel-second row">
          <div class="span6 youtube-player">
            <iframe id="player" type="text/html" height="390" src="http://www.youtube.com/embed/WgAqoXT-2kM?enablejsapi=1&origin=http://localhost" frameborder="0"></iframe>
          </div>
          <div class="span6 channel-sidebar">
            <ul class="sidebar-header inline">
              <li>{{online.length}} <i class="icon-eye-open icon-white"></i></li>
              <li>0 <i class="icon-star icon-white"></i></li>
              <li>0 <i class="icon-globe icon-white"></i></li>
            </ul>

            <div class="sidebar-chat">
              <h3>Chat:</h3>
              <ul class="unstyled">
			  <li ng-repeat="message in chat | orderBy:'timestamp'"><p><strong>{{message.display_name}}</strong><small class="muted">{{message.timestamp}}</small><br>
				{{message.content}}</p></li>
              </ul>

              <form class="chat-submit-div" ng-submit="sendMessage()">
                <div class="input-append">
                  <input type="text" ng-model="message" placeholder="New Message...">
                  <button class="btn btn-primary" type="submit" value="send">Submit</button>
                </div>
              </form>
            </div>

            <div class="sidebar-user">
              <h3>Online:</h3>
              <ul class="unstyled sidebar-user-list">
				<li ng-repeat="user in online | orderBy:'name'">{{user.name}}</li>
              </ul>
            </div>



          </div>
        </div>

      <div class="playlist">
		<table class="table table-striped table-condensed">
			<thead>
				<tr>
					<th>#</th>
					<th>Video</th>
					<th>User</th>
					<th><a href="#"><i class="icon-plus-sign"></i></a></th>
				</tr>
			</thead>
			<tbody dnd-list="playlist">
				<tr ng-repeat="item in playlist | orderBy:'position'" ng-class="{warning: item._id == active_item}">
					<td>{{item.position}}</td>
					<td><a href="{{item.url}}">{{item.caption}}</a></td>
					<td><a href="/user/{{item.login_name}}">{{item.display_name}}</a></td>
					<td><a href="#/edit/{{item._id}}"><i class="icon-edit icon-white"></i></a><a href="#/delete/{{item._id}}"><i class="icon-trash icon-white"></i></a></td>
				</tr>
			<tbody>
		</table>
      </div>

    </div>
    <div class="footer-pusher"></div>
  </div>

  <div class="footer">
    <div class="container footer-container">
      <p>&copy; SynergyTube by Screeny05; Fork me on <a href="https://github.com/screeny05/synergyTube">GitHub</a></p>
    </div>
  </div>

  <script src="//www.youtube.com/iframe_api"></script>
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
  <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min.js"></script>
  <script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>
  <script>window.jQuery || document.write('<script type="text/javascript" src="/assets/js/jquery.min.js"><\/script>')</script>
  <script>$.fn.modal || document.write('<script type="text/javascript" src="/assets/js/bootstrap.min.js"><\/script>')</script>
  <script>document.write('<script type="text/javascript" src="//' + document.location.host + ':8080/socket.io/socket.io.js"><\/script>'); window.io || document.write('<script type="text/javascript" src="/assets/js/socket.io.js"><\/script>')</script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.5/angular.min.js"></script>
  <script src="/assets/js/channel.js"></script>
</body>
</html>
