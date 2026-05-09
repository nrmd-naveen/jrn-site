import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col font-sans overflow-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col overflow-y-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
}
