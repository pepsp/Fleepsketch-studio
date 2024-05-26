export function createSquarePattern(ctx, baseColor, squareSize = 2) {
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


export function setCustomCursor(element, pointRadius) {
    const diameter = 32; // Diámetro constante del círculo grande

    // Crear el SVG
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${diameter}" height="${diameter}" viewBox="0 0 ${diameter} ${diameter}">
            <circle cx="${diameter / 2}" cy="${diameter / 2}" r="${diameter / 2 - 1}" fill="none" stroke="black" stroke-width="1"/>
            <circle cx="${diameter / 2}" cy="${diameter / 2}" r="${pointRadius/2}" fill="black"/>
        </svg>
    `;

    // Convertir el SVG a una URL de datos
    const svgUrl = `data:image/svg+xml;base64,${btoa(svg)}`;

    // Aplicar el cursor al elemento
    element.style.cursor = `url(${svgUrl}) ${diameter / 2} ${diameter / 2}, auto`;
}



export function getPattern(ctx, patternName, baseColor) {
    const patterns = {
        'square': createSquarePattern,
        // Add more pattern mappings here...
    };

    return patterns[patternName](ctx, baseColor);
}