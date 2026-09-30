'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useTokenDrain } from '@/hooks/useTokenDrain'
import { useTextToSpeech } from '@/hooks/useTextToSpeech'
import FontSwitcher from './FontSwitcher'
import InlineCommentDrawer from './InlineCommentDrawer'
import TTSAudioBar from './TTSAudioBar'
import TokenPaywall from './TokenPaywall'

interface InteractiveReaderProps {
  chapterId: string
  chapterContent: string
  chapterTitle: string
  storyTitle: string
  tokensBalance: number
  subscriptionTier: 'FREE' | 'PRO'
  onTokensUpdate: (newBalance: number) => void
  onInlineCommentAdd: (paragraphIndex: number, content: string) => void
  inlineComments: Array<{
    id: string
    paragraphIndex: number
    userId: string
    userName: string
    content: string
    createdAt: string
  }>
}

type FontFamily = 'sans' | 'lora' | 'merriweather' | 'playfair' | 'mono' | 'jakarta'

interface FontSettings {
  family: FontFamily
  size: number // 14-24px
  lineHeight: number // 1.4-2.0
  marginWidth: number // 16-64px
}

export default function InteractiveReader({
  chapterId,
  chapterContent,
  chapterTitle,
  storyTitle,
  tokensBalance,
  subscriptionTier,
  onTokensUpdate,
  onInlineCommentAdd,
  inlineComments,
}: InteractiveReaderProps) {
  const [fontSettings, setFontSettings] = useState<FontSettings>({
    family: 'lora',
    size: 18,
    lineHeight: 1.8,
    marginWidth: 32,
  })

  const [showTokenPaywall, setShowTokenPaywall] = useState(false)
  const [selectedParagraphIndex, setSelectedParagraphIndex] = useState<number | null>(null)
  const [showCommentDrawer, setShowCommentDrawer] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Token drain logic
  const { isActive } = useTokenDrain({
    enabled: subscriptionTier === 'FREE' && tokensBalance > 0,
    tokensBalance,
    onTokensChange: onTokensUpdate,
    onOut: () => setShowTokenPaywall(true),
  })

  // TTS integration
  const { isPlaying, isPaused, speed, speak, pause, stop, setSpeed } = useTextToSpeech({
    text: chapterContent,
  })

  // Parse chapter content into paragraphs
  const paragraphs = chapterContent.split('\n\n').filter(p => p.trim())

  // Handle paragraph selection for comments
  const handleParagraphClick = (index: number) => {
    setSelectedParagraphIndex(index)
    setShowCommentDrawer(true)
  }

  // Get comments for a specific paragraph
  const getParagraphComments = (paragraphIndex: number) => {
    return inlineComments.filter(c => c.paragraphIndex === paragraphIndex)
  }

  const fontFamilyMap: Record<FontFamily, string> = {
    sans: 'font-sans',
    jakarta: 'font-jakarta',
    lora: 'font-lora',
    merriweather: 'font-merriweather',
    playfair: 'font-playfair',
    mono: 'font-mono',
  }

  return (
    <div className="min-h-screen bg-ink-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-ink-700 bg-ink-900/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-lg font-semibold text-ink-100">{storyTitle}</h1>
            <p className="text-sm text-ink-400">{chapterTitle}</p>
          </div>
          <div className="flex items-center gap-4">
            {subscriptionTier === 'FREE' && (
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  tokensBalance < 50
                    ? 'bg-red-900/20 border border-red-700'
                    : 'bg-accent-indigo/10 border border-accent-indigo/30'
                }`}
              >
                <span className="text-xs font-medium text-ink-200">
                  {tokensBalance} tokens
                </span>
                <div className="w-24 h-1.5 bg-ink-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      tokensBalance < 50 ? 'bg-red-500' : 'bg-accent-indigo'
                    }`}
                    style={{ width: `${(tokensBalance / 150) * 100}%` }}
                  />
                </div>
              </div>
            )}
            <div className={`text-xs px-2 py-1 rounded ${isActive ? 'bg-green-900/30 text-green-300' : 'bg-yellow-900/30 text-yellow-300'}`}>
              {isActive ? '● Reading' : '● Paused'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex gap-8 max-w-7xl mx-auto">
        {/* Reader Content */}
        <div className="flex-1 py-12">
          {/* Font Switcher Panel */}
          <FontSwitcher
            settings={fontSettings}
            onSettingsChange={setFontSettings}
          />

          {/* Chapter Content */}
          <article
            ref={contentRef}
            className={`${fontFamilyMap[fontSettings.family]} transition-all duration-300`}
            style={{
              fontSize: `${fontSettings.size}px`,
              lineHeight: fontSettings.lineHeight,
              paddingLeft: `${fontSettings.marginWidth}px`,
              paddingRight: `${fontSettings.marginWidth}px`,
            }}
          >
            {paragraphs.map((paragraph, index) => {
              const paragraphComments = getParagraphComments(index)
              return (
                <div key={index} className="mb-6">
                  <p
                    onClick={() => handleParagraphClick(index)}
                    className={`group cursor-pointer transition-colors p-3 rounded ${
                      selectedParagraphIndex === index
                        ? 'bg-accent-indigo/20 border-l-2 border-accent-indigo'
                        : 'hover:bg-ink-800/50 border-l-2 border-transparent'
                    }`}
                  >
                    {paragraph}
                    {paragraphComments.length > 0 && (
                      <span className="ml-2 inline-block text-accent-violet text-sm font-medium">
                        💬 {paragraphComments.length}
                      </span>
                    )}
                  </p>

                  {/* Inline Comments Preview */}
                  {paragraphComments.length > 0 && (
                    <div className="mt-2 pl-4 border-l-2 border-accent-violet/30 space-y-2">
                      {paragraphComments.slice(0, 2).map(comment => (
                        <div
                          key={comment.id}
                          className="text-sm bg-ink-800/50 p-2 rounded text-ink-300"
                        >
                          <p className="font-medium text-accent-violet text-xs">
                            {comment.userName}
                          </p>
                          <p className="line-clamp-2">{comment.content}</p>
                        </div>
                      ))}
                      {paragraphComments.length > 2 && (
                        <button
                          onClick={() => handleParagraphClick(index)}
                          className="text-xs text-accent-indigo hover:text-accent-indigo/80"
                        >
                          +{paragraphComments.length - 2} more
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </article>

          {/* Vote Section */}
          <div className="mt-12 px-8 py-8 border-t border-ink-700 flex items-center gap-4">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-accent-indigo hover:bg-accent-indigo/90 transition-colors text-ink-900 font-semibold">
              ⭐ Vote This Chapter
            </button>
          </div>
        </div>

        {/* Right Sidebar - Comment Drawer Toggle */}
        {showCommentDrawer && selectedParagraphIndex !== null && (
          <InlineCommentDrawer
            paragraphIndex={selectedParagraphIndex}
            paragraphText={paragraphs[selectedParagraphIndex]}
            comments={getParagraphComments(selectedParagraphIndex)}
            onCommentAdd={(content) => {
              onInlineCommentAdd(selectedParagraphIndex, content)
            }}
            onClose={() => setShowCommentDrawer(false)}
          />
        )}
      </main>

      {/* TTS Audio Bar */}
      <TTSAudioBar
        isPlaying={isPlaying}
        isPaused={isPaused}
        speed={speed}
        onPlay={speak}
        onPause={pause}
        onStop={stop}
        onSpeedChange={setSpeed}
      />

      {/* Token Paywall Modal */}
      {showTokenPaywall && subscriptionTier === 'FREE' && (
        <TokenPaywall
          tokensBalance={tokensBalance}
          onDismiss={() => setShowTokenPaywall(false)}
        />
      )}
    </div>
  )
}
