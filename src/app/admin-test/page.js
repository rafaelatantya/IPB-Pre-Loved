"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { getAdminUsers, getAllProducts, createDummyAdmin, getCategories } from "../../actions";
import { CheckCircle2, XCircle, LogOut, User, ShieldCheck, ShoppingCart, Store } from "lucide-react";

export default function AdminTestPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("Idle");
  const [loading, setLoading] = useState(false);

  async function fetchAll() {
    setLoading(true);
    setStatus("Fetching data...");
    
    const [uRes, pRes, cRes] = await Promise.all([
      getAdminUsers(),
      getAllProducts(),
      getCategories()
    ]);

    if (uRes.success) setUsers(uRes.data);
    if (pRes.success) setProducts(pRes.data);
    if (cRes.success) setCategories(cRes.data);
    
    setStatus("Data Refreshed");
    setLoading(false);
  }

  async function handleCreateAdmin() {
    setStatus("Creating admin...");
    const res = await createDummyAdmin("Super Admin", "admin@apps.ipb.ac.id");
    alert(res.message || res.error);
    fetchAll();
  }

  useEffect(() => {
    fetchAll();
  }, []);

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-indigo-900">Backend Infrastructure Test Panel</h1>
            <p className="text-gray-500">Monitoring & Testing System Role: <span className="font-bold text-indigo-600">{session?.user?.role || "GUEST"}</span></p>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </header>

        {/* Role Detection Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className={`p-4 rounded-xl border-2 flex items-center justify-between ${session ? 'bg-green-50 border-green-200' : 'bg-gray-100 border-gray-200 opacity-50'}`}>
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-bold text-green-900">Status Pembeli</p>
                <p className="text-xs text-green-700">Akses Belanja Tersedia</p>
              </div>
            </div>
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>

          <div className={`p-4 rounded-xl border-2 flex items-center justify-between ${session ? 'bg-green-50 border-green-200' : 'bg-gray-100 border-gray-200 opacity-50'}`}>
            <div className="flex items-center gap-3">
              <Store className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-bold text-green-900">Status Penjual</p>
                <p className="text-xs text-green-700">Akses Jualan Tersedia</p>
              </div>
            </div>
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>

          <div className={`p-4 rounded-xl border-2 flex items-center justify-between ${isAdmin ? 'bg-indigo-50 border-indigo-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center gap-3">
              <ShieldCheck className={`w-6 h-6 ${isAdmin ? 'text-indigo-600' : 'text-red-400'}`} />
              <div>
                <p className={`font-bold ${isAdmin ? 'text-indigo-900' : 'text-red-900'}`}>Status Admin</p>
                <p className={`text-xs ${isAdmin ? 'text-indigo-700' : 'text-red-700'}`}>{isAdmin ? 'Akses CRUD Backend' : 'Akses Dibatasi'}</p>
              </div>
            </div>
            {isAdmin ? <CheckCircle2 className="w-6 h-6 text-indigo-600" /> : <XCircle className="w-6 h-6 text-red-400" />}
          </div>
        </div>
        
        <div className="flex gap-4 mb-8">
          <button 
            onClick={fetchAll}
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>
          
          {isAdmin && (
            <button 
              onClick={handleCreateAdmin}
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
            >
              Force Create Dummy Admin
            </button>
          )}
        </div>

        {!isAdmin && (
          <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded shadow-sm">
            <p className="font-bold">Info: Hak Akses Terbatas</p>
            <p className="text-sm">Akun kamu tidak terdaftar sebagai Admin. Tombol "Force Create Dummy Admin" dan beberapa fitur CRUD lainnya mungkin tidak berfungsi atau tidak ditampilkan.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Users Table */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1">
            <h2 className="text-xl font-bold mb-4 text-indigo-900 flex items-center gap-2">
              <User className="w-5 h-5" /> Users ({users.length})
            </h2>
            <div className="overflow-y-auto max-h-[400px]">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b text-gray-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-2">User</th>
                    <th className="py-3 px-2">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b hover:bg-indigo-50/30 transition">
                      <td className="py-3 px-2">
                        <div className="font-medium text-gray-900">{u.name}</div>
                        <div className="text-[10px] text-gray-500">{u.email}</div>
                      </td>
                      <td className="py-3 px-2">
                         <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'}`}>
                           {u.role}
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Products & Categories Container */}
          <div className="lg:col-span-2 space-y-8">
              {/* Products Table */}
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-4 text-indigo-900">Products ({products.length})</h2>
                <div className="overflow-x-auto text-sm">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-gray-400 uppercase text-[10px] tracking-wider">
                        <th className="py-3">Title</th>
                        <th className="py-3 font-semibold">Seller</th>
                        <th className="py-3">Price</th>
                        <th className="py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p.id} className="border-b hover:bg-indigo-50/30 transition">
                          <td className="py-3 font-medium text-gray-900">{p.title}</td>
                          <td className="py-3 text-gray-600">{p.seller?.name || "Unknown"}</td>
                          <td className="py-3 font-mono">Rp {p.price?.toLocaleString()}</td>
                          <td className="py-3">
                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-[10px] font-bold uppercase">{p.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Categories Grid */}
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-4 text-indigo-900">Categories ({categories.length})</h2>
                <div className="flex flex-wrap gap-2">
                  {categories.map(c => (
                    <span key={c.id} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm border border-gray-200">
                      {c.name}
                    </span>
                  ))}
                </div>
              </section>
          </div>
        </div>

        <footer className="mt-12 pt-8 border-t text-center text-gray-400 text-xs">
          <p>Status: {status} • Build ID: edge-production-worker</p>
        </footer>
      </div>
    </div>
  );
}

