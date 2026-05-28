import type { Metadata } from "next";
import ContactForm from "../components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Looking Up Arts",
  description:
    "Get in touch with Looking Up Arts. Request our full art deck and start a conversation.",
};

export default function ContactPage() {
  // To use a Sanity-managed image, fetch the contactPage document here and pass
  // the image field as the `sanityImage` prop:
  //
  //   const data = await client.fetch(`*[_type == "contactPage"][0]{ image }`)
  //   return <ContactForm sanityImage={data?.image} />
  //
  return <ContactForm />;
}
