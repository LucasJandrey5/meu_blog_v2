import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PostEditor } from "../../_components/post-editor";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

interface EditPostPageProps {
  params: { id: string };
}

async function getPost(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          name: true,
          firstName: true,
          lastName: true,
        },
      },
      coverImage: true,
    },
  });

  if (!post) {
    return null;
  }

  return post;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

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
          <h1 className="text-3xl font-bold">Edit Post</h1>
          <p className="text-muted-foreground">
            Update your post content and settings
          </p>
        </div>
      </div>

      {/* Editor */}
      <PostEditor post={post} />
    </div>
  );
}
