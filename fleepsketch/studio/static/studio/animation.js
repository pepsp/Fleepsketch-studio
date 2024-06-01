

const frames = [{frame: 0, combined: null, pencil: null, brush: null}];
let frameCount = 0;
let currentFrameIndex = 0;




const canvas1 = document.getElementById('pencilCanvas');
const canvas2 = document.getElementById('brushCanvas');
let previousFrameBtn = document.getElementById('prev-frame');
let nextFrameBtn = document.getElementById('next-frame');
let playBtn = document.getElementById('play');
let loopBtn = document.getElementById('loop');
let speedBtn = document.getElementById('speed');
let frameDisplay = document.getElementById('frame-display');

updateFrameDisplay()

function clearCanvas(){
    let canvas1Ctx = canvas1.getContext('2d');
    let canvas2Ctx = canvas2.getContext('2d');
    canvas1Ctx.clearRect(0, 0, canvas1.width, canvas1.height);
    canvas2Ctx.clearRect(0, 0, canvas2.width, canvas2.height);
}

function convertCanvasesToImage(){
    const combinedCanvas = document.createElement('canvas');
    combinedCanvas.width = canvas2.width;
    combinedCanvas.height = canvas2.height;
    const combinedCtx = combinedCanvas.getContext('2d');
    
    combinedCtx.drawImage(canvas2, 0, 0);
    combinedCtx.drawImage(canvas1, 0, 0);
    
    const combinedImage = combinedCanvas.toDataURL('image/png');
    return { canvas1, canvas2, combinedImage };
}

function saveFrame(){
    const {canvas1, canvas2, combinedImage} = convertCanvasesToImage();
    frames[currentFrameIndex] = {
        frame: currentFrameIndex,
        combined: combinedImage,
        pencil: canvas1.toDataURL('image/png'),
        brush: canvas2.toDataURL('image/png')
    };
}

function showNextFrame() {
    saveFrame();
    if(currentFrameIndex == frameCount){
        frameCount++;
        currentFrameIndex++;
        clearCanvas()
        displayOnionSkin(currentFrameIndex - 1)
        updateFrameDisplay();
    } else {
        currentFrameIndex++;
        displayFrame(currentFrameIndex);
        updateFrameDisplay();
        displayOnionSkin(currentFrameIndex - 1)
    }

}

function showPreviousFrame(){
    if(currentFrameIndex == 0){
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
    if (frames[frame]){
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
    let onionSkinImg = document.getElementById('onion-skin');
    if(previousFrameIndex =='hide'){
        onionSkinImg.style.display = 'none';
    }else{
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




nextFrameBtn.addEventListener('click', showNextFrame);
previousFrameBtn.addEventListener('click', showPreviousFrame);


