
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypePrism from 'rehype-prism'
import rehypeSlug from 'rehype-slug'

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeSlug)
  .use(rehypePrism)
  .use(rehypeStringify, { allowDangerousHtml: true })

export async function markdownToHtml(markdown: string): Promise<string> {
  try {
    const result = await processor.process(markdown)
    return result.toString()
  } catch (error) {
    console.error('Error processing markdown:', error)
    return markdown
  }
}

export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}
