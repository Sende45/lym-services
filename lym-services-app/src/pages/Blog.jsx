import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Calendar, ArrowRight, Search, Clock, BookOpen, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800";

// --- ANIMATION VARIANTS ---
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { y: -10, transition: { duration: 0.3 } }
};

// --- CARTE D'ARTICLE ELITE ---
function ArticleCard({ art }) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true }}
      className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
    >
      {/* IMAGE CONTAINER */}
      <div className="relative h-60 overflow-hidden">
        <img
          src={art.image || FALLBACK_IMAGE}
          alt={art.titre}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* BADGE CATEGORIE (Optionnel) */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 text-[10px] font-black text-blue-600 shadow-sm uppercase tracking-tighter">
          <Sparkles size={10} /> Actualité
        </div>
      </div>

      {/* CONTENU */}
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center gap-3 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">
          <span className="flex items-center gap-1"><Clock size={12} /> 3 min</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span className="flex items-center gap-1"><Calendar size={12} /> {art.date}</span>
        </div>

        <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
          {art.titre || "Titre de l'article"}
        </h3>
        
        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
          {art.contenu ? art.contenu.substring(0, 120).replace(/<[^>]*>?/gm, '') + "..." : "Découvrez les dernières mises à jour et conseils pour votre expatriation..."}
        </p>

        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
          <span className="text-blue-600 font-black text-xs uppercase tracking-widest flex items-center gap-2">
            Lire l'article <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// --- BLOG PRINCIPAL ---
function Blog() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => {
        const data = doc.data();
        let dateTexte = "Récemment";
        if (data.date?.seconds) {
          dateTexte = new Date(data.date.seconds * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
        }
        
        let imageUrl = FALLBACK_IMAGE;
        if (typeof data.image === "string" && data.image.startsWith("http")) imageUrl = data.image;
        else if (Array.isArray(data.image) && data.image[0]) imageUrl = data.image[0];

        return { id: doc.id, ...data, date: dateTexte, image: imageUrl };
      });
      setArticles(docs);
      setFilteredArticles(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const filtered = articles.filter((a) =>
      (a.titre || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArticles(filtered);
  }, [searchTerm, articles]);

  return (
    <div className="bg-slate-50 min-h-screen pb-20 overflow-x-hidden">
      
      {/* HEADER DYNAMIQUE */}
      <section className="relative bg-[#0a192f] pt-32 pb-48 px-6 text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent opacity-50"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold tracking-widest uppercase mb-6">
            Lym Insights & News
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
            Guide de la <span className="text-blue-400 font-serif italic">mobilité mondiale</span>
          </h1>
          
          {/* BARRE DE RECHERCHE DANS LE HEADER */}
          <div className="relative max-w-2xl mx-auto mt-10">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher une destination ou un guide..."
              className="w-full pl-16 pr-8 py-6 bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2rem] text-white placeholder:text-slate-400 focus:bg-white focus:text-slate-900 outline-none transition-all shadow-2xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>
      </section>

      {/* GRILLE D'ARTICLES */}
      <div className="relative z-20 -mt-20 max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-[450px] bg-white rounded-[2.5rem] animate-pulse p-8 border border-slate-100">
                <div className="w-full h-48 bg-slate-100 rounded-2xl mb-6"></div>
                <div className="w-1/3 h-4 bg-slate-100 rounded mb-4"></div>
                <div className="w-full h-8 bg-slate-100 rounded mb-4"></div>
                <div className="w-full h-20 bg-slate-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-3 gap-10"
            >
              {filteredArticles.length > 0 ? (
                filteredArticles.map((art) => (
                  <ArticleCard key={art.id} art={art} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
                  <h3 className="text-xl font-bold text-slate-400">Aucun article ne correspond à votre recherche.</h3>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default Blog;