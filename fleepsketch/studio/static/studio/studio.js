import { getPattern } from './patterns.js';
import { setCustomCursor } from './patterns.js';

document.addEventListener('DOMContentLoaded', () => {
    const pencilCanvas = document.querySelector('#pencilCanvas');
    const brushCanvas = document.querySelector('#brushCanvas');
    const canvases = document.querySelectorAll('canvas');
    const toolBtns = document.querySelectorAll('.tool-controls-container .control-button');
    const container = document.getElementById('board');
    const colorTool = document.querySelectorAll('.colors .option');
    const pencilColorTool = document.getElementById('pencil-colors-div');
    const brushColorTool = document.getElementById('brush-colors-div')
    const pencilDefault = document.getElementById('pencil-default');
    const brushDefault = document.getElementById('brush-default');
    const clearBtn = document.getElementById('clear');

    let pencilColor = "#000000";
    let brushColor = "#000000";

    let currentTool = 'pencil';
    let currentWidth = 5;
    
    canvases.forEach(canvas => {
        setCustomCursor(canvas, currentWidth);
    });

    const pencilCtx = pencilCanvas.getContext('2d');
    const brushCtx = brushCanvas.getContext('2d');    

    // Resizing
    function resizeCanvas() {
        pencilCanvas.height = container.clientHeight;
        pencilCanvas.width = container.clientWidth;
        brushCanvas.height = container.clientHeight;
        brushCanvas.width = container.clientWidth;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Variables
    let isDrawing = false;

    function startPosition(e) {
        isDrawing = true;
        draw(e); // Iniciar el trazo inmediatamente al hacer clic
    }

    function finishPosition(e) {
        if (isDrawing) {
            draw(e); // Asegurarse de dibujar el último punto
            isDrawing = false;
            pencilCtx.beginPath(); // Reiniciar el camino del trazo
            brushCtx.beginPath();
        }
    }

    function draw(e) {
        if (!isDrawing) return;

        // Calcular la posición del mouse relativa al canvas
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
                ctx.strokeStyle = getPattern(ctx, 'square', brushColor); // Usar el patrón aquí
            } else {
                ctx.strokeStyle = pencilColor; // Color sólido para el lápiz
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

    // Event Listeners

    clearBtn.addEventListener('click', () => {
        pencilCtx.clearRect(0, 0, pencilCanvas.width, pencilCanvas.height);
        brushCtx.clearRect(0,0, brushCanvas.width, brushCanvas.height);
    })

    toolBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover la clase 'active' de todos los botones de herramientas
            toolBtns.forEach(b => b.classList.remove('active'));
            // Agregar la clase 'active' al botón clicado
            btn.classList.add('active');
            
            if(btn.id == 'pencil'){
                pencilColorTool.classList.remove('not-active');
                brushColorTool.classList.add('not-active');
                colorTool.forEach(b => b.classList.remove('selected'));
                pencilDefault.classList.add('selected')
                pencilColor='#000000';
            }else if(btn.id == 'brush'){
                brushColorTool.classList.remove('not-active');
                pencilColorTool.classList.add('not-active');
                brushDefault.classList.add('selected');
                brushColor='#000000';
            }else if(btn.id == 'eraser'){
                pencilColorTool.classList.add('not-active');
                brushColorTool.classList.add('not-active');
            }
            currentTool = btn.id;
            currentWidth = btn.dataset.width;
            canvases.forEach(canvas => {
                setCustomCursor(canvas, currentWidth);
            });
        
            console.log(currentTool);
        });
    });

    colorTool.forEach(btn => {
        btn.addEventListener('click', () => {
            colorTool.forEach(b => b.classList.remove('selected'));
            if (btn.dataset.tool === 'pencil') {
                pencilColor = btn.dataset.color;
                
            } else if (btn.dataset.tool === 'brush') {
                brushColor = btn.dataset.color;
                applyPattern(brushCtx, 'square', brushColor);
            }
            btn.classList.add('selected')
        });
    });

    pencilCanvas.addEventListener('mousedown', startPosition);
    pencilCanvas.addEventListener('mouseup', finishPosition);
    pencilCanvas.addEventListener('mousemove', draw);
    pencilCanvas.addEventListener('mouseleave', finishPosition);

    brushCanvas.addEventListener('mousedown', startPosition);
    brushCanvas.addEventListener('mouseup', finishPosition);
    brushCanvas.addEventListener('mousemove', draw);
    brushCanvas.addEventListener('mouseleave', finishPosition);
});
