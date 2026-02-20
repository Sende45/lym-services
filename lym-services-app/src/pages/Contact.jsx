import React, { useState } from "react";
import { MapPin, Phone, Mail, Send, CheckCircle2, MessageSquare, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function Contact() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    sujet: "Information Voyage",
    message: ""
  });
  const [status, setStatus] = useState(null); // 'loading', 'success', 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      await addDoc(collection(db, "contacts"), {
        ...formData,
        dateEnvoi: serverTimestamp(),
        lu: false
      });
      setStatus("success");
      setFormData({ nom: "", email: "", telephone: "", sujet: "Information Voyage", message: "" });
      setTimeout(() => setStatus(null), 5000);
    } catch (error) {
      console.error("Erreur:", error);
      setStatus("error");
    }
  };

  return (
    <main className="bg-slate-50 min-h-screen overflow-x-hidden">
      
      {/* 1. HEADER ELITE */}
      <section className="relative bg-[#0a192f] pt-32 pb-48 px-6 text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent opacity-50"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold tracking-widest uppercase mb-6">
            Assistance 24/7
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
            Parlons de votre <span className="text-blue-400 font-serif italic">prochain voyage</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
            Une question ? Un projet spécifique ? Nos experts en mobilité internationale vous répondent avec précision.
          </p>
        </motion.div>
      </section>

      {/* 2. SECTION CONTENT GRID */}
      <section className="relative -mt-24 px-4 md:px-[10%] z-20 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          {/* FORMULAIRE (2/3) */}
          <motion.div 
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="lg:col-span-2 bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 p-8 md:p-12 border border-white"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <MessageSquare size={24} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Envoyez un message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom complet</label>
                  <input 
                    required type="text" placeholder="Ex: Jean Kouassi"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 focus:bg-white transition-all font-semibold"
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email professionnel</label>
                  <input 
                    required type="email" placeholder="votre@email.com"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 focus:bg-white transition-all font-semibold"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Téléphone</label>
                  <input 
                    required type="tel" placeholder="+225 07..."
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 focus:bg-white transition-all font-semibold"
                    value={formData.telephone}
                    onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sujet de la demande</label>
                  <select 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 focus:bg-white transition-all font-semibold cursor-pointer"
                    value={formData.sujet}
                    onChange={(e) => setFormData({...formData, sujet: e.target.value})}
                  >
                    <option>Information Voyage</option>
                    <option>Suivi de Dossier</option>
                    <option>Partenariat académique</option>
                    <option>Autre</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                <textarea 
                  required rows="4" placeholder="Décrivez votre projet ici..."
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 focus:bg-white transition-all font-semibold resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={status === "loading"}
                className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all ${
                  status === "loading" ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-blue-600 text-white shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 active:scale-95"
                }`}
              >
                {status === "loading" ? "Transmission..." : "Envoyer ma demande"} <Send size={20} />
              </button>

              <AnimatePresence>
                {status === "success" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-green-600 font-bold justify-center bg-green-50 p-4 rounded-xl">
                    <CheckCircle2 size={20} /> Message envoyé avec succès !
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          {/* INFOS DE CONTACT (1/3) */}
          <motion.div 
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col gap-6"
          >
            <ContactCard 
              icon={<MapPin />} 
              title="Bureau Abidjan" 
              text="Cocody, Riviera ANONO, Abidjan, Côte d'Ivoire" 
              sub="Ouvert de 08h à 18h"
            />
            <ContactCard 
              icon={<Phone />} 
              title="Lignes Directes" 
              text="+225 07 08 07 24 48" 
              sub="+225 07 19 30 65 60"
            />
            <ContactCard 
              icon={<Mail />} 
              title="Email Support" 
              text="contact@lymsservices.com" 
              sub="Réponse sous 2h"
            />
            
            {/* CTA WHATSAPP RAPIDE */}
            <a 
              href="https://wa.me/2250708072448" 
              target="_blank" 
              rel="noreferrer"
              className="group bg-green-500 text-white p-8 rounded-[2.5rem] flex items-center justify-between shadow-xl shadow-green-100 hover:bg-green-600 transition-all"
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Besoin d'aide ?</span>
                <p className="text-xl font-black">Chat WhatsApp</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full group-hover:translate-x-2 transition-transform">
                <ArrowRight />
              </div>
            </a>
          </motion.div>
        </div>
      </section>

      {/* 3. MAP SECTION */}
      <section className="px-4 md:px-[10%] mb-20">
        <div className="max-w-7xl mx-auto rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
          <iframe 
            title="Localisation Lyms Services"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15889.344443427908!2d-3.95!3d5.35!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMjEnMDAuMCJOIDPCsDU3JzAwLjAiVw!5e0!3m2!1sfr!2sci!4v1700000000000!5m2!1sfr!2sci" 
            width="100%" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </main>
  );
}

// --- SOUS-COMPOSANT CARTE DE CONTACT ---
const ContactCard = ({ icon, title, text, sub }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
    <div className="w-12 h-12 bg-slate-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
      {icon}
    </div>
    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">{title}</h3>
    <p className="text-lg font-bold text-slate-900 leading-snug mb-1">{text}</p>
    <p className="text-sm text-slate-500 font-medium">{sub}</p>
  </div>
);

export default Contact;