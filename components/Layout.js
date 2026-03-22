import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#fdfcf8] text-brand-black">
      <Navbar />
      <main className="pt-24 md:pt-28">{children}</main>
      <Footer />
    </div>
  );
}
