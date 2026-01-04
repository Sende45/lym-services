import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { 
  collection, getDocs, addDoc, serverTimestamp, 
  deleteDoc, doc, query, orderBy, updateDoc, where, setDoc 
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock, Trash2, Send, Search, Archive, RotateCcw } from "lucide-react";

// --- COMPOSANT SKELETON ---
const AdminSkeleton = () => (
  <div style={{ padding: "20px", background: "white", borderRadius: "20px", marginBottom: "10px", animation: "pulse 1.5s infinite" }}>
    <div style={{ height: "20px", width: "60%", background: "#e2e8f0", borderRadius: "4px", marginBottom: "10px" }}></div>
    <div style={{ height: "15px", width: "40%", background: "#f1f5f9", borderRadius: "4px" }}></div>
  </div>
);

function Admin() {
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [tarifsList, setTarifsList] = useState([]);
  const [tarifForm, setTarifForm] = useState({ service: "visa", pays: "", prix: "" });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchives, setShowArchives] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchData();
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const qRes = query(collection(db, "reservations"), orderBy("dateCreation", "desc"));
      const qTarifs = collection(db, "tarifs");
      const [resSnap, tarifSnap] = await Promise.all([getDocs(qRes), getDocs(qTarifs)]);
      
      setReservations(resSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setTarifsList(tarifSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  // --- LOGIQUE D'ARCHIVAGE ---
  const handleArchiveStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Archivé" ? "En attente" : "Archivé";
    if (window.confirm(currentStatus === "Archivé" ? "Sortir de l'archive ?" : "Archiver ce dossier ?")) {
      try {
        await updateDoc(doc(db, "reservations", id), { statut: newStatus });
        fetchData();
      } catch (err) { alert("Erreur modification"); }
    }
  };

  const handleWhatsApp = (nom, pays, type) => {
    const message = `Bonjour ${nom}, nous traitons votre demande de ${type} pour ${pays}.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleSaveTarif = async (e) => {
    e.preventDefault();
    const docId = `visa_${tarifForm.pays.toLowerCase()}`;
    try {
      await setDoc(doc(db, "tarifs", docId), {
        service: tarifForm.service,
        prix: Number(tarifForm.prix),
        lastUpdate: serverTimestamp()
      });
      alert("Tarif mis à jour !");
      setTarifForm({ ...tarifForm, pays: "", prix: "" });
      fetchData();
    } catch (err) { alert("Erreur tarif"); }
  };

  // Filtrage combiné (Recherche + Statut Archivé/Actif)
  const filteredReservations = reservations.filter(r => {
    const matchesSearch = r.nomClient?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.paysDestination?.toLowerCase().includes(searchTerm.toLowerCase());
    const isArchived = r.statut === "Archivé";
    return showArchives ? (isArchived && matchesSearch) : (!isArchived && matchesSearch);
  });

  return (
    <div style={containerStyle}>
      <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }`}</style>
      
      <header style={headerStyle}>
        <div style={{ flex: 1 }}>
          <h1 style={titleStyle}>LYM Business Cloud</h1>
          <p style={subtitleStyle}>Gestionnaire Agence | {user?.email}</p>
          <div style={searchWrapper}>
            <Search size={18} color="#94a3b8" />
            <input type="text" placeholder="Rechercher un client ou un pays..." style={searchField} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <button onClick={() => signOut(auth)} style={logoutBtn}>Déconnexion</button>
      </header>

      <div style={dashboardGrid}>
        {/* COLONNE GAUCHE : DOSSIERS */}
        <section style={sectionStyle}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h2 style={{...sectionTitle, margin: 0}}>
              {showArchives ? "📂 Archives" : "📂 Dossiers Visas"}
            </h2>
            <button onClick={() => setShowArchives(!showArchives)} style={showArchives ? activeTabBtn : archiveTabBtn}>
              {showArchives ? <><RotateCcw size={16}/> Actifs</> : <><Archive size={16}/> Archives</>}
            </button>
          </div>

          <div style={listContainer}>
            {loading ? [1,2,3].map(i => <AdminSkeleton key={i}/>) : 
              filteredReservations.map(res => (
                <div key={res.id} style={cardStyle}>
                  <div style={cardHeader}>
                    <div style={{fontWeight: "bold"}}>{res.nomClient}</div>
                    <div style={{display: "flex", gap: "10px"}}>
                        {!showArchives && <button onClick={() => handleWhatsApp(res.nomClient, res.paysDestination, res.typeVisa)} style={btnWA}><Send size={14}/></button>}
                        <button onClick={() => handleArchiveStatus(res.id, res.statut)} style={res.statut === "Archivé" ? btnRestore : btnDelete}>
                          {res.statut === "Archivé" ? <RotateCcw size={18}/> : <Archive size={18}/>}
                        </button>
                    </div>
                  </div>
                  <p style={cardDetail}>{res.typeVisa} - <strong>{res.paysDestination}</strong></p>
                  <div style={cardFooter}>
                    <span style={{color: "#2563eb", fontWeight: "bold"}}>{res.montantEstime?.toLocaleString()} FCFA</span>
                    {res.statut !== "Archivé" && (
                      <select 
                        style={statusBadge(res.statut)}
                        value={res.statut || "En attente"}
                        onChange={(e) => updateDoc(doc(db, "reservations", res.id), { statut: e.target.value }).then(fetchData)}
                      >
                        <option value="En attente">En attente</option>
                        <option value="En cours">En cours</option>
                        <option value="Approuvé">Approuvé</option>
                      </select>
                    )}
                  </div>
                </div>
              ))
            }
          </div>
        </section>

        {/* COLONNE DROITE : CONFIGURATION TARIFS */}
        <section style={sectionStyle}>
          <h2 style={sectionTitle}>⚙️ Modifier les Tarifs</h2>
          <form onSubmit={handleSaveTarif} style={formStyle}>
            <input style={inputStyle} placeholder="Continent/Zone (ex: afrique)" value={tarifForm.pays} onChange={e => setTarifForm({...tarifForm, pays: e.target.value})} required />
            <div style={{display: "flex", gap: "10px"}}>
                <input style={inputStyle} type="number" placeholder="Prix base" value={tarifForm.prix} onChange={e => setTarifForm({...tarifForm, prix: e.target.value})} required />
                <button type="submit" style={publishBtn}>Mettre à jour</button>
            </div>
          </form>
          
          <div style={{marginTop: "20px"}}>
             {tarifsList.map(t => (
               <div key={t.id} style={tarifItem}>
                 <span>{t.id.replace('visa_', '').toUpperCase()}</span>
                 <strong>{t.prix?.toLocaleString()} FCFA</strong>
               </div>
             ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// --- STYLES ---
const searchWrapper = { display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#f8fafc", padding: "5px 15px", borderRadius: "12px", border: "1px solid #e2e8f0", marginTop: "15px", maxWidth: "400px" };
const searchField = { border: "none", outline: "none", background: "none", width: "100%", fontSize: "14px" };
const containerStyle = { padding: "30px", backgroundColor: "#f1f5f9", minHeight: "100vh", fontFamily: "sans-serif" };
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", backgroundColor: "white", padding: "25px", borderRadius: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" };
const titleStyle = { margin: 0, fontSize: "22px", fontWeight: "900", color: "#0f172a" };
const subtitleStyle = { fontSize: "13px", color: "#64748b" };
const dashboardGrid = { display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "30px" };
const sectionStyle = { backgroundColor: "white", padding: "25px", borderRadius: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" };
const sectionTitle = { fontSize: "18px", fontWeight: "800", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" };
const cardStyle = { padding: "20px", backgroundColor: "#f8fafc", borderRadius: "18px", marginBottom: "15px", border: "1px solid #f1f5f9" };
const cardHeader = { display: "flex", justifyContent: "space-between", marginBottom: "10px" };
const cardFooter = { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "15px", paddingTop: "10px", borderTop: "1px dashed #e2e8f0" };
const cardDetail = { fontSize: "13px", color: "#64748b" };
const btnWA = { backgroundColor: "#22c55e", color: "white", border: "none", padding: "8px", borderRadius: "8px", cursor: "pointer" };
const btnDelete = { color: "#94a3b8", background: "none", border: "none", cursor: "pointer" };
const btnRestore = { color: "#2563eb", background: "none", border: "none", cursor: "pointer" };
const archiveTabBtn = { display:'flex', alignItems:'center', gap:'8px', backgroundColor:'#f1f5f9', border:'none', padding:'8px 15px', borderRadius:'10px', cursor:'pointer', fontWeight:'700', color:'#64748b' };
const activeTabBtn = { ...archiveTabBtn, backgroundColor:'#0f172a', color:'white' };
const tarifItem = { display: "flex", justifyContent: "space-between", padding: "12px", borderBottom: "1px solid #f1f5f9", fontSize: "14px" };
const formStyle = { display: "flex", flexDirection: "column", gap: "10px" };
const inputStyle = { padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none" };
const publishBtn = { backgroundColor: "#2563eb", color: "white", padding: "12px 20px", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" };
const logoutBtn = { backgroundColor: "#fee2e2", color: "#ef4444", padding: "10px 20px", border: "none", borderRadius: "12px", fontWeight: "bold", cursor: "pointer" };
const listContainer = { maxHeight: "600px", overflowY: "auto" };
const statusBadge = (status) => ({
  backgroundColor: status === "Approuvé" ? "#dcfce7" : status === "En cours" ? "#dbeafe" : "#fef3c7",
  color: status === "Approuvé" ? "#166534" : status === "En cours" ? "#1e40af" : "#92400e",
  border: "none", padding: "6px 12px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "12px"
});

export default Admin;