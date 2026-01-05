import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Calendar, ArrowRight, Search, Clock } from "lucide-react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800";

// ArticleCard avec overlay hover
function ArticleCard({ art }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        borderRadius: "24px",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: hover
          ? "0 15px 25px rgba(0,0,0,0.15)"
          : "0 10px 20px rgba(0,0,0,0.05)",
        transform: hover ? "scale(1.02)" : "scale(1)",
        transition: "all 0.3s ease-in-out",
      }}
    >
      {/* IMAGE */}
      <div style={{ height: "220px", width: "100%", overflow: "hidden", position: "relative" }}>
        <img
          src={art.image || FALLBACK_IMAGE}
          alt={art.titre || "Article"}
          onError={(e) => (e.target.src = FALLBACK_IMAGE)}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />

        {/* OVERLAY */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0))",
            opacity: hover ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
          }}
        />
      </div>

      {/* CONTENU */}
      <div style={{ padding: "25px", position: "relative", zIndex: 1 }}>
        <h3 style={{ fontWeight: "800", color: hover ? "#2563eb" : "#1e293b", transition: "color 0.3s" }}>
          {art.titre || "Titre de l'article"}
        </h3>
        <p style={{ color: "#64748b", opacity: hover ? 0.7 : 1, transition: "opacity 0.3s" }}>
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

// Blog principal
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
          if (typeof data.image === "string" && data.image.startsWith("http")) imageUrl = data.image;
          else if (Array.isArray(data.image) && data.image[0]) imageUrl = data.image[0];
          else if (data.image?.url) imageUrl = data.image.url;

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

  if (loading) return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Chargement...</div>;

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <header style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)", padding: "80px 20px 120px", textAlign: "center", color: "white" }}>
        <h1 style={{ fontSize: "2.8rem", fontWeight: "900" }}>Blog LYM Services</h1>
        <p style={{ opacity: 0.9, marginBottom: "30px" }}>Toutes les clés pour réussir votre expatriation</p>
        <div style={{ maxWidth: "600px", margin: "0 auto", position: "relative" }}>
          <Search size={20} color="#94a3b8" style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            placeholder="Rechercher un pays ou un type de visa..."
            style={{ width: "100%", padding: "18px 20px 18px 55px", borderRadius: "15px", border: "none", outline: "none" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div style={{ maxWidth: "1200px", margin: "-60px auto 0", padding: "0 20px 100px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "30px" }}>
        {filteredArticles.map((art) => (
          <ArticleCard key={art.id} art={art} />
        ))}
      </div>
    </div>
  );
}

export default Blog;
