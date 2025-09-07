
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

interface RouteParams {
  params: { slug: string }
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const post = await prisma.post.findUnique({
      where: { 
        slug: params.slug,
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
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error fetching post by slug:", error)
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    )
  }
}
