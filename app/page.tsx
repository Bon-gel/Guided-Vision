"use client";

import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, off } from "firebase/database";

// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCU7AvVlcdXhCX_oNwLnb52kzZffaOFJpA",
  authDomain: "idris-final-year-project.firebaseapp.com",
  databaseURL:
    "https://idris-final-year-project-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "idris-final-year-project",
  storageBucket: "idris-final-year-project.firebasestorage.app",
  messagingSenderId: "944665259379",
  appId: "1:944665259379:web:b00edbe07408d966ab6906",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function Home() {
  const [distance, setDistance] = useState<number | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceReady, setVoiceReady] = useState(false);
  const [lastSpoken, setLastSpoken] = useState(0);

  const cooldown = 5000; // 5-second cooldown between speech

  // ✅ Initialize system voices
  const initVoices = () => {
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) {
        setVoices(v);
        setVoiceReady(true);
      }
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
  };

  // ✅ Speak helper function
  const speak = (text: string) => {
    const now = Date.now();
    if (now - lastSpoken < cooldown) return;
    setLastSpoken(now);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 0.6; // Deep voice
    utterance.rate = 0.85; // Medium speed
    utterance.volume = 1; // Full volume

    // Choose male or default voice
    const maleVoice =
      voices.find(
        (v) =>
          v.name.toLowerCase().includes("male") ||
          v.name.toLowerCase().includes("daniel") ||
          v.name.toLowerCase().includes("alex") ||
          v.name.toLowerCase().includes("google uk english male")
      ) || voices[0];

    utterance.voice = maleVoice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };
// Handle speech feedback based on distance value
const handleVoice = (value: number) => {
  if (value >= 0 && value <= 60) speak("Obstacle in your path");
  else if (value >= 61 && value <= 100) speak("Approaching obstacle");
  else if (value >= 101 && value <= 105) speak("You can move freely");
};

  // ✅ Listen to Firebase real-time distance updates
  useEffect(() => {
    if (!voiceReady) return;

    const distanceRef = ref(db, "distance");

    const listener = onValue(distanceRef, (snapshot) => {
      const value = snapshot.val();
      setDistance(value);
      if (value !== null) handleVoice(value);
    });

    // Clean up on component unmount
    return () => off(distanceRef, "value", listener);
  }, [voiceReady, voices]);

  // ✅ UI
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900 text-white text-center px-4">
      <h1 className="text-4xl font-bold text-amber-500 mb-6">
        👓 Blind Assist System
      </h1>

      <div className="bg-gray-700 p-8 rounded-2xl shadow-2xl border-2 border-amber-600 w-full max-w-md">
        {!voiceReady ? (
          <button
            onClick={initVoices}
            className="px-6 py-3 mb-4 bg-amber-500 hover:bg-amber-400 rounded-lg text-lg font-semibold"
          >
            🔊 Start Voice Guidance
          </button>
        ) : (
          <p className="text-green-400 mb-4 font-semibold">
            ✅ Voice system active
          </p>
        )}

        <p className="text-2xl font-semibold mb-4">
          Distance:
          <span className="text-amber-400 ml-2">
            {distance !== null ? `${distance.toFixed(2)} cm` : "Loading..."}
          </span>
        </p>

        <p className="text-lg text-gray-300 italic mb-6">
          {distance !== null
            ? distance >= 0 && distance <= 60
              ? "⚠️ Obstacle in your path"
              : distance >= 61 && distance <= 100
              ? "🚧 Approaching obstacle"
              : distance >= 101 && distance <= 105
              ? "✅ You can move freely"
              : ""
           : "Connecting to sensor..."}

        </p>
      </div>

      <p className="mt-8 text-sm text-gray-400">
        Click “Start Voice Guidance” first to enable sound 🔊
      </p>
    </div>
  );
}
