import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Copy, Check, AlertTriangle } from 'lucide-react'

interface CopyButtonProps {
  text: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'ghost'
}

// Apple風デザインシステム - ワンクリックコピー機能ボタン
export function CopyButton({ 
  text, 
  className, 
  size = 'md', 
  variant = 'secondary' 
}: CopyButtonProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')

  const handleCopy = useCallback(async () => {
    if (!text.trim()) return

    try {
      await navigator.clipboard.writeText(text)
      setCopyState('copied')
      
      // 2秒後に状態をリセット
      setTimeout(() => setCopyState('idle'), 2000)
    } catch (error) {
      console.error('コピーに失敗しました:', error)
      setCopyState('error')
      
      // 3秒後に状態をリセット
      setTimeout(() => setCopyState('idle'), 3000)
    }
  }, [text])

  // サイズスタイル
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  // バリアントスタイル
  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border border-blue-400/20 shadow-lg',
    secondary: 'bg-white/60 hover:bg-white/80 text-gray-700 border border-gray-200 hover:border-gray-300 shadow-md',
    ghost: 'bg-transparent hover:bg-white/20 text-gray-600 hover:text-gray-800 border border-transparent hover:border-gray-200'
  }

  // 状態に応じたスタイル
  const stateStyles = {
    idle: variantStyles[variant],
    copied: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border border-green-400/20 shadow-lg',
    error: 'bg-gradient-to-r from-red-500 to-red-600 text-white border border-red-400/20 shadow-lg'
  }

  const getIcon = () => {
    switch (copyState) {
      case 'copied':
        return <Check className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} />
      case 'error':
        return <AlertTriangle className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} />
      default:
        return <Copy className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} />
    }
  }

  const getText = () => {
    switch (copyState) {
      case 'copied':
        return 'コピー完了!'
      case 'error':
        return 'コピー失敗'
      default:
        return 'コピー'
    }
  }

  return (
    <button
      onClick={handleCopy}
      disabled={!text.trim() || copyState !== 'idle'}
      className={cn(
        'group flex items-center gap-2 font-semibold rounded-xl transition-all duration-200',
        'backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed',
        'hover:scale-105 hover:shadow-xl transform',
        sizeStyles[size],
        stateStyles[copyState],
        className
      )}
      title={copyState === 'idle' ? 'クリップボードにコピー' : ''}
    >
      <span className={cn(
        'transition-transform duration-300',
        copyState === 'idle' && 'group-hover:scale-110'
      )}>
        {getIcon()}
      </span>
      <span>{getText()}</span>
    </button>
  )
}