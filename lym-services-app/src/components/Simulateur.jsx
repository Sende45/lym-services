import React, { useState, useEffect, useMemo } from "react";
import { db } from "../firebase";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import countryList from "react-select-country-list"; 
import { Globe, Clock, ShieldCheck, Search, Send, X, CheckCircle } from "lucide-react";

function Simulateur() {
  const [selection, setSelection] = useState({
    pays: "",
    continent: "europe",
    typeSejour: "court_sejour",
    typeVisa: "tourisme"
  });
  
  const [prix, setPrix] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // État pour le formulaire de contact
  const [contactInfo, setContactInfo] = useState({ nom: "", whatsapp: "", email: "" });

  const options = useMemo(() => countryList().getData(), []);

  useEffect(() => {
    const fetchTarif = async () => {
      setLoading(true);
      try {
        const docId = `${selection.continent.toLowerCase()}_${selection.typeSejour}`;
        const docRef = doc(db, "tarifs", docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPrix(docSnap.data().prix[selection.typeVisa] || 0);
        } else { setPrix(0); }
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchTarif();
  }, [selection]);

  // Étape 1 : Ouvrir le formulaire
  const handleOpenForm = () => {
    if (!selection.pays) return alert("Veuillez d'abord choisir un pays.");
    setShowModal(true);
  };

  // Étape 2 : Validation finale, Firebase et Redirection WhatsApp
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // REMPLACE PAR TON NUMÉRO (Code pays + numéro, sans le + ni espaces)
    const monNumeroWhatsapp = "2250708072448"; 

    try {
      // 1. Enregistrement dans Firebase
      await addDoc(collection(db, "reservations"), {
        ...contactInfo,
        ...selection,
        montantEstime: prix,
        statut: "Nouveau",
        date: serverTimestamp()
      });

      // 2. Préparation du message WhatsApp
      const message = `Bonjour Lym Services ! 👋%0A%0A` +
                      `Je souhaite démarrer une procédure de visa :%0A` +
                      `🌍 *Destination :* ${selection.pays}%0A` +
                      `📄 *Type :* ${selection.typeVisa}%0A` +
                      `⏳ *Durée :* ${selection.typeSejour}%0A` +
                      `💰 *Estimation :* ${prix.toLocaleString()} FCFA%0A%0A` +
                      `Mon nom est : *${contactInfo.nom}*`;

      const whatsappUrl = `https://wa.me/${monNumeroWhatsapp}?text=${message}`;

      setIsSuccess(true);

      // 3. Redirection après un petit délai
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
        setShowModal(false);
        setIsSuccess(false);
      }, 2000);

    } catch (err) { 
      alert("Erreur de connexion"); 
    }
    setLoading(false);
  };

  return (
    <div style={wrapperStyle}>
      <div style={searchBarGrid}>
        <div style={inputGroup}>
          <label style={labelStyle}>DESTINATION</label>
          <div style={inputWrapper}>
            <Globe size={18} style={iconStyle} />
            <select name="pays" style={selectStyle} value={selection.pays} onChange={(e) => setSelection({...selection, pays: e.target.value})}>
              <option value="">Entrez un pays...</option>
              {options.map((c) => <option key={c.value} value={c.label}>{c.label}</option>)}
            </select>
          </div>
        </div>

        <div style={inputGroup}>
          <label style={labelStyle}>CONTINENT</label>
          <div style={inputWrapper}>
            <Search size={18} style={iconStyle} />
            <select name="continent" style={selectStyle} value={selection.continent} onChange={(e) => setSelection({...selection, continent: e.target.value})}>
              <option value="europe">Europe</option>
              <option value="canada">Amérique du Nord</option>
              <option value="asie">Asie</option>
              <option value="afrique">Afrique</option>
            </select>
          </div>
        </div>

        <div style={inputGroup}>
          <label style={labelStyle}>DURÉE</label>
          <div style={inputWrapper}>
            <Clock size={18} style={iconStyle} />
            <select style={selectStyle} onChange={(e) => setSelection({...selection, typeSejour: e.target.value})}>
              <option value="court_sejour">Court Séjour</option>
              <option value="long_sejour">Long Séjour</option>
            </select>
          </div>
        </div>

        <div style={inputGroup}>
          <label style={labelStyle}>TYPE DE VISA</label>
          <div style={inputWrapper}>
            <ShieldCheck size={18} style={iconStyle} />
            <select style={selectStyle} onChange={(e) => setSelection({...selection, typeVisa: e.target.value})}>
              <option value="tourisme">Tourisme</option>
              <option value="etudes">Études / Master</option>
              <option value="affaires">Affaires</option>
            </select>
          </div>
        </div>
      </div>

      <div style={footerFlex}>
        <div style={priceDisplay}>
          <span style={{fontSize: '13px', color: '#64748b', fontWeight: '600'}}>Estimation Lym Services</span>
          <div style={{fontSize: '32px', fontWeight: '900', color: '#1e293b'}}>
            {loading ? "..." : prix > 0 ? `${prix.toLocaleString()} FCFA` : "Sur devis"}
          </div>
        </div>
        
        <button onClick={handleOpenForm} style={bookBtn}>
          Démarrer ma procédure <Send size={18} />
        </button>
      </div>

      {/* --- MODAL DE FORMULAIRE --- */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            {!isSuccess ? (
              <>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                  <h3 style={{margin: 0, color: '#1e293b'}}>Valider ma demande</h3>
                  <X onClick={() => setShowModal(false)} style={{cursor:'pointer', color: '#64748b'}} />
                </div>
                <p style={{fontSize:'14px', color:'#64748b', marginBottom:'20px'}}>
                  Destination : <b style={{color: '#2563eb'}}>{selection.pays}</b>
                </p>
                <form onSubmit={handleFinalSubmit}>
                  <label style={fieldLabel}>Nom complet</label>
                  <input required placeholder="Ex: EBI ELODIE" style={modalInput} onChange={(e) => setContactInfo({...contactInfo, nom: e.target.value})} />
                  
                  <label style={fieldLabel}>Numéro WhatsApp</label>
                  <input required placeholder="Ex: +2250708072448" style={modalInput} onChange={(e) => setContactInfo({...contactInfo, whatsapp: e.target.value})} />
                  
                  <label style={fieldLabel}>Email (Optionnel)</label>
                  <input type="email" placeholder="votre@email.com" style={modalInput} onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})} />
                  
                  <button type="submit" disabled={loading} style={confirmBtn}>
                    {loading ? "Traitement..." : "Confirmer et ouvrir WhatsApp"}
                  </button>
                </form>
              </>
            ) : (
              <div style={{textAlign:'center', padding:'20px'}}>
                <CheckCircle size={60} color="#22c55e" />
                <h3 style={{marginTop:'15px', color: '#1e293b'}}>Demande Reçue !</h3>
                <p style={{color: '#64748b'}}>Redirection vers WhatsApp en cours...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- STYLES ---
const wrapperStyle = { background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.12)', maxWidth: '1100px', margin: '0 auto', border: '1px solid #f1f5f9' };
const searchBarGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '11px', fontWeight: '900', color: '#94a3b8', letterSpacing: '1.2px' };
const inputWrapper = { display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '0 15px', height: '55px' };
const selectStyle = { border: 'none', background: 'transparent', width: '100%', outline: 'none', fontSize: '15px', fontWeight: '700', color: '#1e293b' };
const iconStyle = { color: '#2563eb', marginRight: '12px' };
const footerFlex = { marginTop: '30px', paddingTop: '25px', borderTop: '1px dashed #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' };
const priceDisplay = { textAlign: 'left' };
const bookBtn = { backgroundColor: '#7c3aed', color: 'white', padding: '16px 32px', borderRadius: '14px', border: 'none', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 20px rgba(124, 58, 237, 0.3)', transition: '0.3s' };

const modalOverlay = { position: 'fixed', top:0, left:0, right:0, bottom:0, backgroundColor:'rgba(15, 23, 42, 0.6)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000, backdropFilter: 'blur(4px)' };
const modalContent = { background:'white', padding:'40px', borderRadius:'24px', width:'95%', maxWidth:'450px', boxShadow:'0 25px 50px -12px rgba(0,0,0,0.25)' };
const fieldLabel = { fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '5px', display: 'block' };
const modalInput = { width:'100%', padding:'15px', borderRadius:'12px', border:'1.5px solid #e2e8f0', marginBottom:'15px', outline:'none', fontSize: '14px', boxSizing: 'border-box' };
const confirmBtn = { width:'100%', backgroundColor:'#2563eb', color:'white', padding:'16px', borderRadius:'12px', border:'none', fontWeight:'800', cursor:'pointer', fontSize: '16px', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.4)' };

export default Simulateur;