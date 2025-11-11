import React, { useState, useRef, useEffect, useCallback } from 'react';
import { KeyframeScheduler, Keyframe } from '../lib/utils/keyframeScheduler';

interface KeyframeEditorProps {
  scheduler: KeyframeScheduler;
  trackName: string;
  duration: number; // Total duration in seconds
  currentTime: number;
  onSeek?: (time: number) => void;
  onKeyframeChange?: () => void;
}

export const KeyframeEditor: React.FC<KeyframeEditorProps> = ({
  scheduler,
  trackName,
  duration,
  currentTime,
  onSeek,
  onKeyframeChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedKeyframeIndex, setSelectedKeyframeIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const track = scheduler.getTrack(trackName);

  const drawTimeline = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !track) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const timelineHeight = height - padding * 2;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // Draw time grid
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    const secondWidth = (width - padding * 2) / duration;

    for (let i = 0; i <= duration; i++) {
      const x = padding + i * secondWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();

      // Time labels
      ctx.fillStyle = '#666';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${i}s`, x, height - padding + 15);
    }

    // Draw horizontal center line
    ctx.strokeStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(padding, height / 2);
    ctx.lineTo(width - padding, height / 2);
    ctx.stroke();

    // Draw keyframe curve
    if (track.keyframes.length > 0) {
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const getY = (value: number) => {
        return height - padding - (value * timelineHeight);
      };

      const getX = (time: number) => {
        return padding + (time / duration) * (width - padding * 2);
      };

      // Draw curve segments
      for (let i = 0; i < track.keyframes.length - 1; i++) {
        const kf1 = track.keyframes[i];
        const kf2 = track.keyframes[i + 1];

        const x1 = getX(kf1.time);
        const y1 = typeof kf1.value === 'number' ? getY(kf1.value) : height / 2;
        const x2 = getX(kf2.time);
        const y2 = typeof kf2.value === 'number' ? getY(kf2.value) : height / 2;

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.stroke();

      // Draw keyframe points
      track.keyframes.forEach((kf, index) => {
        const x = getX(kf.time);
        const y = typeof kf.value === 'number' ? getY(kf.value) : height / 2;

        ctx.fillStyle = index === selectedKeyframeIndex ? '#f0abfc' : '#06b6d4';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Draw selection ring
        if (index === selectedKeyframeIndex) {
          ctx.strokeStyle = '#f0abfc';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, 10, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
    }

    // Draw playhead
    const playheadX = padding + (currentTime / duration) * (width - padding * 2);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(playheadX, padding);
    ctx.lineTo(playheadX, height - padding);
    ctx.stroke();

    // Draw playhead indicator
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(playheadX - 6, padding);
    ctx.lineTo(playheadX + 6, padding);
    ctx.lineTo(playheadX, padding + 10);
    ctx.fill();

  }, [track, duration, currentTime, selectedKeyframeIndex]);

  useEffect(() => {
    drawTimeline();
  }, [drawTimeline]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !track) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickTime = ((x - 40) / (canvas.width - 80)) * duration;

    // Check if clicked on existing keyframe
    const clickedIndex = track.keyframes.findIndex(kf => {
      const kfX = 40 + (kf.time / duration) * (canvas.width - 80);
      return Math.abs(x - kfX) < 10;
    });

    if (clickedIndex >= 0) {
      setSelectedKeyframeIndex(clickedIndex);
    } else if (onSeek) {
      onSeek(Math.max(0, Math.min(duration, clickTime)));
    }
  };

  const handleAddKeyframe = () => {
    if (!track) return;

    const newKeyframes = [...track.keyframes, {
      time: currentTime,
      value: 0.5,
      easing: 'linear' as const
    }];

    scheduler.addTrack({
      ...track,
      keyframes: newKeyframes
    });

    onKeyframeChange?.();
  };

  const handleDeleteKeyframe = () => {
    if (!track || selectedKeyframeIndex === null) return;

    const newKeyframes = track.keyframes.filter((_, i) => i !== selectedKeyframeIndex);
    scheduler.addTrack({
      ...track,
      keyframes: newKeyframes
    });

    setSelectedKeyframeIndex(null);
    onKeyframeChange?.();
  };

  const handleExport = () => {
    const exported = scheduler.exportTrackToFrameSync(trackName);
    const blob = new Blob([exported], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${trackName}-keyframes.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white font-semibold">{trackName}</h3>
        <div className="flex gap-2">
          <button
            onClick={handleAddKeyframe}
            className="px-3 py-1 bg-cyan-600 text-white rounded text-sm hover:bg-cyan-700"
          >
            Add Keyframe
          </button>
          {selectedKeyframeIndex !== null && (
            <button
              onClick={handleDeleteKeyframe}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Delete
            </button>
          )}
          <button
            onClick={handleExport}
            className="px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600"
          >
            Export
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={200}
        className="w-full border border-gray-700 rounded cursor-crosshair"
        onClick={handleCanvasClick}
      />

      {selectedKeyframeIndex !== null && track && (
        <div className="mt-2 p-2 bg-gray-800 rounded text-sm text-gray-300">
          <p>Selected Keyframe: #{selectedKeyframeIndex + 1}</p>
          <p>Time: {track.keyframes[selectedKeyframeIndex].time.toFixed(2)}s</p>
          <p>Value: {JSON.stringify(track.keyframes[selectedKeyframeIndex].value)}</p>
        </div>
      )}
    </div>
  );
};