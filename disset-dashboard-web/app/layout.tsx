import "./globals.css";

export const metadata = { title: "Disset Dashboard", description: "Tablero financiero Disset" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen">
        <div className="w-full bg-white border-b p-3 flex justify-between items-center">
          <div className="font-semibold">Disset Dashboard</div>
          <a className="text-sm border rounded-lg px-3 py-1 hover:bg-gray-50" href="/api/logout">
            Cerrar sesión
          </a>
        </div>
        {children}
      </body>
    </html>
  );
}
