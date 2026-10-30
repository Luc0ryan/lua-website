import type { Metadata } from "next";
import ContactForm from "@/app/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Looking Up Arts",
  description:
    "Get in touch with Looking Up Arts. Request our full art deck and start a conversation.",
};

type Props = { searchParams: Promise<{ title?: string | string[] }> };

// The URL is read here on the server, not with useSearchParams() in the form.
// That hook makes Next skip server-rendering everything up to the nearest
// <Suspense>, which left this page blank until JavaScript loaded.
export default async function ContactPage({ searchParams }: Props) {
  const { title } = await searchParams;
  const pieceTitle = (Array.isArray(title) ? title[0] : title)?.slice(0, 200) || undefined;

  // To use a Sanity-managed image, fetch the contactPage document here and pass
  // the image field as the `sanityImage` prop:
  //
  //   const data = await client.fetch(`*[_type == "contactPage"][0]{ image }`)
  //   return <ContactForm sanityImage={data?.image} pieceTitle={pieceTitle} />
  //
  return <ContactForm pieceTitle={pieceTitle} />;
}
