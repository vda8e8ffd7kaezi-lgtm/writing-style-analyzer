import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { AnalysisResult, AnalysisHistory } from '@/types/design-system'
import { HISTORY_CONFIG } from '@/constants/design-system'

// 分析履歴管理フック - 最大5件の履歴を管理
export function useAnalysisHistory() {
  const [history, setHistory] = useLocalStorage<AnalysisHistory>(
    HISTORY_CONFIG.storageKey,
    {
      results: [],
      maxItems: HISTORY_CONFIG.maxItems
    }
  )

  // 新しい分析結果を追加
  const addAnalysis = useCallback((result: AnalysisResult) => {
    setHistory(prevHistory => {
      const newResults = [result, ...prevHistory.results]
      
      // 最大件数を超えた場合は古いものを削除
      const trimmedResults = newResults.slice(0, HISTORY_CONFIG.maxItems)
      
      return {
        ...prevHistory,
        results: trimmedResults
      }
    })
  }, [setHistory])

  // 特定の分析結果を削除
  const removeAnalysis = useCallback((id: string) => {
    setHistory(prevHistory => ({
      ...prevHistory,
      results: prevHistory.results.filter(result => result.id !== id)
    }))
  }, [setHistory])

  // 履歴をクリア
  const clearHistory = useCallback(() => {
    setHistory({
      results: [],
      maxItems: HISTORY_CONFIG.maxItems
    })
  }, [setHistory])

  // 特定の分析結果を取得
  const getAnalysis = useCallback((id: string): AnalysisResult | undefined => {
    return history.results.find(result => result.id === id)
  }, [history.results])

  return {
    history: history.results,
    addAnalysis,
    removeAnalysis,
    clearHistory,
    getAnalysis,
    maxItems: HISTORY_CONFIG.maxItems,
    currentCount: history.results.length
  }
}