import fs from 'fs';
import path from 'path';
import { analyzeAudio } from '../lib/audioProcessor.js';

async function testAudioAnalysis() {
  try {
    // Path to a sample audio file (you can replace this with any valid audio file path)
    const audioFilePath = path.join(__dirname, '..', 'sample.mp3');

    // Check if the file exists
    if (!fs.existsSync(audioFilePath)) {
      console.error(`File not found: ${audioFilePath}`);
      return;
    }

    // Read the file as a buffer
    const audioFile = fs.readFileSync(audioFilePath);

    // Create a File object from the buffer
    const file = new File([audioFile], 'sample.mp3', { type: 'audio/mp3' });

    // Analyze the audio
    const audioFeatures = await analyzeAudio(file);

    // Log the results
    console.log('Audio Analysis Results:');
    console.log(`Duration: ${audioFeatures.duration} seconds`);
    console.log(`BPM: ${audioFeatures.bpm}`);
    console.log(`Energy: ${audioFeatures.energy}`);
    console.log(`Spectral Centroid: ${audioFeatures.spectralCentroid}`);
    console.log(`Spectral Flux: ${audioFeatures.spectralFlux}`);
  } catch (error) {
    console.error('Error analyzing audio:', error);
  }
}

testAudioAnalysis();
