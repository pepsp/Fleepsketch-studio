window.addEventListener('load', () => {
    const pencilCanvas = document.querySelector('#pencilCanvas');
    const brushCanvas = document.querySelector('#brushCanvas');
    const toolBtns = document.querySelectorAll('.tool-controls-container .control-button');
    const container = document.getElementById('board');
    const pencilBtns = document.getElementById('');

    let currentTool = 'pencil';
    let currentWidth = 5;

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

    // Crear un patrón pixelado
    function createSquarePattern(ctx) {
        const patternCanvas = document.createElement('canvas');
        patternCanvas.width = 10;
        patternCanvas.height = 10;
        const patternCtx = patternCanvas.getContext('2d');

        // Dibujar un patrón pixelado
        patternCtx.fillStyle = '#ccc'; // Gris claro
        patternCtx.fillRect(0, 0, 10, 10);
        patternCtx.fillStyle = '#888'; // Gris intermedio
        patternCtx.fillRect(5, 0, 5, 5);
        patternCtx.fillStyle = '#444'; // Gris oscuro
        patternCtx.fillRect(0, 5, 5, 5);

        return ctx.createPattern(patternCanvas, 'repeat');
    }

    const pixelPattern = createSquarePattern(brushCtx);

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

        const ctx = currentTool === 'brush' ? brushCtx : pencilCtx;
        
        ctx.lineWidth = currentWidth;
        ctx.lineCap = 'round';

        if (currentTool === 'brush') {
            ctx.strokeStyle = pixelPattern;
        } else {
            ctx.strokeStyle = '#000'; // Color sólido para el lápiz
        }

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    // Event Listeners
    toolBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover la clase 'active' de todos los botones de herramientas
            toolBtns.forEach(b => b.classList.remove('active'));
            // Agregar la clase 'active' al botón clicado
            btn.classList.add('active');
            currentTool = btn.id;
            currentWidth = btn.dataset.width;
            console.log(currentTool);
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
const patterns = {
    square: createSquarePattern,
    dot: createDotPattern
    // Agrega más patrones aquí
};

window.addEventListener('load', () => {
    const pencilCanvas = document.querySelector('#pencilCanvas');
    const brushCanvas = document.querySelector('#brushCanvas');
    const toolBtns = document.querySelectorAll('.tool-controls-container .control-button');
    const container = document.getElementById('board');

    let currentTool = 'pencil';
    let currentPattern = 'square'; // Patrón por defecto
    let currentWidth = 1;

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

        const ctx = currentTool === 'brush' ? brushCtx : pencilCtx;
        
        ctx.lineWidth = currentWidth;
        ctx.lineCap = 'round';

        if (currentTool === 'brush') {
            const pattern = patterns[currentPattern](brushCtx); // Obtener el patrón actual
            ctx.strokeStyle = pattern;
        } else {
            ctx.strokeStyle = '#000'; // Color sólido para el lápiz
        }

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    // Event Listeners
    toolBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover la clase 'active' de todos los botones de herramientas
            toolBtns.forEach(b => b.classList.remove('active'));
            // Agregar la clase 'active' al botón clicado
            btn.classList.add('active');
            currentTool = btn.id;
            currentWidth = btn.dataset.width;
            currentPattern = btn.dataset.pattern; // Obtener el patrón del botón
            console.log(currentTool);
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
