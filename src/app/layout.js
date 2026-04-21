import "./globals.css";
import AuthContext from "./AuthContext";


export const metadata = {
  title: 'IPB Pre-Loved',
  description: 'Platform Jual Beli Barang Bekas Mahasiswa IPB',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <AuthContext>
          <main>{children}</main>
        </AuthContext>
      </body>
    </html>
  )
}

