import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, addDoc, serverTimestamp, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [articles, setArticles] = useState([]); // État pour la liste des articles
  const [newPost, setNewPost] = useState({ titre: "", contenu: "", image: "" });
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
    // Récupérer les réservations
    const resSnap = await getDocs(collection(db, "reservations"));
    setReservations(resSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    
    // Récupérer les messages de contact
    const contSnap = await getDocs(collection(db, "contacts"));
    setContacts(contSnap.docs.map(d => ({ id: d.id, ...d.data() })));

    // Récupérer les demandes de consultation payante
    const consSnap = await getDocs(collection(db, "consultations"));
    setConsultations(consSnap.docs.map(d => ({ id: d.id, ...d.data() })));

    // Récupérer les articles du blog triés par date
    const artQuery = query(collection(db, "articles"), orderBy("date", "desc"));
    const artSnap = await getDocs(artQuery);
    setArticles(artSnap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const handleDelete = async (collectionName, id) => {
    if (window.confirm("Supprimer cet élément définitivement ?")) {
      try {
        await deleteDoc(doc(db, collectionName, id));
        fetchData(); 
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handlePostBlog = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "articles"), {
        ...newPost,
        date: serverTimestamp(),
      });
      alert("Article publié sur le blog !");
      setNewPost({ titre: "", contenu: "", image: "" });
      fetchData(); // Rafraîchir la liste après publication
    } catch (err) {
      alert("Erreur de publication");
    }
  };

  if (!user) return <div style={{padding: "50px", textAlign: "center"}}>Vérification de l'accès...</div>;

  return (
    <div style={{ padding: "40px", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#1e293b" }}>Tableau de Bord LYM SERVICES</h1>
        <button onClick={() => signOut(auth)} style={logoutBtn}>Déconnexion</button>
      </div>

      <div style={adminGrid}>
        {/* COLONNE GAUCHE : FLUX DE DONNÉES */}
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          
          {/* SECTION CONSULTATIONS PAYANTES */}
          <section style={{...adminSection, borderTop: "5px solid #f59e0b"}}>
            <h2 style={{color: "#b45309"}}>💳 Consultations Payantes</h2>
            {consultations.length === 0 && <p>Aucune demande.</p>}
            {consultations.map(con => (
              <div key={con.id} style={itemCard}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p><strong>{con.nom}</strong> - <span style={badgeStyle}>{con.prix || "15 000 FCFA"}</span></p>
                  <button onClick={() => handleDelete("consultations", con.id)} style={deleteBtn}>X</button>
                </div>
                <p style={{fontSize: "13px", margin: "5px 0"}}>Type: {con.type} | Statut: <strong>{con.statut}</strong></p>
              </div>
            ))}
          </section>
          
          {/* SECTION RÉSERVATIONS */}
          <section style={adminSection}>
            <h2>📅 Réservations Reçues</h2>
            {reservations.length === 0 && <p>Aucune réservation.</p>}
            {reservations.map(res => (
              <div key={res.id} style={itemCard}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p><strong>{res.nomClient}</strong> - {res.offreChoisie}</p>
                  <button onClick={() => handleDelete("reservations", res.id)} style={deleteBtn}>X</button>
                </div>
                <small>{res.telephone}</small>
              </div>
            ))}
          </section>

          {/* SECTION CONTACTS */}
          <section style={adminSection}>
            <h2>✉️ Messages de Contact</h2>
            {contacts.length === 0 && <p>Aucun message.</p>}
            {contacts.map(cont => (
              <div key={cont.id} style={itemCard}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p><strong>{cont.nom}</strong> ({cont.sujet})</p>
                  <button onClick={() => handleDelete("contacts", cont.id)} style={deleteBtn}>X</button>
                </div>
                <p style={{ fontSize: "14px", margin: "5px 0" }}>{cont.message}</p>
              </div>
            ))}
          </section>
        </div>

        {/* COLONNE DROITE : GESTION DU BLOG */}
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          
          {/* FORMULAIRE DE PUBLICATION */}
          <section style={adminSection}>
            <h2>✍️ Publier un Article</h2>
            <form onSubmit={handlePostBlog} style={adminForm}>
              <input type="text" placeholder="Titre de l'article" value={newPost.titre} onChange={e => setNewPost({...newPost, titre: e.target.value})} required style={adminInput}/>
              <textarea placeholder="Contenu de l'article" value={newPost.contenu} onChange={e => setNewPost({...newPost, contenu: e.target.value})} required style={adminTextArea}/>
              <input type="text" placeholder="URL de l'image" value={newPost.image} onChange={e => setNewPost({...newPost, image: e.target.value})} style={adminInput}/>
              <button type="submit" style={publishBtn}>Publier sur le site</button>
            </form>
          </section>

          {/* LISTE DE SUPPRESSION DES ARTICLES */}
          <section style={{...adminSection, borderTop: "5px solid #ef4444"}}>
            <h2 style={{color: "#b91c1c"}}>🗑️ Supprimer des Articles</h2>
            {articles.length === 0 && <p>Aucun article publié.</p>}
            <div style={{maxHeight: "400px", overflowY: "auto"}}>
              {articles.map(art => (
                <div key={art.id} style={{...itemCard, display: "flex", alignItems: "center", gap: "10px"}}>
                  <img src={art.image} alt="" style={{width: "40px", height: "40px", borderRadius: "4px", objectFit: "cover"}} />
                  <div style={{flex: 1}}>
                    <p style={{margin: 0, fontSize: "14px", fontWeight: "bold"}}>{art.titre}</p>
                    <small style={{color: "#64748b"}}>Publié le {art.date?.toDate().toLocaleDateString()}</small>
                  </div>
                  <button onClick={() => handleDelete("articles", art.id)} style={deleteBadgeBtn}>Supprimer</button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// STYLES
const badgeStyle = { backgroundColor: "#fef3c7", color: "#92400e", padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" };
const adminGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" };
const adminSection = { backgroundColor: "white", padding: "20px", borderRadius: "15px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" };
const itemCard = { padding: "15px", borderBottom: "1px solid #edf2f7", marginBottom: "10px", position: "relative" };
const adminForm = { display: "flex", flexDirection: "column", gap: "10px" };
const adminInput = { padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" };
const adminTextArea = { ...adminInput, height: "120px", resize: "none" };
const publishBtn = { backgroundColor: "#10b981", color: "white", padding: "12px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" };
const logoutBtn = { backgroundColor: "#ef4444", color: "white", padding: "8px 16px", border: "none", borderRadius: "8px", cursor: "pointer" };
const deleteBtn = { color: "#ef4444", border: "none", background: "none", cursor: "pointer", fontWeight: "bold" };
const deleteBadgeBtn = { backgroundColor: "#fee2e2", color: "#ef4444", border: "none", padding: "5px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "bold" };

export default Admin;