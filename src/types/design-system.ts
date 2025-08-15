// Apple風デザインシステムの型定義

export interface ThemeColorConfig {
  name: string
  class: string
  value: ThemeColor
  accent: string
}

export type ThemeColor = 
  | 'sunshine'
  | 'blossom' 
  | 'ocean'
  | 'forest'
  | 'lavender'
  | 'sunset'
  | 'mist'
  | 'mint'

export interface AnalysisResult {
  id: string
  text: string
  analysis: string
  timestamp: number
  theme?: ThemeColor
}

export interface AnalysisHistory {
  results: AnalysisResult[]
  maxItems: number
}