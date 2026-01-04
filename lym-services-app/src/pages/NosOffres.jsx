import React, { useState, useEffect } from "react";
import { X, MapPin, CheckCircle, Clock, Users, Search, Filter } from "lucide-react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function NosOffres() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // --- ÉTATS POUR LA RECHERCHE & FILTRES ---
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("Tous les types");
  const [maxBudget, setMaxBudget] = useState(10000000);

  // --- ÉTATS FORMULAIRE ---
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [voyageurs, setVoyageurs] = useState(1);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  const typesVoyage = ["Tous les types", "Études", "Affaires", "Tourisme", "Immigration"];

  // Base de données locale (Sera remplacée par l'API plus tard)
  const offresInitiale = [
    { id: 1, titre: "Escapade à Dubaï", prix: 850000, img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80", lieu: "Dubaï, Émirats Arabes Unis", duree: "5 jours", maxPers: "8 voyageurs", tag: "TOURISME", services: ["Vol aller-retour", "Hôtel 5 étoiles", "Transferts"] },
    { id: 2, titre: "Séminaire à Paris", prix: 950000, img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80", lieu: "Paris, France", duree: "4 jours", maxPers: "10 voyageurs", tag: "AFFAIRES", services: ["Hôtel centre ville", "Coworking", "Petit déjeuner"] },
    { id: 3, titre: "Études au Canada", prix: 2500000, img: "https://images.pexels.com/photos/1206101/pexels-photo-1206101.jpeg?auto=compress&cs=tinysrgb&w=800", lieu: "Montréal, Canada", duree: "1 an", maxPers: "Individuel", tag: "ÉTUDES", services: ["Inscription", "Assistance visa", "Logement"] },
    { id: 4, titre: "Immigration Australie", prix: 4500000, img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80", lieu: "Sydney, Australie", duree: "6-12 mois", maxPers: "Famille", tag: "IMMIGRATION", services: ["Évaluation", "Avocat", "Traduction"] }
  ];

  // --- LOGIQUE DE RECHERCHE AUTOMATISÉE ---
  const offresFiltrees = offresInitiale.filter(offre => {
    const matchSearch = offre.titre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        offre.lieu.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === "Tous les types" || offre.tag.toUpperCase() === typeFilter.toUpperCase();
    const matchBudget = offre.prix <= maxBudget;
    return matchSearch && matchType && matchBudget;
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
        nombreVoyageurs: voyageurs, dateSouhaitee: date,
        note: message, offreChoisie: selectedOffre.titre,
        montant: selectedOffre.prix, statut: "En attente",
        dateCreation: serverTimestamp()
      });
      alert("Réservation enregistrée !");
      setIsModalOpen(false);
    } catch (error) {
      alert("Erreur base de données.");
    }
  };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <section style={{...headerStyle, padding: isMobile ? "40px 20px 80px" : "60px 10% 100px"}}>
        <h1 style={{...titleStyle, fontSize: isMobile ? "30px" : "42px"}}>Nos Offres de Voyage</h1>
        <p style={subtitleStyle}>Explorez notre catalogue automatisé</p>
      </section>

      {/* BARRE DE RECHERCHE RESPONSIVE */}
      <div style={{...searchWrapper, padding: isMobile ? "0 15px" : "0 10%"}}>
        <div style={{...searchFormCard, flexDirection: isMobile ? "column" : "row"}}>
          <div style={inputBox}>
            <label style={labelS}>Rechercher</label>
            <div style={innerInput}>
              <Search size={16}/><input type="text" placeholder="Destination..." style={cleanInput} 
              onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
          <div style={inputBox}>
            <label style={labelS}>Type de voyage</label>
            <div style={innerInput}><Filter size={16}/>
              <select style={cleanInput} onChange={(e) => setTypeFilter(e.target.value)}>
                {typesVoyage.map((t, i) => <option key={i} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={inputBox}>
            <label style={labelS}>Budget max (FCFA)</label>
            <input type="number" style={budgetInput} onChange={(e) => setMaxBudget(e.target.value)} placeholder="Ex: 1000000" />
          </div>
        </div>
      </div>

      {/* GRILLE DYNAMIQUE */}
      <div style={{...gridStyle, padding: isMobile ? "30px 20px" : "40px 10%"}}>
        {offresFiltrees.length > 0 ? offresFiltrees.map((offre) => (
          <div key={offre.id} style={{...cardStyle, transform: hoveredId === offre.id ? "translateY(-5px)" : "none", transition: "0.3s"}}
            onMouseEnter={() => setHoveredId(offre.id)} onMouseLeave={() => setHoveredId(null)}>
            <div style={{ position: "relative" }}>
              <img src={offre.img} alt={offre.titre} style={imgStyle} />
              <span style={tagStyle}>{offre.tag}</span>
            </div>
            <div style={{ padding: "20px" }}>
              <div style={cardTop}>
                <h3 style={{ margin: 0, fontSize: "18px" }}>{offre.titre}</h3>
                <span style={priceTag}>{offre.prix.toLocaleString()} FCFA</span>
              </div>
              <button onClick={() => { setSelectedOffre(offre); setIsModalOpen(true); }} style={btnDetails}>Voir les détails</button>
            </div>
          </div>
        )) : <p style={{textAlign: 'center', gridColumn: '1/-1', color: '#64748b'}}>Aucune offre ne correspond à votre budget ou destination.</p>}
      </div>

      {/* MODALE RESPONSIVE */}
      {isModalOpen && (
        <div style={modalOverlay}>
          <div style={{...modalContent, flexDirection: isMobile ? "column" : "row", maxHeight: isMobile ? "95vh" : "90vh"}}>
            <div style={{...formContainer, padding: isMobile ? "20px" : "40px"}}>
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <h2 style={{ fontSize: isMobile ? '20px' : '24px' }}>Réservation</h2>
                  {isMobile && <button onClick={() => setIsModalOpen(false)} style={{background:'none', border:'none'}}><X/></button>}
               </div>
              <form style={bookingForm} onSubmit={handleReservation}>
                <input type="text" placeholder="Nom complet *" style={fInput} onChange={(e) => setNom(e.target.value)} required />
                <input type="email" placeholder="Email *" style={fInput} onChange={(e) => setEmail(e.target.value)} required />
                <input type="text" placeholder="Téléphone *" style={fInput} onChange={(e) => setTel(e.target.value)} required />
                <div style={{ display: "flex", gap: "10px" }}>
                  <input type="number" placeholder="Voyageurs" style={{...fInput, flex:1}} onChange={(e) => setVoyageurs(e.target.value)} />
                  <input type="date" style={{...fInput, flex:1}} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <button type="submit" style={btnConfirm}>Confirmer</button>
              </form>
            </div>
            
            {!isMobile && (
              <div style={recapContainer}>
                <button onClick={() => setIsModalOpen(false)} style={closeX}><X size={20}/></button>
                <img src={selectedOffre?.img} style={recapImg} alt="dest" />
                <h3>{selectedOffre?.titre}</h3>
                <div style={metaRow}><MapPin size={14}/> {selectedOffre?.lieu}</div>
                <div style={totalBox}><div style={totalLine}><span>Total:</span> <span>{selectedOffre?.prix.toLocaleString()} FCFA</span></div></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// STYLES IDENTIQUES À TON CODE (SAUF AJUSTEMENTS RESPONSIVE CI-DESSUS)
const headerStyle = { backgroundColor: "#2563eb", color: "white" };
const titleStyle = { fontWeight: "900", margin: 0 };
const subtitleStyle = { fontSize: "18px", opacity: 0.9, marginTop: "10px" };
const searchWrapper = { marginTop: "-45px" };
const searchFormCard = { backgroundColor: "white", borderRadius: "16px", padding: "20px", display: "flex", gap: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" };
const inputBox = { flex: 1, display: "flex", flexDirection: "column", gap: "5px" };
const labelS = { fontSize: "12px", fontWeight: "700", color: "#64748b" };
const innerInput = { display: "flex", alignItems: "center", gap: "10px", border: "1px solid #e2e8f0", padding: "10px", borderRadius: "8px" };
const cleanInput = { border: "none", outline: "none", width: "100%", fontSize: "14px", background: "transparent" };
const budgetInput = { border: "1px solid #e2e8f0", padding: "10px", borderRadius: "8px", outline: "none" };
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" };
const cardStyle = { backgroundColor: "white", borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" };
const imgStyle = { width: "100%", height: "220px", objectFit: "cover" };
const tagStyle = { position: "absolute", top: "15px", left: "15px", backgroundColor: "white", color: "#2563eb", padding: "4px 12px", borderRadius: "20px", fontSize: "10px", fontWeight: "800" };
const cardTop = { display: "flex", justifyContent: "space-between", marginBottom: "20px" };
const priceTag = { color: "#2563eb", fontWeight: "900", fontSize: "18px" };
const btnDetails = { width: "100%", backgroundColor: "#2563eb", color: "white", padding: "14px", border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer" };
const modalOverlay = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 };
const modalContent = { backgroundColor: "white", borderRadius: "24px", width: "95%", maxWidth: "900px", display: "flex", overflow: "hidden" };
const formContainer = { flex: 1.2, overflowY: "auto" };
const bookingForm = { display: "flex", flexDirection: "column", gap: "15px" };
const fInput = { padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" };
const btnConfirm = { backgroundColor: "#2563eb", color: "white", padding: "16px", borderRadius: "12px", border: "none", fontWeight: "700", cursor: "pointer" };
const recapContainer = { flex: 0.8, padding: "30px", borderLeft: "1px solid #f1f5f9", position: "relative", backgroundColor: "#f8fafc" };
const recapImg = { width: "100%", height: "180px", borderRadius: "16px", objectFit: "cover" };
const metaRow = { display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#64748b", marginTop: "5px" };
const totalBox = { marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "15px" };
const totalLine = { display: "flex", justifyContent: "space-between", fontWeight: "900", color: "#2563eb", fontSize: "18px" };
const closeX = { position: "absolute", top: "15px", right: "15px", background: "none", border: "none", cursor: "pointer" };

export default NosOffres;