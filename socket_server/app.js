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
		socket.broadcast.to(socket.channel_id).emit('channel.user_join', { status: 0, username: data.user_name });
		
		r_query("SELECT tblMedia._id, position, url, caption, length, display_name, login_name FROM tblMedia RIGHT JOIN tblUsers ON tblUsers._id = tblMedia.user_id WHERE channel_id = " + sql.escape(socket.channel_id) + " ORDER BY position DESC", socket, function(playlist_data){
			r_query("SELECT timestamp, content, display_name FROM tblChat INNER JOIN tblUsers ON tblUsers._id = tblChat.user_id WHERE channel_id = " + sql.escape(socket.channel_id) + " ORDER BY timestamp ASC LIMIT 0,15", socket, function(message_data){
				socket.emit('channel.init', {status: 0, content: { users_online: init_online(socket.channel_id), last_chat: message_data, playlist: playlist_data }});
			});
		});
	});
	
	socket.on('disconnect', function(){
		socket.broadcast.to(socket.channel_id).emit('channel.user_leave', { status: 0, username: socket.user_name });
		socket.leave(socket.channel_id);
	});
	
	
	
	/*--Chat Related--*/
	
	socket.on('chat.send', function(data){
		i_query("INSERT INTO tblChat (user_id, timestamp, channel_id, content) VALUES (" + sql.escape(socket.user_id) + ", NOW(), " + sql.escape(socket.channel_id) + ", " + sql.escape(data.content) + ")", socket, "chat.send");
		io.sockets.in(data.channel_id).emit('chat.incoming', { status: 0, content: { display_name: socket.user_name, content: data.content, timestamp: new Date() }});
	});
	
	
	
	/*--Video Related--*/
		
	socket.on('playlist.append_item', function(data){
		// Check Privileges
		i_query("INSERT INTO tblVideos (user_id, channel_id, url, pos, length) VALUES (" + socket.user_id + ", " + socket.channel_id + ", '" + sql.escape(data) + "', LAST?!?!, LENGTH?!?!)", socket, "playlist.append_item");
		io.sockets.in(socket.channel_id).emit('playlist.append_item', data );
	});
	
	socket.on('playlist.reorder', function(data){
		for(var i = 0; i < data.length; i++){
			i_query("UPDATE tblMedia SET position = " + sql.escape(data[i].position) + " WHERE _id = " + sql.escape(data[i]._id));
			data[i];
		}
	});
});

function r_query(statement, socket, callback) {
	sql.query(statement, function(err, rows, fields){
		if(err){
			socket.emit("error", { status: 2, content: err });
			console.log(err);
		} else {
			callback(rows);
		}
	});
}

function e_query(statement, socket, func_name) {
	sql.query(statement, function(err, rows, fields){
		if(err){
			socket.emit("error", { status: 2, content: err });
			console.log(err);
		} else {
			socket.emit(func_name, { status: 0, content: rows });
		}
	});
}

function i_query(statement, socket, func_name){
	sql.query(statement, function(err){
		if(err){
			socket.emit("error", { status: 2, content: err });
			console.log(err);
		}
	});
}

function init_online(channel_id){
	var arr = new Array();
	io.sockets.clients(channel_id).forEach(function(socket){
		arr.push({name: socket.user_name,user_name: socket.user_name});
	});
	// don't emit own name
	// displayname/username
	arr.push({name:"Blankblade",user_name:"Blankblade"});
	arr.push({name:"Little Crow",user_name:"little_crow"});
	arr.push({name:"Button Mash",user_name:"buttonMash"});
	arr.push({name:"Wolfprint",user_name:"Wolfprint"});
	arr.push({name:"Brushwipe",user_name:"Brushwipe"});
	arr.push({name:"Rune",user_name:"Rune"});
	arr.push({name:"Masky",user_name:"Masky"});
	arr.push({name:"Tigerstripe",user_name:"Tigerstripe"});
	arr.push({name:"Sunflare",user_name:"Sunflare"});
	arr.push({name:"Rira Timeturner",user_name:"rira"});
	return arr;
}