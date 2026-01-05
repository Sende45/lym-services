import React, { useState, useEffect, useMemo } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import countryList from "react-select-country-list"; // npm install react-select-country-list
import { Globe, Clock, ShieldCheck, Search } from "lucide-react";

function Simulateur() {
  const [selection, setSelection] = useState({
    pays: "",
    continent: "Europe",
    typeSejour: "court_sejour",
    typeVisa: "tourisme"
  });
  
  const [prix, setPrix] = useState(0);
  const [loading, setLoading] = useState(false);

  // Génère la liste des pays du monde entier
  const options = useMemo(() => countryList().getData(), []);

  useEffect(() => {
    const fetchTarif = async () => {
      if (!selection.continent) return;
      setLoading(true);
      try {
        // Logique pro : On cherche par continent car les tarifs sont souvent zonés
        const docId = `${selection.continent.toLowerCase()}_${selection.typeSejour}`;
        const docRef = doc(db, "tarifs", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPrix(docSnap.data().prix[selection.typeVisa] || 0);
        } else {
          setPrix(0);
        }
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchTarif();
  }, [selection]);

  return (
    <div style={wrapperStyle}>
      {/* BARRE DE RECHERCHE PRO */}
      <div style={searchBarGrid}>
        
        {/* DESTINATION (Liste Monde Entier) */}
        <div style={inputGroup}>
          <label style={labelStyle}>DESTINATION</label>
          <div style={inputWrapper}>
            <Globe size={18} style={iconStyle} />
            <select 
              name="pays" 
              style={selectStyle} 
              value={selection.pays}
              onChange={(e) => setSelection({...selection, pays: e.target.value})}
            >
              <option value="">Entrez un pays...</option>
              {options.map((country) => (
                <option key={country.value} value={country.label}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CONTINENT (Pour la liaison avec vos tarifs Firebase) */}
        <div style={inputGroup}>
          <label style={labelStyle}>CONTINENT</label>
          <div style={inputWrapper}>
            <Search size={18} style={iconStyle} />
            <select 
              name="continent" 
              style={selectStyle} 
              onChange={(e) => setSelection({...selection, continent: e.target.value})}
            >
              <option value="europe">Europe</option>
              <option value="canada">Amérique du Nord</option>
              <option value="asie">Asie</option>
              <option value="afrique">Afrique</option>
            </select>
          </div>
        </div>

        {/* DURÉE */}
        <div style={inputGroup}>
          <label style={labelStyle}>DURÉE</label>
          <div style={inputWrapper}>
            <Clock size={18} style={iconStyle} />
            <select 
              name="typeSejour" 
              style={selectStyle} 
              onChange={(e) => setSelection({...selection, typeSejour: e.target.value})}
            >
              <option value="court_sejour">Court Séjour</option>
              <option value="long_sejour">Long Séjour</option>
            </select>
          </div>
        </div>

        {/* TYPE DE VISA */}
        <div style={inputGroup}>
          <label style={labelStyle}>TYPE DE VISA</label>
          <div style={inputWrapper}>
            <ShieldCheck size={18} style={iconStyle} />
            <select 
              name="typeVisa" 
              style={selectStyle} 
              onChange={(e) => setSelection({...selection, typeVisa: e.target.value})}
            >
              <option value="tourisme">Tourisme</option>
              <option value="etudes">Études / Master</option>
              <option value="affaires">Affaires</option>
            </select>
          </div>
        </div>

      </div>

      {/* AFFICHAGE DU PRIX STYLE BANQUE / AGENCE PRO */}
      <div style={priceDisplay}>
        <span style={{fontSize: '14px', color: '#64748b'}}>Estimation Lym Services</span>
        <div style={{fontSize: '32px', fontWeight: '800', color: '#1e293b'}}>
          {loading ? "..." : prix > 0 ? `${prix.toLocaleString()} FCFA` : "Sur devis"}
        </div>
      </div>
    </div>
  );
}

// --- STYLES DESIGN SYSTEM ---
const wrapperStyle = {
  background: 'white',
  padding: '25px',
  borderRadius: '20px',
  boxShadow: '0 15px 35px rgba(0,0,0,0.07)',
  maxWidth: '1100px',
  margin: '0 auto'
};

const searchBarGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '15px',
  alignItems: 'end'
};

const inputGroup = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '11px', fontWeight: '800', color: '#94a3b8', letterSpacing: '1px' };

const inputWrapper = {
  display: 'flex',
  alignItems: 'center',
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  padding: '0 12px',
  height: '50px',
  transition: 'all 0.2s'
};

const selectStyle = {
  border: 'none',
  background: 'transparent',
  width: '100%',
  height: '100%',
  outline: 'none',
  fontSize: '14px',
  color: '#1e293b',
  fontWeight: '600',
  cursor: 'pointer'
};

const iconStyle = { color: '#3b82f6', marginRight: '10px' };

const priceDisplay = {
  marginTop: '30px',
  paddingTop: '20px',
  borderTop: '1px dashed #e2e8f0',
  textAlign: 'right'
};

export default Simulateur;