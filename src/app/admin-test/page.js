"use client";

import { useState, useEffect } from "react";
import { getAdminUsers, getAllProducts, createDummyAdmin, getCategories } from "../../actions";

export default function AdminTestPage() {
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

  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-indigo-900">Backend Infrastructure Test Panel</h1>
      
      <div className="flex gap-4 mb-8">
        <button 
          onClick={fetchAll}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh Data"}
        </button>
        <button 
          onClick={handleCreateAdmin}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Create Dummy Admin (@apps.ipb.ac.id)
        </button>
      </div>

      <p className="mb-4 text-sm font-mono text-gray-500">Status: {status}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Users Table */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Users ({users.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b">
                    <td className="py-2">{u.name}</td>
                    <td className="py-2">{u.email}</td>
                    <td className="py-2">
                       <span className={`px-2 py-1 rounded text-xs ${u.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                         {u.role}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Categories Table */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Categories ({categories.length})</h2>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {categories.map(c => <li key={c.id}>{c.name} ({c.slug})</li>)}
          </ul>
        </section>

        {/* Products Table */}
        <section className="bg-white p-6 rounded-lg shadow md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Products ({products.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Title</th>
                  <th className="py-2">Seller</th>
                  <th className="py-2">Price</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b">
                    <td className="py-2">{p.title}</td>
                    <td className="py-2">{p.seller?.name || "Unknown"}</td>
                    <td className="py-2">Rp {p.price?.toLocaleString()}</td>
                    <td className="py-2">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
