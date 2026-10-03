import type { FaqItem } from "@/app/components/ui/FaqList";

const EMAIL = "info@lookingup.art";
// TODO(Sri): verify this is the exact legal name on file with the IRS.
const LEGAL_NAME = "Looking Up Arts Foundation";
const EIN = "82-5362991";

const linkClass = "underline underline-offset-2 hover:text-lua-pink transition-colors";

const Email = () => (
  <a href={`mailto:${EMAIL}`} className={linkClass}>
    {EMAIL}
  </a>
);

export const DONATE_FAQS: FaqItem[] = [
  {
    question: "Are donations tax-deductible?",
    answer: (
      <p>
        Yes. {LEGAL_NAME} is a registered 501(c)(3) nonprofit, EIN {EIN}. Gifts are
        tax-deductible to the full extent allowed by law, and online gifts get an
        emailed receipt.
      </p>
    ),
  },
  {
    question: "Can I donate by check?",
    answer: (
      <p>
        Yes. Make checks payable to <strong>{LEGAL_NAME}</strong> and mail them to{" "}
        <strong>1333 Minna St, San Francisco, CA 94103</strong>.
      </p>
    ),
  },
  {
    question: "Can I give through a donor-advised fund?",
    answer: (
      <p>
        Yes. Recommend a grant to <strong>{LEGAL_NAME}</strong>, EIN{" "}
        <strong>{EIN}</strong>. If your DAF sponsor needs anything else, email <Email />.
      </p>
    ),
  },
  {
    question: "Can I donate stock or securities?",
    answer: (
      <p>
        Yes, and giving appreciated stock directly can be more tax-efficient than
        selling it first. Email <Email /> and we&apos;ll send transfer details for
        your broker.
      </p>
    ),
  },
  {
    question: "Will my employer match my gift?",
    answer: (
      <p>
        Many employers match charitable gifts. Check with your HR team, and send any
        matching forms to <Email />.
      </p>
    ),
  },
];
