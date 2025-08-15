import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { MAX_INPUT_LENGTH } from '@/constants/design-system'
import { Send, AlertTriangle } from 'lucide-react'

interface TextInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
  className?: string
}

// Apple風デザインシステム - メインテキスト入力コンポーネント（2000文字制限）
export function TextInput({ 
  value, 
  onChange, 
  onSubmit, 
  disabled = false, 
  className 
}: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  
  const characterCount = value.length
  const isNearLimit = characterCount > MAX_INPUT_LENGTH * 0.9
  const isOverLimit = characterCount > MAX_INPUT_LENGTH
  const canSubmit = value.trim().length > 0 && !isOverLimit && !disabled

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    
    // 常に更新するが、UIで制限表示
    onChange(newValue)
  }, [onChange])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && canSubmit) {
      e.preventDefault()
      onSubmit()
    }
  }, [canSubmit, onSubmit])

  const handleSubmit = useCallback(() => {
    if (canSubmit) {
      onSubmit()
    }
  }, [canSubmit, onSubmit])

  return (
    <div className={cn(
      'relative w-full max-w-4xl mx-auto p-6 bg-white/40 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg transition-all duration-200',
      isFocused && 'shadow-xl scale-[1.01] border-white/50',
      className
    )}>
      <div className="space-y-4">
        {/* ヘッダー */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            分析したい文章を入力
          </h2>
          <div 
            id="character-count"
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              isOverLimit 
                ? 'bg-red-100 text-red-600 border border-red-200' 
                : isNearLimit 
                  ? 'bg-amber-100 text-amber-600 border border-amber-200'
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
            )}
            aria-live="polite"
          >
            {isOverLimit && <AlertTriangle className="w-4 h-4" aria-hidden="true" />}
            <span>
              {characterCount.toLocaleString()} / {MAX_INPUT_LENGTH.toLocaleString()}
            </span>
          </div>
        </div>

        {/* テキストエリア */}
        <div className="relative">
          <textarea
            id="analysis-input"
            value={value}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            placeholder="ここに分析したい文章を入力してください。あなたの文体、語彙選択、句読点の使い方などから個人らしさを抽出します。&#10;&#10;例：&#10;・ブログ記事の一部&#10;・メールや手紙の文章&#10;・SNSの投稿文&#10;・エッセイや日記"
            aria-label="分析したい文章を入力"
            aria-describedby={isOverLimit ? "character-warning" : "character-count"}
            className={cn(
              'w-full min-h-[300px] p-4 rounded-xl border-2 transition-all duration-200 resize-none',
              'placeholder:text-gray-400 text-gray-900 bg-white/60 backdrop-blur-sm',
              'focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400',
              disabled 
                ? 'opacity-50 cursor-not-allowed bg-gray-50' 
                : 'hover:border-gray-300',
              isFocused 
                ? 'border-blue-400 shadow-md' 
                : 'border-gray-200'
            )}
          />
        </div>

        {/* 制限超過時の警告 */}
        {isOverLimit && (
          <div 
            id="character-warning"
            role="alert" 
            className="p-3 bg-red-50 border border-red-200 rounded-xl"
          >
            <p className="text-red-700 text-sm font-medium">
              ⚠️ 文字数制限を超えています（{characterCount - MAX_INPUT_LENGTH}文字超過）
            </p>
            <p className="text-red-600 text-xs mt-1">
              文字数を減らしてから分析を開始してください。
            </p>
          </div>
        )}

        {/* フッター */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">⌘</kbd> + 
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs ml-1">Enter</kbd> 
            <span className="ml-2">で分析開始</span>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={cn(
              'group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200',
              'shadow-lg hover:shadow-xl transform hover:scale-105',
              canSubmit
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border border-blue-400/20'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            )}
          >
            <Send className={cn(
              'w-5 h-5 transition-transform duration-300',
              canSubmit && 'group-hover:rotate-12'
            )} />
            <span>文体分析開始</span>
          </button>
        </div>
      </div>
    </div>
  )
}