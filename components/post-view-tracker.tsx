
'use client'

import { usePostView } from '@/hooks/use-post-view'
import { useEffect } from 'react'

interface PostViewTrackerProps {
  slug: string
}

export function PostViewTracker({ slug }: PostViewTrackerProps) {
  const { viewCount } = usePostView(slug)

  // This component is invisible and just tracks views
  // The actual counting is handled in the hook
  return null
}
