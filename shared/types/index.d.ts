export type AppStatus = 'idle' | 'loading' | 'processing' | 'error' | 'success' | 'ready' | 'finished' | 'analyzing' | 'generating' | 'riding';
// src/types/index.d.ts

export declare const AppStatus: {
  readonly Idle: 'idle';
  readonly Loading: 'loading';
  readonly Processing: 'processing';
  readonly Error: 'error';
  readonly Success: 'success';
  readonly Ready: 'ready';
  readonly Finished: 'finished';
  readonly Analyzing: 'analyzing';
  readonly Generating: 'generating';
  readonly Riding: 'riding';
};

export type AppStatus = typeof AppStatus[keyof typeof AppStatus];
