// Test harness for MIME detection and prepareAudioPart
/**
 * services/geminiService.mimeTest.ts
 *
 * Runs a quick programmatic pass over supported and unsupported audio MIME/extension combos
 * to validate detectMimeFromName fallback and prepareAudioPart enforcement.
 *
 * Notes:
 * - Uses a minimal mock GoogleGenAI client (mockAi.files.upload) to avoid network calls.
 * - Forces the "upload" branch by using LARGE_FILE_SIZE > MAX_INLINE_BYTES to avoid FileReader/analyzeAudio.
 * - Intended for local developer runs (ts-node) and not part of CI by default.
 */

import { prepareAudioPart } from './geminiService';
import { GoogleGenAI } from '@google/genai'; // Regular import

type MockFileLike = {
  name: string;
  type: string;
  size: number;
};

const SUPPORTED_EXT_TO_MIME: Record<string, string> = {
  wav: 'audio/wav',
  mp3: 'audio/mpeg',
  aiff: 'audio/aiff',
  aif: 'audio/aiff',
  aac: 'audio/aac',
  ogg: 'audio/ogg',
  flac: 'audio/flac',
};

const SUPPORTED_MIMES = Array.from(new Set(Object.values(SUPPORTED_EXT_TO_MIME)));

const LARGE_FILE_SIZE = 25 * 1024 * 1024; // 25MB to force upload path


class MockAIClient extends (GoogleGenAI as any) {
  files = {
    async upload({ file, config }: { file: any; config?: { mimeType?: string } }) {
      await new Promise((r) => setTimeout(r, 10));
      return { uri: `file://uploaded/${file.name}`, mimeType: config?.mimeType ?? file.type ?? 'application/octet-stream' };
    },
    list: () => {},
    download: () => {},
    listInternal: () => {},
    delete: () => {},
    downloadInternal: () => {},
  };

  // Mock other properties as needed
protected apiClient = {
  clientOptions: {},
  baseUrlFromProjectLocation: () => "",
  normalizeAuthParameters: () => {},
  isVertexAI: () => false,
  getApiKey: () => "",
  getProject: () => "",
  getLocation: () => "",
  getApiVersion: () => "",
  getHeaders: () => {},
  getWebsocketBaseUrl: () => "",
  getBaseUrl: () => "",
  getRequestUrl: () => "",
  getRequestUrlInternal: () => "",
  getBaseResourcePath: () => "",
  setBaseUrl: () => {},
  constructUrl: () => "",
  shouldPrependVertexProjectPath: () => false,
  request: () => {},
  // Added missing methods
  patchHttpOptions: () => {},
  requestStream: () => {},
  includeExtraHttpOptionsToRequestInit: () => {},
  unaryApiCall: () => {},
  getFullUrl: () => "",
  getAuthHeaders: () => {},
  isRetryableError: () => false,
  retryRequest: () => {},
  processHttpResponse: () => {}
};
  protected vertexai = false;
  protected models = {
    apiClient: {},
    generateContent: () => {},
    maybeMoveToResponseJsonSchem: () => {},
    generateContentStream: () => {},
    list: () => {},
    get: () => {},
    delete: () => {},
    tune: () => {},
    listInternal: () => {},
    getInternal: () => {},
    deleteInternal: () => {},
    tuneInternal: () => {},
    processParamsMaybeAddMcpUsage: () => {},
    initAfcToolsMap: () => {},
    processAfcStream: () => {},
    generateImages: () => {},
    editImage: () => {},
    upscaleImage: () => {},
    generateVideos: () => {},
    generateContentInternal: () => {},
  };
  protected live = {
    apiClient: {},
    auth: {},
    webSocketFactory: {},
    music: {},
    connect: () => {},
    isCallableTool: () => false,
  };
  protected batches = {
    apiClient: {},
    create: () => {},
    list: () => {},
    createInternal: () => {},
    listInternal: () => {},
    get: () => {},
    delete: () => {},
    getInternal: () => {},
    deleteInternal: () => {},
    cancel: () => {},
  };
  protected chats = {
    modelsModule: {},
    apiClient: {},
    create: () => {},
    list: () => {},
    createInternal: () => {},
    listInternal: () => {},
    get: () => {},
    delete: () => {},
    getInternal: () => {},
    deleteInternal: () => {},
  };
  protected caches = {
    apiClient: {},
    list: () => {},
    create: () => {},
    get: () => {},
    delete: () => {},
    listInternal: () => {},
    createInternal: () => {},
    getInternal: () => {},
    deleteInternal: () => {},
    update: () => {},
  };
  protected operations = {
    apiClient: {},
    getVideosOperation: () => {},
    get: () => {},
    getVideosOperationInternal: () => {},
    fetchPredictVideosOperationInternal: () => {},
    getInternal: () => {},
  };
  protected authTokens = {
    apiClient: {},
    create: () => {},
    list: () => {},
    createInternal: () => {},
    listInternal: () => {},
    get: () => {},
    delete: () => {},
    getInternal: () => {},
    deleteInternal: () => {},
  };
  protected tunings = {
    apiClient: {},
    get: () => {},
    list: () => {},
    tune: () => {},
    getInternal: () => {},
    listInternal: () => {},
    tuneInternal: () => {},
    tuneMldevInternal: () => {},
  };
}

async function runTestCase(testName: string, file: MockFileLike) {
  try {
    // Provide a minimal mockAi expected by prepareAudioPart. The harness
    // previously referenced `mockAi` which didn't exist in this file.
    const mockAi = new MockAIClient();
    const part = await prepareAudioPart(mockAi as any, file as File);
    const mode = 'inlineData' in part ? 'inline' : 'fileData' in part ? 'upload' : 'unknown';
    console.log(`[PASS] ${testName} => accepted. Mode: ${mode}. Detected mime (returned):`, (part as any).fileData?.mimeType ?? (part as any).inlineData?.mimeType);
    return { ok: true, mode, part };
  } catch (err: any) {
    console.log(`[FAIL] ${testName} => threw:`, err?.message ?? String(err));
    return { ok: false, error: err?.message ?? String(err) };
  }
}

(async () => {
  console.log('--- Gemini MIME detection test harness ---');

  const summary: Array<{ name: string; ok: boolean; info?: any }> = [];

  console.log('\n1) Supported MIME provided in file.type (should be accepted):');
  for (const mime of SUPPORTED_MIMES) {
    const ext = Object.keys(SUPPORTED_EXT_TO_MIME).find((k) => SUPPORTED_EXT_TO_MIME[k] === mime) || 'wav';
    const file = { name: `song.${ext}`, type: mime, size: LARGE_FILE_SIZE } as MockFileLike;
    const res = await runTestCase(`Supported MIME: ${mime} (name: ${file.name})`, file);
    summary.push({ name: `supported-mime:${mime}`, ok: res.ok, info: { returnedMode: res.mode ?? null } });
  }

  console.log('\n2) Empty file.type + supported extension (should be accepted):');
  for (const [ext, mime] of Object.entries(SUPPORTED_EXT_TO_MIME)) {
    const file = { name: `instrumental.${ext}`, type: '', size: LARGE_FILE_SIZE } as MockFileLike;
    const res = await runTestCase(`Empty MIME, ext:${ext} -> expect ${mime}`, file);
    summary.push({ name: `ext-fallback:${ext}`, ok: res.ok, info: { ext, expectedMime: mime } });
  }

  console.log('\n3) Mismatched MIME (unsupported) vs supported extension (should be rejected):');
  for (const ext of Object.keys(SUPPORTED_EXT_TO_MIME)) {
    const file = { name: `weird.${ext}`, type: 'text/plain', size: LARGE_FILE_SIZE } as MockFileLike;
    const res = await runTestCase(`Mismatched: type=text/plain, ext=${ext}`, file);
    summary.push({ name: `mismatch:type-text,ext-${ext}`, ok: res.ok, info: { ext, type: file.type } });
  }

  console.log('\n4) Unsupported extension with empty MIME (should be rejected):');
  const txtFile = { name: 'notes.txt', type: '', size: LARGE_FILE_SIZE } as MockFileLike;
  const resTxt = await runTestCase('Unsupported extension .txt (empty type)', txtFile);
  summary.push({ name: 'unsupported-txt-empty', ok: resTxt.ok });

  console.log('\n5) Explicitly unsupported MIME (application/pdf) with misleading audio extension (e.g., .mp3) -> should be rejected:');
  const pdfFake = { name: 'notaudio.mp3', type: 'application/pdf', size: LARGE_FILE_SIZE } as MockFileLike;
  const resPdf = await runTestCase('Mismatched: application/pdf with .mp3 extension', pdfFake);
  summary.push({ name: 'unsupported-pdf-with-mp3-ext', ok: resPdf.ok });

  console.log('\n--- Test Summary ---');
  for (const s of summary) {
    console.log(`${s.ok ? '[OK] ' : '[ERR]'} ${s.name} ${s.info ? JSON.stringify(s.info) : ''}`);
  }

  // Separate positive and negative test expectations
  const positiveTests = summary.filter(
    s => s.name.startsWith('supported-mime') || s.name.startsWith('ext-fallback')
  );
  const negativeTests = summary.filter(s => !positiveTests.includes(s));
  
  const positivesPassed = positiveTests.every(s => s.ok);
  const negativesPassed = negativeTests.every(s => !s.ok); // these should fail
  
  const allTestsBehavedCorrectly = positivesPassed && negativesPassed;
  console.log('\nAll positive tests passed:', positivesPassed);
  console.log('All negative tests failed as expected:', negativesPassed);
  console.log('Overall test result:', allTestsBehavedCorrectly ? 'PASS' : 'FAIL');
  
  process.exitCode = allTestsBehavedCorrectly ? 0 : 1;
})();
