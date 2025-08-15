import { cn } from '@/lib/utils'
import { CopyButton } from './CopyButton'
import { Clock, FileText, Trash2, Eye } from 'lucide-react'
import { AnalysisResult } from '@/types/design-system'
import { getThemeColorByValue } from '@/constants/theme-colors'

interface HistoryCardProps {
  result: AnalysisResult
  onView: (result: AnalysisResult) => void
  onDelete: (id: string) => void
  className?: string
}

// Apple風デザインシステム - 履歴アイテム表示カード
export function HistoryCard({ 
  result, 
  onView, 
  onDelete, 
  className 
}: HistoryCardProps) {
  const themeColor = result.theme ? getThemeColorByValue(result.theme) : null
  const analysisDate = new Date(result.timestamp)
  const relativeTime = getRelativeTime(analysisDate)
  
  const previewText = result.text.length > 120 
    ? `${result.text.substring(0, 120)}...` 
    : result.text

  return (
    <div className={cn(
      'group relative p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200',
      'bg-white/60 backdrop-blur-sm border border-white/30 hover:border-white/50',
      'hover:scale-[1.02] cursor-pointer',
      themeColor?.class,
      className
    )}>
      {/* メインコンテンツ */}
      <div onClick={() => onView(result)} className="space-y-3">
        {/* ヘッダー */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-sm">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-3 h-3" />
                <span className="truncate">{relativeTime}</span>
                {themeColor && (
                  <>
                    <span>•</span>
                    <span className="truncate">{themeColor.name}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* アクションボタン */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(result.id)
              }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="削除"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* プレビューテキスト */}
        <div className="text-sm text-gray-700 leading-relaxed">
          <p className="line-clamp-3">{previewText}</p>
        </div>

        {/* 統計情報 */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span>{result.text.length.toLocaleString()}文字</span>
            <span>分析結果: {result.analysis.length.toLocaleString()}文字</span>
          </div>
          <div className="flex items-center gap-2 text-blue-600 font-medium">
            <Eye className="w-3 h-3" />
            <span>詳細を見る</span>
          </div>
        </div>
      </div>

      {/* 下部コピーボタン */}
      <div className="mt-3 pt-3 border-t border-white/20">
        <div 
          className="flex justify-end" 
          onClick={(e) => e.stopPropagation()}
        >
          <CopyButton 
            text={result.analysis}
            size="sm"
            variant="ghost"
          />
        </div>
      </div>
    </div>
  )
}

// 相対時間を取得するヘルパー関数
function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInMinutes < 1) {
    return 'たった今'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}分前`
  } else if (diffInHours < 24) {
    return `${diffInHours}時間前`
  } else if (diffInDays < 7) {
    return `${diffInDays}日前`
  } else {
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}