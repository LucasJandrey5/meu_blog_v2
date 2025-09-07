import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PostActions } from "./_components/post-actions";
import { PlusCircle, FileText, Eye, Clock } from "lucide-react";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    include: {
      author: {
        select: {
          name: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">All Posts</h1>
          <p className="text-muted-foreground">
            Manage and organize your blog posts
          </p>
        </div>
        <Link href="/admin/posts/new">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Posts List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Posts ({posts?.length || 0})
          </CardTitle>
          <CardDescription>
            All your blog posts with their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {posts?.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post: (typeof posts)[number]) => {
                const authorName =
                  post.author?.name ||
                  `${post.author?.firstName || ""} ${post.author?.lastName || ""}`.trim();
                return (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/posts/edit/${post.id}`}
                          className="font-medium hover:text-primary transition-colors line-clamp-1"
                        >
                          {post.title}
                        </Link>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={post.published ? "default" : "secondary"}
                          >
                            {post.published ? "Published" : "Draft"}
                          </Badge>
                          {post.featured && (
                            <Badge variant="outline">Featured</Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>By {authorName || "Unknown"}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime || 5} min read
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.viewCount || 0} views
                        </div>
                        <span>•</span>
                        <span>
                          {post.published && post.publishedAt
                            ? `Published ${format(new Date(post.publishedAt), "MMM dd, yyyy")}`
                            : `Created ${format(new Date(post.createdAt), "MMM dd, yyyy")}`}
                        </span>
                        {post.published && (
                          <>
                            <span>•</span>
                            <Link
                              href={`/posts/${post.slug}`}
                              target="_blank"
                              className="flex items-center gap-1 text-primary hover:underline"
                            >
                              <Eye className="h-3 w-3" />
                              View Post
                            </Link>
                          </>
                        )}
                      </div>

                      {post.summary && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                          {post.summary}
                        </p>
                      )}

                      {post.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{post.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    <PostActions
                      postId={post.id}
                      postTitle={post.title}
                      postSlug={post.slug}
                      isPublished={post.published}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <div className="p-4 rounded-full bg-muted w-fit mx-auto">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h4 className="text-lg font-medium">No posts yet</h4>
                <p className="text-muted-foreground mt-2">
                  Create your first blog post to get started sharing your
                  thoughts and insights.
                </p>
              </div>
              <Link href="/admin/posts/new">
                <Button className="mt-4">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create your first post
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
