import { useNavigate } from "react-router-dom";
import { Star, Users, MapPin } from "lucide-react";

function Home() {
  const navigate = useNavigate();

  return (
    <main>
      {/* Section Hero */}
      <section style={heroStyle}>
        <div style={contentStyle}>
          <h1 style={heroTitle}>Découvrez le monde avec<br/>Lym Services</h1>
          <p style={heroSub}>Des voyages sur mesure pour créer des souvenirs inoubliables</p>
          <div style={btnGroup}>
            {/* Bouton Blanc -> Redirige vers Nos Offres */}
            <button 
              className="btn-hero-white" 
              onClick={() => navigate("/offres")}
            >
              Découvrir nos offres
            </button>
            
            {/* Bouton Outline -> Redirige vers Contact */}
            <button 
              className="btn-hero-outline" 
              onClick={() => navigate("/contact")}
            >
              Nous contacter
            </button>
          </div>
        </div>
      </section>

      {/* Section Expertise */}
      <section style={expertiseStyle}>
        <div style={cardExpert}>
          <div style={iconCircle}><Star color="#2563eb" size={30} /></div>
          <h3 style={expertTitle}>Expertise</h3>
          <p style={expertText}>Plus de 10 ans d'expérience dans l'organisation de voyages exceptionnels</p>
        </div>
        <div style={cardExpert}>
          <div style={iconCircle}><Users color="#2563eb" size={30} /></div>
          <h3 style={expertTitle}>Sur mesure</h3>
          <p style={expertText}>Des voyages personnalisés adaptés à vos besoins et votre budget</p>
        </div>
        <div style={cardExpert}>
          <div style={iconCircle}><MapPin color="#2563eb" size={30} /></div>
          <h3 style={expertTitle}>Destinations</h3>
          <p style={expertText}>Accès à plus de 100 destinations dans le monde entier</p>
        </div>
      </section>

      {/* Section Titre Offres */}
      <div style={{padding: '0 10%', marginBottom: '60px'}}>
        <h2 style={{textAlign: 'center', fontSize: '36px', fontWeight: '800', margin: '0 0 10px 0'}}>Nos Offres Vedettes</h2>
        <p style={{textAlign: 'center', color: '#64748b', fontSize: '18px'}}>Découvrez nos destinations les plus populaires</p>
      </div>

      {/* Section Call to Action */}
      <section style={ctaSection}>
        <h2 style={ctaTitle}>Prêt à partir à l'aventure ?</h2>
        <p style={ctaText}>Contactez-nous dès aujourd'hui pour planifier votre prochain voyage</p>
        <button style={btnCta} onClick={() => navigate("/contact")}>
          Demander un devis gratuit
        </button>
      </section>
    </main>
  );
}

// Styles CSS-in-JS (Les classes pour les clics sont dans le fichier CSS plus bas)
const heroStyle = { height: "85vh", background: "linear-gradient(135deg, #2563eb 0%, #0891b2 100%)", display: "flex", alignItems: "center", padding: "0 10%", color: "white" };
const contentStyle = { maxWidth: "800px" };
const heroTitle = { fontSize: "64px", fontWeight: "800", marginBottom: "20px", lineHeight: "1.1" };
const heroSub = { fontSize: "20px", marginBottom: "40px", opacity: "0.9" };
const btnGroup = { display: "flex", gap: "20px" };
const expertiseStyle = { display: "flex", justifyContent: "space-between", padding: "100px 10%", textAlign: "center", gap: "40px" };
const cardExpert = { flex: 1, display: "flex", flexDirection: "column", alignItems: "center" };
const iconCircle = { backgroundColor: "#eff6ff", padding: "20px", borderRadius: "50%", marginBottom: "20px" };
const expertTitle = { fontSize: "22px", fontWeight: "700", marginBottom: "15px", color: "#1e293b" };
const expertText = { color: "#64748b", lineHeight: "1.6", fontSize: "15px" };
const ctaSection = { backgroundColor: "#2563eb", color: "#ffffff", padding: "100px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "25px" };
const ctaTitle = { fontSize: "42px", fontWeight: "800", margin: 0 };
const ctaText = { fontSize: "20px", opacity: 0.9, maxWidth: "600px", margin: "0 auto" };
const btnCta = { backgroundColor: "#ffffff", color: "#2563eb", padding: "18px 40px", borderRadius: "12px", border: "none", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" };

export default Home;