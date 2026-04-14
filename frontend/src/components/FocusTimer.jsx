import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { FiPlay, FiPause, FiRotateCcw, FiClock } from "react-icons/fi";

// ──────────────────────────────────────────────────────
// Focus Timer — Pomodoro-style countdown widget.
// Compact enough to fit in the sidebar footer.
// Fires confetti on session completion using the
// existing canvas-confetti dependency.
// ──────────────────────────────────────────────────────

const PRESETS = [
  { label: "25m", seconds: 25 * 60 },
  { label: "45m", seconds: 45 * 60 },
  { label: "60m", seconds: 60 * 60 },
];

function FocusTimer() {
  const [totalSeconds, setTotalSeconds] = useState(PRESETS[0].seconds);
  const [remaining, setRemaining] = useState(PRESETS[0].seconds);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(0);
  const intervalRef = useRef(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Timer logic
  useEffect(() => {
    if (isRunning && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            // Fire confetti on completion
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.6 },
              colors: ["#6366f1", "#10b981", "#f59e0b", "#ec4899"],
              zIndex: 9999,
              disableForReducedMotion: true,
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, remaining]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setRemaining(totalSeconds);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const selectPreset = (index) => {
    setSelectedPreset(index);
    setTotalSeconds(PRESETS[index].seconds);
    setRemaining(PRESETS[index].seconds);
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Format time as MM:SS
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const timeDisplay = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Progress for circular indicator (0 to 1)
  const progress = totalSeconds > 0 ? 1 - remaining / totalSeconds : 0;
  const circumference = 2 * Math.PI * 36; // radius = 36
  const strokeDashoffset = circumference * (1 - progress);

  const isComplete = remaining === 0 && !isRunning;

  return (
    <div className="p-4">
      <div className="bg-slate-50 dark:bg-[#151b2e] rounded-2xl border border-slate-200 dark:border-white/5 p-4 shadow-inner">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <FiClock size={12} /> Focus Timer
          </span>
          {isRunning && (
            <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              ACTIVE
            </span>
          )}
        </div>

        {/* Circular Progress + Time */}
        <div className="flex flex-col items-center mb-4">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
              {/* Background circle */}
              <circle
                cx="40" cy="40" r="36"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-slate-200 dark:text-white/5"
              />
              {/* Progress circle */}
              <circle
                cx="40" cy="40" r="36"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={`transition-all duration-1000 ease-linear ${
                  isComplete ? "text-emerald-500" : "text-blue-500"
                }`}
              />
            </svg>
            {/* Time display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-lg font-black font-mono tracking-tight ${
                isComplete ? "text-emerald-500" : "text-slate-800 dark:text-white"
              }`}>
                {isComplete ? "Done!" : timeDisplay}
              </span>
            </div>
          </div>
        </div>

        {/* Preset selector */}
        <div className="flex gap-1.5 mb-4">
          {PRESETS.map((preset, i) => (
            <button
              key={i}
              onClick={() => selectPreset(i)}
              disabled={isRunning}
              className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                selectedPreset === i
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/30"
              } ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <button
            onClick={toggleTimer}
            disabled={isComplete}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 ${
              isRunning
                ? "bg-amber-500 hover:bg-amber-600 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
            } ${isComplete ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isRunning ? <><FiPause size={14} /> Pause</> : <><FiPlay size={14} /> Start</>}
          </button>
          <button
            onClick={resetTimer}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20 transition-colors"
            title="Reset"
          >
            <FiRotateCcw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FocusTimer;
