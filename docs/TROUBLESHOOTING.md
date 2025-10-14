# Troubleshooting Guide

## Common Issues and Solutions

### Issue: "Begin the Ride" button doesn't start the ride

**Symptoms:**
- Clicking "Begin the Ride" button does nothing
- App stays on the "Ready" screen
- ThreeCanvas/scene doesn't appear

**Root Causes & Solutions:**

#### 1. UI Overlay Blocking the Scene
**Problem:** The UI overlay div was staying visible with `z-10` during riding, blocking the ThreeCanvas underneath.

**Solution:** The UI overlay now only renders when `status !== AppStatus.Riding`:
```tsx
{status !== AppStatus.Riding && (
    <div className="relative z-10 p-4">
        {renderContent()}
    </div>
)}
```

#### 2. State Not Transitioning Properly
**Problem:** The `startRide()` action might fail silently if conditions aren't met.

**Check Console Logs:**
```
[App] Begin the Ride button clicked
[Store] startRide called { status: 'ready', hasTrackData: true, hasAudioFile: true }
[Store] Transitioning to Riding state
```

If you see `Cannot start ride - conditions not met`, check:
- Is `status === AppStatus.Ready`?
- Is `trackData` present?
- Is `audioFile` present?

#### 3. Audio Not Playing
**Problem:** Audio setup fails or doesn't start.

**Check Console Logs:**
```
[useAudioAnalysis] Effect triggered { status: 'riding', hasAudioFile: true }
[useAudioAnalysis] Setting up audio for riding
[useAudioAnalysis] Starting audio playback
[useAudioAnalysis] Audio playing successfully
```

**Common Audio Issues:**
- **Browser autoplay policy:** Most browsers block autoplay until user interaction. The "Begin the Ride" button click should satisfy this requirement.
- **Audio file format:** Ensure MP3/WAV files are properly encoded
- **File size:** Very large files (>20MB) may cause issues
- **CORS issues:** If loading audio from a URL, check CORS headers

#### 4. Animation Loop Not Starting
**Problem:** ThreeCanvas renders but nothing animates.

**Check Console Logs:**
```
[ThreeCanvas] Animation effect triggered { status: 'riding', hasTrackData: true, hasAudioFile: true }
[ThreeCanvas] Starting animation loop
```

**Potential Issues:**
- Check if `requestAnimationFrame` is being called
- Verify scene components (SceneManager, RideCamera, VisualEffects) are initialized
- Look for JavaScript errors in the animation frame

### Issue: False "0.0 FPS" Warnings on Startup

**Symptoms:**
- Console shows `[VisualEffects] Low perf detected: 0.0 FPS`
- Happens immediately after uploading audio
- Performance seems fine despite warning

**Root Cause:** GPU/WebGL initialization and shader compilation blocks the first few frames.

**Solution:** Implemented a 5-second warmup period that skips FPS checks during initialization.

**Expected Behavior:**
- No FPS warnings during the first 5 seconds after upload
- Performance monitoring starts after warmup completes
- Real performance issues will still be detected after warmup

### Issue: CORS Errors with Backend

**Symptoms:**
```
Access to fetch at 'http://localhost:8000/api/generate-blueprint' from origin 'http://127.0.0.1:5173' has been blocked by CORS policy
```

**Root Cause:** Frontend running on `127.0.0.1:5173` but backend only allows `localhost:5173`.

**Solution:** Backend CORS config now includes both:
```python
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

**Important:** Restart backend after changing CORS config!

### Issue: Shaders Not Loading / GPU Errors

**Symptoms:**
- Black screen during ride
- Console errors about shader compilation
- WebGL context lost errors

**Solutions:**

1. **Check GPU Drivers:** Ensure graphics drivers are up to date

2. **Verify Shader Files Exist:**
   - `/public/shaders/velFrag.resolved.glsl`
   - `/public/shaders/posFrag.resolved.glsl`
   - `/public/lygia/resolve.esm.js`

3. **Check Preloader:**
   ```
   [Preloader] Starting resource preload...
   [Preloader] Cached shader: /shaders/velFrag.resolved.glsl
   [Preloader] Cached shader: /shaders/posFrag.resolved.glsl
   ```

4. **GPU Initialization Failures:**
   - Check browser console for WebGL errors
   - Try disabling GPU features in browser flags
   - Test in different browser (Chrome vs Firefox)

5. **Shader Compilation Errors:**
   - Look for GLSL syntax errors in console
   - Check if LYGIA resolver loaded successfully
   - Verify shader uniform names match

### Debug Checklist

When ride doesn't start, check these in order:

1. **Console Logs** - Look for the sequence:
   ```
   [App] Begin the Ride button clicked
   [Store] Transitioning to Riding state
   [useAudioAnalysis] Setting up audio for riding
   [ThreeCanvas] Starting animation loop
   [useAudioAnalysis] Audio playing successfully
   ```

2. **Network Tab** - Verify:
   - Blueprint generation completed (200 OK)
   - Shader files loaded successfully
   - No CORS errors

3. **React DevTools** - Check state:
   - `status` should be `'riding'`
   - `trackData` should be populated
   - `audioFile` should be present

4. **DOM Inspection:**
   - ThreeCanvas div should be visible (`opacity-100`)
   - UI overlay should be hidden when riding
   - Canvas element should exist in DOM

5. **Audio Element:**
   - Check if `<audio>` element is created
   - Verify audio source blob URL
   - Check `currentTime` is incrementing
   - Verify `paused` is `false`

### Still Having Issues?

1. **Hard Refresh:** Press Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. **Clear Cache:** Clear browser cache and reload
3. **Check Backend:** Ensure backend is running on `http://localhost:8000`
4. **Try Different File:** Test with a different audio file
5. **Browser Console:** Look for any uncaught errors
6. **Check File Size:** Ensure audio file is under 20MB

### Logging Reference

Key log prefixes to filter for:
- `[App]` - Main app component actions
- `[Store]` - State management actions
- `[useAudioAnalysis]` - Audio setup and playback
- `[ThreeCanvas]` - Scene rendering and animation
- `[VisualEffects]` - GPU/visual effects system
- `[Preloader]` - Resource preloading
- `[Workflow]` - Audio processing workflow
- `[GeminiService]` - Backend API communication

### Performance Tips

1. **Use Pre-Resolved Shaders:** Run build scripts to pre-resolve LYGIA includes
2. **Enable Preloading:** Preloader should start automatically on app mount
3. **GPU Acceleration:** Ensure hardware acceleration is enabled in browser
4. **Close Other Tabs:** Free up GPU resources for better performance
5. **Monitor FPS:** Check DevPanel for real-time performance metrics

## Getting Help

If issues persist:
1. Check the console logs for all prefixes above
2. Note which step in the sequence fails
3. Check browser compatibility (Chrome/Edge recommended)
4. Verify all services are running (backend, frontend)
5. Review recent code changes that might affect the ride flow
