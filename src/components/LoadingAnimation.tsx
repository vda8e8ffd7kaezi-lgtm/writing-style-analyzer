import { cn } from '@/lib/utils'
import { Brain, Sparkles } from 'lucide-react'

interface LoadingAnimationProps {
  className?: string
  message?: string
}

// Apple風デザインシステム - 分析中ローディングアニメーション
export function LoadingAnimation({ className, message = 'AI文体分析中...' }: LoadingAnimationProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 space-y-6',
      className
    )}>
      {/* メインローディングアニメーション */}
      <div className="relative">
        {/* 外側の回転リング */}
        <div className="w-24 h-24 rounded-full border-4 border-gray-200 animate-spin border-t-blue-500" />
        
        {/* 内側のアイコン */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
            <Brain className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>
        
        {/* 装飾的なスパークル */}
        <div className="absolute -top-2 -right-2">
          <Sparkles className="w-6 h-6 text-amber-400 animate-bounce" />
        </div>
        <div className="absolute -bottom-2 -left-2">
          <Sparkles className="w-4 h-4 text-purple-400 animate-bounce delay-500" />
        </div>
      </div>

      {/* ローディングメッセージ */}
      <div className="text-center space-y-2">
        <p className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          {message}
        </p>
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150" />
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-300" />
        </div>
      </div>

      {/* プログレス風演出 */}
      <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse" />
      </div>
    </div>
  )
}