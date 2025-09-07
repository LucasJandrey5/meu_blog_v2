
"use client"

import dynamic from "next/dynamic"

const Header = dynamic(() => import("./header").then(mod => ({ default: mod.Header })), {
  ssr: false,
  loading: () => (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container max-w-6xl mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center space-x-2 font-bold text-lg">
          <div className="h-6 w-6 bg-primary rounded" />
          <span>Blog Lucas Jandrey</span>
        </div>
        <nav className="flex items-center space-x-4">
          <div className="h-8 w-16 bg-muted rounded" />
        </nav>
      </div>
    </header>
  )
})

export function ClientHeader() {
  return <Header />
}
