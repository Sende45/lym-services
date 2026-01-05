import React, { useState, useEffect } from "react";
import { X, MapPin, Clock, Filter, Globe, ChevronRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";

// --- COMPOSANT SKELETON AMÉLIORÉ ---
const PriceSkeleton = () => (
  <div style={skeletonStyle}>
    <div style={{...skeletonPulse, background: "linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)", backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite'}}></div>
  </div>
);

function NosOffres() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [tarifsDb, setTarifsDb] = useState([]);
  const [loadingTarifs, setLoadingTarifs] = useState(true);
  const [successOrder, setSuccessOrder] = useState(false);

  // Filtres
  const [paysSelectionne, setPaysSelectionne] = useState("");
  const [dureeFilter, setDureeFilter] = useState("Court Séjour");
  const [typeVisaFilter, setTypeVisaFilter] = useState("Tourisme");
  const [continentFilter, setContinentFilter] = useState("Tous");

  const categoriesDuree = ["Court Séjour", "Long Séjour"];
  const visasParDuree = {
    "Court Séjour": ["Tourisme", "Affaires", "Vacances", "Visite familiale"],
    "Long Séjour": ["Études", "Travail", "Immigration"]
  };

  const continents = ["Tous", "Afrique", "Europe", "Amérique", "Asie", "Océanie"];

  const offresParContinent = [
    { id: "afrique", nom: "Afrique", img: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=800", description: "L'authenticité et les opportunités émergentes." },
    { id: "europe", nom: "Europe", img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800", description: "L'excellence académique et le tourisme culturel." },
    { id: "amerique", nom: "Amérique", img: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80&w=800", description: "Le rêve américain et les grands espaces canadiens." },
    { id: "asie", nom: "Asie", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800", description: "Innovation technologique et dépaysement total." },
    { id: "oceanie", nom: "Océanie", img: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=800", description: "Une qualité de vie inégalée entre terre et mer." }
  ];

  useEffect(() => {
    const fetchTarifs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tarifs"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTarifsDb(data);
      } catch (err) { console.error(err); }
      finally { setTimeout(() => setLoadingTarifs(false), 800); }
    };
    fetchTarifs();
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const calculerPrixTotal = (continentId, typeVisa) => {
    const searchId = `visa_${continentId.toLowerCase()}`;
    const tarifMatch = tarifsDb.find(t => t.id.toLowerCase() === searchId || t.service === searchId);
    const base = tarifMatch ? tarifMatch.prix : 0;
    const multiplicateurs = { "Études": 1.5, "Travail": 2.0, "Immigration": 2.5, "Affaires": 1.2 };
    return base * (multiplicateurs[typeVisa] || 1);
  };

  const handleReservation = async (e) => {
    e.preventDefault();
    const finalPrice = calculerPrixTotal(selectedOffre.id, typeVisaFilter);
    try {
      await addDoc(collection(db, "reservations"), {
        nomClient: e.target[0].value,
        paysDestination: paysSelectionne,
        continent: selectedOffre.nom,
        typeVisa: typeVisaFilter,
        montantEstime: finalPrice,
        statut: "En attente",
        dateCreation: serverTimestamp()
      });
      setSuccessOrder(true);
      setTimeout(() => { setIsModalOpen(false); setSuccessOrder(false); }, 3000);
    } catch (error) { alert("Erreur de connexion."); }
  };

  const offresFiltrees = offresParContinent.filter(o => continentFilter === "Tous" || o.nom === continentFilter);

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <style>{`
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .hover-card:hover { transform: translateY(-8px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
      `}</style>

      {/* HEADER PREMIUM - REPASSE EN BLEU ROYAL */}
      <section style={{...headerStyle, padding: isMobile ? "60px 20px 100px" : "80px 10% 120px"}}>
        <div style={{maxWidth: "800px", margin: "0 auto"}}>
          <span style={badgeTop}>LYM SERVICES ELITE</span>
          <h1 style={{...titleStyle, fontSize: isMobile ? "36px" : "54px"}}>Solutions Visas sur Mesure</h1>
          <p style={subtitleStyle}>Estimation en temps réel et accompagnement diplomatique complet pour vos projets internationaux.</p>
        </div>
      </section>

      {/* SEARCH BAR FLOTTANTE */}
      <div style={{...searchWrapper, padding: isMobile ? "0 15px" : "0 10%"}}>
        <div style={searchFormCard}>
          <div style={{display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: "20px"}}>
            <SearchField label="Destination" icon={<Globe size={18} color="#2563eb"/>} placeholder="Ex: Canada, France..." onChange={(e) => setPaysSelectionne(e.target.value)} />
            <SearchSelect label="Continent" icon={<MapPin size={18}/>} options={continents} onChange={(e) => setContinentFilter(e.target.value)} />
            <SearchSelect label="Durée" icon={<Clock size={18}/>} options={categoriesDuree} onChange={(e) => {setDureeFilter(e.target.value); setTypeVisaFilter(visasParDuree[e.target.value][0]);}} />
            <SearchSelect label="Type de Visa" icon={<Filter size={18}/>} value={typeVisaFilter} options={visasParDuree[dureeFilter]} onChange={(e) => setTypeVisaFilter(e.target.value)} />
          </div>
        </div>
      </div>

      {/* GRILLE D'OFFRES */}
      <div style={{...gridStyle, padding: isMobile ? "40px 20px" : "60px 10%"}}>
        {offresFiltrees.map((zone) => {
          const prixZone = calculerPrixTotal(zone.id, typeVisaFilter);
          return (
            <div key={zone.id} className="hover-card" style={{...cardStyle, transition: 'all 0.3s ease'}}>
              <div style={{position: 'relative', height: '220px', overflow: 'hidden'}}>
                <img src={zone.img} alt={zone.nom} style={imgStyle} />
                <div style={overlayPrice}>
                   <Zap size={14} /> Traitement Express
                </div>
              </div>
              <div style={{ padding: "24px" }}>
                <h3 style={{ margin: "0 0 10px 0", fontSize: "22px", fontWeight: "800" }}>{zone.nom}</h3>
                <p style={{color: "#64748b", fontSize: "14px", marginBottom: "20px", height: "42px"}}>{zone.description}</p>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                  <span style={{fontSize: '14px', color: '#94a3b8'}}>À partir de</span>
                  {loadingTarifs ? <PriceSkeleton /> : <span style={priceTag}>{prixZone > 0 ? `${prixZone.toLocaleString()} FCFA` : "Sur devis"}</span>}
                </div>
                <button 
                  onClick={() => { setSelectedOffre(zone); setIsModalOpen(true); }} 
                  style={{...btnDetails, background: paysSelectionne ? "#2563eb" : "#cbd5e1"}}
                  disabled={!paysSelectionne}
                >
                  {paysSelectionne ? `Postuler pour le ${paysSelectionne}` : "Précisez votre destination"} <ChevronRight size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL PREMIUM */}
      {isModalOpen && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            {successOrder ? (
              <div style={{padding: "60px 40px", textAlign: "center"}}>
                <CheckCircle2 size={80} color="#059669" style={{marginBottom: "20px"}} />
                <h2 style={{fontSize: "24px", fontWeight: "900"}}>Demande Enregistrée !</h2>
                <p style={{color: "#64748b"}}>Un conseiller Lym Services vous contactera dans moins de 24h.</p>
              </div>
            ) : (
              <div style={{padding: "30px"}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom: "25px"}}>
                  <div>
                    <h2 style={{fontSize: '24px', fontWeight: "900", margin: 0}}>{paysSelectionne}</h2>
                    <span style={{color: "#2563eb", fontSize: "14px", fontWeight: "600"}}>{typeVisaFilter} • {dureeFilter}</span>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} style={{border:'none', background:'#f1f5f9', borderRadius: "50%", padding: "8px", cursor:'pointer'}}><X size={20}/></button>
                </div>
                
                <div style={priceHighlightCard}>
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <div>
                      <span style={{fontSize: "12px", opacity: 0.8, textTransform: "uppercase", fontWeight: "700"}}>Frais de dossier estimés</span>
                      <div style={{fontSize: "32px", fontWeight: "900", marginTop: "5px"}}>
                        {calculerPrixTotal(selectedOffre.id, typeVisaFilter).toLocaleString()} <span style={{fontSize: "16px"}}>FCFA</span>
                      </div>
                    </div>
                    <ShieldCheck size={40} opacity={0.3} />
                  </div>
                </div>

                <form onSubmit={handleReservation} style={{display: "flex", flexDirection: "column", gap: "20px"}}>
                  <div style={inputBox}>
                    <label style={labelForm}>NOM COMPLET DU RÉQUÉRANT</label>
                    <input type="text" placeholder="Ex: Jean Kouassi" style={fInput} required />
                  </div>
                  <button type="submit" style={btnConfirm}>Confirmer ma demande de visa</button>
                  <p style={{textAlign: "center", fontSize: "12px", color: "#94a3b8"}}>En confirmant, vous acceptez d'être recontacté par nos experts.</p>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- SOUS-COMPOSANTS DE STYLE ---
const SearchField = ({label, icon, placeholder, onChange}) => (
  <div style={inputBox}>
    <label style={labelS}>{label}</label>
    <div style={innerInput}>{icon}<input type="text" placeholder={placeholder} style={cleanInput} onChange={onChange} /></div>
  </div>
);

const SearchSelect = ({label, icon, options, onChange, value}) => (
  <div style={inputBox}>
    <label style={labelS}>{label}</label>
    <div style={innerInput}>{icon}
      <select style={cleanInput} value={value} onChange={onChange}>
        {options.map((o, i) => <option key={i} value={o}>{o}</option>)}
      </select>
    </div>
  </div>
);

// --- STYLES MODIFIÉS ---
const badgeTop = { 
  background: "rgba(255,255,255,0.2)", 
  padding: "8px 16px", 
  borderRadius: "100px", 
  fontSize: "12px", 
  fontWeight: "700", 
  letterSpacing: "1px", 
  marginBottom: "20px", 
  display: "inline-block", 
  border: "1px solid rgba(255,255,255,0.3)",
  color: "white"
};

const headerStyle = { 
  background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)", 
  color: "white", 
  textAlign: "center" 
};

// --- AUTRES STYLES ---
const overlayPrice = { position: "absolute", top: "15px", left: "15px", background: "white", padding: "6px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", color: "#059669", display: "flex", alignItems: "center", gap: "5px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" };
const labelForm = { fontSize: "11px", color: "#1e293b", fontWeight: "800", letterSpacing: "0.5px" };
const skeletonStyle = { width: "120px", height: "24px", borderRadius: "8px", overflow: "hidden" };
const skeletonPulse = { width: "100%", height: "100%" };
const priceHighlightCard = { background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)", color: "white", padding: "25px", borderRadius: "24px", marginBottom: "25px" };
const titleStyle = { fontWeight: "900", margin: 0, letterSpacing: "-1px" };
const subtitleStyle = { fontSize: "18px", opacity: 0.8, marginTop: "20px", lineHeight: "1.6" };
const searchWrapper = { marginTop: "-60px", zIndex: 100, position: "relative" };
const searchFormCard = { backgroundColor: "white", borderRadius: "24px", padding: "30px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)", border: "1px solid #e2e8f0" };
const inputBox = { display: "flex", flexDirection: "column", gap: "8px" };
const labelS = { fontSize: "11px", fontWeight: "900", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" };
const innerInput = { display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#f8fafc", padding: "14px", borderRadius: "14px", border: "1px solid #e2e8f0" };
const cleanInput = { border: "none", outline: "none", width: "100%", fontSize: "15px", fontWeight: "600", background: "transparent" };
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "40px" };
const cardStyle = { backgroundColor: "white", borderRadius: "32px", overflow: "hidden", border: "1px solid #e2e8f0" };
const imgStyle = { width: "100%", height: "100%", objectFit: "cover" };
const priceTag = { color: "#2563eb", fontWeight: "900", fontSize: "22px" };
const btnDetails = { width: "100%", color: "white", padding: "18px", border: "none", borderRadius: "18px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "0.3s" };
const modalOverlay = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(15, 23, 42, 0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, backdropFilter: "blur(8px)" };
const modalContent = { backgroundColor: "white", borderRadius: "40px", width: "95%", maxWidth: "500px", boxShadow: "0 30px 60px -12px rgba(0,0,0,0.3)" };
const fInput = { padding: "18px", borderRadius: "16px", border: "1px solid #e2e8f0", outline: "none", fontSize: "16px", backgroundColor: "#f8fafc" };
const btnConfirm = { backgroundColor: "#2563eb", color: "white", padding: "20px", borderRadius: "18px", border: "none", fontWeight: "900", fontSize: "16px", cursor: "pointer", boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.3)" };

export default NosOffres;