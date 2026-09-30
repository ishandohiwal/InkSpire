'use client'

import React from 'react'

interface TTSAudioBarProps {
  isPlaying: boolean
  isPaused: boolean
  speed: number
  onPlay: () => void
  onPause: () => void
  onStop: () => void
  onSpeedChange: (speed: number) => void
}

const SPEED_OPTIONS = [0.75, 1.0, 1.25, 1.5, 2.0]

export default function TTSAudioBar({
  isPlaying,
  isPaused,
  speed,
  onPlay,
  onPause,
  onStop,
  onSpeedChange,
}: TTSAudioBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-ink-700 bg-ink-900/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
        {/* Left: Play Controls */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-ink-400 uppercase tracking-wider">
            🔊 Text-to-Speech
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onPlay}
              disabled={isPlaying && !isPaused}
              className={`p-2 rounded-lg transition-colors ${
                isPlaying && !isPaused
                  ? 'bg-accent-indigo text-ink-900'
                  : 'bg-ink-800 text-ink-300 hover:bg-ink-700'
              }`}
              title="Play"
            >
              ▶️
            </button>
            <button
              onClick={onPause}
              disabled={!isPlaying}
              className={`p-2 rounded-lg transition-colors ${
                isPlaying && isPaused
                  ? 'bg-accent-violet text-ink-900'
                  : 'bg-ink-800 text-ink-300 hover:bg-ink-700'
              }`}
              title="Pause/Resume"
            >
              ⏸
            </button>
            <button
              onClick={onStop}
              disabled={!isPlaying}
              className="p-2 rounded-lg bg-ink-800 text-ink-300 hover:bg-ink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Stop"
            >
              ⏹️
            </button>
          </div>
        </div>

        {/* Center: Skip Controls */}
        <div className="flex items-center gap-3">
          <button
            className="px-3 py-1.5 rounded-lg bg-ink-800 text-ink-300 hover:bg-ink-700 transition-colors text-sm"
            title="Skip back 10 seconds"
          >
            ⏪ 10s
          </button>
          <div className="text-xs text-ink-500">
            {isPlaying ? (isPaused ? '⏸ Paused' : '▶️ Playing') : '⏹️ Stopped'}
          </div>
          <button
            className="px-3 py-1.5 rounded-lg bg-ink-800 text-ink-300 hover:bg-ink-700 transition-colors text-sm"
            title="Skip forward 10 seconds"
          >
            10s ⏩
          </button>
        </div>

        {/* Right: Speed Control */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-ink-400 font-medium">Speed:</span>
          <div className="flex gap-1 bg-ink-800 rounded-lg p-1">
            {SPEED_OPTIONS.map(option => (
              <button
                key={option}
                onClick={() => onSpeedChange(option)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  speed === option
                    ? 'bg-accent-indigo text-ink-900'
                    : 'text-ink-300 hover:text-ink-100'
                }`}
              >
                {option}x
              </button>
            ))}
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          {isPlaying && (
            <div className="flex gap-0.5">
              <div className="w-1 h-3 bg-accent-indigo rounded-full animate-pulse"></div>
              <div
                className="w-1 h-3 bg-accent-indigo rounded-full animate-pulse"
                style={{ animationDelay: '0.1s' }}
              ></div>
              <div
                className="w-1 h-3 bg-accent-indigo rounded-full animate-pulse"
                style={{ animationDelay: '0.2s' }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
