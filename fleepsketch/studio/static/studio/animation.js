const frames = [{ frame: 0, combined: null, pencil: null, brush: null }];
const finalFrames = [];
let frameCount = 0;
let currentFrameIndex = 0;
let isPlaying = false;
let speedLvl = 1;
let playbackSpeed = 500; // 500 ms per frame
let frameRate =  1000 / playbackSpeed;
console.log(frameRate)
let loop = true;
let onionSkin = true;

const canvas1 = document.getElementById('pencilCanvas');
const canvas2 = document.getElementById('brushCanvas');
const animationCanvas = document.getElementById('animation-displayer');
const onionSkinImg = document.getElementById('onion-skin');
const saveBtn = document.getElementById('save');


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

    combinedCtx.fillStyle = '#FFF'; // Color blanco
    combinedCtx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);

    combinedCtx.drawImage(canvas2, 0, 0);
    combinedCtx.drawImage(canvas1, 0, 0);

    const combinedImage = combinedCanvas.toDataURL('image/png');
    return { canvas1, canvas2, combinedImage };
}

export function saveFrame() {
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
        updateFrameDisplay();
        displayOnionSkin(currentFrameIndex);
        console.log(frames);
    } else {
        currentFrameIndex++;
        displayFrame(currentFrameIndex);
        updateFrameDisplay();
    }
}

function showPreviousFrame() {
    if(currentFrameIndex == 0){
        return
    }else{
        saveFrame();
        currentFrameIndex--;
        displayFrame(currentFrameIndex);
        updateFrameDisplay();
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
        displayOnionSkin(currentFrameIndex);

    } else {
        return;
    }
}

function updateFrameDisplay() {
    frameDisplay.textContent = `${currentFrameIndex + 1} / ${frameCount + 1}`;
}

function displayOnionSkin(previousFrameIndex) {
    previousFrameIndex-=1;
    if(onionSkin == false || previousFrameIndex < 0){
        onionSkinImg.style.display = 'none';
        return;
    }else{
    onionSkinImg.style.display = 'block';
    const previousFrameData = frames[previousFrameIndex];
    if (previousFrameData) {
        onionSkinImg.src = previousFrameData.combined;
        onionSkinImg.width = canvas2.width;
        onionSkinImg.height = canvas2.height;
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

    updateFrameDisplay();

    currentFrameIndex++;
    if (currentFrameIndex > frameCount) {
        if (loop) {
            currentFrameIndex = 0;
        } else {
            stopAnimation();
            playIcon.src = 'static/studio/icons/play.svg'
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
        onionSkinImg.style.display = 'none';
        animationCanvas.style.display = 'block';
        playIcon.src = 'static/studio/icons/pause.svg'
    }
}

function stopAnimation() {
    if (isPlaying) {
        isPlaying = false;
        cancelAnimationFrame(currentFrameIndex);
        
        canvas1.style.display = 'block';
        canvas2.style.display = 'block';
        onionSkinImg.style.display = 'block';
        animationCanvas.style.display = 'none';

        const animationCtx = animationCanvas.getContext('2d');
        animationCtx.clearRect(0, 0, animationCanvas.width, animationCanvas.height);
        
        playIcon.src = 'static/studio/icons/play.svg';
        currentFrameIndex = 0;
        displayFrame(currentFrameIndex);
        updateFrameDisplay();
    }
}


function getCookies() {
    return document.cookie.split(';').reduce((cookies, cookie) => {
        const [name, value] = cookie.trim().split('=').map(decodeURIComponent);
        try {
            return {
                ...cookies,
                [name]: JSON.parse(value)
            };
        } catch (e) {
            return {
                ...cookies,
                [name]: value
            };
        }
    }, {});
}

async function downloadVideo() {
    // Assuming playbackSpeed and frames are defined globally or passed to this function
    const frameRate = 1000 / playbackSpeed;

    const finalFrames = [];
    frames.forEach(frame => {
        finalFrames.push(frame.combined);
    });

    const data = {
        finalFrames: finalFrames.map(frame => frame.split(',')[1]),
        frameRate: frameRate
    };

    const cookies = getCookies(); // Get cookies

    try {
        const response = await fetch('/process_frames/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies['csrftoken'] // Example: Adding a CSRF token from cookies, if required
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to process frames:', errorData.error);
            return;
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'animation.mp4';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error while downloading video:', error);
    }
}



nextFrameBtn.addEventListener('click', showNextFrame);
previousFrameBtn.addEventListener('click', showPreviousFrame);
saveBtn.addEventListener('click', () =>{
    frameRate = 1000 / playbackSpeed;
    downloadVideo();
})




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
    } else if (event.key === ' ') {
        if (isPlaying) {
            stopAnimation();
        } else {
            startAnimation();
        }
    }
});