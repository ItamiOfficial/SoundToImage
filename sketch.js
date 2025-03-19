var sound;
var fft;

// Sampling FFT
const bands = 256;
const totalSampleCount = 64;
var bandResolution = 2;
var previousSampleTime;

// Audio
var volume = 0.4;
var playSong = false;

// visual
// var bgColor = '#FCFAEE';
var bgColor = 45;
var c1;
var c2;
var alphaMultiplier = 2;

function preload(){
  sound = loadSound('audio/s80s.wav');
}

function mousePressed(){
  background(bgColor);
  c1 = color("#FFC1B4");
  c2 = color("#007074");
  
  // Sound
  previousSampleTime = 0.0;
  sound.stop();
  sound.amp(volume);
  sound.play();

  playSong = true;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(bgColor);

  // FFT
  fft = new p5.FFT(0.3, bands);
}


function draw() {
  if(previousSampleTime < sound.duration()){
    drawCircle({x: width / 2, y: height / 2}, sound.duration(), sound.currentTime(), previousSampleTime);
  }
}

function drawCircle(center, totalSongLength, currentTime, prevTime){
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
    for (var i = 0; i < sliceSections; i++){
      var inner = innerCicleRadius + sectionLength * (i);
      var outer = innerCicleRadius + sectionLength * (i + 1);
       
      var p1 = rotatePoint(inner, 0 , radians(fRot));
      var p2 = rotatePoint(outer, 0 , radians(fRot));
      var p3 = rotatePoint(outer, 0 , radians(sRot));
      var p4 = rotatePoint(inner, 0 , radians(sRot));
  
      var alpha = spectrum[i] * alphaMultiplier;

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

/*
function drawCircleSection(slizeIndex, center){
  // Circle params
  const rotationAmount = 360.0 / totalSampleCount;
  const innerCicleRadius = 30; 
  const outerCircleRadius = 300;
  
  // sliceParams
  const sliceSections = bands / bandResolution;
  const sectionLength = (outerCircleRadius - innerCicleRadius) / sliceSections;
  const margin = 0;

  // fft
  fft.analyze();
  var spectrum = fft.linAverages(sliceSections);

  for (var i = 0; i < sliceSections; i++){
    var inner = innerCicleRadius + sectionLength * (i);
    var outer = innerCicleRadius + sectionLength * (i + 1);
     
    var p1 = rotatePoint(inner, 0 , radians(slizeIndex * rotationAmount));
    var p2 = rotatePoint(outer - margin, 0 , radians((slizeIndex) * rotationAmount));
    var p3 = rotatePoint(outer - margin, 0 , radians((slizeIndex + 1) * rotationAmount));
    var p4 = rotatePoint(inner, 0 , radians((slizeIndex + 1) * rotationAmount));

    console.log(slizeIndex * rotationAmount);

    fill(map(spectrum[i], 0, 255, bgColor, 255));
    noStroke();

    beginShape();
    vertex(center.x + p1.x, center.y + p1.y);
    vertex(center.x + p2.x, center.y + p2.y);
    vertex(center.x + p3.x, center.y + p3.y);
    vertex(center.x + p4.x, center.y + p4.y);
    endShape(CLOSE);
  }
}
*/

function rotatePoint(x, y, amount){
  return {
    x: cos(amount) * x - sin(amount) * y, 
    y: sin(amount) * x + cos(amount) * y
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(bgColor);
}