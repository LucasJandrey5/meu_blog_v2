
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getClientIP, createFingerprint, isValidIP } from '@/lib/ip-utils'

export async function POST(
  req: NextRequest
) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      )
    }

    // Get client information
    const clientIP = getClientIP()
    const userAgent = req.headers.get('user-agent') || 'unknown'
    
    // Validate IP
    if (!isValidIP(clientIP)) {
      return NextResponse.json(
        { error: 'Invalid client IP' },
        { status: 400 }
      )
    }

    // Create unique fingerprint
    const fingerprint = createFingerprint(clientIP, userAgent)

    // Find the post
    const post = await prisma.post.findUnique({
      where: { slug },
      select: { id: true, viewCount: true }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if this user has already viewed this post
    const existingView = await prisma.postView.findUnique({
      where: {
        postId_fingerprint: {
          postId: post.id,
          fingerprint: fingerprint
        }
      }
    })

    if (existingView) {
      // User has already viewed this post
      return NextResponse.json({
        success: true,
        viewCount: post.viewCount,
        isNewView: false
      })
    }

    // Record the new view
    await prisma.$transaction(async (tx) => {
      // Create the view record
      await tx.postView.create({
        data: {
          postId: post.id,
          ipAddress: clientIP,
          userAgent: userAgent,
          fingerprint: fingerprint
        }
      })

      // Increment the post view count
      await tx.post.update({
        where: { id: post.id },
        data: {
          viewCount: {
            increment: 1
          }
        }
      })
    })

    return NextResponse.json({
      success: true,
      viewCount: post.viewCount + 1,
      isNewView: true
    })

  } catch (error) {
    console.error('Error recording post view:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  req: NextRequest
) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      )
    }

    // Get current view count for the post
    const post = await prisma.post.findUnique({
      where: { slug },
      select: { 
        viewCount: true,
        _count: {
          select: {
            views: true
          }
        }
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      viewCount: post.viewCount,
      uniqueViews: post._count.views
    })

  } catch (error) {
    console.error('Error getting post view count:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
