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


export function getPattern(ctx, patternName, baseColor) {
    const patterns = {
        'square': createSquarePattern,
        // Add more pattern mappings here...
    };

    return patterns[patternName](ctx, baseColor);
}