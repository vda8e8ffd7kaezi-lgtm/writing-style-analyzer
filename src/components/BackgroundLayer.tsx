import { cn } from '@/lib/utils'

interface BackgroundLayerProps {
  className?: string
}

// Apple風デザインシステム - 3層構造のグラデーション背景
export function BackgroundLayer({ className }: BackgroundLayerProps) {
  return (
    <div className={cn('fixed inset-0 -z-10', className)}>
      {/* ベースグラデーション */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50" />
      
      {/* 装飾レイヤー1 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      
      {/* 装飾レイヤー2: 大きなblur円 */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
      
      {/* 装飾レイヤー3: 小さなblur円 */}
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-pink-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse" />
    </div>
  )
}