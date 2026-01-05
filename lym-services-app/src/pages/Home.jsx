import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Users, MapPin, Send, Mail, CheckCircle, Bell, ChevronRight } from "lucide-react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Simulateur from "../components/Simulateur";

// --- COMPOSANT ANIMATION AU SCROLL ---
const FadeIn = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(domRef.current);
        }
      });
    }, { threshold: 0.1 });

    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={domRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
};

// --- BOUTON DYNAMIQUE ---
const DynamicButton = ({ children, onClick, primary = false, fullWidth = false, type = "button" }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button 
      type={type}
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick} 
      style={{
        padding: '16px 32px',
        borderRadius: '14px',
        border: 'none',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        width: fullWidth ? "100%" : "auto",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        transform: isHovered ? 'scale(1.05) translateY(-2px)' : 'scale(1) translateY(0)',
        backgroundColor: primary ? (isHovered ? '#1d4ed8' : '#2563eb') : (isHovered ? '#f1f5f9' : '#ffffff'),
        color: primary ? '#ffffff' : '#2563eb',
        boxShadow: isHovered ? '0 20px 25px -5px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
      }}
    >
      {children}
    </button>
  );
};

function Home() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // États pour la newsletter
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "newsletters"), {
        email: email,
        dateInscription: serverTimestamp(),
      });
      const message = `Bonjour Lym Services ! 👋%0A%0AJe m'abonne à la newsletter.%0A%0AEmail : *${email}*`;
      setSuccess(true);
      setTimeout(() => {
        window.open(`https://wa.me/2250102030405?text=${message}`, "_blank");
        setSuccess(false);
        setEmail("");
      }, 2000);
    } catch (err) {
      alert("Erreur réseau");
    }
    setLoading(false);
  };

  return (
    <main style={{ overflowX: 'hidden', backgroundColor: '#f8fafc' }}>
      
      {/* 1. HERO SECTION */}
      <section style={heroStyle}>
        <FadeIn>
          <div style={contentStyle}>
            <h1 style={{ ...heroTitle, fontSize: isMobile ? "42px" : "68px" }}>
              L'excellence pour<br/>vos projets de voyage
            </h1>
            <p style={heroSub}>Assistance visa et séjours sur mesure avec Lym Services.</p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <DynamicButton onClick={() => navigate("/offres")} fullWidth={isMobile}>
                Explorer les destinations <ChevronRight size={18} />
                </DynamicButton>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 2. SIMULATEUR */}
      <section style={{ marginTop: "-80px", padding: isMobile ? "0 15px" : "0 10%", position: 'relative', zIndex: 10 }}>
        <FadeIn delay={0.2}>
          <Simulateur />
        </FadeIn>
      </section>

      {/* 3. EXPERTISE */}
      <section style={{ 
          display: "flex", 
          flexDirection: isMobile ? "column" : "row", 
          gap: "30px", 
          padding: isMobile ? "60px 20px" : "100px 10%" 
        }}>
        <FadeIn delay={0.1}>
          <div style={cardExpert}>
            <div style={iconCircle}><Star color="#2563eb" size={30} /></div>
            <h3 style={expertTitle}>Expertise</h3>
            <p style={expertText}>10 ans d'accompagnement pour vos visas et voyages.</p>
          </div>
        </FadeIn>
        
        <FadeIn delay={0.3}>
          <div style={cardExpert}>
            <div style={iconCircle}><Users color="#2563eb" size={30} /></div>
            <h3 style={expertTitle}>Proximité</h3>
            <p style={expertText}>Un conseiller dédié pour chaque étape de votre projet.</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.5}>
          <div style={cardExpert}>
            <div style={iconCircle}><MapPin color="#2563eb" size={30} /></div>
            <h3 style={expertTitle}>Réseau</h3>
            <p style={expertText}>Accès privilégié aux meilleures offres internationales.</p>
          </div>
        </FadeIn>
      </section>

      {/* 4. NEWSLETTER CORRIGÉE */}
      <section style={{ padding: isMobile ? '40px 20px' : '40px 10%' }}>
        <FadeIn delay={0.2}>
            <div style={newsCard}>
                <Bell size={40} color="#2563eb" style={{ marginBottom: '20px' }} />
                <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '10px' }}>Ne ratez aucune opportunité</h2>
                <p style={{ color: '#64748b', marginBottom: '30px' }}>Inscrivez-vous à notre newsletter pour les bourses et promos.</p>
                
                {!success ? (
                  <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '15px', flexDirection: isMobile ? 'column' : 'row', maxWidth: '600px', margin: '0 auto' }}>
                    <div style={{ flex: 2, display: 'flex', alignItems: 'center', background: '#f1f5f9', padding: '0 20px', borderRadius: '15px' }}>
                      <Mail color="#94a3b8" size={20} />
                      <input 
                        required type="email" placeholder="Votre email..." 
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        style={{ border: 'none', background: 'transparent', padding: '18px 10px', width: '100%', outline: 'none' }}
                      />
                    </div>
                    <DynamicButton primary type="submit" fullWidth={isMobile}>
                      {loading ? "Chargement..." : "S'abonner"} <Send size={18} />
                    </DynamicButton>
                  </form>
                ) : (
                  <div style={{ color: '#15803d', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <CheckCircle size={24} /> Inscription réussie !
                  </div>
                )}
            </div>
        </FadeIn>
      </section>

      {/* 5. CTA FINAL */}
      <section style={ctaSection}>
        <FadeIn>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: isMobile ? "32px" : "48px", fontWeight: "900", color: 'white', marginBottom: '20px' }}>Prêt à décoller ?</h2>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <DynamicButton onClick={() => navigate("/contact")} fullWidth={isMobile}>
                Obtenir mon devis gratuit
                </DynamicButton>
            </div>
          </div>
        </FadeIn>
      </section>

    </main>
  );
}

// --- STYLES ---
const heroStyle = { 
  background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)", 
  padding: "120px 10%", color: "white", textAlign: 'center' 
};
const contentStyle = { maxWidth: "900px", margin: "0 auto" };
const heroTitle = { fontWeight: "900", marginBottom: "20px", lineHeight: "1.1" };
const heroSub = { fontSize: "20px", marginBottom: "40px", opacity: 0.9 };
const cardExpert = { flex: 1, textAlign: 'center', background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' };
const iconCircle = { background: '#eff6ff', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' };
const expertTitle = { fontWeight: '800', marginBottom: '10px', fontSize: '20px' };
const expertText = { color: '#64748b', fontSize: '15px', lineHeight: '1.5' };
const ctaSection = { backgroundColor: "#2563eb", padding: "100px 20px" };
const newsCard = { background: 'white', padding: isMobile => isMobile ? '40px 20px' : '60px', borderRadius: '30px', textAlign: 'center', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' };

export default Home;