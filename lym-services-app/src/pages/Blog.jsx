import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

function Blog() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setArticles(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div style={loaderContainer}><div style={spinnerStyle}></div></div>;

  return (
    <div style={{ padding: "60px 20px", maxWidth: "1200px", margin: "0 auto", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <header style={{ textAlign: "center", marginBottom: "50px" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#0f172a" }}>LYM Business Blog</h1>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "30px" }}>
        {articles.map((article, index) => (
          <article key={article.id} style={blogCardStyle}>
            {/* --- SECTION IMAGE INSTANTANÉE --- */}
            <div style={{ width: "100%", height: "220px", backgroundColor: "#f1f5f9", position: "relative" }}>
              <img 
                src={article.image || "https://via.placeholder.com/400x220?text=LYM+Business"} 
                alt={article.titre} 
                // fetchpriority="high" pour les 2 premiers articles (haut de page)
                fetchpriority={index < 2 ? "high" : "auto"}
                // decoding="sync" force l'affichage immédiat dès que les données arrivent
                decoding="sync"
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "cover", 
                  display: "block",
                  transition: "opacity 0.2s ease-in-out" // Transition très rapide
                }} 
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000";
                }}
              />
            </div>

            <div style={{ padding: "20px" }}>
              <h3 style={{ fontSize: "1.25rem", color: "#1e293b", fontWeight: "700" }}>{article.titre}</h3>
              <p style={{ color: "#475569", fontSize: "0.95rem" }}>
                {article.contenu ? article.contenu.substring(0, 100) + "..." : ""}
              </p>
              <div style={{ marginTop: "15px", borderTop: "1px solid #f1f5f9", paddingTop: "15px" }}>
                 <button style={readMoreBtn}>Lire plus</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// --- STYLES (Inchangés mais gardés pour cohérence) ---
const loaderContainer = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' };
const spinnerStyle = { width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #2563eb', borderRadius: '50%' };
const blogCardStyle = { backgroundColor: "white", borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" };
const readMoreBtn = { background: "none", border: "none", color: "#2563eb", fontWeight: "700", cursor: "pointer" };

export default Blog;