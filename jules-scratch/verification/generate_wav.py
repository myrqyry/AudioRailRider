import wave
import struct

# --- Configuration ---
filename = "jules-scratch/verification/silent.wav"
duration_seconds = 1
sample_rate = 44100
num_channels = 1  # Mono
sample_width = 2  # 16-bit
num_frames = duration_seconds * sample_rate

# --- Waveform Generation ---
# Create a silent audio signal (all zeros)
amplitude = 0
data = [amplitude] * num_frames

# --- Write to WAV file ---
try:
    with wave.open(filename, 'w') as wav_file:
        # Set WAV file parameters
        wav_file.setnchannels(num_channels)
        wav_file.setsampwidth(sample_width)
        wav_file.setframerate(sample_rate)

        # Pack the silent audio data into binary format
        for sample in data:
            # 'h' format is for a 16-bit signed integer
            wav_file.writeframes(struct.pack('h', sample))

    print(f"Successfully generated silent WAV file: {filename}")

except Exception as e:
    print(f"Error generating WAV file: {e}")