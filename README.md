# SynergyTube - The foolish SynchTube
***

## Introduction
### What it is
> SynergyTube aims to be an alternative to SynchTube which has been [shut-down](http://synchtube.com/).
> First goals have been reached with establishing a channel-system and user profiles. 

Currently we've reached our second milestone (v0.1 pre-beta)

### How it works
A Channel simply consists of a playlist which is managed by the Channel-Admins.
The Admins can change the currently playing item, delete items, add items and manage the channel (change description, cover-image, etc..)  
You only have to log-in to use the chat functionality and take part in polls. Or if you are an admin of course.  
Currently supported Media-Vendors are:
- Youtube

I'm planning on adding more soon after the system has reached the final version 0.1.


## Installation
### Requirements

* **node.js**-Instance
* **PHP**-Server
* **MySQL**-Database

### Step-by-Step

1. Setup your MySQL-Database with the dump found in [/db-dump.sql](https://github.com/screeny05/synergyTube/blob/master/db-dump.sql)
2. **_Don't_** leave the socket_server folder accessible from the web. Copy it to a seperate folder.
3. Edit the Database Parameters in [socket_server/config.json](https://github.com/screeny05/synergyTube/blob/master/socket_server/config.json) and [require/config.inc.php](https://github.com/screeny05/synergyTube/blob/master/require/config.inc.php) to your needs.  
   (I'm currently thinking about a better handling of this)
4. Install the node.js server  
   ```bash
   cd -wherever you put your /socket_server-
   npm install
   ```
5. Run it!
   ```bash
   node app.js
   ```

## Development & Future Plans
### Backend

- Migrate to MongoDB
- Deploy the Client-Frontend over ExpressJS
- Fully update to AngularJS (#25)

### Features

- Add Support for other Media Vendors
- Channels for Everypony (#51)
- User Profiles and Stuff
- Poll-System
- [Full List here](https://github.com/screeny05/synergyTube/issues?labels=Feature&state=open)

## Contributing
CONTRIBUTE-md soon to be added.

## Licensing
see [LICENSE](https://github.com/screeny05/synergyTube/blob/master/LICENSE)
