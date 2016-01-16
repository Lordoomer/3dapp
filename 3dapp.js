var http = require("http"),
url = require("url"),
formidable = require('formidable'),
path = require("path"),
util = require('util'),
fs = require("fs-extra");
port = process.argv[2] || 8080;
var io = require('socket.io')();
var mysql = require('mysql');
var ObjectTable = [];
var MapTable = [];
var UserTable = [];
var connection = mysql.createConnection(
    {
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'valhalla',
    }
);
        var queryMap = 'SELECT * FROM maps'; 
        connection.query(queryMap, function(err, rows, fields) {
            if (err) throw err;
         
            for (var i in rows) {
				MapTable.push(rows[i].mapname);                      
            }
        }); 
        queryMap = 'SELECT * FROM users'; 
        connection.query(queryMap, function(err, rows, fields) {
            if (err) throw err;
         
            for (var i in rows) {
				UserTable.push(rows[i].username); 
				console.log(rows[i].username);
            }
        }); 
        queryMap = 'SELECT * FROM map_objects';
        connection.query(queryMap, function(err, rows, fields) {
            if (err) throw err;
         
            for (var i in rows) {
				ObjectTable.push(rows[i]);                   
            }		
        }); 
		
//var queryString = 'SELECT * FROM users'; //users cest la table mysql
 
/*connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
 
    for (var i in rows) {
        console.log('Account: ', rows[i].username); //.username cest le champ mysql
    }
});*/
var app =  http.createServer(function(request, response) {
    var uri = url.parse(request.url).pathname,
        filename = path.join(process.cwd(), uri);
        if (request.url == '/upload' && request.method.toLowerCase() == 'post') {
            fs.exists(filename, function(exists) {
                if(!exists) {
                response.writeHead(404, {"Content-Type": "text/plain"});
                response.write("404 Not Found\n");
                response.end();
                return;
                } 
                if (fs.statSync(filename).isDirectory()) filename += 'ff4dark/html/upload.html';
                fs.readFile(filename, "binary", function(err, file) {
                    if(err) {
                        response.writeHead(500, {"Content-Type": "text/plain"});
                        response.write(err + "\n");
                        response.end();
                        return;
                    }
					var strbits = filename.split(".");  //this will break if there is ever another dot
					var xtn = strbits[1]; //i really should check if the above worked
					console.log(xtn);
					switch ( xtn ) { //do javascript switches like this work? you may need to check
						case 'html':
							response.writeHead(200, {"Content-Type": "text/html"});
						  break;
						case 'gif':
							response.writeHead(200, {"Content-Type": "image/gif"});
						  break;
						case 'jpg':
							response.writeHead(200, {"Content-Type": "image/jpeg"});
						  break;
						case 'png':
							response.writeHead(200, {"Content-Type": "image/png"});
						  break;
						case 'css':
							response.writeHead(200, {"Content-Type": "text/css"});
						  break;
						case 'js':
							response.writeHead(200, {"Content-Type": "application/javascript"});
						  break;
						default:
							response.writeHead(200, {"Content-Type": "text/plain"});
						  console.log("unknown extention " + xtn);
						  break;
					}
                    response.write(file, "binary");
                    response.end();
                });
            });  
            var MyUploadingFileName, filesizevalidation = "0";
            var form = new formidable.IncomingForm();
            form.parse(request, function(err, fields, files) {
                //console.log(util.inspect(fields.file)); // I found out this fields.file return the value of the field whose name is file
                MyUploadingFileName = util.inspect(fields.filename);
              //  console.log(util.inspect({files: files})); 
                filesizevalidation = util.inspect({files : files});
                filesizevalidation = filesizevalidation.substring(filesizevalidation.indexOf("size:"), filesizevalidation.length);
                filesizevalidation = filesizevalidation.substring( (filesizevalidation.indexOf(":") + 2), filesizevalidation.indexOf(","));
                console.log("begin uploading file:" + MyUploadingFileName);     
            }); 
            form.on('progress', function(bytesReceived, bytesExpected) {
                var percent_complete = (bytesReceived / bytesExpected) * 100; 
                io.sockets.emit("prototype", percent_complete.toFixed(0)); 
                console.log(percent_complete.toFixed(2));                   
            });
            form.on('error', function(err) {
                console.error(err);
            });
            form.on('end', function(fields, files) {  
                /* Temporary location of our uploaded file */
                var temp_path = this.openedFiles[0].path;
                /* The file name of the uploaded file */
                var file_name = this.openedFiles[0].name;
                file_name = file_name.split("");
                for(i = 0; i < file_name.length; i++ )
                {
                  if(file_name[i] == " ")
                  {
                  	file_name.splice(i, 1, "_");
                  }	
                }	
                file_name = file_name.join("");
                /* Location where we want to copy the uploaded file */
                var new_location = 'd:/nodejs/ff4dark/images/';
                if (filesizevalidation != "0" )
                {
	                   fs.copy(temp_path, new_location + file_name, function(err) {  
	                    if (err) {
	                        console.error(err);
	                    } else {
                                io.sockets.emit('GetMyImagePath', file_name);
	                    }
	                });             	
                }

            });
		                response.writeHead(500, {"Content-Type": "text/plain"});
		                response.end();
            return;
        } 
        else
        {
	        fs.exists(filename, function(exists) {
		        if(!exists) {
		        response.writeHead(404, {"Content-Type": "text/plain"});
		        response.write("404 Not Found\n");
		        response.end();
		        return;
		        }
		         
		        if (fs.statSync(filename).isDirectory()) filename += 'ff4dark/html/index.html';
		        fs.readFile(filename, "binary", function(err, file) {
		            if(err) {
		                response.writeHead(500, {"Content-Type": "text/plain"});
		                response.write(err + "\n");
		                response.end();
		                return;
		            }
					strbits = filename.split(".");  //this will break if there is ever another dot
					xtn = strbits[1]; //i really should check if the above worked
					console.log(xtn);
					switch ( xtn ) { //do javascript switches like this work? you may need to check
					case 'html':
						response.writeHead(200, {"Content-Type": "text/html"});
					  break;
					case 'gif':
						response.writeHead(200, {"Content-Type": "image/gif"});
					  break;
					case 'jpg':
						response.writeHead(200, {"Content-Type": "image/jpeg"});
					  break;
					case 'png':
						response.writeHead(200, {"Content-Type": "image/png"});
					  break;
					case 'css':
						response.writeHead(200, {"Content-Type": "text/css"});
					  break;
					case 'js':
						response.writeHead(200, {"Content-Type": "application/javascript"});
					  break;
					default:
						response.writeHead(200, {"Content-Type": "text/plain"});
              console.log("unknown extention " + xtn);
              break;
					}
	                    response.write(file, "binary");
		                response.end();
		        });
		    });      	
        }
});
var messages = [];
io = io.listen(app); 
// Quand une personne se connecte au serveur
io.sockets.on('connection', function (socket) {
       var mydirectory = "ff4dark/images";
	   fs.readdir(mydirectory, function( err, files) {
        if ( err ) {
            console.log("Error reading files: ", err);
        } else {
            // keep track of how many we have to go.
            var remaining = files.length;
            var totalBytes = 0;
            if ( remaining == 0 ) {
               		var MyImagesDir = files;
					socket.emit('GetMyImagesPath', MyImagesDir);
            }
            for ( var i = 0; i < files.length; i++ ) {
                    remaining -= 1;
                    if ( remaining == 0 ) {
                            var MyImagesDir = files;
							socket.emit('GetMyImagesPath', MyImagesDir);
                    }
                }
        }
    });
    socket.emit('recupererMessages', messages);
    // Quand on reçoit un nouveau message
    socket.on('nouveauMessage', function (mess) {
        // On l'ajoute au tableau (variable globale commune à tous les clients connectés au serveur)
        messages.push(mess);
        // On envoie à tout les clients connectés (sauf celui qui a appelé l'événement) le nouveau message
        socket.broadcast.emit('recupererNouveauMessage', mess);
    });
    socket.on('NewMap', function (mapname, author, lastMap ) {
        var mapexist = false;
            for (var i in MapTable) {
                if(MapTable[i] == mapname)
                {
                    mapexist = true;    
                }
            }
            if(mapexist == true)
            {
                    socket.emit('newMapFeedback', "exist");
            }
            else
            {
                if(lastMap != "none")
                {
                socket.leave(lastMap);                
                }
                socket.join(mapname);
				MapTable.push(mapname);
                var post  = {mapname: mapname, author: author};
                var query = connection.query('INSERT INTO maps SET ?', post, function(err, result) {
                socket.emit('newMapFeedback', mapname);
                });   
            }
    });
    socket.on('LoadMap', function (mapname, lastMap ) {
	    console.log("loading map: " + mapname);
        var myLoadingMap = [];
        var object_name = [];
        var width = [];
        var height = [];
        var Zindex = [];
        var Xaxis = [];
        var Yaxis = [];
        var x_coord = [];
        var y_coord = [];
        var obstacle = [];
        var map_name = [];
        var special_event = [];
        var author = [];
        var background = [];
        var inner_text = [];
        var image = [];
        myLoadingMap.push(object_name);
        myLoadingMap.push(width);
        myLoadingMap.push(height);
        myLoadingMap.push(Zindex);
        myLoadingMap.push(Xaxis);
        myLoadingMap.push(Yaxis);
        myLoadingMap.push(x_coord);
        myLoadingMap.push(y_coord);
        myLoadingMap.push(obstacle);
        myLoadingMap.push(map_name);
        myLoadingMap.push(special_event);
        myLoadingMap.push(author);
        myLoadingMap.push(background);
        myLoadingMap.push(inner_text);
        myLoadingMap.push(image);
        var mapexist = false;
            for (var i in MapTable) {
                if(MapTable[i] == mapname)
                {
                    mapexist = true;
                    socket.join(mapname);
                    for (var i in ObjectTable) {
                        if(ObjectTable[i].map_name == mapname)
                         {
                                myLoadingMap[0].push(ObjectTable[i].object_name);
                                myLoadingMap[1].push(ObjectTable[i].width);
                                myLoadingMap[2].push(ObjectTable[i].height);
                                myLoadingMap[3].push(ObjectTable[i].Zindex);
                                myLoadingMap[4].push(ObjectTable[i].Xaxis);
                                myLoadingMap[5].push(ObjectTable[i].Yaxis);
                                myLoadingMap[6].push(ObjectTable[i].x_coord);
                                myLoadingMap[7].push(ObjectTable[i].y_coord);
                                myLoadingMap[8].push(ObjectTable[i].obstacle);
                                myLoadingMap[9].push(ObjectTable[i].map_name);
                                myLoadingMap[10].push(ObjectTable[i].special_event);     
                                myLoadingMap[11].push(ObjectTable[i].author);  
                                myLoadingMap[12].push(ObjectTable[i].background); 
                                myLoadingMap[13].push(ObjectTable[i].inner_text);   
                                myLoadingMap[14].push(ObjectTable[i].image);                                                                                                               
                        }                       
                    }
                    socket.emit('LoadMapFeedback', myLoadingMap);
                    socket.emit('LoadMapNameFeedback', mapname);
                    break;   
                }         
            }
            if(mapexist == false)
            {
                console.log("Map don't exist!");
                socket.emit('LoadMapFeedback', "Map don't exist");
            }
			else{
					if(lastMap != "none")
					{
					socket.leave(lastMap);                
					}
			}
    });
    socket.on('New3dappfunction', function (My3dappfunction) {
        io.to(My3dappfunction[2]).emit('My3dappfunction', My3dappfunction);
        if( My3dappfunction[0] == "0" )
        {
            var MyobjectHere  = {object_name: My3dappfunction[1], width: 100, height: 100, Zindex: 0, Xaxis: 0, Yaxis: 0, x_coord: 0, y_coord: 0, map_name: My3dappfunction[2], author: My3dappfunction[3], background: "false", obstacle: "false", inner_text: "", image: ""};
			ObjectTable.push(MyobjectHere);
            var query = connection.query('INSERT INTO map_objects SET ?', MyobjectHere, function(err, result) {
            });   
        }
        if( My3dappfunction[0] == "1" )
        {   
			for (t in ObjectTable)
			{
				if (ObjectTable[t].object_name == My3dappfunction[1][0] && ObjectTable[t].map_name == My3dappfunction[2])
				{
					ObjectTable[t].Xaxis = My3dappfunction[1][1];
					ObjectTable[t].Yaxis = My3dappfunction[1][2];
					break;
				}
			}
            var querx = connection.query('UPDATE map_objects SET Xaxis = "' + My3dappfunction[1][1] + '" WHERE object_name = "' + My3dappfunction[1][0] + '" AND map_name = "' +  My3dappfunction[2] + '"');
            var query = connection.query('UPDATE map_objects SET Yaxis = "' + My3dappfunction[1][2] + '" WHERE object_name = "' + My3dappfunction[1][0] + '" AND map_name = "' +  My3dappfunction[2] + '"');                          
        }
        if( My3dappfunction[0] == "2" )
        { 
			for (t in ObjectTable)
			{
				if (ObjectTable[t].object_name == My3dappfunction[1][0] && ObjectTable[t].map_name == My3dappfunction[2])
				{
					ObjectTable[t].x_coord = My3dappfunction[1][1];
					ObjectTable[t].y_coord = My3dappfunction[1][2];
					break;
				}
			}
            var querx = connection.query('UPDATE map_objects SET x_coord = "' + My3dappfunction[1][1] + '" WHERE object_name = "' + My3dappfunction[1][0] + '" AND map_name = "' +  My3dappfunction[2] + '"');
            var query = connection.query('UPDATE map_objects SET y_coord = "' + My3dappfunction[1][2] + '" WHERE object_name = "' + My3dappfunction[1][0] + '" AND map_name = "' +  My3dappfunction[2] + '"');                
        } 
         
        if( My3dappfunction[0] == "3" )
        {
			for (t in ObjectTable)
			{
				if (ObjectTable[t].object_name == My3dappfunction[1][0] && ObjectTable[t].map_name == My3dappfunction[2])
				{
					ObjectTable[t].height = My3dappfunction[1][1];
					break;
				}
			}
            var query = connection.query('UPDATE map_objects SET height = "' + My3dappfunction[1][1] + '" WHERE object_name = "' + My3dappfunction[1][0] + '" AND map_name = "' +  My3dappfunction[2] + '"');
        }
        if( My3dappfunction[0] == "4" )
        {
			for (t in ObjectTable)
			{
				if (ObjectTable[t].object_name == My3dappfunction[1][0] && ObjectTable[t].map_name == My3dappfunction[2])
				{
					ObjectTable[t].width = My3dappfunction[1][1];
					break;
				}
			}
            var query = connection.query('UPDATE map_objects SET width = "' + My3dappfunction[1][1] + '" WHERE object_name = "' + My3dappfunction[1][0] + '" AND map_name = "' +  My3dappfunction[2] + '"');      
        }
        if( My3dappfunction[0] == "5" )
        {
			for (t in ObjectTable)
			{
				if (ObjectTable[t].object_name == My3dappfunction[1][0] && ObjectTable[t].map_name == My3dappfunction[2])
				{
					ObjectTable[t].height = My3dappfunction[1][1];
					ObjectTable[t].width = My3dappfunction[1][2];
					break;
				}
			}
            var query = connection.query('UPDATE map_objects SET height = "' + My3dappfunction[1][1] + '" WHERE object_name = "' + My3dappfunction[1][0] + '" AND map_name = "' +  My3dappfunction[2] + '"');      
            var querx = connection.query('UPDATE map_objects SET width = "' + My3dappfunction[1][2] + '" WHERE object_name = "' + My3dappfunction[1][0] + '" AND map_name = "' +  My3dappfunction[2] + '"'); 
        }
        if( My3dappfunction[0] == "10" )
        {
			for (t in ObjectTable)
			{
				if (ObjectTable[t].object_name == My3dappfunction[1][0] && ObjectTable[t].map_name == My3dappfunction[2])
				{
					ObjectTable[t].Zindex = My3dappfunction[1][1];
					break;
				}
			}	
			if(My3dappfunction[1][1] <= 0 )
			{ 
				My3dappfunction[1][1] = 0;
				ObjectTable[t].Zindex = 0;	
			}			
            var query = connection.query('UPDATE map_objects SET Zindex = "' + My3dappfunction[1][1] + '" WHERE object_name = "' + My3dappfunction[1][0] + '" AND map_name = "' +  My3dappfunction[2] + '"');      
        }  
        if( My3dappfunction[0] == "11" )
        {
			for (t in ObjectTable)
			{
				if (ObjectTable[t].object_name == My3dappfunction[1][0] && ObjectTable[t].map_name == My3dappfunction[2])
				{
					ObjectTable[t].Zindex = My3dappfunction[1][1];
					break;
				}
			}	
			if(My3dappfunction[1][1] <= 0 )
			{ 
				My3dappfunction[1][1] = 0;
				ObjectTable[t].Zindex = 0;
			} 			
            var query = connection.query('UPDATE map_objects SET Zindex = "' + My3dappfunction[1][1] + '" WHERE object_name = "' + My3dappfunction[1][0] + '" AND map_name = "' +  My3dappfunction[2] + '"');      
        } 		
        if( My3dappfunction[0] == "9" )
        {
			for (t in ObjectTable)
			{
				if (ObjectTable[t].object_name == My3dappfunction[1][0] && ObjectTable[t].map_name == My3dappfunction[2])
				{
					ObjectTable[t].inner_text = My3dappfunction[1][1];
					break;
				}
			}
            var query = connection.query('UPDATE map_objects SET inner_text = "' + My3dappfunction[1][0] + '" WHERE object_name = "' + My3dappfunction[1][1] + '" AND map_name = "' +  My3dappfunction[2] + '"');      
        }
        if( My3dappfunction[0] == "12" )
        {
			for (t in ObjectTable)
			{
				if (ObjectTable[t].object_name == My3dappfunction[1][0] && ObjectTable[t].map_name == My3dappfunction[2])
				{
					ObjectTable[t].obstacle = My3dappfunction[1][1];
					break;
				}
			}
            var query = connection.query('UPDATE map_objects SET obstacle = "' + My3dappfunction[1][1] + '" WHERE object_name = "' + My3dappfunction[1][0] + '" AND map_name = "' +  My3dappfunction[2] + '"');   
        }
        if( My3dappfunction[0] == "13" )
        {
			for (t in ObjectTable)
			{
				if (ObjectTable[t].object_name == My3dappfunction[1][0] && ObjectTable[t].map_name == My3dappfunction[2])
				{
					ObjectTable[t].background = My3dappfunction[1][1];
					break;
				}
			}
            var query = connection.query('UPDATE map_objects SET background = "' + My3dappfunction[1][1] + '" WHERE object_name = "' + My3dappfunction[1][0] + '" AND map_name = "' +  My3dappfunction[2] + '"');    
        }
        if( My3dappfunction[0] == "14" )
        {
			for (t in ObjectTable)
			{
				if (ObjectTable[t].object_name == My3dappfunction[1][0] && ObjectTable[t].map_name == My3dappfunction[2])
				{
					ObjectTable[t].image = My3dappfunction[1][1];
					break;
				}
			}
            var query = connection.query('UPDATE map_objects SET image = "' + My3dappfunction[1][1] + '" WHERE object_name = "' + My3dappfunction[1][0] + '" AND map_name = "' +  My3dappfunction[2] + '"');
        }          
    });
    socket.on('UpdateNewImageDir', function (updateVar) {
       // console.log("updating new image path" + updateVar);
       var mydirectory = "ff4dark/images";
			   fs.readdir(mydirectory, function( err, files) {
		        if ( err ) {
		            console.log("Error reading files: ", err);
		        } else {
		            // keep track of how many we have to go
		            var remaining = files.length;
		            var totalBytes = 0;
		            if ( remaining == 0 ) {
		               		var MyImagesDir = files;
							socket.emit('GetMyImagesPath', MyImagesDir);
		            }
		            for ( var i = 0; i < files.length; i++ ) {
		                    remaining -= 1;
		                    if ( remaining == 0 ) {
		                            var MyImagesDir = files;
									socket.emit('GetMyImagesPath', MyImagesDir);
		                    }
		                }
		        }
		    });     
    });
});
app.listen(parseInt(port, 10));
///////////////////
// Notre application écoute sur le port choisi
console.log("FF4 Dark Eddition server running\n =>  at http://localhost:" + port + "/\n  Version 0.38a moving ever foward...");
