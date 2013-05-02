# SynergyTube - The foolish SynchTube
***

## Introduction
### What it is
> SynergyTube aims to be an alternative to SynchTube which has been [shut-down](http://synchtube.com/).
> First goals have been reached by establishing a channel-system and user profiles. 

Currently we've just reached our [third milestone (v0.2)](https://github.com/screeny05/SynergyTube/archive/master.zip)  
Next up is 0.3

### How it works
A Channel simply consists of a playlist which is managed by the Channel-Admins.
The Admins can change the currently playing item, delete items, add items and manage the channel (change description, cover-image, etc..)  
You only have to log-in to use the chat functionality and take part in polls. Or if you are an admin of course.  
Currently supported Media-Vendors are:
- Youtube

I'm planning on adding more soon after the system has reached the final version 0.3.

### Implemented Features
- User Limit on Channels
- Administrationship of Channels
- A Working Channel-Overview
- Realtime Communication via Socket.IO
- Playlist-Synchronisation
- Database-Abstraction

## Installation
### Requirements

* **node.js**-Instance
* **PHP**-Server
* **MySQL**-Database

### Step-by-Step

1. **_Don't_** leave the socket_server folder accessible from the web. Copy it to a seperate folder (eg. /var/nodejs/synergy) and execute it from over there.
2. If you intend to use MySQL as the DBMS of your choice just use backend-script this ships with. If you want to use another one just have a look at [/socket-server/mysql_backend.js](https://github.com/screeny05/synergyTube/blob/master/socket_server/mysql_backend.js) and create your own one in the same pattern or look arround the web for your database system. 
3. (shouldn't be needed as of 0.4) Go To your /require in your WebPage-Directory and configure the "config.inc.php" file to your needs.
4. Install the node.js server and follow the on-screen instructions to set up your backend.

```
cd /path/to/socket_server/app.js
npm install
```
5. Run it!

```
node app.js
```

## Development & Future Plans
### Backend

- (Deploy the Client-Frontend over ExpressJS)
- Provide a better User Experience and some EyeCandy
- Fully update to AngularJS (#25)

### Features

- Add Support for other Media Vendors
- Channels for Everypony (#51)
- User Profiles and Stuff
- Poll-System
- [Full List here](https://github.com/screeny05/synergyTube/issues?labels=Feature&state=open)

## Suport & Contributing
If you want to support my work let me know: [mail me](mailto:screeny05@gmail.com) | [open an issue](https://github.com/screeny05/SynergyTube/issues/new) | [fork me](https://github.com/screeny05/SynergyTube/fork)

## Licensing
Licensed under MIT-License.  
see [LICENSE](https://github.com/screeny05/synergyTube/blob/master/LICENSE) for further details
