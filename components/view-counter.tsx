
'use client'

import { Eye } from 'lucide-react'
import { usePostView } from '@/hooks/use-post-view'

interface ViewCounterProps {
  slug: string
  className?: string
  showIcon?: boolean
  showLabel?: boolean
}

export function ViewCounter({ 
  slug, 
  className = "", 
  showIcon = true, 
  showLabel = true 
}: ViewCounterProps) {
  const { viewCount, isLoading } = usePostView(slug)

  if (isLoading) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {showIcon && <Eye className="h-3 w-3 opacity-50" />}
        <span className="text-xs opacity-50">--</span>
        {showLabel && <span className="text-xs opacity-50">views</span>}
      </div>
    )
  }

  const formatViewCount = (count: number): string => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k'
    }
    return count.toString()
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {showIcon && <Eye className="h-3 w-3" />}
      <span className="text-xs">{formatViewCount(viewCount)}</span>
      {showLabel && (
        <span className="text-xs">
          {viewCount === 1 ? 'view' : 'views'}
        </span>
      )}
    </div>
  )
}
