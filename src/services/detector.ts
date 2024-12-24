import { maxbullshitUnits } from "./levels";
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const subscribedCallbacks: ((bullshitUnits: number) => void)[] = [];

const unitsIncrement = 1000;
let currentBullshitUnits = 100;
let recognition: SpeechRecognition;
let wordsToTrackMap: { [key: string]: number } = {};

function onTranscriptWords(transcript: string) {
  console.log(`Heard: ${transcript}`);
  const transcriptWords = transcript.split(" ");

  let bullshitSuspected = false;
  for (const word of transcriptWords) {
    // Check if the word is in our list and increment counter
    if (wordsToTrackMap[word] !== undefined) {
      bullshitSuspected = true;
      wordsToTrackMap[word]++;
      console.log(`Word detected: "${word}". Count: ${wordsToTrackMap[word]}`);
      if (currentBullshitUnits + unitsIncrement < maxbullshitUnits) {
        currentBullshitUnits += unitsIncrement;
      } else {
        currentBullshitUnits = maxbullshitUnits;
      }
    }
  }
  if (bullshitSuspected) {
    notifySubscribers();
  }
}

export function startTracking(wordsToTrack: string[]) {
  console.log("Starting speech recognition...");

  // Words list to track and their match counters
  wordsToTrackMap = {};
  for (const word of wordsToTrack) {
    wordsToTrackMap[word.toLowerCase()] = 0;
  }

  // Initialize SpeechRecognition
  if (recognition) {
    console.log("Speech recognition already initialized.");
    return;
  }

  if (!SpeechRecognition) {
    console.error("SpeechRecognition is not supported in this browser.");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "en-US"; // Set the language
  recognition.continuous = true; // Keep listening continuously
  recognition.interimResults = false; // Only handle finalized words
  console.log("Speech recognition initialized.");

  // Event: On receiving results
  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const lastTranscriptIndex = event.results.length - 1;
    const transcript = event.results[lastTranscriptIndex][0].transcript.trim().toLowerCase();
    onTranscriptWords(transcript);
  };

  // Event: On error
  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    console.error("Speech Recognition Error:", event.error);
    console.error("event.error:", event);
  };

  // Event: On end (auto-restarts)
  recognition.onend = () => {
    console.log("Speech recognition stopped. Restarting...");
    setTimeout(() => recognition.start(), 2000); // Restart after 2 seconds
  };

  // Start recognition
  console.log("Starting speech recognition...");
  recognition.start();
}

export function stopTracking() {
  recognition?.stop();
}

export function subscribeToBullshitUnits(onUnitsChange: (bullshitUnits: number) => void) {
  subscribedCallbacks.push(onUnitsChange);
}

function notifySubscribers() {
  for (const callback of subscribedCallbacks) {
    console.log("Notifying subscriber...", currentBullshitUnits);
    callback(currentBullshitUnits);
  }
}
