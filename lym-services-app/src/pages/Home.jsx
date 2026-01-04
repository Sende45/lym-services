import { useNavigate } from "react-router-dom";
import { Star, Users, MapPin } from "lucide-react";
import { useState, useEffect } from "react";

function Home() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Détecter le changement de taille d'écran
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main style={{ overflowX: 'hidden' }}>
      {/* Section Hero */}
      <section style={{
        ...heroStyle,
        height: isMobile ? "auto" : "85vh",
        padding: isMobile ? "80px 20px" : "0 10%",
        textAlign: isMobile ? "center" : "left"
      }}>
        <div style={contentStyle}>
          <h1 style={{
            ...heroTitle,
            fontSize: isMobile ? "36px" : "64px"
          }}>Découvrez le monde avec<br/>Lym Services</h1>
          <p style={heroSub}>Des voyages sur mesure pour créer des souvenirs inoubliables</p>
          <div style={{
            ...btnGroup,
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center"
          }}>
            <button 
              className="btn-hero-white" 
              onClick={() => navigate("/offres")}
              style={{ width: isMobile ? "100%" : "auto" }}
            >
              Découvrir nos offres
            </button>
            <button 
              className="btn-hero-outline" 
              onClick={() => navigate("/contact")}
              style={{ width: isMobile ? "100%" : "auto" }}
            >
              Nous contacter
            </button>
          </div>
        </div>
      </section>

      {/* Section Expertise */}
      <section style={{
        ...expertiseStyle,
        flexDirection: isMobile ? "column" : "row",
        padding: isMobile ? "60px 20px" : "100px 10%",
      }}>
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
      <div style={{ padding: isMobile ? '0 20px' : '0 10%', marginBottom: '40px' }}>
        <h2 style={{ 
          textAlign: 'center', 
          fontSize: isMobile ? '28px' : '36px', 
          fontWeight: '800', 
          margin: '0 0 10px 0' 
        }}>Nos Offres Vedettes</h2>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '16px' }}>Découvrez nos destinations les plus populaires</p>
      </div>

      {/* Section Call to Action */}
      <section style={{
        ...ctaSection,
        padding: isMobile ? "60px 20px" : "100px 20px",
      }}>
        <h2 style={{
          ...ctaTitle,
          fontSize: isMobile ? "28px" : "42px"
        }}>Prêt à partir à l'aventure ?</h2>
        <p style={ctaText}>Contactez-nous dès aujourd'hui pour planifier votre prochain voyage</p>
        <button style={{
          ...btnCta,
          width: isMobile ? "100%" : "auto"
        }} onClick={() => navigate("/contact")}>
          Demander un devis gratuit
        </button>
      </section>
    </main>
  );
}

// Styles de base
const heroStyle = { background: "linear-gradient(135deg, #2563eb 0%, #0891b2 100%)", display: "flex", alignItems: "center", color: "white" };
const contentStyle = { maxWidth: "800px", width: "100%" };
const heroTitle = { fontWeight: "800", marginBottom: "20px", lineHeight: "1.2" };
const heroSub = { fontSize: "18px", marginBottom: "30px", opacity: "0.9" };
const btnGroup = { display: "flex", gap: "15px" };
const expertiseStyle = { display: "flex", justifyContent: "space-between", textAlign: "center", gap: "40px" };
const cardExpert = { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" };
const iconCircle = { backgroundColor: "#eff6ff", padding: "20px", borderRadius: "50%", marginBottom: "15px" };
const expertTitle = { fontSize: "20px", fontWeight: "700", marginBottom: "10px", color: "#1e293b" };
const expertText = { color: "#64748b", lineHeight: "1.5", fontSize: "14px" };
const ctaSection = { backgroundColor: "#2563eb", color: "#ffffff", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" };
const ctaTitle = { fontWeight: "800", margin: 0 };
const ctaText = { fontSize: "18px", opacity: 0.9, maxWidth: "600px" };
const btnCta = { backgroundColor: "#ffffff", color: "#2563eb", padding: "16px 30px", borderRadius: "10px", border: "none", fontSize: "16px", fontWeight: "700", cursor: "pointer" };

export default Home;