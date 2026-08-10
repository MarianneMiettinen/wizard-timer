/**
 * Paints the browser-tab icon: a magic wand on a tile in the candle's current
 * colour, so the tab strip tracks the session at a glance.
 *
 * The tile carries the colour rather than the wand itself. At 16 CSS pixels a
 * thin coloured line is barely a hint; a filled tile changing green → amber →
 * red is unmistakable from across the tab bar, which is the entire point.
 *
 * Repaints are gated on a *quantised* colour. The gauge colour drifts every
 * tick, so painting on each change would redraw a canvas and swap a data URL
 * several times a second for a difference no eye could catch.
 */

import { useEffect, useRef } from 'react';
import { quantise } from './colour';

const SIZE = 64;

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  // Written out rather than using ctx.roundRect(), which is newer than the
  // browsers this otherwise supports.
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/** A four-pointed sparkle — the shape that reads as "magic" at tiny sizes. */
function sparklePath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
): void {
  const waist = radius * 0.2;
  ctx.beginPath();
  ctx.moveTo(cx, cy - radius);
  ctx.quadraticCurveTo(cx + waist, cy - waist, cx + radius, cy);
  ctx.quadraticCurveTo(cx + waist, cy + waist, cx, cy + radius);
  ctx.quadraticCurveTo(cx - waist, cy + waist, cx - radius, cy);
  ctx.quadraticCurveTo(cx - waist, cy - waist, cx, cy - radius);
  ctx.closePath();
}

export function useFaviconWand(colour: string, wandColour: string, sparkColour: string): void {
  const lastPainted = useRef<string>('');

  useEffect(() => {
    const key = `${quantise(colour)}|${wandColour}|${sparkColour}`;
    if (key === lastPainted.current) return;
    lastPainted.current = key;

    const canvas = document.createElement('canvas');
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Tile, carrying the gauge colour.
    const tile = ctx.createLinearGradient(0, 0, 0, SIZE);
    tile.addColorStop(0, colour);
    tile.addColorStop(1, colour);
    ctx.fillStyle = tile;
    roundedRectPath(ctx, 1, 1, SIZE - 2, SIZE - 2, 14);
    ctx.fill();

    // Wand, angled so it still reads as a wand once shrunk to 16px.
    ctx.strokeStyle = wandColour;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(19, 47);
    ctx.lineTo(40, 26);
    ctx.stroke();

    // Grip, for a bit of wand-ness rather than "diagonal stick".
    ctx.strokeStyle = sparkColour;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(21, 45);
    ctx.lineTo(26, 40);
    ctx.stroke();

    ctx.fillStyle = sparkColour;
    sparklePath(ctx, 45, 21, 13);
    ctx.fill();

    const href = canvas.toDataURL('image/png');

    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/png';
    link.href = href;
  }, [colour, wandColour, sparkColour]);
}
