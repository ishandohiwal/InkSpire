'use client'

import React, { useState } from 'react'

interface TokenPaywallProps {
  tokensBalance: number
  onDismiss: () => void
}

const TOKEN_PACKS = [
  { tokens: 300, price: 1.99, savings: 0 },
  { tokens: 750, price: 4.99, savings: 10 },
  { tokens: 1500, price: 8.99, savings: 25 },
  { tokens: 3000, price: 14.99, savings: 35 },
]

export default function TokenPaywall({ tokensBalance, onDismiss }: TokenPaywallProps) {
  const [selectedPack, setSelectedPack] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showProOption, setShowProOption] = useState(false)

  const handlePurchase = async () => {
    if (selectedPack === null) return

    setIsProcessing(true)
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      // In real app, this would call a payment API
      onDismiss()
    } finally {
      setIsProcessing(false)
    }
  }

  const timeUntilReset = calculateTimeUntilMidnight()

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-ink-800 border border-ink-700 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent-indigo/20 to-accent-violet/20 border-b border-ink-700 px-6 py-8 text-center">
          <h2 className="text-2xl font-bold text-ink-100 mb-2">Out of Reading Tokens</h2>
          <p className="text-ink-400">
            You've used all your free tokens for today. Choose an option below to continue reading.
          </p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Token Reset Info */}
          <div className="bg-ink-900/50 border border-ink-700 rounded-lg p-4">
            <p className="text-sm text-ink-400">
              💡 <span className="font-medium text-ink-300">Free tokens reset in {timeUntilReset}</span>
            </p>
          </div>

          {/* Option Tabs */}
          <div className="flex gap-4 mb-8 border-b border-ink-700">
            <button
              onClick={() => setShowProOption(false)}
              className={`pb-4 px-2 font-medium transition-colors ${
                !showProOption
                  ? 'text-accent-indigo border-b-2 border-accent-indigo'
                  : 'text-ink-400 hover:text-ink-300'
              }`}
            >
              Buy Tokens
            </button>
            <button
              onClick={() => setShowProOption(true)}
              className={`pb-4 px-2 font-medium transition-colors ${
                showProOption
                  ? 'text-accent-indigo border-b-2 border-accent-indigo'
                  : 'text-ink-400 hover:text-ink-300'
              }`}
            >
              Upgrade to Pro
            </button>
          </div>

          {!showProOption ? (
            /* Token Packs */
            <div>
              <h3 className="text-lg font-semibold text-ink-100 mb-4">Token Refill Packs</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {TOKEN_PACKS.map((pack, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPack(index)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedPack === index
                        ? 'border-accent-indigo bg-accent-indigo/10'
                        : 'border-ink-700 bg-ink-900 hover:border-ink-600'
                    }`}
                  >
                    {pack.savings > 0 && (
                      <div className="text-xs font-bold text-green-400 mb-2">
                        Save {pack.savings}%
                      </div>
                    )}
                    <div className="text-2xl font-bold text-accent-indigo mb-1">
                      {pack.tokens}
                    </div>
                    <div className="text-xs text-ink-400 mb-3">tokens</div>
                    <div className="text-lg font-semibold text-ink-100">
                      ${pack.price}
                    </div>
                    {pack.tokens > 0 && (
                      <div className="text-xs text-ink-500 mt-2">
                        {(pack.tokens / 60).toFixed(0)}min reading
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Pro Subscription */
            <div>
              <h3 className="text-lg font-semibold text-ink-100 mb-4">InkPass Pro</h3>
              <div className="bg-gradient-to-br from-accent-indigo/20 to-accent-violet/20 border border-accent-indigo/50 rounded-lg p-6">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-ink-100">$5.99</span>
                  <span className="text-ink-400">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3 text-ink-300">
                    <span className="text-accent-indigo">✓</span>
                    Unlimited reading tokens
                  </li>
                  <li className="flex items-center gap-3 text-ink-300">
                    <span className="text-accent-indigo">✓</span>
                    Ad-free reading experience
                  </li>
                  <li className="flex items-center gap-3 text-ink-300">
                    <span className="text-accent-indigo">✓</span>
                    Exclusive "Pro Reader" badge
                  </li>
                  <li className="flex items-center gap-3 text-ink-300">
                    <span className="text-accent-indigo">✓</span>
                    Early access to new features
                  </li>
                  <li className="flex items-center gap-3 text-ink-300">
                    <span className="text-accent-indigo">✓</span>
                    Support independent authors
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={onDismiss}
              className="flex-1 px-6 py-3 rounded-lg border border-ink-700 text-ink-300 hover:bg-ink-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handlePurchase}
              disabled={!showProOption && selectedPack === null) || isProcessing}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                (!showProOption && selectedPack === null) || isProcessing
                  ? 'bg-ink-700 text-ink-500 cursor-not-allowed'
                  : 'bg-accent-indigo hover:bg-accent-indigo/90 text-ink-900'
              }`}
            >
              {isProcessing ? 'Processing...' : showProOption ? 'Subscribe Now' : 'Purchase Tokens'}
            </button>
          </div>

          {/* Help Text */}
          <p className="text-xs text-ink-500 text-center">
            Secure payment processing via Stripe • Cancel anytime (pro only)
          </p>
        </div>
      </div>
    </div>
  )
}

function calculateTimeUntilMidnight(): string {
  const now = new Date()
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  tomorrow.setHours(0, 0, 0, 0)
  
  const diff = tomorrow.getTime() - now.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}
