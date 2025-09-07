
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { uploadFile } from "@/lib/s3"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Upload to S3
    const cloud_storage_path = await uploadFile(buffer, file.name)
    
    // Get the full URL for the uploaded file
    const fileUrl = `${process.env.AWS_CLOUDFRONT_URL || `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com`}/${cloud_storage_path}`

    return NextResponse.json({
      cloud_storage_path,
      url: fileUrl,
      fileName: file.name
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    )
  }
}
