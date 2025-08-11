import Meyda from 'meyda';
/**
 * Simple BPM analysis function.
 * This is a placeholder implementation. For production use, consider using a more robust BPM detection library.
 */
const analyzeFullBuffer = async (audioBuffer) => {
    const channelData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    const bufferLength = channelData.length;
    // Simple BPM detection algorithm (placeholder)
    const bpm = 120; // Placeholder BPM value
    return [{ tempo: bpm }];
};
export const analyzeAudio = async (audioFile) => {
    const audioContext = new AudioContext();
    let audioBuffer = null;
    // Primary attempt: Web Audio API decoding (preferred, allows full analysis)
    try {
        const arrayBuffer = await audioFile.arrayBuffer();
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    }
    catch (primaryError) {
        console.error("[audioProcessor] Primary decodeAudioData failed:", primaryError);
        // Fallback attempt: Use HTMLAudioElement to at least obtain duration metadata.
        // This avoids adding new dependencies and keeps downstream processing moving.
        try {
            const url = URL.createObjectURL(audioFile);
            const audioEl = new Audio();
            audioEl.preload = 'metadata';
            const duration = await new Promise((resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    cleanup();
                    reject(new Error('Audio metadata loading timeout after 30s'));
                }, 30000);
                const onLoaded = () => {
                    cleanup();
                    // audioEl.duration can be NaN/Infinity in some edge cases; coerce to number
                    const d = typeof audioEl.duration === 'number' && isFinite(audioEl.duration) ? audioEl.duration : NaN;
                    if (isNaN(d)) {
                        reject(new Error('HTMLAudioElement provided an invalid duration'));
                    }
                    else {
                        resolve(d);
                    }
                };
                const onError = (ev) => {
                    cleanup();
                    reject(new Error('HTMLAudioElement failed to load metadata'));
                };
                const cleanup = () => {
                    clearTimeout(timeoutId);
                    audioEl.removeEventListener('loadedmetadata', onLoaded);
                    audioEl.removeEventListener('error', onError);
                    // Revoke object URL after we are done to free memory
                    try {
                        URL.revokeObjectURL(url);
                    }
                    catch (e) { /* ignore */ }
                };
                audioEl.addEventListener('loadedmetadata', onLoaded);
                audioEl.addEventListener('error', onError);
            });
            console.warn(`[audioProcessor] decodeAudioData failed; used HTMLAudioElement metadata fallback for duration (${audioFile.name}). Duration:${duration}s`);
            // Close AudioContext since we won't use it for further analysis in fallback path.
            try {
                await audioContext.close();
            }
            catch (e) {
                console.debug('[audioProcessor] audioContext.close() during fallback failed:', e);
            }
            // Return partial AudioFeatures with valid duration and conservative defaults so downstream logic can proceed.
            return {
                duration,
                bpm: 120, // conservative default tempo
                energy: 0,
                spectralCentroid: 0,
                spectralFlux: 0,
            };
        }
        catch (fallbackError) {
            console.error("[audioProcessor] Fallback metadata extraction failed:", fallbackError);
            // Ensure AudioContext is closed before propagating error
            try {
                await audioContext.close();
            }
            catch (e) {
                console.debug('[audioProcessor] audioContext.close() after both failures failed:', e);
            }
            // Combine errors to aid debugging
            const primaryMsg = primaryError instanceof Error ? primaryError.message : String(primaryError);
            const fallbackMsg = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
            throw new Error(`Could not decode the audio file. Primary decode error: ${primaryMsg}. Fallback metadata extraction error: ${fallbackMsg}. ` +
                `The file may be corrupted or in an unsupported format. Please try a different MP3 or WAV file.`);
        }
    }
    // If we reach here, primary decode succeeded and audioBuffer is available.
    if (!audioBuffer) {
        // Defensive check (shouldn't happen, but guard anyway)
        try {
            await audioContext.close();
        }
        catch (e) {
            console.debug('[audioProcessor] audioContext.close() defensive path failed:', e);
        }
        throw new Error('Decoded audio buffer was not produced by decodeAudioData.');
    }
    // BPM Analysis
    const bpmCandidates = await analyzeFullBuffer(audioBuffer);
    const bpm = bpmCandidates.length > 0 ? bpmCandidates[0].tempo : 120;
    // Detailed audio analysis using Meyda
    const channelData = audioBuffer.getChannelData(0);
    // Configure Meyda analyzer with desired buffer size
    const analyzer = Meyda.create({
        audioContext: audioContext,
        source: null, // We'll provide the buffer directly
        bufferSize: 1024,
        featureExtractors: ['energy', 'spectralCentroid', 'spectralFlux']
    });
    let energy = 0;
    let spectralCentroid = 0;
    let spectralFlux = 0;
    let frameCount = 0;
    // Process the audio buffer in chunks
    for (let i = 0; i < channelData.length; i += analyzer.bufferSize) {
        const frame = channelData.slice(i, i + analyzer.bufferSize);
        if (frame.length === analyzer.bufferSize) {
            // Extract features for this frame
            const features = analyzer.get(frame);
            energy += (typeof features.energy === 'number' ? features.energy : 0);
            spectralCentroid += (typeof features.spectralCentroid === 'number' ? features.spectralCentroid : 0);
            spectralFlux += (typeof features.spectralFlux === 'number' ? features.spectralFlux : 0);
            frameCount++;
        }
    }
    const avgEnergy = frameCount > 0 ? energy / frameCount : 0;
    const avgSpectralCentroid = frameCount > 0 ? spectralCentroid / frameCount : 0;
    const avgSpectralFlux = frameCount > 0 ? spectralFlux / frameCount : 0;
    // Normalize energy to a 0-1 scale (this is a rough approximation)
    const normalizedEnergy = Math.min(avgEnergy / 10, 1);
    await audioContext.close();
    return {
        duration: audioBuffer.duration,
        bpm: bpm,
        energy: normalizedEnergy,
        spectralCentroid: avgSpectralCentroid,
        spectralFlux: avgSpectralFlux,
    };
};
