
// Simplified to only get duration, which is fast.
export const analyzeAudio = async (audioFile: File): Promise<{ duration: number }> => {
  const audioContext = new AudioContext();
  const arrayBuffer = await audioFile.arrayBuffer();
  try {
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      await audioContext.close();
      return { duration: audioBuffer.duration };
  } catch (error) {
      console.error("Error decoding audio data:", error);
      throw new Error("Could not decode audio file.");
  }
};
