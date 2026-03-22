"use client";
import { auth, googleProvider, db } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [sedes, setSedes] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "sedes"));
        const lista = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSedes(lista);
      } catch (error) {
        console.error("Error cargando sedes:", error);
      } finally {
        setCargando(false);
      }
    };
    fetchSedes();
  }, []);

  const agregarSede = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await setDoc(doc(db, "sedes", user.uid), {
        nombre: user.displayName || "Nueva Sede",
        email: user.email,
        googleCalendarId: "primary",
        fechaRegistro: new Date().toISOString()
      }, { merge: true });

      alert("¡Sede vinculada con éxito!");
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert("Error al vincular. Revisa la consola.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-12">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl font-black mb-4 text-slate-800">Panel de Control</h1>
        <p className="text-xl text-slate-500 mb-16">Gestión de Sedes y Monitores</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* SECCIÓN: VER SEDES */}
          <section className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
            <h2 className="text-3xl font-bold mb-6 text-blue-600">Ver Sedes</h2>
            <div className="space-y-4 text-left">
              {cargando ? (
                <p className="text-center py-4">Buscando sedes...</p>
              ) : sedes.length > 0 ? (
                sedes.map((sede) => (
                  <Link 
                    key={sede.id} 
                    href={`/monitor/${sede.id}`}
                    className="flex items-center justify-between p-5 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all group"
                  >
                    <span className="font-bold text-blue-800 text-lg">{sede.nombre}</span>
                    <span className="text-blue-500 font-bold group-hover:translate-x-1 transition-transform">Monitor →</span>
                  </Link>
                ))
              ) : (
                <p className="text-slate-400 text-center py-4">No hay sedes configuradas.</p>
              )}
            </div>
          </section>

          {/* SECCIÓN: AGREGAR SEDE */}
          <section className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6 text-emerald-600">Agregar Nueva Sede</h2>
            <p className="text-slate-500 mb-8">Vincula un correo de Google para crear un nuevo monitor de sala.</p>
            <button 
              onClick={agregarSede}
              className="py-5 bg-emerald-500 text-white rounded-2xl font-black text-xl hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all active:scale-95"
            >
              + VINCULAR GMAIL
            </button>
          </section>

        </div>
      </div>
    </main>
  );
}