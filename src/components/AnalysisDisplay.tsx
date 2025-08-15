import { cn } from '@/lib/utils'
import { CopyButton } from './CopyButton'
import { Sparkles, FileText, Clock } from 'lucide-react'
import { AnalysisResult } from '@/types/design-system'
import { getThemeColorByValue } from '@/constants/theme-colors'

interface AnalysisDisplayProps {
  result: AnalysisResult
  className?: string
}

// Apple風デザインシステム - 分析結果表示コンポーネント
export function AnalysisDisplay({ result, className }: AnalysisDisplayProps) {
  const themeColor = result.theme ? getThemeColorByValue(result.theme) : null
  const analysisDate = new Date(result.timestamp).toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className={cn(
      'relative w-full max-w-4xl mx-auto p-6 rounded-2xl shadow-lg transition-all duration-200',
      'bg-white/40 backdrop-blur-sm border border-white/30 hover:shadow-xl hover:scale-[1.01]',
      themeColor?.class || 'bg-gradient-to-br from-gray-50 to-slate-100 border-gray-300/30',
      className
    )}>
      {/* ヘッダー */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              文体分析結果
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{analysisDate}</span>
              {themeColor && (
                <>
                  <span>•</span>
                  <span>{themeColor.name}テーマ</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <CopyButton 
          text={result.analysis}
          size="lg"
          variant="primary"
        />
      </div>

      {/* 元のテキストプレビュー */}
      <div className="mb-6 p-4 bg-white/50 rounded-xl border border-white/20">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          分析元テキスト（最初の200文字）
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          {result.text.length > 200 
            ? `${result.text.substring(0, 200)}...` 
            : result.text
          }
        </p>
        {result.text.length > 200 && (
          <p className="text-xs text-gray-500 mt-2">
            全文: {result.text.length.toLocaleString()}文字
          </p>
        )}
      </div>

      {/* 分析結果 */}
      <div className="prose prose-base max-w-none">
        <div className="p-6 bg-white/30 rounded-xl border border-white/20">
          <div 
            className="whitespace-pre-wrap text-gray-800 leading-relaxed"
            style={{
              fontSize: '1rem',
              lineHeight: '1.8',
              letterSpacing: '0.01em'
            }}
          >
            {result.analysis}
          </div>
        </div>
      </div>

      {/* フッター */}
      <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>分析ID: {result.id.substring(0, 8)}</span>
          <span>文字数: {result.analysis.length.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Gemini AI powered</span>
        </div>
      </div>
    </div>
  )
}