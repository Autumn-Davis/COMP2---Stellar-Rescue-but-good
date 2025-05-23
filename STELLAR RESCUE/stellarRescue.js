//COLOR SCHEME:
// 1. light orange: 242, 166, 73 (Fergus's ship)
// 2. light orange muted: 180, 129, 37 (Fergus, dog)
// 2. dark orange: 140, 63, 13 (Fergus's ship, Fergus, dog)
// 3. light green: 50, 93, 65 (Void ship)
// 4. dark green: 37, 72, 50 (Void ship)
// 5. dark blue: 26, 40, 40 (background)


let posI;
let vel;
let k;

let shipPos;
let shipVel;

let dogPos;
let dogVel;

let gameState = "start";

let meteors = [];
const NUM_METEORS = 6;

let shipReleased = false;

let isHidden = false;

let dogRescued = false;


function setup() {
  createCanvas(windowWidth, windowHeight);

  frameRate(60)

  posI = createVector(50, 50); //spaceship
  vel = createVector(1.5, 1.5);
  print(vel.mag());
  vel.setMag(8);

  //noCursor();

  k=0;

  for (let i = 0; i < NUM_METEORS; i++) {
    let x = random(150, width - 150);
    let y = random(150, height - 150);
    let r = random(30, 50); // base radius
    let n = int(random(7, 10)); // number of sides
    let angleOffset = random(TWO_PI);
  
    // makes the jagged shape:
    let shape = [];
    for (let j = 0; j < n; j++) {
      let angle = map(j, 0, n, 0, TWO_PI) + angleOffset;
      let radius = r * random(0.7, 1.2);
      let px = radius * cos(angle);
      let py = radius * sin(angle);
      shape.push({ x: px, y: py });
    }

    meteors.push({ x, y, r, shape });
}

  dogPos = createVector(width / 2, height / 2);
  dogVel = createVector(random(1, 2), random(1, 2));

  shipPos = createVector(random(100, width - 100), random(100, height - 100));
  shipVel = createVector(random(1, 2), random(1, 2));
}



function drawStartScreen() {
  background(26, 40, 40); // Same as game background

  // Title
  push();
  textAlign(CENTER);
  textFont("Courier New");
  fill(242, 166, 73);
  textSize(70);
  text("S T E L L A R   R E S C U E", width / 2, height / 4);
  pop();

  // Instructions
  push();
  textAlign(CENTER);
  textFont("Trebuchet MS");
  fill(180, 129, 37);
  textSize(18);
  text("Help FERGUS the orange alien run away from the evil VOID REAPERS and rescue his dog. \nFergus can hide behind meteors to catch his breath, but \nBE CAREFUL NOT TO LET THE VOID SHIP GET TOO CLOSE TO YOU!.\n...\n\n Once Fergus and his dog are together, simply drag them back over to their ship to WIN!", width / 2, height / 2.5);
  //text("Help FERGUS the little green alien escape the evil VOID REAPERS and get his dog back!\nClick and hold to move.\nStay away from the VOID SHIP, and hide behind meteors to take a break.\nMake sure to KEEP AN EYE ON YOUR AIR LEVELS!\n", width / 2, height / 2.5);
  pop();

  // Button
  push();
  
  rectMode(CENTER);
  textAlign(CENTER);
  let btnX = width / 2;
  let btnY = height / 1.2;
  let btnW = 200;
  let btnH = 50;

  fill(50, 93, 65);
  stroke(37, 72, 50);
  strokeWeight(2);
  rect(btnX, btnY, btnW, btnH, 10); // rounded corners

  fill(26, 40, 40);
  noStroke();
  textSize(24);
  textFont("Trebuchet MS");
  text("START GAME", btnX, btnY + 8);
  pop();

  // to detect if clicked inside button
  if (mouseIsPressed &&
      mouseX > btnX - btnW / 2 &&
      mouseX < btnX + btnW / 2 &&
      mouseY > btnY - btnH / 2 &&
      mouseY < btnY + btnH / 2) {
    gameState = "play";
  }
}

function drawWinScreen() {
  background(26, 40, 40);
  textAlign(CENTER);
  textFont("Trebuchet MS");
  fill(242, 166, 73);
  textSize(48);
  text("YOU WIN!", width / 2, height / 2);
}


function draw() {
  if (gameState === "start") {
    drawStartScreen();
  } else if (gameState === "play") {
    noCursor();
    background(26, 40, 40);
    moveSpaceship();
    // to check if Fergus is hidden behind any meteor:
    isHidden = false;

let fergusW = 50;
let fergusH = 40;
let dogW = 18;
let dogH = 14;

for (let meteor of meteors) {
  let meteorX = meteor.x - meteor.r;
  let meteorY = meteor.y - meteor.r;
  let meteorW = meteor.r * 2;
  let meteorH = meteor.r * 2;

  // AABB collision for Fergus
  if (
    mouseX < meteorX + meteorW &&
    mouseX + fergusW > meteorX &&
    mouseY < meteorY + meteorH &&
    mouseY + fergusH > meteorY
  ) {
    isHidden = true;
    break;
  }

  // AABB collision for dog
  if (
    dogRescued &&
    dogPos.x < meteorX + meteorW &&
    dogPos.x + dogW > meteorX &&
    dogPos.y < meteorY + meteorH &&
    dogPos.y + dogH > meteorY
  ) {
    isHidden = true;
    break;
  }
}

    if (!dogRescued && mouseIsPressed && dist(mouseX, mouseY, dogPos.x, dogPos.y) < 30) {
      dogRescued = true;
    }
    if (
      mouseIsPressed &&            // require mouse held
      dogRescued &&                // only after dog is rescued
      dist(mouseX, mouseY, shipPos.x, shipPos.y) < 30 &&      // Fergus near ship
      dist(dogPos.x, dogPos.y, shipPos.x, shipPos.y) < 30     // Dog near ship
    ) {
      gameState = "win";
    }

    drawWinGame();

    if (mouseIsPressed) {
      drawFergus();
    };
    // } else {
    //   drawFergusShip();
    // }
    
    moveFergusShip();
    drawFergusShip();

    if (dist(mouseX, mouseY, 50, 400) < 15){
      drawWinGame();
      drawFergusShip();
    } else {
      drawStarfield1();
      drawMeteors();
      drawText();
      drawSpaceship();

      if (isHidden) {
        push();
        textAlign(CENTER);
        fill(180, 129, 37);
        textSize(12);
        text("You are hidden!", mouseX, mouseY - 50);
        drawDog();
        drawMeteors();
        pop();
      }else{
        drawMeteors();
        drawDog();
      }

      drawVoid();

      moveDog();
      //drawDog();
      if (dogRescued) {
        push();
        fill(242, 166, 73);
        textAlign(CENTER);
        textSize(12);
        text("You rescued your dog!\n Now get the two of you back to your ship!", width / 2, height-50);
        pop();
      }
    }
  } else if (gameState === "win") {
    drawWinScreen();
  }
}




const phases = [
  {
    message:
      "......................",
    barDoodad: ".",
    timeout: 5 * 60,
    kineticRate: 0.5,
    startTime: 0,
  },
  {
    message:
      "Ship: CRITICAL SYSTEM FAILURE! ENGINES HAVE BEEN HIT BY VOID REAPERS. PREPARE FOR IMMEDIATE SEAT EJECTION.",
    barDoodad: "🛸",
    font: 'Courier New',
    timeout: 12 * 60,
    kineticRate: 5,
    startTime: 0,
  },
  {
    message: 
      "BOOM!",
    font: 'Courier New',
    barDoodad: "💥",
    timeout: 2 * 60,
    kineticRate: 11,
    startTime: 0,
    
  },
  {
    message:
      "Where am I? What happened? \nWhere is my dog?\n I need to find him and get us back to our ship!",
    font: 'Courier New',
    barDoodad: "",
  timeout: 5*60,
  kineticRate: 3,
  startTime: 0,
  },
  {
    message:
      "CLICK AND HOLD ANYWHERE TO START PLAYING. Remember to keep moving!",
    font: 'Courier New',
    barDoodad: "",
  timeout: 15*60,
  kineticRate: 3,
  startTime: 0,
  },
  {
    message:
      "",
    barDoodad: "",
  timeout: 500*60,
  kineticRate: 100,
  startTime: 0,
  },
];

let currentPhaseIndex = 0;
let goToNextPhase = false;

let dragging = false

function mouseDragged() {
  dragging = true;
  shipReleased = true;  // start ship bouncing once the player clicks and holds
}

function mouseClicked(){
  if (dragging) {
    dragging = false;
  }
  else{
    goToNextPhase = true;
  }
}


function drawText() {

  let currentPhase = phases[currentPhaseIndex];
  if (
    goToNextPhase ||
    frameCount > currentPhase.timeout + currentPhase.startTime
  ) {
    currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
    currentPhase = phases[currentPhaseIndex];
    currentPhase.startTime = frameCount
    goToNextPhase = false;
  }

  const elapsed = frameCount - currentPhase.startTime;
  const numChars = elapsed / currentPhase.kineticRate;
  const txt = currentPhase.message.slice(0, numChars);
  
  push();
  if(currentPhase.font){
    textFont(currentPhase.font)
  }
  else{textFont("Times New Roman")}
  fill(50, 93, 65);
  textSize(30);
  strokeWeight(1);
  stroke(37, 72, 50);
  text(txt + currentPhase.barDoodad, windowWidth / 3.5, windowHeight / 15, windowWidth - windowWidth / 3);
  pop();

}



function drawWinGame(){
  push();
  textAlign(CENTER);
  textFont("Times New Roman");
  fill(242, 166, 73);
  textSize(30);
  text('You won!', 70, 50)
  pop();
}


function drawStarfield1() {
  let offset = width / 10;
  for (let i = 0; i < 15; i++) {
    let x = offset / 2 + i * offset;
    for (let j = 0; j < 15; j++) {
      let y = offset / 2 + j * offset;
      let stagger = 0;
      if (j % 2 == 1) {
        stagger = offset / 2;
      }
      drawStar(x + stagger, y, 7.5, 3.5);
    }
  }
}

function drawMeteors() {
  for (let meteor of meteors) {
    push();
    translate(meteor.x, meteor.y);
    fill(100);
    stroke(150);
    strokeWeight(1);
    beginShape();
    for (let pt of meteor.shape) {
      vertex(pt.x, pt.y);
    }
    endShape(CLOSE);
    pop();
  }
}

// function isCollidingAABB(ax, ay, aw, ah, bx, by, bw, bh) {
//   return (
//     ax < bx + bw &&
//     ax + aw > bx &&
//     ay < by + bh &&
//     ay + ah > by
//   );
// }

function drawStar(x, y, radI, radO) {
  push();
  k++
  if(40%k){
    fill (242, 157, 75, random(5, 50))
  }
  

  noStroke();
  translate(x + random(-0.5, +0.5), y + random(-0.5, +0.5));
  let angle = 0;
  const deltaAngle = (2 * PI) / 10;
  beginShape();
  for (let i = 0; i < 10; i++) {
    let angle = i * deltaAngle;
    const rad = i % 2 ? radI : radO; //ternary operation
    //for example if q is odd, q=3, else if q is even, q=4

    let x = rad * cos(angle);
    let y = rad * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);

  pop();
}

function drawSpaceship() {
  push();
    // Void
    push();
    stroke(81, 97, 94);
    strokeWeight(2);
    ellipseMode(CENTER);
    fill(0,0,0);
    ellipse (posI.x, posI.y, 45, 40)
    pop();
  stroke(81, 97, 94);
  strokeWeight(0.75);
  rectMode(CENTER);
  fill(22, 40, 40)
  rect(posI.x, posI.y, 10, 10);
  arc(posI.x + 5, posI.y, 20, 10, -0.5 * PI, 0.5 * PI);
  arc(posI.x - 5, posI.y, 20, 10, 0.5 * PI, -0.5 * PI);
  fill(81, 97, 94);
  arc(posI.x, posI.y - 5, 20, 10, PI, 0);
  fill(37, 72, 50);
  triangle(posI.x, posI.y + 15, posI.x + 4, posI.y + 8, posI.x - 4, posI.y + 8);
  fill(50, 93, 65);
  triangle(
    posI.x + 8,
    posI.y + 12,
    posI.x + 10,
    posI.y + 6,
    posI.x + 6,
    posI.y + 8
  );
  triangle(
    posI.x - 8,
    posI.y + 12,
    posI.x - 10,
    posI.y + 6,
    posI.x - 6,
    posI.y + 8
  );
  pop();
}

function moveSpaceship() {
  if (isHidden) {
    // If hidden, the void ship moves slowly back toward home
    let toHome = createVector(50 - posI.x, 50 - posI.y).setMag(5);
    vel = toHome;
  } else if (mouseIsPressed) {
    let toMouse = createVector(mouseX - posI.x, mouseY - posI.y).setMag(10);
    vel = toMouse;
  } else {
    let toHome = createVector(50 - posI.x, 50 - posI.y).setMag(5);
    vel = toHome;
  }
  posI.add(vel);
}

function moveDog() {
  if (!dogRescued) {
    dogPos.add(dogVel);

    // Bounce off edges
    if (dogPos.x < 0 || dogPos.x > width) {
      dogVel.x *= -1;
    }
    if (dogPos.y < 0 || dogPos.y > height) {
      dogVel.y *= -1;
    }
  } else {
    dogPos.x = lerp(dogPos.x, mouseX - 8, 0.2); // smaller offset, faster follow
    dogPos.y = lerp(dogPos.y, mouseY + 8, 0.2);
  }
}

function drawVoid() {
  push();
  stroke(81, 97, 94)
  ellipseMode(CENTER);
  fill(22, 40, 40);
  ellipse(50, 50, 200, 200);
  fill(10, 20, 20);
  ellipse(50, 50, 175, 175);
  ellipse(50, 50, 150, 150);
  fill(0,0,0);
  ellipse(50, 50, 100, 100);
  pop();
}

function drawFergus() {
    push();
    stroke(180, 129, 37);
    strokeWeight(2);
    fill(140, 63, 13);
    ellipse(mouseX, mouseY, 9, 11); //body
    line(mouseX + 5.5, mouseY, mouseX + 8, mouseY - 3);
    line(mouseX - 5.5, mouseY, mouseX - 8, mouseY - 3);
    line(mouseX + 5.5, mouseY + 4, mouseX + 4, mouseY + 6);
    line(mouseX - 5.5, mouseY + 4, mouseX - 4, mouseY + 6);
    ellipse(mouseX, mouseY - 6, 8, 9); //head
    pop();
    push();
    stroke(180, 129, 37, 20);
    fill(163, 201, 250, 40);
    ellipse(mouseX, mouseY - 6, 10, 10);
    pop();
}


function drawDog() {
  push();
  beginShape();
  stroke(140, 63, 13);
  strokeWeight(1.7);
  fill(180, 129, 37);
  ellipseMode(CENTER);
  ellipse(dogPos.x, dogPos.y, 12, 8);
  arc(dogPos.x-10, dogPos.y-5, 5, 5, 0.8*PI, 0.25*PI);
  ellipse(dogPos.x-6, dogPos.y-3, 7, 7);
  line(dogPos.x+6, dogPos.y+3, dogPos.x+6.5, dogPos.y+6);
  line(dogPos.x-4, dogPos.y+3, dogPos.x-4.5, dogPos.y+6);
  line(dogPos.x-1.5, dogPos.y+4, dogPos.x-1, dogPos.y+6);
  line(dogPos.x+3.5, dogPos.y+3, dogPos.x+4, dogPos.y+6);
  arc(dogPos.x+9, dogPos.y-3, 7, 5, 0.15*PI, 0.75*PI);
  arc(dogPos.x-2, dogPos.y-4, 5, 5, 1.2*PI, 0.25*PI);
  endShape();
  pop();
}

function drawFergusShip() {
  let x = shipReleased ? shipPos.x : mouseX;
  let y = shipReleased ? shipPos.y : mouseY;

  push();
  stroke(140, 63, 13);
  strokeWeight(0.75);
  rectMode(CENTER);
  fill(242, 166, 73);
  rect(x, y, 10, 10);
  arc(x + 5, y, 20, 10, -0.5 * PI, 0.5 * PI);
  arc(x - 5, y, 20, 10, 0.5 * PI, -0.5 * PI);
  fill(81, 97, 94);
  arc(x, y - 5, 20, 10, PI, 0);
  fill(255, 210, 250);
  arc(x, y + 8, 5, 8, 0, PI);
  arc(x + 6, y + 7.5, 3, 6, 0, PI);
  arc(x - 6, y + 7.5, 3, 6, 0, PI);
  pop();

  // Underglow
  push();
  noStroke();
  fill(255, 210, 250, 50); // soft glow
  ellipse(x, y + 10, 20, 5);
  pop();
}

// function drawFergusShip() {
//   push();
//   stroke(140, 63, 13);
//   strokeWeight(0.75);
//   rectMode(CENTER);
//   fill(242, 166, 73)
//   rect(shipPos.x, shipPos.y, 10, 10);
//   arc(shipPos.x + 5, shipPos.y, 20, 10, -0.5 * PI, 0.5 * PI);
//   arc(shipPos.x - 5, shipPos.y, 20, 10, 0.5 * PI, -0.5 * PI);
//   fill(81, 97, 94);
//   arc(shipPos.x, shipPos.y - 5, 20, 10, PI, 0);
//   fill(255, 210, 250);
//   arc(shipPos.x, shipPos.y + 8, 5, 8, 0, PI);
//   fill(255, 210, 250);
//   arc(shipPos.x + 6, shipPos.y + 7.5, 3, 6, 0, PI);
//   arc(shipPos.x - 6, shipPos.y + 7.5, 3, 6, 0, PI);
//   pop();
//    // Underglow
//   push();
//   noStroke();
//   fill(255, 210, 250, 50); // soft glow
//   ellipse(shipPos.x, shipPos.y + 10, 20, 5);
//   pop();
// }

function moveFergusShip() {
  shipPos.add(shipVel);

  if (shipPos.x < 0 || shipPos.x > width) {
    shipVel.x *= -1;
  }
  if (shipPos.y < 0 || shipPos.y > height) {
    shipVel.y *= -1;
  }
}
