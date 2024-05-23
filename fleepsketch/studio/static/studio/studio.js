window.addEventListener('load', () => {
    const canvas = document.querySelector('#mycanvas');
    const container = document.getElementById('board');

    const ctx = canvas.getContext('2d');

    // Resizing
    function resizeCanvas() {
        canvas.height = container.clientHeight;
        canvas.width = container.clientWidth;
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
            draw(e); // Ensure the last point is drawn
            isDrawing = false;
            ctx.beginPath(); // Reiniciar el camino del trazo
        }
    }

    function draw(e) {
        if (!isDrawing) return;

        // Calcular la posición del mouse relativa al canvas
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        // color = ctx.strokeStyle

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    // Event Listeners
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', finishPosition);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseleave', finishPosition);
});
