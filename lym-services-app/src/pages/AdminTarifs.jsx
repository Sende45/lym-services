import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AdminTarifs = () => {
  const [activeZone, setActiveZone] = useState("europe_court_sejour");
  const [loading, setLoading] = useState(false);

  const [prix, setPrix] = useState({
    tourisme: 0,
    etudes: 0,
    soins_medicaux: 0,
    immigration: 0,
    travail: 0,
  });

  // Charger les données
  useEffect(() => {
    const loadData = async () => {
      const snap = await getDoc(doc(db, "tarifs", activeZone));
      if (snap.exists()) {
        setPrix({
          tourisme: snap.data().prix?.tourisme || 0,
          etudes: snap.data().prix?.etudes || 0,
          soins_medicaux: snap.data().prix?.soins_medicaux || 0,
          immigration: snap.data().prix?.immigration || 0,
          travail: snap.data().prix?.travail || 0,
        });
      } else {
        setPrix({
          tourisme: 0,
          etudes: 0,
          soins_medicaux: 0,
          immigration: 0,
          travail: 0,
        });
      }
    };
    loadData();
  }, [activeZone]);

  // Sauvegarde
  const handleSave = async () => {
    setLoading(true);
    try {
      await setDoc(
        doc(db, "tarifs", activeZone),
        {
          prix: {
            tourisme: Number(prix.tourisme),
            etudes: Number(prix.etudes),
            soins_medicaux: Number(prix.soins_medicaux),
            immigration: Number(prix.immigration),
            travail: Number(prix.travail),
          },
        },
        { merge: true }
      );
      alert("✅ Tarifs enregistrés avec succès !");
    } catch (e) {
      console.error(e);
      alert("❌ Erreur de sauvegarde");
    }
    setLoading(false);
  };

  const handleChange = (field, value) => {
    setPrix((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "600px" }}>
      <h1>Réglages LYM Services</h1>

      {/* ZONE */}
      <div style={{ marginBottom: "20px" }}>
        <label>Zone : </label>
        <select
          value={activeZone}
          onChange={(e) => setActiveZone(e.target.value)}
        >
          <option value="europe_court_sejour">Europe - Court séjour</option>
          <option value="afrique_court_sejour">Afrique - Court séjour</option>
          <option value="canada_court_sejour">Canada - Court séjour</option>
        </select>
      </div>

      {/* TARIFS */}
      <div
        style={{
          background: "#f8fafc",
          padding: "20px",
          borderRadius: "12px",
          display: "grid",
          gap: "15px",
        }}
      >
        <TarifInput label="Tourisme" value={prix.tourisme} onChange={(v) => handleChange("tourisme", v)} />
        <TarifInput label="Études" value={prix.etudes} onChange={(v) => handleChange("etudes", v)} />
        <TarifInput label="Soins médicaux" value={prix.soins_medicaux} onChange={(v) => handleChange("soins_medicaux", v)} />
        <TarifInput label="Immigration" value={prix.immigration} onChange={(v) => handleChange("immigration", v)} />
        <TarifInput label="Travail" value={prix.travail} onChange={(v) => handleChange("travail", v)} />

        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "700",
          }}
        >
          {loading ? "Enregistrement..." : "Sauvegarder"}
        </button>
      </div>
    </div>
  );
};

// Champ réutilisable
const TarifInput = ({ label, value, onChange }) => (
  <div style={{ display: "flex", justifyContent: "space-between" }}>
    <label>{label} (FCFA)</label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: "140px" }}
    />
  </div>
);

export default AdminTarifs;
