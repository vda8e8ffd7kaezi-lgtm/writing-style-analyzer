import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAnalysisHistory } from '../useAnalysisHistory'
import { AnalysisResult } from '@/types/design-system'

// LocalStorage のモック
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    length: 0,
    key: vi.fn()
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('useAnalysisHistory', () => {
  const createMockAnalysis = (id: string, text: string): AnalysisResult => ({
    id,
    text,
    analysis: `分析結果: ${text}`,
    timestamp: Date.now(),
    theme: 'ocean'
  })

  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  it('初期状態で空の履歴を返す', () => {
    const { result } = renderHook(() => useAnalysisHistory())
    
    expect(result.current.history).toEqual([])
    expect(result.current.currentCount).toBe(0)
    expect(result.current.maxItems).toBe(5)
  })

  it('新しい分析結果を追加できる', () => {
    const { result } = renderHook(() => useAnalysisHistory())
    const mockAnalysis = createMockAnalysis('1', 'テスト文章')
    
    act(() => {
      result.current.addAnalysis(mockAnalysis)
    })
    
    expect(result.current.history).toHaveLength(1)
    expect(result.current.history[0]).toEqual(mockAnalysis)
    expect(result.current.currentCount).toBe(1)
  })

  it('複数の分析結果を追加すると最新順で並ぶ', () => {
    const { result } = renderHook(() => useAnalysisHistory())
    const analysis1 = createMockAnalysis('1', '最初の文章')
    const analysis2 = createMockAnalysis('2', '2番目の文章')
    
    act(() => {
      result.current.addAnalysis(analysis1)
    })
    
    act(() => {
      result.current.addAnalysis(analysis2)
    })
    
    expect(result.current.history).toHaveLength(2)
    expect(result.current.history[0]).toEqual(analysis2) // 最新が先頭
    expect(result.current.history[1]).toEqual(analysis1)
  })

  it('最大5件を超えると古いものが削除される', () => {
    const { result } = renderHook(() => useAnalysisHistory())
    
    // 6件の分析結果を追加
    for (let i = 1; i <= 6; i++) {
      const analysis = createMockAnalysis(`${i}`, `文章${i}`)
      act(() => {
        result.current.addAnalysis(analysis)
      })
    }
    
    expect(result.current.history).toHaveLength(5)
    expect(result.current.currentCount).toBe(5)
    
    // 最新の5件のみ残る（6, 5, 4, 3, 2の順）
    expect(result.current.history[0].id).toBe('6')
    expect(result.current.history[4].id).toBe('2')
    
    // 最初に追加した分析（id: '1'）は削除されている
    const firstAnalysis = result.current.getAnalysis('1')
    expect(firstAnalysis).toBeUndefined()
  })

  it('特定の分析結果を削除できる', () => {
    const { result } = renderHook(() => useAnalysisHistory())
    const analysis1 = createMockAnalysis('1', '削除される文章')
    const analysis2 = createMockAnalysis('2', '残る文章')
    
    act(() => {
      result.current.addAnalysis(analysis1)
      result.current.addAnalysis(analysis2)
    })
    
    act(() => {
      result.current.removeAnalysis('1')
    })
    
    expect(result.current.history).toHaveLength(1)
    expect(result.current.history[0]).toEqual(analysis2)
    expect(result.current.currentCount).toBe(1)
  })

  it('履歴をクリアできる', () => {
    const { result } = renderHook(() => useAnalysisHistory())
    const analysis = createMockAnalysis('1', 'クリアされる文章')
    
    act(() => {
      result.current.addAnalysis(analysis)
    })
    
    expect(result.current.history).toHaveLength(1)
    
    act(() => {
      result.current.clearHistory()
    })
    
    expect(result.current.history).toHaveLength(0)
    expect(result.current.currentCount).toBe(0)
  })

  it('IDで特定の分析結果を取得できる', () => {
    const { result } = renderHook(() => useAnalysisHistory())
    const analysis1 = createMockAnalysis('1', '文章1')
    const analysis2 = createMockAnalysis('2', '文章2')
    
    act(() => {
      result.current.addAnalysis(analysis1)
    })
    
    act(() => {
      result.current.addAnalysis(analysis2)
    })
    
    // デバッグ: 履歴の内容を確認
    expect(result.current.history).toHaveLength(2)
    
    const retrieved = result.current.getAnalysis('1')
    expect(retrieved).toEqual(analysis1)
    
    const notFound = result.current.getAnalysis('999')
    expect(notFound).toBeUndefined()
  })

  it('存在しない分析結果を削除しようとしてもエラーにならない', () => {
    const { result } = renderHook(() => useAnalysisHistory())
    
    act(() => {
      result.current.removeAnalysis('non-existent')
    })
    
    expect(result.current.history).toHaveLength(0)
  })
})