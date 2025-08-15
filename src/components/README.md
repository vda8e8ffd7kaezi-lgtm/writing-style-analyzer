# コンポーネント構成設計

## Apple風デザインシステム準拠のコンポーネント構造

### レイアウトコンポーネント
- `BackgroundLayer.tsx` - 3層構造のグラデーション背景
- `Header.tsx` - Glassmorphismヘッダー
- `MainContainer.tsx` - メインコンテナ

### UI コンポーネント
- `TextInput.tsx` - メインテキスト入力エリア（2000文字制限）
- `AnalysisDisplay.tsx` - 分析結果表示エリア
- `CopyButton.tsx` - ワンクリックコピー機能
- `LoadingAnimation.tsx` - 分析中ローディングアニメーション
- `ThemeSelector.tsx` - テーマカラー選択UI
- `HistoryPanel.tsx` - 履歴表示パネル（最大5件）

### 機能的コンポーネント
- `AnalysisForm.tsx` - 分析フォーム統合
- `HistoryCard.tsx` - 履歴アイテム表示
- `EmptyState.tsx` - 空状態画面

### マイクロインタラクション
- `GlassButton.tsx` - Glassmorphismボタン
- `HoverCard.tsx` - ホバー効果付きカード
- `AnimatedIcon.tsx` - アニメーション付きアイコン

## レスポンシブ設計
- モバイルファースト（1列レイアウト）
- md以上で3列グリッド展開
- ブレークポイント: sm(640px), md(768px), lg(1024px), xl(1280px)

## 状態管理
- `useAnalysisHistory` - 履歴管理
- `useLocalStorage` - データ永続化
- `useState` - コンポーネント内状態

## API統合
- Gemini AI APIを使用した文体分析
- 無料枠内でのレスポンス最適化