import React, { useRef, useEffect, ForwardedRef } from "react";

interface CanvasProps {
    width: number;
    height: number;
}

const Canvas = React.forwardRef<HTMLCanvasElement, CanvasProps>(({ width, height }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Usamos el `ref` de React.forwardRef o el canvasRef interno si no se pasa un ref
    const mergedRef = ref || canvasRef;

    useEffect(() => {
        const canvas = mergedRef && ('current' in mergedRef ? mergedRef.current : null);
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                // Aquí puedes poner la lógica de dibujo del canvas
            }
        }
    }, [width, height, mergedRef]);

    return <canvas ref={mergedRef} width={width} height={height} />;
});

export default Canvas;