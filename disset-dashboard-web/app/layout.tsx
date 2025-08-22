import "./globals.css";

export const metadata = {
  title: "Disset Dashboard",
  description: "Tablero financiero Disset",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
