import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

/**
 * Composant PriceDisplay
 * @param {string} serviceType - Le nom du service (ex: "visa", "consultation")
 */
function PriceDisplay({ serviceType }) {
  const [tarif, setTarif] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({ country: "", code: "" });

  useEffect(() => {
    const fetchLocalTarif = async () => {
      try {
        // 1. Détection de la localisation via l'IP (Gratuit et sans clé API)
        const ipResponse = await fetch("https://ipapi.co/json/");
        const locationData = await ipResponse.json();
        const countryCode = locationData.country_code; // ex: "CI", "FR"
        
        setLocation({ country: locationData.country_name, code: countryCode });

        // 2. Tentative de récupération du tarif spécifique au pays
        // Format de l'ID dans Firestore : "visa_CI"
        const docId = `${serviceType.toLowerCase()}_${countryCode.toUpperCase()}`;
        const docRef = doc(db, "tarifs", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTarif(docSnap.data());
        } else {
          // 3. Fallback : Si pas de prix pour ce pays, on cherche le tarif par défaut
          const defaultId = `${serviceType.toLowerCase()}_DEFAULT`;
          const defaultSnap = await getDoc(doc(db, "tarifs", defaultId));
          
          if (defaultSnap.exists()) {
            setTarif(defaultSnap.data());
          }
        }
      } catch (error) {
        console.error("Erreur PriceDisplay:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocalTarif();
  }, [serviceType]);

  if (loading) return <span style={loadingStyle}>Calcul du tarif local...</span>;

  return (
    <div style={containerStyle}>
      <div style={priceTag}>
        {tarif ? (
          <>
            <span style={currencyStyle}>{tarif.devise}</span>
            <span style={amountStyle}>{tarif.prix.toLocaleString()}</span>
          </>
        ) : (
          <span style={amountStyle}>Sur devis</span>
        )}
      </div>
      <p style={locationNote}>
        📍 Tarif détecté pour : <strong>{location.country || "votre zone"}</strong>
      </p>
    </div>
  );
}

// --- STYLES ÉLÉGANTS ---
const containerStyle = {
  display: "inline-flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "5px"
};

const priceTag = {
  backgroundColor: "#2563eb",
  color: "white",
  padding: "10px 20px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "baseline",
  gap: "8px",
  boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)"
};

const amountStyle = {
  fontSize: "1.8rem",
  fontWeight: "800",
};

const currencyStyle = {
  fontSize: "1rem",
  fontWeight: "600",
  opacity: 0.9
};

const locationNote = {
  fontSize: "11px",
  color: "#64748b",
  margin: 0,
  fontStyle: "italic"
};

const loadingStyle = {
  fontSize: "14px",
  color: "#94a3b8",
  fontStyle: "italic"
};

export default PriceDisplay;