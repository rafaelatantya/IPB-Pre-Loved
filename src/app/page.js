import Link from "next/link";
import { User, ShieldCheck, LogOut, ArrowRight } from "lucide-react";
import { getAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/auth/LogoutButton"; // Kita butuh client component buat logout

export default async function Home() {
  const auth = await getAuth();
  const session = await auth();

  // Guard: Harus login
  if (!session) {
    redirect("/login");
  }

  // Guard: Harus beres onboarding
  if (session?.user?.role === "ONBOARDING") {
    redirect("/onboarding");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8 text-center">
      <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
        Strictly IPB University Access
      </div>

      <h1 className="text-6xl font-black text-indigo-950 mb-2 tracking-tight">IPB Pre-Loved</h1>
      <p className="text-xl text-indigo-700/70 mb-10 font-medium max-w-md mx-auto">
        Platform jual-beli barang bekas khusus civitas akademika IPB.
      </p>
      
      {session?.user && (
        <div className="mb-10 w-full max-w-sm bg-white rounded-3xl shadow-xl shadow-indigo-100 border border-indigo-50 p-8 text-left relative overflow-hidden transition hover:shadow-2xl hover:shadow-indigo-200 group">
          {/* Accent Header */}
          <div className={`absolute top-0 left-0 w-full h-2 ${session.user.role === 'ADMIN' ? 'bg-indigo-600' : 'bg-emerald-500'}`}></div>
          
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Current Session</p>
              <h2 className="text-xl font-bold text-gray-900 truncate max-w-[200px]">{session.user.name}</h2>
              <p className="text-sm text-gray-500 font-mono">{session.user.email}</p>
            </div>
            <div className={`p-3 rounded-2xl ${session.user.role === 'ADMIN' ? 'bg-indigo-50' : 'bg-emerald-50'}`}>
              {session.user.role === 'ADMIN' ? (
                <ShieldCheck className="w-6 h-6 text-indigo-600" />
              ) : (
                <User className="w-6 h-6 text-emerald-600" />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
               <span className="text-xs font-bold text-gray-500 uppercase">System Role</span>
               <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-tighter shadow-sm ${
                 session.user.role === 'ADMIN' 
                 ? 'bg-indigo-600 text-white' 
                 : 'bg-emerald-100 text-emerald-700'
               }`}>
                 {session.user.role || 'USER'}
               </span>
            </div>
          </div>

          <LogoutButton />
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md">
        <Link 
          href="/admin-test" 
          className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-indigo-900 text-white font-bold rounded-2xl shadow-2xl hover:bg-indigo-800 transition transform hover:scale-[1.02] active:scale-95 group"
        >
          Masuk Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
        </Link>
      </div>

      <footer className="mt-20 text-gray-300 text-[10px] uppercase tracking-[0.3em] font-medium">
        Kelompok 5 R3 • IPB University
      </footer>
    </div>
  );
}
