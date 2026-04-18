"use client";

export default function SearchBar() {
  return (
    <form className="w-full relative" onSubmit={(e) => e.preventDefault()}>
      <input 
        type="text" 
        placeholder="Cari barang..." 
        className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button type="submit" className="absolute right-2 top-1.5 bg-green-500 text-white px-4 py-1 rounded-full text-sm hover:bg-green-600 transition-colors">
        Cari
      </button>
    </form>
  );
}
