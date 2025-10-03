import React, { useRef, useEffect, useState } from 'react';
import createREGL from 'regl';
import { AudioFeatures } from 'shared/types';

interface ReglOverlayProps {
  audioFeatures: AudioFeatures | null;
}

const ReglOverlay: React.FC<ReglOverlayProps> = ({ audioFeatures }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Using refs to hold regl-related objects that shouldn't trigger re-renders
  const reglRef = useRef<createREGL.Regl | null>(null);
  const drawWaveformRef = useRef<createREGL.DrawCommand | null>(null);
  const vertexBufferRef = useRef<any>(null); // Use `any` for regl buffer type for simplicity
  const [pointCount, setPointCount] = useState(0); // State to hold the number of points to draw

  useEffect(() => {
    if (canvasRef.current) {
      const regl = createREGL(canvasRef.current);
      reglRef.current = regl;

      const vertexBuffer = regl.buffer({
        usage: 'dynamic',
      });
      vertexBufferRef.current = vertexBuffer;

      // Define the draw command once
      drawWaveformRef.current = regl({
        vert: `
          precision mediump float;
          attribute vec2 position;
          void main() {
            // Position is already in clip space coordinates
            gl_Position = vec4(position, 0, 1);
          }`,
        frag: `
          precision mediump float;
          uniform vec4 color;
          void main() {
            gl_FragColor = color;
          }`,
        attributes: {
          position: vertexBuffer,
        },
        uniforms: {
          color: [0, 0.8, 0.8, 0.7], // Cyan color
        },
        count: regl.prop('count'),
        primitive: 'line strip',
      });

      const frameLoop = regl.frame(() => {
        regl.clear({ color: [0, 0, 0, 0], depth: 1 });
        if (pointCount > 0) {
          drawWaveformRef.current?.({ count: pointCount });
        }
      });

      return () => {
        frameLoop.cancel();
        regl.destroy();
      };
    }
  }, []); // Empty dependency array means this runs only once

  // This effect updates the vertex data when audioFeatures change
  useEffect(() => {
    if (audioFeatures?.frameAnalyses && audioFeatures.frameAnalyses.length > 0) {
      const frameAnalyses = audioFeatures.frameAnalyses;
      const duration = audioFeatures.duration;

      // Convert frame analyses to clip space coordinates [-1, 1]
      const points = frameAnalyses.flatMap(frame => {
        const x = (frame.timestamp / duration) * 2 - 1; // Map time to [-1, 1]
        const y = (frame.energy * 2 - 1) * 0.5; // Map energy [0, 1] to [-0.5, 0.5]
        return [x, y];
      });

      if (vertexBufferRef.current) {
        vertexBufferRef.current(points);
        setPointCount(points.length / 2);
      }
    } else {
        // Clear the visualization if there are no features
        setPointCount(0);
    }
  }, [audioFeatures]);

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 10,
  };

  // It's important to set the canvas dimensions directly to match the style
  // to avoid distortion. We can use a resize observer or just set it on mount.
  useEffect(() => {
    const handleResize = () => {
        if (canvasRef.current) {
            canvasRef.current.width = canvasRef.current.clientWidth;
            canvasRef.current.height = canvasRef.current.clientHeight;
        }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} style={overlayStyle} />;
};

export default ReglOverlay;