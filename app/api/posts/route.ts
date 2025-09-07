
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { createSlug, calculateReadTime } from "@/lib/markdown"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get("published")
    
    const posts = await prisma.post.findMany({
      where: published === "true" ? { published: true } : {},
      include: {
        author: {
          select: {
            name: true,
            firstName: true,
            lastName: true,
          }
        }
      },
      orderBy: {
        publishedAt: "desc"
      }
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { title, content, summary, published, featured, featuredImage, tags } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    const slug = createSlug(title)
    const readTime = calculateReadTime(content)

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        summary: summary || "",
        published: published || false,
        featured: featured || false,
        featuredImage: featuredImage || null,
        readTime,
        tags: tags || [],
        publishedAt: published ? new Date() : null,
        authorId: session.user.id,
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    )
  }
}
