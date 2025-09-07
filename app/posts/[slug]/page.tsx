
import { notFound } from "next/navigation"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { prisma } from "@/lib/db"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowLeft, Share2, User, Eye, Heart, MessageCircle, Sparkles } from "lucide-react"
import { format } from "date-fns"
import { ShareButton } from "./_components/share-button"
import { ViewCounter } from "@/components/view-counter"
import { PostViewTracker } from "@/components/post-view-tracker"

export const dynamic = "force-dynamic"

interface PostPageProps {
  params: { slug: string }
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { 
      slug,
      published: true 
    },
    include: {
      author: {
        select: {
          name: true,
          firstName: true,
          lastName: true,
        }
      }
    }
  })

  if (!post) {
    return null
  }

  return post
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPost(params.slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} | Blog Lucas Jandrey`,
    description: post.summary || `Read "${post.title}" by Lucas Jandrey`,
    openGraph: {
      title: post.title,
      description: post.summary || undefined,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: ["Lucas Jandrey"],
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary || undefined,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  const publishDate = post.publishedAt || post.createdAt
  const authorName = post.author?.name || `${post.author?.firstName || ""} ${post.author?.lastName || ""}`.trim()

  return (
    <div className="min-h-screen">
      {/* Hero Section with Featured Image */}
      {post.featuredImage && (
        <section className="relative h-[50vh] lg:h-[60vh] overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
          
          {/* Back Button - Floating */}
          <div className="absolute top-8 left-4 lg:left-8 z-10">
            <Link href="/">
              <Button 
                variant="secondary" 
                className="flex items-center gap-2 backdrop-blur-md bg-background/80 hover:bg-background/90 transition-all duration-300 border border-border/50"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Voltar ao Blog</span>
              </Button>
            </Link>
          </div>

          {/* Featured Badge */}
          {post.featured && (
            <div className="absolute top-8 right-4 lg:right-8 z-10">
              <Badge className="bg-primary text-primary-foreground border-0 shadow-md">
                <Sparkles className="h-3 w-3 mr-1" />
                Destaque
              </Badge>
            </div>
          )}
        </section>
      )}

      {/* Main Content */}
      <div className="relative">
        {/* Post Header */}
        <header className={`relative ${post.featuredImage ? '-mt-32' : 'pt-16'} pb-16`}>
          {/* Background without featured image */}
          {!post.featuredImage && (
            <div className="absolute inset-0 bg-background" />
          )}
          
          <div className="container relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button for non-featured posts */}
            {!post.featuredImage && (
              <div className="mb-12">
                <Link href="/">
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-primary/10 transition-colors rounded-xl">
                    <ArrowLeft className="h-4 w-4" />
                    Voltar ao Blog
                  </Button>
                </Link>
              </div>
            )}

            <div className={`space-y-8 ${post.featuredImage ? 'text-white' : ''}`}>
              {/* Title and Summary */}
              <div className="space-y-6">
                <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight ${
                  post.featuredImage 
                    ? 'text-white drop-shadow-2xl' 
                    : 'text-foreground'
                }`}>
                  {post.title}
                </h1>
                
                {post.summary && (
                  <p className={`text-xl lg:text-2xl leading-relaxed max-w-3xl ${
                    post.featuredImage 
                      ? 'text-white/90 drop-shadow-lg' 
                      : 'text-muted-foreground'
                  }`}>
                    {post.summary}
                  </p>
                )}
              </div>

              {/* Meta Information */}
              <div className={`flex flex-wrap items-center gap-4 lg:gap-6 ${
                post.featuredImage 
                  ? 'text-white/80' 
                  : 'text-muted-foreground'
              }`}>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/20 backdrop-blur-md">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{authorName || "Lucas Jandrey"}</span>
                </div>
                
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/20 backdrop-blur-md">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(publishDate), "dd MMMM yyyy")}</span>
                </div>
                
                {post.readTime && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/20 backdrop-blur-md">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime} min de leitura</span>
                  </div>
                )}

                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/20 backdrop-blur-md">
                  <ViewCounter 
                    slug={post.slug}
                    className={post.featuredImage ? 'text-white/80' : 'text-muted-foreground'}
                  />
                </div>
              </div>

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {post.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className={`px-4 py-2 text-sm ${
                        post.featuredImage 
                          ? 'bg-white/10 text-white border-white/20 backdrop-blur-md hover:bg-white/20' 
                          : 'bg-background border-border hover:bg-accent'
                      } transition-colors`}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="relative">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            {/* Content Area */}
            <div className={`relative ${post.featuredImage ? 'pt-16' : 'pt-8'}`}>
              {/* Background for content */}
              <div className="absolute inset-0 bg-gradient-to-b from-background/95 to-background rounded-3xl" />
              
              <div className="relative p-8 lg:p-12 rounded-3xl border border-border/50 backdrop-blur-sm">
                {/* Share Button */}
                <div className="flex justify-end mb-8">
                  <ShareButton title={post.title} />
                </div>

                {/* Markdown Content */}
                <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
                  <MarkdownRenderer content={post.content} />
                </div>
              </div>
            </div>

            {/* Post Footer */}
            <footer className="mt-20 space-y-12">
              {/* Engagement Section */}
              <div className="relative overflow-hidden rounded-xl">
                <div className="p-8 lg:p-12 text-center space-y-6 bg-muted/30 border border-border">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      <Heart className="h-6 w-6 text-red-500 fill-current" />
                      <h3 className="text-2xl font-bold">Gostou do artigo?</h3>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Se este conteúdo foi útil para você, compartilhe com outros desenvolvedores 
                      que também podem se beneficiar!
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <ShareButton title={post.title} />
                    
                    <Link href={`mailto:lucas@lucasjandrey.com.br?subject=Feedback sobre: ${post.title}`}>
                      <Button variant="outline" className="flex items-center gap-2 rounded-xl">
                        <MessageCircle className="h-4 w-4" />
                        Enviar Feedback
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Navigation */}
              <div className="text-center">
                <Link href="/">
                  <Button 
                    size="lg"
                    className="flex items-center gap-3 mx-auto px-8 py-4"
                  >
                    <Eye className="h-5 w-5" />
                    Ver Mais Artigos
                  </Button>
                </Link>
              </div>
            </footer>
          </div>
        </article>
      </div>

      {/* View Tracker - invisible component that tracks views */}
      <PostViewTracker slug={post.slug} />
    </div>
  )
}
