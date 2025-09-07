
"use client"

import dynamic from "next/dynamic"

const AdminSidebar = dynamic(() => import("./admin-sidebar").then(mod => ({ default: mod.AdminSidebar })), {
  ssr: false,
  loading: () => (
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
})

export function ClientAdminSidebar() {
  return <AdminSidebar />
}
