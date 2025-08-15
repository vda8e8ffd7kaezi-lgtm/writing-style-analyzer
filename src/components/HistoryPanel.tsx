import { cn } from '@/lib/utils'
import { HistoryCard } from './HistoryCard'
import { useAnalysisHistory } from '@/hooks/useAnalysisHistory'
import { AnalysisResult } from '@/types/design-system'
import { History, Trash2, Clock } from 'lucide-react'

interface HistoryPanelProps {
  onViewResult: (result: AnalysisResult) => void
  className?: string
}

// Apple風デザインシステム - 履歴表示パネル（最大5件）
export function HistoryPanel({ onViewResult, className }: HistoryPanelProps) {
  const { history, removeAnalysis, clearHistory, maxItems, currentCount } = useAnalysisHistory()

  const handleClearAll = () => {
    if (window.confirm('すべての履歴を削除してもよろしいですか？この操作は取り消せません。')) {
      clearHistory()
    }
  }

  const handleDeleteItem = (id: string) => {
    removeAnalysis(id)
  }

  if (currentCount === 0) {
    return (
      <div className={cn(
        'w-full max-w-md p-6 bg-white/40 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg',
        className
      )}>
        <div className="text-center space-y-4">
          <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
            <History className="w-12 h-12 mx-auto text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">履歴がありません</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              文章を分析すると、ここに履歴が表示されます。
              <br />
              最大{maxItems}件まで保存されます。
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      'w-full max-w-md bg-white/40 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg',
      className
    )}>
      {/* ヘッダー */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
              <History className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                分析履歴
              </h3>
              <p className="text-xs text-gray-500">
                {currentCount} / {maxItems}件
              </p>
            </div>
          </div>
          
          {currentCount > 0 && (
            <button
              onClick={handleClearAll}
              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 group"
              title="すべて削除"
            >
              <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* 履歴リスト */}
      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
        {history.map((result) => (
          <HistoryCard
            key={result.id}
            result={result}
            onView={onViewResult}
            onDelete={handleDeleteItem}
          />
        ))}
      </div>

      {/* フッター */}
      <div className="p-3 border-t border-white/20 text-center">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>最新の{maxItems}件を自動保存</span>
        </div>
      </div>
    </div>
  )
}