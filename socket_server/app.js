var io  = require('socket.io').listen(8080);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var sql = mysql.createConnection({
	user: 'root',
	password: 'root',
	database: 'synergy'
});

sql.connect(function(err){
	if(err) throw err;
});

passport.use(new LocalStrategy(
	function(username, password, done){
		User.findOne({ username: username }, function(err, user){
			if(err)
				return done(err);
			if(!user)
				return done(null, false, { message: 'Incorrect username.' });
			if(!user.validPassword(password))
				return done(null, false, { message: 'Invalid Password.' });
			return done(null, user);
		});
	}
));

io.sockets.on('connection', function (socket) {
	
	
	socket.on('channel.init', function(data){
		// Check credentials
		console.log("")
		
		socket.channel_id = data.channel_id;
		socket.login_name = data.login_name;
		
		socket.join(socket.channel_id);

		r_query("SELECT count(*) AS '_c' FROM tblUser INNER JOIN relAdmins ON tblUser._id = relAdmins.user_id WHERE tblUser.login_name = " + sql.escape(data.login_name) + " AND relAdmins.channel_id = " + sql.escape(data.channel_id), socket, function(admin_data){
			r_query("SELECT count(*) AS '_c' FROM tblUser INNER JOIN tblChannels ON tblUser._id = tblChannels.owner_id WHERE tblUser.login_name = " + sql.escape(data.login_name) + " AND tblChannels._id = " + sql.escape(data.channel_id), socket, function(owner_data){
				r_query("SELECT _id, display_name, login_name, email FROM tblUser WHERE login_name = " + sql.escape(socket.login_name), socket, function(user_data){
					r_query("SELECT tblMedia._id, position, url, caption, duration, display_name, login_name, media_type FROM tblMedia RIGHT JOIN tblUser ON tblUser._id = tblMedia.user_id WHERE channel_id = " + sql.escape(socket.channel_id) + " ORDER BY position ASC", socket, function(playlist_data){
						r_query("SELECT _id, start_time, url, duration FROM tblMedia WHERE channel_id = " + sql.escape(socket.channel_id) + " ORDER BY start_time DESC LIMIT 0,1", socket, function(current_item_data){
							r_query("SELECT timestamp, content, display_name FROM tblMessages INNER JOIN tblUser ON tblUser._id = tblMessages.user_id WHERE channel_id = " + sql.escape(socket.channel_id) + " ORDER BY timestamp DESC LIMIT 0, 15", socket, function(message_data){
								var tmt = new Date();
								tmt.setMinutes(tmt.getMinutes() - 1);
								socket.user_id = user_data[0]._id;
								socket.display_name = user_data[0].display_name;
								socket.email = user_data[0].email;
								socket.is_admin = admin_data[0]._c > 0;
								socket.is_owner = owner_data[0]._c > 0;
								if(socket.is_owner)
									socket.is_admin = true;

								socket.broadcast.to(socket.channel_id).emit('channel.user_join', { status: 0, content: { display_name: user_data.display_name, login_name: user_data.login_name, is_admin: socket.is_admin, user_id: user_data._id }});
								socket.emit('channel.init', { status: 0, content: { users_online: init_online(socket.channel_id), last_chat: message_data, playlist: playlist_data, favourites: 12, views: 1357, now_playing: current_item_data[0] }});
							});
						});
					});
				});
			});
		});
	});
	socket.on('disconnect', function(){
		socket.broadcast.to(socket.channel_id).emit('channel.user_leave', { status: 0, display_name: socket.user_name });
		socket.leave(socket.channel_id);
	});
	
	
	
	/*--Chat Related--*/
	
	socket.on('chat.send', function(data){
		i_query("INSERT INTO tblMessages (user_id, timestamp, channel_id, content) VALUES (" + sql.escape(socket.user_id) + ", NOW(), " + sql.escape(socket.channel_id) + ", " + sql.escape(data.content) + ")", socket, "chat.send");
		io.sockets.in(socket.channel_id).emit('chat.incoming', { status: 0, content: { display_name: socket.display_name, content: data.content, timestamp: new Date() }});
	});
	
	
	
	/*--Video Related--*/
		
	socket.on('playlist.append_item', function(data){
		// Check Privileges
		console.log("received");
		r_query("SELECT position FROM tblMedia WHERE channel_id = " + sql.escape(socket.channel_id) + " ORDER BY position DESC LIMIT 0,1", socket, function(rows){
			console.log(rows[0].position);
			i_query("INSERT INTO tblMedia (user_id, channel_id, url, position, duration, caption, media_type) VALUES (" + sql.escape(socket.user_id) + ", " + sql.escape(socket.channel_id) + ", " + sql.escape(data.url) + ", " + (rows[0].position + 1) + ", " + sql.escape(data.duration) + ", " + sql.escape(data.caption) + ", " + sql.escape(data.media_type) + ")", socket, "playlist.append_item");
			r_query("SELECT MAX(_id) AS 'm' FROM tblMedia WHERE channel_id = " + sql.escape(socket.channel_id), socket, function(idd){
				io.sockets.in(socket.channel_id).emit('playlist.append_item', { _id: idd[0].m, position: (rows[0].position + 1), url: data.url, caption: data.caption, duration: data.duration, display_name: socket.display_name, login_Name: socket.login_name, media_type: data.media_type });
				console.log(idd[0].m);
			});
		});
	});
	
	socket.on('playlist.reorder', function(data){
		for(var i = 0; i < data.length; i++){
			i_query("UPDATE tblMedia SET position=" + sql.escape(data[i].position) + " WHERE _id = " + sql.escape(data[i]._id), socket, "playlist.reorder");
		}
		socket.broadcast.to(socket.channel_id).emit('playlist.reorder', { status:0, content: data});
	});
	
	socket.on('playlist.play_item', function(data){
		if(socket.is_admin) {
			i_query("UPDATE tblMedia SET start_time = NOW() WHERE _id = " + sql.escape(data._id), socket, 'playlist.play_item');
			socket.broadcast.to(socket.channel_id).emit('playlist.play_item', { status: 0, content: data });
		}
	});
	socket.on('playlist.check_playing', function(){
		// IF (now() > start_time + duration) THEN play_next() ELSE play_current()
		r_query("SELECT start_time, _id, duration, position FROM tblMedia WHERE channel_id = " + sql.escape(socket.channel_id) + " ORDER BY start_time DESC LIMIT 0,1", socket, function(data){
			if((new Date().getTime() - new Date(data[0].start_time).getTime()) / 1000 > data[0].duration) {
				r_query("SELECT COUNT(*) AS '_c', position, _id, start_time, duration FROM tblMedia WHERE channel_id = " + sql.escape(socket.channel_id) + " AND position = " + (sql.escape(data[0].position) + 1), socket, function(next_data){
					if(next_data[0]._c > 0){
						i_query("UPDATE tblMedia SET start_time = NOW() WHERE _id = " + sql.escape(next_data[0]._id), socket, 'playlist.check_playing');
					} else {
						i_query("UPDATE tblMedia SET start_time = NOW() WHERE position = 1 AND channel_id = " + sql.escape(socket.channel_id), socket, 'playlist.check_playing')
					}
				});
				
				io.sockets.in(socket.channel_id).emit('playlist.play_next');
			} else {
				socket.emit('playlist.play_item', { status: 0, content: data[0]});
			}
		});
	});
	socket.on('playlist.item_changed', function(data){
		// To prevent multiple Executions
		console.log("media_item ended; from: " + socket.login_name + "/" + io.sockets.clients(socket.channel_id)[0].login_name);
		r_query("SELECT start_time, _id, duration FROM tblMedia WHERE channel_id = " + sql.escape(socket.channel_id) + " ORDER BY start_time DESC LIMIT 0,1", socket, function(data){
			if((new Date().getTime() - new Date(data[0].start_time).getTime()) / 1000 > data[0].duration) {
				if(socket.login_name === io.sockets.clients(socket.channel_id)[0].login_name)
					i_query("UPDATE tblMedia SET start_time = NOW() WHERE _id = " + sql.escape(data._id), socket, 'playlist.item_changed');
			} else
				socket.emit('playlist.play_item', { status: 0, content: { _id: data[0]._id, start_time: data[0].start_time }});
		});
	});
});



function r_query(statement, socket, callback) {
	sql.query(statement, function(err, rows, fields){
		if(err){
			console.log(err);
			socket.emit("error", { status: 2, content: err });
		} else {
			callback(rows);
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
		arr.push({display_name: socket.display_name, login_name: socket.login_name, is_admin: socket.is_admin, user_id: socket.user_id });
	});
	arr.push({display_name:"Blankblade",login_name:"Blankblade"});
	arr.push({display_name:"Little Crow",login_name:"little_crow"});
	arr.push({display_name:"Button Mash",login_name:"buttonMash"});
	arr.push({display_name:"Wolfprint",login_name:"Wolfprint"});
	arr.push({display_name:"Brushwipe",login_name:"Brushwipe"});
	arr.push({display_name:"Rune",login_name:"Rune"});
	arr.push({display_name:"Masky",login_name:"Masky"});
	arr.push({display_name:"Tigerstripe",login_name:"Tigerstripe"});
	arr.push({display_name:"Sunflare",login_name:"Sunflare"});
	arr.push({display_name:"Rira Timeturner",login_name:"rira"});
	return arr;
}