export const dynamic = "force-dynamic";

import { NextResponse, NextRequest } from "next/server";
import { downloadFile } from "@/lib/s3";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    console.log("id", id);

    if (!id) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const image = await prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Generate 5-minute signed URL
    const signedUrl = await downloadFile(image.path);

    return NextResponse.json({
      signedUrl: signedUrl,
    });
  } catch (error) {
    console.error("Image signed URL error:", error);
    return NextResponse.json(
      { error: "Failed to get signed URL" },
      { status: 500 }
    );
  }
}
