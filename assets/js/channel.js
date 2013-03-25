$(document).ready(function(){

});

function onPlayerReady(event){
	event.target.playVideo();
}
function onPlayerStateChange(event){

}
var player;
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}

var socket = io.connect('http://localhost:8080');
socket.emit('channel.init', { channel_id: 0, user_name: 'screeny', user_id: 0 })
socket.on('channel.init', function (data) {
	alert(JSON.stringify(data));
});
socket.on('chat.incoming', function(data){

});
socket.on('playlist.append_item', function(data){
	
});