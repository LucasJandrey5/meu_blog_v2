
import { Heart, Github, Linkedin, Mail, Code2, ExternalLink, Sparkles } from "lucide-react"
import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative mt-32">
      {/* Main Footer Content */}
      <div className="border-t border-border bg-muted/30">
        <div className="container max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <Code2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Lucas Jandrey
                </h3>
              </div>
              
              <p className="text-muted-foreground leading-relaxed max-w-md">
                Desenvolvedor Full Stack brasileiro apaixonado por criar soluções práticas 
                com código limpo e arquitetura robusta. Compartilhando conhecimento e 
                experiências através de conteúdo de qualidade.
              </p>

              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Code2 className="h-4 w-4 text-primary" />
                <span>Construindo o futuro, uma linha de código por vez</span>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Links Rápidos</h4>
              <div className="flex flex-col space-y-3">
                <Link 
                  href="/" 
                  className="text-muted-foreground hover:text-primary transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    Home
                  </span>
                </Link>
                <Link 
                  href="https://lucasjandrey.com.br" 
                  target="_blank"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    Portfólio
                  </span>
                  <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                </Link>
                <Link 
                  href="mailto:lucas@lucasjandrey.com.br"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    Contato
                  </span>
                </Link>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Conecte-se</h4>
              <div className="flex flex-col space-y-4">
                <Link 
                  href="https://github.com/lucasjandrey" 
                  target="_blank"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-muted/60 border border-border group-hover:bg-accent transition-colors">
                    <Github className="h-4 w-4" />
                  </div>
                  <span className="text-sm">GitHub</span>
                  <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                </Link>
                
                <Link 
                  href="https://linkedin.com/in/lucasjandrey" 
                  target="_blank"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-muted/60 border border-border group-hover:bg-accent transition-colors">
                    <Linkedin className="h-4 w-4" />
                  </div>
                  <span className="text-sm">LinkedIn</span>
                  <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                </Link>
                
                <Link 
                  href="mailto:lucas@lucasjandrey.com.br"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-muted/60 border border-border group-hover:bg-accent transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="text-sm">E-mail</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-border">
          <div className="container max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>© {currentYear} Lucas Jandrey. Todos os direitos reservados.</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Feito com</span>
                <Heart className="h-4 w-4 text-red-500 fill-current" />
                <span>e</span>
                <Code2 className="h-4 w-4 text-primary" />
                <span>em São Paulo, Brasil</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
