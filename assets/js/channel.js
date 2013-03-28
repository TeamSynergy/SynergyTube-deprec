var app = angular.module('channel',[]);
var socket = io.connect('http://localhost:8080');
// socket.emit('channel.init', { channel_id: 1, login_name: 'screeny05' });
var player;

function channel_controller($scope){
	$scope.playlist = [];
	$scope.chat = [];
	$scope.online = [];
	$scope.alert_stack = [];
	$scope.views = 0;
	$scope.favs = 0;
	// The currently active media-item
	$scope.active_item = 1;
	$scope.reordered = false;
	
	socket.on('channel.init', function(data){
		$scope.playlist = data.content.playlist;
		$scope.chat = data.content.last_chat;
		$scope.online = data.content.users_online;
		$scope.favs = data.content.favourites;
		$scope.views = data.content.views;
		player.loadVideoById({ videoId:data.content.now_playing.yt_id, startSeconds:(new Date().getTime() - new Date(data.content.now_playing.start_time).getTime()) / 1000});
		$scope.$apply();
		$('.channel-chat > ul').scrollTop($('.channel-chat > ul')[0].scrollHeight);
		
	});
	socket.on('playlist.append_item', function(data){
		$scope.playlist.push(data.content);
		$scope.$apply();
	});
	socket.on('chat.incoming', function(data){
		$scope.chat.push(data.content);
		$scope.$apply();
		$('.channel-chat > ul').animate({ scrollTop: $('.channel-chat > ul')[0].scrollHeight},800);
		
	});
	socket.on('channel.user_join', function(data){
		
	});
	socket.socket.on('error',function(data){
		$scope.alert_stack.push({ status: "-1", content: {code: "Unable to connect to Synergy-Server"}})
	});
	socket.on('error', function(data){
		$scope.alert_stack.push(data);
		$scope.$apply();
	});
	
	$scope.sendMessage = function(){
		if($scope.message)
			socket.emit('chat.send', { content: $scope.message });
		$scope.message = '';
	}

	$scope.dismiss_alert = function(alert){
		$scope.alert_stack.splice($scope.alert_stack.indexOf(alert), 1);
	}
	
	$scope.getTime = function(t){
		t = new Date(t);
		return (t.getHours() < 10 ? '0' : '') + t.getHours() + ":" + (t.getMinutes() < 10 ? '0' : '') + t.getMinutes();
	}
	$scope.getLength = function(s){
		var s = new Date(s * 1000);
		return (s.getMinutes() < 10 ? '0' : '') + s.getMinutes() + ":" + (s.getSeconds() < 10 ? '0' : '') + s.getSeconds();
	}
	$scope.getPermLevel = function(lvl){
		if(lvl == 1)
			return '<i class="icon-star icon-white"></i>';
		if(lvl == 2)
			return '<i class="icon-star icon-white"></li>';
		else
			return '';
	}
	
	$scope.$watch("playlist", function(value){
		if($scope.reordered){
			var r = value.map(function(e){ return { _id: e._id, position: e.position, cap: e.caption} });
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
			start:function(event, ui){
				startIndex = ($(ui.item).index());
				scope.reordered = true;
			},
			stop:function(event,ui){
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
		})
	}
});

function onPlayerReady(e){
	socket.emit('channel.init', { channel_id: 1, login_name: 'screeny05' });
	
}
function onPlayerStateChange(e){

}

function onYouTubeIframeAPIReady(){
	player = new YT.Player('player',{
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}