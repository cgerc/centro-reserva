import Link from 'next/link';

export default function SedesPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gestión de Sedes</h1>
          
          {/* Botón para crear sede */}
          <Link 
            href="/sedes/crear" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            + Crear sede
          </Link>
        </div>

        {/* Contenedor de lista de sedes (Vacío por ahora) */}
        <div className="bg-white border rounded-lg p-12 text-center">
          <p className="text-gray-500 italic">
            No hay sedes registradas todavía. Haz clic en el botón superior para añadir una.
          </p>
        </div>

        {/* Botón para volver al inicio */}
        <div className="mt-8">
          <Link href="/" className="text-blue-500 hover:underline">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}