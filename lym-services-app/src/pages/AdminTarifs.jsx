import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AdminTarifs = () => {
  const [activeZone, setActiveZone] = useState("europe_court_sejour");
  const [prixTourisme, setPrixTourisme] = useState(0);
  const [loading, setLoading] = useState(false);

  // Charger les données
  useEffect(() => {
    const loadData = async () => {
      const snap = await getDoc(doc(db, "tarifs", activeZone));
      if (snap.exists()) {
        setPrixTourisme(snap.data().prix?.tourisme || 0);
      }
    };
    loadData();
  }, [activeZone]);

  // Sauvegarder
  const handleSave = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, "tarifs", activeZone), {
        prix: { tourisme: Number(prixTourisme), etudes: 0, affaires: 0 }
      }, { merge: true });
      alert("Enregistré avec succès !");
    } catch (e) {
      alert("Erreur de connexion");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Réglages Lym Services</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label>Zone : </label>
        <select value={activeZone} onChange={(e) => setActiveZone(e.target.value)}>
          <option value="europe_court_sejour">Europe - Court</option>
          <option value="afrique_court_sejour">Afrique - Court</option>
          <option value="canada_court_sejour">Canada - Court</option>
        </select>
      </div>

      <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '10px' }}>
        <label>Prix Tourisme (FCFA) : </label>
        <input 
          type="number" 
          value={prixTourisme} 
          onChange={(e) => setPrixTourisme(e.target.value)}
        />
        <button 
          onClick={handleSave} 
          disabled={loading}
          style={{ marginLeft: '10px', background: 'blue', color: 'white', border: 'none', padding: '5px 15px', cursor: 'pointer' }}
        >
          {loading ? "Chargement..." : "Sauvegarder"}
        </button>
      </div>
    </div>
  );
};

export default AdminTarifs;