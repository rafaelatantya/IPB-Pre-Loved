import './globals.css';

export const metadata = {
  title: 'IPB Pre-Loved',
  description: 'Marketplace barang secondhand untuk mahasiswa IPB',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}
