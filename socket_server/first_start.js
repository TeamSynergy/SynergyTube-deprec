var fs = require('fs');
if(!fs.existsSync('./config.json')){
	var get = function(statement, callback){process.stdout.write(statement);process.stdin.once('data', function(data){callback(data.toString().trim());});};
	var created_conf = {};
	console.log("This seems to be the first time you're using this SynergyTube-Server, in order to let this work the right way I have some questions to you.");
	console.log(" - Which Backend do you want to use:");
	var files = fs.readdirSync('./');
	var b = [];
	var x = 0;
	for(var i=0; i<files.length;i++){
		if(files[i].indexOf('backend.js') !== -1){
			b.push(files[i]);
			x++;
			console.log("\t" + x + ". " + files[i].replace("_backend.js",""));
		}
	}
	get("\r\nSelect Backend: ", function(backend_choice){
		created_conf.backend = b[backend_choice - 1].replace("_backend.js","");
		console.log("\r\nenter backend-specific informations: ");
		var be = require("./" + b[backend_choice - 1]);
		be.getInformation(function(db_info){
			be.connect(db_info);
			be.createStructure(db_info, function(errs){
			console.log("\r\nenter email settings; using a gmail account (with @gmail.com please)");
			get("\t- user: ", function(g_user){
			get("\t- pass: ", function(g_pass){
			get("\r\nthe (public) domain of this machine (eg: 'localhost','synergytube.com')", function(hostname){
			created_conf.database = db_info;
			created_conf.hostname = hostname;
			created_conf.mail = {};
			created_conf.mail.service = "Gmail";
			created_conf.mail.auth = {};
			created_conf.mail.auth.user = g_user;
			created_conf.mail.auth.pass = g_pass;
		
			fs.writeFile('./config.json', JSON.stringify(created_conf, null, 4), function(err){
				if(err)
					console.log("Unable to write to file 'config.json'", err);
				else
					console.log("Finished writing, restart the server!");
				process.exit();
			});
		});});});});});
	});
}
