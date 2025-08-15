// 文体分析を実行する関数（API Route経由）
export async function analyzeWritingStyle(text: string): Promise<string> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || '分析に失敗しました')
    }

    return data.analysis
  } catch (error) {
    console.error('文体分析エラー:', error)
    
    if (error instanceof Error) {
      throw error
    }
    
    throw new Error('文体分析中にエラーが発生しました。しばらく待ってから再試行してください。')
  }
}

// API利用可能性をチェックする関数
export async function checkGeminiAvailability(): Promise<boolean> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: 'test' }),
    })

    return response.ok
  } catch (error) {
    console.error('Gemini API利用可能性チェックエラー:', error)
    return false
  }
}