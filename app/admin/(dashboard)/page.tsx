import { prisma } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Clock, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [totalPosts, publishedPosts, draftPosts, recentPosts] =
    await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.post.count({ where: { published: false } }),
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              name: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
    ]);

  const stats = [
    {
      title: "Total Posts",
      value: totalPosts,
      description: "All posts in the system",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Published",
      value: publishedPosts,
      description: "Live posts on the blog",
      icon: Eye,
      color: "text-green-600",
    },
    {
      title: "Drafts",
      value: draftPosts,
      description: "Posts in progress",
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Publish Rate",
      value:
        totalPosts > 0 ? Math.round((publishedPosts / totalPosts) * 100) : 0,
      description: "% of posts published",
      icon: TrendingUp,
      color: "text-purple-600",
      suffix: "%",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your blog.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stat.value}
                  {stat.suffix || ""}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
          <CardDescription>
            Your latest posts and their current status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentPosts?.length > 0 ? (
            recentPosts.map((post: any) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <h4 className="text-sm font-medium line-clamp-1">
                    {post.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Created {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={post.published ? "default" : "secondary"}>
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                  {post.featured && <Badge variant="outline">Featured</Badge>}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 space-y-3">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h4 className="text-sm font-medium">No posts yet</h4>
                <p className="text-xs text-muted-foreground">
                  Create your first blog post to get started
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
