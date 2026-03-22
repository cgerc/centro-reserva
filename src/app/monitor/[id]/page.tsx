"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function MonitorPage() {
  const { id } = useParams();
  const [sede, setSede] = useState<any>(null);
  const [llamadoActual, setLlamadoActual] = useState<any>(null);
  const [historial, setHistorial] = useState<any[]>([]);
  const [horaActual, setHoraActual] = useState(new Date());
  const [montado, setMontado] = useState(false);

  // ==========================================
  // CONFIGURACIÓN (REEMPLAZA AQUÍ SI ES NECESARIO)
  const API_KEY = "AIzaSyAOY9P5TzlUyOBHKeAmBO660NF4EOGSWLQ"; 
  const CALENDAR_ID = "constructivamente.chile@gmail.com"; 
  // ==========================================

  // 1. Reloj y estado de montaje
  useEffect(() => {
    setMontado(true);
    const timer = setInterval(() => setHoraActual(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Función para obtener eventos y activar sonido
  const fetchGoogleCalendar = useCallback(async () => {
    try {
      const ahora = new Date();
      const inicioDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0).toISOString();
      const finDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 23, 59, 59).toISOString();

      const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${API_KEY}&timeMin=${inicioDia}&timeMax=${finDia}&singleEvents=true&orderBy=startTime`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        const eventosHoy = data.items
          .filter((event: any) => new Date(event.start.dateTime || event.start.date) <= ahora)
          .map((event: any) => ({
            paciente: event.summary || "Paciente",
            box: event.location || "--",
            hora: new Date(event.start.dateTime || event.start.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));

        if (eventosHoy.length > 0) {
          const nuevoLlamado = eventosHoy[eventosHoy.length - 1];

          // Sonido Ding si el paciente cambia
          if (llamadoActual && llamadoActual.paciente !== nuevoLlamado.paciente) {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play().catch(() => console.log("Audio esperando clic"));
          }

          setLlamadoActual(nuevoLlamado);
          const anteriores = eventosHoy.slice(0, -1).reverse().slice(0, 5);
          setHistorial(anteriores);
        }
      }
    } catch (err) {
      console.error("Error cargando Google Calendar:", err);
    }
  }, [API_KEY, CALENDAR_ID, llamadoActual]);

  // 3. Carga inicial y refresco automático
  useEffect(() => {
    if (!id) return;

    const cargarSede = async () => {
      try {
        const docSnap = await getDoc(doc(db, "sedes", id as string));
        if (docSnap.exists()) setSede(docSnap.data());
      } catch (e) {
        console.log("Error Firebase, usando nombre por defecto");
      }
    };

    cargarSede();
    fetchGoogleCalendar();

    const interval = setInterval(fetchGoogleCalendar, 30000);
    return () => clearInterval(interval);
  }, [id, fetchGoogleCalendar]);

  if (!montado) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans overflow-hidden flex flex-col">
      {/* HEADER */}
      <header className="flex justify-between items-center border-b-2 border-gray-800 pb-6 mb-8">
        <div>
         <h1 className="text-5xl font-black text-blue-500 uppercase tracking-tighter">
          CONSTRUCTIVAMENTE
        </h1>
          <p className="text-xl text-gray-500 font-bold tracking-[0.3em]">SALA DE ESPERA</p>
        </div>
        <div className="text-right">
          <p suppressHydrationWarning className="text-7xl font-mono font-bold leading-none">
            {horaActual.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: true })}
          </p>
          <p suppressHydrationWarning className="text-xl text-blue-400 font-semibold uppercase mt-2">
            {horaActual.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="grid grid-cols-12 gap-8 flex-grow">
        <div className="col-span-8 flex flex-col gap-8">
          <div className="bg-gray-900 rounded-[40px] p-10 border-l-[16px] border-blue-600 flex-grow flex flex-col justify-center relative shadow-2xl">
            <h2 className="absolute top-6 left-10 text-3xl font-bold text-gray-600 tracking-widest uppercase">Paciente</h2>
            {llamadoActual ? (
              <div className="text-8xl font-black uppercase text-white animate-pulse leading-tight">
                {llamadoActual.paciente}
              </div>
            ) : (
              <div className="text-5xl text-gray-800 font-bold italic uppercase">Sin llamados activos</div>
            )}
          </div>

          <div className="bg-gray-900 rounded-[40px] p-10 border-l-[16px] border-green-500 flex-grow flex flex-col justify-center relative shadow-2xl">
            <h2 className="absolute top-6 left-10 text-3xl font-bold text-gray-600 tracking-widest uppercase">Box / Módulo</h2>
            <div className="text-[14rem] font-black text-green-400 text-center leading-none">
              {llamadoActual?.box || "--"}
            </div>
          </div>
        </div>

        <div className="col-span-4 bg-gray-900 rounded-[40px] p-8 border-t-8 border-gray-700 shadow-2xl flex flex-col">
          <h2 className="text-2xl font-black text-gray-500 mb-6 border-b border-gray-800 pb-4 text-center tracking-widest uppercase">Últimos Llamados</h2>
          <div className="space-y-4 overflow-hidden">
            {historial.length > 0 ? historial.map((item, idx) => (
              <div key={idx} className="bg-black/40 p-4 rounded-2xl flex justify-between items-center border border-gray-800">
                <div className="overflow-hidden">
                  <p className="text-xs text-blue-400 font-bold">{item.hora}</p>
                  <p className="text-lg font-bold uppercase truncate pr-2">{item.paciente}</p>
                </div>
                <div className="text-3xl font-black text-green-500 bg-gray-800 px-4 py-1 rounded-xl shrink-0">
                  {item.box}
                </div>
              </div>
            )) : (
              <p className="text-center text-gray-700 mt-10 italic uppercase">No hay historial</p>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-8 text-center border-t border-gray-900 pt-6">
        <p className="text-xl text-gray-700 font-bold tracking-widest uppercase italic">
          Favor de esperar a ser llamado por pantalla...
        </p>
      </footer>
    </div>
  );
}