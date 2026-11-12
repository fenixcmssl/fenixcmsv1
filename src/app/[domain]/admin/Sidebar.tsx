"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ tenantName, domain, activePlugins }: { tenantName: string, domain: string, activePlugins: string[] }) {
  const pathname = usePathname() || "";

  // Estructura de menú con requisito de plugin
  const menuItems = [
    { name: "Dashboard", path: "/admin", exact: true, requiredPlugin: null },
    { name: "Catálogo", path: "/admin/products", exact: false, requiredPlugin: null },
    { name: "Fenix Import", path: "/admin/fenix-import", exact: false, requiredPlugin: "Fenix Import Pro" },
    { name: "Pedidos", path: "/admin/orders", exact: false, requiredPlugin: null },
    { name: "Clientes", path: "/admin/customers", exact: false, requiredPlugin: null },
    { name: "Entradas (Blog)", path: "/admin/posts", exact: false, requiredPlugin: null },
    { name: "Páginas", path: "/admin/pages", exact: false, requiredPlugin: null },
    { name: "Apariencia", path: "/admin/appearance", exact: false, requiredPlugin: null },
    { name: "Plugins", path: "/admin/plugins", exact: false, requiredPlugin: null },
    { name: "Ajustes", path: "/admin/settings", exact: false, requiredPlugin: null },
  ];

  // Filtrar el menú: mostrar solo si no requiere plugin o si el plugin está en 'activePlugins'
  const visibleItems = menuItems.filter(item => {
    if (!item.requiredPlugin) return true;
    return activePlugins.includes(item.requiredPlugin);
  });

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0 shrink-0 shadow-xl z-50">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-xl font-bold truncate">{tenantName}</h2>
        <p className="text-xs text-slate-400 mt-1">{domain}</p>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive = item.exact 
            ? pathname === item.path 
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
