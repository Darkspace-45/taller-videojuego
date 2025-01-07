import React, { useRef, useEffect, ForwardedRef } from "react";

interface CanvasProps {
    width: number;
    height: number;
}

const Canvas = React.forwardRef<HTMLCanvasElement, CanvasProps>(
    ({ width, height }, ref) => {
        const internalRef = useRef<HTMLCanvasElement>(null);

        useEffect(() => {
            const canvas = ref && "current" in ref ? ref.current : internalRef.current;
            if (canvas) {
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    // Lógica de dibujo aquí
                    ctx.fillStyle = "blue";
                    ctx.fillRect(0, 0, width, height);
                }
            }
        }, [ref, width, height]);

        return <canvas ref={ref || internalRef} width={width} height={height} />;
    }
);

export default Canvas;