import React, { useState } from "react";
import { X, MapPin, CheckCircle, Clock, Users, Search, Filter } from "lucide-react";
// Importation de la configuration Firebase
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function NosOffres() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState(null);

  const [hoveredId, setHoveredId] = useState(null);

  // --- ÉTATS POUR CAPTURER LES DONNÉES DU FORMULAIRE ---
  const [nom, setNom] = useState("Jean Dupont");
  const [email, setEmail] = useState("jean.dupont@example.com");
  const [tel, setTel] = useState("+225 01 02 03 04 05");
  const [voyageurs, setVoyageurs] = useState(1);
  const [date, setDate] = useState("2025-12-29");
  const [message, setMessage] = useState("Aucune demande particulière.");

  const typesVoyage = ["Tous les types", "Études", "Affaires", "Tourisme", "Immigration"];

  const offres = [
    { 
      id: 1, titre: "Escapade à Dubaï", prix: 850000, 
      img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
      lieu: "Dubaï, Émirats Arabes Unis", duree: "5 jours", maxPers: "Max. 8 voyageurs", tag: "TOURISME",
      services: ["Vol aller-retour", "Hôtel 5 étoiles", "Transferts aéroport"]
    },
    { 
      id: 2, titre: "Séminaire à Paris", prix: 950000, 
      img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
      lieu: "Paris, France", duree: "4 jours", maxPers: "Max. 10 voyageurs", tag: "AFFAIRES",
      services: ["Hôtel centre ville", "Espace de coworking", "Petit déjeuner"]
    },
    { 
      id: 3, titre: "Études au Canada", prix: 2500000, 
      img: "https://images.pexels.com/photos/1206101/pexels-photo-1206101.jpeg?auto=compress&cs=tinysrgb&w=800", 
      lieu: "Montréal, Canada", duree: "1 an (renouvelable)", maxPers: "Individuel", tag: "ÉTUDES",
      services: ["Inscription université", "Assistance visa", "Logement étudiant"]
    },
    { 
      id: 4, titre: "Immigration Australie", prix: 4500000, 
      img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80", 
      lieu: "Sydney, Australie", duree: "Procédure 6-12 mois", maxPers: "Famille ou Solo", tag: "IMMIGRATION",
      services: ["Évaluation dossier", "Avocat immigration", "Traduction documents"]
    }
  ];

  // --- FONCTION D'ENVOI VERS FIREBASE ---
  const handleReservation = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    try {
      // Enregistre les données dans une collection "reservations"
      await addDoc(collection(db, "reservations"), {
        nomClient: nom,
        emailClient: email,
        telephone: tel,
        nombreVoyageurs: voyageurs,
        dateSouhaitee: date,
        note: message,
        offreChoisie: selectedOffre.titre,
        montant: selectedOffre.prix,
        statut: "En attente",
        dateCreation: serverTimestamp()
      });
      alert("Félicitations ! Votre réservation a été enregistrée.");
      setIsModalOpen(false); // Ferme la fenêtre après succès
    } catch (error) {
      console.error("Erreur Firebase:", error);
      alert("Erreur lors de l'envoi vers la base de données.");
    }
  };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      
      {/* SECTION TITRE */}
      <section style={headerStyle}>
        <h1 style={titleStyle}>Nos Offres de Voyage</h1>
        <p style={subtitleStyle}>Explorez notre catalogue complet de destinations</p>
      </section>

      {/* BARRE DE RECHERCHE */}
      <div style={searchWrapper}>
        <div style={searchFormCard}>
          <div style={inputBox}>
            <label style={labelS}>Rechercher</label>
            <div style={innerInput}><Search size={16}/><input type="text" placeholder="Destination..." style={cleanInput}/></div>
          </div>
          <div style={inputBox}>
            <label style={labelS}>Type de voyage</label>
            <div style={innerInput}><Filter size={16}/>
              <select style={cleanInput}>
                {typesVoyage.map((t, i) => <option key={i}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={inputBox}><label style={labelS}>Budget maximum</label><input type="number" defaultValue="10000000" style={budgetInput}/></div>
        </div>
      </div>

      {/* GRILLE DES OFFRES AVEC EFFET HOVER */}
      <div style={gridStyle}>
        {offres.map((offre) => (
          <div 
            key={offre.id} 
            style={{
              ...cardStyle, 
              opacity: hoveredId && hoveredId !== offre.id ? 0.7 : 1, 
              transform: hoveredId === offre.id ? "translateY(-5px)" : "none", 
              transition: "0.3s"
            }}
            onMouseEnter={() => setHoveredId(offre.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div style={{ position: "relative" }}>
              <img src={offre.img} alt={offre.titre} style={imgStyle} />
              <span style={tagStyle}>{offre.tag}</span>
            </div>
            <div style={{ padding: "20px" }}>
              <div style={cardTop}>
                <h3 style={{ margin: 0, fontSize: "18px" }}>{offre.titre}</h3>
                <span style={priceTag}>{offre.prix.toLocaleString()} FCFA</span>
              </div>
              <button onClick={() => { setSelectedOffre(offre); setIsModalOpen(true); }} style={btnDetails}>
                Voir les détails
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODALE DE RÉSERVATION CONNECTÉE À FIREBASE */}
      {isModalOpen && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <div style={formContainer}>
              <h2 style={{ marginTop: 0 }}>Formulaire de réservation</h2>
              <form style={bookingForm} onSubmit={handleReservation}>
                <div style={field}>
                  <label style={fLabel}>Nom complet *</label>
                  <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} style={fInput} required />
                </div>
                <div style={field}>
                  <label style={fLabel}>Email *</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={fInput} required />
                </div>
                <div style={field}>
                  <label style={fLabel}>Téléphone *</label>
                  <input type="text" value={tel} onChange={(e) => setTel(e.target.value)} style={fInput} required />
                </div>
                <div style={{ display: "flex", gap: "15px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={fLabel}>Voyageurs *</label>
                    <input type="number" value={voyageurs} onChange={(e) => setVoyageurs(e.target.value)} style={fInput} required />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={fLabel}>Date souhaitée *</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={fInput} required />
                  </div>
                </div>
                <div style={field}>
                  <label style={fLabel}>Demandes spéciales</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} style={fArea} />
                </div>
                <button type="submit" style={btnConfirm}>Confirmer la réservation</button>
              </form>
            </div>
            
            {/* RÉCAPITULATIF À DROITE */}
            <div style={recapContainer}>
              <button onClick={() => setIsModalOpen(false)} style={closeX}><X size={20}/></button>
              <img src={selectedOffre?.img} style={recapImg} alt="destination" />
              <h3 style={{ marginTop: "15px" }}>{selectedOffre?.titre}</h3>
              <div style={metaRow}><MapPin size={14}/> {selectedOffre?.lieu}</div>
              <div style={metaRow}><Clock size={14}/> {selectedOffre?.duree}</div>
              <div style={metaRow}><Users size={14}/> {selectedOffre?.maxPers}</div>
              <div style={servicesSection}>
                <p style={{ fontWeight: "700", fontSize: "14px" }}>Services inclus:</p>
                {selectedOffre?.services.map((s, i) => (
                  <div key={i} style={sItem}><CheckCircle size={14} color="#10b981"/> {s}</div>
                ))}
              </div>
              <div style={totalBox}>
                <div style={totalLine}><span>Total:</span> <span>{selectedOffre?.prix.toLocaleString()} FCFA</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- STYLES (INTACTS) ---
const headerStyle = { backgroundColor: "#2563eb", color: "white", padding: "60px 10% 100px" };
const titleStyle = { fontSize: "42px", fontWeight: "900", margin: 0 };
const subtitleStyle = { fontSize: "18px", opacity: 0.9, marginTop: "10px" };
const searchWrapper = { padding: "0 10%", marginTop: "-45px" };
const searchFormCard = { backgroundColor: "white", borderRadius: "16px", padding: "20px", display: "flex", gap: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" };
const inputBox = { flex: 1, display: "flex", flexDirection: "column", gap: "5px" };
const labelS = { fontSize: "12px", fontWeight: "700", color: "#64748b" };
const innerInput = { display: "flex", alignItems: "center", gap: "10px", border: "1px solid #e2e8f0", padding: "10px", borderRadius: "8px" };
const cleanInput = { border: "none", outline: "none", width: "100%", fontSize: "14px", background: "transparent" };
const budgetInput = { border: "1px solid #e2e8f0", padding: "10px", borderRadius: "8px", outline: "none" };
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "30px", padding: "40px 10%" };
const cardStyle = { backgroundColor: "white", borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", cursor: "pointer" };
const imgStyle = { width: "100%", height: "220px", objectFit: "cover" };
const tagStyle = { position: "absolute", top: "15px", left: "15px", backgroundColor: "white", color: "#2563eb", padding: "4px 12px", borderRadius: "20px", fontSize: "10px", fontWeight: "800" };
const cardTop = { display: "flex", justifyContent: "space-between", marginBottom: "20px" };
const priceTag = { color: "#2563eb", fontWeight: "900", fontSize: "18px" };
const btnDetails = { width: "100%", backgroundColor: "#2563eb", color: "white", padding: "14px", border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer" };
const modalOverlay = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 };
const modalContent = { backgroundColor: "white", borderRadius: "24px", width: "95%", maxWidth: "980px", display: "flex", overflow: "hidden", maxHeight: "90vh" };
const formContainer = { flex: 1.2, padding: "40px", overflowY: "auto" };
const bookingForm = { display: "flex", flexDirection: "column", gap: "15px" };
const field = { display: "flex", flexDirection: "column", gap: "5px" };
const fLabel = { fontSize: "13px", fontWeight: "600" };
const fInput = { padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" };
const fArea = { ...fInput, height: "80px", resize: "none" };
const btnConfirm = { backgroundColor: "#2563eb", color: "white", padding: "16px", borderRadius: "12px", border: "none", fontWeight: "700", fontSize: "16px", cursor: "pointer", marginTop: "10px" };
const recapContainer = { flex: 0.8, padding: "30px", borderLeft: "1px solid #f1f5f9", position: "relative" };
const recapImg = { width: "100%", height: "180px", borderRadius: "16px", objectFit: "cover" };
const metaRow = { display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#64748b", marginTop: "5px" };
const servicesSection = { marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "15px" };
const sItem = { display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#475569", marginBottom: "5px" };
const totalBox = { marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "15px" };
const totalLine = { display: "flex", justifyContent: "space-between", fontWeight: "900", color: "#2563eb", fontSize: "18px" };
const closeX = { position: "absolute", top: "15px", right: "15px", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" };

export default NosOffres;