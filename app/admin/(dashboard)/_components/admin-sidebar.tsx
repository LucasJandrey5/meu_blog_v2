
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Settings, 
  LogOut,
  Home,
  User
} from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard
  },
  {
    title: "All Posts",
    href: "/admin/posts",
    icon: FileText
  },
  {
    title: "New Post",
    href: "/admin/posts/new",
    icon: PlusCircle
  },
]

export function AdminSidebar() {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession() || {}

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  if (!mounted) {
    return (
      <div className="w-64 min-h-screen bg-background border-r flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Blog Lucas Jandrey
          </p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <div className="h-10 bg-muted rounded animate-pulse" />
          <div className="h-10 bg-muted rounded animate-pulse" />
          <div className="h-10 bg-muted rounded animate-pulse" />
        </nav>
      </div>
    )
  }

  return (
    <div className="w-64 min-h-screen bg-background border-r flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Blog Lucas Jandrey
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  isActive && "bg-primary/10 text-primary"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          )
        })}
        
        <Separator className="my-4" />
        
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Home className="h-4 w-4" />
            View Blog
          </Button>
        </Link>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="p-2 rounded-full bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {session?.user?.name || "Admin"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {session?.user?.email}
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          className="w-full justify-start gap-3"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  )
}
