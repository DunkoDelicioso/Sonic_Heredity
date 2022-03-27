        //Heres where I'm having problems. I want to splice the animal that intersects with the predator
        //But it seems like it just removes the last element.
        //Also it is choosing the most recent particle to seek, what will I have to do to write a comparative function that finds
        //NUN said that the reason this might be going on is because p of predators is inside the for loop for animals. 
        //Figure out a way to close the shape that doesn't leave it pointy
        //



//Array that Animals are Pushed to
let animas = []
//Slider Value
let val;
//The array of food
let food = [];
//The array of poison
let poison = []
//The location of the Animal followed by pradator;
let posi;
//Variable to Buffer seconds of sound file when clicked.
let sul = 45

let deathVal = 0.001

let birthVal = 0.0005

function preload() {
  //this is the sound that gets triggered everytime that the mouse is clicked maybe reimport as mp3 to
  //consolidate space
  // mySound = loadSound('ooye.wav');
}

function setup() {
  
  canvas = createCanvas(windowWidth, windowHeight);
  noStroke();
  canvas.id('mycanvas');
  canvas.parent('sketch-container');
  //creating the slider
  slider = createSlider(0, 255, 255, 1);
  //creating the class "slider" so that it links up with HTML / CSS
  slider.class("slider")
  slider.parent("sliderA")

  slider1 = createSlider(0.001, 0.1, 0.01, 0.001);
  //creating the class "slider" so that it links up with HTML / CSS
  slider1.class("slider")
  slider1.parent("sliderB")

  slider2 = createSlider(0.0001, 0.01, 0.0001, 0.0001);
  //creating the class "slider" so that it links up with HTML / CSS
  slider2.class("slider")
  slider2.parent("sliderC")



  for (let i = 0; i < random(1, 100); i++) {
    let z = random(width);
    let w = random(height);
    animas[i] = new animal(z, w);
  }

  for (let i = 0; i < random(10, 1000); i ++){
    let x = random(width)
    let y = random(height)
  food.push(createVector(x,y))
  }

  for (let i = 0; i < random(10, 1000); i ++){
    let x = random(width)
    let y = random(height)
  poison.push(createVector(x,y))
  }

  //LOOP the sound once playing.
  //To disconnect for troubleshooting Comment Out the sound below.
  // mySound.loop()
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  //Variable for the Slider Value

  document.getElementById("myText").innerHTML = animas.length;
  document.getElementById("birthText").innerHTML = slider2.value();
  document.getElementById("deathText").innerHTML = "-" + slider1.value();
  document.getElementById("foodText").innerHTML = food.length;
  document.getElementById("poisonText").innerHTML = poison.length;
  


  val = slider.value();
  birthVal = slider2.value()
  deathVal = slider1.value()
  //This variable is controlling the opacity of the orange square that comes on as you move the slider
  slip = map(val, 0, 255, 10, 0)
  document.getElementById("speedText").innerHTML = slip;
  //This Variable is connected to the rate at which velocity is divided, 
  //when the slider is moved down, it divides velocity by more.
  pip = map(val, 0, 255, 2, 1)
  //The Vector which the animals are pursuing. 
  //This can be changed later to reflect animals of different sizes pursuing eachother. 
  // target = createVector(mouseX,mouseY)
 
  //Rate affecting the sound rate of song, tied to slider.
  rate = map(val, 0, 255, .3, 1)
  //The sound rate of the song.
  // mySound.rate(rate);

  if (random(1) < 0.01){
    let x = random(width)
    let y = random(height)
    poison.push(createVector(x, y))
  }

  if (random(1) < 0.05){
    let x = random(width)
    let y = random(height)
    food.push(createVector(x, y))
  }

  if(animas.length == 0){
    for (let i = 0; i < 10; i++) {
      let z = random(width);
      let w = random(height);
      animas[i] = new animal(z, w);
    }
  }

  background(0, val);

  frameRate(24)
  
  //For every anima in the array call the functions below.

  for(let i = 0; i < food.length; i ++){
    noStroke();
    fill(255, 255, 255)
    ellipse(food[i].x, food[i].y, 2)
  }

  for(let i = 0; i < poison.length; i ++){
    stroke(255)
    strokeWeight(1)
    noFill()
    ellipse(poison[i].x, poison[i].y, 4)
  }

for(let i = animas.length-1 ; i >= 0; i --){
    animas[i].display()
    animas[i].update()
    animas[i].behavior(food, poison);

    let child = animas[i].clone();
  if (child != null){
      animas.push(child)
    }

  if(animas[i].dead()){
    animas[i].sound.amp(0)
    animas.splice(i, 1)
   


    
}
}
  

  for(a of animas){
    //For every animal in the array do these functions
    
    // a.display();
    //a.seek(target);
    // a.update();
    // a.behavior(food, poison);


    //This sets a variable for the predator to persue.
    //This needs to be reworked so that the persuer can check the smallest distance and choose based on that
    let posi = a.pos 
    
    //The booleans for if two animals overlap (overlapping), and if predator overlaps with predator (eating)
    let overlapping = false;
    let eating = false;

    for (other of animas){
      //if two animals intersect with eachother
      if(a !== other && a.intersects(other)){
       overlapping = true;
      }
    }
    if (overlapping){
      //Change flux, which changes the shape/phase, speed and force of an animal.
      //Animals turn red when overlapping
      a.valt = 0
      a.flux += random(-1, 1)
      if(a.flux < 0.1){
        a.flux = 0.1
      }
    }
    else{
      a.valt = 255
    }

  //Orange Rectangle, transparent until slider is pulled.
  fill(237, 217, 90, slip)
  rect(0, 0, width, height)
}
}

  
function mousePressed(){
  //If the mouse is within the limits of the box and mouse is pressed then:
  // push a new animal to the array.
  let x = random(0, 20)
  let y = random(5, 35)
  animas.push(new animal(mouseX, mouseY));


  }
