// == Section : FFT Properties == //
// ============================== //
var sound;
var fft;

const bands = 256;
const totalSampleCount = 64;
var bandResolution = 2;
var previousSampleTime;

// Audio
var volume = 1;
var playSong = false;

// == Section : Visual Properties == //
// ================================= //
var bgColor = 45;
var c1;
var c2;
var alphaMultiplier = 1;

function preload() {
  sound = loadSound('audio/s80s.wav');
}

// == Section : p5.js Functions == //
// =============================== //
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(bgColor);

  // FFT (Smoothing, bands)
  fft = new p5.FFT(0.6, bands);
}


function draw() {
  if (previousSampleTime < sound.duration()) {
    drawCircle({ x: width / 2, y: height / 2 }, sound.duration(), sound.currentTime(), previousSampleTime);
  }
}

function drawCircle(center, totalSongLength, currentTime, prevTime) {
  // Circle params
  const fRot = 360.0 * (prevTime / totalSongLength);
  const sRot = 360.0 * (currentTime / totalSongLength);
  const innerCicleRadius = 50;
  const outerCircleRadius = 350;

  // sliceParams
  const sliceSections = bands / bandResolution;
  const sectionLength = (outerCircleRadius - innerCicleRadius) / sliceSections;

  // fft
  fft.analyze();
  var spectrum = fft.linAverages(sliceSections);
  previousSampleTime = sound.currentTime();

  // rendering
  for (var i = 0; i < sliceSections; i++) {
    var inner = innerCicleRadius + sectionLength * (i);
    var outer = innerCicleRadius + sectionLength * (i + 1);

    var p1 = rotatePoint(inner, 0, radians(fRot));
    var p2 = rotatePoint(outer, 0, radians(fRot));
    var p3 = rotatePoint(outer, 0, radians(sRot));
    var p4 = rotatePoint(inner, 0, radians(sRot));

    var alpha = spectrum[i] * alphaMultiplier * volume;

    c1.setAlpha(alpha);
    c2.setAlpha(alpha);

    fill(lerpColor(c1, c2, (1.0 / sliceSections) * i));
    //fill(map(spectrum[i], 0, 255, bgColor, 255));
    noStroke();

    beginShape();
    vertex(center.x + p1.x, center.y + p1.y);
    vertex(center.x + p2.x, center.y + p2.y);
    vertex(center.x + p3.x, center.y + p3.y);
    vertex(center.x + p4.x, center.y + p4.y);
    endShape(CLOSE);
  }
}

// == Section : Input == //
// ===================== //
/*
 *  Rotates a Point around (0,0) 
 *  x & y are the point Coordinates and amount is the degree in radians [0 - 2PI]
*/
function rotatePoint(x, y, amount) {
  return {
    x: cos(amount) * x - sin(amount) * y,
    y: sin(amount) * x + cos(amount) * y
  }
}

// == Section : Input == //

function mousePressed() {
  if (mouseButton === LEFT) {
    background(bgColor);
    c1 = color("#FFC1B4");
    c2 = color("#007074");

    // Sound
    previousSampleTime = 0.0;
    sound.stop();
    sound.amp(volume);
    sound.play();

    playSong = true;
  } else {
    sound.stop();
  }
}

// == Section : Resizing == //

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(bgColor);
}