function saveFrame(){

}

function toData(){
const canvas1 = document.getElementById('pencilCanvas');
const canvas2 = document.getElementById('brushCanvas');
const combinedCanvas = document.createElement('canvas');
const imgConverted = document.getElementById('imgConverted');

combinedCanvas.width = canvas2.width;
combinedCanvas.height = canvas2.height;

const combinedCtx = combinedCanvas.getContext('2d');

// Draw the first canvas onto the combined canvas
combinedCtx.globalAlpha = 0.5; // Establecer opacidad
combinedCtx.drawImage(canvas2, 0, 0);

// Draw the second canvas below the first canvas on the combined canvas
combinedCtx.drawImage(canvas1, 0, 0);

// Convert the combined canvas to a data URL (base64 encoded image)
const combinedImage = combinedCanvas.toDataURL('image/png');
imgConverted.src = combinedImage;
console.log(combinedImage);
}