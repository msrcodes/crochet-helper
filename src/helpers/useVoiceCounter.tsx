import {createSpeechlySpeechRecognition} from '@speechly/speech-recognition-polyfill';
import {useEffect, useState} from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import wordsToNumbers from 'words-to-numbers';

const appId = '23bd67e4-b376-484f-b92c-a0b5dbfeb294';
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

interface VoiceCounterOptions {
  countTo: number;
}

const useVoiceCounter = ({countTo}: VoiceCounterOptions) => {
  // Initialise values
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
    isMicrophoneAvailable,
  } = useSpeechRecognition();
  const [currentCount, setCurrentCount] = useState(0);
  const [next, setNext] = useState(1);

  // Start listening immediately
  useEffect(() => {
    SpeechRecognition.startListening({continuous: true});
  }, []);

  // Listen for N, and once heard, start listening for N + 1...
  useEffect(() => {
    const fromTranscript = wordsToNumbers(transcript);

    if (typeof fromTranscript === 'number' && fromTranscript === next) {
      setCurrentCount(fromTranscript);
      setNext(next + 1);
    }

    resetTranscript();
  }, [transcript]);

  // Helper values
  const isListening = listening && isMicrophoneAvailable;
  const done = currentCount >= countTo;

  return {currentCount, browserSupportsSpeechRecognition, isListening, done};
};
export default useVoiceCounter;