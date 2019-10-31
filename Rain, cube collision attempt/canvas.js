var canvas = document.querySelector("canvas");
var maxWidth = window.innerWidth;
var maxHeight = window.innerHeight;

canvas.width = maxWidth;
canvas.height = maxHeight;
var c = canvas.getContext("2d");
var colors = ["#4286f4","#6dc6f9","#0069a5","#01afad","#00b6ff","#99e1ff"];
var balls = [];
var squares = [new Square(200,200),new Square(400,200),new Square(600,200), new Square(800,200), new Square(1000,200), new Square(1200,200)];
var ttl = 300; //(time to live) how many balls can be on the screen at once

canvas.addEventListener("click", function(event){
	mouse.x = event.clientX;
	mouse.y = event.clientY;
});

var mouse = {
	x:undefined,
	y:undefined
}
function Square(x,y){
	//Coordinates
	this.x = x;
	this.y = y;
	this.w = 50;
	this.h = 50;
	this.colour = "black";
	
	//Points
	this.point0 = [this.x,this.y];
	this.point1 = [this.x+this.w,this.y];
	this.point2 = [this.x,this.y+this.h];
	this.point3 = [this.x+this.w,this.y+this.h];
	
	this.draw = function(){
		c.fillStyle = "black";
		c.fillRect(this.x,this.y,this.w,this.h);
	}
	this.getP0 = function(){
		return this.point0;
	}
	this.getP1 = function(){
		return this.point1;
	}
	this.getP2 = function(){
		return this.point2;
	}
	this.getP3 = function(){
		return this.point3;
	}
}

function Circle(x,dX,r,colour){
	//Coordinates and attributes
	this.x = x;
	this.y = 0;
	this.r = r;
	this.colour = colour;
	//Velocity
	this.dX = randomDX();
	this.dY = 10;
	
	//Draw graphics
	this.draw = function(){
		c.beginPath();
		c.arc(this.x,this.y,this.r,0,Math.PI*2,false);
		c.fillStyle = this.colour;
		c.fill();
		
			if(this.y + this.r >= maxHeight){
			this.dY = -this.dY;
			this.lowerVelocity();
		}
		
		this.pull();
	}
	//Checks for collision on the cube surfaces
	this.checkCollision = function(){
		for(var i = 0; i < squares.length;i++){
			
			var p0 = squares[i].getP0();
			var p1 = squares[i].getP1();
			var p2 = squares[i].getP2();
			var p3 = squares[i].getP3();
		
			if(this.x >= p0[0] && this.x <= p1[0] && this.y >= p0[1] && this.y <= p2[1]){
				this.dX = 0;
				this.dY = 0;
			}		
		}
	}
	//Pulls the raindrowps down
	this.pull = function(){
		this.x += this.dX;
		this.y += this.dY;
		this.checkCollision();
	}
	//Upon impact with the ground or collision surface the velocity is gradually lowered
	this.lowerVelocity = function(){
		this.dY*=0;
		this.dX*=0.95;
	}
}

function animate(){
	requestAnimationFrame(animate);
	c.clearRect(0,0,maxWidth,maxHeight);
	spawnBall();
	
	for(var i = 0; i < squares.length;i++){
		squares[i].draw();
	}
	
	for(var i = 0; i < balls.length;i++){
		balls[i].draw();
	}
}

function spawnBall(){
	if(ttl < 0){
		balls.splice(0,1);
	}
	balls.push(new Circle(randomX(),randomDX(),randomR(),colors[randomR()]));
	ttl--;
}
function randomX(){
	return Math.floor(Math.random()*maxWidth);
}
function randomDX(){
	return Math.random()-0.5*2;
}
function randomR(){
	return Math.floor(Math.random()*6);
}

animate();