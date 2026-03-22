"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function MonitorPage() {
  const { id } = useParams();
  const [sede, setSede] = useState<any>(null);
  const [citas, setCitas] = useState<any[]>([]);
  const [horaActual, setHoraActual] = useState(new Date());

  // 1. Obtener datos de la sede desde Firebase
  useEffect(() => {
    const fetchSede = async () => {
      if (!id) return;
      const docSnap = await getDoc(doc(db, "sedes", id as string));
      if (docSnap.exists()) {
        setSede(docSnap.data());
      }
    };
    fetchSede();
    
    // Reloj en tiempo real
    const timer = setInterval(() => setHoraActual(new Date()), 1000);
    return () => clearInterval(timer);
  }, [id]);

  // 2. Simulador de citas (Aquí conectaremos Google Calendar luego)
  useEffect(() => {
    // Por ahora, datos de ejemplo para ver el diseño
    const mockCitas = [
      { paciente: "CARGANDO DATOS...", box: "--", hora: "00:00" }
    ];
    setCitas(mockCitas);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-10 font-sans overflow-hidden">
      {/* Encabezado con Nombre de Sede y Reloj */}
      <header className="flex justify-between items-center border-b-2 border-gray-800 pb-8 mb-12">
        <div>
          <h1 className="text-6xl font-black text-blue-500 uppercase tracking-tighter">
            {sede?.nombre || "SEDE"}
          </h1>
          <p className="text-2xl text-gray-400 mt-2">SALA DE ESPERA</p>
        </div>
        <div className="text-right">
          <p className="text-8xl font-mono font-bold leading-none">
            {horaActual.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-2xl text-blue-400 mt-2 font-semibold">
            {horaActual.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </header>

      {/* Cuerpo del Monitor */}
      <main className="grid grid-cols-2 gap-12">
        {/* Columna Paciente */}
        <div className="bg-gray-900 rounded-3xl p-10 shadow-2xl border-t-8 border-blue-600">
          <h2 className="text-4xl font-bold text-gray-500 mb-10 border-b border-gray-800 pb-4">PACIENTE</h2>
          <div className="space-y-12">
            {citas.map((cita, index) => (
              <div key={index} className="text-8xl font-black uppercase tracking-tight animate-pulse text-white">
                {cita.paciente}
              </div>
            ))}
          </div>
        </div>

        {/* Columna Box */}
        <div className="bg-gray-900 rounded-3xl p-10 shadow-2xl border-t-8 border-green-500 text-center">
          <h2 className="text-4xl font-bold text-gray-500 mb-10 border-b border-gray-800 pb-4">BOX / MÓDULO</h2>
          <div className="space-y-12">
            {citas.map((cita, index) => (
              <div key={index} className="text-9xl font-black text-green-400">
                {cita.box}
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="fixed bottom-10 left-0 w-full text-center">
        <p className="text-3xl text-gray-600 font-medium">
          Favor de esperar a ser llamado por el profesional...
        </p>
      </footer>
    </div>
  );
}