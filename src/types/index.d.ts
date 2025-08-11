export type AppStatus = 'idle' | 'loading' | 'processing' | 'error' | 'success' | 'ready' | 'finished' | 'analyzing' | 'generating' | 'riding';
export const AppStatus = {
  Idle: 'idle' as AppStatus,
  Loading: 'loading' as AppStatus,
  Processing: 'processing' as AppStatus,
  Error: 'error' as AppStatus,
  Success: 'success' as AppStatus,
  Ready: 'ready' as AppStatus,
  Finished: 'finished' as AppStatus,
  Analyzing: 'analyzing' as AppStatus,
  Generating: 'generating' as AppStatus,
  Riding: 'riding' as AppStatus,
};
