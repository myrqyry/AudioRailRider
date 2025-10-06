// Lightweight AudioWorkletProcessor for low-latency analysis.
// This file is served as a static module so the main thread can
// call `audioContext.audioWorklet.addModule('/worklets/analyzer-processor.js')`.

class SimpleAnalyzerProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._prevMagnitudes = null;
    this.port.onmessage = (ev) => {
      // Accept parameters from main thread in future versions.
    };
  }

  // In-place iterative radix-2 FFT (Cooley-Tukey). Accepts real input
  // in 're' array and fills 're' and 'im' arrays with frequency bins.
  _fft(re, im) {
    const n = re.length;
    const levels = Math.floor(Math.log2(n));
    // Bit-reversal permutation
    for (let i = 0; i < n; i++) {
      let j = 0;
      for (let k = 0; k < levels; k++) {
        j = (j << 1) | ((i >> k) & 1);
      }
      if (j > i) {
        const tr = re[i]; re[i] = re[j]; re[j] = tr;
        const ti = im[i]; im[i] = im[j]; im[j] = ti;
      }
    }

    for (let size = 2; size <= n; size <<= 1) {
      const half = size >> 1;
      const theta = -2 * Math.PI / size;
      const wMulRe = Math.cos(theta);
      const wMulIm = Math.sin(theta);
      for (let i = 0; i < n; i += size) {
        let wr = 1.0, wi = 0.0;
        for (let j = 0; j < half; j++) {
          const idx1 = i + j;
          const idx2 = i + j + half;
          const tr = wr * re[idx2] - wi * im[idx2];
          const ti = wr * im[idx2] + wi * re[idx2];

          re[idx2] = re[idx1] - tr;
          im[idx2] = im[idx1] - ti;
          re[idx1] = re[idx1] + tr;
          im[idx1] = im[idx1] + ti;

          // update wr, wi
          const newWr = wr * wMulRe - wi * wMulIm;
          const newWi = wr * wMulIm + wi * wMulRe;
          wr = newWr; wi = newWi;
        }
      }
    }
  }

  process(inputs) {
    try {
      const input = inputs[0];
      if (!input || !input[0]) return true;
      const frame = input[0];
      const N = frame.length;

      // Energy (time-domain)
      let energy = 0;
      for (let i = 0; i < N; i++) energy += frame[i]*frame[i];
      energy = energy / N;

      // Prepare real and imag arrays for FFT
      const re = new Float32Array(N);
      const im = new Float32Array(N);
      for (let i = 0; i < N; i++) { re[i] = frame[i]; im[i] = 0.0; }

      // FFT (in-place)
      this._fft(re, im);

      const half = N >> 1;
      const mags = new Float32Array(half);
      for (let k = 0; k < half; k++) {
        const r = re[k]; const i2 = im[k];
        mags[k] = Math.hypot(r, i2);
      }

      // Spectral centroid (weighted mean of bin indices)
      let num = 0, den = 0;
      for (let k = 0; k < mags.length; k++) { num += k * mags[k]; den += mags[k]; }
      const spectralCentroid = den > 0 ? num / den : 0;

      // Spectral flux vs previous frame
      let flux = 0;
      if (this._prevMagnitudes) {
        const L = Math.min(this._prevMagnitudes.length, mags.length);
        for (let k = 0; k < L; k++) {
          const d = mags[k] - this._prevMagnitudes[k];
          flux += d > 0 ? d : 0;
        }
      }

      // Simple band energies (by bin ranges)
      const bassRange = Math.floor(mags.length * 0.15);
      const midRange = Math.floor(mags.length * 0.6);
      let bass = 0, mid = 0, high = 0;
      for (let k = 0; k < mags.length; k++) {
        if (k < bassRange) bass += mags[k];
        else if (k < midRange) mid += mags[k];
        else high += mags[k];
      }
      const total = bass + mid + high || 1;
      bass /= total; mid /= total; high /= total;

      this._prevMagnitudes = mags;

      this.port.postMessage({
        type: 'analysis',
        timestamp: currentTime,
        energy: energy,
        spectralCentroid: spectralCentroid,
        spectralFlux: flux,
        bass: bass,
        mid: mid,
        high: high
      });
    } catch (e) {
      // Keep audio thread stable
    }
    return true;
  }
}

registerProcessor('simple-analyzer-processor', SimpleAnalyzerProcessor);
