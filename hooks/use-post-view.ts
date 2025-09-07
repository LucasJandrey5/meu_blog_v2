
'use client'

import { useState, useEffect } from 'react'

interface PostViewResponse {
  success: boolean
  viewCount: number
  isNewView: boolean
}

interface PostViewCount {
  viewCount: number
  uniqueViews: number
}

export function usePostView(slug: string) {
  const [viewCount, setViewCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const recordView = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // First get current view count
        const countResponse = await fetch(`/api/posts/view?slug=${encodeURIComponent(slug)}`)
        if (countResponse.ok) {
          const countData: PostViewCount = await countResponse.json()
          setViewCount(countData.viewCount)
        }

        // Wait a bit before recording the view (to avoid immediate bounces)
        timeoutId = setTimeout(async () => {
          try {
            const viewResponse = await fetch(`/api/posts/view?slug=${encodeURIComponent(slug)}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            })

            if (viewResponse.ok) {
              const viewData: PostViewResponse = await viewResponse.json()
              if (viewData.success && viewData.isNewView) {
                setViewCount(viewData.viewCount)
              }
            }
          } catch (error) {
            console.error('Error recording view:', error)
          }
        }, 3000) // Record view after 3 seconds

      } catch (err) {
        console.error('Error getting view count:', err)
        setError('Failed to load view count')
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      recordView()
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [slug])

  return { viewCount, isLoading, error }
}
