let soundFile;
let fft;
let cnv;
let images = {};  // 이미지 객체 초기화
let loading = true; // 로딩 상태 변수
let loadingMessage = 'Loading...';

function preload() {
  // 사운드 파일 로드
  soundFile = loadSound('y2mate.com - ENGLAND ENGLAND.mp3', onSoundLoaded);

  // 이미지 파일 로드
  let imageKeys = [
    "C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4", "D4", "E4", "F4", "G4", 
    "C5", "D5", "E5", "F5", "G5", "E6"
  ];
  let imageFiles = [
    'assets/blue1.png', 'assets/green1.png', 'assets/orange1.png', 'assets/red1.png', 
    'assets/yellow1.png', 'assets/연보라1.png', 'assets/청록색1.png', 'assets/blue2.png', 
    'assets/green2.png', 'assets/orange2.png', 'assets/red2.png', 'assets/yellow2.png', 
    'assets/blue3.png', 'assets/green3.png', 'assets/orange3.png', 'assets/red3.png', 
    'assets/greenblue1.png', 'assets/greenblue3.png'
  ];

  let imagesLoaded = 0;
  let totalImages = imageKeys.length;

  function onImageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
      onAssetsLoaded();
    }
  }

  for (let i = 0; i < imageKeys.length; i++) {
    images[imageKeys[i]] = loadImage(imageFiles[i], onImageLoaded);
  }
}

function onSoundLoaded() {
  if (Object.keys(images).length === 0) {
    onAssetsLoaded();
  }
}

function onAssetsLoaded() {
  loading = false;
}

function freqToIndex(freq) {
  const nyquist = sampleRate() / 2;
  const index = Math.round(freq / nyquist * fft.bins);
  return index;
}

function setup() {
  cnv = createCanvas(3200, 1400);
  cnv.mouseClicked(togglePlay);

  fft = new p5.FFT();
  background(255);
  loadPixels(); // Initialize the pixel array

  soundFile.setVolume(0.2); // 볼륨을 0.2로 설정 (필요에 따라 조절)
}

function draw() {
  if (loading) {
    background(255);
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text(loadingMessage, width / 2, height / 2);
    return;
  }

  let spectrum = fft.analyze();

  let ranges = {
    "C3": {min: 130.81, max: 138.59},
    "D3": {min: 146.83, max: 155.56},
    "E3": {min: 164.81, max: 174.61},
    "F3": {min: 174.61, max: 185.00},
    "G3": {min: 196.00, max: 207.65},
    "A3": {min: 220.00, max: 233.08},
    "B3": {min: 246.94, max: 261.63},
    "C4": {min: 261.63, max: 277.18},
    "D4": {min: 293.66, max: 311.13},
    "E4": {min: 329.63, max: 349.23},
    "F4": {min: 349.23, max: 369.99},
    "G4": {min: 392.00, max: 415.30},
    "C5": {min: 523.25, max: 554.37},
    "D5": {min: 587.33, max: 622.25},
    "E5": {min: 659.26, max: 698.46},
    "F5": {min: 698.46, max: 739.99},
    "G5": {min: 783.99, max: 830.61},
    "E6": {min: 1318.51, max: 1396.91}
  };

  let strongestRange = null;
  let maxAmp = 0;

  for (let range in ranges) {
    let minIndex = freqToIndex(ranges[range].min);
    let maxIndex = freqToIndex(ranges[range].max);
    for (let i = minIndex; i <= maxIndex; i++) {
      if (spectrum[i] > maxAmp) {
        maxAmp = spectrum[i];
        strongestRange = range;
      }
    }
  }

  if (strongestRange) {
    let img = images[strongestRange];
    if (img) { // 이미지가 정의되었는지 확인
      let imgWidth = random(20, 100); // 무작위 너비 설정
      let imgHeight = random(20, 100); // 무작위 높이 설정
      let x = random(0, width - imgWidth);
      let y = random(0, height - imgHeight);

      image(img, x, y, imgWidth, imgHeight);
    }
  }

  fill(0);
  textSize(16);
  text('art and technology', 20, 20);
}

function togglePlay() {
  if (soundFile.isPlaying()) {
    soundFile.pause();
  } else {
    soundFile.loop();
  }
}
