import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import NosOffres from "./pages/NosOffres";
import Terrains from "./pages/Terrains"; 
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import ArticleDetail from "./pages/ArticleDetail"; 
import { db } from "./firebase"; 
import Admin from "./pages/Admin-fix";
import Login from "./pages/Login";
import Consultation from "./pages/Consultation";
import AdminTarifs from "./pages/AdminTarifs";

function App() {
  return (
    /* On utilise flex-col et min-h-screen pour que le footer soit toujours en bas.
       overflow-x-clip empêche les débordements horizontaux tout en restant fluide.
    */
    <div className="flex flex-col min-h-screen w-full overflow-x-clip bg-white">
      
      {/* 1. Header en position fixe (z-index géré dans Header.js) */}
      <Header />

      {/* MODIFICATION : 
          - pt-20 (80px) match parfaitement avec le h-20 du header.
          - On ajoute 'relative' pour que le flux de rendu soit propre.
          - 'z-10' pour que les pages restent en dessous du header (z-1000).
      */}
      <main className="flex-grow pt-20 relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/offres" element={<NosOffres />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<ArticleDetail />} />
          <Route path="/terrains" element={<Terrains />} /> 
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/admintarif" element={<AdminTarifs />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;