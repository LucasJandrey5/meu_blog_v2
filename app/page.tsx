
import { prisma } from "@/lib/db"
import { PostCard } from "@/components/post-card"
import { Badge } from "@/components/ui/badge"
import { Code2, BookOpen, Lightbulb, Sparkles, Zap, Target, Award, ArrowDown } from "lucide-react"
import { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Blog Lucas Jandrey - Full Stack Developer Insights",
  description: "Discover practical solutions, tutorials, and insights from Lucas Jandrey, a passionate full stack developer specializing in React, Next.js, Laravel, and modern web development.",
}

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: {
          name: true,
          firstName: true,
          lastName: true,
        }
      }
    },
    orderBy: {
      publishedAt: "desc"
    },
    take: 9
  })

  const featuredPosts = posts?.filter(post => post.featured) ?? []
  const recentPosts = posts?.slice(0, 9) ?? []

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.05),transparent_50%)]" />
        
        <div className="container relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            {/* Logo */}
            <div className="flex items-center justify-center mb-8">
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                <Code2 className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
                Bem-vindo ao meu
                <br />
                <span className="text-primary">Blog</span>
              </h1>
              
              <div className="max-w-4xl mx-auto space-y-4">
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                  Olá, eu sou <strong className="text-foreground font-extrabold">Lucas Jandrey</strong>, 
                  um desenvolvedor full stack apaixonado por criar soluções práticas 
                  com código limpo e arquitetura robusta.
                </p>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Aqui eu compartilho minha jornada, tutoriais e insights sobre 
                  desenvolvimento web moderno, tecnologia e inovação.
                </p>
              </div>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center gap-3 lg:gap-4 mt-12">
              <Badge 
                variant="outline" 
                className="px-4 py-2 text-sm bg-background border-primary/30 hover:bg-primary/10 transition-colors"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Tutoriais Práticos
              </Badge>
              <Badge 
                variant="outline" 
                className="px-4 py-2 text-sm bg-background border-border hover:bg-accent transition-colors"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Estudos de Caso
              </Badge>
              <Badge 
                variant="outline" 
                className="px-4 py-2 text-sm bg-background border-border hover:bg-accent transition-colors"
              >
                <Zap className="h-4 w-4 mr-2" />
                Soluções Inovadoras
              </Badge>
            </div>

            {/* Scroll Indicator */}
            <div className="mt-16">
              <ArrowDown className="h-6 w-6 text-muted-foreground mx-auto animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-20">
        {/* Featured Posts */}
        {featuredPosts?.length > 0 && (
          <section className="space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Award className="h-6 w-6 text-primary" />
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                  Posts em Destaque
                </h2>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Artigos e tutoriais que merecem atenção especial
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* Recent Posts */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                {featuredPosts?.length > 0 ? "Posts Recentes" : "Últimos Posts"}
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {featuredPosts?.length > 0 
                ? "Conteúdo fresco e os mais recentes insights da minha jornada de desenvolvimento"
                : "Soluções práticas, tutoriais e insights da minha jornada de desenvolvimento"
              }
            </p>
          </div>
          
          {recentPosts?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index + (featuredPosts?.length || 0)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 space-y-6">
              <div className="p-6 rounded-xl bg-muted/50 w-fit mx-auto">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold">Ainda não há posts</h3>
              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                Estou trabalhando em conteúdo incrível para compartilhar com você. 
                Volte em breve para tutoriais, insights e estudos de caso sobre desenvolvimento web moderno!
              </p>
            </div>
          )}
        </section>

        {/* About Section */}
        <section className="relative">
          <div className="p-8 lg:p-16 space-y-12 bg-muted/30 border border-border rounded-xl">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Target className="h-6 w-6 text-primary" />
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                  Sobre Mim
                </h2>
              </div>
              <div className="max-w-4xl mx-auto space-y-4">
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                  Sou um desenvolvedor full stack brasileiro de 22 anos com uma jornada única que começou aos 14 
                  anos com desenvolvimento de jogos. Atualmente trabalho na Five Tech e sou apaixonado por criar 
                  soluções práticas que resolvem problemas reais.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Minha experiência abrange React, Next.js, Laravel, AWS e práticas modernas de desenvolvimento web.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              <div className="text-center space-y-4">
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 w-fit mx-auto">
                  <Code2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Código Limpo</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Escrevendo código sustentável e escalável com arquitetura robusta
                </p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="p-4 rounded-xl bg-muted border border-border w-fit mx-auto">
                  <Lightbulb className="h-8 w-8 text-foreground" />
                </div>
                <h3 className="text-xl font-bold">Solucionador de Problemas</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Apaixonado por enfrentar desafios complexos com soluções criativas
                </p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="p-4 rounded-xl bg-muted border border-border w-fit mx-auto">
                  <BookOpen className="h-8 w-8 text-foreground" />
                </div>
                <h3 className="text-xl font-bold">Eterno Aprendiz</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Aprendendo continuamente e compartilhando conhecimento com a comunidade
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
