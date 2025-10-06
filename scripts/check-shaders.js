#!/usr/bin/env node
// Lightweight shader sanity checker for CI.
// - Ensures each resolved shader contains a `main` function and balanced braces.
// - If `glslangValidator` is available in PATH, it will be invoked for stricter validation.

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

function balancedBraces(src) {
  let depth = 0;
  for (const ch of src) {
    if (ch === '{') depth++;
    if (ch === '}') depth--;
    if (depth < 0) return false;
  }
  return depth === 0;
}

async function checkFile(file) {
  const text = await fs.readFile(file, 'utf8');
  if (!/\bvoid\s+main\s*\(/.test(text)) {
    throw new Error(`${file}: missing main()`);
  }
  if (!balancedBraces(text)) {
    throw new Error(`${file}: unbalanced braces`);
  }

  // If glslangValidator is installed, run it for stricter validation
  if (existsSync('/usr/bin/glslangValidator') || existsSync('/usr/local/bin/glslangValidator')) {
    const res = spawnSync('glslangValidator', ['-S', 'frag', '-V', file], { stdio: 'inherit' });
    if (res.status !== 0) throw new Error(`${file}: glslangValidator failed`);
  } else {
    // Try in PATH
    const res = spawnSync('which', ['glslangValidator']);
    if (res.status === 0) {
      const validator = res.stdout.toString().trim();
      const r2 = spawnSync(validator, ['-S', 'frag', '-V', file], { stdio: 'inherit' });
      if (r2.status !== 0) throw new Error(`${file}: glslangValidator failed`);
    } else {
      // No system validator -- we've done basic checks already
      console.log(`[check-shaders] Note: glslangValidator not found; performed basic sanity checks on ${file}`);
    }
  }
}

async function main() {
  const dir = path.join(process.cwd(), 'frontend', 'public', 'shaders');
  try {
    const files = await fs.readdir(dir);
    const glsls = files.filter(f => f.endsWith('.resolved.glsl'));
    if (glsls.length === 0) {
      console.log('[check-shaders] No resolved shaders found; skipping check.');
      return;
    }
    for (const f of glsls) {
      const full = path.join(dir, f);
      console.log('[check-shaders] Checking', full);
      await checkFile(full);
    }
    console.log('[check-shaders] All shader checks passed');
  } catch (e) {
    console.error('[check-shaders] ERROR:', e && e.message);
    process.exit(2);
  }
}

main();
