'use client'

import { useState, useCallback, useMemo } from 'react'
import { BackgroundLayer } from '@/components/BackgroundLayer'
import { Header } from '@/components/Header'
import { TextInput } from '@/components/TextInput'
import { LoadingAnimation } from '@/components/LoadingAnimation'
import { AnalysisDisplay } from '@/components/AnalysisDisplay'
import { HistoryPanel } from '@/components/HistoryPanel'
import { useAnalysisHistory } from '@/hooks/useAnalysisHistory'
import { analyzeWritingStyle } from '@/services/gemini'
import { AnalysisResult } from '@/types/design-system'
import { getRandomThemeColor } from '@/constants/theme-colors'
import { Brain, Sparkles, TrendingUp } from 'lucide-react'

type AppState = 'input' | 'analyzing' | 'result'

export default function Home() {
  const [appState, setAppState] = useState<AppState>('input')
  const [inputText, setInputText] = useState('')
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const { addAnalysis } = useAnalysisHistory()

  const handleAnalyze = useCallback(async () => {
    if (!inputText.trim()) {
      setError('分析する文章を入力してください。')
      return
    }

    if (inputText.length > 2000) {
      setError('テキストは2000文字以内で入力してください。')
      return
    }

    setAppState('analyzing')
    setError(null)

    try {
      const analysis = await analyzeWritingStyle(inputText)
      
      if (!analysis || analysis.trim().length === 0) {
        throw new Error('分析結果が取得できませんでした。もう一度お試しください。')
      }

      const result: AnalysisResult = {
        id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text: inputText.trim(),
        analysis,
        timestamp: Date.now(),
        theme: getRandomThemeColor().value
      }

      addAnalysis(result)
      setCurrentResult(result)
      setAppState('result')
    } catch (error) {
      console.error('分析エラー:', error)
      
      let errorMessage = '予期しないエラーが発生しました'
      
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorMessage = 'ネットワークエラーが発生しました。インターネット接続を確認してください。'
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
          errorMessage = 'API利用制限に達しました。しばらく待ってから再試行してください。'
        } else if (error.message.includes('key')) {
          errorMessage = 'APIキーの設定に問題があります。管理者にお問い合わせください。'
        } else {
          errorMessage = error.message
        }
      }
      
      setError(errorMessage)
      setAppState('input')
    }
  }, [inputText, addAnalysis])

  const handleNewAnalysis = useCallback(() => {
    setInputText('')
    setCurrentResult(null)
    setError(null)
    setAppState('input')
  }, [])

  const handleViewResult = useCallback((result: AnalysisResult) => {
    setCurrentResult(result)
    setAppState('result')
  }, [])

  // 重いコンポーネントのメモ化
  const welcomeSection = useMemo(() => (
    <div className="text-center max-w-4xl mx-auto space-y-6">
      <div className="relative">
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-xl">
          <Brain className="w-16 h-16 text-blue-500" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse" />
      </div>

      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
        Writing Style Analyzer
      </h1>
      
      <div className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto text-center">
        <p className="mb-2">AI時代の個人らしさを守る文体分析ツール</p>
        <p>あなたの文体・語彙選択・特徴を抽出し、そのままAIツールで使えるプロンプト形式で出力</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto text-sm">
        <div className="p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/30">
          <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-800 mb-1">AI分析</h3>
          <p className="text-gray-600">Gemini AI による高精度文体分析</p>
        </div>
        <div className="p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/30">
          <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-800 mb-1">実用的出力</h3>
          <p className="text-gray-600">そのままAIツールで使えるプロンプト形式</p>
        </div>
        <div className="p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/30">
          <Brain className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-800 mb-1">個人性保護</h3>
          <p className="text-gray-600">あなただけの文体特徴を維持・活用</p>
        </div>
      </div>
    </div>
  ), [])

  return (
    <div className="min-h-screen relative">
      <BackgroundLayer />
      <Header />
      
      {/* メインコンテンツ */}
      <main className="pt-32 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {appState === 'input' && (
            <div className="space-y-8">
              {/* ウェルカム画面 */}
              {welcomeSection}

              {/* エラー表示 */}
              {error && (
                <div className="max-w-4xl mx-auto p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-red-100 rounded-full">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-red-800">エラーが発生しました</p>
                      <p className="text-red-700 text-sm mt-1">{error}</p>
                      <button 
                        onClick={() => setError(null)}
                        className="text-red-600 text-xs underline mt-2 hover:text-red-800"
                      >
                        閉じる
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* テキスト入力 */}
              <TextInput
                value={inputText}
                onChange={setInputText}
                onSubmit={handleAnalyze}
              />
            </div>
          )}

          {appState === 'analyzing' && (
            <div className="flex justify-center">
              <LoadingAnimation />
            </div>
          )}

          {appState === 'result' && currentResult && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleNewAnalysis}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    新しく分析する
                  </button>
                  <button
                    onClick={() => setAppState('input')}
                    className="px-6 py-3 bg-white/60 hover:bg-white/80 text-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-gray-200 hover:border-gray-300"
                  >
                    入力画面に戻る
                  </button>
                </div>
              </div>
              <AnalysisDisplay result={currentResult} />
            </div>
          )}

          {/* レスポンシブ履歴パネル */}
          <div className={`mt-8 ${appState === 'input' ? 'block' : 'hidden'}`}>
            <div className="flex justify-center">
              <HistoryPanel onViewResult={handleViewResult} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
