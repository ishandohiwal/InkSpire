'use client'

import { useEffect, useRef, useCallback } from 'react'

interface UseTokenDrainOptions {
  enabled: boolean
  tokensBalance: number
  onTokensChange: (newBalance: number) => void
  onOut: () => void
}

const TOKENS_PER_MINUTE = 5
const INACTIVITY_THRESHOLD_MS = 45000 // 45 seconds

/**
 * Hook that manages token draining for active reading sessions.
 * - Drains 5 tokens per minute of active screen time
 * - Pauses token burn if user is inactive for >45 seconds
 * - Detects scroll and mouse movement for activity
 */
export function useTokenDrain({
  enabled,
  tokensBalance,
  onTokensChange,
  onOut,
}: UseTokenDrainOptions) {
  const lastActivityRef = useRef<number>(Date.now())
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null)
  const tokenDrainIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isActiveRef = useRef<boolean>(true)

  // Register activity
  const registerActivity = useCallback(() => {
    lastActivityRef.current = Date.now()
    isActiveRef.current = true

    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }

    // Set inactivity timer to pause token drain
    inactivityTimerRef.current = setTimeout(() => {
      isActiveRef.current = false
    }, INACTIVITY_THRESHOLD_MS)
  }, [])

  // Setup activity listeners
  useEffect(() => {
    if (!enabled) return

    const handleScroll = () => registerActivity()
    const handleMouseMove = () => registerActivity()
    const handleKeyPress = () => registerActivity()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('keypress', handleKeyPress)

    // Initial activity registration
    registerActivity()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('keypress', handleKeyPress)
    }
  }, [enabled, registerActivity])

  // Setup token drain interval
  useEffect(() => {
    if (!enabled) {
      if (tokenDrainIntervalRef.current) {
        clearInterval(tokenDrainIntervalRef.current)
      }
      return
    }

    // Drain tokens every 12 seconds (5 tokens per minute = 1 token per 12 seconds)
    tokenDrainIntervalRef.current = setInterval(() => {
      if (isActiveRef.current && tokensBalance > 0) {
        const newBalance = Math.max(0, tokensBalance - 1)
        onTokensChange(newBalance)

        if (newBalance === 0) {
          onOut()
        }
      }
    }, 12000) // 12 seconds

    return () => {
      if (tokenDrainIntervalRef.current) {
        clearInterval(tokenDrainIntervalRef.current)
      }
    }
  }, [enabled, tokensBalance, onTokensChange, onOut])

  // Cleanup
  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
      }
      if (tokenDrainIntervalRef.current) {
        clearInterval(tokenDrainIntervalRef.current)
      }
    }
  }, [])

  return {
    isActive: isActiveRef.current,
  }
}
