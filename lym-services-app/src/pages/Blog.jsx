import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Calendar, ArrowRight, Search, Clock } from "lucide-react";
import { useInView } from "react-intersection-observer";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800";

// --- Composant enfant pour chaque article ---
function ArticleCard({ art }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div
      ref={ref}
      style={{
        backgroundColor: "white",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
        transform: inView ? "translateY(0)" : "translateY(30px)",
        opacity: inView ? 1 : 0,
        transition: "all 0.6s ease-out",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px) scale(1.02)";
        e.currentTarget.style.boxShadow = "0 15px 25px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.05)";
      }}
    >
      <div style={{ height: "220px", background: "#e2e8f0", overflow: "hidden" }}>
        <img
          src={art.image || FALLBACK_IMAGE}
          alt={art.titre || "Article"}
          onError={(e) => (e.target.src = FALLBACK_IMAGE)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: inView ? 1 : 0,
            transition: "opacity 0.6s ease-out",
          }}
        />
      </div>
      <div style={{ padding: "25px" }}>
        <h3 style={{ fontWeight: "800" }}>{art.titre || "Titre de l'article"}</h3>
        <p style={{ color: "#64748b" }}>
          {art.contenu ? art.contenu.substring(0, 100) + "..." : "Consultez cet article pour en savoir plus..."}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
          <span style={{ fontSize: "12px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "5px" }}>
            <Clock size={14} /> 3 min • <Calendar size={14} /> {art.date}
          </span>
          <button
            style={{
              background: "none",
              border: "none",
              color: "#2563eb",
              fontWeight: "800",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            Lire <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Composant principal Blog ---
function Blog() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => {
          const data = doc.data();
          let dateTexte = "Date non définie";
          if (data.date?.seconds) {
            dateTexte = new Date(data.date.seconds * 1000).toLocaleDateString();
          } else if (data.date) {
            dateTexte = String(data.date);
          }

          let imageUrl = FALLBACK_IMAGE;
          if (typeof data.image === "string" && data.image.startsWith("http")) {
            imageUrl = data.image;
          } else if (Array.isArray(data.image) && data.image[0]) {
            imageUrl = data.image[0];
          } else if (data.image?.url) {
            imageUrl = data.image.url;
          }

          return { id: doc.id, ...data, date: dateTexte, image: imageUrl };
        });
        setArticles(docs);
        setFilteredArticles(docs);
        setLoading(false);
      },
      (error) => {
        console.error("Erreur : ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const filtered = articles.filter((a) =>
      (a.titre || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArticles(filtered);
  }, [searchTerm, articles]);

  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f8fafc" }}>
        <div style={{ width: "40px", height: "40px", border: "4px solid #ddd", borderTop: "4px solid #2563eb", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
        <style>{`@keyframes spin {0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);}}`}</style>
      </div>
    );

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* HEADER */}
      <header style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)", padding: "80px 20px 120px", textAlign: "center", color: "white" }}>
        <h1 style={{ fontSize: "2.8rem", fontWeight: "900" }}>Blog LYM Services</h1>
        <p style={{ opacity: 0.9, marginBottom: "30px" }}>Toutes les clés pour réussir votre expatriation</p>
        <div style={{ maxWidth: "600px", margin: "0 auto", position: "relative" }}>
          <Search size={20} color="#94a3b8" style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)" }} />
          <input type="text" placeholder="Rechercher un pays ou un type de visa..." style={{ width: "100%", padding: "18px 20px 18px 55px", borderRadius: "15px", border: "none", outline: "none" }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </header>

      {/* ARTICLES */}
      <div style={{ maxWidth: "1200px", margin: "-60px auto 0", padding: "0 20px 100px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "30px" }}>
        {filteredArticles.map((art) => (
          <ArticleCard key={art.id} art={art} />
        ))}
      </div>
    </div>
  );
}

export default Blog;
