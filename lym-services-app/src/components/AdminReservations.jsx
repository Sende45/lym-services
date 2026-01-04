import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { CheckCircle, Clock, Trash2, Send } from "lucide-react";

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);

  // Récupération des réservations en temps réel
  useEffect(() => {
    const q = query(collection(db, "reservations"), orderBy("dateCreation", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReservations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Fonction pour mettre à jour le statut
  const updateStatus = async (id, newStatus) => {
    const docRef = doc(db, "reservations", id);
    await updateDoc(docRef, { statut: newStatus });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approuvé": return { color: "#10b981", bg: "#ecfdf5" };
      case "En cours": return { color: "#3b82f6", bg: "#eff6ff" };
      default: return { color: "#f59e0b", bg: "#fffbeb" };
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Gestion des Dossiers Clients</h2>
      <div style={{ display: "grid", gap: "15px" }}>
        {reservations.map((res) => {
          const style = getStatusStyle(res.statut);
          return (
            <div key={res.id} style={resCardStyle}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "800", fontSize: "16px" }}>{res.nomClient}</div>
                <div style={{ fontSize: "14px", color: "#64748b" }}>
                  Destination : <strong>{res.paysDestination}</strong> ({res.typeVisa})
                </div>
                <div style={{ fontSize: "13px", color: "#2563eb", marginTop: "5px" }}>
                  Montant : {res.montantEstime?.toLocaleString()} FCFA
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <span style={{ ...statusBadge, color: style.color, backgroundColor: style.bg }}>
                  {res.statut}
                </span>
                <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
                  <button onClick={() => updateStatus(res.id, "En cours")} style={btnIcon} title="Traiter"><Clock size={16}/></button>
                  <button onClick={() => updateStatus(res.id, "Approuvé")} style={btnIconSuccess} title="Valider"><CheckCircle size={16}/></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- STYLES ---
const resCardStyle = { display: "flex", backgroundColor: "white", padding: "20px", borderRadius: "16px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", alignItems: "center", border: "1px solid #e2e8f0" };
const statusBadge = { padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" };
const btnIcon = { padding: "8px", borderRadius: "8px", border: "none", backgroundColor: "#f1f5f9", cursor: "pointer", color: "#64748b" };
const btnIconSuccess = { padding: "8px", borderRadius: "8px", border: "none", backgroundColor: "#ecfdf5", cursor: "pointer", color: "#10b981" };

export default AdminReservations;