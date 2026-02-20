import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, 
  Save, 
  Palmtree, 
  GraduationCap, 
  Stethoscope, 
  PlaneTakeoff, 
  Briefcase,
  Loader2,
  CheckCircle,
  Settings2
} from "lucide-react";

const AdminTarifs = () => {
  const [activeZone, setActiveZone] = useState("europe_court_sejour");
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);

  const [prix, setPrix] = useState({
    tourisme: 0,
    etudes: 0,
    soins_medicaux: 0,
    immigration: 0,
    travail: 0,
  });

  // Charger les données
  useEffect(() => {
    const loadData = async () => {
      const snap = await getDoc(doc(db, "tarifs", activeZone));
      if (snap.exists()) {
        const data = snap.data().prix;
        setPrix({
          tourisme: data?.tourisme || 0,
          etudes: data?.etudes || 0,
          soins_medicaux: data?.soins_medicaux || 0,
          immigration: data?.immigration || 0,
          travail: data?.travail || 0,
        });
      } else {
        setPrix({ tourisme: 0, etudes: 0, soins_medicaux: 0, immigration: 0, travail: 0 });
      }
    };
    loadData();
  }, [activeZone]);

  // Sauvegarde
  const handleSave = async () => {
    setLoading(true);
    try {
      await setDoc(
        doc(db, "tarifs", activeZone),
        {
          prix: Object.fromEntries(
            Object.entries(prix).map(([key, val]) => [key, Number(val)])
          ),
          lastUpdated: new Date().toISOString()
        },
        { merge: true }
      );
      setSaveStatus(true);
      setTimeout(() => setSaveStatus(false), 3000);
    } catch (e) {
      console.error(e);
      alert("Erreur de sauvegarde");
    }
    setLoading(false);
  };

  const handleChange = (field, value) => {
    setPrix((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <Settings2 size={24} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Configuration des Tarifs</h1>
            </div>
            <p className="text-slate-500 font-medium">Gérez les coûts des prestations par zone géographique</p>
          </div>

          {/* ZONE SELECTOR */}
          <div className="relative min-w-[250px]">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={20} />
            <select
              value={activeZone}
              onChange={(e) => setActiveZone(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm appearance-none outline-none focus:ring-2 ring-blue-500/20 font-bold text-slate-700 transition-all cursor-pointer"
            >
              <option value="europe_court_sejour">🇪🇺 Europe - Court séjour</option>
              <option value="afrique_court_sejour">🌍 Afrique - Court séjour</option>
              <option value="canada_court_sejour">🇨🇦 Canada - Court séjour</option>
              <option value="usa_court_sejour">🇺🇸 USA - Court séjour</option>
            </select>
          </div>
        </header>

        {/* MAIN SETTINGS CARD */}
        <motion.div 
          key={activeZone}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white p-8 md:p-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <TarifInput 
              icon={<Palmtree className="text-orange-500" />} 
              label="Tourisme" 
              value={prix.tourisme} 
              onChange={(v) => handleChange("tourisme", v)} 
            />
            <TarifInput 
              icon={<GraduationCap className="text-blue-500" />} 
              label="Études" 
              value={prix.etudes} 
              onChange={(v) => handleChange("etudes", v)} 
            />
            <TarifInput 
              icon={<Stethoscope className="text-red-500" />} 
              label="Soins Médicaux" 
              value={prix.soins_medicaux} 
              onChange={(v) => handleChange("soins_medicaux", v)} 
            />
            <TarifInput 
              icon={<PlaneTakeoff className="text-emerald-500" />} 
              label="Immigration" 
              value={prix.immigration} 
              onChange={(v) => handleChange("immigration", v)} 
            />
            <TarifInput 
              icon={<Briefcase className="text-purple-500" />} 
              label="Travail" 
              value={prix.travail} 
              onChange={(v) => handleChange("travail", v)} 
            />
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              Dernière mise à jour automatique effectuée
            </p>
            
            <button
              onClick={handleSave}
              disabled={loading}
              className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-black transition-all ${
                saveStatus 
                ? "bg-green-500 text-white" 
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95"
              } disabled:bg-slate-200`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : saveStatus ? (
                <><CheckCircle size={20} /> Enregistré</>
              ) : (
                <><Save size={20} /> Sauvegarder les modifications</>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// COMPOSANT INPUT PREMIUM
const TarifInput = ({ label, value, onChange, icon }) => (
  <div className="group space-y-3">
    <div className="flex items-center gap-2 ml-1">
      {icon}
      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</label>
    </div>
    <div className="relative">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 focus:bg-white transition-all font-black text-slate-700 text-lg"
        placeholder="0"
      />
      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">FCFA</span>
    </div>
  </div>
);

export default AdminTarifs;