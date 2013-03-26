var app = angular.module('channel',[]);
var socket = io.connect('http://localhost:8080');
socket.emit('channel.init', { channel_id: 1, user_name: 'Graycode', user_id: 1 });

function channel_controller($scope){
	$scope.playlist = [];
	$scope.chat = [];
	$scope.online = [];
	$scope.active_item = 1;
	$scope.reordered = false;
	
	socket.on('channel.init', function(data){
		$scope.playlist = data.content.playlist;
		$scope.chat = data.content.last_chat;
		$scope.online = data.content.users_online;
		$scope.$apply();
		$('.sidebar-chat > ul').scrollTop($('.sidebar-chat > ul')[0].scrollHeight);
	});
	socket.on('playlist.append_item', function(data){
		$scope.playlist.push(data.content);
		$scope.$apply();
	});
	socket.on('chat.incoming', function(data){
		$scope.chat.push(data.content);
		$scope.$apply();
		$('.sidebar-chat > ul').animate({ scrollTop: $('.sidebar-chat > ul')[0].scrollHeight},800);
		
	});
	socket.on('channel.user_join', function(data){
		
	});
	
	$scope.sendMessage = function(){
		socket.emit('chat.send', { content: $scope.message });
		$scope.message = '';
	}
	
	$scope.$watch("playlist", function(value){
		if($scope.reordered){
			socket.emit('playlist.reorder', value.map(function(e){ return { _id: e.position, position: e._id} }));
			console.log("reordered");
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
				var newIndex = ($(ui.item).index());
				var toMove = toUpdate[startIndex];
				toUpdate.splice(startIndex, 1);
				toUpdate.splice(newIndex,0,toMove);
				scope.$apply(scope.playlist);
			},
			axis: 'y'
		})
	}
});