import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import NosOffres from "./pages/NosOffres";
import Terrains from "./pages/Terrains"; // Corrigé : Ajout du 's' pour correspondre au fichier
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import { db } from "./firebase"; // Corrigé : "./firebase" car le fichier est dans le même dossier
import Admin from "./pages/Admin-fix";
import Login from "./pages/Login";
import Consultation from "./pages/Consultation";

function App() {
  return (
    <> 
      <Header />
      <div style={{ paddingTop: "70px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/offres" element={<NosOffres />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/terrains" element={<Terrains />} /> {/* Utilise maintenant le bon composant avec 's' */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/consultation" element={<Consultation />} />

        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;