export default function TiendaInmobiliariaView({ tenant }: { tenant: any }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <header className="max-w-7xl mx-auto flex justify-between items-center pb-6 border-b border-slate-800">
        <h1 className="text-2xl font-black text-amber-400">{tenant.name} - Inmobiliaria</h1>
        <span className="bg-amber-900/50 text-amber-300 px-3 py-1 rounded-full text-sm border border-amber-700">Modo Inmobiliario</span>
      </header>
      <main className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="h-48 bg-slate-800 rounded-xl mb-4 flex items-center justify-center text-slate-500">Propiedad Destacada</div>
          <h3 className="text-lg font-bold">Villa Residencial Exclusiva</h3>
          <p className="text-slate-400 text-sm mt-1">Ubicación privilegiada.</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-xl font-black text-amber-400">0.00 {tenant.currency}</span>
            <button className="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-xl text-sm font-bold transition-all">Consultar</button>
          </div>
        </div>
      </main>
    </div>
  );
}