#!/usr/bin/env node
// ESM-friendly resolver: Resolve shader includes using local LYGIA resolver if available
// and write resolved shader files into the source and public shader directories.
// Usage: node scripts/resolve-shaders.js

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const publicLygia = path.join(projectRoot, 'frontend', 'public', 'lygia', 'resolve.esm.js');
const outDir = path.join(projectRoot, 'frontend', 'src', 'lib', 'shaders');

const ensureDir = async (d) => { if (!existsSync(d)) await fs.mkdir(d, { recursive: true }); };

async function run() {
  await ensureDir(outDir);

  let resolver = null;
  try {
    if (existsSync(publicLygia)) {
      // Dynamic ESM import of local resolver
      try {
        const mod = await import('file://' + publicLygia);
        resolver = (mod && (mod.default || mod.resolveLygia || mod.resolve)) ? (mod.default || mod.resolveLygia || mod.resolve) : null;
      } catch (e) {
        console.warn('[resolve-shaders] failed to import local resolver as ESM:', e && e.message);
      }
    }
  } catch (e) {
    console.warn('[resolve-shaders] local resolver detection failed:', e && e.message);
  }

  const baseDir = path.join(projectRoot, 'frontend', 'src', 'lib', 'shaders');
  const baseVelFragPath = path.join(baseDir, 'baseVelFrag.glsl');
  const basePosFragPath = path.join(baseDir, 'basePosFrag.glsl');
  if (!existsSync(baseVelFragPath) || !existsSync(basePosFragPath)) {
    console.warn('[resolve-shaders] Base shader files not found; expected in', baseDir);
    // Still ensure public/shaders contains base files if possible
    try {
      const publicShadersDir = path.join(projectRoot, 'frontend', 'public', 'shaders');
      await ensureDir(publicShadersDir);
      if (existsSync(baseVelFragPath)) await fs.copyFile(baseVelFragPath, path.join(publicShadersDir, 'baseVelFrag.glsl'));
      if (existsSync(basePosFragPath)) await fs.copyFile(basePosFragPath, path.join(publicShadersDir, 'basePosFrag.glsl'));
    } catch (e) {}
    return;
  }

  const baseVelFrag = await fs.readFile(baseVelFragPath, 'utf8');
  const basePosFrag = await fs.readFile(basePosFragPath, 'utf8');

  const publicShadersDir = path.join(projectRoot, 'frontend', 'public', 'shaders');
  await ensureDir(publicShadersDir);

  // Always copy base shaders into public/shaders so runtime can fetch them
  try {
    await fs.writeFile(path.join(publicShadersDir, 'baseVelFrag.glsl'), baseVelFrag, 'utf8');
    await fs.writeFile(path.join(publicShadersDir, 'basePosFrag.glsl'), basePosFrag, 'utf8');
  } catch (e) {
    console.warn('[resolve-shaders] failed to write base shaders to public:', e && e.message);
  }

  // If no resolver present, skip resolved output but leave base files in public
  if (!resolver) {
    console.warn('[resolve-shaders] No local resolver found; skipping shader pre-resolve. Runtime resolver fallbacks will be used.');
    return;
  }

  const velHeader = '#include "lygia/generative/simplex.glsl"\n#include "lygia/generative/curl.glsl"\n#include "lygia/color/palettes.glsl"\n';
  const posHeader = '#include "lygia/generative/simplex.glsl"\n';

  try {
    const resolvedVel = await resolver(velHeader + baseVelFrag);
    const resolvedPos = await resolver(posHeader + basePosFrag);
    await fs.writeFile(path.join(baseDir, 'velFrag.resolved.glsl'), resolvedVel, 'utf8');
    await fs.writeFile(path.join(baseDir, 'posFrag.resolved.glsl'), resolvedPos, 'utf8');
    await fs.writeFile(path.join(publicShadersDir, 'velFrag.resolved.glsl'), resolvedVel, 'utf8');
    await fs.writeFile(path.join(publicShadersDir, 'posFrag.resolved.glsl'), resolvedPos, 'utf8');
    console.log('[resolve-shaders] Wrote resolved shaders to', baseDir, 'and', publicShadersDir);
  } catch (e) {
    console.warn('[resolve-shaders] Resolver failed to expand includes:', e && e.message);
  }
}

run().catch((err) => { console.error('[resolve-shaders] fatal:', err && err.stack || err); process.exitCode = 1; });
