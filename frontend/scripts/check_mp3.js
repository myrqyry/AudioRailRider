#!/usr/bin/env node
// Node-based diagnostic to mimic prepareAudioPart's MIME detection + inline/upload decision.
// This does NOT call any network APIs and is safe to run locally.
// Usage: node scripts/check_mp3.js "/path/to/file.mp3"

const fs = require('fs');
const path = require('path');

const MAX_INLINE_BYTES = 20 * 1024 * 1024; // 20 MB

const SUPPORTED_AUDIO_MIME_TYPES = new Set([
  'audio/wav',
  'audio/x-wav',
  'audio/mpeg', // canonical MIME for MP3
  'audio/mp3',  // some browsers/clients report this
  'audio/aiff',
  'audio/x-aiff',
  'audio/aac',
  'audio/m4a',
  'audio/ogg',
  'audio/flac',
  'audio/x-flac'
]);

function detectMimeFromName(filename) {
  const ext = (filename.split('.').pop() || '').toLowerCase();
  switch (ext) {
    case 'wav': return 'audio/wav';
    case 'mp3':
    case 'mpga': return 'audio/mpeg';
    case 'm4a': return 'audio/m4a';
    case 'aiff':
    case 'aif': return 'audio/aiff';
    case 'aac': return 'audio/aac';
    case 'ogg': return 'audio/ogg';
    case 'flac': return 'audio/flac';
    default: return 'application/octet-stream';
  }
}

(async () => {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: node scripts/check_mp3.js /absolute/path/to/file.mp3');
    process.exit(2);
  }

  // Resolve path and ensure it exists
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    console.error('File not found:', resolved);
    process.exit(3);
  }

  const stat = fs.statSync(resolved);
  if (!stat.isFile()) {
    console.error('Path is not a regular file:', resolved);
    process.exit(4);
  }
  const size = stat.size;
  const name = path.basename(resolved);
  // Try to infer MIME from extension (this mirrors prepareAudioPart fallback).
  const detectedMime = detectMimeFromName(name);

  console.log('--- MP3 Diagnostic: prepareAudioPart (local emulation) ---');
  console.log('File:', resolved);
  console.log('Name:', name);
  console.log('Size (bytes):', size);
  console.log('Size (MB):', (size / (1024 * 1024)).toFixed(2));
  console.log('Detected MIME (from extension):', detectedMime);
  console.log('Is supported MIME according to SUPPORTED_AUDIO_MIME_TYPES?:', SUPPORTED_AUDIO_MIME_TYPES.has(detectedMime));
  console.log('Max inline bytes threshold:', MAX_INLINE_BYTES, `(${(MAX_INLINE_BYTES / (1024*1024)).toFixed(2)} MB)`);

  if (size <= MAX_INLINE_BYTES) {
    console.log('Decision: INLINE (would use inlineAudioPartFromFile -> FileReader base64 path)');
  } else {
    console.log('Decision: UPLOAD (would call ai.files.upload and expect { uri, mimeType } )');
  }

  // Additional heuristic: print a guess for file.type if available via simple "magic" check (very limited)
  // We'll try to read the first bytes to detect an MP3 frame header or ID3 tag
  try {
    let fd;
    const header = Buffer.alloc(16);
    try {
      fd = fs.openSync(resolved, 'r');
      fs.readSync(fd, header, 0, 16, 0);
    } finally {
      if (fd !== undefined) {
        try { fs.closeSync(fd); } catch {}
      }
    }

    const headerStr = header.toString('utf8', 0, 3);
    if (headerStr === 'ID3') {
      console.log('Header heuristic: ID3 tag detected (likely MP3)');
    } else {
      // Check for MP3 11-bit frame sync (0xFFE) at start
      if (header[0] === 0xFF && (header[1] & 0xE0) === 0xE0) {
        console.log('Header heuristic: MP3 frame sync detected (likely MP3)');
      } else {
        console.log('Header heuristic: no ID3 or MP3 frame sync found in first 16 bytes (this is not definitive)');
      }
    }
  } catch (err) {
    console.error('Failed to read file header for heuristic detection:', err);
  }

  console.log('--- End diagnostic ---');
})();