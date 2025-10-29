import asyncio
import hashlib
import io
import os
import structlog
from concurrent.futures import ThreadPoolExecutor
from typing import Dict, Any, List
import numpy as np
from cachetools import TTLCache
from fastapi import HTTPException
import librosa

from ..config.settings import settings

# Configure logging
logger = structlog.get_logger(__name__)

class AudioAnalysisError(Exception):
    """Custom exception for audio analysis failures."""
    pass

# Cache for audio analysis results (100 items, 1 hour TTL)
analysis_cache = TTLCache(maxsize=100, ttl=3600)

# Bounded thread pool executor for CPU-bound tasks
MAX_QUEUED_TASKS = 50
WORKERS = min(max(1, (os.cpu_count() or 4)), 8)

class BoundedThreadPoolExecutor(ThreadPoolExecutor):
    def __init__(self, max_workers, max_queued_tasks=MAX_QUEUED_TASKS):
        super().__init__(max_workers=max_workers)
        self._semaphore = asyncio.Semaphore(max_queued_tasks)

    async def submit_bounded(self, fn, *args, **kwargs):
        await self._semaphore.acquire()
        try:
            try:
                loop = asyncio.get_running_loop()
            except RuntimeError:
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
            return await loop.run_in_executor(self, fn, *args, **kwargs)
        finally:
            self._semaphore.release()

audio_analysis_executor = BoundedThreadPoolExecutor(max_workers=WORKERS)

# --- Fallback data generators ---

def _get_fallback_temporal_features() -> Dict[str, Any]:
    """Provide fallback values for temporal features."""
    return {'bpm': 120.0}

def _get_fallback_frame_analysis() -> Dict[str, Any]:
    """Provide fallback values for frame-by-frame analysis."""
    return {
        "energy": 0.0, "spectralCentroid": 0.0, "spectralFlux": 0.0, "frameAnalyses": []
    }

def _get_fallback_emotional_fingerprint() -> Dict[str, Any]:
    """Provide fallback values for emotional fingerprint."""
    return {
        'tonal_tension': 0.0, 'valence_curve': 0.0, 'rhythmic_complexity': 0.0,
        'textural_separation': {'harmonic_dominance': 0.0, 'percussive_energy': 0.0}
    }

# --- Core Analysis Functions ---

def _extract_emotional_fingerprint(y: np.ndarray, sr: float) -> Dict[str, Any]:
    harmonic, percussive = librosa.effects.hpss(y)
    chroma = librosa.feature.chroma_stft(y=y, sr=sr)
    tonal_tension_curve = np.std(chroma, axis=0)
    tonnetz = librosa.feature.tonnetz(y=harmonic, sr=sr)
    valence_curve = np.mean(tonnetz, axis=0)
    onset_strength = librosa.onset.onset_strength(y=y, sr=sr)
    y_mean_squared = np.mean(y**2)
    harmonic_dominance = np.mean(harmonic**2) / y_mean_squared if y_mean_squared > 1e-10 else 0.0
    percussive_energy = np.mean(percussive**2) / y_mean_squared if y_mean_squared > 1e-10 else 0.0
    return {
        'tonal_tension': float(np.mean(tonal_tension_curve)),
        'valence_curve': float(np.mean(valence_curve)),
        'rhythmic_complexity': float(np.mean(onset_strength)),
        'textural_separation': {
            'harmonic_dominance': float(harmonic_dominance),
            'percussive_energy': float(percussive_energy)
        }
    }

def _analyze_audio_sync(audio_bytes: bytes) -> Dict[str, Any]:
    """
    Performs synchronous, robust audio analysis with graceful error handling.
    """
    try:
        # 1. Input validation
        if not audio_bytes:
            raise AudioAnalysisError("Empty audio data provided")

        # 2. Load audio with error handling
        try:
            audio_stream = io.BytesIO(audio_bytes)
            target_sr = 22050
            y, sr = librosa.load(audio_stream, sr=target_sr, mono=True)
        except Exception as e:
            logger.error("Failed to decode audio", error=str(e), exc_info=True)
            raise AudioAnalysisError(f"Failed to decode audio: {e}")

        # 3. Validate loaded audio
        if len(y) == 0: raise AudioAnalysisError("Audio file contains no data")
        if sr <= 0: raise AudioAnalysisError("Invalid sample rate detected")
        if len(y) / sr < 0.1: raise AudioAnalysisError("Audio file too short for analysis")

        # 4. Normalize audio
        if np.max(np.abs(y)) > 0:
            y = y / np.max(np.abs(y))

        duration = float(librosa.get_duration(y=y, sr=sr))
        if duration > settings.ANALYSIS_MAX_SECONDS:
            max_samples = int(settings.ANALYSIS_MAX_SECONDS * sr)
            y = y[:max_samples]
            duration = settings.ANALYSIS_MAX_SECONDS

        features: Dict[str, Any] = {"duration": duration}

        # 5. Extract features with individual fallbacks
        try:
            tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
            features['bpm'] = float(tempo) if tempo else 120.0
        except Exception as e:
            logger.warning("BPM estimation failed, using fallback.", error=str(e))
            features.update(_get_fallback_temporal_features())

        try:
            S = np.abs(librosa.stft(y, n_fft=settings.ANALYSIS_N_FFT, hop_length=settings.ANALYSIS_HOP_LENGTH))
            if S.shape[1] == 0:
                features.update(_get_fallback_frame_analysis())
            else:
                times = librosa.frames_to_time(np.arange(S.shape[1]), sr=sr, hop_length=settings.ANALYSIS_HOP_LENGTH)
                rms = librosa.feature.rms(S=S)[0]
                centroid = librosa.feature.spectral_centroid(S=S, sr=sr)[0]
                flux = np.abs(np.diff(centroid, prepend=centroid[0]))

                features["frameAnalyses"] = [{
                    "timestamp": float(times[i]), "energy": float(rms[i]),
                    "spectralCentroid": float(centroid[i]), "spectralFlux": float(flux[i])
                } for i in range(S.shape[1])]

                avg_energy = np.mean(rms) if len(rms) > 0 else 0.0
                features["energy"] = float(np.clip(avg_energy * 5, 0, 1))
                features["spectralCentroid"] = float(np.mean(centroid)) if len(centroid) > 0 else 0.0
                features["spectralFlux"] = float(np.mean(flux)) if len(flux) > 0 else 0.0
        except Exception as e:
            logger.warning("Frame-by-frame analysis failed, using fallback.", error=str(e))
            features.update(_get_fallback_frame_analysis())

        try:
            features['emotional_fingerprint'] = _extract_emotional_fingerprint(y, sr)
        except Exception as e:
            logger.warning("Emotional fingerprint failed, using fallback.", error=str(e))
            features['emotional_fingerprint'] = _get_fallback_emotional_fingerprint()

        logger.info("Audio analysis complete", duration_s=round(duration, 1), frame_count=len(features.get("frameAnalyses", [])), bpm=round(features.get('bpm', 0), 1))
        return features

    except AudioAnalysisError:
        raise
    except Exception as e:
        logger.error("Unexpected error in audio analysis", error=str(e), exc_info=True)
        raise AudioAnalysisError(f"Audio analysis failed unexpectedly: {e}")

async def analyze_audio(audio_bytes: bytes) -> Dict[str, Any]:
    """
    Asynchronously analyzes audio, handling caching and errors gracefully.
    """
    cache_key = hashlib.sha256(audio_bytes).hexdigest()
    if cache_key in analysis_cache:
        logger.info("Audio analysis cache hit", cache_key=cache_key)
        return analysis_cache[cache_key]

    logger.info("Audio analysis cache miss", cache_key=cache_key)
    try:
        features = await audio_analysis_executor.submit_bounded(_analyze_audio_sync, audio_bytes)
        analysis_cache[cache_key] = features
        return features
    except AudioAnalysisError as e:
        logger.error("Audio analysis failed", detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        logger.error("Runtime error from analysis thread", error=str(e), exc_info=True)
        # Re-raise as AudioAnalysisError to be caught by the caller
        raise AudioAnalysisError(f"Audio analysis failed unexpectedly: {e}")
    except Exception as e:
        logger.error("Unexpected error from analysis thread", error=str(e), exc_info=True)
        raise HTTPException(status_code=500, detail="An internal error occurred during audio analysis.")
