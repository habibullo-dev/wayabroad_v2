import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getBlogPosts } from "@/lib/data/blog";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Guides to studying in South Korea: choosing universities, applying as an international student, English-taught majors, and more.",
};

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

export default function BlogIndexPage() {
  const posts = getBlogPosts();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Guides to studying in Korea
        </h1>
        <p className="mt-1 text-muted-foreground">
          Practical reads on choosing a university, applying, and what to
          expect.
        </p>
      </header>

      <ul className="grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Card className="flex h-full flex-col overflow-hidden p-0 transition-colors group-hover:border-primary/40">
                <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-border">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(min-width: 640px) 32rem, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  {post.date && (
                    <p className="text-xs text-muted-foreground">
                      {formatDate(post.date)}
                    </p>
                  )}
                  <h2 className="font-display text-lg font-semibold leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {post.excerpt}
                  </p>
                  {post.hashtags.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                      {post.hashtags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="muted">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
