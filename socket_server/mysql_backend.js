var mysql = require('mysql');
var sql = null;
var config = null;
exports.connected = false;

// on Error automatically tries to reconnect to the mysql-server on Connection-Loss
var onError = function(err){
    if(err){
        console.log(err);
        if(err.code === "PROTOCOL_CONNECTION_LOST")
            exports.connected = false;
    }
    if(!exports.connected){
        var re = setInterval(function(){
            sql = mysql.createConnection(config);
            if(exports.connect())
                clearInterval(re);
        }, 5000);
    }
};

exports.connect = function(config){
	db_config = config;
	sql = mysql.createConnection(db_config);
	sql.connect(function(err){
		if(err) {
			console.log(err);
			exports.connected = false;
		} else {
			exports.connected = true;
			sql.on("error", onError);
		}
		return exports.connected;
	});
};


exports.onQueryError = function(err){
	console.log(err);
};

exports.user = {};
exports.user.session = {};
exports.channel = {};
exports.channel.chat = {};
exports.channel.playlist = {};

/* === User-Functions === */

exports.user.findBySessionID = function(session_id, fn){
	sql.query("SELECT * FROM tblUser WHERE session_id = " + sql.escape(session_id), function(err, rows){
		if(err)
			exports.onQueryError(err);
		else
			if(rows.length > 0)
				return fn(rows[0]);
			else
				return fn(null);
	});
};

exports.user.findByLoginName = function(login_name, fn){
	sql.query("SELECT * FROM tblUser WHERE login_name = " + sql.escape(login_name.toLowerCase()), function(err, rows){
		if(err)
			exports.onQueryError(err);
		else
			if(rows.length > 0)
				return fn(rows[0]);
			else
				return fn(null);
	});
};

exports.user.exists = function(login_name, email, fn){
	sql.query("SELECT COUNT(*) AS '_c' FROM tblUser WHERE login_name = " + sql.escape(login_name) + " OR email = " + sql.escape(email), function(err, rows){
		if(err)
			exports.onQueryError(err);
		else
			return fn(rows[0]._c > 0);
	});
};

exports.user.create = function(login_name, email, strategy, password_hash, validate_hash, fn){
	sql.query("INSERT INTO tblUser (login_name, display_name, email, strategy, hash, is_valid, validate_hash) VALUES (" + sql.escape(login_name.toLowerCase()) + ", " + sql.escape(login_name) + ", " + sql.escape(email) + ", " + sql.escape(strategy) + ", " + sql.escape(password_hash) + ", 0, " + sql.escape(validate_hash) + ")", function(err){
		if(err)
			exports.onQueryError(err);
		else
			return fn();
	});
};

exports.user.session.destroy = function(login_name, session_id, fn){
	sql.query("UPDATE tblUser SET session_id = '' WHERE login_name = " + sql.escape(login_name.toLowerCase()) + " AND session_id = " + sql.escape(session_id), function(err){
		if(err)
			exports.onQueryError(err);
		else
			if(typeof fn !== "undefined")
				return fn();
	});
};

exports.user.session.create = function(login_name, session_id, fn){
	sql.query("UPDATE tblUser SET session_id = " + sql.escape(session_id) + " WHERE login_name = " + sql.escape(login_name.toLowerCase()), function(err){
		if(err)
			exports.onQueryError(err);
		else
			return fn();
	});
};

exports.user.isFaved = function(channel_id, user_id, fn){
	sql.query("SELECT COUNT(*) AS '_c' FROM relFavourites WHERE channel_id = " + sql.escape(channel_id) + " AND user_id = " + sql.escape(user_id), function(err, rows){
		if(err)
			exports.onQueryError(err);
		else
			return fn(rows[0]._c === 1);
	});
};

exports.user.favChannel = function(user_id, channel_id, fn){
	sql.query("INSERT INTO relFavourites (channel_id, user_id) VALUES (" + sql.escape(channel_id) + ", " + sql.escape(user_id) + ")", function(err){
		if(err)
			exports.onQueryError(err);
		else
			return fn();
	});
};

exports.user.unFavChannel = function(user_id, channel_id, fn){
	sql.query("DELETE FROM relFavourites WHERE channel_id = " + sql.escape(user_id) + " AND user_id = " + sql.escape(user_id), function(err){
		if(err)
			exports.onQueryError(err);
		else
			return fn();
	});
};


/* === Channel-Functions === */

exports.channel.findByChannelID = function(channel_id, fn){
	sql.query("SELECT * FROM tblChannels WHERE _id = " + sql.escape(channel_id), function(err, rows){
		if(err)
			exports.onQueryError(err);
		else
			if(rows.length > 0)
				return fn(rows[0]);
			else
				return fn();
	});
};

exports.channel.isOwner = function(channel_id, user_id, fn){
	sql.query("SELECT COUNT(*) AS '_c' FROM tblChannels WHERE owner_id = " + sql.escape(user_id) + " AND _id = " + sql.escape(channel_id), function(err, rows){
		if(err)
			exports.onQueryError(err);
		else
			return fn(rows[0]._c === 1);
	});
};

exports.channel.isAdmin = function(channel_id, user_id, fn){
	sql.query("SELECT COUNT(*) AS '_c' FROM relAdmins WHERE user_id = " + sql.escape(user_id) + " AND channel_id = " + sql.escape(channel_id), function(err, rows){
		if(err)
			exports.onQueryError(err);
		else
			return fn(rows[0]._c === 1);
	});
};

exports.channel.getUniqueVisits = function(channel_id, fn){
	sql.query("SELECT COUNT(DISTINCT ip_hash) AS '_c' FROM tblTracking WHERE channel_id = " + sql.escape(channel_id), function(err, rows){
		if(err)
			exports.onQueryError(err);
		else
			return fn(rows[0]._c);
	});
};

exports.channel.getFavourites = function(channel_id, fn){
	sql.query("SELECT COUNT(*) AS '_c' FROM relFavourites WHERE channel_id = " + sql.escape(channel_id), function(err, rows){
		if(err)
			exports.onQueryError(err);
		else
			return fn(rows[0]._c);
	});
};

	/* -- Channel.Chat -- */

exports.channel.chat.getLatest = function(channel_id, count, fn){
	sql.query("SELECT timestamp, content, display_name FROM tblMessages INNER JOIN tblUser ON tblUser._id = tblMessages.user_id WHERE channel_id = " + sql.escape(channel_id) + " ORDER BY timestamp DESC LIMIT 0, " + sql.escape(count), function(err, rows){
		if(err)
			exports.onQueryError(err);
		else
			return fn(rows);
	});
};

exports.channel.chat.getMore = function(channel_id, count, last_stamp, fn){
	sql.query("SELECT timestamp, content, display_name FROM tblMessages INNER JOIN tblUser ON tblUser._id = tblMessages.user_id WHERE channel_id = " + sql.escape(channel_id) + " AND timestamp < " + sql.escape(last_stamp) + " ORDER BY timestamp DESC LIMIT 0, " + sql.escape(count), function(err, rows){
		if(err)
			exports.onQueryError(err);
		else
			return fn(rows);
	});
};

exports.channel.chat.add = function(channel_id, user_id, content, fn){
	sql.query("INSERT INTO tblMessages (channel_id, user_id, content, timestamp) VALUES (" + sql.escape(channel_id) + ", " + sql.escape(user_id) + ", " + sql.escape(content) + ", NOW())", function(err){
		if(err)
			exports.onQueryError(err);
		else
			return fn();
	});
};

	/* -- Channel.Playlist -- */

exports.channel.playlist.getAll = function(channel_id, fn){
	sql.query("SELECT tblMedia._id, position, url, caption, duration, display_name, login_name, media_type FROM tblMedia RIGHT JOIN tblUser ON tblUser._id = tblMedia.user_id WHERE channel_id = " + sql.escape(channel_id) + " ORDER BY position ASC", function(err, rows){
		if(err)
			exports.onQueryError(err);
		else
			return fn(rows);
	});
};

exports.channel.playlist.findCurrent = function(channel_id, fn){
	sql.query("SELECT * FROM tblMedia WHERE channel_id = " + sql.escape(channel_id) + " ORDER BY start_time DESC LIMIT 0,1", function(err, rows){
		if(err)
			exports.onQueryError(err);
		else
			if(rows.length > 0)
				return fn(rows[0]);
			else
				return fn(null);
	});
};

exports.channel.playlist.findByPosition = function(channel_id, position, fn){
	sql.query("SELECT * FROM tblMedia WHERE channel_id = " + sql.escape(channel_id) + " AND position = " + sql.escape(position), function(err, rows){
		if(err)
			exports.onQueryError(err);
		else
			if(rows.length > 0)
				return fn(rows[0]);
			else
				return fn(null);
	});
};

exports.channel.playlist.findNext = function(channel_id, fn){
	exports.channel.playlist.findCurrent(channel_id, function(current){
		exports.channel.playlist.findByPosition(channel_id, (current.position + 1), function(next){
			if(next)
				return fn(next);
			else
				exports.channel.playlist.findByPosition(channel_id, 1, function(first){
					return fn(first);
				});
		});
	});
};

exports.channel.playlist.playNext = function(channel_id, fn){
	exports.channel.playlist.findNext(channel_id, function(next){
		console.log("new item is " + next.caption);
		exports.channel.playlist.playItem(next._id);
		if(typeof fn !== "undefined")
			fn();
	});
};

exports.channel.playlist.getHighestPosition = function(channel_id, fn){
	sql.query("SELECT MAX(position) AS '_p' FROM tblMedia WHERE channel_id = " + sql.escape(channel_id), function(err, rows){
		if(err)
			exports.onQueryError(err);
		else
			if(rows[0])
				return fn(rows[0]._p);
			else
				return fn(0);
	});
};

exports.channel.playlist.setItemPositionByID = function(item_id, position, fn){
	sql.query("UPDATE tblMedia SET position = " + sql.escape(position) + " WHERE _id = " + sql.escape(item_id), function(err){
		if(err)
			exports.onQueryError(err);
		else
			if(typeof fn === "function")
				return fn();
	});
};

exports.channel.playlist.playItem = function(item_id, fn){
	sql.query("UPDATE tblMedia SET start_time = NOW() WHERE _id = " + sql.escape(item_id), function(err){
		if(err)
			exports.onQueryError(err);
		else
			if(typeof fn !== "undefined")
				return fn();
	});
};

exports.channel.playlist.append = function(channel_id, user_id, url, position, duration, caption, media_type, fn){
	sql.query("INSERT INTO tblMedia (channel_id, user_id, url, position, duration, caption, media_type) VALUES (" + sql.escape(channel_id) + ", " + sql.escape(user_id) + ", " + sql.escape(url) + ", " + sql.escape(position) + ", " + sql.escape(duration) + ", " + sql.escape(caption) + ", " + sql.escape(media_type) + ")", function(err){
		if(err)
			exports.onQueryError(err);
		else
			return fn();
	});
}

exports.channel.playlist.remove = function(item_id, fn){
	sql.query("DELETE FROM tblMedia WHERE _id = " + sql.escape(item_id), function(err){
		if(err)
			exports.onQueryError(err);
		else
			return fn();
	});
};
