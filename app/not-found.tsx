import Link from "next/link";
import SiteNav from "./components/SiteNav";
import Footer from "./components/Footer";
import { Heading } from "@/app/components/ui/Heading";

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main className="flex-1 pt-28">
        <div className="mx-auto max-w-screen-2xl px-gutter py-24">
          <Heading as="h1" level="display" weight="medium" className="text-fg">
            PAGE NOT FOUND
          </Heading>
          <p className="mt-4 max-w-prose font-sans text-lg text-fg">
            That page doesn&apos;t exist, or the work has moved.
          </p>
          <Link
            href="/projects"
            className="mt-8 inline-block border-2 border-fg bg-fg px-5 py-3 font-sans text-lg text-bg transition-colors hover:border-lua-pink hover:bg-lua-pink"
          >
            See the work
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
