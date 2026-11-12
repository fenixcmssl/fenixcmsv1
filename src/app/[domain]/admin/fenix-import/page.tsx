"use client";

import { useState, use } from "react";
import Link from "next/link";
import { runBulkImport } from "./actions";

export default function FenixImportPage({ params }: { params: Promise<any> }) {
  const resolvedParams = use(params);
  const domain = decodeURIComponent(resolvedParams?.domain || "");

  const [csvData, setCsvData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<any>({});
  const [step, setStep] = useState(1);
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter(line => line.trim() !== "");
      if (lines.length > 0) {
        // Regex para respetar comas dentro de campos entrecomillados
        const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
        const parsedHeaders = lines[0].split(regex).map(h => h.trim().replace(/^"|"$/g, ''));
        setHeaders(parsedHeaders);
        
        const parsedData = lines.slice(1).map(line => {
          const values = line.split(regex);
          let obj: any = {};
          parsedHeaders.forEach((header, index) => {
            obj[header] = values[index] ? values[index].trim().replace(/^"|"$/g, '') : "";
          });
          return obj;
        });
        setCsvData(parsedData);
        setStep(2);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    setIsImporting(true);
    try {
      // Cruzar el mapeo del usuario con los datos extraídos
      const mappedProducts = csvData.map(row => ({
        name: row[mapping.name],
        price: row[mapping.price],
        sku: row[mapping.sku],
        stock: row[mapping.stock],
        description: row[mapping.description],
      })).filter(p => p.name); // Descartar filas sin nombre asignado
      
      const count = await runBulkImport(mappedProducts);
      setMessage(`¡Fenix Import ha procesado y guardado exitosamente ${count} productos!`);
      setStep(3);
    } catch (error: any) {
      setMessage("Error crítico en la importación: " + error.message);
      setStep(1);
    }
    setIsImporting(false);
  };

  return (
    <main className="flex-1 p-8 overflow-y-auto w-full">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Fenix Import</h1>
          <p className="text-gray-500 mt-2">Herramienta de importación masiva y mapeo de catálogos para {domain}.</p>
        </header>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-8">
          {step === 1 && (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">📁</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Paso 1: Sube tu archivo CSV</h2>
              <p className="text-gray-500 mb-8">Selecciona un archivo CSV exportado desde WooCommerce u otro sistema.</p>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-gray-200 rounded-lg p-2 mx-auto max-w-md" />
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Paso 2: Mapeo de Columnas</h2>
              <p className="text-gray-600 mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">Detectamos <strong>{csvData.length}</strong> productos. Asigna tus columnas a los campos de FenixCMS.</p>
              
              <div className="space-y-4 mb-8">
                {[
                  { id: 'name', label: 'Nombre del Producto *' },
                  { id: 'price', label: 'Precio Normal *' },
                  { id: 'sku', label: 'Código SKU' },
                  { id: 'stock', label: 'Cantidad en Stock' },
                  { id: 'description', label: 'Descripción' }
                ].map(field => (
                  <div key={field.id} className="grid grid-cols-3 gap-4 items-center bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <label className="font-semibold text-gray-700">{field.label}</label>
                    <div className="col-span-2">
                      <select 
                        className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        onChange={(e) => setMapping({...mapping, [field.id]: e.target.value})}
                      >
                        <option value="">-- Ignorar este campo --</option>
                        {headers.map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-4 border-t border-gray-100 pt-6">
                <button onClick={() => setStep(1)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">Cancelar</button>
                <button onClick={handleImport} disabled={isImporting} className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-md disabled:opacity-50">
                  {isImporting ? 'Procesando inserción...' : 'Ejecutar Importación Masiva'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Importación Exitosa!</h2>
              <p className="text-gray-600 mb-8">{message}</p>
              <Link href="/admin/products" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md">
                Ir al Catálogo
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
