#!/usr/bin/env node
// Extract uniform declarations from resolved GLSL files and emit a JSON manifest.
import fs from 'fs/promises';
import path from 'path';

const shadersDir = path.join(process.cwd(), 'frontend', 'public', 'shaders');
const outFile = path.join(shadersDir, 'shader-uniforms.json');

function guessControl(type, name) {
  // Heuristic mapping from GLSL type/name to UI control
  if (type === 'float') {
    if (/speed|time|scale|gain|strength|damping|decay/i.test(name)) return { control: 'range', min: 0, max: 4, step: 0.01 };
    return { control: 'range', min: 0, max: 1, step: 0.01 };
  }
  if (type === 'int' || type === 'uint') return { control: 'number', min: 0, max: 16, step: 1 };
  if (type === 'vec3' || type === 'vec4') return { control: 'color' };
  if (type === 'bool') return { control: 'checkbox' };
  return { control: 'text' };
}

function parseAnnotations(lines, lineIndex) {
  // Look up to 4 lines above for @ui annotations in comments
  const result = {};
  for (let i = lineIndex - 1; i >= Math.max(0, lineIndex - 5); i--) {
    const line = lines[i].trim();
    const m = line.match(/\/\/\s*@ui\s+(.*)$/);
    if (!m) continue;
    const rest = m[1].trim();
    const parts = rest.split(/\s+/);
    const cmd = parts[0];
    if (cmd === 'range') {
      const min = parseFloat(parts[1] ?? 0);
      const max = parseFloat(parts[2] ?? 1);
      const step = parseFloat(parts[3] ?? 0.01);
      result.control = 'range'; result.min = min; result.max = max; result.step = step;
    } else if (cmd === 'default') {
      const val = parts.slice(1).join(' ');
      // try number or boolean
      if (/^\d+(?:\.\d+)?$/.test(val)) result.default = Number(val);
      else if (/^(true|false)$/i.test(val)) result.default = val.toLowerCase() === 'true';
      else result.default = val;
    } else if (cmd === 'options') {
      const opts = parts.slice(1).join(' ').split(',').map(s => s.trim()).filter(Boolean);
      result.control = 'select'; result.options = opts;
    } else if (cmd === 'color') {
      result.control = 'color';
    }
  }
  return result;
}

async function main() {
  try {
    const files = await fs.readdir(shadersDir);
    const resolved = files.filter(f => f.endsWith('.resolved.glsl'));
    const manifest = {};
    for (const f of resolved) {
      const full = path.join(shadersDir, f);
      const text = await fs.readFile(full, 'utf8');
      const lines = text.split(/\r?\n/);
      const uniforms = [];
      const re = /uniform\s+(\w+)\s+(\w+)\s*;/;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const m = line.match(re);
        if (m) {
          const type = m[1];
          const name = m[2];
          const ann = parseAnnotations(lines, i);
          const base = { name, type };
          const guessed = guessControl(type, name);
          const entry = { ...base, ...guessed, ...ann };
          uniforms.push(entry);
        }
      }
      manifest[f] = uniforms;
    }
    await fs.writeFile(outFile, JSON.stringify(manifest, null, 2), 'utf8');
    console.log('[extract-shader-uniforms] Wrote', outFile);
  } catch (e) {
    console.error('[extract-shader-uniforms] ERROR', e && e.message);
    process.exit(2);
  }
}

main();
