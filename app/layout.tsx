import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ClientHeader } from "@/components/client-header";
import { Footer } from "@/components/footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blog Lucas Jandrey - Full Stack Developer",
  description:
    "Personal blog of Lucas Jandrey, a passionate full stack developer sharing insights on React, Next.js, Laravel, AWS and modern web development.",
  keywords: [
    "Lucas Jandrey",
    "Full Stack Developer",
    "React",
    "Next.js",
    "Laravel",
    "AWS",
    "Web Development",
    "JavaScript",
    "TypeScript",
  ],
  authors: [{ name: "Lucas Jandrey", url: "https://lucasjandrey.com.br" }],
  creator: "Lucas Jandrey",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://blog.lucasjandrey.com.br",
    title: "Blog Lucas Jandrey - Full Stack Developer",
    description:
      "Personal blog of Lucas Jandrey, sharing insights on web development, tutorials, and project case studies.",
    siteName: "Blog Lucas Jandrey",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Lucas Jandrey - Full Stack Developer",
    description:
      "Personal blog of Lucas Jandrey, sharing insights on web development.",
    creator: "@lucasjandrey",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers session={session}>
          <div className="min-h-screen bg-background flex flex-col">
            <ClientHeader />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
