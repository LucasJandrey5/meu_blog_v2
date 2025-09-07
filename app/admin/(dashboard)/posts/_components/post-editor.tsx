
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { 
  Save, 
  Eye, 
  Upload, 
  X, 
  Plus, 
  FileText, 
  Settings,
  Image as ImageIcon,
  Loader2
} from "lucide-react"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PostEditorProps {
  post?: {
    id: string
    title: string
    slug: string
    summary?: string | null
    content: string
    published: boolean
    featured: boolean
    featuredImage?: string | null
    tags: string[]
  } | null
}

export function PostEditor({ post }: PostEditorProps) {
  const [title, setTitle] = useState(post?.title || "")
  const [summary, setSummary] = useState(post?.summary || "")
  const [content, setContent] = useState(post?.content || "")
  const [published, setPublished] = useState(post?.published || false)
  const [featured, setFeatured] = useState(post?.featured || false)
  const [featuredImage, setFeaturedImage] = useState(post?.featuredImage || "")
  const [tags, setTags] = useState<string[]>(post?.tags || [])
  const [newTag, setNewTag] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const isEditing = !!post?.id

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setFeaturedImage(data.url)
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleAddTag = () => {
    const trimmedTag = newTag.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required')
      return
    }

    setIsSaving(true)

    try {
      const postData = {
        title,
        summary,
        content,
        published,
        featured,
        featuredImage: featuredImage || null,
        tags
      }

      const response = await fetch(
        isEditing ? `/api/posts/${post.id}` : '/api/posts',
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to save post')
      }

      const savedPost = await response.json()
      toast.success(isEditing ? 'Post updated successfully' : 'Post created successfully')
      
      router.push('/admin/posts')
      router.refresh()
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save post')
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Post Content
            </CardTitle>
            <CardDescription>
              Create engaging content with markdown support
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter post title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Summary (Optional)</Label>
              <Textarea
                id="summary"
                placeholder="Brief description of your post..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Tabs defaultValue="write" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="write" onClick={() => {}}>Write</TabsTrigger>
                  <TabsTrigger value="preview" onClick={() => {}}>Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="write" className="space-y-2">
                  <Textarea
                    id="content"
                    placeholder="Write your post content in Markdown..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={20}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Supports Markdown formatting including code blocks, tables, and more.
                  </p>
                </TabsContent>
                <TabsContent value="preview" className="space-y-2">
                  <div className="min-h-[500px] p-4 border rounded-lg bg-muted/30">
                    {content ? (
                      <MarkdownRenderer content={content} />
                    ) : (
                      <p className="text-muted-foreground text-center py-20">
                        Start writing to see the preview
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={handleSubmit} 
              disabled={isSaving || !title.trim() || !content.trim()}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? 'Update Post' : 'Create Post'}
                </>
              )}
            </Button>

            {isEditing && published && (
              <Button variant="outline" className="w-full" asChild>
                <a href={`/posts/${post.slug}`} target="_blank">
                  <Eye className="mr-2 h-4 w-4" />
                  View Post
                </a>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5" />
              Post Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Publish Status</Label>
                <p className="text-sm text-muted-foreground">
                  Make this post visible on the blog
                </p>
              </div>
              <Switch
                checked={published}
                onCheckedChange={setPublished}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Featured Post</Label>
                <p className="text-sm text-muted-foreground">
                  Highlight this post on the homepage
                </p>
              </div>
              <Switch
                checked={featured}
                onCheckedChange={setFeatured}
              />
            </div>
          </CardContent>
        </Card>

        {/* Featured Image */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ImageIcon className="h-5 w-5" />
              Featured Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {featuredImage ? (
              <div className="space-y-3">
                <div className="relative aspect-video overflow-hidden rounded-lg border">
                  <img
                    src={featuredImage}
                    alt="Featured image preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFeaturedImage("")}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove Image
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload a featured image for your post
                  </p>
                  <Label htmlFor="image-upload">
                    <Button variant="outline" size="sm" asChild disabled={isUploading}>
                      <span>
                        {isUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Image
                          </>
                        )}
                      </span>
                    </Button>
                  </Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Supports JPG, PNG, GIF up to 5MB
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tags</CardTitle>
            <CardDescription>
              Help readers find your content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button 
                size="sm" 
                onClick={handleAddTag}
                disabled={!newTag.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
