
"use client"

import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { toast } from "sonner"

interface ShareButtonProps {
  title: string
}

export function ShareButton({ title }: ShareButtonProps) {
  const handleShare = async () => {
    const url = window.location.href
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this post: ${title}`,
          url: url,
        })
      } catch (error) {
        console.log("Share cancelled or failed")
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url)
        toast.success("Link copied to clipboard!")
      } catch (error) {
        toast.error("Failed to copy link")
      }
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center gap-2">
      <Share2 className="h-4 w-4" />
      Share
    </Button>
  )
}
