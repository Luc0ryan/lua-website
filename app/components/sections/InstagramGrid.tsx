import Link from "next/link";
import Image from "next/image";
import { getInstagramPosts } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export default async function InstagramGrid() {
  const posts = await getInstagramPosts();

  return (
    <section className="w-full max-w-6xl mx-auto px-gutter pt-10 pb-20">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {posts.map((post) => {
          const imageUrl = urlFor(post.image).width(400).height(400).fit("crop").url();
          const cell = (
            <div className="bg-neutral-200 overflow-hidden relative aspect-square group">
              <Image
                src={imageUrl}
                alt={post.alt ?? "LUA Instagram post"}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 50vw, 25vw"
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
              href={post.postUrl}
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
          className="text-2xl font-body font-medium text-fg hover:text-[#E8197D] transition-colors"
        >
          Follow us on instagram →
        </Link>
      </div>
    </section>
  );
}
