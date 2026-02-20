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
    <div className="flex flex-col min-h-screen">
      {/* 1. Le Header reste en haut */}
      <Header />

      {/* 2. Le contenu principal avec une marge forcée de 80px (mt-20) */}
      <main className="flex-grow mt-20">
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

      {/* 3. Le Footer en bas */}
      <Footer />
    </div>
  );
}

export default App;