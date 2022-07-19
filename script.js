// my GitHub account: https://github.com/moPsych

// number of the background rectangles
const n = 200;
// initializing background rectangles the colors
let recs = [];

// image for the background
let img;
// optional color for the background
let bg;

function preload() {
  img = loadImage("https://i.imgur.com/ffJmBct.jpg");
}

function setup() {
  createCanvas(1300, 700);
  rectMode(CENTER);
  bg = color(0, 0, 10);
  background(bg);
  // the wheel object
  w = new Wheel(width / 3, height * 2 / 3, 700);
}

function draw() {
  background(img);
  // the background rectangles
  drawRecs();
  // updating and drawing the wheel
  w.update();
  w.render();
}

function drawRecs() {
  if (frameCount % 4 == 0) {
    recs = [];
    for (let i = 0; i < n; i++) {
      let rec = {
        x: random(width),
        y: random(height / 4, height),
        w: random(7, 15),
        h: random(7, 15) / 2,
        col: colorizeRnd()
      }
      recs.push(rec);
    }
  }
  for (let rec of recs) {
    fill(rec.col);
    rect(rec.x, rec.y, rec.w, rec.h, rec.h / 3);
  }
}

function colorize(i) {
  // a function to give color for the cabins according to the cabin's index
  let v = 220;
  let c = [
    color(v, 0, 0),
    color(0, v, 0),
    color(0, 0, v),
    color(v, v, 0),
    color(v, 0, v),
    color(0, v, v),
  ];
  let index = i % 6;
  return c[index];
}

function colorizeRnd() {
  // a function to generate a random color from a list of colors
  let v = 80;
  let c = [
    color(v, 0, 0),
    color(0, v, 0),
    color(0, 0, v),
    color(v, v, 0),
    color(v, 0, v),
    color(0, v, v),
  ];
  let index = floor(random(6));
  return c[index];
}

class Wheel {
  // x, r: coordinates || r: radius of the wheel
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    // angle of sectioning the wheel
    this.ang = TWO_PI / 12;
    // angle of rotation
    this.rotA = 0;
    // increase of the angle of rotation
    this.da = 0.002
    // radii of different circles
    this.r1 = r * 0.12;
    this.r2 = r * 0.4;
    this.r3 = r * 0.6;
    this.r4 = r * 0.69;
    // colors
    this.circleCol = color(70, 110, 140);
    this.trussCol = color(40, 80, 110);
    this.legsCol = color(20, 60, 90);
    this.trussAng = this.ang * 0.3;
    // the cabins list
    this.cabins = [];
    let i = 0;
    //contructing cabins around the wheel
    for (let a = 0; a < TWO_PI; a += this.ang) {
      this.cabins.push(
        new Cabin(
          (r * cos(a + this.ang / 2)) / 2,
          (r * sin(a + this.ang / 2)) / 2,
          this.r,
          colorize(i)
        )
      );
      i++;
    }
  }

  update() {
    // updating the angles of the cabins to stay vertical
    this.rotA += this.da;
    for (let c of this.cabins) {
      c.update(this.rotA);
    }
  }

  render() {
    //legs
    push();
    stroke(this.legsCol);
    strokeWeight(this.r / 30);
    line(this.x, this.y, this.x + this.r * 0.75, this.y + this.r * 1.5);
    line(this.x, this.y, this.x - this.r * 0.75, this.y + this.r * 1.5);
    pop();

    push();
    // for the center and the rotation of the wheel
    translate(this.x, this.y);
    rotate(this.rotA);

    //cabins
    for (let cab of this.cabins) {
      cab.render();
    }
    noFill();
    stroke(this.trussCol);
    for (let a = 0; a < TWO_PI; a += this.ang) {
      //main structure
      strokeWeight(this.r / 150);
      line(0, 0, (this.r * cos(a)) / 2, (this.r * sin(a)) / 2);
      //first truss
      strokeWeight(this.r / 250);
      line(
        (this.r2 * cos(a)) / 2,
        (this.r2 * sin(a)) / 2,
        (this.r3 * cos(a + this.trussAng)) / 2,
        (this.r3 * sin(a + this.trussAng)) / 2
      );
      line(
        (this.r2 * cos(a)) / 2,
        (this.r2 * sin(a)) / 2,
        (this.r3 * cos(a - this.trussAng)) / 2,
        (this.r3 * sin(a - this.trussAng)) / 2
      );
      line(
        (this.r3 * cos(a + this.trussAng)) / 2,
        (this.r3 * sin(a + this.trussAng)) / 2,
        (this.r4 * cos(a)) / 2,
        (this.r4 * sin(a)) / 2
      );
      line(
        (this.r3 * cos(a - this.trussAng)) / 2,
        (this.r3 * sin(a - this.trussAng)) / 2,
        (this.r4 * cos(a)) / 2,
        (this.r4 * sin(a)) / 2
      );
      //second truss
      line(
        (this.r4 * cos(a)) / 2,
        (this.r4 * sin(a)) / 2,
        (this.r * cos(a + this.trussAng)) / 2,
        (this.r * sin(a + this.trussAng)) / 2
      );
      line(
        (this.r4 * cos(a)) / 2,
        (this.r4 * sin(a)) / 2,
        (this.r * cos(a - this.trussAng)) / 2,
        (this.r * sin(a - this.trussAng)) / 2
      );
    }
    // circle structures
    noStroke();
    fill(this.trussCol);
    circle(0, 0, this.r1);
    fill(this.circleCol);
    circle(0, 0, this.r1 / 2);
    strokeWeight(this.r / 150);
    noFill();
    stroke(this.circleCol);
    circle(0, 0, this.r2);
    circle(0, 0, this.r3);
    circle(0, 0, this.r4);
    circle(0, 0, this.r);
    pop();
  }
}

class Cabin {
  // x, y: coordinates | r: radius | c: color
  constructor(x, y, r, c) {
    this.x = x;
    this.y = y;
    this.r = r;
    // the end point of the line that the cabin is attached to
    this.cl = this.r / 30;
    // the radius of the cabin
    this.cr = this.r / 8.75;
    // the color of the cabin
    this.c = c;
    // the angle of the cabin
    this.a = 0;
  }

  update(da) {
    // updates the angle of the cabin to stay vertical
    this.a = -da;
  }

  render() {
    push();
    translate(this.x, this.y);
    rotate(this.a);
    // the line that the cabin is attached to;
    noStroke();
    fill(this.c);
    circle(0, 0, this.r / 65);
    stroke(this.c);
    strokeWeight(this.r / 250);
    line(0, 0, 0, this.cl);
    fill(bg);
    noStroke();
    // base cabin circle
    circle(0, this.cr / 2 + this.cl, this.cr);
    noFill();

    // inner lines
    stroke(this.c);
    strokeWeight(this.r / 300);
    let cx1 = this.cr / 6;
    let cx2 = -cx1;
    let cy1 = this.cl + 0.0277 * this.cr;
    let cy2 = this.cl + this.cr - 0.0277 * this.cr;
    line(cx1, cy1, cx1, cy2);
    line(cx2, cy1, cx2, cy2);
    cx1 = (-this.cr * 0.99) / 2;
    cx2 = (this.cr * 0.99) / 2;
    cy1 = this.cl + this.cr * 0.4;
    cy2 = cy1 + this.cr * 0.05;
    line(cx1, cy1, cx2, cy1);
    line(cx1, cy2, cx2, cy2);

    // inner circles
    fill(this.c);
    noStroke();
    cx1 = -this.cr * 0.3;
    cx2 = -cx1;
    cy1 = this.cr * 0.57;
    circle(cx1, cy1, this.cr * 0.15);
    circle(cx2, cy1, this.cr * 0.15);

    // rectangles
    let w = this.cr / 10;
    let h = this.cr / 4;
    rect(-this.cr / 14, this.cr / 1.95, w, h, this.cr / 30);
    rect(this.cr / 14, this.cr / 1.95, w, h, this.cr / 30);
    w = this.cr / 5;
    h = this.cr / 3;
    rect(0, this.cr * 1.01, w, h, this.cr / 20);

    // outer circle
    noFill();
    stroke(this.c);
    strokeWeight(this.r / 200);
    circle(0, this.cr / 2 + this.cl, this.cr);
    pop();
  }
}