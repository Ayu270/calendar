import { useState, useCallback } from 'react';

export function useDominantColor(fallbackColor = '#10b981') {
    const [dominantColor, setDominantColor] = useState(null);

    const extractColor = useCallback((imgElement) => {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            canvas.width = imgElement.width || 100;
            canvas.height = imgElement.height || 100;
            ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
            const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            
            let r = 0, g = 0, b = 0, count = 0;
            for (let i = 0; i < data.length; i += 40) {
                const brightness = (data[i] * 299 + data[i+1] * 587 + data[i+2] * 114) / 1000;
                if (data[i+3] > 0 && brightness > 40 && brightness < 220) {
                    r += data[i];
                    g += data[i+1];
                    b += data[i+2];
                    count++;
                }
            }
            if (count > 0) {
                setDominantColor(`rgb(${Math.floor(r/count)}, ${Math.floor(g/count)}, ${Math.floor(b/count)})`);
            } else {
                setDominantColor(null);
            }
        } catch(e) {
            console.warn("Canvas crossOrigin prevented color extraction", e);
            setDominantColor(null);
        }
    }, []);

    const resetColor = useCallback(() => {
        setDominantColor(null);
    }, []);

    return {
        dominantColor: dominantColor || fallbackColor,
        extractColor,
        resetColor
    };
}
