class animal {
  constructor (z, w, dna) {
    // The DNA information being passed on
    this.dna = []
    if(dna === undefined){
      //food weight
      this.dna[0] = random(-2, 2)
      //poison weight
      this.dna[1] = random(-2, 2)
      //food perception
      this.dna[2] = random(20, 500)
      //poison perception
      this.dna[3] = random(20, 500)
      //the flux variable(affecting the phase)
      this.dna[4] = random(0, 20)
      //the radius variable
      this.dna[5] = random(0.1, 50)
    }else{
      this.dna[0] = dna[0]
      this.dna[1] = dna[1]
      this.dna[2] = dna[2]
      this.dna[3] = dna[3]
      this.dna[4] = dna[4]
      this.dna[5] = dna[5]
    }


    this.flux = this.dna[4]
    //this affects the radius of the animal
    this.r = this.dna[5]
    this.r1 = 0
    this.inc = 0
    this.phase = 0;
    this.posX = z
    this.posY = w
    this.valt = 255;
    this.pos = createVector(z,w)
    this.vel = p5.Vector.random2D()
    this.acc = p5.Vector.random2D();
    this.acc.div(random(0, 100));

    this.maxSpeed =  this.flux / 4 ;
    this.maxForce = 0.1 * this.flux;

    this.health = 1

    this.col = 0;

    this.sound = new p5.Oscillator();

    if(this.flux > 0 && this.flux < 5){
      this.sound.setType('square')
    }

    if(this.flux > 5 && this.flux < 10){
      this.sound.setType('triangle')
    }

    if(this.flux > 10 && this.flux < 15){
      this.sound.setType('sawtooth')
    }

    if(this.flux > 15 && this.flux < 20){
      this.sound.setType('sine')
    }

    this.sound.amp(0.02);
    this.sound.start();
   
    
  }

seek(target) {
    let desired = p5.Vector.sub(target, this.pos);
    //force = target - this position
    desired.setMag(this.maxSpeed);
    //setting the magnitude for force
    let steer = p5.Vector.sub(desired, this.vel)
    //
    steer.limit(this.maxForce);
    // this.applyForce(steer);
    return steer;
    
  }

clone(){
    if (random(1) < birthVal || this.health > 2){
    return new animal(this.pos.x, this.pos.y, this.dna);
    } else {
      return null;
    }
}


behavior(good, bad){
  // the perception radiu that allows it to see poison/food
  let steerG = this.eat(good, 0.5, this.dna[2])
  let steerB = this.eat(bad, -0.8, this.dna[3])

  // poison and food weights (desire for food or poison)
  steerG.mult(this.dna[0])
  steerB.mult(this.dna[1])

  this.applyForce(steerG)
  this.applyForce(steerB)
}

applyForce(force) {
    this.acc.add(force);
  }

update() {


    if(this.health < 0){
      this.sound.stop()
    }
    this.soundMap = map(this.health, 0, 2, 0, 0.4)
    this.sound.freq(this.flux * 25/ pip)

    //The rate they die
    this.health -= deathVal;
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
    this.sound.amp(this.soundMap)

    if(this.health > 2){
      this.health = 1
    }
    
  }

eat(list, nutrition, perception){
  let record = Infinity;
  let closest = -1;
  for(let i = list.length -1; i >= 0; i --){
    let d = this.pos.dist(list[i])
    if(d < record && d < perception){
      record = d
      closest = i;
    }
  }

  
  if (record < 20){
    list.splice(closest, 1);
    this.health += nutrition
  }else if (closest > -1){
    return this.seek(list[closest]);
  }
    return createVector(0,0);
  
}

  
dead () {
  
  return(this.health < 0);
  
  
}

  
display() {
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    this.vel.div(pip/2);
    if(this.vel.x > 7){
      this.acc.x *= -1
      this.acc.y *= -1
    }
      if(this.vel.y < -7){
      this.acc.x *= -1
      this.acc.y *= -1
    }

    let wh = color(255, 255, 255)
    let bl = color(0, 0, 0)
    let col = lerpColor(bl, wh, this.health)
 

    fill(col)
    textSize(10)
    text(this.inc, this.pos.x + 30, this.pos.y + 50);
  
    push();
    translate(this.pos.x, this.pos.y);
    
    stroke(col);
    strokeWeight(1);
    noFill(0);

    this.inc = TWO_PI / (this.flux);
    this.phase += this.vel.y / 10  
    beginShape();
    for (let a = 0; a < TWO_PI; a += this.inc) {
      this.r1 = (this.r + sin(a * 10 + this.phase) * 50) / 3.5
      this.posX = this.r1 * cos(a);
      this.posY = this.r1 * sin(a);
      curveVertex(this.posX, this.posY);
    }
    endShape(CLOSE);
 
    pop();

  	if(this.pos.y < -200){
      this.pos.y = canvas.height + 150
    }
    else if(this.pos.x < -200){
       this.pos.x = canvas.width + 150
    }
	  else if(this.pos.x > canvas.width + 200){
      this.pos.x = -150
    }
    else if(this.pos.y > canvas.height + 200){
      this.pos.y = -150
    }
    if(this.inc > .95){
    this.inc *= -1


    }
  }
  
  intersects(other) {
    let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
      if(d < this.r + other.r){
        this.health -= 0.0001
        fill(0, 255, 0, this.col)
        return true;
      }
    else{
      return false;
    }
}


  

  }

