
import { PostEditor } from "../_components/post-editor"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/posts">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Posts
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create New Post</h1>
          <p className="text-muted-foreground">
            Share your thoughts and insights with the world
          </p>
        </div>
      </div>

      {/* Editor */}
      <PostEditor />
    </div>
  )
}
