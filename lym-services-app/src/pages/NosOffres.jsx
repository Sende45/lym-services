import React, { useState, useEffect } from "react";
import { X, MapPin, CheckCircle, Clock, Users, Search, Filter, Globe } from "lucide-react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function NosOffres() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // --- ÉTATS POUR LA RECHERCHE & FILTRES ---
  const [searchTerm, setSearchTerm] = useState("");
  const [dureeFilter, setDureeFilter] = useState("Tous"); // Court ou Long séjour
  const [typeVisaFilter, setTypeVisaFilter] = useState("Tous"); 
  const [maxBudget, setMaxBudget] = useState(10000000);

  // --- ÉTATS FORMULAIRE ---
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [voyageurs, setVoyageurs] = useState(1);
  const [date, setDate] = useState("");

  // Catégories demandées
  const categoriesDuree = ["Tous", "Court Séjour", "Long Séjour"];
  const visasDisponibles = {
    "Tous": ["Tous"],
    "Court Séjour": ["Tourisme", "Affaires", "Vacances", "Visite familiale"],
    "Long Séjour": ["Études", "Travail"]
  };

  // Base de données simulée (Prête pour une API mondiale)
  const offresInitiale = [
    { id: 1, titre: "Visa Tourisme Dubaï", prix: 850000, img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800", lieu: "Émirats Arabes Unis", duree: "30 jours", sejour: "Court Séjour", type: "Tourisme", services: ["Frais de visa", "Assurance voyage"] },
    { id: 2, titre: "Business Paris", prix: 950000, img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800", lieu: "France", duree: "15 jours", sejour: "Court Séjour", type: "Affaires", services: ["Visa Schengen", "Accompagnement"] },
    { id: 3, titre: "Études Canada", prix: 2500000, img: "https://images.pexels.com/photos/1206101/pexels-photo-1206101.jpeg?w=800", lieu: "Canada", duree: "1-4 ans", sejour: "Long Séjour", type: "Études", services: ["CAQ & Permis d'étude", "Inscription"] },
    { id: 4, titre: "Travail Australie", prix: 4500000, img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800", lieu: "Australie", duree: "2 ans", sejour: "Long Séjour", type: "Travail", services: ["Sponsoring", "Visa de travail"] }
  ];

  // --- LOGIQUE DE FILTRAGE MONDIALE ---
  const offresFiltrees = offresInitiale.filter(offre => {
    const matchSearch = offre.lieu.toLowerCase().includes(searchTerm.toLowerCase()) || offre.titre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDuree = dureeFilter === "Tous" || offre.sejour === dureeFilter;
    const matchVisa = typeVisaFilter === "Tous" || offre.type === typeVisaFilter;
    const matchBudget = offre.prix <= maxBudget;
    return matchSearch && matchDuree && matchVisa && matchBudget;
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleReservation = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "reservations"), {
        nomClient: nom, emailClient: email, telephone: tel,
        offreChoisie: selectedOffre.titre, typeVisa: selectedOffre.type,
        montant: selectedOffre.prix, statut: "En attente", dateCreation: serverTimestamp()
      });
      alert("Demande de visa envoyée !");
      setIsModalOpen(false);
    } catch (error) { alert("Erreur Firebase."); }
  };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <section style={{...headerStyle, padding: isMobile ? "40px 20px 80px" : "60px 10% 100px"}}>
        <h1 style={{...titleStyle, fontSize: isMobile ? "28px" : "42px"}}>🌍 Destinations Mondiales</h1>
        <p style={subtitleStyle}>Gestion automatisée des visas Court et Long séjour</p>
      </section>

      {/* RECHERCHE AVANCÉE */}
      <div style={{...searchWrapper, padding: isMobile ? "0 15px" : "0 10%"}}>
        <div style={{...searchFormCard, flexDirection: "column", gap: "15px"}}>
          <div style={{display: "flex", gap: "15px", flexDirection: isMobile ? "column" : "row", width: "100%"}}>
            <div style={inputBox}>
              <label style={labelS}>Destination (Monde)</label>
              <div style={innerInput}><Search size={16}/><input type="text" placeholder="Pays ou ville..." style={cleanInput} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            </div>
            <div style={inputBox}>
              <label style={labelS}>Durée du séjour</label>
              <div style={innerInput}><Clock size={16}/>
                <select style={cleanInput} onChange={(e) => {setDureeFilter(e.target.value); setTypeVisaFilter("Tous");}}>
                  {categoriesDuree.map((d, i) => <option key={i} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div style={{display: "flex", gap: "15px", flexDirection: isMobile ? "column" : "row", width: "100%"}}>
            <div style={inputBox}>
              <label style={labelS}>Type de Visa spécifique</label>
              <div style={innerInput}><Filter size={16}/>
                <select style={cleanInput} value={typeVisaFilter} onChange={(e) => setTypeVisaFilter(e.target.value)}>
                  {visasDisponibles[dureeFilter].map((v, i) => <option key={i} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <div style={inputBox}>
              <label style={labelS}>Budget max (FCFA)</label>
              <input type="number" style={budgetInput} placeholder="Ex: 5000000" onChange={(e) => setMaxBudget(e.target.value || 10000000)} />
            </div>
          </div>
        </div>
      </div>

      {/* AFFICHAGE DES OFFRES */}
      <div style={{...gridStyle, padding: isMobile ? "30px 20px" : "40px 10%"}}>
        {offresFiltrees.map((offre) => (
          <div key={offre.id} style={cardStyle}>
            <div style={{ position: "relative" }}>
              <img src={offre.img} alt={offre.titre} style={imgStyle} />
              <span style={{...tagStyle, backgroundColor: offre.sejour === "Long Séjour" ? "#1e293b" : "#2563eb", color: "white"}}>
                {offre.type}
              </span>
            </div>
            <div style={{ padding: "20px" }}>
              <div style={cardTop}>
                <h3 style={{ margin: 0, fontSize: "17px" }}>{offre.titre}</h3>
                <span style={priceTag}>{offre.prix.toLocaleString()} FCFA</span>
              </div>
              <div style={{display: "flex", alignItems: "center", gap: "5px", color: "#64748b", fontSize: "13px", marginBottom: "15px"}}>
                <MapPin size={14}/> {offre.lieu} • <Clock size={14}/> {offre.duree}
              </div>
              <button onClick={() => { setSelectedOffre(offre); setIsModalOpen(true); }} style={btnDetails}>Engager la procédure</button>
            </div>
          </div>
        ))}
      </div>

      {/* MODALE DE RÉSERVATION */}
      {isModalOpen && (
        <div style={modalOverlay}>
          <div style={{...modalContent, flexDirection: isMobile ? "column" : "row"}}>
            <div style={formContainer}>
              <div style={{display:'flex', justifyContent:'space-between', padding: "30px"}}>
                <h2>Procédure Visa {selectedOffre?.type}</h2>
                <button onClick={() => setIsModalOpen(false)} style={{border:'none', background:'none'}}><X/></button>
              </div>
              <form style={{...bookingForm, padding: "0 30px 30px"}} onSubmit={handleReservation}>
                <input type="text" placeholder="Nom complet" style={fInput} onChange={(e) => setNom(e.target.value)} required />
                <input type="email" placeholder="Email" style={fInput} onChange={(e) => setEmail(e.target.value)} required />
                <input type="text" placeholder="Téléphone" style={fInput} onChange={(e) => setTel(e.target.value)} required />
                <button type="submit" style={btnConfirm}>Lancer ma demande</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// STYLES (Conservés et optimisés)
const headerStyle = { backgroundColor: "#2563eb", color: "white", textAlign: "center" };
const titleStyle = { fontWeight: "900", margin: 0 };
const subtitleStyle = { fontSize: "16px", opacity: 0.9, marginTop: "10px" };
const searchWrapper = { marginTop: "-60px" };
const searchFormCard = { backgroundColor: "white", borderRadius: "20px", padding: "25px", display: "flex", boxShadow: "0 15px 35px rgba(0,0,0,0.1)" };
const inputBox = { flex: 1, display: "flex", flexDirection: "column", gap: "5px" };
const labelS = { fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" };
const innerInput = { display: "flex", alignItems: "center", gap: "10px", border: "1px solid #e2e8f0", padding: "12px", borderRadius: "10px" };
const cleanInput = { border: "none", outline: "none", width: "100%", fontSize: "14px" };
const budgetInput = { border: "1px solid #e2e8f0", padding: "12px", borderRadius: "10px", outline: "none" };
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "25px" };
const cardStyle = { backgroundColor: "white", borderRadius: "24px", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" };
const imgStyle = { width: "100%", height: "200px", objectFit: "cover" };
const tagStyle = { position: "absolute", top: "15px", left: "15px", padding: "5px 15px", borderRadius: "30px", fontSize: "10px", fontWeight: "800" };
const cardTop = { display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" };
const priceTag = { color: "#2563eb", fontWeight: "900", fontSize: "16px" };
const btnDetails = { width: "100%", backgroundColor: "#2563eb", color: "white", padding: "14px", border: "none", borderRadius: "14px", fontWeight: "700", cursor: "pointer" };
const modalOverlay = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 };
const modalContent = { backgroundColor: "white", borderRadius: "28px", width: "90%", maxWidth: "500px", overflow: "hidden" };
const formContainer = { width: "100%" };
const bookingForm = { display: "flex", flexDirection: "column", gap: "12px" };
const fInput = { padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "14px" };
const btnConfirm = { backgroundColor: "#2563eb", color: "white", padding: "16px", borderRadius: "14px", border: "none", fontWeight: "700", marginTop: "10px" };

export default NosOffres;