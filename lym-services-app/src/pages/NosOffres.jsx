import React, { useState, useEffect } from "react";
import { X, MapPin, Clock, Filter, Globe } from "lucide-react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";

// --- COMPOSANT SKELETON POUR L'EFFET DE CHARGEMENT ---
const PriceSkeleton = () => (
  <div style={skeletonStyle}>
    <div style={skeletonPulse}></div>
  </div>
);

function NosOffres() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // --- ÉTATS POUR LA BASE DE DONNÉES ---
  const [tarifsDb, setTarifsDb] = useState([]);
  const [loadingTarifs, setLoadingTarifs] = useState(true);

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
    { id: "afrique", nom: "Afrique", img: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=800&auto=format&fit=crop" },
    { id: "europe", nom: "Europe", img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800&auto=format&fit=crop" },
    { id: "amerique", nom: "Amérique", img: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80&w=800&auto=format&fit=crop" },
    { id: "asie", nom: "Asie", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop" },
    { id: "oceanie", nom: "Océanie", img: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=800&auto=format&fit=crop" }
  ];

  // --- CHARGEMENT DES TARIFS VIA FIREBASE ---
  useEffect(() => {
    const fetchTarifs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tarifs"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTarifsDb(data);
      } catch (err) {
        console.error("Erreur tarifs:", err);
      } finally {
        // Délai artificiel de 800ms pour montrer l'animation Skeleton (plus pro)
        setTimeout(() => setLoadingTarifs(false), 800);
      }
    };
    fetchTarifs();

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- CALCULATEUR DE PRIX DYNAMIQUE ---
  const getPrixBase = (continentId) => {
    const searchId = `visa_${continentId.toLowerCase()}`;
    const tarifMatch = tarifsDb.find(t => t.id.toLowerCase() === searchId || t.service === searchId);
    return tarifMatch ? tarifMatch.prix : 0;
  };

  const calculerPrixTotal = (continentId, typeVisa) => {
    const base = getPrixBase(continentId);
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
        dureeSejour: dureeFilter,
        montantEstime: finalPrice,
        statut: "En attente",
        dateCreation: serverTimestamp()
      });
      alert("Félicitations ! Votre demande a été reçue.");
      setIsModalOpen(false);
    } catch (error) { alert("Erreur lors de la connexion au serveur."); }
  };

  const offresFiltrees = offresParContinent.filter(o => continentFilter === "Tous" || o.nom === continentFilter);

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", fontFamily: "sans-serif" }}>
      {/* ANIMATION CSS POUR LE SKELETON */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>

      <section style={{...headerStyle, padding: isMobile ? "40px 20px 80px" : "60px 10% 100px"}}>
        <h1 style={titleStyle}>Service Visa Mondial</h1>
        <p style={subtitleStyle}>Tarification intelligente connectée à votre base de données</p>
      </section>

      {/* FORMULAIRE DE RECHERCHE */}
      <div style={{...searchWrapper, padding: isMobile ? "0 15px" : "0 10%"}}>
        <div style={searchFormCard}>
          <div style={{display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: "15px", width: "100%"}}>
            <div style={inputBox}>
              <label style={labelS}>Destination</label>
              <div style={innerInput}>
                <Globe size={16} color="#2563eb"/><input type="text" placeholder="Entrez un pays..." style={cleanInput} onChange={(e) => setPaysSelectionne(e.target.value)} />
              </div>
            </div>
            <div style={inputBox}>
              <label style={labelS}>Continent</label>
              <div style={innerInput}>
                <MapPin size={16}/><select style={cleanInput} onChange={(e) => setContinentFilter(e.target.value)}>
                  {continents.map((c, i) => <option key={i} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={inputBox}>
              <label style={labelS}>Durée</label>
              <div style={innerInput}>
                <Clock size={16}/><select style={cleanInput} onChange={(e) => {setDureeFilter(e.target.value); setTypeVisaFilter(visasParDuree[e.target.value][0]);}}>
                  {categoriesDuree.map((d, i) => <option key={i} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div style={inputBox}>
              <label style={labelS}>Type de Visa</label>
              <div style={innerInput}>
                <Filter size={16}/><select style={cleanInput} value={typeVisaFilter} onChange={(e) => setTypeVisaFilter(e.target.value)}>
                  {visasParDuree[dureeFilter].map((v, i) => <option key={i} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GRILLE D'OFFRES AVEC SKELETON */}
      <div style={{...gridStyle, padding: isMobile ? "30px 20px" : "40px 10%"}}>
        {offresFiltrees.map((zone) => {
          const prixZone = calculerPrixTotal(zone.id, typeVisaFilter);
          return (
            <div key={zone.id} style={cardStyle}>
              <div style={{overflow: 'hidden', height: '180px'}}>
                <img src={zone.img} alt={zone.nom} style={imgStyle} />
              </div>
              <div style={{ padding: "24px" }}>
                <div style={cardTop}>
                  <h3 style={{ margin: 0, fontSize: "18px" }}>Zone {zone.nom}</h3>
                  {loadingTarifs ? (
                    <PriceSkeleton />
                  ) : (
                    <span style={priceTag}>
                      {prixZone > 0 ? `${prixZone.toLocaleString()} FCFA` : "Sur devis"}
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => { setSelectedOffre(zone); setIsModalOpen(true); }} 
                  style={{...btnDetails, opacity: paysSelectionne ? 1 : 0.5}}
                  disabled={!paysSelectionne}
                >
                  {paysSelectionne ? `Partir en ${paysSelectionne}` : "Saisir un pays"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL DE RÉSERVATION STYLE PREMIUM */}
      {isModalOpen && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <div style={{padding: "30px"}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom: "25px"}}>
                <h2 style={{fontSize: '22px', fontWeight: "800"}}>Dossier : {paysSelectionne}</h2>
                <button onClick={() => setIsModalOpen(false)} style={{border:'none', background:'none', cursor:'pointer'}}><X/></button>
              </div>
              
              <div style={priceHighlightCard}>
                <span style={{fontSize: "13px", color: "#60a5fa"}}>Montant estimé ({typeVisaFilter})</span>
                <div style={{fontSize: "28px", fontWeight: "900", marginTop: "5px"}}>
                  {calculerPrixTotal(selectedOffre.id, typeVisaFilter).toLocaleString()} FCFA
                </div>
              </div>

              <form onSubmit={handleReservation} style={{display: "flex", flexDirection: "column", gap: "15px"}}>
                <div style={inputBox}>
                  <label style={{fontSize: "12px", color: "#64748b", fontWeight: "600"}}>IDENTITÉ DU VOYAGEUR</label>
                  <input type="text" placeholder="Nom et Prénom complet" style={fInput} required />
                </div>
                <button type="submit" style={btnConfirm}>Confirmer ma réservation</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- STYLES SKELETON ---
const skeletonStyle = { width: "100px", height: "22px", backgroundColor: "#e2e8f0", borderRadius: "6px", overflow: "hidden" };
const skeletonPulse = { width: "100%", height: "100%", backgroundColor: "#cbd5e1", animation: "pulse 1.5s infinite ease-in-out" };
const priceHighlightCard = { backgroundColor: "#1e40af", color: "white", padding: "20px", borderRadius: "18px", marginBottom: "25px", boxShadow: "0 10px 15px -3px rgba(30, 64, 175, 0.3)" };

// --- STYLES GÉNÉRAUX ---
const headerStyle = { backgroundColor: "#2563eb", color: "white", textAlign: "center" };
const titleStyle = { fontWeight: "900", margin: 0, fontSize: "32px" };
const subtitleStyle = { fontSize: "16px", opacity: 0.9, marginTop: "10px" };
const searchWrapper = { marginTop: "-50px" };
const searchFormCard = { backgroundColor: "white", borderRadius: "20px", padding: "25px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" };
const inputBox = { display: "flex", flexDirection: "column", gap: "5px" };
const labelS = { fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" };
const innerInput = { display: "flex", alignItems: "center", gap: "10px", border: "1px solid #e2e8f0", padding: "12px", borderRadius: "10px" };
const cleanInput = { border: "none", outline: "none", width: "100%", fontSize: "14px" };
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "30px" };
const cardStyle = { backgroundColor: "white", borderRadius: "28px", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" };
const imgStyle = { width: "100%", height: "100%", objectFit: "cover" };
const cardTop = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" };
const priceTag = { color: "#2563eb", fontWeight: "900", fontSize: "18px" };
const btnDetails = { width: "100%", backgroundColor: "#2563eb", color: "white", padding: "16px", border: "none", borderRadius: "16px", fontWeight: "700", cursor: "pointer" };
const modalOverlay = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(15, 23, 42, 0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, backdropFilter: "blur(5px)" };
const modalContent = { backgroundColor: "white", borderRadius: "32px", width: "90%", maxWidth: "450px", overflow: "hidden" };
const fInput = { padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none" };
const btnConfirm = { backgroundColor: "#0f172a", color: "white", padding: "18px", borderRadius: "16px", border: "none", fontWeight: "700", cursor: "pointer" };

export default NosOffres;