<script>document.write('<script type="text/javascript" src="//' + document.location.host + ':8080/socket.io/socket.io.js"><\/script>')</script>
<script>
  var socket = io.connect('http://localhost:8080');
  socket.emit('channel.init', { channel_id: 0, user_name: 'screeny', user_id: 0 })
  socket.on('channel.init', function (data) {
  	alert(JSON.stringify(data));
  });
  socket.on('chat.incoming', function(data){
    
  });
  socket.on('playlist.append_item', function(data){

  });
</script>