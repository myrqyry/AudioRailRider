import React, { useEffect } from 'react';
import { useMicrophoneInput } from '../hooks/useMicrophoneInput';
import { useAppStore } from '../lib/store';
import { AppStatus } from 'shared/types';
import { MicrophoneIcon } from './Icon';

interface MicrophoneControlsProps {
  audioContext: AudioContext | null;
}

const MicrophoneControls: React.FC<MicrophoneControlsProps> = ({ audioContext }) => {
  const { setAudioSource, setStatus } = useAppStore((state) => state.actions);
  const { isMicOn, startMicrophone, stopMicrophone, mediaStreamSource } = useMicrophoneInput(audioContext);

  useEffect(() => {
    setAudioSource(mediaStreamSource);
  }, [mediaStreamSource, setAudioSource]);

  const handleToggleMicrophone = () => {
    if (isMicOn) {
      stopMicrophone();
      setStatus(AppStatus.Idle);
    } else {
      startMicrophone();
      setStatus(AppStatus.Ready);
    }
  };

  return (
    <button
      onClick={handleToggleMicrophone}
      className={`mt-4 inline-flex items-center gap-3 px-8 py-4 bg-gray-800/50 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700/70 transition-all duration-300 transform hover:scale-105 ${
        isMicOn ? 'border-green-400 text-green-400' : 'hover:border-cyan-400'
      }`}
    >
      <MicrophoneIcon className="w-6 h-6" />
      <span>{isMicOn ? 'Stop Microphone' : 'Use Microphone'}</span>
    </button>
  );
};

export default MicrophoneControls;
