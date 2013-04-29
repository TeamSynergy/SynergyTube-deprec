var io  = require('socket.io').listen(8080);
var hasher = require('password-hash');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

var configuration = require('./config.json');
var backend = require('./db-mysql.js');
io.setMaxListeners(0);
backend.connect(configuration.database);


function emitUserData(socket) {
	r_query("SELECT count(*) AS '_c' FROM tblUser INNER JOIN relAdmins ON tblUser._id = relAdmins.user_id WHERE tblUser.login_name = " + sql.escape(socket.login_name) + " AND relAdmins.channel_id = " + sql.escape(socket.channel_id), socket, function(admin_data){
	r_query("SELECT count(*) AS '_c' FROM tblUser INNER JOIN tblChannels ON tblUser._id = tblChannels.owner_id WHERE tblUser.login_name = " + sql.escape(socket.login_name) + " AND tblChannels._id = " + sql.escape(socket.channel_id), socket, function(owner_data){
	r_query("SELECT _id, display_name, login_name, email FROM tblUser WHERE login_name = " + sql.escape(socket.login_name), socket, function(user_data){
	r_query("SELECT tblMedia._id, position, url, caption, duration, display_name, login_name, media_type FROM tblMedia RIGHT JOIN tblUser ON tblUser._id = tblMedia.user_id WHERE channel_id = " + sql.escape(socket.channel_id) + " ORDER BY position ASC", socket, function(playlist_data){
	r_query("SELECT _id, start_time, url, duration FROM tblMedia WHERE channel_id = " + sql.escape(socket.channel_id) + " ORDER BY start_time DESC LIMIT 0,1", socket, function(current_item_data){
	r_query("SELECT timestamp, content, display_name FROM tblMessages INNER JOIN tblUser ON tblUser._id = tblMessages.user_id WHERE channel_id = " + sql.escape(socket.channel_id) + " ORDER BY timestamp DESC LIMIT 0, 15", socket, function(message_data){
	r_query("SELECT user_limit FROM tblChannels WHERE _id = " + sql.escape(socket.channel_id), socket, function(channel_data){
	r_query("SELECT COUNT(DISTINCT ip_hash) AS '_c' FROM tblTracking WHERE channel_id = " + sql.escape(socket.channel_id), socket, function(view_data){
	r_query("SELECT COUNT(*) AS '_c' FROM relFavourites WHERE channel_id = " + sql.escape(socket.channel_id), socket, function(fav_data){
	socket.user_id = user_data[0]._id;
	r_query("SELECT COUNT(*) AS '_c' FROM relFavourites WHERE channel_id = " + sql.escape(socket.channel_id) + " AND user_id = " + sql.escape(socket.user_id), socket, function(already_faved_data){
		socket.display_name = user_data[0].display_name;
		socket.email = user_data[0].email;
		socket.already_faved = already_faved_data[0]._c === 1;
		socket.is_admin = admin_data[0]._c > 0;
		socket.is_owner = owner_data[0]._c > 0;
		if(socket.is_owner)
			socket.is_admin = true;
		var _online = init_online(socket.channel_id);
		_online.push({display_name: socket.display_name, login_name: socket.login_name, is_admin: socket.is_admin, user_id: socket.user_id });
		console.log("Users: " + _online.length + " from " + channel_data[0].user_limit);
		if(_online.length < channel_data[0].user_limit || socket.is_admin){
			socket.broadcast.to(socket.channel_id).emit('channel.user_join', { status: 0, content: { display_name: socket.display_name, login_name: socket.login_name, is_admin: socket.is_admin, user_id: socket.user_id }});
			socket.emit('channel.init', { status: 0, content: { user_data: { login_name: user_data[0].login_name, display_name: user_data[0].display_name, is_admin: socket.is_admin }, users_online: _online, last_chat: message_data, playlist: playlist_data, already_faved: socket.already_faved, views: view_data[0]._c, favs: fav_data[0]._c, now_playing: current_item_data[0], logged_in: true }});
			socket.join(socket.channel_id);
			return true;
		} else {
			socket.emit('error.channel_full');
			return false;
		}
	});});});});});});});});});});
}
function emitGuestData(socket){
	r_query("SELECT tblMedia._id, position, url, caption, duration, display_name, login_name, media_type FROM tblMedia RIGHT JOIN tblUser ON tblUser._id = tblMedia.user_id WHERE channel_id = " + sql.escape(socket.channel_id) + " ORDER BY position ASC", socket, function(playlist_data){
	r_query("SELECT _id, start_time, url, duration FROM tblMedia WHERE channel_id = " + sql.escape(socket.channel_id) + " ORDER BY start_time DESC LIMIT 0,1", socket, function(current_item_data){
	r_query("SELECT timestamp, content, display_name FROM tblMessages INNER JOIN tblUser ON tblUser._id = tblMessages.user_id WHERE channel_id = " + sql.escape(socket.channel_id) + " ORDER BY timestamp DESC LIMIT 0, 15", socket, function(message_data){
	r_query("SELECT user_limit FROM tblChannels WHERE _id = " + sql.escape(socket.channel_id), socket, function(channel_data){
	r_query("SELECT COUNT(DISTINCT ip_hash) AS '_c' FROM tblTracking WHERE channel_id = " + sql.escape(socket.channel_id), socket, function(view_data){
	r_query("SELECT COUNT(*) AS '_c' FROM relFavourites WHERE channel_id = " + sql.escape(socket.channel_id), socket, function(fav_data){
		var _online = init_online(socket.channel_id);
		if(_online.length < channel_data[0].user_limit){
			socket.broadcast.to(socket.channel_id).emit('channel.guest_join');
			socket.emit('channel.init', { status: 0, content: { users_online: _online, last_chat: message_data, playlist: playlist_data, already_faved: true, views: view_data[0]._c, favs: fav_data[0]._c, now_playing: current_item_data[0], logged_in: false }});
			socket.join(socket.channel_id);
			return true;
		} else {
			socket.emit('error.channel_full');
			return false;
		}
	});});});});});});
}

io.sockets.on('connection', function (socket) {
	socket.logged_in = false;
	socket.channel_id = socket.handshake.query.channel_id;

	if(socket.handshake.query.session_id){
		backend.user.findBySessionID(socket.handshake.query.session_id, function(err, user){
			if(err){
				socket.emit("error", { status: 2, content: err.code });
			} else {
				if(!user){
					socket.emit("error.session_id");
					emitGuestData(socket);
				} else {
					socket.logged_in = true;
					socket.login_name = user.login_name;
					emitUserData(socket);
				}
			}
		});
	} else {
		emitGuestData(socket);
	}

	/* --Channel Related-- */

	socket.on('disconnect', function(){
		if(socket.logged_in)
			socket.broadcast.to(socket.channel_id).emit('channel.user_leave', { status: 0, content: { _id: socket.user_id }});
		else
			socket.broadcast.to(socket.channel_id).emit('channel.guest_leave');

		socket.leave(socket.channel_id);
	});
	socket.on('channel.faved', function(){
		if(socket.logged_in)
			if(!socket.already_faved)
				backend.user.favChannel(socket.user_id, socket.channel_id, function(){
					io.sockets.in(socket.channel_id).emit('channel.faved', { login_name: socket.login_name });
					socket.already_faved = true;
				});
			else
				backend.user.unFavChannel(socket.user_id, socket.channel_id, function(){
					io.sockets.in(socket.channel_id).emit('channel.unfaved', { login_name: socket.login_name });
					socket.already_faved = false;
				});
	});
	
	/* --User Related--*/

	socket.on('user.login', function(data){
		backend.user.findByLoginName(data.login_name, function(user){
			if(user){
				if(user.is_valid === 1){
					if(hasher.verify(data.password, user.hash)){
						var session_id = hasher.generate(data.login_name + user.hash);
						backend.user.session.create(data.login_name, session_id, function(){
							socket.emit("user.session_id", { status: 0, content: { session_id: session_id }});
						});
					} else {
						socket.emit("error", { status: 4, content: { code: "Incorrect Username or Password." }});
					}
				} else {
					socket.emit("error", { status: 4, content: { code: "Your Account is not ready yet. Please Check your mail for the Activation-Link" }});
				}
			} else {
				socket.emit("error", { status: 4, content: { code: "Incorrect Username or Password." }});
			}
		});
	});
	socket.on('user.logout', function(){
		if(socket.logged_in)
			backend.user.session.destroy(socket.query.session_id, socket.login_name, function(){
				socket.emit("user.destroy_session");
			});
	});
	socket.on('user.create_account', function(data){
		backend.user.exists(data.login_name, data.email, function(user_exists){
			if(!user_exists){
				if(data.login_name.length > 4){
					if(data.password.length > 6){
						var validate_hash = crypto.createHash('sha256').update(new Date() + data.login_name + data.password).digest("hex");
						var mail = {
							from: "SynergyTube Accountservice <synergytube.slave@gmail.com>",
							to: data.email,
							subject: "Activate your SynergyTube Account",
							text: "To activate your account go to this address: http://localhost/validate/" + validate_hash,
							html: "<b>Welcome to SynergyTube, " + data.login_name + "!</b><br><hr><p>To Activate your new SynergyTube Account simply go to: <a href=\"http://localhost/validate/" + validate_hash + "\">http://localhost/validate/" + validate_hash + "</a></p>Thank you!"
						};
						backend.user.create(data.login_name, data.email, 'local', hasher.generate(data.password), validate_hash, function(){
							var smtpTransport = nodemailer.createTransport("SMTP", configuration.mail);
							smtpTransport.sendMail(mail, function(err, response){
								if(err){
									console.log(err);
									socket.emit("error", { status: 5, content: { code: "We were Unable to send the activation-link to your mail-address. Please contact the admin." }});
								} else {
									socket.emit("user.create_account", response);
									smtpTransport.close();
								}
								console.log(response);
							});
						});
					} else {
						socket.emit("error", { status: 6, content: { code: "Sorry, your Password is too short. It has to be at least 6 chars long." }});
					}
				} else {
					socket.emit("error", { status: 7, content: { code: "Sorry, your Username is too short. It has to be at least 4 chars long." }});
				}
			} else {
				socket.emit("error", { status: 8, content: { code: "This Username or Email-Address has already been taken." }});
			}
		});
	});
	
	/*--Chat Related--*/
	
	socket.on('chat.send', function(data){
		if(socket.logged_in) {
			backend.channel.chat.add(socket.channel_id, socket.user_id, data.content, function(){
				io.sockets.in(socket.channel_id).emit('chat.incoming', { status: 0, content: { display_name: socket.display_name, content: data.content, timestamp: new Date() }});
			});
		}
	});
	socket.on('chat.load_more', function(data){
		if(socket.logged_in)
			backend.channel.chat.getMore(socket.channel_id, 15, new Date(data.append_at), function(message_data){
				socket.emit('chat.load_more', message_data);
			});
	});
	
	
	
	/*--Video Related--*/
		
	socket.on('playlist.append_item', function(data){
		// Check Privileges
		if(socket.is_admin)
			backend.channel.playlist.getHighestPosition(socket.channel_id, function(pos){
				console.log("append new item at " + (pos + 1));
				backend.channel.playlist.append(socket.channel_id, socket.user_id, data.url, (pos + 1), data.duration, data.caption, data.media_type, function(){
					io.sockets.in(socket.channel_id).emit('playlist.append_item', { status: 0, content: { _id: res.insertId, position: (pos + 1), url: data.url, caption: data.caption, duration: data.duration, display_name: socket.display_name, login_name: socket.login_name, media_type: data.media_type }});
				});
			});
	});
	
	socket.on('playlist.reorder', function(data){
		if(socket.is_admin){
			console.log("align items to their position");
			for(var i = 0; i < data.length; i++)
				backend.channel.playlist.setItemPositionByID(data[i]._id, data[i].position);
			socket.broadcast.to(socket.channel_id).emit('playlist.reorder', { status: 0, content: data});
		}
	});
	
	socket.on('playlist.play_item', function(data){
		if(socket.is_admin)
			backend.channel.playlist.playItem(data._id, function(){
				socket.broadcast.to(socket.channel_id).emit('playlist.play_item', { status: 0, content: data });
			});
	});
	socket.on('playlist.remove_item', function(data){
		if(socket.is_admin)
			backend.channel.playlist.findCurrent(socket.channel_id, function(current_item){
				if(!current_item){
					// No Item played, huh?!
				} else {
					if(current_item._id === data._id)
						backend.channel.playlist.findNext(socket.channel_id, function(next_item){
							backend.channel.playlist.playItem(next_item._id, function(){
								io.sockets.in(socket.channel_id).emit('playlist.play_item', { status: 0, content: { _id: next_item._id, start_time: new Date() }});
							});
						});
					backend.channel.playlist.remove(data._id, function(){
						io.sockets.in(socket.channel_id).emit('playlist.remove_item', { _id: data._id });
					});
				}
			});
	});
	socket.on('playlist.item_changed', function(data){
		// Check if it really ended
		console.log("item changed - claim from: " + socket.login_name);
		backend.channel.playlist.findCurrent(socket.channel_id, function(current_item){
			if((new Date().getTime() - new Date(current_item.start_time).getTime()) / 1000 > current_item.duration){
				backend.channel.playlist.findNext(socket.channel_id, function(next_item){
					backend.channel.playlist.playItem(next_item._id, dunction(){
						console.log("old item " + current_item.caption + " outdated, new item is " + next_item.caption);
					});
				});
			} else {
				console.log("send him back");
				socket.emit('playlist.play_item', { status: 0, content: { _id: last_data[0]._id, start_time: last_data[0].start_time }});
			}
		});
	});
});

function init_online(channel_id){
	var arr = [];
	io.sockets.clients(channel_id).forEach(function(socket){
		arr.push({display_name: socket.display_name, login_name: socket.login_name, is_admin: socket.is_admin, user_id: socket.user_id });
	});
	return arr;
}
