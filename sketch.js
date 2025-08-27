// sketch.js

let trail;    
let particles = [];
let zOff = 0;     
let fieldScale;        
let bgColor = '#0b1020'; 

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noCursor(); 
  background(bgColor);

  trail = createGraphics(width, height);
  trail.colorMode(HSB, 360, 100, 100, 100);
  trail.clear(); 

  initSystem();
}

function initSystem() {
  particles.length = 0;

  const area = width * height;
  const baseCount = constrain(floor(area / 1400), 20, 120);
  const extra = width > 1400 ? 200 : 0;
  const count = baseCount + extra;

  fieldScale = max(280, min(width, height) * 0.65); 

  const dailySeed = floor(new Date().setHours(0, 0, 0, 0) / 86400000);
  randomSeed(dailySeed);
  noiseSeed(dailySeed);

  for (let i = 0; i < count; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.prev = this.pos.copy();
    this.speed = random(0.4, 1.4);
    this.weight = random(0.6, 1.8);
    this.hueOffset = random(0, 360);
  }

  update() {
    const nx = this.pos.x / fieldScale;
    const ny = this.pos.y / fieldScale;
    const n = noise(nx, ny, zOff);
    const angle = n * TAU * 2.0;  
    const v = p5.Vector.fromAngle(angle).setMag(this.speed);

    this.prev.set(this.pos);
    this.pos.add(v);

    if (this.pos.x < 0) { this.pos.x = width; this.prev.set(this.pos); }
    if (this.pos.x > width) { this.pos.x = 0; this.prev.set(this.pos); }
    if (this.pos.y < 0) { this.pos.y = height; this.prev.set(this.pos); }
    if (this.pos.y > height) { this.pos.y = 0; this.prev.set(this.pos); }
  }

  draw(t) {
    const baseHue = map(sin(t * 0.00015), -1, 1, 190, 265); 
    const h = (baseHue + this.hueOffset * 0.1) % 360;
    const s = 60 + 25 * noise(this.pos.x * 0.002, this.pos.y * 0.002);
    const b = 70 + 20 * noise(this.pos.y * 0.002, this.pos.x * 0.002);

    trail.stroke(h, s, b, 60); 
    trail.strokeWeight(this.weight);
    trail.line(this.prev.x, this.prev.y, this.pos.x, this.pos.y);
  }
}

function draw() {
  imageStaticBackground();

  trail.noStroke();
  trail.fill(0, 0, 0, 4); 
  trail.rect(0, 0, width, height);

  const t = millis();
  for (let p of particles) {
    p.update();
    p.draw(t);
  }

  image(trail, 0, 0);

  zOff += 0.002;
}

function imageStaticBackground() {
  push();
  noStroke();
  fill(bgColor);
  rect(0, 0, width, height);

  drawingContext.save();
  const grd = drawingContext.createRadialGradient(
    width * 0.5, height * 0.5, min(width, height) * 0.1,
    width * 0.5, height * 0.5, max(width, height) * 0.65
  );
  grd.addColorStop(0, 'rgba(20,25,45,0.0)');
  grd.addColorStop(1, 'rgba(5,8,18,0.55)');
  drawingContext.fillStyle = grd;
  rect(0, 0, width, height);
  drawingContext.restore();
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  trail = createGraphics(width, height);
  trail.colorMode(HSB, 360, 100, 100, 100);
  trail.clear();
  background(bgColor);
  initSystem();
}
