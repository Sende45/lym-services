import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { 
  collection, getDocs, addDoc, serverTimestamp, 
  deleteDoc, doc, query, orderBy, updateDoc, where 
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [articles, setArticles] = useState([]);
  const [newPost, setNewPost] = useState({ titre: "", contenu: "", image: "" });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // On charge les données spécifiquement pour cette agence
        fetchData(currentUser.uid);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // --- MODIFICATION MULTI-AGENCES : Requêtes avec filtre agencyId ---
  const fetchData = async (agencyId) => {
    setLoading(true);
    try {
      // On ne récupère que les documents appartenant à l'agence connectée
      const qRes = query(collection(db, "reservations"), where("agencyId", "==", agencyId));
      const qCont = query(collection(db, "contacts"), where("agencyId", "==", agencyId));
      const qCons = query(collection(db, "consultations"), where("agencyId", "==", agencyId));
      const qArt = query(collection(db, "articles"), 
                         where("agencyId", "==", agencyId), 
                         orderBy("date", "desc"));

      const [resSnap, contSnap, consSnap, artSnap] = await Promise.all([
        getDocs(qRes), getDocs(qCont), getDocs(qCons), getDocs(qArt)
      ]);

      setReservations(resSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setContacts(contSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setConsultations(consSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setArticles(artSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Erreur SaaS Multi-Agences:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- MODIFICATION AUTOMATISATION : Notification Email ---
  const triggerNotification = (clientData, status) => {
    // Simulation d'envoi d'email/SMS
    console.log(`Notification automatique : Envoyé à ${clientData.nom} (${clientData.email || 'Pas d\'email'}). Nouveau statut : ${status}`);
    
    // Si tu installes EmailJS, tu insères le code ici :
    // emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", { to_name: clientData.nom, status: status, to_email: clientData.email });
  };

  const handleUpdateStatus = async (collectionName, id, newStatus, clientData) => {
    try {
      await updateDoc(doc(db, collectionName, id), { statut: newStatus });
      
      // Déclenche l'automatisation si le statut change
      triggerNotification(clientData, newStatus);

      // Mise à jour locale pour la fluidité UI
      if (collectionName === "consultations") {
        setConsultations(prev => prev.map(c => c.id === id ? {...c, statut: newStatus} : c));
      }
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    }
  };

  const handleDelete = async (collectionName, id) => {
    if (window.confirm("Supprimer cet élément définitivement ?")) {
      try {
        await deleteDoc(doc(db, collectionName, id));
        fetchData(user.uid);
      } catch (err) {
        alert("Erreur suppression");
      }
    }
  };

  const handlePostBlog = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "articles"), {
        ...newPost,
        agencyId: user.uid, // Signature Multi-Agences
        date: serverTimestamp(),
      });
      alert("Article publié pour votre agence !");
      setNewPost({ titre: "", contenu: "", image: "" });
      fetchData(user.uid);
    } catch (err) {
      alert("Erreur de publication");
    }
  };

  // --- LOGIQUE DE RECHERCHE FILTRÉE ---
  const filteredReservations = reservations.filter(r => 
    r.nomClient?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredConsultations = consultations.filter(c => 
    c.nom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div style={loaderStyle}>Espace Agence Sécurisé...</div>;

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={{ flex: 1 }}>
          <h1 style={titleStyle}>LYM Business Cloud</h1>
          <p style={subtitleStyle}>Agence ID: {user?.uid.substring(0,8)}... | {user?.email}</p>
          <input 
            type="text" 
            placeholder="Rechercher un dossier client..." 
            style={searchBar}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={() => signOut(auth)} style={logoutBtn}>Quitter l'agence</button>
      </header>

      {/* STATS RÉELLES DE L'AGENCE */}
      <div style={statRow}>
        <div style={statCard}><h3>{reservations.length}</h3><p>Mes Réservations</p></div>
        <div style={statCard}><h3>{consultations.length}</h3><p>Mes Consultations</p></div>
        <div style={statCard}><h3>{articles.length}</h3><p>Mes Articles</p></div>
      </div>

      <div style={dashboardGrid}>
        <div style={stackStyle}>
          {/* CONSULTATIONS AVEC AUTOMATISATION */}
          <section style={{...sectionStyle, borderTop: "4px solid #f59e0b"}}>
            <h2 style={sectionTitle}>💳 Consultations & Paiements</h2>
            <div style={listContainer}>
              {filteredConsultations.map(con => (
                <div key={con.id} style={cardStyle}>
                  <div style={cardHeader}>
                    <select 
                      style={statusBadge(con.statut)}
                      value={con.statut || "En attente"}
                      onChange={(e) => handleUpdateStatus("consultations", con.id, e.target.value, con)}
                    >
                      <option value="En attente">En attente</option>
                      <option value="Payé">Payé (Notif Auto)</option>
                      <option value="Terminé">Terminé (Notif Auto)</option>
                    </select>
                    <button onClick={() => handleDelete("consultations", con.id)} style={deleteBtn}>✕</button>
                  </div>
                  <p><strong>{con.nom}</strong></p>
                  <p style={cardDetail}>{con.email || "Pas d'email"}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={sectionStyle}>
            <h2 style={sectionTitle}>📅 Réservations Agence</h2>
            {filteredReservations.map(res => (
              <div key={res.id} style={cardStyle}>
                <div style={cardHeader}>
                  <p><strong>{res.nomClient}</strong></p>
                  <button onClick={() => handleDelete("reservations", res.id)} style={deleteBtn}>✕</button>
                </div>
                <p style={cardDetail}>{res.offreChoisie}</p>
              </div>
            ))}
          </section>
        </div>

        <div style={stackStyle}>
          <section style={sectionStyle}>
            <h2 style={sectionTitle}>✍️ Publier sur le Blog Agence</h2>
            <form onSubmit={handlePostBlog} style={formStyle}>
              <input type="text" placeholder="Titre" value={newPost.titre} onChange={e => setNewPost({...newPost, titre: e.target.value})} required style={inputStyle}/>
              <textarea placeholder="Contenu..." value={newPost.contenu} onChange={e => setNewPost({...newPost, contenu: e.target.value})} required style={textAreaStyle}/>
              <button type="submit" style={publishBtn}>Publier l'article</button>
            </form>
          </section>

          <section style={sectionStyle}>
            <h2 style={sectionTitle}>✉️ Messages Reçus</h2>
            {contacts.map(cont => (
              <div key={cont.id} style={cardStyle}>
                <p><strong>{cont.nom}</strong>: {cont.message}</p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}

// --- STYLES (Conservés et ajustés) ---
const searchBar = { width: "100%", maxWidth: "400px", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", marginTop: "10px", outline: "none" };
const statRow = { display: "flex", gap: "20px", marginBottom: "30px" };
const statCard = { flex: 1, backgroundColor: "white", padding: "20px", borderRadius: "20px", textAlign: "center", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" };
const statusBadge = (status) => ({
  backgroundColor: status === "Terminé" ? "#dcfce7" : status === "Payé" ? "#dbeafe" : "#fef3c7",
  color: status === "Terminé" ? "#166534" : status === "Payé" ? "#1e40af" : "#92400e",
  border: "none", padding: "5px 10px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer"
});
const containerStyle = { padding: "30px", backgroundColor: "#f1f5f9", minHeight: "100vh", fontFamily: "sans-serif" };
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", backgroundColor: "white", padding: "25px", borderRadius: "20px" };
const titleStyle = { margin: 0, fontSize: "22px", fontWeight: "800" };
const subtitleStyle = { fontSize: "12px", color: "#64748b", margin: "5px 0" };
const dashboardGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "30px" };
const stackStyle = { display: "flex", flexDirection: "column", gap: "30px" };
const sectionStyle = { backgroundColor: "white", padding: "25px", borderRadius: "20px" };
const sectionTitle = { fontSize: "17px", fontWeight: "bold", marginBottom: "20px" };
const cardStyle = { padding: "15px", backgroundColor: "#f8fafc", borderRadius: "15px", marginBottom: "10px", border: "1px solid #e2e8f0" };
const cardHeader = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const cardDetail = { fontSize: "13px", color: "#64748b" };
const deleteBtn = { background: "none", border: "none", color: "#94a3b8", cursor: "pointer" };
const formStyle = { display: "flex", flexDirection: "column", gap: "10px" };
const inputStyle = { padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" };
const textAreaStyle = { ...inputStyle, height: "80px" };
const publishBtn = { backgroundColor: "#2563eb", color: "white", padding: "12px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" };
const logoutBtn = { backgroundColor: "#fee2e2", color: "#ef4444", padding: "10px 20px", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" };
const loaderStyle = { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" };
const listContainer = { maxHeight: "400px", overflowY: "auto" };

export default Admin;