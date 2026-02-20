import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import NosOffres from "./pages/NosOffres";
import Terrains from "./pages/Terrains"; 
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
// --- AJOUT DE L'IMPORT ICI ---
import ArticleDetail from "./pages/ArticleDetail"; 
import { db } from "./firebase"; 
import Admin from "./pages/Admin-fix";
import Login from "./pages/Login";
import Consultation from "./pages/Consultation";
import AdminTarifs from "./pages/AdminTarifs";

function App() {
  return (
    <> 
      <Header />
      <div style={{ paddingTop: "70px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/offres" element={<NosOffres />} />
          <Route path="/blog" element={<Blog />} />
          
          {/* --- AJOUT DE LA ROUTE DYNAMIQUE ICI --- */}
          <Route path="/blog/:id" element={<ArticleDetail />} />
          
          <Route path="/terrains" element={<Terrains />} /> 
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/admintarif" element={<AdminTarifs />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;