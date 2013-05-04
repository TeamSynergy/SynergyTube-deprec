require('./first_start.js');
var io  = require('socket.io').listen(8080);
var hasher = require('password-hash');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

var configuration = require('./config.json');
var backend = require('./mysql_backend.js');
io.setMaxListeners(0);
io.set("log level", 2)
backend.connect(configuration.database);


function emitUserData(socket) {
	backend.user.findByLoginName(socket.login_name, function(current_user){
	backend.channel.findByChannelID(socket.channel_id, function(current_channel){
	backend.channel.playlist.getAll(socket.channel_id, function(playlist){
	backend.channel.playlist.findCurrent(socket.channel_id, function(current_item){
	backend.channel.chat.getLatest(socket.channel_id, 15, function(messages){
	backend.channel.getUniqueVisits(socket.channel_id, function(views){
	backend.channel.getFavourites(socket.channel_id, function(favourites){
	socket.user_id = current_user._id;
	backend.user.isFaved(socket.channel_id, socket.user_id, function(isFaved){
	backend.channel.isOwner(socket.channel_id, socket.user_id, function(isOwner){
	backend.channel.isAdmin(socket.channel_id, socket.user_id, function(isAdmin){
		socket.display_name = current_user.display_name;
		socket.email = current_user.email;
		socket.email_hash = current_user.email_hash;
		socket.already_faved = isFaved;
		socket.is_owner = isOwner;
		socket.is_admin = isAdmin || isOwner;
		var own_user = { display_name: socket.display_name, login_name: socket.login_name, is_admin: socket.is_admin, user_id: socket.user_id, email: socket.email_hash };
		var online_user = init_online(socket.channel_id);
		if(!already_online(socket.channel_id, socket.login_name))
			online_user.push(own_user);
		console.log("in channel: " + online_user.length + " users from a max of " + current_channel.user_limit);
		if(online_user.length <= current_channel.user_limit || socket.is_admin){
			if(!already_online(socket.channel_id, socket.login_name)){
				console.log("user hasn't joined the server yet");
				socket.broadcast.to(socket.channel_id).emit('channel.user_join', { status: 0, content: own_user });
			} else {
				console.log("user already joined the server. don't broadcast new join");
			}
			socket.emit('channel.init', {
				user_data: own_user,
				users_online: online_user,
				guest_online: init_guests(socket.channel_id),
				last_chat: messages,
				playlist: playlist,
				already_faved: isFaved,
				views: views,
				favs: favourites,
				now_playing: current_item,
				logged_in: true,
				is_admin: socket.is_admin,
				is_owner: socket.is_owner,
			});
			socket.join(socket.channel_id);
			console.log("-- end of handshake log --\r\n");
			return true;
		} else {
			console.log("refuse connection - channel full");
			socket.emit("error.channel_full");
			console.log("-- end of handshake log --\r\n");
			return false;
		}
	});});});});});});});});});});
}
function emitGuestData(socket){
	backend.channel.findByChannelID(socket.channel_id, function(current_channel){
	backend.channel.playlist.getAll(socket.channel_id, function(playlist){
	backend.channel.playlist.findCurrent(socket.channel_id, function(current_item){
	backend.channel.chat.getLatest(socket.channel_id, 15, function(messages){
	backend.channel.getUniqueVisits(socket.channel_id, function(views){
	backend.channel.getFavourites(socket.channel_id, function(favourites){
		var online_user = init_online(socket.channel_id);
		console.log("in channel: " + online_user.length + " users from a max of " + current_channel.user_limit);
		if(online_user.length <= current_channel.user_limit){
			console.log("emiting join message");
			socket.broadcast.to(socket.channel_id).emit('channel.guest_join');
			socket.emit('channel.init', {
				users_online: online_user,
				guest_online: (init_guests(socket.channel_id) + 1),
				last_chat: messages,
				playlist: playlist,
				views: views,
				favs: favourites,
				already_faved: true,
				now_playing: current_item,
				logged_in: false
			});
			socket.join(socket.channel_id);
			console.log("-- end of handshake log --\r\n");
			return true;
		} else {
			socket.emit("error.channel_full");
			console.log("-- end of handshake log --\r\n");
			return false;
		}
	});});});});});});
}

io.sockets.on('connection', function (socket) {
	socket.logged_in = false;
	socket.channel_id = socket.handshake.query.channel_id;
	console.log("client connecting to channel_id: " + socket.channel_id);

	if(socket.handshake.query.session_id){
		backend.user.findBySessionID(socket.handshake.query.session_id, function(user){
			if(!user){
				console.log("invalid session-id: guest");
				socket.emit("error.session_id");
				emitGuestData(socket);
			} else {
				console.log("valid session-id: start emitting user-data...");
				socket.logged_in = true;
				socket.login_name = user.login_name;
				emitUserData(socket);
			}
		});
	} else {
		console.log("no session-id provided: guest");
		emitGuestData(socket);
	}

	/* --Channel Related-- */

	socket.on('disconnect', function(){
		socket.leave(socket.channel_id);
		if(!socket.logged_in)
			socket.broadcast.to(socket.channel_id).emit('channel.guest_leave');
		if(!already_online(socket.channel_id, socket.login_name))
			socket.broadcast.to(socket.channel_id).emit('channel.user_leave', { _id: socket.user_id });
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
							socket.emit("user.session_id", { content: { session_id: session_id }});
						});
					} else {
						socket.emit("error", { text: "Incorrect Username or Password." });
					}
				} else {
					socket.emit("error", { text: "Your Account is not ready yet. Please Check your mail for the Activation-Link" });
				}
			} else {
				socket.emit("error", { text: "Incorrect Username or Password." });
			}
		});
	});
	socket.on('user.logout', function(){
		if(socket.logged_in) {
			console.log("destroying session for " + socket.login_name);
			backend.user.session.destroy(socket.handshake.query.session_id, socket.login_name, function(){
				socket.emit("user.destroy_session");
			});
		}
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
							text: "To activate your account go to this address: http://" + configuration.hostname + "/validate/" + validate_hash,
							html: "<b>Welcome to SynergyTube, " + data.login_name + "!</b><br><hr><p>To Activate your new SynergyTube Account simply go to: <a href=\"http://" + configuration.hostname + "/validate/" + validate_hash + "\">http://" + configuration.hostname + "/validate/" + validate_hash + "</a></p>Thank you!"
						};
						backend.user.create(data.login_name, data.email, 'local', hasher.generate(data.password), validate_hash, function(){
							var smtpTransport = nodemailer.createTransport("SMTP", configuration.mail);
							smtpTransport.sendMail(mail, function(err, response){
								if(err){
									console.log(err);
									socket.emit("error", { text: "We were Unable to send the activation-link to your mail-address. Please contact the admin." });
								} else {
									socket.emit("user.create_account", response);
									smtpTransport.close();
								}
								console.log(response);
							});
						});
					} else {
						socket.emit("error", { text: "Sorry, your Password is too short. It has to be at least 6 chars long." });
					}
				} else {
					socket.emit("error", { text: "Sorry, your Username is too short. It has to be at least 4 chars long." });
				}
			} else {
				socket.emit("error", { text: "This Username or Email-Address has already been taken." });
			}
		});
	});
	
	/*--Chat Related--*/
	
	socket.on('chat.send', function(data){
		if(socket.logged_in) {
			backend.channel.chat.add(socket.channel_id, socket.user_id, data.content, function(){
				io.sockets.in(socket.channel_id).emit('chat.incoming', { status: 0, content: { display_name: socket.display_name, gravatar: socket.emailmd5, content: data.content, timestamp: new Date() }});
			});
		}
	});
	socket.on('chat.load_more', function(data){
		backend.channel.chat.getMore(socket.channel_id, 15, 20, new Date(data.append_at), function(message_data){
			socket.emit('chat.load_more', message_data);
			console.log("sent 15 messages more...");
		});
	});
	
	
	
	/*--Video Related--*/
		
	socket.on('playlist.append_item', function(data){
		// Check Privileges
		if(socket.is_admin)
			backend.channel.playlist.getHighestPosition(socket.channel_id, function(pos){
				console.log("append new item at " + (pos + 1));
				backend.channel.playlist.append(socket.channel_id, socket.user_id, data.url, (pos + 1), data.duration, data.caption, data.media_type, function(){
					io.sockets.in(socket.channel_id).emit('playlist.append_item',{ 
						status: 0, 
						content: { 
							position: (pos + 1), 
							url: data.url, 
							caption: data.caption, 
							duration: data.duration, 
							display_name: socket.display_name, 
							login_name: socket.login_name, 
							media_type: data.media_type 
						}
					});
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
				console.log("old item " + current_item.caption + " outdated");
				backend.channel.playlist.playNext(socket.channel_id);
			} else {
				console.log("send him back");
				socket.emit('playlist.play_item', { status: 0, content: { _id: current_item._id, start_time: current_item.start_time }});
			}
		});
	});
});

function init_online(channel_id){
	var arr = [];
	var usernames = [];
	var c = io.sockets.clients(channel_id);
	for (var i = c.length - 1; i >= 0; i--) {
		if(c[i].logged_in)
			if(usernames.indexOf(c[i].login_name) === -1){
				arr.push({
					display_name: c[i].display_name,
					login_name: c[i].login_name,
					is_admin: c[i].is_admin,
					user_id: c[i].user_id,
					email: c[i].email_hash
				});
				usernames.push(c[i].login_name);
		}
	};
	return arr;
}
function init_guests(channel_id){
	var c = io.sockets.clients(channel_id);
	var n = 0;
	for (var i = c.length - 1; i >= 0; i--) {
		if(!c[i].logged_in)
			n++;
	};
	return n;
}
function already_online(channel_id, login_name){
	var c = io.sockets.clients(channel_id);
	var is = false;
	for (var i = c.length - 1; i >= 0; i--) {
		if(c[i].login_name === login_name)
			is = true;
	};
	return is;
}
