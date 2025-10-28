import wave
import struct

def create_silent_wav(filename, duration=1, sample_rate=44100, num_channels=1, sample_width=2, compression_type="NONE", compression_name="not compressed"):
    num_samples = int(duration * sample_rate)
    wav_file = wave.open(filename, "w")
    wav_file.setparams((num_channels, sample_width, sample_rate, num_samples, compression_type, compression_name))
    for i in range(num_samples):
        wav_file.writeframes(struct.pack('h', 0))
    wav_file.close()
