import React, { useState, useEffect } from "react";
import { X, MapPin, Clock, Filter, Globe } from "lucide-react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function NosOffres() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
    { id: "af", nom: "Afrique", basePrix: 350000, img: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=800&auto=format&fit=crop" },
    { id: "eu", nom: "Europe", basePrix: 650000, img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800&auto=format&fit=crop" },
    { id: "am", nom: "Amérique", basePrix: 950000, img: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80&w=800&auto=format&fit=crop" },
    { id: "as", nom: "Asie", basePrix: 800000, img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop" },
    { id: "oc", nom: "Océanie", basePrix: 1200000, img: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=800&auto=format&fit=crop" }
  ];

  const calculerPrixTotal = (base, type) => {
    const multiplicateurs = { "Études": 1.5, "Travail": 2.0, "Immigration": 2.5, "Affaires": 1.2 };
    return base * (multiplicateurs[type] || 1);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleReservation = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "reservations"), {
        paysDestination: paysSelectionne,
        continent: selectedOffre.nom,
        typeVisa: typeVisaFilter,
        dureeSejour: dureeFilter,
        montantEstime: calculerPrixTotal(selectedOffre.basePrix, typeVisaFilter),
        statut: "En attente de devis final",
        dateCreation: serverTimestamp()
      });
      alert("Demande reçue !");
      setIsModalOpen(false);
    } catch (error) { alert("Erreur."); }
  };

  // Filtrage instantané calculé à chaque rendu
  const offresFiltrees = offresParContinent.filter(o => continentFilter === "Tous" || o.nom === continentFilter);

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <section style={{...headerStyle, padding: isMobile ? "40px 20px 80px" : "60px 10% 100px"}}>
        <h1 style={titleStyle}>Service Visa Mondial</h1>
        <p style={subtitleStyle}>Choisissez n'importe quel pays, procédure instantanée</p>
      </section>

      <div style={{...searchWrapper, padding: isMobile ? "0 15px" : "0 10%"}}>
        <div style={searchFormCard}>
          <div style={{display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "20px", width: "100%"}}>
            <div style={inputBox}>
              <label style={labelS}>Destination</label>
              <div style={innerInput}>
                <Globe size={16} color="#2563eb"/>
                <input 
                  type="text" 
                  placeholder="Pays (ex: Japon...)" 
                  style={cleanInput} 
                  onChange={(e) => setPaysSelectionne(e.target.value)} 
                />
              </div>
            </div>
            <div style={inputBox}>
              <label style={labelS}>Continent</label>
              <div style={innerInput}>
                <MapPin size={16}/>
                <select style={cleanInput} onChange={(e) => setContinentFilter(e.target.value)}>
                  {continents.map((c, i) => <option key={i} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={inputBox}>
              <label style={labelS}>Durée</label>
              <div style={innerInput}>
                <Clock size={16}/>
                <select style={cleanInput} onChange={(e) => {setDureeFilter(e.target.value); setTypeVisaFilter(visasParDuree[e.target.value][0]);}}>
                  {categoriesDuree.map((d, i) => <option key={i} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div style={inputBox}>
              <label style={labelS}>Visa</label>
              <div style={innerInput}>
                <Filter size={16}/>
                <select style={cleanInput} value={typeVisaFilter} onChange={(e) => setTypeVisaFilter(e.target.value)}>
                  {visasParDuree[dureeFilter].map((v, i) => <option key={i} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{...gridStyle, padding: isMobile ? "30px 20px" : "40px 10%"}}>
        {offresFiltrees.map((zone) => (
          <div key={zone.id} style={cardStyle}>
            <div style={{overflow: 'hidden', height: '180px'}}>
               <img src={zone.img} alt={zone.nom} style={imgStyle} />
            </div>
            <div style={{ padding: "20px" }}>
              <div style={cardTop}>
                <h3 style={{ margin: 0 }}>Zone {zone.nom}</h3>
                <span style={priceTag}>{calculerPrixTotal(zone.basePrix, typeVisaFilter).toLocaleString()} FCFA</span>
              </div>
              <button 
                onClick={() => { setSelectedOffre(zone); setIsModalOpen(true); }} 
                style={btnDetails}
                disabled={!paysSelectionne}
              >
                {paysSelectionne ? `Partir en ${paysSelectionne}` : "Saisir un pays"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <div style={{padding: "30px"}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom: "20px"}}>
                <h2 style={{fontSize: '20px'}}>Confirmation : {paysSelectionne}</h2>
                <button onClick={() => setIsModalOpen(false)} style={{border:'none', background:'none', cursor:'pointer'}}><X/></button>
              </div>
              <div style={{backgroundColor: "#eff6ff", padding: "15px", borderRadius: "10px", margin: "15px 0"}}>
                <span style={{fontSize: "13px", color: "#2563eb"}}>Total estimé :</span>
                <div style={{fontSize: "22px", fontWeight: "900", color: "#1e40af"}}>
                  {calculerPrixTotal(selectedOffre.basePrix, typeVisaFilter).toLocaleString()} FCFA
                </div>
              </div>
              <form onSubmit={handleReservation} style={{display: "flex", flexDirection: "column", gap: "12px"}}>
                <input type="text" placeholder="Nom complet" style={fInput} required />
                <button type="submit" style={btnConfirm}>Valider</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- STYLES OPTIMISÉS (TRANSITIONS SUPPRIMÉES POUR LA VITESSE) ---
const headerStyle = { backgroundColor: "#2563eb", color: "white", textAlign: "center" };
const titleStyle = { fontWeight: "900", margin: 0, fontSize: "32px" };
const subtitleStyle = { fontSize: "16px", opacity: 0.9, marginTop: "10px" };
const searchWrapper = { marginTop: "-50px" };
const searchFormCard = { backgroundColor: "white", borderRadius: "20px", padding: "25px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" };
const inputBox = { display: "flex", flexDirection: "column", gap: "5px" };
const labelS = { fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" };
const innerInput = { display: "flex", alignItems: "center", gap: "10px", border: "1px solid #e2e8f0", padding: "12px", borderRadius: "10px" };
const cleanInput = { border: "none", outline: "none", width: "100%", fontSize: "14px" };
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px" };
const cardStyle = { backgroundColor: "white", borderRadius: "24px", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }; // Transition supprimée
const imgStyle = { width: "100%", height: "100%", objectFit: "cover" }; // Transition supprimée
const cardTop = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" };
const priceTag = { color: "#2563eb", fontWeight: "900", fontSize: "16px" };
const btnDetails = { width: "100%", backgroundColor: "#2563eb", color: "white", padding: "14px", border: "none", borderRadius: "14px", fontWeight: "700", cursor: "pointer" };
const modalOverlay = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 };
const modalContent = { backgroundColor: "white", borderRadius: "28px", width: "90%", maxWidth: "450px" };
const fInput = { padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0" };
const btnConfirm = { backgroundColor: "#2563eb", color: "white", padding: "16px", borderRadius: "14px", border: "none", fontWeight: "700", cursor: "pointer" };

export default NosOffres;