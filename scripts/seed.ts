import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin users
  const hashedPassword = await bcryptjs.hash("admin123", 12);
  const hashedTestPassword = await bcryptjs.hash("lucas1234", 12);

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@lucasjandrey.com" },
    update: {},
    create: {
      email: "admin@lucasjandrey.com",
      password: hashedPassword,
      firstName: "Lucas",
      lastName: "Jandrey",
      name: "Lucas Jandrey",
      role: "admin",
    },
  });

  // Sample blog posts
  const samplePosts = [
    {
      title: "Building Modern Web Applications with Next.js and React",
      slug: "building-modern-web-apps-nextjs-react",
      summary:
        "Learn how to create scalable and performant web applications using Next.js 14, React 18, and modern development practices.",
      content: `# Building Modern Web Applications with Next.js and React

Welcome to my first blog post! 🚀 Today, I want to share my insights on building modern web applications using Next.js and React.

## Why Next.js?

Next.js has become my go-to framework for building web applications because of its incredible developer experience and powerful features:

- **Server-Side Rendering (SSR)** for better SEO and performance
- **Static Site Generation (SSG)** for blazing-fast loading times
- **API Routes** for building full-stack applications
- **Built-in optimizations** like automatic code splitting

## Key Features I Love

### 1. File-Based Routing

Next.js uses a file-based routing system that makes navigation intuitive:

\`\`\`javascript
// pages/about.js automatically creates /about route
export default function About() {
  return <div>About Page</div>
}
\`\`\`

### 2. Image Optimization

The Next.js Image component automatically optimizes images:

\`\`\`jsx
import Image from 'next/image'

function MyComponent() {
  return (
    <Image
      src="/profile.jpg"
      alt="Profile"
      width={500}
      height={300}
      priority
    />
  )
}
\`\`\`

## Best Practices

1. **Use TypeScript** for better development experience
2. **Implement proper SEO** with metadata API
3. **Optimize performance** with lazy loading and code splitting
4. **Follow accessibility guidelines** for inclusive design

## Conclusion

Next.js continues to evolve and remains one of the best choices for building modern web applications. Its combination of performance, developer experience, and built-in optimizations make it perfect for projects of any size.

What's your experience with Next.js? I'd love to hear your thoughts!`,
      published: true,
      featured: true,
      tags: [
        "Next.js",
        "React",
        "Web Development",
        "JavaScript",
        "Performance",
      ],
      readTime: 5,
    },
    {
      title: "Clean Code Principles Every Developer Should Know",
      slug: "clean-code-principles-every-developer",
      summary:
        "Explore essential clean code principles that will make your code more maintainable, readable, and professional.",
      content: `# Clean Code Principles Every Developer Should Know

As developers, we spend more time reading code than writing it. That's why writing clean, maintainable code is crucial for both personal and team success.

## What is Clean Code?

Clean code is code that is easy to read, understand, and modify. It follows consistent patterns and conventions that make it predictable and maintainable.

## Essential Principles

### 1. Meaningful Names

Choose descriptive names for variables, functions, and classes:

\`\`\`javascript
// ❌ Bad
const d = new Date()
const u = users.filter(x => x.a > 18)

// ✅ Good  
const currentDate = new Date()
const adultUsers = users.filter(user => user.age > 18)
\`\`\`

### 2. Functions Should Be Small

Keep functions focused on a single responsibility:

\`\`\`javascript
// ❌ Bad - doing too many things
function processUserData(user) {
  // validate user
  if (!user.email) throw new Error('Email required')
  
  // format user
  user.name = user.name.trim().toLowerCase()
  
  // save to database
  database.save(user)
  
  // send email
  emailService.sendWelcome(user.email)
}

// ✅ Good - single responsibility
function validateUser(user) {
  if (!user.email) throw new Error('Email required')
}

function formatUser(user) {
  return {
    ...user,
    name: user.name.trim().toLowerCase()
  }
}
\`\`\`

### 3. Avoid Deep Nesting

Use early returns to reduce nesting:

\`\`\`javascript
// ❌ Bad
function processOrder(order) {
  if (order) {
    if (order.items.length > 0) {
      if (order.user.isActive) {
        // process order
        return processPayment(order)
      }
    }
  }
  return null
}

// ✅ Good
function processOrder(order) {
  if (!order) return null
  if (order.items.length === 0) return null
  if (!order.user.isActive) return null
  
  return processPayment(order)
}
\`\`\`

## Benefits of Clean Code

- **Easier maintenance** and debugging
- **Faster development** for new features
- **Better collaboration** with team members
- **Reduced technical debt**

## Conclusion

Writing clean code is a skill that improves with practice. Start applying these principles in your daily coding, and you'll notice the difference in code quality and team productivity.

Remember: code is written once but read many times. Make it count! 💪`,
      published: true,
      featured: false,
      tags: [
        "Clean Code",
        "Best Practices",
        "JavaScript",
        "Programming",
        "Software Development",
      ],
      readTime: 6,
    },
    {
      title: "My Journey from Civil Engineering to Software Development",
      slug: "journey-civil-engineering-to-software-development",
      summary:
        "The story of how I transitioned from studying civil engineering to becoming a passionate full-stack developer.",
      content: `# My Journey from Civil Engineering to Software Development

Every developer has a unique story of how they got into programming. Today, I want to share mine – a journey that took me from civil engineering to discovering my true passion in software development.

## The Beginning 🏗️

I started my academic journey studying civil engineering, fascinated by the idea of building bridges and skyscrapers. The logical thinking and problem-solving aspects of engineering appealed to me, but something was missing.

## The First Spark ⚡

At age 14, I discovered game development with C# and Unity. What started as a curiosity about how video games were made quickly became an obsession. I spent countless hours learning:

- **C# programming fundamentals**
- **Unity game engine**
- **Game design principles**
- **Object-oriented programming**

## The Transition Period 🔄

While studying civil engineering, I couldn't shake the feeling that my heart was elsewhere. The more I learned about software development, the more I realized this was my true calling.

### Key Moments:

1. **First successful game prototype** - The rush of seeing my code come to life
2. **Learning web technologies** - Discovering React, JavaScript, and modern web development
3. **Building real-world projects** - Moving from tutorials to actual applications

## Making the Switch 🎯

The decision to switch from Control & Automation Engineering at IFSC to Software Engineering at Uninter wasn't easy, but it was necessary. I realized I wanted to build digital solutions that could impact millions of users.

## Current Tech Stack

Today, I work with modern technologies that I'm passionate about:

- **Frontend**: React, Next.js, TypeScript, TailwindCSS
- **Backend**: Laravel, PHP, Node.js
- **Database**: MySQL, PostgreSQL
- **Cloud**: AWS, Docker
- **Tools**: Git, GitHub, VS Code

## Lessons Learned 📚

1. **Follow your passion** - Life's too short to work on things that don't excite you
2. **Embrace continuous learning** - Technology evolves rapidly; adaptability is key
3. **Build real projects** - Nothing beats hands-on experience
4. **Join the community** - The developer community is incredibly supportive

## Current Role 💼

Now I work as a Full Stack Developer at Five Tech, a startup focused on procurement and bidding management. I love the fast-paced environment and the opportunity to solve real business problems with code.

## Advice for Career Changers 🌟

If you're considering a similar transition:

- **Start with small projects** to build confidence
- **Don't be afraid of tutorials** – they're stepping stones
- **Practice consistently** – even 30 minutes a day makes a difference
- **Connect with other developers** – networking is invaluable
- **Be patient with yourself** – everyone learns at their own pace

## Conclusion

My journey from civil engineering to software development taught me that it's never too late to pursue your passion. The analytical thinking from engineering actually helps in programming – problems need solutions, whether they're in concrete or in code.

What's your development story? I'd love to hear about your journey in the comments below!`,
      published: true,
      featured: true,
      tags: [
        "Career Change",
        "Personal Story",
        "Software Development",
        "Journey",
        "Motivation",
      ],
      readTime: 8,
    },
  ];

  // Create sample posts
  for (const postData of samplePosts) {
    await prisma.post.upsert({
      where: { slug: postData.slug },
      update: {},
      create: {
        ...postData,
        publishedAt: new Date(),
        authorId: adminUser.id,
      },
    });
  }

  console.log("✅ Database seeded successfully!");
  console.log(`📝 Created ${samplePosts.length} sample posts`);
  console.log(`👤 Created admin user: ${adminUser.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
