"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Komponen Pengawal untuk memaksa user baru menyelesaikan Onboarding
 */
export default function OnboardingGuard({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Tunggu sampe session selesai loading
    if (status === "loading") return;

    // 2. Jika user sudah login tapi rolenya ONBOARDING
    if (session?.user?.role === "ONBOARDING") {
      // 3. Jika dia lagi nggak di halaman onboarding, paksa pindah
      if (pathname !== "/onboarding") {
        console.log("[Guard] User is in ONBOARDING state, redirecting...");
        router.push("/onboarding");
      }
    }
    
    // 4. Edge Case: Jika user mencoba buka /onboarding tapi sudah punya role lain
    if (pathname === "/onboarding" && session?.user?.role && session.user.role !== "ONBOARDING") {
        if (session.user.role === "ADMIN") {
            router.push("/admin/dashboard");
        } else {
            router.push("/catalog");
        }
    }

  }, [session, status, pathname, router]);

  return <>{children}</>;
}
