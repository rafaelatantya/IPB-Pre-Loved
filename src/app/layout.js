import "./globals.css";
import AuthContext from "./AuthContext";
import OnboardingGuard from "@/components/auth/OnboardingGuard";


export const metadata = {
  title: 'IPB Pre-Loved',
  description: 'Platform Jual Beli Barang Bekas Mahasiswa IPB',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <AuthContext>
          <OnboardingGuard>
            <main>{children}</main>
          </OnboardingGuard>
        </AuthContext>
      </body>
    </html>
  )
}

