import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../useLocalStorage'

// LocalStorage のモック実装
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

// window.localStorage をモック
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  it('初期値を正しく設定する', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))
    
    expect(result.current[0]).toBe('initial-value')
  })

  it('値を更新してlocalStorageに保存する', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    
    act(() => {
      result.current[1]('updated-value')
    })
    
    expect(result.current[0]).toBe('updated-value')
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'test-key',
      JSON.stringify('updated-value')
    )
  })

  it('関数による値の更新ができる', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0))
    
    act(() => {
      result.current[1](prev => prev + 1)
    })
    
    expect(result.current[0]).toBe(1)
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'counter',
      JSON.stringify(1)
    )
  })

  it('複雑なオブジェクトを正しく保存・復元する', () => {
    const initialData = { name: 'test', count: 42, active: true }
    
    const { result } = renderHook(() => useLocalStorage('object-key', initialData))
    
    const updatedData = { ...initialData, count: 43 }
    act(() => {
      result.current[1](updatedData)
    })
    
    expect(result.current[0]).toEqual(updatedData)
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'object-key',
      JSON.stringify(updatedData)
    )
  })

  it('localStorageから既存の値を復元する', () => {
    const existingData = { restored: true }
    localStorageMock.setItem('existing-key', JSON.stringify(existingData))
    
    const { result } = renderHook(() => useLocalStorage('existing-key', { restored: false }))
    
    expect(result.current[0]).toEqual(existingData)
  })

  it('不正なJSONデータの場合は初期値を使用する', () => {
    localStorageMock.setItem('invalid-key', 'invalid-json')
    
    // console.warnのモック
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    
    const { result } = renderHook(() => useLocalStorage('invalid-key', 'fallback'))
    
    expect(result.current[0]).toBe('fallback')
    expect(consoleSpy).toHaveBeenCalled()
    
    consoleSpy.mockRestore()
  })

  it('setItem時のエラーを適切に処理する', () => {
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new Error('Storage quota exceeded')
    })
    
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    
    act(() => {
      result.current[1]('new-value')
    })
    
    expect(consoleSpy).toHaveBeenCalled()
    
    consoleSpy.mockRestore()
  })
})