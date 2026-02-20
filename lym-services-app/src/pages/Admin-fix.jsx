import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { 
  collection, getDocs, addDoc, serverTimestamp, 
  deleteDoc, doc, query, orderBy, updateDoc, setDoc 
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { 
  Send, Search, Archive, RotateCcw, Newspaper, 
  Trash2, PlusCircle, Globe, UploadCloud, Loader2, LogOut 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [posts, setPosts] = useState([]);
  const [postForm, setPostForm] = useState({ titre: "", contenu: "", image: "" });
  const [isUploading, setIsUploading] = useState(false);
  
  const [tarifForm, setTarifForm] = useState({ 
    zone: "", typeSejour: "court_sejour", 
    tourisme: "", soins_medicaux: "", affaires: "",
    etudes: "", immigration: "", travail: ""
  });

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchives, setShowArchives] = useState(false);

  const navigate = useNavigate();
  
  // Ta clé API ImgBB intégrée
  const IMGBB_API_KEY = "35bb74e2910fc59f0f0e4e2ad6c87935"; 

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
      const qPosts = query(collection(db, "posts"), orderBy("date", "desc"));
      
      const [resSnap, tarifSnap, postSnap] = await Promise.all([
        getDocs(qRes), getDocs(qTarifs), getDocs(qPosts)
      ]);
      
      setReservations(resSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setTarifsList(tarifSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setPosts(postSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- FONCTION UPLOAD IMGBB ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setPostForm({ ...postForm, image: data.data.url });
      } else {
        alert("Erreur ImgBB: " + data.error.message);
      }
    } catch (error) {
      alert("Erreur lors de l'upload vers ImgBB");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postForm.image) return alert("Veuillez uploader une image d'abord.");
    try {
      await addDoc(collection(db, "posts"), {
        ...postForm,
        date: serverTimestamp(),
        auteur: user.email
      });
      setPostForm({ titre: "", contenu: "", image: "" });
      fetchData();
    } catch (err) { alert("Erreur lors de la publication"); }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm("Supprimer cet article ?")) {
      try {
        await deleteDoc(doc(db, "posts", id));
        setPosts(posts.filter(p => p.id !== id));
      } catch (err) { alert("Erreur suppression"); }
    }
  };

  const handleArchiveStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Archivé" ? "En attente" : "Archivé";
    try {
      await updateDoc(doc(db, "reservations", id), { statut: newStatus });
      fetchData();
    } catch (err) { alert("Erreur"); }
  };

  const handleSaveTarif = async (e) => {
    e.preventDefault();
    const docId = `${tarifForm.zone.toLowerCase().replace(/\s+/g, '_')}_${tarifForm.typeSejour}`;
    const prixFinal = tarifForm.typeSejour === "court_sejour" 
      ? { tourisme: Number(tarifForm.tourisme), soins_medicaux: Number(tarifForm.soins_medicaux), affaires: Number(tarifForm.affaires) }
      : { etudes: Number(tarifForm.etudes), travail: Number(tarifForm.travail), immigration: Number(tarifForm.immigration) };

    try {
      await setDoc(doc(db, "tarifs", docId), {
        zone: tarifForm.zone,
        typeSejour: tarifForm.typeSejour,
        prix: prixFinal,
        lastUpdate: serverTimestamp()
      });
      setTarifForm({ zone: "", typeSejour: "court_sejour", tourisme: "", soins_medicaux: "", affaires: "", etudes: "", travail: "", immigration: "" });
      fetchData();
      alert("✅ Zone mise à jour !");
    } catch (err) { alert("❌ Erreur enregistrement"); }
  };

  const filteredReservations = reservations.filter(r => {
    const match = r.nomClient?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  r.paysDestination?.toLowerCase().includes(searchTerm.toLowerCase());
    return showArchives ? (r.statut === "Archivé" && match) : (r.statut !== "Archivé" && match);
  });

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={{ flex: 1 }}>
          <h1 style={titleStyle}>LYM Business Cloud</h1>
          <div style={searchWrapper}>
            <Search size={18} color="#94a3b8" />
            <input type="text" placeholder="Rechercher..." style={searchField} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <button onClick={() => signOut(auth)} style={logoutBtn}><LogOut size={16}/> Déconnexion</button>
      </header>

      <div style={dashboardGrid}>
        
        {/* 1. DOSSIERS CLIENTS */}
        <section style={sectionStyle}>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
            <h2 style={sectionTitle}>📂 Dossiers {showArchives ? "Archivés" : "Actifs"}</h2>
            <div style={{display: 'flex', gap: '8px'}}>
              <button onClick={() => setShowArchives(false)} style={!showArchives ? activeTabBtn : archiveTabBtn}>Actifs</button>
              <button onClick={() => setShowArchives(true)} style={showArchives ? activeTabBtn : archiveTabBtn}>Archives</button>
            </div>
          </div>
          <div style={listContainer}>
            {loading ? <AdminSkeleton /> : filteredReservations.map(res => (
              <div key={res.id} style={cardStyle}>
                <div style={cardHeader}>
                  <div style={{fontWeight: "bold"}}>{res.nomClient}</div>
                  <div style={{display: "flex", gap: "8px"}}>
                    <button onClick={() => handleArchiveStatus(res.id, res.statut)} style={res.statut === "Archivé" ? btnRestore : btnDelete}>
                      {res.statut === "Archivé" ? <RotateCcw size={18}/> : <Archive size={18}/>}
                    </button>
                  </div>
                </div>
                <p style={cardDetail}>{res.typeVisa} - <strong>{res.paysDestination}</strong></p>
                <div style={cardFooter}>
                  <span style={{color: "#2563eb", fontWeight: "bold"}}>{res.montantEstime?.toLocaleString()} FCFA</span>
                  {!showArchives && (
                    <select style={statusBadge(res.statut)} value={res.statut || "En attente"} onChange={(e) => updateDoc(doc(db, "reservations", res.id), { statut: e.target.value }).then(fetchData)}>
                      <option value="En attente">En attente</option>
                      <option value="En cours">En cours</option>
                      <option value="Approuvé">Approuvé</option>
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. BLOG AVEC UPLOAD IMGBB */}
        <section style={sectionStyle}>
          <h2 style={sectionTitle}><Newspaper size={20}/> Blog</h2>
          <form onSubmit={handleCreatePost} style={formStyle}>
            <input style={inputStyle} placeholder="Titre" value={postForm.titre} onChange={e => setPostForm({...postForm, titre: e.target.value})} required />
            
            <div style={{ position: 'relative' }}>
              <input type="file" id="imgUpload" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
              <label htmlFor="imgUpload" style={uploadArea(postForm.image)}>
                {isUploading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : postForm.image ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={postForm.image} alt="Preview" style={{ width: '40px', height: '40px', borderRadius: '8px', objectCover: 'cover' }} />
                    <span>Image prête ✅</span>
                  </div>
                ) : (
                  <><UploadCloud size={20}/> Choisir une image</>
                )}
              </label>
            </div>

            <textarea style={{...inputStyle, height: '80px'}} placeholder="Contenu..." value={postForm.contenu} onChange={e => setPostForm({...postForm, contenu: e.target.value})} required />
            <button type="submit" disabled={isUploading || !postForm.image} style={{...publishBtn, opacity: (isUploading || !postForm.image) ? 0.6 : 1}}><PlusCircle size={16}/> Publier</button>
          </form>
          <div style={{marginTop: '15px', maxHeight: '180px', overflowY: 'auto'}}>
            {posts.map(p => (
              <div key={p.id} style={blogItem}>
                <span style={{fontSize:'12px', fontWeight:'600'}}>{p.titre}</span>
                <button onClick={() => handleDeletePost(p.id)} style={{color:'#ef4444', border:'none', background:'none', cursor:'pointer'}}><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
        </section>

        {/* 3. CONFIGURATION TARIFS */}
        <section style={sectionStyle}>
          <h2 style={sectionTitle}><Globe size={20}/> Gestion Tarifs</h2>
          <form onSubmit={handleSaveTarif} style={formStyle}>
            <input style={inputStyle} placeholder="Nom Zone" value={tarifForm.zone} onChange={e => setTarifForm({...tarifForm, zone: e.target.value})} required />
            <select style={inputStyle} value={tarifForm.typeSejour} onChange={e => setTarifForm({...tarifForm, typeSejour: e.target.value})}>
              <option value="court_sejour">Court Séjour</option>
              <option value="long_sejour">Long Séjour</option>
            </select>
            <AnimatePresence mode="wait">
              {tarifForm.typeSejour === "court_sejour" ? (
                <motion.div key="court" initial={{opacity:0}} animate={{opacity:1}} style={innerFormBox("#eff6ff")}>
                  <label style={labelStyle}>Court Séjour</label>
                  <input style={inputStyle} type="number" placeholder="Tourisme" value={tarifForm.tourisme} onChange={e => setTarifForm({...tarifForm, tourisme: e.target.value})} required />
                  <input style={inputStyle} type="number" placeholder="Soins" value={tarifForm.soins_medicaux} onChange={e => setTarifForm({...tarifForm, soins_medicaux: e.target.value})} required />
                  <input style={inputStyle} type="number" placeholder="Affaires" value={tarifForm.affaires} onChange={e => setTarifForm({...tarifForm, affaires: e.target.value})} required />
                </motion.div>
              ) : (
                <motion.div key="long" initial={{opacity:0}} animate={{opacity:1}} style={innerFormBox("#f5f3ff")}>
                  <label style={labelStyle}>Long Séjour</label>
                  <input style={inputStyle} type="number" placeholder="Études" value={tarifForm.etudes} onChange={e => setTarifForm({...tarifForm, etudes: e.target.value})} required />
                  <input style={inputStyle} type="number" placeholder="Travail" value={tarifForm.travail} onChange={e => setTarifForm({...tarifForm, travail: e.target.value})} required />
                  <input style={inputStyle} type="number" placeholder="Immigration" value={tarifForm.immigration} onChange={e => setTarifForm({...tarifForm, immigration: e.target.value})} required />
                </motion.div>
              )}
            </AnimatePresence>
            <button type="submit" style={{...publishBtn, backgroundColor: '#0f172a'}}>Enregistrer</button>
          </form>
        </section>
      </div>
    </div>
  );
}

// --- STYLES ---
const uploadArea = (hasImg) => ({
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
  padding: '15px', border: '2px dashed #e2e8f0', borderRadius: '12px', cursor: 'pointer',
  backgroundColor: hasImg ? '#f0fdf4' : '#f8fafc', color: hasImg ? '#166534' : '#64748b',
  fontSize: '12px', fontWeight: 'bold', transition: 'all 0.2s ease'
});

const innerFormBox = (bg) => ({ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', backgroundColor: bg, borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' });
const labelStyle = { fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#64748b', marginBottom: '4px' };
const containerStyle = { padding: "30px", backgroundColor: "#f1f5f9", minHeight: "100vh", fontFamily: "Inter, sans-serif" };
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", backgroundColor: "white", padding: "20px", borderRadius: "20px" };
const titleStyle = { margin: 0, fontSize: "20px", fontWeight: "900" };
const searchWrapper = { display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#f8fafc", padding: "8px 15px", borderRadius: "12px", border: "1px solid #e2e8f0", marginTop: "10px", maxWidth: "350px" };
const searchField = { border: "none", outline: "none", background: "none", width: "100%", fontSize: "14px" };
const dashboardGrid = { display: "grid", gridTemplateColumns: "1.2fr 0.8fr 1fr", gap: "25px" };
const sectionStyle = { backgroundColor: "white", padding: "20px", borderRadius: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" };
const sectionTitle = { fontSize: "16px", fontWeight: "800", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" };
const cardStyle = { padding: "15px", backgroundColor: "#f8fafc", borderRadius: "15px", marginBottom: "12px", border: "1px solid #f1f5f9" };
const cardHeader = { display: "flex", justifyContent: "space-between", marginBottom: "8px" };
const cardFooter = { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" };
const cardDetail = { fontSize: "12px", color: "#64748b" };
const btnDelete = { color: "#94a3b8", background: "none", border: "none", cursor: "pointer" };
const btnRestore = { color: "#2563eb", background: "none", border: "none", cursor: "pointer" };
const archiveTabBtn = { backgroundColor:'#f1f5f9', border:'none', padding:'6px 12px', borderRadius:'8px', cursor:'pointer', fontWeight:'700', color:'#64748b', fontSize: '12px' };
const activeTabBtn = { ...archiveTabBtn, backgroundColor:'#0f172a', color:'white' };
const blogItem = { display:'flex', alignItems:'center', padding:'10px', borderBottom:'1px solid #f1f5f9', justifyContent:'space-between' };
const formStyle = { display: "flex", flexDirection: "column", gap: "12px" };
const inputStyle = { padding: "10px", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none", fontSize: "13px" };
const publishBtn = { backgroundColor: "#2563eb", color: "white", padding: "12px", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' };
const logoutBtn = { backgroundColor: "#fee2e2", color: "#ef4444", padding: "8px 15px", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", display: 'flex', alignItems: 'center', gap: '5px' };
const listContainer = { maxHeight: "600px", overflowY: "auto" };
const statusBadge = (s) => ({
  backgroundColor: s === "Approuvé" ? "#dcfce7" : s === "En cours" ? "#dbeafe" : "#fef3c7",
  color: s === "Approuvé" ? "#166534" : s === "En cours" ? "#1e40af" : "#92400e",
  border: "none", padding: "4px 8px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "11px"
});

export default Admin;