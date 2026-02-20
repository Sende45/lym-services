import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, Info, ArrowRight, Loader2, Sparkles, User, Mail, Briefcase } from "lucide-react";

function Consultation() {
  const [formData, setFormData] = useState({ nom: "", email: "", type: "Immigration" });
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "consultations"), {
        ...formData,
        statut: "En attente de paiement",
        dateDemande: serverTimestamp(),
        prix: 15000
      });

      // Simulation de redirection
      setTimeout(() => {
        window.location.href = "https://mes-paiements.com/lym-services";
      }, 1000);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-[1000px] w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white"
      >
        
        {/* COLONNE GAUCHE : RÉASSURANCE */}
        <div className="bg-[#0a192f] p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_#1e3a8a_0%,_transparent_60%)] opacity-30" />
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20">
              <Sparkles size={24} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter mb-6 leading-tight">
              Consultation <br /><span className="text-blue-400 font-serif italic text-3xl">Expertise Privée</span>
            </h1>
            
            <div className="space-y-6 mt-12">
              <FeatureItem 
                icon={<ShieldCheck className="text-blue-400" />} 
                text="Analyse approfondie de votre profil" 
              />
              <FeatureItem 
                icon={<CreditCard className="text-blue-400" />} 
                text="Frais déductibles de votre procédure future" 
              />
              <FeatureItem 
                icon={<Info className="text-blue-400" />} 
                text="Conseils stratégiques personnalisés" 
              />
            </div>
          </div>

          <div className="relative z-10 mt-12 p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
            <p className="text-sm text-slate-300 leading-relaxed italic">
              "Notre objectif est de maximiser vos chances de succès dès le premier échange."
            </p>
            <p className="text-xs font-bold mt-4 text-blue-400 uppercase tracking-widest">— Direction LYM Services</p>
          </div>
        </div>

        {/* COLONNE DROITE : FORMULAIRE */}
        <div className="p-12">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Détails de la réservation</h2>
            <div className="text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Frais fixes</span>
              <p className="text-2xl font-black text-blue-600">15.000 <span className="text-sm">FCFA</span></p>
            </div>
          </div>

          <form onSubmit={handlePayment} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom complet du demandeur</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600" size={18} />
                <input 
                  required type="text" placeholder="Ex: Jean Kouassi"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 focus:bg-white transition-all font-semibold"
                  onChange={e => setFormData({...formData, nom: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Adresse Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600" size={18} />
                <input 
                  required type="email" placeholder="votre@email.com"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 focus:bg-white transition-all font-semibold"
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Domaine d'expertise souhaité</label>
              <div className="relative group">
                <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600" size={18} />
                <select 
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 focus:bg-white transition-all font-semibold cursor-pointer appearance-none"
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option>Immigration (Long séjour)</option>
                  <option>Visa Études / Académique</option>
                  <option>Tourisme / Visite familiale</option>
                  <option>Affaires / Business</option>
                </select>
              </div>
            </div>

            {/* MESSAGE D'INFORMATION IMPORTANTE */}
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
              <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                <strong>💡 Note importante :</strong> Les frais de consultation sont non remboursables. Ils seront toutefois <strong>intégralement déduits</strong> de vos frais de dossier finaux lors de l'ouverture de votre procédure.
              </p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:bg-slate-200 disabled:text-slate-400"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>Payer & Réserver <ArrowRight size={20} /></>
              )}
            </button>
            
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
              Paiement 100% sécurisé via Mobile Money & Cartes
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// SOUS-COMPOSANT D'INFO
const FeatureItem = ({ icon, text }) => (
  <div className="flex items-center gap-4 group">
    <div className="p-2 bg-white/5 rounded-xl group-hover:bg-blue-600 transition-colors">
      {icon}
    </div>
    <span className="text-sm font-medium text-slate-200">{text}</span>
  </div>
);

export default Consultation;