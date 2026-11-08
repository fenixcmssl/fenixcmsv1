export default function TiendaSubastasView({ tenant }: { tenant: any }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <header className="max-w-7xl mx-auto flex justify-between items-center pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-black text-purple-400">{tenant.name} - Sala de Subastas</h1>
        <span className="bg-purple-900/50 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-700">Modo Subasta</span>
      </header>
      <main className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
          <div className="h-48 bg-zinc-800 rounded-xl mb-4 flex items-center justify-center text-zinc-500">Lote en Puja</div>
          <h3 className="text-lg font-bold">Pieza de Colección</h3>
          <p className="text-zinc-400 text-sm mt-1">Puja activa con límite de tiempo.</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-xl font-black text-purple-400">Puja Actual</span>
            <button className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-xl text-sm font-bold transition-all">Pujar Ahora</button>
          </div>
        </div>
      </main>
    </div>
  );
}