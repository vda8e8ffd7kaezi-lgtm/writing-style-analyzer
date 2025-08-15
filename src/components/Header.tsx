import { FileText, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeaderProps {
  className?: string
}

// Apple風デザインシステム - Glassmorphismヘッダー
export function Header({ className }: HeaderProps) {
  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm z-50',
      className
    )}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* ブランドセクション */}
        <button 
          onClick={() => window.location.reload()} 
          className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200"
        >
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Writing Style Analyzer
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              AI時代の個人らしさを守る文体分析ツール
            </p>
          </div>
        </button>

        {/* インフォメーション */}
        <div className="hidden md:flex items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/40 rounded-lg backdrop-blur-sm border border-white/30">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="font-medium">Gemini AI無料枠で利用</span>
          </div>
          <div className="px-3 py-1.5 bg-white/40 rounded-lg backdrop-blur-sm border border-white/30">
            <span className="font-medium">最大2000文字</span>
          </div>
        </div>
      </div>
    </header>
  )
}