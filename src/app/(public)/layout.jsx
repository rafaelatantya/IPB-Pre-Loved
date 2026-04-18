import Navbar from '@/components/layouts/Navbar';
import Footer from '@/components/layouts/Footer';

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
