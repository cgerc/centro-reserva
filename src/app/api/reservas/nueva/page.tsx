"use client";
import { useState } from 'react';

export default function NuevaReserva() {
  const [boxSeleccionado, setBoxSeleccionado] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  const boxes = ["Box 1", "Box 2", "Box 3"];

  const manejarReserva = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aquí llamarás a tu API para verificar disponibilidad y enviar a Google
    console.log("Reservando:", { boxSeleccionado, fecha, hora });
    alert(`Verificando disponibilidad para el ${boxSeleccionado}...`);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Agendar Cita</h1>
        
        <form onSubmit={manejarReserva} className="space-y-4">
          {/* Selección de Box */}
          <div>
            <label className="block text-sm font-medium mb-2">Selecciona un Box</label>
            <div className="grid grid-cols-3 gap-2">
              {boxes.map((box) => (
                <button
                  key={box}
                  type="button"
                  onClick={() => setBoxSeleccionado(box)}
                  className={`p-2 border rounded-md transition-colors ${
                    boxSeleccionado === box 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-gray-700 hover:border-blue-400'
                  }`}
                >
                  {box}
                </button>
              ))}
            </div>
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium mb-1">Fecha</label>
            <input 
              type="date" 
              className="w-full p-2 border rounded"
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>

          {/* Hora */}
          <div>
            <label className="block text-sm font-medium mb-1">Hora</label>
            <input 
              type="time" 
              className="w-full p-2 border rounded"
              onChange={(e) => setHora(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={!boxSeleccionado}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300"
          >
            Confirmar Reserva
          </button>
        </form>
      </div>
    </main>
  );
}