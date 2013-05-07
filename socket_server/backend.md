# So you want to create your own backend?
## Here are the Infos we can provide:

- You need a Database or something similiar which you can use to write data. The Structure and everything else is part of your work, the backend just has to provide the needed methods.
- We currently just provide a backend for MySQL because it's the tool of our choice for more or less relational Data.
- Create a new Pull-Request if you want your Backend to be included.
- Be sure to include a ```exports.createStructure```, so that everypony can install this with absolute 0% of knowledge.
- There may or may not be future Changes to the Backend. Be sure to include the Version of the Backend yours is compatible with.
- Tell them why it's awesome to use Redis/MongoDB/Hadoop/... instead of lame old MySQL.
- If you need Inspiration or further Details this Guide can't provide just have a look at [mysql_backend.js](https://github.com/TeamSynergy/SynergyTube/blob/master/socket_server/mysql_backend.js)

- You need to provide a ```exports.connect(config, callback)```-function which simply connects to your storage-system with the information gathered in ```getInformation()``` so be sure to add this method!
- There has to be a ```exports.getInformation()```-function which is called on first_start to gather informations needed to connect to the storage
- Also there has to be a ```exports.onQueryError(err)```-function which is executed everytime an exception is caught. The standard-Handler just prints to the console.
- Provide a ```exports.connected```-property for future use.
- The query Methods have to use this 'format':
```javascript
exports.method = function(parameter, callback){
  do.query(querysomewhat, function(err, result){ // make everything pretty async
    if(err)
      exports.onQueryError(err);
    else
      return callback(result);
  });
}
```

## And here are the Methods you need to provide us: (as of v0.2)
### User functions:
shall start with ```exports.user```
- ```findBySessionID```
  - needs: session_id
  - returns [object]: all data about the user including a MD5-Hashed version of the Email-Adress ('email_hash')
- ```findByLoginName```
  - needs: login_name
  - returns: see ```findBySessionID```
- ```exists```
  - needs: login_name or email
  - returns [bool]: user exists?
- ```create```
  - needs: login_name, email-address, login-strategy (currently only local is valid, more to come), password_hash, validate_hash (for email activation)
  - returns: nothing/empty function
- ```session.create```
  - needs: login_name, session_id
  - returns: nothing/empty function
- ```session.destroy```
  - needs: login_name, session_id
  - returns: nothing/empty function
- ```isFaved```
  - needs: channel_id, user_id
  - returns [bool]: given channel faved?
- ```favourites```
  - needs: user_id
  - returns [int]: count of channels faved by user
- ```favChannel```
  - needs: user_id, channel_id
  - returns: nothing/empty function
- ```unFavChannel```
  - needs: user_id, channel_id
  - returns: nothing/empty function

### Channel functions:
shall start with ```exports.channel```
- ```findByChannelID```
- ```isOwner```
- ```isAdmin```
- ```getUniqueVisits```
- ```getFavourites```

### Chat functions:
shall start with ```exports.channel.chat```
- ```getLatest```
- ```getMore```
- ```add```

### Playlist functions:
shall start with ```exports.channel.playlist```
- ```getAll```
- ```findCurrent```
- ```findByPosition```
- ```findNext```
- ```playNext```
- ```getHighestPosition```
- ```setItemPositionByID```
- ```playItem```
- ```append```
- ```remove```
- ```length```
