// Apple風デザインシステム定数

// アニメーション設定
export const ANIMATION_DURATIONS = {
  fast: 200,        // 基本的なホバー・フォーカス
  normal: 300,      // アイコン回転・特殊効果
  slow: 500,        // ページ遷移
} as const

// レスポンシブブレークポイント
export const BREAKPOINTS = {
  sm: '640px',      // モバイル大
  md: '768px',      // タブレット
  lg: '1024px',     // デスクトップ小
  xl: '1280px',     // デスクトップ大
} as const

// 影の設定
export const SHADOW_LEVELS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
} as const

// Glassmorphism設定
export const GLASS_STYLES = {
  light: 'bg-white/70 backdrop-blur-xl',
  medium: 'bg-white/80 backdrop-blur-xl',
  heavy: 'bg-white/90 backdrop-blur-xl',
  card: 'bg-white/40 backdrop-blur-sm',
} as const

// Z-Index階層
export const Z_INDEX = {
  base: 0,
  dropdown: 10,
  overlay: 20,
  modal: 30,
  header: 50,
  tooltip: 100,
} as const

// 最大文字数制限
export const MAX_INPUT_LENGTH = 2000

// 履歴管理設定
export const HISTORY_CONFIG = {
  maxItems: 5,
  storageKey: 'writing-style-analyzer-history',
} as const