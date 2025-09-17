"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import {
  User,
  Home,
  BookOpen,
  Settings,
  LogIn,
  Code2,
  Terminal,
} from "lucide-react";

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession() || {};

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center space-x-3 font-bold text-xl hover:text-primary transition-colors"
          >
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Terminal className="h-6 w-6 text-primary" />
            </div>
            <span className="text-foreground font-extrabold">
              Lucas Jandrey
            </span>
          </Link>
          <nav className="flex items-center space-x-2">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
        scrolled
          ? "bg-background/98 backdrop-blur-xl shadow-sm"
          : "bg-background/95 backdrop-blur-sm"
      }`}
    >
      <div className="container max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center space-x-3 font-bold text-xl hover:text-primary transition-colors group"
        >
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
            <Terminal className="h-6 w-6 text-primary" />
          </div>
          <span className="text-foreground font-extrabold">Lucas Jandrey</span>
        </Link>

        <nav className="flex items-center space-x-2">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 hover:bg-accent"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </Link>

          {session?.user ? (
            <Link href="/admin">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 hover:bg-accent"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </Link>
          ) : (
            <Link href="/admin/login">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            </Link>
          )}

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
