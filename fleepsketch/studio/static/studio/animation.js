const frames = [{ frame: 0, combined: null, pencil: null, brush: null }];
let frameCount = 0;
let currentFrameIndex = 0;
let isPlaying = false;
let speedLvl = 1;
let playbackSpeed = 500; // 500 ms per frame
let loop = true;
let onionSkin = true;

const canvas1 = document.getElementById('pencilCanvas');
const canvas2 = document.getElementById('brushCanvas');
const animationCanvas = document.getElementById('animation-displayer');

let previousFrameBtn = document.getElementById('prev-frame');
let nextFrameBtn = document.getElementById('next-frame');

let playBtn = document.getElementById('play-container');
let playIcon = document.getElementById('play-icon');

let loopBtn = document.getElementById('loop-container');
let loopIcon = document.getElementById('loop-icon');

let speedBtn = document.getElementById('speed-container');
let speedIcon = document.getElementById('speed-display');

let frameDisplay = document.getElementById('frame-display');

updateFrameDisplay();

function clearCanvas() {
    let canvas1Ctx = canvas1.getContext('2d');
    let canvas2Ctx = canvas2.getContext('2d');
    canvas1Ctx.clearRect(0, 0, canvas1.width, canvas1.height);
    canvas2Ctx.clearRect(0, 0, canvas2.width, canvas2.height);
}

function convertCanvasesToImage() {
    const combinedCanvas = document.createElement('canvas');
    combinedCanvas.width = canvas2.width;
    combinedCanvas.height = canvas2.height;
    const combinedCtx = combinedCanvas.getContext('2d');

    combinedCtx.drawImage(canvas2, 0, 0);
    combinedCtx.drawImage(canvas1, 0, 0);

    const combinedImage = combinedCanvas.toDataURL('image/png');
    return { canvas1, canvas2, combinedImage };
}

function saveFrame() {
    const { canvas1, canvas2, combinedImage } = convertCanvasesToImage();
    frames[currentFrameIndex] = {
        frame: currentFrameIndex,
        combined: combinedImage,
        pencil: canvas1.toDataURL('image/png'),
        brush: canvas2.toDataURL('image/png')
    };
}

function showNextFrame() {
    saveFrame();
    if (currentFrameIndex == frameCount) {
        frameCount++;
        currentFrameIndex++;
        clearCanvas();
        displayOnionSkin(currentFrameIndex - 1);
        updateFrameDisplay();
    } else {
        currentFrameIndex++;
        displayFrame(currentFrameIndex);
        updateFrameDisplay();
        displayOnionSkin(currentFrameIndex - 1);
    }
}

function showPreviousFrame() {
    if (currentFrameIndex == 0) {
        displayOnionSkin('hide');
        return;
    } else {
        saveFrame();
        currentFrameIndex--;
        displayFrame(currentFrameIndex);
        updateFrameDisplay();
        displayOnionSkin(currentFrameIndex - 1);
    }
}

function displayFrame(frame) {
    if (frames[frame]) {
        const frameData = frames[frame];

        const pencilImage = new Image();
        const brushImage = new Image();

        pencilImage.onload = () => {
            const pencilCanvas = document.getElementById('pencilCanvas');
            const pencilCtx = pencilCanvas.getContext('2d');
            pencilCtx.clearRect(0, 0, pencilCanvas.width, pencilCanvas.height);
            pencilCtx.drawImage(pencilImage, 0, 0);
        };

        brushImage.onload = () => {
            const brushCanvas = document.getElementById('brushCanvas');
            const brushCtx = brushCanvas.getContext('2d');
            brushCtx.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
            brushCtx.drawImage(brushImage, 0, 0);
        };

        pencilImage.src = frameData.pencil;
        brushImage.src = frameData.brush;

    } else {
        return;
    }
}

function updateFrameDisplay() {
    frameDisplay.textContent = `${currentFrameIndex + 1} / ${frameCount + 1}`;
}

function displayOnionSkin(previousFrameIndex) {
    if(onionSkin == false){
        return;
    }else{
        let onionSkinImg = document.getElementById('onion-skin');
        if (previousFrameIndex == 'hide') {
            onionSkinImg.style.display = 'none';
        } else {
            const previousFrameData = frames[previousFrameIndex];
            if (previousFrameData) {
                onionSkinImg.src = previousFrameData.combined;
                onionSkinImg.style.display = 'block';
                onionSkinImg.width = canvas2.width;
                onionSkinImg.height = canvas2.height;
            } else {
                onionSkinImg.style.display = 'none';
            }
        }
    }
}

function toggleLoop() {
    console.log(loop)
    loop = !loop;
    loopIcon.src = loop ? "static/studio/icons/loop.svg" : "static/studio/icons/continue.svg";
}

function changeSpeed() {
    speedLvl++;
    if(speedLvl > 3){
        speedLvl = 1;
    }

    if(speedLvl == 1){
        playbackSpeed = 500;
        speedIcon.textContent = 'X1';
    }else if(speedLvl == 2){
        playbackSpeed = 300;
        speedIcon.textContent = 'X2';
    }else if(speedLvl == 3){
        playbackSpeed = 100;
        speedIcon.textContent = 'X3';
    }
    console.log('Speed LVL: ', speedLvl);
    console.log('Playback speed: ', playbackSpeed,'ms');
}

function loadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
    });
}

async function updateAnimation() {
    if (!isPlaying) return;

    const frameData = frames[currentFrameIndex];
    if (frameData) {
        const combinedImage = await loadImage(frameData.combined);
        const animationCtx = animationCanvas.getContext('2d');
        animationCtx.clearRect(0, 0, animationCanvas.width, animationCanvas.height);
        animationCtx.drawImage(combinedImage, 0, 0);
    }

    currentFrameIndex++;
    if (currentFrameIndex >= frames.length) {
        if (loop) {
            currentFrameIndex = 0;
        } else {
            stopAnimation();
            return;
        }
    }

    setTimeout(() => {
        requestAnimationFrame(updateAnimation);
    }, playbackSpeed);
}

function startAnimation() {
    if (!isPlaying) {
        isPlaying = true;
        updateAnimation();
        canvas1.style.display = 'none';
        canvas2.style.display = 'none';
        animationCanvas.style.display = 'block';
    }
}

function stopAnimation() {
    if (isPlaying) {
        isPlaying = false;
        cancelAnimationFrame(currentFrameIndex);
        canvas1.style.display = 'block';
        canvas2.style.display = 'block';
        animationCanvas.style.display = 'none';
        displayFrame(currentFrameIndex);
    }
}

nextFrameBtn.addEventListener('click', showNextFrame);
previousFrameBtn.addEventListener('click', showPreviousFrame);
playBtn.addEventListener('click', () => {
    if (isPlaying) {
        stopAnimation();
    } else {
        startAnimation();
    }
});
loopBtn.addEventListener('click', toggleLoop);
speedBtn.addEventListener('click', changeSpeed);

document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') {
        showNextFrame();
    } else if (event.key === 'ArrowLeft') {
        showPreviousFrame();
    }
});