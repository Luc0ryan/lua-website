import SiteNav from "../components/SiteNav";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      {/* pt-28 clears the nav's rendered height (~105px) plus a small gap */}
      <div className="pt-28">
        {children}
      </div>
      <Footer />
      <BackToTop />
    </>
  );
}
