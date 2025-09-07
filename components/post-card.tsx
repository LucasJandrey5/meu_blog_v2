
"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Badge } from "./ui/badge"
import { Calendar, Clock, ArrowRight, Sparkles, Eye } from "lucide-react"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { ViewCounter } from "./view-counter"

interface PostCardProps {
  post: {
    id: string
    title: string
    slug: string
    summary?: string | null
    featuredImage?: string | null
    readTime?: number | null
    tags: string[]
    publishedAt: Date | null
    createdAt: Date
    featured?: boolean
    author: {
      name: string | null
      firstName: string | null
      lastName: string | null
    } | null
  }
  index: number
}

export function PostCard({ post, index }: PostCardProps) {
  const publishDate = post.publishedAt || post.createdAt
  const authorName = post.author?.name || `${post.author?.firstName || ""} ${post.author?.lastName || ""}`.trim()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
      className="h-full"
    >
      <Card className={`h-full group overflow-hidden transition-all duration-300 ${
        post.featured 
          ? "bg-card border-primary/20 shadow-md hover:shadow-lg hover:border-primary/30" 
          : "bg-card border-border hover:border-border hover:shadow-md"
      } hover:shadow-lg`}>
        
        {/* Featured Badge */}
        {post.featured && (
          <div className="absolute top-4 right-4 z-10">
            <Badge 
              variant="secondary" 
              className="bg-primary text-primary-foreground border-0 shadow-sm"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Destaque
            </Badge>
          </div>
        )}
        
        {/* Image */}
        {post.featuredImage && (
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
          </div>
        )}
        
        <CardHeader className="space-y-4">
          {/* Meta Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-muted/60">
              <Calendar className="h-3 w-3" />
              {format(new Date(publishDate), "MMM dd, yyyy")}
            </div>
            <div className="flex items-center gap-4">
              {post.readTime && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-md bg-muted/60">
                  <Clock className="h-3 w-3" />
                  {post.readTime} min
                </div>
              )}
              <div className="px-3 py-1 rounded-md bg-muted/60">
                <ViewCounter 
                  slug={post.slug} 
                  className="text-muted-foreground" 
                  showLabel={false}
                />
              </div>
            </div>
          </div>
          
          {/* Title */}
          <Link href={`/posts/${post.slug}`}>
            <h3 className={`font-bold line-clamp-2 transition-colors group-hover:text-primary ${
              post.featuredImage ? 'text-xl lg:text-2xl' : 'text-lg lg:text-xl'
            }`}>
              {post.title}
            </h3>
          </Link>
        </CardHeader>
        
        <CardContent className="space-y-4 pb-6">
          {/* Summary */}
          {post.summary && (
            <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
              {post.summary}
            </p>
          )}
          
          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag, tagIndex) => (
                <Badge 
                  key={tagIndex} 
                  variant="outline" 
                  className="text-xs hover:bg-accent transition-colors"
                >
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge 
                  variant="outline" 
                  className="text-xs text-muted-foreground"
                >
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-0 pb-6">
          <Link 
            href={`/posts/${post.slug}`} 
            className="group/link flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-accent -mx-1"
          >
            <Eye className="h-4 w-4" />
            Ler mais
            <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5" />
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
