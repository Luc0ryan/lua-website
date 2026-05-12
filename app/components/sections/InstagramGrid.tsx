import Link from "next/link";
import Image from "next/image";
import { getInstagramPosts } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export default async function InstagramGrid() {
  const posts = await getInstagramPosts();

  return (
    <section className="w-full max-w-6xl mx-auto px-gutter py-20">
      <div className="grid grid-cols-4 gap-2">
        {posts.map((post) => {
          const imageUrl = urlFor(post.image).width(400).height(400).fit("crop").url();
          const cell = (
            <div className="bg-neutral-200 overflow-hidden relative aspect-square group">
              <Image
                src={imageUrl}
                alt={post.alt ?? "LUA Instagram post"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="absolute top-2 right-2 w-6 h-6 text-white drop-shadow-md"
                fill="currentColor"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.326 3.608 1.301.975.975 1.24 2.242 1.301 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.326 2.633-1.301 3.608-.975.975-2.242 1.24-3.608 1.301-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.326-3.608-1.301-.975-.975-1.24-2.242-1.301-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.326-2.633 1.301-3.608.975-.975 2.242-1.24 3.608-1.301 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.615.073-3.032.4-4.122 1.49C1.84 2.652 1.513 4.07 1.44 5.685 1.382 6.965 1.368 7.373 1.368 12c0 4.627.014 5.035.072 6.315.073 1.615.4 3.032 1.49 4.122 1.09 1.09 2.507 1.417 4.122 1.49 1.28.058 1.688.072 4.948.072s3.667-.014 4.947-.072c1.615-.073 3.032-.4 4.122-1.49 1.09-1.09 1.417-2.507 1.49-4.122.058-1.28.072-1.688.072-4.948s-.014-3.667-.072-4.947c-.073-1.615-.4-3.032-1.49-4.122-1.09-1.09-2.507-1.417-4.122-1.49C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
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
      <div className="mt-4 text-right">
        <Link
          href="https://www.instagram.com/lookinguparts"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-body font-medium text-fg hover:text-[#E8197D] transition-colors"
        >
          Follow us on instagram →
        </Link>
      </div>
    </section>
  );
}
