'use client'

import React, { useState } from 'react'

interface InlineComment {
  id: string
  paragraphIndex: number
  userId: string
  userName: string
  content: string
  createdAt: string
}

interface InlineCommentDrawerProps {
  paragraphIndex: number
  paragraphText: string
  comments: InlineComment[]
  onCommentAdd: (content: string) => void
  onClose: () => void
}

export default function InlineCommentDrawer({
  paragraphIndex,
  paragraphText,
  comments,
  onCommentAdd,
  onClose,
}: InlineCommentDrawerProps) {
  const [commentInput, setCommentInput] = useState('')
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const EMOJI_REACTIONS = ['❤️', '😍', '😲', '😢', '🔥', '💯', '😂', '🤔']

  const handleSubmitComment = async () => {
    if (!commentInput.trim()) return

    setIsSubmitting(true)
    try {
      const content = selectedEmoji ? `${selectedEmoji} ${commentInput}` : commentInput
      await new Promise(resolve => setTimeout(resolve, 300)) // Simulate API call
      onCommentAdd(content)
      setCommentInput('')
      setSelectedEmoji(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmitComment()
    }
  }

  return (
    <div className="w-80 max-h-screen overflow-y-auto bg-ink-800 border-l border-ink-700 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 p-4 border-b border-ink-700 bg-ink-800/95 backdrop-blur-sm flex items-center justify-between">
        <h3 className="font-semibold text-ink-100">Comments</h3>
        <button
          onClick={onClose}
          className="text-ink-400 hover:text-ink-200 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Paragraph Preview */}
      <div className="p-4 bg-ink-900/50 border-b border-ink-700">
        <p className="text-xs text-ink-400 mb-2">On this paragraph:</p>
        <p className="text-sm text-ink-300 line-clamp-3 italic">{paragraphText}</p>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {comments.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-ink-500">No comments yet.</p>
            <p className="text-xs text-ink-600 mt-1">Be the first to comment!</p>
          </div>
        ) : (
          comments.map(comment => (
            <div
              key={comment.id}
              className="p-3 rounded-lg bg-ink-700/50 hover:bg-ink-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-accent-indigo">
                  {comment.userName}
                </p>
                <span className="text-xs text-ink-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-ink-300">{comment.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Comment Input */}
      <div className="sticky bottom-0 p-4 border-t border-ink-700 bg-ink-800/95 backdrop-blur-sm space-y-3">
        {/* Emoji Reactions */}
        <div className="flex gap-1 flex-wrap">
          {EMOJI_REACTIONS.map(emoji => (
            <button
              key={emoji}
              onClick={() =>
                setSelectedEmoji(selectedEmoji === emoji ? null : emoji)
              }
              className={`text-lg p-1.5 rounded transition-colors ${
                selectedEmoji === emoji
                  ? 'bg-accent-indigo/30 scale-110'
                  : 'bg-ink-700 hover:bg-ink-600'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Text Input */}
        <div className="space-y-2">
          <textarea
            value={commentInput}
            onChange={e => setCommentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share your thoughts... (Ctrl+Enter to send)"
            className="w-full px-3 py-2 rounded-lg bg-ink-700 border border-ink-600 text-ink-100 placeholder-ink-500 text-sm resize-none focus:outline-none focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo"
            rows={3}
          />
          <button
            onClick={handleSubmitComment}
            disabled={!commentInput.trim() || isSubmitting}
            className={`w-full py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
              commentInput.trim() && !isSubmitting
                ? 'bg-accent-indigo hover:bg-accent-indigo/90 text-ink-900'
                : 'bg-ink-700 text-ink-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </div>
    </div>
  )
}
