import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getInstagramPosts } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

function sanitizeInstagramUrl(url: string): string {
  const clean = new URL(url);
  return `${clean.origin}${clean.pathname}`;
}

export default async function InstagramGrid() {
  const posts = await getInstagramPosts();

  return (
    <section className="w-full max-w-screen-2xl mx-auto px-gutter pt-10 pb-20">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {posts.map((post) => {
          const imageUrl = urlFor(post.image).url();
          const cell = (
            <div className="bg-neutral-200 overflow-hidden relative aspect-square group">
              <Image
                src={imageUrl}
                alt={post.alt ?? "LUA Instagram post"}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 50vw, 281px"
              />
              <Image
                src="/Instagram_Glyph_White.svg"
                alt=""
                aria-hidden
                width={24}
                height={24}
                className="absolute top-2 right-2 drop-shadow-md"
              />
            </div>
          );

          return post.postUrl ? (
            <Link
              key={post._id}
              href={sanitizeInstagramUrl(post.postUrl)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {cell}
            </Link>
          ) : (
            <div key={post._id}>{cell}</div>
          );
        })}
      </div>
      <div className="mt-10 text-right">
        <Link
          href="https://www.instagram.com/lookinguparts"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl font-body font-medium text-fg group/cta"
        >
          <span className="group-hover/cta:underline">Follow us on instagram</span>
          <ArrowRight className="inline-block ml-2 transition-transform duration-200 ease-out group-hover/cta:translate-x-1" size={22} strokeWidth={1.5} />
        </Link>
      </div>
    </section>
  );
}
