var fs=require("fs"), net=require("net"),Mustache=require("Mustache"),chalk=require("chalk");

var Question=function(){
//get random numbers to add/multiply/subtract
	this.num= parseInt((Math.floor(Math.random()*10)), 10);
	this.num1= parseInt((Math.floor(Math.random()*10)), 10);
//get a random operator from this array
	var operators=["+","-","*"];
	this.operator=(operators[Math.floor(Math.random()*3)]);
	this.equation=this.num+" "+this.operator+" "+this.num1;
//What is the correct answer for the equation?
	this.answer=function(){
		//What operator are we using? Equation parser
		if (this.operator=== "*"){
			return this.num*this.num1;
		}else if(this.operator=== "-"){
			//Which is smaller? subtract small from large.
			return this.num-this.num1;
		} else if(this. operator=== "+"){
			return this.num+this.num1;
		}else{
			return "error";
		}
	};
//does the user's answer match the correct answer?
	this.answerCheck=function(ans){
		var correct=false;
		if(ans===this.answer()){
			correct=true;
		}
		return correct;
	};
};
//how many equations do you want
var maxEquations=10;
var eqarray = [];
for (var i=0; i<maxEquations; i++){
	eqarray.push(new Question());
	}
 console.log(eqarray);
var q=[];
for(var i=0;i<eqarray.length;i++){	
	q.push(eqarray[i].equation.toString());
}
var mathQ=0;
//How many are wrong?
var wrong1=0;
//How many are correct?
var right1=0;
var counter=0;
var port=3000;

var User=function(socket){
	this.socket=socket;
	this.name="person";
	console.log(this.name);
	this.getName=function(){
	socket.once("data", function(data){
		var nameD=data.toString().trim();
		
		users[clientCounter].name=nameD;
		console.log("1st ever "+users[0].name);
		if(users[1]!==undefined){
			console.log("2nd ever "+users[1].name);
		}
	});
	}
};

var users=[], clientCounter=-1;
var setup=function(){
var server=net.createServer(function(socket){
	clientCounter++;
	var user=new User(socket);
	users.push(user);
	console.log(clientCounter);
	console.log("Client, "+clientCounter+", has connected.");
	socket.write("Welcome, you are connector Number: "+clientCounter+"\n"+"At any time, type /commands to learn what you can do.\nFor now: Please select a Username whatever you type will be your user name!\n");
	console.log(users[clientCounter].name)
	socket.once("data",function(data){
		var namedata=data.toString().trim();
		user.name=namedata;
		socket.on("data",function(data){
			var text=data.toString().trim();
			if(text[0]==="/"){
				if(text==="/mathgame"){
					mathGame();
				}
			}else{
				for(var i=0;i<users.length;i++){
				users[i].socket.write(user.name+"|: "+data);
				}
			} 
			});
		});

 
	// process.stdin.on('data', function (chunk) {
 // 	process.stdout.write('data: ' + chunk);
	// });
	// var sayAll=function(){
	// 		users[clientCounter].socket.on("data",function(data){
	// 			var text=data.toString().trim();
	// 			console.log(text);
	// 			var origin=users[clientCounter].name;
	// 			for (var x=0; x<users.length;x++){
	// 				users[x].socket.write(origin+": "+text+"\n");
	// 			}
	// 		});
	// 	};

var mathGame= function(){
	// socket.once("data", function(err, data)){
	// 	if(err){
	// 		console.log(data)
	// 	}
	socket.on("data", function(data){
		//make answers behave nicely.
		var text= data.toString().trim();
		//console.log(text);		
		var num=parseInt(text,10);
		// var mathGame=function(){
		console.log(num);
		//console.log("pre anything"+q[counter]);
		// if(text.toLowerCase().search("math game")!=-1){ 
			if(text.toLowerCase().search("math game")!=-1){
				console.log(text);
				if(eqarray[counter].answerCheck(num)){
					right1++;
					socket.write("\nGood Job! "+right1+"/10\n");
					counter++;
					//console.log("correct"+counter);
					socket.write("\n"+q[counter]+"\n");
					wrong1=0;
				}else{
					socket.write("\nSorry that's not correct\n");
					wrong1++;
					console.log("wrong  "+wrong1);
					//Have another try!
					if(wrong1<2){
						socket.write("\n"+q[counter]+"\n");
						//console.log("else if"+counter);
					} else{
						socket.write("\nWe'll try the next one\n");
						counter++;
						//console.log(q[counter]);
						socket.write("\n"+q[counter]+"\n");
						//console.log("elseelse"+counter);
						wrong1=0;
					}
				}
			}else{
				socket.write("sorry\n");
			}
			// socket.write("\n"+q[counter]+"\n");
			// }else{
			// 	socket.write("thank you");
			// 	//move on to next Question!
			// }
		// }else{ 
		// 	console.log(text);
		// //}

	});
	};
	//mathGame();
socket.on("end", function(){
		clientCounter--;
		console.log("A client has disconnected...");
		})
	});
server.listen(port, function(){
	console.log("Listening on Port: "+port);
	});
}

setup();