import SiteNav from "../components/SiteNav";
import Footer from "../components/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <div className="pt-2">
        {children}
      </div>
      <Footer />
    </>
  );
}
