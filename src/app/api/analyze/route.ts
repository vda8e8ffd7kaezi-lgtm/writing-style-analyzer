import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// 文体分析用のプロンプトテンプレート
const ANALYSIS_PROMPT = `
あなたは文体分析の専門家です。与えられた文章から、その人特有の文体・ライティングルール・特徴・雰囲気を抽出し、AIツールで活用しやすいマークダウン形式で出力してください。

以下の観点で分析してください：

## 文体の特徴
- 文章の基本的なスタイル（丁寧語、カジュアル、フォーマルなど）
- 語彙選択の傾向
- 文の長さや構造の特徴

## ライティングルール
- 句読点の使い方
- 改行やレイアウトの傾向
- 敬語や丁寧語の使用パターン

## 語彙・表現の特徴
- よく使われる単語や表現
- 専門用語の使用傾向
- 感情表現の方法

## 文章の雰囲気
- 文章全体のトーン
- 読み手との距離感
- 情報伝達スタイル

## AIプロンプト活用案
- この文体を再現するための具体的な指示
- AIツールで使える「〜の文体で書いてください」形式のプロンプト例

以下の文章を分析してください：

---
{text}
---

回答は必ずマークダウン形式で、上記の構成に従って出力してください。
`

export async function POST(request: NextRequest) {
  try {
    // JSONパース時のエラーハンドリング
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: '無効なリクエスト形式です。' },
        { status: 400 }
      )
    }

    const { text } = body
    
    // 入力バリデーション強化
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: '有効なテキストを入力してください。' },
        { status: 400 }
      )
    }

    // XSS攻撃対策：HTMLタグの除去
    const cleanText = text.replace(/<[^>]*>/g, '').trim()
    
    if (cleanText.length === 0) {
      return NextResponse.json(
        { error: '分析可能なテキストが含まれていません。' },
        { status: 400 }
      )
    }

    if (cleanText.length > 2000) {
      return NextResponse.json(
        { error: `テキストは2000文字以内で入力してください。現在: ${cleanText.length}文字` },
        { status: 400 }
      )
    }

    // APIキーの確認
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set in environment variables')
      return NextResponse.json(
        { error: 'APIキーが設定されていません。環境変数を確認してください。' },
        { status: 500 }
      )
    }

    // Gemini AI クライアント初期化
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    
    const prompt = ANALYSIS_PROMPT.replace('{text}', cleanText)
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const analysisText = response.text()
    
    if (!analysisText) {
      throw new Error('AI分析結果が取得できませんでした')
    }
    
    return NextResponse.json({ analysis: analysisText })
    
  } catch (error) {
    console.error('Gemini AI分析エラー:', error)
    
    let errorMessage = '文体分析中にエラーが発生しました。しばらく待ってから再試行してください。'
    
    if (error instanceof Error) {
      if (error.message.includes('API key not valid')) {
        errorMessage = 'APIキーが無効です。設定を確認してください。'
      } else if (error.message.includes('quota')) {
        errorMessage = 'API利用制限に達しました。しばらく待ってから再試行してください。'
      } else if (error.message.includes('rate')) {
        errorMessage = 'リクエスト頻度が制限を超えました。少し待ってから再試行してください。'
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}