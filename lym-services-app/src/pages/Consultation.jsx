import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function Consultation() {
  const [formData, setFormData] = useState({ nom: "", email: "", type: "Standard" });
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Enregistre l'intention de consultation dans Firebase
    try {
      await addDoc(collection(db, "consultations"), {
        ...formData,
        statut: "En attente de paiement",
        dateDemande: serverTimestamp(),
        prix: "15 000 FCFA"
      });

      // 2. Redirection vers un lien de paiement (Exemple avec un lien externe)
      // Dans un vrai projet, tu intégrerais ici l'API de ton partenaire de paiement
      alert("Demande enregistrée. Vous allez être redirigé vers la plateforme sécurisée de paiement Mobile Money.");
      window.location.href = "https://mes-paiements.com/lym-services"; 
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={{ color: "#1e293b" }}>Consultation Privée</h1>
        <p style={warningText}>
          ⚠️ **Note importante** : La consultation est facturée **15 000 FCFA**. 
          Ce montant est **non remboursable** et sera déduit de vos frais de dossier si vous validez une procédure avec nous.
        </p>

        <form onSubmit={handlePayment} style={formStyle}>
          <label style={labelStyle}>Nom Complet</label>
          <input type="text" required style={inputStyle} onChange={e => setFormData({...formData, nom: e.target.value})} />
          
          <label style={labelStyle}>Email</label>
          <input type="email" required style={inputStyle} onChange={e => setFormData({...formData, email: e.target.value})} />

          <label style={labelStyle}>Type de projet</label>
          <select style={inputStyle} onChange={e => setFormData({...formData, type: e.target.value})}>
            <option>Immigration </option>
            <option>Visa Études</option>
            <option>Tourisme ou Visite famille</option>
          </select>

          <button type="submit" style={payBtn} disabled={loading}>
            {loading ? "Traitement..." : "Payer 15 000 FCFA & Réserver"}
          </button>
        </form>
      </div>
    </div>
  );
}

// STYLES
const pageStyle = { backgroundColor: "#f1f5f9", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" };
const cardStyle = { backgroundColor: "white", padding: "40px", borderRadius: "16px", maxWidth: "500px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" };
const warningText = { backgroundColor: "#fffbeb", color: "#92400e", padding: "15px", borderRadius: "8px", fontSize: "14px", border: "1px solid #fde68a", marginBottom: "20px" };
const formStyle = { display: "flex", flexDirection: "column", gap: "15px" };
const labelStyle = { fontSize: "14px", fontWeight: "bold", color: "#475569" };
const inputStyle = { padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1" };
const payBtn = { backgroundColor: "#2563eb", color: "white", padding: "15px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "16px" };

export default Consultation;