
"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"
import { Badge } from "./ui/badge"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

interface MarkdownRendererProps {
  content: string
  className?: string
}

function CodeBlock({ children, className, ...props }: any) {
  const [copied, setCopied] = useState(false)
  const match = /language-(\w+)/.exec(className || "")
  const language = match ? match[1] : ''

  const handleCopy = async () => {
    await navigator.clipboard.writeText(String(children).replace(/\n$/, ""))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (match) {
    return (
      <div className="relative group my-6">
        {/* Language Badge and Copy Button */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800 rounded-t-xl border-b border-slate-700">
          <Badge 
            variant="secondary" 
            className="bg-slate-700 text-slate-200 border-slate-600 text-xs font-mono"
          >
            {language}
          </Badge>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1 text-xs text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copiar
              </>
            )}
          </button>
        </div>
        
        {/* Code Content */}
        <pre className="bg-slate-900 text-slate-100 p-4 rounded-b-xl overflow-x-auto border-2 border-slate-800 font-mono text-sm leading-relaxed">
          <code className={`language-${language}`}>
            {String(children).replace(/\n$/, "")}
          </code>
        </pre>
      </div>
    )
  }

  return (
    <code 
      className="bg-muted px-2 py-1 rounded-md text-sm font-mono border border-border/50 text-primary" 
      {...props}
    >
      {children}
    </code>
  )
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn("prose prose-lg prose-gray dark:prose-invert max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock,
          h1: ({ children }) => (
            <h1 className="scroll-m-20 text-4xl lg:text-5xl font-bold tracking-tight leading-tight mt-12 mb-8 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="scroll-m-20 text-3xl lg:text-4xl font-bold tracking-tight mt-12 mb-6 pb-4 border-b-2 border-gradient-to-r from-primary/20 to-purple-500/20">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="scroll-m-20 text-2xl lg:text-3xl font-semibold tracking-tight mt-10 mb-4">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="scroll-m-20 text-xl lg:text-2xl font-semibold tracking-tight mt-8 mb-3">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="leading-8 text-lg text-muted-foreground [&:not(:first-child)]:mt-6 mb-6">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="my-6 ml-6 space-y-3">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-6 ml-6 space-y-3 list-decimal">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-lg leading-relaxed text-muted-foreground marker:text-primary">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-8 relative pl-6 py-4">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-purple-500 rounded-full" />
              <div className="italic text-lg text-muted-foreground bg-gradient-to-r from-muted/50 to-muted/20 p-4 rounded-r-lg border-l-0 border border-border/50">
                {children}
              </div>
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-8 overflow-hidden rounded-xl border border-border/50 shadow-sm">
              <table className="w-full border-collapse bg-background">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/50">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left font-semibold text-foreground border-b border-border/50">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-muted-foreground border-b border-border/30">
              {children}
            </td>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-primary hover:text-primary/80 underline underline-offset-4 decoration-2 decoration-primary/30 hover:decoration-primary/60 transition-all duration-200 font-medium"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-foreground">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-foreground">
              {children}
            </em>
          ),
          hr: () => (
            <hr className="my-12 border-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
