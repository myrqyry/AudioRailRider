import { useState, useCallback, useRef } from 'react';

export const useMicrophoneInput = (audioContext: AudioContext | null) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isMicOn, setIsMicOn] = useState(false);
  const [mediaStreamSource, setMediaStreamSource] = useState<MediaStreamAudioSourceNode | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);

  const startMicrophone = useCallback(async () => {
    if (!audioContext) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;
      const source = audioContext.createMediaStreamSource(stream);
      setMediaStreamSource(source);
      setIsMicOn(true);
      setIsMuted(false);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  }, [audioContext]);

  const stopMicrophone = useCallback(() => {
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => track.stop());
      mediaStream.current = null;
    }
    if (mediaStreamSource) {
      mediaStreamSource.disconnect();
      setMediaStreamSource(null);
    }
    setIsMicOn(false);
    setIsMuted(true);
  }, [mediaStreamSource]);

  const toggleMute = useCallback(() => {
    if (mediaStream.current) {
      mediaStream.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(prev => !prev);
    }
  }, []);

  return {
    isMuted,
    isMicOn,
    startMicrophone,
    stopMicrophone,
    toggleMute,
    mediaStreamSource,
  };
};
