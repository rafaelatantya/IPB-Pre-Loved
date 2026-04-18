import { Laptop, Shirt, BookOpen, Home, Ticket, LayoutGrid } from 'lucide-react';

const categories = [
  { name: 'ELEKTRONIK', icon: <Laptop size={28} strokeWidth={1.5} /> },
  { name: 'FASHION', icon: <Shirt size={28} strokeWidth={1.5} /> },
  { name: 'BUKU', icon: <BookOpen size={28} strokeWidth={1.5} /> },
  { name: 'KOS', icon: <Home size={28} strokeWidth={1.5} /> },
  { name: 'TIKET', icon: <Ticket size={28} strokeWidth={1.5} /> },
  { name: 'JASA / LAIN', icon: <LayoutGrid size={28} strokeWidth={1.5} /> },
];

export default function PopularCategories() {
  return (
    <section className="py-20 bg-[#f8fbf9]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Kategori Populer</h2>
        <p className="text-gray-500 text-sm mb-8">Temukan apa yang kamu butuhkan dengan cepat</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-white rounded-2xl aspect-square flex flex-col items-center justify-center p-4 cursor-pointer hover:shadow-md transition-shadow group">
              <div className="text-gray-800 mb-4 group-hover:text-green-700 transition-colors">
                {cat.icon}
              </div>
              <span className="text-[10px] font-bold tracking-widest text-gray-600">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
