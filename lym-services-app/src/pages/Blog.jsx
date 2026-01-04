import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

function Blog() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      // Récupère les articles triés par date
      const q = query(collection(db, "articles"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      setArticles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchArticles();
  }, []);

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "40px" }}>Notre Actualité</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        {articles.map(article => (
          <div key={article.id} style={blogCardStyle}>
            <img src={article.image} alt={article.titre} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
            <div style={{ padding: "15px" }}>
              <h3>{article.titre}</h3>
              <p>{article.contenu.substring(0, 100)}...</p>
              <small>{article.date?.toDate().toLocaleDateString()}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const blogCardStyle = { backgroundColor: "white", borderRadius: "10px", overflow: "hidden", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" };

export default Blog;