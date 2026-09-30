'use client'

import React, { useState } from 'react'

interface FontSettings {
  family: 'sans' | 'lora' | 'merriweather' | 'playfair' | 'mono' | 'jakarta'
  size: number
  lineHeight: number
  marginWidth: number
}

interface FontSwitcherProps {
  settings: FontSettings
  onSettingsChange: (settings: FontSettings) => void
}

const FONT_OPTIONS = [
  { id: 'sans', name: 'Inter', category: 'Sans-Serif' },
  { id: 'jakarta', name: 'Jakarta', category: 'Sans-Serif' },
  { id: 'lora', name: 'Lora', category: 'Serif' },
  { id: 'merriweather', name: 'Merriweather', category: 'Serif' },
  { id: 'playfair', name: 'Playfair', category: 'Serif' },
  { id: 'mono', name: 'JetBrains Mono', category: 'Monospace' },
]

export default function FontSwitcher({
  settings,
  onSettingsChange,
}: FontSwitcherProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFontChange = (familyId: string) => {
    onSettingsChange({
      ...settings,
      family: familyId as FontSettings['family'],
    })
  }

  const handleSizeChange = (size: number) => {
    onSettingsChange({ ...settings, size })
  }

  const handleLineHeightChange = (lineHeight: number) => {
    onSettingsChange({ ...settings, lineHeight })
  }

  const handleMarginChange = (margin: number) => {
    onSettingsChange({ ...settings, marginWidth: margin })
  }

  return (
    <div className="mb-8 px-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ink-800 border border-ink-700 hover:border-accent-indigo transition-colors"
      >
        <span className="text-sm font-medium">✏️ Reading Settings</span>
        <span className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isExpanded && (
        <div className="mt-4 p-6 rounded-lg bg-ink-800/50 border border-ink-700 backdrop-blur-sm space-y-6">
          {/* Font Family Selection */}
          <div>
            <label className="block text-sm font-semibold text-ink-200 mb-3">
              Font Family
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {FONT_OPTIONS.map(font => (
                <button
                  key={font.id}
                  onClick={() => handleFontChange(font.id)}
                  className={`px-3 py-2 rounded text-sm transition-all ${
                    settings.family === font.id
                      ? 'bg-accent-indigo text-ink-900 font-semibold'
                      : 'bg-ink-700 text-ink-300 hover:bg-ink-600'
                  }`}
                  title={font.category}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </div>

          {/* Text Size Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-ink-200">Text Size</label>
              <span className="text-xs bg-accent-indigo/20 px-2 py-1 rounded text-accent-indigo font-medium">
                {settings.size}px
              </span>
            </div>
            <input
              type="range"
              min="14"
              max="24"
              value={settings.size}
              onChange={e => handleSizeChange(Number(e.target.value))}
              className="w-full h-2 bg-ink-700 rounded-lg appearance-none cursor-pointer accent-accent-indigo"
            />
            <div className="flex justify-between text-xs text-ink-500 mt-1">
              <span>Small</span>
              <span>Large</span>
            </div>
          </div>

          {/* Line Height Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-ink-200">Line Height</label>
              <span className="text-xs bg-accent-indigo/20 px-2 py-1 rounded text-accent-indigo font-medium">
                {settings.lineHeight.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="1.4"
              max="2.0"
              step="0.1"
              value={settings.lineHeight}
              onChange={e => handleLineHeightChange(Number(e.target.value))}
              className="w-full h-2 bg-ink-700 rounded-lg appearance-none cursor-pointer accent-accent-indigo"
            />
            <div className="flex justify-between text-xs text-ink-500 mt-1">
              <span>Compact</span>
              <span>Spacious</span>
            </div>
          </div>

          {/* Margin Width Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-ink-200">Margin Width</label>
              <span className="text-xs bg-accent-indigo/20 px-2 py-1 rounded text-accent-indigo font-medium">
                {settings.marginWidth}px
              </span>
            </div>
            <input
              type="range"
              min="16"
              max="64"
              step="4"
              value={settings.marginWidth}
              onChange={e => handleMarginChange(Number(e.target.value))}
              className="w-full h-2 bg-ink-700 rounded-lg appearance-none cursor-pointer accent-accent-indigo"
            />
            <div className="flex justify-between text-xs text-ink-500 mt-1">
              <span>Narrow</span>
              <span>Wide</span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div>
            <label className="block text-sm font-semibold text-ink-200 mb-2">
              Quick Presets
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  onSettingsChange({
                    family: 'sans',
                    size: 16,
                    lineHeight: 1.5,
                    marginWidth: 24,
                  })
                }}
                className="px-3 py-2 rounded text-sm bg-ink-700 text-ink-300 hover:bg-ink-600 transition-colors"
              >
                Compact
              </button>
              <button
                onClick={() => {
                  onSettingsChange({
                    family: 'lora',
                    size: 18,
                    lineHeight: 1.8,
                    marginWidth: 32,
                  })
                }}
                className="px-3 py-2 rounded text-sm bg-ink-700 text-ink-300 hover:bg-ink-600 transition-colors"
              >
                Book
              </button>
              <button
                onClick={() => {
                  onSettingsChange({
                    family: 'merriweather',
                    size: 20,
                    lineHeight: 2.0,
                    marginWidth: 48,
                  })
                }}
                className="px-3 py-2 rounded text-sm bg-ink-700 text-ink-300 hover:bg-ink-600 transition-colors"
              >
                Relaxed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
