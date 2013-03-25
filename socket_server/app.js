var io  = require('socket.io').listen(8080);
var mysql = require('mysql');
var sql = mysql.createConnection({
	user: 'root',
	password: 'root',
	database: 'synergy'
});

sql.connect(function(err){
	if(err) throw err;
});

io.sockets.on('connection', function (socket) {
	
	socket.on('channel.init', function(data){
		// Check credentials
		socket.channel_id = data.channel_id;
		socket.user_name = data.user_name;
		socket.user_id = data.user_id;
		
		socket.join(socket.channel_id);
		socket.broadcast.to(socket.channel_id).emit('user_join', { status: 0, username: data.user_name });
		socket.emit('channel.init', { status: 0, online: init_online(socket.channel_id), last_chat: [], playlist: [] });
	});
	
	socket.on('disconnect', function(){
		socket.broadcast.to(socket.channel_id).emit('user_leave', { status: 0, username: socket.user_name });
		socket.leave(socket.channel_id);
	});
	
	
	
	/*--Chat Related--*/
	
	socket.on('chat.send', function(data){
		i_query("INSERT INTO tblMessages (user_id, timestamp, channel_id, content) VALUES (" + sql.escape(socket.user_id) + ", " + sql.escape(data.timestamp) + ", " + sql.escape(socket.channel_id) + ", '" + sql.escape(data.content) + "'");
		io.sockets.in(data.channel_id).emit('chat.incoming', { sender: data.name, content: data.content, timestamp: data.timestamp });
	});
  
	socket.on('chat.get', function(data){
		r_query("SELECT timestamp, content, name, picture FROM tblChat INNER JOIN tblUsers ON tblUsers._id = tblChat.user_id WHERE channel_id = " + sql.escape(socket.channel_id) + " ORDER BY timestamp ASC LIMIT 0,10", socket, 'chat.get');
	});
	
	
	
	/*--Video Related--*/
	
	socket.on('playlist.get', function(data){
		r_query("SELECT pos, url, caption, length, name FROM tblVideos RIGHT JOIN tblUsers ON tblUsers._id = tblVideos.user_id WHERE channel_id = " + sql.escape(data.channel_id) + " ORDER BY pos DESC", socket, 'playlist.get');
	});
	
	socket.on('playlist.append_item', function(data){
		// Check Privileges
		i_query("INSERT INTO tblVideos (user_id, channel_id, url, pos, length) VALUES (" + socket.user_id + ", " + socket.channel_id + ", '" + sql.escape(data) + "', LAST?!?!, LENGTH?!?!)", socket, "playlist.append_item");
		io.sockets.in(socket.channel_id).emit('playlist.append_item', data );
	});
});

function r_query(statement, socket, func_name) {
	sql.query(statement, function(err, rows, fields){
		if(err){
			socket.emit(func_name, { status: 2, content: err });
			console.log(err);
		}
		socket.emit(func_name, { status: 0, content: rows });
	});
}

function i_query(statement, socket, func_name){
	sql.query(statement, function(err){
		if(err){
			socket.emit(func_name, { status: 2, content: err });
			console.log(err);
		}
	});
}

function init_online(channel_id){
	var arr = new Array();
	io.sockets.clients(channel_id).forEach(function(socket){
		arr.push(socket.user_name);
	});
	return arr;
}