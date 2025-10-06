// Minimal ESM shader include resolver used for local prebuild.
// It performs a very small, safe expansion of lines like: #include "lygia/..."
// It only reads files from the public/lygia directory to avoid network access.
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const lygiaRoot = path.join(__dirname, '.');

async function resolveIncludes(src) {
  const lines = src.split(/\r?\n/);
  const outLines = [];
  for (const line of lines) {
    const m = line.match(/^\s*#include\s+"([^"]+)"\s*$/);
    if (m) {
      const inc = m[1];
      // Only allow includes that start with 'lygia/' to avoid directory escape
      if (!inc.startsWith('lygia/')) {
        outLines.push('// [resolve] skipped include: ' + inc);
        continue;
      }
      // attempt to read file under public/lygia (strip leading 'lygia/')
      const rel = inc.replace(/^lygia\//, '');
      const candidate = path.join(lygiaRoot, rel);
      try {
        const content = await readFile(candidate, 'utf8');
        outLines.push('// begin include: ' + inc);
        outLines.push(content);
        outLines.push('// end include: ' + inc);
      } catch (e) {
        outLines.push('// [resolve] missing include: ' + inc);
      }
    } else {
      outLines.push(line);
    }
  }
  return outLines.join('\n');
}

// Export default resolver function synchronous-friendly by returning a Promise
export default async function resolve(str) {
  return await resolveIncludes(str);
}

// also provide a named export for compatibility
export const resolveLygia = resolve;
