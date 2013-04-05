$(function(){
	// I hate the chromeless player, i'll never build my own controls. Take this dummy!
	swfobject.embedSWF("http://www.youtube.com/v/xxxxxxxxxxx?enablejsapi=1&playerapiid=ytplayer&version=3&autohide=1&theme=light", "replace-player", "425", "356", "8", null, null, { allowScriptAccess: "always" }, { id: "myytplayer" });
	$('.media-url').keyup(function(){
		var reg = /(v=|\/)([\w-]+)(&.+)?$/;
		reg.exec($('.media-url').val());
		if(RegExp.$2){
			var tag = document.createElement('script');
			tag.src = "https://gdata.youtube.com/feeds/api/videos/" + RegExp.$2 + "?alt=json-in-script&v=2&callback=gdataCallbackProxy";
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      	}
	});
	$('.channel-cover-text').dotdotdot({watch:true});
});
var app = angular.module('channel',[]);
var socket = io.connect('http://' + window.location.host + ':8080');
var player;

function gdataCallbackProxy(data){angular.element('html').scope().gdataCallback(data);}
function stateChangeProxy(state){angular.element('html').scope().playerStateChange(state);}
function onYouTubePlayerReady(playerId) {
    player = document.getElementById("myytplayer");
    player.addEventListener("onStateChange", "stateChangeProxy");
    socket.emit('channel.init', { channel_id: channel_id, login_name: 'screeny05' });
}

function channel_controller($scope){
	$scope.playlist = [];
	$scope.chat = [];
	$scope.online = [];
	$scope.alert_stack = [];
	$scope.views = 0;
	$scope.favs = 0;
	// The currently active media-item-_id
	$scope.active_item = 1;
	$scope.reordered = false;
	
	socket.on('channel.init', function(data){
		$scope.playlist = data.content.playlist;
		$scope.chat = data.content.last_chat;
		$scope.online = data.content.users_online;
		$scope.favs = data.content.favourites;
		$scope.views = data.content.views;
		$scope.active_item = data.content.now_playing._id;
		$scope.addItem = {};
		
		var start_seconds = (new Date().getTime() - new Date(data.content.now_playing.start_time).getTime()) / 1000;
		if(start_seconds > data.content.now_playing.duration){
			socket.emit('playlist.check_playing');
		} else
			player.loadVideoById(data.content.now_playing.url, start_seconds);
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
			if($scope.playlist[i]._id === data.content._id)
				item = $scope.playlist[i];
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
	socket.on('playlist.play_next', function() {
		$scope.playNext(false);
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
	socket.socket.on('error', function(data){
		$scope.alert_stack.push({ status: "-1", content: {code: "Unable to connect to Synergy-Server"}});
		$scope.$apply();
	});
	socket.on('error', function(data){
		$scope.alert_stack.push(data);
		$scope.$apply();
	});
	
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

	
	$scope.playerStateChange = function(state){
		if(state === 0){
			$scope.playNext(true);
			console.log("Media_Item ended");
		}
	};
	$scope.playNext = function(emit) {
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

		console.log("Old pos: " + pos + " New pos: " + next_item.pos);
		$scope.active_item = next_item._id;
		$scope.$apply();
		player.loadVideoById(next_item.url);
		if(emit)
			socket.emit('playlist.item_changed', { _id: $scope.active_item });
	};
	$scope.playItem = function(item_id){
		var item;
		for (var i = 0; i < $scope.playlist.length; i++) {
			if($scope.playlist[i]._id === item_id)
				item = $scope.playlist[i];
		};
		player.loadVideoById(item.url);
		$scope.active_item = item._id;
		$scope.$apply();
		socket.emit('playlist.play_item', { _id: item_id, start_time: new Date() });
	};
	$scope.addItem = function(){
		alert("add");
		socket.emit('playlist.append_item', { url:$scope.addItem.url, duration:$scope.addItem.duration, caption:$scope.addItem.caption, media_type: $scope.addItem.media_type});
	};
	$scope.gdataCallback = function(data){
		$scope.addItem.url = data.entry.media$group.yt$videoid.$t;
		$scope.addItem.duration = data.entry.media$group.media$content[0].duration;
		$scope.addItem.caption = data.entry.title.$t;
		$scope.addItem.media_type = "youtube";
		socket.emit('playlist.append_item', { url:$scope.addItem.url, duration:$scope.addItem.duration, caption:$scope.addItem.caption, media_type: $scope.addItem.media_type});
		$scope.$apply();
	};
	
	$scope.$watch("playlist", function(value){
		if($scope.reordered){
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
				console.log("Item: " + toUpdate[startIndex]._id + "; Old Position: " + toUpdate[startIndex].position + "; New Position: " + ($(ui.item).index() + 1));
				var newIndex = ($(ui.item).index());
				var toMove = toUpdate[startIndex];
				toUpdate.splice(startIndex, 1);
				toUpdate.splice(newIndex,0,toMove);
				for(var i = 0; i < scope.playlist.length; i++){
					scope.playlist[i].position = i + 1;
				}
				scope.$apply(scope.playlist);
			},
			axis: 'y'
		});
	};
});
