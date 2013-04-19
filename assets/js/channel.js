$(function(){
	// I hate the chromeless player, i'll never build my own controls. Take this dummy!
	swfobject.embedSWF("http://www.youtube.com/v/xxxxxxxxxxx?enablejsapi=1&playerapiid=ytplayer&version=3&autohide=1&theme=light", "replace-player", "100%", "380", "8", null, null, { allowScriptAccess: "always" }, { id: "myytplayer" });
	$('._tt').tooltip({placement:'bottom'});
	$('#itemURL').live('input', function(){
		var reg = $('#itemURL').val().match(/(?:youtube(?:-nocookie)?\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/);
		if(reg){
			var tag = document.createElement('script');
			tag.src = "https://gdata.youtube.com/feeds/api/videos/" + reg[1] + "?alt=json-in-script&v=2&callback=gdataCallbackProxy";
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		} else {
			angular.element('html').scope().add_item.valid = false;
			angular.element('html').scope().$apply();
		}
	});
	$('.channel-cover-text').dotdotdot({watch:true});
});
var app = angular.module('channel',[]);
var socket = io.connect('//' + window.location.host + ':8080', { query:"session_id=" + readCookie("session_id") + "&channel_id=" + channel_id });
var player;

function gdataCallbackProxy(data){angular.element('html').scope().gdataCallback(data);}
function stateChangeProxy(state){angular.element('html').scope().playerStateChange(state);}
function onYouTubePlayerReady(playerId) {
	player = document.getElementById("myytplayer");
	player.addEventListener("onStateChange", "stateChangeProxy");
}

function channel_controller($scope){
	$scope.playlist = [];
	$scope.chat = [];
	$scope.online = [];
	$scope.alert_stack = [];
	$scope.add_item = { valid: false };
	$scope.login_name = "";
	$scope.display_name = "";
	$scope.views = 0;
	$scope.favs = 0;
	$scope.guests = 0;
	// The currently active media-item-_id
	$scope.active_item = 1;
	$scope.start_time = null;
	$scope.reordered = false;
	$scope.removed = false;
	
	socket.on('channel.init', function(data){
		$scope.playlist = data.content.playlist;
		$scope.chat = data.content.last_chat;
		$scope.online = data.content.users_online;
		$scope.favs = data.content.favourites;
		$scope.views = data.content.views;
		$scope.active_item = data.content.now_playing._id;
		$scope.start_time = data.content.now_playing.start_time;
		$scope.logged_in = data.content.logged_in;

		if(data.content.logged_in){
			$scope.is_admin = data.content.user_data.is_admin;
			$scope.login_name = data.content.user_data.login_name;
			$scope.display_name = data.content.user_data.display_name;
		} else {
			$scope.is_admin = false;
			$scope.login_name = "guest";
			$scope.display_name = "Guest";
		}

		var intv = setInterval(function(){
			console.log("waiting for player to finish initializing...");
			if(player){
				var start_seconds = (new Date().getTime() - new Date($scope.start_time).getTime()) / 1000;
				player.loadVideoById(data.content.now_playing.url, start_seconds);
				clearInterval(intv);
			}
		}, 1000);
		$scope.$apply();
		$('.channel-chat > ul').scrollTop($('.channel-chat > ul')[0].scrollHeight);
	});
	socket.on('playlist.append_item', function(data){
		$scope.playlist.push(data.content);
		$scope.$apply();
	});
	socket.on('playlist.play_item', function(data){
		var start_seconds = (new Date().getTime() - new Date(data.content.start_time).getTime()) / 1000;
		var item;
		for (var i = 0; i < $scope.playlist.length; i++) {
			if($scope.playlist[i]._id === data.content._id){
				item = $scope.playlist[i];
				break;
			}
		};
		player.loadVideoById(item.url, start_seconds);
		$scope.active_item = item._id;
		$scope.$apply();
	});
	socket.on('playlist.reorder', function(data){
		// may we get this a little more efficient?
		for (var x = 0; x < $scope.playlist.length; x++) {
			for (var y = 0; y < data.content.length; y++) {
				if($scope.playlist[x]._id === data.content[y]._id)
					$scope.playlist[x].position = data.content[y].position;
			};
		};
		$scope.$apply();
	});
	socket.on('chat.incoming', function(data){
		$scope.chat.push(data.content);
		$scope.$apply();
		$('.channel-chat > ul').animate({ scrollTop: $('.channel-chat > ul')[0].scrollHeight},800);
	});
	socket.on('channel.user_join', function(data){
		$scope.online.push(data.content);
		$scope.$apply();
	});
	socket.on('channel.user_leave', function(data){
		for (var i = 0; i < $scope.online.length; i++) {
			if($scope.online[i].user_id === data.content._id){
				$scope.online.splice(i, 1);
				break;
			}
		};
		$scope.$apply();
	});
	socket.on('channel.guest_join', function(){
		$scope.guests++;
		$scope.$apply();
	});
	socket.on('channel.guest_leave', function(){
		$scope.guests--;
		$scope.$apply();
	});
	socket.on('channel.faved', function(){
		$scope.favs++;
		$scope.apply();
	})
	socket.socket.on('error', function(data){
		$scope.alert_stack.push({ status: "Server-Error", text: "Unable to connect to Synergy-Server"});
		$scope.$apply();
	});
	socket.on('error', function(data){
		$scope.alert_stack.push({ strong: "Error " + data.status, text: data.content.code });
		$scope.$apply();
	});
	socket.on('error.session_id', function(data){
		$scope.alert_stack.push({ text: "You don't seem to be logged in. If you use SynergyTube without registration you are not able to Chat." });
	});
	socket.on('user.session_id', function(data){
		createCookie("session_id", data.content.session_id);
		window.location.reload();
		//socket.socket.connect('//' + window.location.host + ':8080', { query:"session_id=" + readCookie("session_id") + "channel_id=" + channel_id});
	});
	socket.on('user.destroy_session', function(){
		eraseCookie("session_id");
		window.location.reload();
		//socket.socket.connect('//' + window.location.host + ':8080', { query:"session_id=0channel_id=" + channel_id});
	});

	$scope.login = function(){
		socket.emit('user.login', { login_name: $scope.login_name, password: $scope.password  });
		$scope.password = "";
		$scope.login_name = "";
	}
	$scope.logout = function(){
		socket.emit('user.logout');
	}
	$scope.create_account = function() {
		socket.emit('user.create_account', { login_name: $scope.create_login_name, email: $scope.email, password: $scope.create_password });
		$scope.create_login_name = "";
		$scope.email = "";
		$scope.create_password = "";
	}
	$scope.sendMessage = function(){
		if($scope.message)
			socket.emit('chat.send', { content: $scope.message });
		$scope.message = '';
	};

	$scope.dismiss_alert = function(alert){
		$scope.alert_stack.splice($scope.alert_stack.indexOf(alert), 1);
	};
	
	$scope.getTime = function(t){
		t = new Date(t);
		return (t.getHours() < 10 ? '0' : '') + t.getHours() + ":" + (t.getMinutes() < 10 ? '0' : '') + t.getMinutes();
	};
	$scope.getLength = function(s){
		s = new Date(s * 1000);
		return (s.getMinutes() < 10 ? '0' : '') + s.getMinutes() + ":" + (s.getSeconds() < 10 ? '0' : '') + s.getSeconds();
	};
	$scope.getPermLevel = function(lvl){
		// some glitter for the admins
		if(lvl === 1)
			return '<i class="icon-star icon-white"></i>';
		if(lvl === 2)
			return '<i class="icon-star icon-white"></li>';
		else
			return '';
	};

	$scope.playerStateChange = function(state) {
		if(state === 0){
			console.log("Media_Item ended");
			$scope.playNext();
		}
	};
	$scope.playNext = function() {
		var pos = -1;
		var next_item = null;
		// This'll be a torture!
		for (var i = 0; i < $scope.playlist.length; i++) {
			if($scope.playlist[i]._id === $scope.active_item)
				pos = $scope.playlist[i].position;
			if(pos !== -1)
				if($scope.playlist[i].position === pos + 1)
					next_item = $scope.playlist[i];
		}
		if(next_item === null)
			for (var i = 0; i < $scope.playlist.length; i++)
				if($scope.playlist[i].position === pos + 1)
					next_item = $scope.playlist[i];
		if(next_item === null)
			for (var i = 0; i < $scope.playlist.length; i++)
				if($scope.playlist[i].position === 1)
					next_item = $scope.playlist[i];

		console.log("Old pos: " + pos + " New pos: " + next_item.position);
		$scope.active_item = next_item._id;
		$scope.$apply();
		player.loadVideoById(next_item.url);
		socket.emit('playlist.item_changed', { _id: $scope.active_item, caption: next_item.caption });
	};
	$scope.play_item = function(item_id){
		var item;
		for (var i = 0; i < $scope.playlist.length; i++) {
			if($scope.playlist[i]._id === item_id)
				item = $scope.playlist[i];
		};
		player.loadVideoById(item.url);
		$scope.active_item = item._id;
		socket.emit('playlist.play_item', { _id: item_id, start_time: new Date() });
	};
	$scope.add_new_item = function(){
		socket.emit('playlist.append_item', { url:$scope.add_item.url, duration:$scope.add_item.duration, caption:$scope.add_item.caption, media_type: $scope.add_item.media_type});
		$scope.show_add = false;
		$scope.add_item = { valid:false };
		$scope.itemURL = "";
	};
	$scope.remove_item = function(item_id){
		for (var i = 0; i < $scope.playlist.length; i++) {
			if($scope.playlist[i]._id === item_id){
				$scope.playlist.splice(i, 1);
				break;
			}
		};
		$scope.removed = true;
		for(var i = 0; i < $scope.playlist.length; i++){
			$scope.playlist[i].position = i + 1;
		}
		socket.emit('playlist.remove_item', { _id: item_id });
	}
	$scope.gdataCallback = function(data){
		if(data.entry) {
			$scope.add_item.url = data.entry.media$group.yt$videoid.$t;
			$scope.add_item.duration = data.entry.media$group.media$content[0].duration;
			$scope.add_item.caption = data.entry.title.$t;
			$scope.add_item.media_type = "youtube";
			$scope.add_item.valid = true;
		} else
			$scope.add_item.valid = false;
		$scope.$apply();
	};
	$scope.fav_this = function(){
		socket.emit('channel.faved');
	};
	
	$scope.$watch("playlist", function(value){
		if($scope.reordered || $scope.removed){
			var r = value.map(function(e){ return { _id: e._id, position: e.position }; });
			socket.emit('playlist.reorder', r);
		}
	}, true);
}

app.directive('dndList', function(){
	return function(scope, element, attrs){
		var toUpdate;
		var startIndex = -1;
		
		scope.$watch(attrs.dndList, function(value){
			toUpdate = value;
		},true);
		
		$(element[0]).sortable({
			items:'tr',
			start: function(event, ui){
				startIndex = ($(ui.item).index());
				scope.reordered = true;
			},
			stop: function(event, ui){
				if(socket.is_admin) {
					console.log("Item: " + toUpdate[startIndex]._id + "; Old Position: " + toUpdate[startIndex].position + "; New Position: " + ($(ui.item).index() + 1));
					var newIndex = ($(ui.item).index());
					var toMove = toUpdate[startIndex];
					toUpdate.splice(startIndex, 1);
					toUpdate.splice(newIndex,0,toMove);
					for(var i = 0; i < scope.playlist.length; i++){
						scope.playlist[i].position = i + 1;
					}
				}
				scope.$apply(scope.playlist);
			},
			axis: 'y'
		});
	};
});
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}
