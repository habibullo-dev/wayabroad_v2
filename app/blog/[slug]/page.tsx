import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { BLOG_POSTS, getBlogPost } from "@/lib/data/blog";

type Params = { params: { slug: string } };

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = getBlogPost(params.slug);
  if (!post) return { title: "Guide" };
  return { title: post.title, description: post.excerpt };
}

function formatDate(date: string | null): string | null {
  if (!date) return null;
  const d = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function BlogPostPage({ params }: Params) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link
        href="/blog"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← All guides
      </Link>

      <header className="mt-3">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {post.title}
        </h1>
        {post.date && (
          <p className="mt-2 text-sm text-muted-foreground">
            {formatDate(post.date)}
          </p>
        )}
      </header>

      <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-xl border border-border">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          sizes="(min-width: 768px) 42rem, 100vw"
          className="object-cover"
        />
      </div>

      <p className="mt-8 whitespace-pre-line text-base leading-relaxed text-foreground/90">
        {post.content}
      </p>

      {post.hashtags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-1.5 border-t border-border/60 pt-6">
          {post.hashtags.map((tag) => (
            <Badge key={tag} variant="muted">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </article>
  );
}
