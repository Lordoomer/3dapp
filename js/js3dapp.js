
var Mainfocus = "empty";
window.onload = function WindowLoad(event) {
	       if (canGame()) {//for the gamepad

           var prompt = "To begin using your gamepad, connect it and press any button!";
           document.getElementById("gamepadPrompt").innerHTML = prompt;

           $(window).on("gamepadconnected", function () {
               hasGP = true;
               $("#gamepadPrompt").html("Gamepad connected!");
               console.log("connection event");
               repGP = window.setInterval(reportOnGamepad, 100);
           });

           $(window).on("gamepaddisconnected", function () {
               console.log("disconnection event");
               $("#gamepadPrompt").text(prompt);
               window.clearInterval(repGP);
           });

           //setup an interval for Chrome
           var checkGP = window.setInterval(function () {
             //  console.log('checkGP');
               if (navigator.getGamepads()[0]) {
                   if (!hasGP) $(window).trigger("gamepadconnected");
                   window.clearInterval(checkGP);
               }
           }, 500);
       } // gamepad code end here
	var socket = io.connect();
	document.getElementById('ObjectPanelButton').addEventListener("click", ShowObjectPanel);
	setTimeout(function(){
		document.getElementById('browserButton').addEventListener("click", ClickBrowse);	//the cursed iframe was to slow to loAD :p
	},1000);
	document.getElementById('FileMenuButton').addEventListener("click", ShowFileMenu);
	document.getElementById('LoadMapButton').addEventListener("click", LoadMyMap);
	document.getElementById('CreateMap').addEventListener("click", CreateNewMap);
  	document.getElementById("ImagesButton").addEventListener("click", ShowImageDiv);
  	document.getElementById("ToggleChat").addEventListener("click", ShowChatPanel);
  	document.getElementById("ToggleProperties").addEventListener("click", ShowPropertiesPanel);
	document.getElementById('ToggleGamepad').addEventListener("click", ShowGamepadPower);
	//document.getElementById("global").style.height = (takeHeight() * .97) + "px"; // Special ability, use % for height!!!
	document.getElementById("interfaceC").style.height = (takeHeight() * .94) + "px";// Special ability, use % for height!!!
	var mybuttons = document.getElementsByClassName('buttonclass1'); 
	//console.log(mybuttons);                                          
	for (var i = 0; i < mybuttons.length; i++) {                     
		var item = mybuttons[i];
		item.addEventListener("mouseover", function(){
			Hovering();})
		item.addEventListener("mouseout", function(){
			NotHovering();})    
	};
	document.getElementById("arrowUp").addEventListener("click", Zup);
	document.getElementById("arrowDown").addEventListener("click", Zdown);
	document.getElementById("SendChatButton").addEventListener("click", envoiMessage);
	document.getElementById("CreateObjectButton").addEventListener("click", create3DobjectStep1);
	document.getElementById('Ajax_Button').addEventListener("click", AjaxFunction);
	document.addEventListener('mouseup', function(){
	mouseDown = false;
	selected = null;
	});
	document.addEventListener('mousedown', function(){
			mouseDown = true;
	    	Xmouse = x; 
	    	Ymouse= y;
	    	event.preventDefault();
	    	return false; 	
	});
	/*document.addEventListener('keydown', function(){
	});*/
}
function AjaxFunction() {
				jQuery.ajax({
					  type: 'POST', // Le type de ma requete
					  url: 'http://www.atomedge.org/ajax.php', // L'url vers laquelle la requete sera envoyee
					  data: {
						message: 'Ajax test was a success', // Les donnees que l'on souhaite envoyer au serveur au format JSON et ne pas oublier la virgule à la fin!
					  }, 
					  success: function(data, textStatus, jqXHR) {
						// La reponse du serveur est contenu dans data
						// On peut faire ce qu'on veut avec ici
						alert(data);
					  },
					  error: function(jqXHR, textStatus, errorThrown) {
						// Une erreur s'est produite lors de la requete
					  }
					});
}
window.onresize = function(){
		//document.getElementById("global").style.height = (takeHeight() * .95) + "px"; // Special ability, use % for height!!!
		//document.getElementById("interfaceC").style.height = (takeHeight() * .94) + "px";// Special ability, use % for height!!!
};
var pseudo = prompt('Your nickname ?') || 'Utilisateur';
function ClickBrowse() // This function on my fake button for css technicality 
{
		$('<iframe id="MyUploadFrame2" />').appendTo("body");
		var ifrm = document.getElementById("MyUploadFrame2");
		ifrm.src = "ff4dark/html/uploadframe.html";
		setTimeout(function(){
			var iframe = document.getElementById('MyUploadFrame2');
			var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
			innerDoc.getElementById('MyFile').click();
	},500);
}
function FailFile()
{
	document.getElementById('browserButton').value = "Add more";
}
var loadedMap = "empty";
var socket = io.connect(); // On se connecte au serveur
  // On crée l'événement recupererMessages pour récupérer direcement les messages sur serveur
socket.on('recupererMessages', function (messages) {
  // messages est le tableau contenant tous les messages qui ont été écris sur le serveur
  var html = '';
	  for (var i = 0; i < messages.length; i++)
	    html += '<div><b>'+messages[i].pseudo+'</b> : ' + messages[i].message+'</div>';
	setTimeout(function(){
	  document.getElementById('tchat').innerHTML = html;
	},500);
  });
socket.on('GetMyImagesPath', function (MyImagesDir){
	    	var  ImagePathPower = "";	
		   	for (var i = 0; i < MyImagesDir.length; i++) {
	     	ImagePathPower += "<img  onclick='AssignImageToDiv(this)' class='cards'  src='ff4dark/images/" + MyImagesDir[i] + "'  title='" + MyImagesDir[i].substring(0,MyImagesDir[i].indexOf('.')) + "'/> ";
			}		
	   		document.getElementById("imagecontainer").innerHTML = ImagePathPower;  	
		  	document.getElementById('browserButton').addEventListener("click", ClickBrowse);	
    });
socket.on('GetMyImagePath', function (MyImagesDir){//Pour les images uploadées
			document.getElementById("imagecontainer").innerHTML += "<img onclick='AssignImageToDiv(this)' class='cards' src='ff4dark/images/" + MyImagesDir + "'  title='" + MyImagesDir.substring(0,MyImagesDir.indexOf('.')) + "'/> ";				
		  	document.getElementById('browserButton').addEventListener("click", ClickBrowse);    
    });
socket.on("prototype", function (Myprogress){
  		var ToStringVar =  Myprogress.toString();
  		document.getElementById("progresslabel").innerHTML =ToStringVar + "%"; 
		document.getElementById("MyUploadProgressBar").style.width = (Myprogress * 2 ) + "px";
});
socket.on("newMapFeedback", function (feedback){
	console.log(feedback);
	document.getElementById('CreateMap').addEventListener("click", CreateNewMap);
	if(feedback == "exist")
	{
		loadedMap = "empty";
		document.getElementById("LoadingMap").innerHTML = "Map name already exist!"
		document.getElementById("LoadingMap").style.color = "red";
	}
	else
	{
		loadedMap = feedback;
		document.getElementById("LoadingMap").innerHTML = "Map Loading please wait";
		document.getElementById("LoadingMap").style.color = "yellow";
		var LoadmapName = document.getElementById("NewMap").value;
		var lastMap = document.getElementById("NewMap").value;
		document.getElementById('LoadMapButton').removeEventListener("click", LoadMyMap); 
		socket.emit('LoadMap', LoadmapName, lastMap);		
	}
}); 		
socket.on("LoadMapNameFeedback", function (MapName){
	document.getElementById("CurrentMap").innerHTML = MapName;
});
socket.on("LoadMapFeedback", function (mynewMap){
	if(mynewMap == "Map don't exist")
	{
		document.getElementById("LoadingMap").innerHTML = "Map don't exist!";
		document.getElementById("LoadingMap").style.color = "red";
	}
	else
	{
		selectedobject = "empty";
		loadedMap = document.getElementById("LoadMap").value;
		document.getElementById("LoadingMap").innerHTML = "Map loaded!";
		document.getElementById("LoadingMap").style.color = "green";
		var node = document.getElementById("interfaceC");
		while (node.hasChildNodes()) {
		    node.removeChild(node.lastChild);
		}
		var AnotherNode = document.getElementById("ObjectPanel");
		while (AnotherNode.hasChildNodes()) {
		    AnotherNode.removeChild(AnotherNode.lastChild);
		}
		AnotherNode.innerHTML = "<input class='buttonclass1' class='bottomInterfaces' id='CreateObjectButton' type='button' value='Create 3D Object' /><input class='inputText' type='text' id='create3dObjectName' onmouseover='Hovering()' onmouseout='NotHovering()'  value='object_name'/><label id='ErrorCreating3DobjectLabel'></label>";
		NumberOf3Dobjects = 0;
		document.getElementById("CreateObjectButton").addEventListener("click", create3DobjectStep1);
		for (var i = 0; i < mynewMap[0].length; i++) {
			LoadingThisObject(mynewMap[0][i], mynewMap[8][i], mynewMap[7][i], mynewMap[6][i], mynewMap[4][i], mynewMap[5][i],  mynewMap[3][i], mynewMap[12][i], mynewMap[2][i], mynewMap[1][i], mynewMap[13][i], mynewMap[14][i] );

		}
	}
	document.getElementById('LoadMapButton').addEventListener("click", LoadMyMap);
});
function LoadingThisObject(MyobjectName, ObstacleVar, X_coord, y_coord, Xaxis, Yaxis, zIndex, BackgroundResizeVar, heightVar, widthVar, innertextVar, imageVar )
{
			console.log("test loading: " + MyobjectName + " x:" + X_coord + " y:"+ y_coord + " height:"+ heightVar + " width:"+ widthVar + " text:"+ innertextVar + " image:"+ imageVar);
		    TheMasterBox = document.createElement('div');
		    TheMasterBox.id = "box" + MyobjectName;
		    TheMasterBox.className = "TheMasterBoxes";
		    InterfaceContainer = document.createElement("div");
		    InterfaceContainer.className = "InterfaceContainers";
		    InterfaceContainer.id = "IC2" + MyobjectName;
	        NumberOf3Dobjects++;	
		    Object3dFace1Div = document.createElement('div');
		    idnamestring = MyobjectName;
		    Object3dFace1Div.id = idnamestring.toString();
			Object3dFace1Div.className = "newObject3dclass";
			Object3dFace1Div.style.overflow = "auto";
			Object3dFace1Div.MasterBoxe = TheMasterBox.id;
			console.log("my Obstacle value " + ObstacleVar);
			if(ObstacleVar == "0"){
				Object3dFace1Div.Obstacle = false;
			}
			else{
				Object3dFace1Div.Obstacle = true;
			}
			Object3dFace1Div.x = X_coord;
			Object3dFace1Div.y = y_coord;
			Object3dFace1Div.BackgroundResize = BackgroundResizeVar;
			if(Object3dFace1Div.BackgroundResize == false)
			{
				Object3dFace1Div.BackgroundResize = true;
				Object3dFace1Div.style.backgroundSize = "";
			}
			else
			{
				Object3dFace1Div.style.backgroundSize = "100% 100%";
				Object3dFace1Div.BackgroundResize = false;
			}	
			Object3dFace1Div.X_Axis = Xaxis;
			Object3dFace1Div.Y_Axis = Yaxis;
			Object3dFace1Div.z = zIndex;
			TheMasterBox.style.zIndex = zIndex;
			Object3dFace1Div.height = heightVar;
			Object3dFace1Div.width = widthVar;
			Object3dFace1Div.innerHTML = innertextVar; 
			TheMasterBox.appendChild(Object3dFace1Div);
	       	Object3dFaceSelectorDiv = document.createElement('input');
			Object3dFaceSelectorDiv.type = "button";
			Object3dFaceSelectorDiv.className  = "buttonclass3";
	        Object3dFaceSelectorDiv.id = MyobjectName + "_Object3dFaceSelectorDiv";
	        Object3dFaceSelectorDiv.value = MyobjectName;
	        FacesContainer = document.createElement("div");
	        FacesContainer.id =  "IC" + MyobjectName;
	    	FacesContainer.appendChild(Object3dFaceSelectorDiv);
	    	Object3dFace1Div.style.backgroundImage = imageVar;
	    	document.getElementById("ObjectPanel").appendChild(InterfaceContainer);
	    	document.getElementById("ObjectPanel").appendChild(FacesContainer); 
	    	document.getElementById("interfaceC").appendChild(TheMasterBox);
	    	InterGossant = FacesContainer.id;
	    	var CheckifExist = setInterval(function(){    //wait for the object to be appended to document object then update it's properties
	    		if(document.getElementById(MyobjectName)){
	    			clearInterval(CheckifExist);
	    			console.log("testing interval");
	    	document.getElementById("box" + MyobjectName).style.top = document.getElementById(MyobjectName).y + "px";
	    	document.getElementById("box" + MyobjectName).style.left = document.getElementById(MyobjectName).x + "px";
	    	document.getElementById(MyobjectName).style.width = document.getElementById(MyobjectName).width + "px";
	    	document.getElementById(MyobjectName).style.height = document.getElementById(MyobjectName).height + "px";
	    	document.getElementById(MyobjectName).style.zIndex = document.getElementById(MyobjectName).z;	    			
	    		}
	    	},100);		
	   		Object3dFaceSelectorDiv.addEventListener("mousedown", function ()
	   		{
	   			SelectingSomething(MyobjectName);
	   		});
	   		Object3dFace1Div.addEventListener("mousedown", function ()
	   		{
	   			SelectingSomething(MyobjectName);
	   		});
}
socket.on('recupererNouveauMessage', function (message) {
    document.getElementById('tchat').innerHTML += '<div class="line"><b>'+message.pseudo+'</b> : '+message.message+'</div>';
   	setTimeout( function(){
   		var scrollvar = document.getElementById("tchat");
 		scrollvar.scrollTop = scrollvar.scrollHeight;  		
   	},10);
  });
function AssignImageToDiv(MyImageRoute)
{
	if(document.getElementById(selectedobject).className == "newObject3dclass")
	{
		var MyImageUrl = MyImageRoute.src;
		console.log(MyImageRoute);
		MyImageUrl = MyImageUrl.substring(29,MyImageUrl.length);
		MyImageUrl = "url('ff4dark/" + MyImageUrl + "')";
		//console.log(MyImageUrl + " test");
			var functionArray =[];
			var functionstring = "14"; //On indique à l'application quelle fonction éxécuter pour tous les clients connectés. fonction 14 = ChangeImage
			functionArray.push(functionstring);//On pousse le numéro de la fonction dans l'array des paramètres à pousser vers le serveur.
			var ParameterArray = [];
			ParameterArray.push(selectedobject);// On pousse les autres paramètres requis, ici le text d'un div
			ParameterArray.push(MyImageUrl);
			functionArray.push(ParameterArray);
			functionArray.push(loadedMap);
			socket.emit('New3dappfunction', functionArray);
	}
	else
	{
		/*var MyImageUrl = MyImageRoute.src;
		console.log(MyImageRoute);
		MyImageUrl = MyImageUrl.substring(29,MyImageUrl.length);
		MyImageUrl = "url('ff4dark/" + MyImageUrl + "')";
		console.log(MyImageUrl + " test");
		document.getElementById("box" + selectedobject).style.backgroundImage = MyImageUrl;	*/
	}	
}
function AssingingImage(MyParameters){
		var MyDivHere = document.getElementById(MyParameters[0]);
		MyDivHere.style.backgroundImage = MyParameters[1];
		if(MyDivHere.BackgroundResize == true)
		{
			MyDivHere.style.backgroundSize = MyDivHere.width + "px "+ MyDivHere.height + "px";			
		}
}
function isCollide(a, b) {
    return !(

        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}
var Hoveringsomething = false;//something in the menu or interface
function Hovering(){
	Hoveringsomething = true;
}
function NotHovering(){
	Hoveringsomething = false;
	//console.log("not hovering");
}
socket.on('My3dappfunction', function (My3dappfunction) {
  	if( My3dappfunction[0] == "0" )
  	{
   		create3DobjectStep1a(My3dappfunction); 		
  	}
	if(Hoveringsomething == false){ //Careful there stuff in the menu must go OUTSIDE  this if!!!
	  	if( My3dappfunction[0] == "1" )
	  	{
	   		facerotate(My3dappfunction[1]); 		
	  	}
	  	if( My3dappfunction[0] == "2" )
	  	{
	   		facemove(My3dappfunction[1]); 		
	  	}
	  	if( My3dappfunction[0] == "3" )
	  	{
	   		HeightChange(My3dappfunction[1]); 		
	  	}
	  	if( My3dappfunction[0] == "4" )
	  	{
	   		WidthChange(My3dappfunction[1]); 		
	  	}
	  	if( My3dappfunction[0] == "5" )
	  	{
	   		ResizeChange(My3dappfunction[1]); 		
	  	}
		
	  }
  	//Les fonctions en 8 et + son activée dans properties, donc elle vont à l'exterieur du if (Hoveringsomething == false)
 	  	if( My3dappfunction[0] == "10" )
	  	{
	   		ZfaceMove(My3dappfunction[1]); 		
	  	}
	if( My3dappfunction[0] == "9" )
  	{
   		ChangingText(My3dappfunction[1][1], My3dappfunction[1][0]); 		
  	}
	if( My3dappfunction[0] == "11" )
	{
	   		ZfaceMove(My3dappfunction[1]); 		
	}
	if( My3dappfunction[0] == "12" )
	{
	   		changingObstacle(My3dappfunction[1]); 		
	}
	if( My3dappfunction[0] == "13" )
	{
	   		changingBackgroundResize(My3dappfunction[1]); 		
	}
	if( My3dappfunction[0] == "14" )
	{
	   		AssingingImage(My3dappfunction[1]); 		
	}
  });																			// MyParameters[0] = faceid 																				
  function facerotate(MyParameters) 											// MyParameters[1] =  new x-axis
  {																				// MyParameters[2] = new y-axis	
  	//	console.log(MyParameters);																																		
 		document.getElementById("box" + MyParameters[0]).style.Transform = "rotateX(" + MyParameters[1] + "deg) rotateY(" + MyParameters[2] + "deg)";
		document.getElementById("box" + MyParameters[0]).style.webkitTransform = "rotateX(" + MyParameters[1] + "deg) rotateY(" + MyParameters[2] + "deg)";
		document.getElementById("box" + MyParameters[0]).style.OTransform = "rotateX(" + MyParameters[1] + "deg) rotateY(" + MyParameters[2] + "deg)";
		document.getElementById("box" + MyParameters[0]).style.MozTransform = "rotateX(" + MyParameters[1] + "deg) rotateY(" + MyParameters[2] + "deg)";
		document.getElementById(selectedobject).X_Axis = MyParameters[1];
		document.getElementById(selectedobject).Y_Axis = MyParameters[2];
  }
  function facemove(MyParameters)   													// MyParameters[0] = faceid 
  {																						// MyParameters[1] =  new x postion
  	//	console.log(MyParameters);														// MyParameters[2] = new y postion
  		var MyObstaclesArray = document.getElementsByClassName("newObject3dclass");
  		var MyOldX = document.getElementById(MyParameters[0]).x;
  		var MyOldY = document.getElementById(MyParameters[0]).y;
		document.getElementById("box" + MyParameters[0]).style.left = MyParameters[2] + "px";																				
		document.getElementById("box" + MyParameters[0]).style.top = MyParameters[1] + "px";
		document.getElementById(MyParameters[0]).x = MyParameters[2];
		document.getElementById(MyParameters[0]).y = MyParameters[1];
  		//console.log("my old x: " + MyOldX + " my new X: " + MyParameters[2]);
  		for (var i = 0; i < MyObstaclesArray.length; i++) {
  			if(MyObstaclesArray[i].Obstacle == true)
  			{
				console.log("Collision " + isCollide(document.getElementById(selectedobject), MyObstaclesArray[i])); 
				if(isCollide(document.getElementById(selectedobject), MyObstaclesArray[i]) == true)
				{
					document.getElementById("box" + MyParameters[0]).style.left = MyOldX + "px";																				
					document.getElementById("box" + MyParameters[0]).style.top = MyOldY + "px";
					document.getElementById(MyParameters[0]).x = MyOldX;
					document.getElementById(MyParameters[0]).y = MyOldY;				
				}
  			}	
  		};
  }
function ChangeZ()
{
	if(!isNaN(document.getElementById("ZindexButton").value) && document.getElementById("ZindexButton").value >= 0 )
	{
		var functionArray =[];
		functionArray.push("11");//On pousse le numéro de la fonction dans l'array des paramètres à pousser vers le serveur.
		var ParameterArray = [];
		ParameterArray.push(selectedobject);// On pousse le nom de l'objet cible de la fonction dans l'array des paramètres à pousser vers le serveur.
		var myNewZindexHere = parseInt(document.getElementById("ZindexButton").value);
		console.log("zindexbuttonvalue: " + myNewZindexHere);
		ParameterArray.push(myNewZindexHere);// On pousse les autres paramètres requis, ici la nouvelle position X de la face(div) deplacée.
		functionArray.push(ParameterArray); // On pousse l'array des paramètres dans l'array de la fonction
		socket.emit('New3dappfunction', functionArray);	//On envoie l'array contenant le minimum nécéssaire de données au serveur 	

	}
	else
	{
		document.getElementById("ZindexButton").value = document.getElementById(selectedobject).z;			
	}	
}
function Zup()
{
	document.getElementById("ZindexButton").value = parseFloat(document.getElementById("ZindexButton").value) + 1;
	if(!isNaN(document.getElementById("ZindexButton").value) && document.getElementById("ZindexButton").value >= 0 )
	{
		var functionArray =[];
		functionArray.push("11");//On pousse le numéro de la fonction dans l'array des paramètres à pousser vers le serveur.
		var ParameterArray = [];
		ParameterArray.push(selectedobject);// On pousse le nom de l'objet cible de la fonction dans l'array des paramètres à pousser vers le serveur.
		var myNewZindexHere = parseInt(document.getElementById("ZindexButton").value);
		console.log("zindexbuttonvalue: " + myNewZindexHere);
		ParameterArray.push(myNewZindexHere);// On pousse les autres paramètres requis, ici la nouvelle position X de la face(div) deplacée.
		functionArray.push(ParameterArray); // On pousse l'array des paramètres dans l'array de la fonction
		functionArray.push(loadedMap);
		socket.emit('New3dappfunction', functionArray);	//On envoie l'array contenant le minimum nécéssaire de données au serveur 	

	}
	else
	{
		document.getElementById("ZindexButton").value = document.getElementById(selectedobject).z;			
	}	
}
function Zdown()
{
	document.getElementById("ZindexButton").value -= 1;
	if(!isNaN(document.getElementById("ZindexButton").value) && document.getElementById("ZindexButton").value >= 0 )
	{ 
		var functionArray =[];
		functionArray.push("11");//On pousse le numéro de la fonction dans l'array des paramètres à pousser vers le serveur.
		var ParameterArray = [];
		ParameterArray.push(selectedobject);// On pousse le nom de l'objet cible de la fonction dans l'array des paramètres à pousser vers le serveur.
		var myNewZindexHere = parseInt(document.getElementById("ZindexButton").value);
		console.log("zindexbuttonvalue: " + myNewZindexHere);
		ParameterArray.push(myNewZindexHere);// On pousse les autres paramètres requis, ici la nouvelle position Z de la face(div) deplacée.
		functionArray.push(ParameterArray); // On pousse l'array des paramètres dans l'array de la fonction
		functionArray.push(loadedMap);
		socket.emit('New3dappfunction', functionArray);	//On envoie l'array contenant le minimum nécéssaire de données au serveur 	

	}
	else
	{
		document.getElementById("ZindexButton").value = document.getElementById(selectedobject).z;			
	}	
}
function ZfaceMove(MyParameters)   													
{				
	//console.log("test 3 : " + MyParameters[1]);																		
		if(MyParameters[1] < 1)
		{
			document.getElementById(selectedobject).z = 0;
			document.getElementById(document.getElementById(MyParameters[0]).MasterBoxe).style.zIndex = 0;	
			document.getElementById("ZindexButton").value = 0;		
		}
		else
		{
			document.getElementById("ZindexButton").value = MyParameters[1];
			document.getElementById(selectedobject).z = MyParameters[1];
			document.getElementById(document.getElementById(MyParameters[0]).MasterBoxe).style.zIndex = MyParameters[1];			
		}	
}
  function HeightChange(MyParameters)   												// MyParameters[0] = faceid 
  {																						// MyParameters[2] = new y postion
		document.getElementById(MyParameters[0]).style.height = MyParameters[1] + "px";	// MyParameters[1] =  new x postion	
		document.getElementById(MyParameters[0]).height = MyParameters[1];																		
		if(document.getElementById(MyParameters[0]).BackgroundResize == true)
		{
			document.getElementById(MyParameters[0]).style.backgroundSize = document.getElementById(MyParameters[0]).width + "px "+ document.getElementById(MyParameters[0]).height + "px";	
		}	
  }
  function WidthChange(MyParameters)   														// MyParameters[0] = faceid 
  {																							// MyParameters[1] =  new x postion											
		document.getElementById(MyParameters[0]).style.width = MyParameters[1] + "px";		// MyParameters[2] = new y postion	
		document.getElementById(MyParameters[0]).width = MyParameters[1];																			
		if(document.getElementById(MyParameters[0]).BackgroundResize == true)
		{
			document.getElementById(MyParameters[0]).style.backgroundSize = document.getElementById(MyParameters[0]).width + "px "+ document.getElementById(MyParameters[0]).height + "px";	
		}		
  }
  function ResizeChange(MyParameters)   												// MyParameters[0] = faceid 
  {																						// MyParameters[1] =  new x postion												
		document.getElementById(MyParameters[0]).style.width = MyParameters[2] + "px";	// MyParameters[2] = new y postion	
		document.getElementById(MyParameters[0]).width = MyParameters[2];																		
		document.getElementById(MyParameters[0]).height = MyParameters[1];	
		document.getElementById(MyParameters[0]).style.height = MyParameters[1] + "px";																				
		if(document.getElementById(MyParameters[0]).BackgroundResize == true)
		{
			document.getElementById(MyParameters[0]).style.backgroundSize = document.getElementById(MyParameters[0]).width + "px "+ document.getElementById(MyParameters[0]).height + "px";	
		}			
  }     
  function envoiMessage()
  {
	 var checkout = document.getElementById("chatbox").value;
		if ( checkout != "")
		{
		  var message = document.getElementById('chatbox').value;
		  // On appelle l'événement se trouvant sur le serveur pour qu'il enregistre le message et qu'il l'envoie à tous les autres clients connectés (sauf nous)
		  socket.emit('nouveauMessage', { 'pseudo' : pseudo, 'message' : message });
		    // On affiche directement notre message dans notre page
		    document.getElementById('tchat').innerHTML += '<div class="line"><b>'+pseudo+'</b> : '+message+'</div>';
		    // On vide le formulaire
		    document.getElementById('chatbox').value = '';
		    setTimeout( function(){
		   		var scrollvar = document.getElementById("tchat");
		 		scrollvar.scrollTop = scrollvar.scrollHeight;  		
		   	},10);	
		}
    }
	var ie = (function(){
	    var undef,rv = -1; // Return value assumes failure.
	    var ua = window.navigator.userAgent;
	    var msie = ua.indexOf('MSIE ');
	    var trident = ua.indexOf('Trident/');
	    if (msie > 0) {
	        // IE 10 or older => return version number
	        rv = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
	    } else if (trident > 0) {
	        // IE 11 (or newer) => return version number
	        var rvNum = ua.indexOf('rv:');
	        rv = parseInt(ua.substring(rvNum + 3, ua.indexOf('.', rvNum)), 10);
	    }
	    return ((rv > -1) ? rv : undef);
	}());
	if(ie)
	{
		alert("Microsoft is sorry that Internet Explorer version : " + ie  + " is currently not compatible with this program. Please download one of the following browser:Google Chrome,  Firefox, Safari, Opera, or Torch. Thank you for your comprehension ;)");
	}  // The above code detect fail users who play in microsoft's sandbox
	var selectedobject = "empty";
	var NumberOf3Dobjects = 0;
    var mouseDown = false;
    var Hstate = "keyisup";
    var Lstate = "keyisup";
    var Rstate = "keyisup";
    var Zstate = "keyisup";     
    var altcurrentstate = "keyisup";
    var shiftcurrentstate = "keyisup";
    var ctrlcurrentstate = "keyisup";
	//var selected = null;
	var HoveringFace = "None";
    var mouseupVar, caller, selectedFace, x, y, Xmouse, Ymouse, ctrlcurrentstate, x_elem, y_elem;
function CreateNewMap()
{
	console.log("nouvelle map!");
	document.getElementById('CreateMap').removeEventListener("click", CreateNewMap);
	var mapName = document.getElementById("NewMap").value;
	var lastMap = document.getElementById("CurrentMap").innerHTML; 
	if(lastMap != mapName)
	{
		socket.emit('NewMap', mapName, pseudo, lastMap);			
	}
}
function LoadMyMap()
{
		document.getElementById("LoadingMap").innerHTML = "Map Loading please wait";
		document.getElementById("LoadingMap").style.color = "yellow";
	var currentmap = document.getElementById("CurrentMap").innerHTML;
	var LoadmapName = document.getElementById("LoadMap").value;
	//console.log(currentmap + " " + LoadmapName);
	if (currentmap == LoadmapName)
	{		
		console.log("here!");
		document.getElementById('LoadingMap').innerHTML = "Map already loaded!";
		document.getElementById('LoadingMap').style.color = "red";
	}
	else
	{
		document.getElementById('LoadMapButton').removeEventListener("click", LoadMyMap);
		var lastMap = document.getElementById("CurrentMap").innerHTML; 
		if(lastMap != LoadmapName)
		{
			socket.emit('LoadMap', LoadmapName, lastMap);		
		}
	}
	
}
function processKeyDown(event){
			if( event.keyCode == 18 )
			{
				if (selectedobject != "empty")
				{ 				
					if(ie)
					{
						event.initEvent("keydown", true, true);
					}
					event.preventDefault();
			    	altcurrentstate = "keyisdown";
			    	return false;
			  	}	
			}
			if( event.keyCode == 72 ) 
			{
				if (selectedobject != "empty")
				{ 
			    	Hstate = "keyisdown";
			    	return false;
			    }		
			}
			if( event.keyCode == 82 )
			{
				if (selectedobject != "empty")
				{ 
			    	Rstate = "keyisdown";
			    	return false;
				}	
			}
			if( event.keyCode == 90 )
			{
				if (selectedobject != "empty")
				{ 
			    	Zstate = "keyisdown";
			    	return false;
				}	
			}
			if( event.keyCode == 76 )
			{
				if (selectedobject != "empty")
				{ 
			    	Lstate = "keyisdown";
			    	return false;
				}	
			}
			if( event.keyCode == 68 && altcurrentstate == "keyisdown"  )
			{
				if (selectedobject != "empty" && altcurrentstate == "keyisdown")
				{
	   				document.getElementById(selectedobject).style.border = "#ffd700 0px solid";
		    		selectedobject = "empty";
		    		altcurrentstate = "keyisup";

		    	}
			}
			if( event.keyCode == 37 && altcurrentstate == "keyisup"  )
			{
				if (selectedobject != "empty")
				{ 
					var mySelection = document.getElementById(selectedobject);
					if(mySelection.className == "Object3dSelectorClass")
					{
						var o = mySelection.YCoordinaterz;
						var m = mySelection.XCoordinaterz;
						o -= 1;
						var functionArray =[];
						var functionstring = "6";//On indique à l'application quelle fonction éxécuter pour tous les clients connectés. fonction 2 = facemove
						functionArray.push(functionstring);
						var ParameterArray = [];				
						ParameterArray.push(mySelection.MasterBoxe);// On pousse le nom de l'objet cible de la fonction dans l'array des paramètres à pousser vers le serveur.
						ParameterArray.push(m);// On pousse les autres paramètres requis, ici la nouvelle position Y de la face(div) deplacée.
						ParameterArray.push(o);// On pousse les autres paramètres requis, ici la nouvelle position X de la face(div) deplacée.
						ParameterArray.push(mySelection.id);
						functionArray.push(ParameterArray); // On pousse l'array des paramètres dans l'array de la fonction
						functionArray.push(loadedMap);
						socket.emit('New3dappfunction', functionArray);		

					}
					else
					{
						var m = document.getElementById(selectedobject).y;
						var o = document.getElementById(selectedobject).x;
						o -= 1;
						var functionArray =[];
						var functionstring = "2";//On indique à l'application quelle fonction éxécuter pour tous les clients connectés. fonction 2 = facemove
						functionArray.push(functionstring);
						var ParameterArray = [];
						ParameterArray.push(selectedobject);// On pousse le nom de l'objet cible de la fonction dans l'array des paramètres à pousser vers le serveur.
						ParameterArray.push(m);// On pousse les autres paramètres requis, ici la nouvelle position Y de la face(div) deplacée.
						ParameterArray.push(o);// On pousse les autres paramètres requis, ici la nouvelle position X de la face(div) deplacée.
						functionArray.push(ParameterArray); // On pousse l'array des paramètres dans l'array de la fonction
						functionArray.push(loadedMap);
						socket.emit('New3dappfunction', functionArray);		
					}	
	//On envoie l'array contenant le minimum nécéssaire de données au serveur 
				}
		    		event.preventDefault();
			}		
			if( event.keyCode == 38 && altcurrentstate == "keyisup"  )
			{
					var mySelection = document.getElementById(selectedobject);
					if(mySelection.className == "Object3dSelectorClass")
					{
						var o = mySelection.YCoordinaterz;
						var m = mySelection.XCoordinaterz;
						m -= 1;
						var functionArray =[];
						var functionstring = "6";//On indique à l'application quelle fonction éxécuter pour tous les clients connectés. fonction 2 = facemove
						functionArray.push(functionstring);
						var ParameterArray = [];				
						ParameterArray.push(mySelection.MasterBoxe);// On pousse le nom de l'objet cible de la fonction dans l'array des paramètres à pousser vers le serveur.
						ParameterArray.push(m);// On pousse les autres paramètres requis, ici la nouvelle position Y de la face(div) deplacée.
						ParameterArray.push(o);// On pousse les autres paramètres requis, ici la nouvelle position X de la face(div) deplacée.
						ParameterArray.push(mySelection.id);
						functionArray.push(ParameterArray); // On pousse l'array des paramètres dans l'array de la fonction
						functionArray.push(loadedMap);
						socket.emit('New3dappfunction', functionArray);		

					}
					else
					{
						if (selectedobject != "empty")
						{ 
								var m = document.getElementById(selectedobject).y;
								var o = document.getElementById(selectedobject).x;
								m -= 1;
								var functionArray =[];
								var functionstring = "2";//On indique à l'application quelle fonction éxécuter pour tous les clients connectés. fonction 2 = facemove
								functionArray.push(functionstring);
								var ParameterArray = [];
								ParameterArray.push(selectedobject);// On pousse le nom de l'objet cible de la fonction dans l'array des paramètres à pousser vers le serveur.
								ParameterArray.push(m);// On pousse les autres paramètres requis, ici la nouvelle position Y de la face(div) deplacée.
								ParameterArray.push(o);// On pousse les autres paramètres requis, ici la nouvelle position X de la face(div) deplacée.
								functionArray.push(ParameterArray); // On pousse l'array des paramètres dans l'array de la fonction
								functionArray.push(loadedMap);
								socket.emit('New3dappfunction', functionArray);	//On envoie l'array contenant le minimum nécéssaire de données au serveur 
					    		event.preventDefault();			
						}
					}	
			}
			if( event.keyCode == "39" && altcurrentstate == "keyisup"  )
			{
					var mySelection = document.getElementById(selectedobject);
					if(mySelection.className == "Object3dSelectorClass")
					{
						var o = mySelection.YCoordinaterz;
						var m = mySelection.XCoordinaterz;
						o += 1;
						var functionArray =[];
						var functionstring = "6";//On indique à l'application quelle fonction éxécuter pour tous les clients connectés. fonction 2 = facemove
						functionArray.push(functionstring);
						var ParameterArray = [];				
						ParameterArray.push(mySelection.MasterBoxe);// On pousse le nom de l'objet cible de la fonction dans l'array des paramètres à pousser vers le serveur.
						ParameterArray.push(m);// On pousse les autres paramètres requis, ici la nouvelle position Y de la face(div) deplacée.
						ParameterArray.push(o);// On pousse les autres paramètres requis, ici la nouvelle position X de la face(div) deplacée.
						ParameterArray.push(mySelection.id);
						functionArray.push(ParameterArray); // On pousse l'array des paramètres dans l'array de la fonction
						functionArray.push(loadedMap);
						socket.emit('New3dappfunction', functionArray);		

					}
					else
					{
						if (selectedobject != "empty")
						{ 
								var m = document.getElementById(selectedobject).y;
								var o = document.getElementById(selectedobject).x;
								o += 1;
								var functionArray =[];
								var functionstring = "2";//On indique à l'application quelle fonction éxécuter pour tous les clients connectés. fonction 2 = facemove
								functionArray.push(functionstring);
								var ParameterArray = [];
								ParameterArray.push(selectedobject);// On pousse le nom de l'objet cible de la fonction dans l'array des paramètres à pousser vers le serveur.
								ParameterArray.push(m);// On pousse les autres paramètres requis, ici la nouvelle position Y de la face(div) deplacée.
								ParameterArray.push(o);// On pousse les autres paramètres requis, ici la nouvelle position X de la face(div) deplacée.
								functionArray.push(ParameterArray); // On pousse l'array des paramètres dans l'array de la fonction
								functionArray.push(loadedMap);
								socket.emit('New3dappfunction', functionArray);	//On envoie l'array contenant le minimum nécéssaire de données au serveur 
						    	event.preventDefault();		
						}
					}

			}
			if( event.keyCode == 40 && altcurrentstate == "keyisup"  )
			{
					var mySelection = document.getElementById(selectedobject);
					if(mySelection.className == "Object3dSelectorClass")
					{
						var o = mySelection.YCoordinaterz;
						var m = mySelection.XCoordinaterz;
						m += 1;
						var functionArray =[];
						var functionstring = "6";//On indique à l'application quelle fonction éxécuter pour tous les clients connectés. fonction 2 = facemove
						functionArray.push(functionstring);
						var ParameterArray = [];				
						ParameterArray.push(mySelection.MasterBoxe);// On pousse le nom de l'objet cible de la fonction dans l'array des paramètres à pousser vers le serveur.
						ParameterArray.push(m);// On pousse les autres paramètres requis, ici la nouvelle position Y de la face(div) deplacée.
						ParameterArray.push(o);// On pousse les autres paramètres requis, ici la nouvelle position X de la face(div) deplacée.
						ParameterArray.push(mySelection.id);
						functionArray.push(ParameterArray); // On pousse l'array des paramètres dans l'array de la fonction
						functionArray.push(loadedMap);
						socket.emit('New3dappfunction', functionArray);		
					}
					else
					{
						if (selectedobject != "empty")
						{ 
								var m = document.getElementById(selectedobject).y;
								var o = document.getElementById(selectedobject).x;
								m += 1;
								var functionArray =[];
								var functionstring = "2";//On indique à l'application quelle fonction éxécuter pour tous les clients connectés. fonction 2 = facemove
								functionArray.push(functionstring);
								var ParameterArray = [];
								ParameterArray.push(selectedobject);// On pousse le nom de l'objet cible de la fonction dans l'array des paramètres à pousser vers le serveur.
								ParameterArray.push(m);// On pousse les autres paramètres requis, ici la nouvelle position Y de la face(div) deplacée.
								ParameterArray.push(o);// On pousse les autres paramètres requis, ici la nouvelle position X de la face(div) deplacée.
								functionArray.push(ParameterArray); // On pousse l'array des paramètres dans l'array de la fonction
								functionArray.push(loadedMap);
								socket.emit('New3dappfunction', functionArray);	//On envoie l'array contenant le minimum nécéssaire de données au serveur 
				 			   	event.preventDefault();//Ca fuck le chat!!! À réparer...					
						}
					}	
			}
		if( event.keyCode == 13 )
		{
			if(Mainfocus == "tchat")
			{
				envoiMessage();
			}
			else if(Mainfocus == "create3dObjectName")
			{
				create3DobjectStep1();
			}
		}
}
	function processKeyPress(event)
	{
	}
	function processKeyUp(event)
	{
		if( event.keyCode == 18 )
		{
			//console.log("alt is up");
	    	altcurrentstate = "keyisup";		
		}
		if( event.keyCode == 72 )
		{
			//console.log("alt is up");
	    	Hstate = "keyisup";		
		}
		if( event.keyCode == 76 )
		{
			//console.log("alt is up");
	    	Lstate = "keyisup";		
		}
		if( event.keyCode == 82 )
		{
			//console.log("alt is up");
	    	Rstate = "keyisup";		
		}	
		if( event.keyCode == 90 )
		{
			//console.log("alt is up");
	    	Zstate = "keyisup";		
		}	
	}
	document.onmousemove = function(evt)
	{
		var m, n, o, X_difference, Y_difference; 
	    if (selectedobject != "empty")
	    {
	    	x = evt.pageX,
	  		y = evt.pageY;
	  		var SomeNewNamesomething = document.getElementById(selectedobject);
	    	if(SomeNewNamesomething.className == "Object3dSelectorClass")
	    	{
		    	if (altcurrentstate == "keyisdown" && mouseDown == true )
		    	{
 						var MySelection = document.getElementById(selectedobject); // m = x-axis     o = y-axis 
						m = MySelection.Xaxis;
						o = MySelection.Yaxis;
						X_difference = Xmouse - x; 
						Y_difference = Ymouse - y;						
						o += X_difference;
						m -= Y_difference;
						var functionArray =[];
						Xmouse = x;
						Ymouse = y;
						var functionstring = "7"; //On indique à l'application quelle fonction éxécuter pour tous les clients connectés. fonction 1 = facerotate
						functionArray.push(functionstring);//On pousse le numéro de la fonction dans l'array des paramètres à pousser vers le serveur.
						var ParameterArray = [];
						ParameterArray.push(SomeNewNamesomething.MasterBoxe);// On pousse le nom de l'objet cible de la fonction dans l'array des paramètres à pousser vers le serveur.
						ParameterArray.push(m);// On pousse les autres paramètres requis, ici la nouvelle position Y de la face(div) deplacée.
						ParameterArray.push(o);
						functionArray.push(ParameterArray);
						ParameterArray.push(SomeNewNamesomething.id);
						functionArray.push(loadedMap);
						socket.emit('New3dappfunction', functionArray);	
		    	}
		    	else if (mouseDown == true)
		    	{
 						var MySelection = document.getElementById(selectedobject); // m = x-axis     o = y-axis 
						m = MySelection.XCoordinaterz;
						o = MySelection.YCoordinaterz;
						X_difference = Xmouse - x;
						Y_difference = Ymouse - y;						
						o -= X_difference;
						m -= Y_difference;
						Xmouse = x;
						Ymouse = y;
						var functionArray =[];
						var functionstring = "6";//On indique à l'application quelle fonction éxécuter pour tous les clients connectés. fonction 2 = facemove
						functionArray.push(functionstring);//On pousse le numéro de la fonction dans l'array des paramètres à pousser vers le serveur.
						var ParameterArray = [];
						ParameterArray.push(MySelection.MasterBoxe);// On pousse le nom de l'objet cible de la fonction dans l'array des paramètres à pousser vers le serveur.
						ParameterArray.push(m);// On pousse les autres paramètres requis, ici la nouvelle position Y de la face(div) deplacée.
						ParameterArray.push(o);// On pousse les autres paramètres requis, ici la nouvelle position X de la face(div) deplacée.
						functionArray.push(ParameterArray); // On pousse l'array des paramètres dans l'array de la fonction
						ParameterArray.push(MySelection.id);
						functionArray.push(loadedMap);
						socket.emit('New3dappfunction', functionArray);	//On envoie l'array contenant le minimum nécéssaire de données au serveur 
		    	}
	    	}	
	    	else
	    	{
	    		if (altcurrentstate == "keyisdown" && mouseDown == true )
		    	{
						var m = document.getElementById(selectedobject).X_Axis;
						var o = document.getElementById(selectedobject).Y_Axis;
						X_difference = Xmouse - x; 
						Y_difference = Ymouse - y;						
						o -= X_difference;
						m += Y_difference;
						var functionArray =[];
						Xmouse = x;
						Ymouse = y;
						var functionstring = "1"; //On indique à l'application quelle fonction éxécuter pour tous les clients connectés. fonction 1 = facerotate
						functionArray.push(functionstring);//On pousse le numéro de la fonction dans l'array des paramètres à pousser vers le serveur.
						var ParameterArray = [];
						ParameterArray.push(selectedobject);// On pousse le nom de l'objet cible de la fonction dans l'array des paramètres à pousser vers le serveur.
						ParameterArray.push(m);// On pousse les autres paramètres requis, ici la nouvelle position Y de la face(div) deplacée.
						ParameterArray.push(o);
						functionArray.push(ParameterArray);
						functionArray.push(loadedMap);
						socket.emit('New3dappfunction', functionArray);	
		    	}
		    	else if (Hstate == "keyisdown" && mouseDown == true )
		    	{
						var m = document.getElementById(selectedobject).height;
						Y_difference = Ymouse - y;						
						m -= Y_difference;
						var functionArray =[];
						Xmouse = x;
						Ymouse = y;
						var functionstring = "3"; //On indique à l'application quelle fonction éxécuter pour tous les clients connectés. fonction 1 = facerotate
						functionArray.push(functionstring);//On pousse le numéro de la fonction dans l'array des paramètres à pousser vers le serveur.
						var ParameterArray = [];
						ParameterArray.push(selectedobject);// On pousse le nom de l'objet cible de la fonction dans l'array des paramètres à pousser vers le serveur.
						ParameterArray.push(m);// On pousse les autres paramètres requis, ici la nouvelle position Y de la face(div) deplacée.
						functionArray.push(ParameterArray);
						functionArray.push(loadedMap);
						socket.emit('New3dappfunction', functionArray);	
		    	}
		    	else if (Rstate == "keyisdown" && mouseDown == true )
		    	{
						var m = document.getElementById(selectedobject).height;
						var o = document.getElementById(selectedobject).width;
						X_difference = Xmouse - x; 
						Y_difference = Ymouse - y;						
						o -= X_difference;
						m -= Y_difference;
						var functionArray =[];
						Xmouse = x;
						Ymouse = y;
						var functionstring = "5"; //On indique à l'application quelle fonction éxécuter pour tous les clients connectés. fonction 1 = facerotate
						functionArray.push(functionstring);//On pousse le numéro de la fonction dans l'array des paramètres à pousser vers le serveur.
						var ParameterArray = [];
						ParameterArray.push(selectedobject);// On pousse le nom de l'objet cible de la fonction dans l'array des paramètres à pousser vers le serveur.
						ParameterArray.push(m);// On pousse les autres paramètres requis, ici la nouvelle position X de la face(div) deplacée.
						ParameterArray.push(o);// On pousse les autres paramètres requis, ici la nouvelle position Y de la face(div) deplacée.
						functionArray.push(ParameterArray);
						functionArray.push(loadedMap);
						socket.emit('New3dappfunction', functionArray);	
		    	}
		    	else if (Lstate == "keyisdown" && mouseDown == true )
		    	{
						var m = document.getElementById(selectedobject).width;
						X_difference = Xmouse - x; 						
						m -= X_difference;
						var functionArray =[];
						Xmouse = x;
						Ymouse = y;
						var functionstring = "4"; //On indique à l'application quelle fonction éxécuter pour tous les clients connectés. fonction 1 = facerotate
						functionArray.push(functionstring);//On pousse le numéro de la fonction dans l'array des paramètres à pousser vers le serveur.
						var ParameterArray = [];
						ParameterArray.push(selectedobject);// On pousse le nom de l'objet cible de la fonction dans l'array des paramètres à pousser vers le serveur.
						ParameterArray.push(m);// On pousse les autres paramètres requis, ici la nouvelle position Y de la face(div) deplacée.
						functionArray.push(ParameterArray);
						functionArray.push(loadedMap);
						socket.emit('New3dappfunction', functionArray);	
		    	}
		    	else if (Zstate == "keyisdown" && mouseDown == true)
		    	{
						o = document.getElementById(selectedobject).z;
						Y_difference = Ymouse - y;					
						o += Y_difference;
						Ymouse = y;
						var functionArray =[];
						var functionstring = "10";//On indique à l'application quelle fonction éxécuter pour tous les clients connectés. fonction 10 = Zfacemove
						functionArray.push(functionstring);//On pousse le numéro de la fonction dans l'array des paramètres à pousser vers le serveur.
						var ParameterArray = [];
						ParameterArray.push(selectedobject);// On pousse le nom de l'objet cible de la fonction dans l'array des paramètres à pousser vers le serveur.
						ParameterArray.push(o);// On pousse les autres paramètres requis, ici la nouvelle position Z index de la face(div) deplacée.
						functionArray.push(ParameterArray); // On pousse l'array des paramètres dans l'array de la fonction
						functionArray.push(loadedMap);
						socket.emit('New3dappfunction', functionArray);	//On envoie l'array contenant le minimum nécéssaire de données au serveur 		    		
		    	}
		    	else if (mouseDown == true)
		    	{
						var m = document.getElementById(selectedobject).y;
						var o = document.getElementById(selectedobject).x;
						X_difference = Xmouse - x;
						Y_difference = Ymouse - y;	
						//console.log("Object coordinates X : " + o  + " Y : " + m );					
						o -= X_difference;
						m -= Y_difference;
						Xmouse = x;
						Ymouse = y;
						var functionArray =[];
						var functionstring = "2";//On indique à l'application quelle fonction éxécuter pour tous les clients connectés. fonction 2 = facemove
						functionArray.push(functionstring);//On pousse le numéro de la fonction dans l'array des paramètres à pousser vers le serveur.
						var ParameterArray = [];
						ParameterArray.push(selectedobject);// On pousse le nom de l'objet cible de la fonction dans l'array des paramètres à pousser vers le serveur.
						ParameterArray.push(m);// On pousse les autres paramètres requis, ici la nouvelle position Y de la face(div) deplacée.
						ParameterArray.push(o);// On pousse les autres paramètres requis, ici la nouvelle position X de la face(div) deplacée.
						functionArray.push(ParameterArray); // On pousse l'array des paramètres dans l'array de la fonction
						functionArray.push(loadedMap);
						socket.emit('New3dappfunction', functionArray);	//On envoie l'array contenant le minimum nécéssaire de données au serveur 
		    	}	
	    	}


	    }
	}	 	 
	function create3DobjectStep1(){
		if(loadedMap != "empty")
		{
			var New3DobjectName = document.getElementById("create3dObjectName").value;
			var functionstring = "0";
			if (document.getElementById(New3DobjectName))// Also need to check if it begin with a number because id cannot begin with a number...search me why ?
			{
					document.getElementById("ErrorCreating3DobjectLabel").innerHTML = "Name already exist, choose another one!";
					document.getElementById("ErrorCreating3DobjectLabel").style.color = "red";
					setTimeout(function(){
						document.getElementById("ErrorCreating3DobjectLabel").innerHTML = "";	
					document.getElementById("ErrorCreating3DobjectLabel").style.color = "#ac0000";					
					},7000);		
			}
			else
			{
							if (document.getElementById("create3dObjectName").value != "" )
				{
					document.getElementById("ErrorCreating3DobjectLabel").innerHTML = "Object " + New3DobjectName + " created.";
					document.getElementById("ErrorCreating3DobjectLabel").style.color = "#00aa00";	
					setTimeout(function(){
					document.getElementById("ErrorCreating3DobjectLabel").innerHTML = "";					
					},7000);			
					var functionArray = [];
					functionArray.push(functionstring);
					functionArray.push(New3DobjectName);
					functionArray.push(loadedMap);
					functionArray.push(pseudo);
					socket.emit('New3dappfunction', functionArray);	
				}
				else
				{ 
					document.getElementById("ErrorCreating3DobjectLabel").innerHTML = "Please enter a name.";
					document.getElementById("ErrorCreating3DobjectLabel").style.color = "red";
					setTimeout(function(){
						document.getElementById("ErrorCreating3DobjectLabel").innerHTML = "";	
					document.getElementById("ErrorCreating3DobjectLabel").style.color = "#ac0000";					
					},7000);	
				}	
			}		
		}
		else
		{
			document.getElementById("ErrorCreating3DobjectLabel").innerHTML = "Create or Load a map first!";					
		}
	
	}
	function create3DobjectStep1a(MyNewObjectNameHere){
		var New3DobjectName = MyNewObjectNameHere[1];
		var ObjectOwner = MyNewObjectNameHere[2];	
			if (document.getElementById("create3dObjectName").value != "" )
			{
				document.getElementById("ErrorCreating3DobjectLabel").innerHTML = "Object " + New3DobjectName + " created by " + ObjectOwner + ".";
				document.getElementById("ErrorCreating3DobjectLabel").style.color = "#00aa00";	
				setTimeout(function(){
					document.getElementById("ErrorCreating3DobjectLabel").innerHTML = "";					
				},7000);			 
				Create3DobjectStep2(New3DobjectName, ObjectOwner, "face");
			}
			else
			{ 
				document.getElementById("ErrorCreating3DobjectLabel").innerHTML = "Please enter a name.";
				document.getElementById("ErrorCreating3DobjectLabel").style.color = "red";
				setTimeout(function(){
					document.getElementById("ErrorCreating3DobjectLabel").innerHTML = "";					
				},7000);	
			}
	}
var Create3DobjectStep2 = function (New3DobjectName, ObjectOwnerName, objectype) // constructor function
{
		New3DobjectName = New3DobjectName;
	    var TheMasterBox = document.createElement('div');
	    TheMasterBox.id = "box" + New3DobjectName;
	    TheMasterBox.className = "TheMasterBoxes";
	    TheMasterBox.style.backgroundImage = "url('/images/red_dot.jpg')";
	    var InterfaceContainer = document.createElement("div");
	    InterfaceContainer.className = "InterfaceContainers";
	    InterfaceContainer.id = "IC2" + New3DobjectName;
        NumberOf3Dobjects++;	
	    var Object3dFace1Div = document.createElement('div');
	    var idnamestring = New3DobjectName;
	    Object3dFace1Div.id = idnamestring.toString();
		Object3dFace1Div.className = "newObject3dclass";
		Object3dFace1Div.style.overflow = "auto";
		Object3dFace1Div.MasterBoxe = TheMasterBox.id;
		Object3dFace1Div.Obstacle = false;
		Object3dFace1Div.x = 17;
		Object3dFace1Div.y = 15;
		Object3dFace1Div.BackgroundResize = false;
		Object3dFace1Div.X_Axis = 0;
		Object3dFace1Div.Y_Axis = 0;
		Object3dFace1Div.z = 0;
		Object3dFace1Div.height = 100;
		Object3dFace1Div.width = 100;
		Object3dFace1Div.parent = "InterfaceC";
		TheMasterBox.appendChild(Object3dFace1Div);
       	var Object3dFaceSelectorDiv = document.createElement('input');
		Object3dFaceSelectorDiv.type = "button";
		Object3dFaceSelectorDiv.className  = "buttonclass3";
        Object3dFaceSelectorDiv.id = New3DobjectName + "_Object3dFaceSelectorDiv";
		Object3dFaceSelectorDiv.title  = "Select this object";	        
        Object3dFaceSelectorDiv.value = New3DobjectName;
       	var Object3dFuse = document.createElement('input');
		Object3dFuse.type = "button";
		Object3dFuse.className  = "buttonclass4";
		Object3dFuse.title  = "Move selected object into this one";		
        Object3dFuse.id = New3DobjectName + "_FuseButton";
        Object3dFuse.value = "move into";
        var FacesContainer = document.createElement("div");
        FacesContainer.id =  "IC" + New3DobjectName;
    	FacesContainer.appendChild(Object3dFaceSelectorDiv);
    	FacesContainer.appendChild(Object3dFuse);
    	InterfaceContainer.appendChild(FacesContainer);
    	document.getElementById("ObjectPanel").appendChild(InterfaceContainer);
    	document.getElementById("interfaceC").appendChild(TheMasterBox);
    	var InterGossant = FacesContainer.id;
   		Object3dFaceSelectorDiv.addEventListener("mousedown", function ()
   		{
   			SelectingSomething(New3DobjectName);
   		});
   		Object3dFace1Div.addEventListener("mousedown", function ()
   		{
   			SelectingSomething(New3DobjectName);
   		});
   		Object3dFuse.addEventListener("mousedown", function ()
   		{
   			MoveInto(selectedobject, New3DobjectName);
   		});
   		SelectingSomething(New3DobjectName);
}
function MoveInto(MoveThis, IntoThis)//Reste à  finir de faire suivre l'interface est les autres client et ajouté une propriété parent et updaté la base de donné et le loadingmap
{
	console.log("Move into");
	if(MoveThis == IntoThis){
		document.getElementById("ErrorCreating3DobjectLabel").innerHTML = "Cannot move an object into itself!";
		document.getElementById("ErrorCreating3DobjectLabel").style.color = "red";
	}
	else{
		var maesterboxA = document.getElementById(MoveThis).MasterBoxe;
		var maesterboxB = document.getElementById(IntoThis).MasterBoxe;
		console.log(maesterboxA);
		maesterboxA = document.getElementById(maesterboxA);
		maesterboxB = document.getElementById(maesterboxB);
		maesterboxB.appendChild(maesterboxA);
		var ThisObject = document.getElementById(MoveThis);
		var Thisbutton = document.getElementById("IC2" + MoveThis);
		var IntoThisObjectContainer = document.getElementById("IC2" + IntoThis);
		if (document.getElementById(MoveThis).parent == "InterfaceC")
		{
			var MonCrochet = document.createElement('img');
			MonCrochet.src = "images/hook.png";
			var InsideThis = document.getElementById("IC" + MoveThis);
			InsideThis.insertBefore(MonCrochet,InsideThis.firstChild); // prepend custom			
		}	
		document.getElementById(MoveThis).parent = IntoThis;
		IntoThisObjectContainer.appendChild(Thisbutton);//Manque a ajouté le crochet inversé et je bouge juste le div je dois bougé le box ou wrapper
	}	
}	
function SelectingSomething(MyObjectidMan)
{
   	if(MyObjectidMan != selectedobject)
   	{   
		if(selectedobject != "empty")
		{
		  	 	document.getElementById(selectedobject).style.border = "gray 0px solid";
     		var myItemIdString = selectedobject.toString() + "_Object3dFaceSelectorDiv"; 
			if(document.getElementById(myItemIdString))
			{
		  	 	document.getElementById(myItemIdString).style.border = "gray 0px solid";
		   	} 
     		myItemIdString = selectedobject.toString();//This code does not work as intended, I need to rewrite part of the constructor   <-------EMERGENCY
			if(document.getElementById(myItemIdString))
			{
		  	 	document.getElementById(myItemIdString).style.border = "gray 0px solid";
		   	}  					   
		}
	}  
			selectedobject = MyObjectidMan.toString();
			if(document.getElementById(selectedobject))
			{
				document.getElementById(selectedobject).style.border = "white 0px ridge";											
			}
			myItemIdString = MyObjectidMan + "_Object3dFaceSelectorDiv"; 
			if(document.getElementById(myItemIdString))
			{
		  	 	document.getElementById(myItemIdString).style.border = "white 2px ridge";
		   	}
			myItemIdString = MyObjectidMan.toString();
			selectedobject = myItemIdString; 
			if(document.getElementById(myItemIdString))
			{
		  	 	document.getElementById(myItemIdString).style.border = "white 2px ridge";
		   	} 	
		//console.log("Selecting test " + document.getElementById("ObstacleButton").checked);
		document.getElementById("ObstacleButton").checked = document.getElementById(selectedobject).Obstacle;
   		document.getElementById("MyTextPropertie").value = document.getElementById(selectedobject).innerHTML;
   		document.getElementById("MySelectionIdentifier").innerHTML = selectedobject;
   		document.getElementById("ZindexButton").value = document.getElementById(selectedobject).z;
   		document.getElementById("BackgroundResizeButton").checked = document.getElementById(selectedobject).BackgroundResize;     			 				
}
function takeHeight(){
	  var myHeight = 0;
	  if( typeof( window.innerHeight ) == 'number' ) {
		//Non-IE
		myHeight = window.innerHeight;
	  } else if( document.documentElement && (document.documentElement.clientHeight) ) {
		//IE 6+ in 'standards compliant mode'
		myHeight = document.documentElement.clientHeight;
	  } else if( document.body && (document.body.clientHeight ) ) {
		//IE 4 compatible
		myHeight = document.body.clientHeight;
	  }
	  return myHeight;
}
function takeWidth(){
	  var myWidth = 0;
	  if( typeof( window.innerWidth ) == 'number' ) {
		//Non-IE
		myWidth = window.innerWidth;
	  } else if( document.documentElement && (document.documentElement.clientWidth) ) {
		//IE 6+ in 'standards compliant mode'
		myWidth = document.documentElement.clientWidth;
	  } else if( document.body && (document.body.clientWidth ) ) {
		//IE 4 compatible
		myWidth = document.body.clientWidtht;
	  }
	  //console.log(myWidth);
	  return myWidth;
	}	
function ShowFileMenu(){ //Those functions should go in a separate interface.js file!
		document.getElementById("FileDiv").style.display = "block";
		document.getElementById('FileMenuButton').addEventListener("click", HideFileMenu);
		document.getElementById('FileMenuButton').removeEventListener("click", ShowFileMenu);
}
function HideFileMenu(){
		document.getElementById("FileDiv").style.display = "none";
		document.getElementById('FileMenuButton').addEventListener("click", ShowFileMenu);
		document.getElementById('FileMenuButton').removeEventListener("click", HideFileMenu);
}
function ShowObjectPanel(){ //Those functions should go in a separate interface.js file!
		document.getElementById("ObjectPanel").style.display = "block";
		document.getElementById('ObjectPanelButton').addEventListener("click", HideObjectPanel);
		document.getElementById('ObjectPanelButton').removeEventListener("click", ShowObjectPanel);
}
function HideObjectPanel(){
		document.getElementById("ObjectPanel").style.display = "none";
		document.getElementById('ObjectPanelButton').addEventListener("click", ShowObjectPanel);
		document.getElementById('ObjectPanelButton').removeEventListener("click", HideObjectPanel);
}
function ShowImageDiv()
{
  	document.getElementById("ImagesButton").removeEventListener("click", ShowImageDiv);	//Remove eventlistener to prevent multiple post from click abusive users
  	document.getElementById("iframecontainer").style.display = "block";
  	document.getElementById("ImagesButton").addEventListener("click", HideImageDiv);
}
function HideImageDiv()
{
  	document.getElementById("ImagesButton").removeEventListener("click", HideImageDiv);	//Remove eventlistener to prevent multiple post from click abusive users	
  	document.getElementById("iframecontainer").style.display = "none";
  	document.getElementById("ImagesButton").addEventListener("click", ShowImageDiv);
}
function ShowChatPanel(){
		document.getElementById("interfaceB").style.display = "block";
		document.getElementById('ToggleChat').addEventListener("click", HideChatPanel);
		document.getElementById('ToggleChat').removeEventListener("click", ShowChatPanel);
}
function HideChatPanel(){
		document.getElementById("interfaceB").style.display = "none";
		document.getElementById('ToggleChat').addEventListener("click", ShowChatPanel);
		document.getElementById('ToggleChat').removeEventListener("click", HideChatPanel);
}
function ShowPropertiesPanel(){
		document.getElementById("interfaceD").style.display = "block";
		document.getElementById('ToggleProperties').addEventListener("click", HidePropertiesPanel);
		document.getElementById('ToggleProperties').removeEventListener("click", ShowPropertiesPanel);
}
function HidePropertiesPanel(){
		document.getElementById("interfaceD").style.display = "none";
		document.getElementById('ToggleProperties').addEventListener("click", ShowPropertiesPanel);
		document.getElementById('ToggleProperties').removeEventListener("click", HidePropertiesPanel);
}
function ShowGamepadPower(){
		document.getElementById("GamepadPower").style.display = "block";
		document.getElementById('ToggleGamepad').addEventListener("click", HideGamepadPower);
		document.getElementById('ToggleGamepad').removeEventListener("click", ShowGamepadPower);
}
function HideGamepadPower(){
		document.getElementById("GamepadPower").style.display = "none";
		document.getElementById('ToggleGamepad').addEventListener("click", ShowGamepadPower);
		document.getElementById('ToggleGamepad').removeEventListener("click", HideGamepadPower);
}
function ChangeText() //Must became for all socket!
{
	console.log("changing text!");
	setTimeout(function(){
		if(document.getElementById(selectedobject).className == "newObject3dclass")
		{
			var MynewText = document.getElementById("MyTextPropertie").value;
			var functionArray =[];
			var functionstring = "9"; //On indique à l'application quelle fonction éxécuter pour tous les clients connectés. fonction 9 = changetext
			functionArray.push(functionstring);//On pousse le numéro de la fonction dans l'array des paramètres à pousser vers le serveur.
			var ParameterArray = [];
			ParameterArray.push(MynewText);// On pousse les autres paramètres requis, ici le text d'un div
			ParameterArray.push(selectedobject);// On pousse les autres paramètres requis, ici le text d'un div
			functionArray.push(ParameterArray);
			functionArray.push(loadedMap);
			socket.emit('New3dappfunction', functionArray);
		}	
	},50);	
}
function ChangingText(ThisOne, NewText)
{
	document.getElementById(ThisOne).innerHTML = NewText;
}
function ChangeObstacle()
{
	var myactualobjectNotJusttheId = document.getElementById(selectedobject);
	if(myactualobjectNotJusttheId.className == "newObject3dclass")
	{
			var functionArray =[];
			var functionstring = "12"; //On indique à l'application quelle fonction éxécuter pour tous les clients connectés. fonction 12 = ChangeObstacle
			functionArray.push(functionstring);//On pousse le numéro de la fonction dans l'array des paramètres à pousser vers le serveur.
			var ParameterArray = [];
			ParameterArray.push(selectedobject);// On pousse les autres paramètres requis, ici le text d'un div
			var inverting;
			if(myactualobjectNotJusttheId.Obstacle == true)
			{
				inverting = 0;
			}
			else{
				inverting = 1;
			}	
			ParameterArray.push(inverting);
			functionArray.push(ParameterArray);
			functionArray.push(loadedMap);
			socket.emit('New3dappfunction', functionArray);
	
	}	
}
function ChangeBackgroundResize()
{
	var myactualobjectNotJusttheId = document.getElementById(selectedobject);
	if(myactualobjectNotJusttheId.className == "newObject3dclass")
	{
			var functionArray =[];
			var functionstring = "13"; //On indique à l'application quelle fonction éxécuter pour tous les clients connectés. fonction 12 = ChangeObstacle
			functionArray.push(functionstring);//On pousse le numéro de la fonction dans l'array des paramètres à pousser vers le serveur.
			var ParameterArray = [];
			ParameterArray.push(selectedobject);// On pousse les autres paramètres requis, ici le text d'un div
			var inverting;
			if(myactualobjectNotJusttheId.BackgroundResize == true)
			{
				inverting = 0;
			}
			else{
				inverting = 1;
			}	
			ParameterArray.push(inverting);
			functionArray.push(ParameterArray);
			functionArray.push(loadedMap);
			socket.emit('New3dappfunction', functionArray);
	
	}	
}
function changingBackgroundResize(MyParameters){
	var myactualobjectNotJusttheId = document.getElementById(MyParameters[0]);
		if(myactualobjectNotJusttheId.BackgroundResize == true)
		{
			myactualobjectNotJusttheId.BackgroundResize = false;
			myactualobjectNotJusttheId.style.backgroundSize = "";
		}
		else
		{
			myactualobjectNotJusttheId.style.backgroundSize = "100% 100%";
			myactualobjectNotJusttheId.BackgroundResize = true;
		}	
}
function changingObstacle(MyParameters){
	var myactualobjectNotJusttheId = document.getElementById(MyParameters[0]);
		if(myactualobjectNotJusttheId.Obstacle == true)
		{
			myactualobjectNotJusttheId.Obstacle = false;
		}
		else
		{
			myactualobjectNotJusttheId.Obstacle = true;
		}	
	}
	//Gamepade code here XD
	   var hasGP = false;
   var repGP;

   function canGame() {
       return "getGamepads" in navigator;
   }

   function reportOnGamepad() {
       var gp = navigator.getGamepads()[0];
       var html = "";
       html += "id: " + gp.id + "<br/>";

       for (var i = 0; i < gp.buttons.length; i++) {
           html += "Button " + (i + 1) + ": ";
           if (gp.buttons[i].pressed) html += " pressed";
           html += "<br/>";
       }

       for (var i = 0; i < gp.axes.length; i += 2) {
           html += "Stick " + (Math.ceil(i / 2) + 1) + ": " + gp.axes[i] + "," + gp.axes[i + 1] + "<br/>";
       }

       $("#gamepadDisplay").html(html);
       if (gp.buttons[3].pressed) alert("Hi!");// Funcion say hi to button 4 because array have a 0 and button 1 is in it XD
   }
