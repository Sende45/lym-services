import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { ChevronLeft, Calendar, User } from "lucide-react";

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setArticle(docSnap.data());
      }
      setLoading(false);
    };
    fetchArticle();
  }, [id]);

  if (loading) return <div className="p-20 text-center">Chargement...</div>;
  if (!article) return <div className="p-20 text-center">Article introuvable.</div>;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <img src={article.image} alt={article.titre} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <Link to="/blog" className="absolute top-10 left-10 bg-white p-3 rounded-full shadow-xl hover:scale-110 transition-transform">
          <ChevronLeft />
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 -mt-32 relative z-10">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl">
          <h1 className="text-4xl font-black text-slate-900 mb-6">{article.titre}</h1>
          <div className="flex gap-6 text-slate-400 text-sm mb-10 border-b pb-6">
            <span className="flex items-center gap-2"><Calendar size={16}/> {article.date?.seconds ? new Date(article.date.seconds * 1000).toLocaleDateString() : 'Date inconnue'}</span>
            <span className="flex items-center gap-2"><User size={16}/> Lym Services</span>
          </div>
          {/* On utilise white-space: pre-wrap pour garder les sauts de ligne du contenu */}
          <div className="text-slate-600 leading-loose text-lg whitespace-pre-wrap">
            {article.contenu}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleDetail;