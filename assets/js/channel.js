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