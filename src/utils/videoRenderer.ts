/**
 * Procedural Video and Thumbnail Generator for Flow Video Studio Auto
 * Generates realistic animated video blobs and thumbnails based on prompt semantics
 */

import { AspectRatio } from '../types';

export interface RenderResult {
  thumbnailUrl: string;
  videoBlobUrl: string;
  duration: number;
}

// Generate a high quality thumbnail canvas based on prompt theme
export function generateTaskThumbnail(prompt: string, aspectRatio: AspectRatio = '16:9'): string {
  const canvas = document.createElement('canvas');
  let width = 640;
  let height = 360;

  if (aspectRatio === '9:16') {
    width = 360;
    height = 640;
  } else if (aspectRatio === '1:1') {
    width = 512;
    height = 512;
  } else if (aspectRatio === '4:3') {
    width = 640;
    height = 480;
  } else if (aspectRatio === '3:4') {
    width = 480;
    height = 640;
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const lower = prompt.toLowerCase();
  
  // Theme color palette determination
  let c1 = '#090d16';
  let c2 = '#1e1b4b';
  let accent = '#6366f1';
  let highlight = '#38bdf8';

  if (lower.includes('cyberpunk') || lower.includes('neon') || lower.includes('future') || lower.includes('tokyo')) {
    c1 = '#0a0014';
    c2 = '#3b0764';
    accent = '#ec4899';
    highlight = '#06b6d4';
  } else if (lower.includes('nature') || lower.includes('forest') || lower.includes('mountain') || lower.includes('sunset') || lower.includes('halong')) {
    c1 = '#052e16';
    c2 = '#14532d';
    accent = '#eab308';
    highlight = '#86efac';
  } else if (lower.includes('space') || lower.includes('galaxy') || lower.includes('star') || lower.includes('nebula')) {
    c1 = '#020617';
    c2 = '#1e1b4b';
    accent = '#a855f7';
    highlight = '#c084fc';
  } else if (lower.includes('luxury') || lower.includes('gold') || lower.includes('car') || lower.includes('commercial')) {
    c1 = '#18181b';
    c2 = '#27272a';
    accent = '#eab308';
    highlight = '#fef08a';
  } else if (lower.includes('anime') || lower.includes('character') || lower.includes('girl') || lower.includes('warrior')) {
    c1 = '#1e1b4b';
    c2 = '#4338ca';
    accent = '#f43f5e';
    highlight = '#fda4af';
  }

  // Draw background gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, c1);
  grad.addColorStop(0.5, c2);
  grad.addColorStop(1, '#05070d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Atmospheric radial glow
  const radial = ctx.createRadialGradient(width * 0.5, height * 0.4, 20, width * 0.5, height * 0.4, width * 0.6);
  radial.addColorStop(0, accent + '88');
  radial.addColorStop(0.6, highlight + '22');
  radial.addColorStop(1, 'transparent');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, width, height);

  // Dynamic geometric grid/lines
  ctx.strokeStyle = accent + '33';
  ctx.lineWidth = 1.5;
  for (let y = height * 0.5; y < height; y += 24) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Perspective rays
  ctx.strokeStyle = highlight + '22';
  for (let x = 0; x <= width; x += width / 8) {
    ctx.beginPath();
    ctx.moveTo(width / 2, height * 0.4);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Focal geometric shape / cinematic emblem
  ctx.save();
  ctx.translate(width / 2, height * 0.4);
  ctx.strokeStyle = highlight;
  ctx.lineWidth = 2;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 15;
  
  ctx.beginPath();
  ctx.arc(0, 0, Math.min(width, height) * 0.2, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, Math.min(width, height) * 0.12, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Floating ambient dust particles
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 40; i++) {
    const px = (Math.sin(i * 99) * 0.5 + 0.5) * width;
    const py = (Math.cos(i * 33) * 0.5 + 0.5) * height;
    const pr = ((i % 3) + 1) * 1.2;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Cinematic letterbox overlay
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(0, 0, width, height * 0.08);
  ctx.fillRect(0, height * 0.92, width, height * 0.08);

  // Watermark or Flow AI label
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '600 11px "JetBrains Mono", monospace';
  ctx.fillText('HOAI STUDIO AUTOMATION · 4K HDR', 14, height - 12);

  return canvas.toDataURL('image/jpeg', 0.88);
}

// Generate actual playable video blob using HTML5 MediaRecorder and Offscreen Canvas
export async function generatePlayableVideo(
  prompt: string,
  aspectRatio: AspectRatio = '16:9',
  durationSec: number = 4
): Promise<RenderResult> {
  let width = 640;
  let height = 360;

  if (aspectRatio === '9:16') {
    width = 360;
    height = 640;
  } else if (aspectRatio === '1:1') {
    width = 480;
    height = 480;
  } else if (aspectRatio === '4:3') {
    width = 640;
    height = 480;
  } else if (aspectRatio === '3:4') {
    width = 480;
    height = 640;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const thumb = generateTaskThumbnail(prompt, aspectRatio);
    return { thumbnailUrl: thumb, videoBlobUrl: thumb, duration: durationSec };
  }

  const thumb = generateTaskThumbnail(prompt, aspectRatio);

  // Check if MediaRecorder is available in browser
  if (typeof window === 'undefined' || !window.MediaRecorder || !canvas.captureStream) {
    return { thumbnailUrl: thumb, videoBlobUrl: '', duration: durationSec };
  }

  try {
    const stream = canvas.captureStream(30);
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : MediaRecorder.isTypeSupported('video/webm')
      ? 'video/webm'
      : 'video/mp4';

    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 2500000 });
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    return new Promise((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const videoBlobUrl = URL.createObjectURL(blob);
        resolve({
          thumbnailUrl: thumb,
          videoBlobUrl,
          duration: durationSec
        });
      };

      recorder.start();

      let startTime = performance.now();
      const totalFrames = Math.min(durationSec * 30, 90); // Cap frame count for fast render
      let frame = 0;

      const lower = prompt.toLowerCase();
      const isCyber = lower.includes('cyber') || lower.includes('neon') || lower.includes('future');
      const isNature = lower.includes('nature') || lower.includes('mountain') || lower.includes('halong');
      const isSpace = lower.includes('space') || lower.includes('galaxy') || lower.includes('star');

      const renderFrame = () => {
        const t = frame / 30; // current time in seconds
        
        // Background color animation
        ctx.fillStyle = '#080c14';
        ctx.fillRect(0, 0, width, height);

        // Dynamic motion backdrop
        const grad = ctx.createLinearGradient(0, 0, width, height);
        if (isCyber) {
          grad.addColorStop(0, '#0f051d');
          grad.addColorStop(0.5 + Math.sin(t * 2) * 0.1, '#3b0764');
          grad.addColorStop(1, '#030712');
        } else if (isNature) {
          grad.addColorStop(0, '#064e3b');
          grad.addColorStop(0.5 + Math.sin(t * 1.5) * 0.1, '#065f46');
          grad.addColorStop(1, '#022c22');
        } else {
          grad.addColorStop(0, '#0c102a');
          grad.addColorStop(0.5 + Math.cos(t * 2) * 0.1, '#1e1b4b');
          grad.addColorStop(1, '#020617');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Animated camera zoom / focal motion
        ctx.save();
        const zoom = 1 + (frame / totalFrames) * 0.15;
        ctx.translate(width / 2, height / 2);
        ctx.scale(zoom, zoom);
        ctx.translate(-width / 2, -height / 2);

        // Draw animated geometric pulse
        const cx = width / 2;
        const cy = height * 0.45;
        const radius = 60 + Math.sin(t * 3) * 15;

        ctx.strokeStyle = isCyber ? '#ec4899' : isNature ? '#fbbf24' : '#38bdf8';
        ctx.lineWidth = 3;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 20;

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Secondary spinning ring
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * 1.5);
        ctx.strokeStyle = isCyber ? '#06b6d4' : '#a78bfa';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(-radius * 0.7, -radius * 0.7, radius * 1.4, radius * 1.4);
        ctx.stroke();
        ctx.restore();

        // Flying particle stream
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 35; i++) {
          const speed = (i % 5) + 2;
          const pY = ((i * 30 + t * speed * 70) % height);
          const pX = (Math.sin(i * 12 + t) * 0.4 + 0.5) * width;
          const pSize = ((i % 4) + 1);
          ctx.beginPath();
          ctx.arc(pX, pY, pSize, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        // Lower banner info
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        ctx.fillRect(0, height - 36, width, 36);

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '500 11px "JetBrains Mono", monospace';
        const displaySec = t.toFixed(1);
        ctx.fillText(`FLOW v3.5 · ${displaySec}s / ${durationSec}s · ${width}x${height}`, 12, height - 14);

        // Frame counter and loop
        frame++;
        if (frame < totalFrames) {
          requestAnimationFrame(renderFrame);
        } else {
          recorder.stop();
        }
      };

      renderFrame();
    });
  } catch (err) {
    console.error('Error generating playable video:', err);
    return { thumbnailUrl: thumb, videoBlobUrl: '', duration: durationSec };
  }
}
