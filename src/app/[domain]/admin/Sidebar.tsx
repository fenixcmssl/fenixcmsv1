"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ tenantName, domain }: { tenantName: string, domain: string }) {
  const pathname = usePathname() || "";

  // Estructura de menú tipo WordPress
  const menuItems = [
    { name: "Dashboard", path: "/admin", exact: true },
    { name: "Catálogo", path: "/admin/products", exact: false },
    { name: "Fenix Import", path: "/admin/fenix-import", exact: false },
    { name: "Pedidos", path: "/admin/orders", exact: false },
    { name: "Clientes", path: "/admin/customers", exact: false },
    { name: "Entradas (Blog)", path: "/admin/posts", exact: false },
    { name: "Páginas", path: "/admin/pages", exact: false },
    { name: "Apariencia", path: "/admin/appearance", exact: false },
    { name: "Plugins", path: "/admin/plugins", exact: false },
    { name: "Ajustes", path: "/admin/settings", exact: false },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0 shrink-0">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-xl font-bold truncate">{tenantName}</h2>
        <p className="text-xs text-slate-400 mt-1">{domain}</p>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          // Detectar si la ruta actual coincide para marcar el botón en azul
          const isActive = item.exact 
            ? pathname.endsWith("/admin") 
            : pathname.includes(item.path);

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`block p-3 rounded-lg font-medium transition-colors ${
                isActive ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <a href="/login" className="block p-3 hover:bg-slate-800 rounded-lg text-red-400 text-center transition-colors">
          Cerrar Sesión
        </a>
      </div>
    </aside>
  );
}
