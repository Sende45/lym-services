import React, { useState, useEffect } from "react";
import { X, MapPin, Clock, Filter, Globe, ChevronRight, CheckCircle2, ShieldCheck, Zap, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";

// --- ANIMATIONS CONFIG ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

// --- COMPOSANT SKELETON ---
const PriceSkeleton = () => (
  <div className="w-24 h-6 bg-slate-200 rounded-lg animate-pulse" />
);

function NosOffres() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [tarifsDb, setTarifsDb] = useState([]);
  const [loadingTarifs, setLoadingTarifs] = useState(true);
  const [successOrder, setSuccessOrder] = useState(false);

  // Filtres
  const [paysSelectionne, setPaysSelectionne] = useState("");
  const [dureeFilter, setDureeFilter] = useState("Court Séjour");
  const [typeVisaFilter, setTypeVisaFilter] = useState("Tourisme");
  const [continentFilter, setContinentFilter] = useState("Tous");

  const categoriesDuree = ["Court Séjour", "Long Séjour"];
  const visasParDuree = {
    "Court Séjour": ["Tourisme", "Affaires", "Vacances", "Visite familiale"],
    "Long Séjour": ["Études", "Travail", "Immigration"]
  };

  const continents = ["Tous", "Afrique", "Europe", "Amérique", "Asie", "Océanie"];

  const offresParContinent = [
    { id: "afrique", nom: "Afrique", img: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=800", description: "L'authenticité et les opportunités émergentes." },
    { id: "europe", nom: "Europe", img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800", description: "L'excellence académique et le tourisme culturel." },
    { id: "amerique", nom: "Amérique", img: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80&w=800", description: "Le rêve américain et les grands espaces canadiens." },
    { id: "asie", nom: "Asie", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800", description: "Innovation technologique et dépaysement total." },
    { id: "oceanie", nom: "Océanie", img: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=800", description: "Une qualité de vie inégalée entre terre et mer." }
  ];

  useEffect(() => {
    const fetchTarifs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tarifs"));
        setTarifsDb(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) { console.error(err); }
      finally { setTimeout(() => setLoadingTarifs(false), 800); }
    };
    fetchTarifs();
  }, []);

  const calculerPrixTotal = (continentId, typeVisa) => {
    const searchId = `visa_${continentId.toLowerCase()}`;
    const tarifMatch = tarifsDb.find(t => t.id.toLowerCase() === searchId || t.service === searchId);
    const base = tarifMatch ? tarifMatch.prix : 0;
    const multiplicateurs = { "Études": 1.5, "Travail": 2.0, "Immigration": 2.5, "Affaires": 1.2 };
    return base * (multiplicateurs[typeVisa] || 1);
  };

  const handleReservation = async (e) => {
    e.preventDefault();
    const finalPrice = calculerPrixTotal(selectedOffre.id, typeVisaFilter);
    try {
      await addDoc(collection(db, "reservations"), {
        nomClient: e.target[0].value,
        paysDestination: paysSelectionne,
        continent: selectedOffre.nom,
        typeVisa: typeVisaFilter,
        montantEstime: finalPrice,
        statut: "En attente",
        dateCreation: serverTimestamp()
      });
      setSuccessOrder(true);
      setTimeout(() => { setIsModalOpen(false); setSuccessOrder(false); }, 3000);
    } catch (error) { alert("Erreur de connexion."); }
  };

  const offresFiltrees = offresParContinent.filter(o => continentFilter === "Tous" || o.nom === continentFilter);

  return (
    <main className="bg-slate-50 min-h-screen pb-20 overflow-x-hidden">
      
      {/* 1. HEADER DYNAMIQUE */}
      <section className="relative bg-[#0a192f] pt-32 pb-48 px-6 text-center text-white overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none"
        />
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold tracking-widest uppercase mb-6">
            Lym Services Elite
          </span>
          <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter">
            Solutions Visas <span className="text-blue-400 font-serif italic">sur mesure</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            Estimation en temps réel et accompagnement diplomatique complet pour vos ambitions mondiales.
          </p>
        </motion.div>
      </section>

      {/* 2. BARRE DE RECHERCHE FLOTTANTE (GLASSMORPHISM) */}
      <section className="relative -mt-24 px-4 md:px-[10%] z-20">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] p-8 border border-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <SearchInput label="Destination" icon={<Search size={18}/>} placeholder="Ex: Canada..." onChange={(e) => setPaysSelectionne(e.target.value)} />
            <SearchSelect label="Continent" icon={<Globe size={18}/>} options={continents} onChange={(e) => setContinentFilter(e.target.value)} />
            <SearchSelect label="Durée" icon={<Clock size={18}/>} options={categoriesDuree} onChange={(e) => {
                setDureeFilter(e.target.value); 
                setTypeVisaFilter(visasParDuree[e.target.value][0]);
            }} />
            <SearchSelect label="Type de Visa" icon={<Filter size={18}/>} value={typeVisaFilter} options={visasParDuree[dureeFilter]} onChange={(e) => setTypeVisaFilter(e.target.value)} />
          </div>
        </motion.div>
      </section>

      {/* 3. GRILLE DES OFFRES */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-10 px-6 md:px-[10%] pt-24"
      >
        {offresFiltrees.map((zone) => {
          const prixZone = calculerPrixTotal(zone.id, typeVisaFilter);
          return (
            <motion.div 
              key={zone.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-64 overflow-hidden">
                <img src={zone.img} alt={zone.nom} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 text-[10px] font-black text-green-600 shadow-sm">
                   <Zap size={12} /> TRAITEMENT EXPRESS
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-2xl font-black text-slate-900 mb-2">{zone.nom}</h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed h-12">{zone.description}</p>
                
                <div className="flex items-center justify-between mb-8 p-4 bg-slate-50 rounded-2xl">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">À partir de</span>
                  {loadingTarifs ? <PriceSkeleton /> : (
                    <span className="text-xl font-black text-blue-600">
                      {prixZone > 0 ? `${prixZone.toLocaleString()} FCFA` : "Sur devis"}
                    </span>
                  )}
                </div>

                <button 
                  disabled={!paysSelectionne}
                  onClick={() => { setSelectedOffre(zone); setIsModalOpen(true); }}
                  className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                    paysSelectionne 
                    ? "bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1" 
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {paysSelectionne ? `Partir en ${paysSelectionne}` : "Précisez votre destination"}
                  <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.section>

      {/* 4. MODAL ANIMÉ (ANIMEPRESENCE) */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl shadow-black/50"
            >
              {successOrder ? (
                <div className="p-16 text-center">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Demande Reçue !</h2>
                  <p className="text-slate-500">Un expert Lym Services vous rappellera sous 24h.</p>
                </div>
              ) : (
                <div className="relative">
                  <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                    <X size={20} />
                  </button>
                  
                  <div className="p-10">
                    <div className="mb-8">
                      <h2 className="text-3xl font-black text-slate-900">{paysSelectionne}</h2>
                      <div className="flex gap-2 mt-2">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase">{typeVisaFilter}</span>
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase">{dureeFilter}</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white mb-8 relative overflow-hidden">
                      <ShieldCheck className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12" />
                      <span className="text-[10px] font-bold tracking-widest opacity-80 uppercase">Estimation Elite</span>
                      <div className="text-4xl font-black mt-2">
                        {calculerPrixTotal(selectedOffre.id, typeVisaFilter).toLocaleString()} <span className="text-lg font-light">FCFA</span>
                      </div>
                      <p className="text-xs text-blue-100 mt-4 font-medium flex items-center gap-2">
                        <Zap size={12} className="text-amber-400" /> Frais de dossier & assistance inclus
                      </p>
                    </div>

                    <form onSubmit={handleReservation} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identité du voyageur</label>
                        <input required type="text" placeholder="Nom et prénoms complets" className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 focus:bg-white transition-all font-semibold" />
                      </div>
                      <button type="submit" className="w-full py-6 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all">
                        Confirmer ma demande
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

// --- SOUS-COMPOSANTS (INTERNAL) ---
const SearchInput = ({ label, icon, placeholder, onChange }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl focus-within:ring-2 ring-blue-500/20 transition-all">
      <span className="text-blue-500">{icon}</span>
      <input type="text" placeholder={placeholder} onChange={onChange} className="bg-transparent w-full outline-none font-semibold text-slate-700" />
    </div>
  </div>
);

const SearchSelect = ({ label, icon, options, onChange, value }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl focus-within:ring-2 ring-blue-500/20 transition-all">
      <span className="text-slate-400">{icon}</span>
      <select value={value} onChange={onChange} className="bg-transparent w-full outline-none font-semibold text-slate-700 cursor-pointer">
        {options.map((o, i) => <option key={i} value={o}>{o}</option>)}
      </select>
    </div>
  </div>
);

export default NosOffres;