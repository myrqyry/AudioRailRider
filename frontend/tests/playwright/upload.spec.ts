import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';

// Helper: poll the dev server until it responds or timeout
const waitForServer = (url: string, timeout = 30000): Promise<void> => {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const req = http.request(url, { method: 'HEAD' }, (res) => {
        res.destroy();
        return resolve();
      });
      req.on('error', () => {
        if (Date.now() - start > timeout) return reject(new Error('Server did not respond within timeout'));
        setTimeout(attempt, 500);
      });
      req.end();
    };
    attempt();
  });
};

// This test assumes the frontend dev server is running at http://localhost:5173
// It uploads a small fixture and asserts there are no uncaught exceptions.

test('upload audio and ensure no uncaught exceptions', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('pageerror', (err: Error) => {
    consoleErrors.push(String(err));
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await waitForServer('http://localhost:5173');
  // Ensure backend is running for the end-to-end workflow
  // If the test harness didn't start the backend, start it here and ensure shutdown.
  // The backend dev script is defined in ../backend/package.json as `pnpm -C ../backend run dev`.
  // We'll start it only if port 8000 is not yet responding.
  let backendStartedHere = false;
  let backendProc: ChildProcessWithoutNullStreams | null = null;
  try {
    await waitForServer('http://localhost:8000', 2000).catch(async () => {
      // Not responding yet — start the backend dev server
      backendStartedHere = true;
      // Use a single shell string so pnpm -C ../backend run dev runs in the right place
      backendProc = spawn('pnpm -C ../backend run dev', {
        cwd: process.cwd(),
        shell: true,
        detached: true,
        stdio: 'ignore',
      }) as unknown as ChildProcessWithoutNullStreams;
      // wait up to 90s for backend
      await waitForServer('http://localhost:8000', 90000);
    });
  } catch (err) {
    if (backendProc) backendProc.kill();
    throw err;
  }
  await page.goto('http://localhost:5173/');
  // Wait for the file input to be attached to the DOM (it may be visually hidden)
  const fileInput = await page.waitForSelector('#audio-upload', { state: 'attached', timeout: 10000 });
  // Compute __dirname equivalent in ESM
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.join(__dirname, '..', 'fixtures', 'test.mp3');
  await fileInput.setInputFiles(filePath);

  // Give the app some time to start the workflow and surface any exceptions
  await page.waitForTimeout(5000);

  // Clean up backend if we started it
  if (backendStartedHere && backendProc) {
    try { backendProc.kill(); } catch (e) { /* ignore */ }
  }

  expect(consoleErrors).toEqual([]);
});
