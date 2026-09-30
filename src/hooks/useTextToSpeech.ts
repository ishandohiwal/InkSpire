'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

interface UseTextToSpeechOptions {
  text: string
  onHighlightParagraph?: (index: number) => void
}

export function useTextToSpeech({ text, onHighlightParagraph }: UseTextToSpeechOptions) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const speak = useCallback(() => {
    // Cancel any existing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = speed
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => {
      setIsPlaying(true)
      setIsPaused(false)
    }

    utterance.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
    }

    utterance.onerror = () => {
      setIsPlaying(false)
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [text, speed])

  const pause = useCallback(() => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
      setIsPaused(false)
    } else {
      window.speechSynthesis.pause()
      setIsPaused(true)
    }
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
  }, [])

  const skip = useCallback((seconds: number) => {
    // Note: Web Speech API doesn't support seeking directly
    // This is a placeholder for future implementation or fallback TTS provider
    window.speechSynthesis.cancel()
    setIsPlaying(false)
  }, [])

  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeed(newSpeed)
    if (isPlaying) {
      speak() // Restart with new speed
    }
  }, [isPlaying, speak])

  return {
    isPlaying,
    isPaused,
    speed,
    speak,
    pause,
    stop,
    skip,
    setSpeed: handleSpeedChange,
  }
}
