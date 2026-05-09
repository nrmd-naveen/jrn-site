import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col font-sans overflow-hidden">
      <Navbar isAdmin={true} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
      <Footer />
    </div>
  );
}
