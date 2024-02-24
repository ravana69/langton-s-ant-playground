window.addEventListener('resize', resize, false);

var cellSize = 5;

var rule = [];
var colors = [];
var dirs = [
  [0, -1], [1, 0], [0, 1], [-1, 0]
];

var steps = 0;
var speed = 50;

var grid = [];
var gridWidth, gridHeight;
var ant = new Ant(0, 0);

var running = true;

var modal = document.getElementById('myModal');
var btn = document.getElementById("modalBtn");
var span = document.getElementsByClassName("close")[0];
var ruleText = document.getElementById("ruleText");
var runBtn = document.getElementById("run");
var resetBtn = document.getElementById("reset");
var randomBtn = document.getElementById("random");
var speedSlider = document.getElementById("speedSlider");
var speedText = document.getElementById("speedText");
var gridSlider = document.getElementById("gridSlider");
var gridText = document.getElementById("gridText");
btn.onclick = function() {modal.style.display = "block";}
span.onclick = function() {modal.style.display = "none";}
ruleText.oninput = function(){updateRule()};
runBtn.onclick = function(){toggleRunning()};
resetBtn.onclick = function(){reset()};
randomBtn.onclick = function(){randomize()};
speedSlider.oninput = function(){
  speed = speedSlider.value;
  speedText.innerHTML = speed;
}

gridSlider.oninput = function(){
  if (running) toggleRunning();
  cellSize = gridSlider.value;
  gridText.innerHTML = cellSize;
  resize();
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
} 

function updateRule(){
  if (running){
    toggleRunning();
  }
  reset();
  
  rule = [];
  var text = ruleText.value.toUpperCase();
  for (var i = 0; i < text.length; i++){
    if (text.charAt(i) == 'L') rule.push(0);
    if (text.charAt(i) == 'R') rule.push(1);
  }
  createColors();
  if (!running) toggleRunning();
}

function createColors(){
  colors = [];
  var range = random()*180 + 45;
  var start = random()*360;
  
  var a = color(start, 100, 20);
  var b = color(start+range, 100, 100);
 
  colors.push(color(0));
  for (var i = 1; i < rule.length; i++){
    var amount = i/(rule.length - 1);
    colors.push(lerpColor(a, b, amount));
  }
}

function toggleRunning(){
  running = !running;
  if (running) runBtn.innerHTML = "pause";
  else runBtn.innerHTML = "run";
}

function reset(){
  background(0);
  createColors();
  for (var i = 0; i < gridWidth; i++){
    for (var j = 0; j < gridHeight; j++){
      grid[i][j] = 0;
    }
  }
  ant.x = floor(gridWidth/2);
  ant.y = floor(gridHeight/2);
  ant.prevX = ant.x;
  ant.prevY = ant.y;
  ant.heading = 0;
  
  steps = 0;
}

function randomize(){
  if (running){
    toggleRunning();
  }
  reset();
  
  var longform = (random() < .5);
  
  var length = random()*12 + 3;
  var text = "";
  for (var i = 0; i < length; i++){
    var set = longform ? 1 : pow(random(), 2)*10 + 1;
    var letter = (random() < .5) ? "L" : "R";
    for (var j = 0; j < set; j++){
      text += letter;
    }
  }
  ruleText.value = text;
  updateRule();
}

function Ant(x, y){
  this.x = x;
  this.y = y;
  this.prevX = x;
  this.prevY = y;
  this.heading = 0; //0-N 1-E 2-W 3-S
  
  this.update = function(){
    if (this.heading < 0) this.heading += 4;
    if (this.heading > 3) this.heading -= 4;
    this.prevX = this.x;
    this.prevY = this.y;
    this.x += dirs[this.heading][0];
    this.y += dirs[this.heading][1];
  }
  
  this.ooBounds = function(){
    return this.x < 0 || this.y < 0 || this.x >= gridWidth || this.y >= gridHeight ||
           this.prevX < 0 || this.prevY < 0 || this.prevX >= gridWidth || this.prevY >= gridHeight;
  }
}

function setup(){
  createCanvas();
  colorMode(HSB, 360, 100, 100, 100);
  ellipseMode(CENTER);
  noStroke();
  resize();
}

function init(){
  background(0);
  grid = [];
  for (var i = 0; i < gridWidth; i++){
    grid.push([]);
    for (var j = 0; j < gridHeight; j++){
      grid[i].push(0);
    }
  }
  
  ant.x = floor(gridWidth/2);
  ant.y = floor(gridHeight/2);
  ant.prevX = ant.x;
  ant.prevY = ant.y;
  updateRule();
}

function draw(){
  
  for (var i = 0; i < speed; i++){
    if (colors.length == 0 || rule.length == 0) return;
    if (ant.ooBounds()) return;

    fill(100);
    rect(ant.x*cellSize, ant.y*cellSize, cellSize, cellSize);

    if (running){
       if (ant.prevX != -1){
         var value = grid[ant.prevX][ant.prevY];
         fill(colors[value]);
         rect(ant.prevX*cellSize, ant.prevY*cellSize, cellSize, cellSize);
       }
      
      var value = grid[ant.x][ant.y];
      var movement = rule[value];
      grid[ant.x][ant.y] = (value+1)%rule.length;
      if (movement == 1) ant.heading++;
      else ant.heading--;
      ant.update();
      
      steps++;
      fill(0);
      rect(0, height-30, 150, height);
      fill(100);
      text("steps: " + steps, 0, height-5);
    }
  }
}

function resize(){
  resizeCanvas(window.innerWidth, window.innerHeight);
  gridWidth = ceil(width/cellSize);
  gridHeight = ceil(height/cellSize);
  init();
}