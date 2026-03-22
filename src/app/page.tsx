import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Sistema de Reservas</h1>
        <p className="text-gray-600 mb-8">Bienvenido al sistema de gestión de reservas</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Botón Nueva Reserva -> Redirige a Sedes */}
          <Link 
            href="/sedes" 
            className="p-6 border rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <h2 className="text-2xl font-semibold mb-2 group-hover:text-green-600">Nueva Reserva</h2>
            <p className="text-gray-600">Crear una nueva reserva seleccionando una sede</p>
          </Link>
          
          {/* Botón Ver Reservas -> También redirige a Sedes */}
          <Link 
            href="/sedes" 
            className="p-6 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <h2 className="text-2xl font-semibold mb-2 group-hover:text-blue-600">Ver Reservas</h2>
            <p className="text-gray-600">Consultar reservas existentes por sede</p>
          </Link>

        </div>
      </div>
    </main>
  );
}