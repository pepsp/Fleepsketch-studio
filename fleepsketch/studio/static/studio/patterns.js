// Definición de patrones
function createSquarePattern(ctx, baseColor, squareSize = 5) {
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = squareSize * 2;
    patternCanvas.height = squareSize * 2;
    const patternCtx = patternCanvas.getContext('2d');

    patternCtx.fillStyle = '#ffffff';
    patternCtx.fillRect(0, 0, squareSize * 2, squareSize * 2);
    patternCtx.fillStyle = baseColor;
    patternCtx.fillRect(squareSize, 0, squareSize, squareSize);
    patternCtx.fillRect(0, squareSize, squareSize, squareSize);

    return ctx.createPattern(patternCanvas, 'repeat');
}

function createDotsPattern(ctx, baseColor) {
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 10;
    patternCanvas.height = 10;
    const patternCtx = patternCanvas.getContext('2d');

    patternCtx.fillStyle = '#fff';
    patternCtx.fillRect(0, 0, 10, 10);
    patternCtx.fillStyle = baseColor; 
    patternCtx.beginPath();
    patternCtx.arc(5, 5, 2, 0, 2 * Math.PI);
    patternCtx.fill();

    return ctx.createPattern(patternCanvas, 'repeat');
}

function createStarsPattern(ctx, baseColor) {
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 10;
    patternCanvas.height = 10;
    const patternCtx = patternCanvas.getContext('2d');

    patternCtx.fillStyle = '#fff'; 
    patternCtx.fillRect(0, 0, 10, 10);
    patternCtx.fillStyle = baseColor;
    patternCtx.beginPath();
    patternCtx.moveTo(5, 0);
    patternCtx.lineTo(6, 4);
    patternCtx.lineTo(10, 4);
    patternCtx.lineTo(7, 6);
    patternCtx.lineTo(8, 10);
    patternCtx.lineTo(5, 8);
    patternCtx.lineTo(2, 10);
    patternCtx.lineTo(3, 6);
    patternCtx.lineTo(0, 4);
    patternCtx.lineTo(4, 4);
    patternCtx.closePath();
    patternCtx.fill();

    return ctx.createPattern(patternCanvas, 'repeat');
}




function createHeartsPattern(ctx, baseColor, heartSize = 10) {
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = heartSize * 2;
    patternCanvas.height = heartSize * 2;
    const patternCtx = patternCanvas.getContext('2d');

    patternCtx.fillStyle = '#fff';
    patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);
    patternCtx.fillStyle = baseColor;

    const x = heartSize;
    const y = heartSize;
    const size = heartSize;

    patternCtx.beginPath();
    patternCtx.moveTo(x, y + size / 4);
    patternCtx.bezierCurveTo(
        x - size / 2, y - size / 4,
        x - size, y + size / 2,
        x, y + size
    );
    patternCtx.bezierCurveTo(
        x + size, y + size / 2,
        x + size / 2, y - size / 4,
        x, y + size / 4
    );
    patternCtx.fill();

    return ctx.createPattern(patternCanvas, 'repeat');
}

function createSquareSmallPattern(ctx, baseColor, squareSize = 2) {
    return createSquarePattern(ctx, baseColor, squareSize);
}

function createVerticalLinesPattern(ctx, baseColor) {
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 10;
    patternCanvas.height = 10;
    const patternCtx = patternCanvas.getContext('2d');

    patternCtx.fillStyle = 'transparent';
    patternCtx.fillRect(0, 0, 10, 10);
    patternCtx.fillStyle = baseColor;
    patternCtx.fillRect(2, 0, 2, 10);

    return ctx.createPattern(patternCanvas, 'repeat');
}

function createHorizontalLinesPattern(ctx, baseColor) {
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 10;
    patternCanvas.height = 10;
    const patternCtx = patternCanvas.getContext('2d');

    patternCtx.fillStyle = 'transparent';
    patternCtx.fillRect(0, 0, 10, 10);
    patternCtx.fillStyle = baseColor; 
    patternCtx.fillRect(0, 2, 10, 2);

    return ctx.createPattern(patternCanvas, 'repeat');
}

function createTrianglesPattern(ctx, baseColor) {
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 10;
    patternCanvas.height = 10;
    const patternCtx = patternCanvas.getContext('2d');

    patternCtx.fillStyle = '#fff';
    patternCtx.fillRect(0, 0, 10, 10);
    patternCtx.fillStyle = baseColor;
    patternCtx.beginPath();
    patternCtx.moveTo(0, 10);
    patternCtx.lineTo(5, 0);
    patternCtx.lineTo(10, 10);
    patternCtx.closePath();
    patternCtx.fill();

    return ctx.createPattern(patternCanvas, 'repeat');
}




export function setCustomCursor(element, pointRadius) {
    const diameter = 60;

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${diameter}" height="${diameter}" viewBox="0 0 ${diameter} ${diameter}">
            <circle cx="${diameter / 2}" cy="${diameter / 2}" r="${diameter / 2 - 1}" fill="none" stroke="black" stroke-width="1"/>
            <circle cx="${diameter / 2}" cy="${diameter / 2}" r="${pointRadius / 2}" fill="black"/>
        </svg>
    `;

    const svgUrl = `data:image/svg+xml;base64,${btoa(svg)}`;
    element.style.cursor = `url(${svgUrl}) ${diameter / 2} ${diameter / 2}, auto`;
}

export const availablePatterns = {
    'square': createSquarePattern,
    'square-sm': createSquareSmallPattern,
    'dots': createDotsPattern,
    'vertical': createVerticalLinesPattern,
    'horizontal': createHorizontalLinesPattern,
    'triangles': createTrianglesPattern,
    'stars': createStarsPattern,
    'heart': createHeartsPattern

};

export function getPattern(ctx, patternName, baseColor) {
    const patternFunction = availablePatterns[patternName];
    if (patternFunction) {
        return patternFunction(ctx, baseColor);
    }
    throw new Error(`Pattern "${patternName}" not found.`);
}

export function generatePatternList(patterns) {
    const ul = document.getElementById('brush-patterns');

    Object.keys(patterns).forEach(patternName => {
        const li = document.createElement('li');
        li.className = 'pattern';
        li.dataset.pattern = patternName;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 50;
        canvas.height = 50;

        const patternFunction = patterns[patternName];
        const pattern = patternFunction(ctx, '#555555');

        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        li.style.background = `url(${canvas.toDataURL()})`;
        ul.appendChild(li);
    });
}
