"use client";

export const runtime = "edge";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getAdminUsers, toggleUserRole, deleteUser, initializeDatabaseInternal } from "@/modules/admin/actions";
import { getCategories, addCategory, deleteCategory } from "@/modules/category/actions";
import { getProducts, createProductWithImage, updateProductStatus, deleteProduct } from "@/modules/product/actions";
import { CheckCircle2, XCircle, LogOut, User, ShieldCheck, ShoppingCart, Store, Trash2, Plus, RefreshCcw, Image as ImageIcon, Check, X, Search } from "lucide-react";

export default function AdminTestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statusText, setStatusText] = useState("Idle");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("mine"); // 'mine', 'pending', 'all'
  const [userSearch, setUserSearch] = useState("");

  // Guest Protection
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  async function fetchAll(searchQuery = "") {
    setLoading(true);
    setStatusText("Fetching data...");
    
    // Check role inside action to avoid stale state in useEffect
    const checkIsAdmin = session?.user?.role === "ADMIN";
    
    const [uRes, pRes, cRes] = await Promise.all([
      checkIsAdmin ? getAdminUsers(searchQuery) : { success: true, data: [] },
      getProducts(checkIsAdmin ? null : session?.user?.id),
      getCategories()
    ]);

    if (uRes.success) setUsers(uRes.data);
    if (pRes.success) setProducts(pRes.data);
    if (cRes.success) setCategories(cRes.data);
    
    setStatusText("Data Refreshed");
    setLoading(false);
  }

  const handleUserSearch = (e) => {
    e.preventDefault();
    fetchAll(userSearch);
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchAll();
    }
  }, [status]);

  async function handleAddCategory(e) {
    e.preventDefault();
    const name = e.target.categoryName.value;
    setLoading(true);
    const res = await addCategory(name);
    alert(res.message || res.error);
    e.target.reset();
    fetchAll();
  }

  async function handleDeleteCategory(id) {
    if (!confirm("Hapus kategori ini?")) return;
    const res = await deleteCategory(id);
    alert(res.message || res.error);
    fetchAll();
  }

  async function handleToggleRole(id, role) {
    const res = await toggleUserRole(id, role);
    alert(res.message || res.error);
    fetchAll();
  }

  async function handleDeleteUser(id) {
    if (!confirm("Hapus user ini?")) return;
    const res = await deleteUser(id);
    alert(res.message || res.error);
    fetchAll();
  }

  async function handleUploadProduct(e) {
    e.preventDefault();
    setLoading(true);
    setStatusText("Uploading to R2 & DB...");
    
    try {
      const formData = new FormData(e.target);
      const imageFile = formData.get("image");
      
      const data = {
          title: formData.get("title"),
          price: formData.get("price"),
          description: formData.get("description"),
          categoryId: formData.get("categoryId"),
          sellerId: isAdmin ? formData.get("sellerId") : session?.user?.id, 
          condition: formData.get("condition") || "GOOD",
          location: formData.get("location") || "IPB Dramaga"
      };

      const res = await createProductWithImage({ 
        formData: data, 
        imageFile, 
        userRole: session?.user?.role 
      });
      
      if (res.success) {
        alert("✅ PROSES BERHASIL!\n" + res.message);
        e.target.reset();
        setStatusText("Upload Success");
        fetchAll();
      } else {
        alert("❌ PROSES GAGAL!\n" + res.error);
        setStatusText("Upload Failed");
      }
    } catch (err) {
      alert("FATAL ERROR: " + err.message);
      setStatusText("System Error");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateStatus(productId, newStatus) {
    setLoading(true);
    const res = await updateProductStatus(productId, newStatus);
    alert(res.message || res.error);
    fetchAll();
  }


  const isAdmin = session?.user?.role === "ADMIN";

  // Filtered Lists
  const myProducts = products.filter(p => p.sellerId === session?.user?.id);
  const pendingQueue = products.filter(p => p.status === "PENDING" && (isAdmin ? p.sellerId !== session?.user?.id : false));
  const allInventory = products;

  const displayedProducts = !isAdmin 
    ? myProducts 
    : (activeTab === "mine" ? myProducts : (activeTab === "pending" ? pendingQueue : allInventory));

  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-indigo-900">Backend Infrastructure Test Panel</h1>
            <p className="text-gray-500">Monitoring & Testing System • Role: <span className="font-bold text-indigo-600">{session?.user?.role || "GUEST"}</span></p>
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
            onClick={() => { setUserSearch(""); fetchAll(""); }}
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 disabled:opacity-50 transition flex items-center gap-2"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Reset & Refresh
          </button>
        </div>

        {!isAdmin && (
          <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded shadow-sm">
            <p className="font-bold">Info: Hak Akses Terbatas</p>
            <p className="text-sm">Akun kamu tidak terdaftar sebagai Admin. Tombol "Force Create Dummy Admin" dan beberapa fitur CRUD lainnya mungkin tidak berfungsi atau tidak ditampilkan.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Users Table (Admin Only) */}
          {isAdmin && (
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1">
              <div className="flex flex-col gap-4 mb-4">
                <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                  <User className="w-5 h-5" /> Users ({users.length})
                </h2>
                <form onSubmit={handleUserSearch} className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="Cari Nama/Email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <button type="submit" className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition">
                    <Search className="w-4 h-4" />
                  </button>
                </form>
              </div>
              <div className="overflow-y-auto max-h-[400px]">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b text-gray-400 uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-2">User</th>
                      <th className="py-3 px-2">Role</th>
                      <th className="py-3 px-2 text-right">Aksi</th>
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
                          <button 
                              onClick={() => handleToggleRole(u.id, u.role)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition hover:opacity-80 ${u.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'}`}
                          >
                            {u.role}
                          </button>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <button onClick={() => handleDeleteUser(u.id)} className="text-gray-400 hover:text-red-500 transition">
                              <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Products & Categories Container */}
          <div className="lg:col-span-2 space-y-8">
              {/* Products Table */}
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <h2 className="text-xl font-bold text-indigo-900">
                    {!isAdmin ? "Your Products" : (
                      activeTab === "mine" ? "Your Products" : 
                      activeTab === "pending" ? "QC Review Queue" : "All System Inventory"
                    )} ({displayedProducts.length})
                  </h2>
                  
                  {isAdmin && (
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                      <button 
                        onClick={() => setActiveTab("mine")}
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${activeTab === 'mine' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        My Products
                      </button>
                      <button 
                        onClick={() => setActiveTab("pending")}
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-2 ${activeTab === 'pending' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        QC Queue {pendingQueue.length > 0 && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                      </button>
                      <button 
                        onClick={() => setActiveTab("all")}
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${activeTab === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Browse All
                      </button>
                    </div>
                  )}
                </div>

                <div className="overflow-x-auto text-sm">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-gray-400 uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-2">Preview</th>
                        <th className="py-3">Title</th>
                        {isAdmin && activeTab !== "mine" && <th className="py-3 font-semibold">Seller</th>}
                        <th className="py-3">Price</th>
                        <th className="py-3">Status</th>
                        <th className="py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedProducts.map(p => (
                        <tr key={p.id} className="border-b hover:bg-gray-50 transition items-center">
                          <td className="py-3 px-2">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center">
                              {p.images && p.images[0] ? (
                                <img src={p.images[0].url} alt={p.title} className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                          </td>
                          <td className="py-3 font-medium text-gray-900">
                            {p.title}
                            <div className="text-[10px] text-gray-400 font-normal">{p.category?.name || "No Category"}</div>
                          </td>
                          {isAdmin && activeTab !== "mine" && (
                            <td className="py-3 text-gray-600">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 uppercase">
                                  {p.seller?.name?.charAt(0) || "?"}
                                </div>
                                <span>{p.seller?.name || "Unknown"}</span>
                              </div>
                            </td>
                          )}
                          <td className="py-3 font-mono">Rp {p.price?.toLocaleString()}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                              p.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                              p.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                             <div className="flex justify-end gap-2">
                                {isAdmin && activeTab === 'pending' && (
                                  <>
                                    <button onClick={() => handleUpdateStatus(p.id, 'APPROVED')} className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition" title="Terima">
                                      <Check className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleUpdateStatus(p.id, 'REJECTED')} className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition" title="Tolak">
                                      <X className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                                {(isAdmin || p.sellerId === session?.user?.id) && (
                                  <button onClick={() => deleteProduct(p.id, session?.user?.id, session?.user?.role).then(fetchAll)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                             </div>
                          </td>
                        </tr>
                      ))}
                      {displayedProducts.length === 0 && (
                        <tr>
                          <td colSpan={isAdmin ? 6 : 5} className="py-12 text-center text-gray-400 italic">
                            Belum ada produk di kategori ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Categories Grid */}
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-wrap gap-2 mb-6">
                  {categories.map(c => (
                    <div key={c.id} className="group relative">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm border border-gray-200 flex items-center gap-2">
                        {c.name}
                        <button onClick={() => handleDeleteCategory(c.id)} className="text-gray-400 hover:text-red-500">
                            <Trash2 className="w-3 h-3" />
                        </button>
                        </span>
                    </div>
                  ))}
                </div>

                {isAdmin && (
                  <form onSubmit={handleAddCategory} className="flex gap-2">
                      <input 
                          name="categoryName" 
                          placeholder="Nama Kategori Baru..." 
                          required
                          className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button type="submit" disabled={loading} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                          <Plus className="w-5 h-5" />
                      </button>
                  </form>
                )}
              </section>

              {/* R2 Image Upload Test */}
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-4 text-indigo-900 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" /> Test R2 Image Upload
                </h2>
                <form onSubmit={handleUploadProduct} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input name="title" placeholder="Nama Produk..." required className="px-3 py-2 text-sm border rounded-lg w-full" />
                        <input name="price" type="number" placeholder="Harga..." required className="px-3 py-2 text-sm border rounded-lg w-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <select name="categoryId" className="px-3 py-2 text-sm border rounded-lg w-full" required>
                            <option value="">Pilih Kategori...</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        {isAdmin ? (
                          <div className="flex flex-col gap-2 w-full">
                            <div className="flex gap-2">
                              <input 
                                type="text"
                                placeholder="Cari Penjual..."
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                                className="flex-1 text-xs px-3 py-2 border rounded-lg outline-none"
                              />
                              <button type="button" onClick={() => fetchAll(userSearch)} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                                <Search className="w-3 h-3" />
                              </button>
                            </div>
                            <select name="sellerId" className="px-3 py-2 text-sm border rounded-lg w-full" required>
                                <option value="">Pilih Penjual ({users.length} ditemukan)...</option>
                                {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                            </select>
                          </div>
                        ) : (
                          <div className="px-3 py-2 text-sm border rounded-lg w-full bg-gray-50 text-gray-500 flex items-center gap-2">
                            <User className="w-4 h-4" /> {session?.user?.name || "Self"} (Locked)
                          </div>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <select name="condition" className="px-3 py-2 text-sm border rounded-lg w-full" required>
                            <option value="NEW">Kondisi: Baru</option>
                            <option value="LIKE_NEW">Kondisi: Like New</option>
                            <option value="GOOD">Kondisi: Bagus</option>
                            <option value="FAIR">Kondisi: Bekas</option>
                        </select>
                        <input name="location" placeholder="Lokasi (Dramaga/Cilibende...)" defaultValue="IPB Dramaga" className="px-3 py-2 text-sm border rounded-lg w-full" />
                    </div>
                    <textarea name="description" placeholder="Deskripsi Lengkap Produk..." className="px-3 py-2 text-sm border rounded-lg w-full h-24" required></textarea>
                    
                    <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl">
                        <p className="text-xs text-gray-400 mb-2 font-bold uppercase">Mock Image (R2 Upload)</p>
                        <input type="file" name="image" accept="image/*" className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                    >
                        {loading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : "Kirim ke R2 & Database"}
                    </button>
                </form>
              </section>
          </div>
        </div>

        <footer className="mt-12 pt-8 border-t text-center text-gray-400 text-xs">
          <p>System: {statusText} | Auth: {status} • Build ID: edge-production-worker</p>
        </footer>
      </div>
    </div>
  );
}

