import { availablePatterns, getPattern, setCustomCursor, generatePatternList } from './patterns.js';
import { saveFrame } from './animation.js';

document.addEventListener('DOMContentLoaded', () => {
    generatePatternList(availablePatterns);

    const pencilCanvas = document.querySelector('#pencilCanvas');
    const brushCanvas = document.querySelector('#brushCanvas');
    const animationCanvas = document.getElementById('animation-displayer');
    
    const canvases = document.querySelectorAll('canvas');
    const toolBtns = document.querySelectorAll('.tool-controls-container .control-button');
    const sizeSelector = document.querySelectorAll('.sizes-container .size');
    const container = document.getElementById('board');
    const colorTool = document.querySelectorAll('.colors .option');
    const pencilColorTool = document.getElementById('pencil-colors-div');
    const brushColorTool = document.getElementById('brush-colors-div');
    const pencilDefault = document.getElementById('pencil-default');
    const brushDefault = document.getElementById('brush-default');
    const clearBtn = document.getElementById('clear');
    const pencilSizeDefault = document.getElementById('pencil-size-default');
    const brushSizeDefault = document.getElementById('brush-size-default');
    const pencilSizes = document.getElementById('pencil-sizes');
    const brushSizes = document.getElementById('brush-sizes');
    const hide = document.querySelector('#hidden');
    const patternTrigger = document.querySelector('.trigger-container');
    const divPatterns = document.getElementById('patterns-container');
    const editBtns =  document.querySelectorAll('.edit');
    const editPanel =  document.getElementById('edit-panel');
    const toolsContainer  = document.getElementById('tools');
    const actionsContainer = document.getElementById('actions');
    const canvasContainer = document.getElementById('canvas-stuff');
    let patterns;
   


    let currentPattern = 'square-sm';
    let pencilColor = "#000000";
    let brushColor = "#000000";
    let currentTool = 'pencil';
    let currentWidth = 1;
    let isEditing = false;


    canvases.forEach(canvas => {
        setCustomCursor(canvas, currentWidth);
    });

    const pencilCtx = pencilCanvas.getContext('2d');
    const brushCtx = brushCanvas.getContext('2d');    
    const animationCtx = animationCanvas.getContext('2d'); // Añadido

    function resizeCanvas() {
        const containerHeight = container.clientHeight;
        const containerWidth = container.clientWidth;

        pencilCanvas.height = containerHeight;
        pencilCanvas.width = containerWidth;
        brushCanvas.height = containerHeight;
        brushCanvas.width = containerWidth;
        animationCanvas.height = containerHeight; // Añadido
        animationCanvas.width = containerWidth; // Añadido
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let isDrawing = false;

    function startPosition(e) {
        isDrawing = true;
        draw(e);
    }

    function finishPosition(e) {
        if (isDrawing) {
            draw(e);
            isDrawing = false;
            pencilCtx.beginPath();
            brushCtx.beginPath();
        }
    }

    function draw(e) {
        if (!isDrawing) return;

        const rect = pencilCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (currentTool === 'eraser') {
            pencilCtx.globalCompositeOperation = 'destination-out';
            brushCtx.globalCompositeOperation = 'destination-out';

            pencilCtx.lineWidth = currentWidth;
            brushCtx.lineWidth = currentWidth;
            pencilCtx.lineCap = 'round';
            brushCtx.lineCap = 'round';

            pencilCtx.lineTo(x, y);
            brushCtx.lineTo(x, y);

            pencilCtx.stroke();
            brushCtx.stroke();

            pencilCtx.beginPath();
            brushCtx.beginPath();

            pencilCtx.moveTo(x, y);
            brushCtx.moveTo(x, y);

            pencilCtx.globalCompositeOperation = 'source-over';
            brushCtx.globalCompositeOperation = 'source-over';
        } else {
            const ctx = currentTool === 'brush' ? brushCtx : pencilCtx;

            ctx.lineWidth = currentWidth;
            
            canvases.forEach(canvas => {
                setCustomCursor(canvas, currentWidth);
            });

            ctx.lineCap = 'round';

            if (currentTool === 'brush') {
                ctx.strokeStyle = getPattern(ctx, currentPattern, brushColor);
            } else {
                ctx.strokeStyle = pencilColor;
            }

            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
    }

    function applyPattern(ctx, patternName, baseColor) {
        const pattern = getPattern(ctx, patternName, baseColor);
        ctx.fillStyle = pattern;
    }

    clearBtn.addEventListener('click', () => {
        pencilCtx.clearRect(0, 0, pencilCanvas.width, pencilCanvas.height);
        brushCtx.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
    });

    toolBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toolBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (btn.id == 'pencil') {
                sizeSelector.forEach(b => b.classList.remove('current-brush'));
                pencilSizeDefault.classList.add('current-brush');
                patternTrigger.classList.add('not-active');
                divPatterns.classList.add('not-active');

                pencilColorTool.classList.remove('not-active');
                pencilSizes.classList.remove('not-active');
                hide.classList.remove('not-active');

                brushSizes.classList.add('not-active');
                brushColorTool.classList.add('not-active');
                colorTool.forEach(b => b.classList.remove('selected'));
                pencilDefault.classList.add('selected');
                pencilColor = '#000000';
            } else if (btn.id == 'brush') {
                brushColorTool.classList.remove('not-active');
                brushSizes.classList.remove('not-active');

                //patern trigger
                patternTrigger.classList.remove('not-active');

                pencilColorTool.classList.add('not-active');
                pencilSizes.classList.add('not-active');

                sizeSelector.forEach(b => b.classList.remove('current-brush'));
                brushSizeDefault.classList.add('current-brush');

                colorTool.forEach(b => b.classList.remove('selected'));
                brushDefault.classList.add('selected');
                brushColor = '#000000';
            } else if (btn.id == 'eraser') {
                divPatterns.classList.add('not-active');
                pencilColorTool.classList.add('not-active');
                patternTrigger.classList.add('not-active');
                brushColorTool.classList.add('not-active');
                pencilSizes.classList.add('not-active');
                brushSizes.classList.add('not-active');
                colorTool.forEach(b => b.classList.remove('selected'));
                pencilSizeDefault.classList.add('current-brush');
                brushSizeDefault.classList.add('current-brush');
                pencilDefault.classList.add('selected');
                brushDefault.classList.add('selected');
                hide.classList.remove('not-active');

            }

            currentTool = btn.id;
            currentWidth = btn.dataset.width;

            canvases.forEach(canvas => {
                setCustomCursor(canvas, currentWidth);
            });
        });
    });

    colorTool.forEach(btn => {
        btn.addEventListener('click', () => {
            colorTool.forEach(b => b.classList.remove('selected'));
            if (btn.dataset.tool === 'pencil') {
                pencilColor = btn.dataset.color;
            } else if (btn.dataset.tool === 'brush') {
                brushColor = btn.dataset.color;
                applyPattern(brushCtx, currentPattern, brushColor);
            }
            btn.classList.add('selected');
        });
    });

    sizeSelector.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeSelector.forEach(b => b.classList.remove('current-brush'));
            currentWidth = btn.dataset.size;

            canvases.forEach(canvas => {
                setCustomCursor(canvas, currentWidth);
            });
            
            btn.classList.add('current-brush');
        });
    });

    patternTrigger.addEventListener('click', () => {
        divPatterns.classList.toggle('not-active');
        
        hide.classList.add('not-active')
        patterns = document.querySelectorAll('#brush-patterns li');
        patterns.forEach(btn => {
            btn.addEventListener('click', () => {
                currentPattern = btn.dataset.pattern;
                applyPattern(brushCtx, currentPattern, brushColor);
                divPatterns.classList.add('not-active');
                hide.classList.remove('not-active');

            });
        });
    });

    editBtns.forEach(editBtn => {
        editBtn.addEventListener('click', () => {
            if (isEditing == false) {
                isEditing = true;
                console.log(isEditing);
                toolsContainer.classList.add('not-active');
                actionsContainer.classList.add('not-active');
                canvasContainer.style.display = 'none';
                editPanel.classList.remove('not-active');
                


            } else if (isEditing == true) {
                isEditing = false;
                console.log(isEditing);
                editPanel.classList.add('not-active');
                toolsContainer.classList.remove('not-active');
                actionsContainer.classList.remove('not-active');
                canvasContainer.style.display = 'flex';
            }
        });
    });


    pencilCanvas.addEventListener('mousedown', startPosition);
    pencilCanvas.addEventListener('mouseup', finishPosition);
    pencilCanvas.addEventListener('mouseup', saveFrame);
    pencilCanvas.addEventListener('mousemove', draw);
    pencilCanvas.addEventListener('mouseleave', finishPosition);

    brushCanvas.addEventListener('mousedown', startPosition);
    brushCanvas.addEventListener('mouseup', finishPosition);
    brushCanvas.addEventListener('mousemove', draw);
    brushCanvas.addEventListener('mouseleave', finishPosition);
});
