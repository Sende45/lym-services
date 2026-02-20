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
    /* On utilise h-screen avec overflow-x-hidden pour éviter 
       que le téléphone ne puisse scroller sur les côtés.
    */
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      
      {/* 1. Header en position fixe */}
      <Header />

      {/* MODIFICATION MAJEURE : 
          - On remplace mt-20 par pt-20 (padding-top).
          - Le padding-top crée un espace "physique" à l'intérieur du bloc.
          - On s'assure que le contenu ne glisse jamais sous le header.
      */}
      <main className="flex-grow pt-20 md:pt-20">
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