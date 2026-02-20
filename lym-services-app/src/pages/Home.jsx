import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Users, MapPin, Send, Mail, CheckCircle, Bell, ChevronRight, Plane, Globe, Shield } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Simulateur from "../components/Simulateur";

// --- ANIMATION DE TEXTE (TYPEWRITER) ---
const TypewriterText = ({ texts }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === texts[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2000);
      return;
    }
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % texts.length);
      return;
    }
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 75 : 150);
    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, texts]);

  return <span className="text-blue-200 border-r-4 border-blue-200 pr-2">{texts[index].substring(0, subIndex)}</span>;
};

// --- FADE IN AMÉLIORÉ ---
const FadeIn = ({ children, delay = 0, direction = "up" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: direction === "up" ? 40 : 0, x: direction === "left" ? 40 : 0 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.45, 0.32, 0.9] }}
    >
      {children}
    </motion.div>
  );
};

// --- BOUTON PREMIUM ---
const DynamicButton = ({ children, onClick, primary = false, fullWidth = false, type = "button" }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      type={type}
      onClick={onClick}
      className={`
        relative overflow-hidden flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-bold transition-all cursor-pointer
        ${fullWidth ? "w-full" : "w-auto"}
        ${primary 
          ? "bg-blue-600 text-white shadow-[0_10px_30px_-10px_rgba(37,99,235,0.5)] hover:bg-blue-700" 
          : "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20"}
      `}
    >
      {children}
    </motion.button>
  );
};

function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { scrollYProgress } = useScroll();
  const yRange = useTransform(scrollYProgress, [0, 0.3], [0, -100]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "newsletters"), {
        email: email,
        dateInscription: serverTimestamp(),
      });
      setSuccess(true);
      setTimeout(() => {
        window.open(`https://wa.me/2250102030405?text=Je m'abonne à la newsletter Lym Services`, "_blank");
        setSuccess(false);
        setEmail("");
      }, 2000);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <main className="overflow-x-hidden bg-slate-50 min-h-screen">
      
      {/* 1. HERO SECTION AVEC PARALLAXE */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-[#0a192f] pt-20 pb-32 px-6 text-center text-white overflow-hidden">
        {/* Cercles de lumière animés */}
        <motion.div style={{ y: yRange }} className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[120px]"></div>
        </motion.div>

        <div className="max-w-5xl mx-auto relative z-10">
          <FadeIn>
            <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tighter">
              L'excellence pour<br/>
              <TypewriterText texts={["vos Visas", "vos Études", "vos Voyages"]} />
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <p className="text-xl md:text-2xl mb-12 text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
              Plus qu'une agence, votre partenaire stratégique pour une mobilité internationale sans frontières.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <DynamicButton primary onClick={() => navigate("/offres")}>
                Explorer les destinations <ChevronRight size={22} />
              </DynamicButton>
              <DynamicButton onClick={() => navigate("/contact")}>
                Parler à un expert
              </DynamicButton>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 2. SIMULATEUR FLOATANT */}
      <section className="relative -mt-24 px-4 md:px-[8%] z-30">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="bg-white rounded-[3rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.15)] p-4 md:p-8"
        >
          <div className="mb-6 flex items-center gap-3 px-6">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-slate-400 text-sm font-mono ml-4 italic underline decoration-blue-500/30">Lym Simulator v2.0</span>
          </div>
          <Simulateur />
        </motion.div>
      </section>

      {/* 3. EXPERTISE AVEC EFFET HOVER 3D */}
      <section className="py-32 px-6 md:px-[10%] bg-white">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-4">Pourquoi nous choisir ?</h2>
          <div className="h-2 w-24 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: <Globe className="w-10 h-10" />, title: "Présence Mondiale", text: "Un réseau étendu sur 4 continents pour faciliter vos démarches locales.", color: "bg-blue-600" },
            { icon: <Shield className="w-10 h-10" />, title: "Sécurité Garantie", text: "Vos données et documents sont protégés par les protocoles les plus stricts.", color: "bg-blue-500" },
            { icon: <Star className="w-10 h-10" />, title: "98% de Succès", text: "Un taux d'approbation exceptionnel pour nos demandes de visas.", color: "bg-blue-400" }
          ].map((card, i) => (
            <FadeIn key={i} delay={i * 0.2}>
              <div className="group relative p-12 rounded-[2.5rem] bg-slate-50 border border-transparent hover:border-blue-100 hover:bg-white transition-all duration-500 hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className={`mb-8 w-20 h-20 ${card.color} text-white rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-[10deg] transition-transform`}>
                  {card.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 text-slate-800">{card.title}</h3>
                <p className="text-slate-500 leading-relaxed">{card.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 4. NEWSLETTER GLASSMORPHISM */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto relative rounded-[4rem] overflow-hidden bg-blue-900 py-20 px-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="mb-8">
              <Bell size={60} className="text-blue-300" />
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 text-center">Restez informé</h2>
            <p className="text-blue-100 text-xl mb-12 text-center max-w-2xl font-light">
              Recevez en exclusivité les dernières opportunités de bourses et les alertes promos.
            </p>

            {!success ? (
              <form onSubmit={handleSubscribe} className="w-full max-w-2xl flex flex-col md:flex-row gap-4 p-2 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                <input 
                  required 
                  type="email" 
                  placeholder="votre@email.com" 
                  className="flex-1 bg-transparent px-6 py-4 outline-none text-white placeholder:text-blue-200 font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="bg-white text-blue-900 px-10 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                  {loading ? "..." : "S'abonner"} <Send size={18} />
                </button>
              </form>
            ) : (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-3 bg-green-500 text-white px-10 py-5 rounded-3xl font-bold">
                <CheckCircle /> Bienvenue dans la communauté !
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* 5. CTA FINAL - DARK MODE STYLE */}
      <section className="py-32 px-6">
        <FadeIn>
          <div className="bg-slate-900 rounded-[4rem] p-12 md:p-32 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>
            
            <div className="relative z-10">
              <span className="inline-block px-6 py-2 bg-blue-600/20 text-blue-400 rounded-full text-sm font-bold tracking-widest uppercase mb-8">Ready to Fly?</span>
              <h2 className="text-5xl md:text-8xl font-black text-white mb-10 leading-none italic">
                C'est le moment <br/> de décoller.
              </h2>
              <div className="flex flex-col md:flex-row justify-center gap-6">
                <DynamicButton primary onClick={() => navigate("/contact")}>
                  Démarrer mon projet <Plane className="ml-2 rotate-45" />
                </DynamicButton>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

    </main>
  );
}

export default Home;