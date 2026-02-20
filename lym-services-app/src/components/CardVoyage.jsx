import React from "react";
import { Link } from "react-router-dom"; // Import indispensable pour la navigation
import { ArrowRight } from "lucide-react";

function CardVoyage({ id, image, titre, prix }) {
  return (
    <div style={cardStyle} className="group">
      <div style={imgContainer}>
        <img 
          src={image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800"} 
          alt={titre} 
          style={imgStyle} 
        />
      </div>
      
      <div style={contentStyle}>
        <h3 style={titleStyle}>{titre}</h3>
        
        <p style={priceStyle}>
          {prix?.toLocaleString()} 
          <span style={currency}> FCFA / pers.</span>
        </p>

        {/* Le bouton devient un Link pour envoyer vers la page de destination */}
        <Link to={`/destination/${id}`} style={btnStyle}>
          Voir les détails <ArrowRight size={16} style={{ marginLeft: '8px' }} />
        </Link>
      </div>
    </div>
  );
}

// --- STYLES MIS À JOUR ---
const cardStyle = { 
  backgroundColor: "#fff", 
  borderRadius: "24px", // Plus arrondi pour le look "Elite"
  overflow: "hidden", 
  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
  transition: "transform 0.3s ease",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  border: "1px solid #f1f5f9"
};

const imgContainer = { 
  height: "250px", 
  width: "100%", 
  overflow: "hidden" 
};

const imgStyle = { 
  width: "100%", 
  height: "100%", 
  objectFit: "cover",
  transition: "transform 0.5s ease" 
};

const contentStyle = { 
  padding: "24px", 
  display: "flex", 
  flexDirection: "column", 
  flexGrow: 1 
};

const titleStyle = { 
  margin: "0 0 10px 0", 
  fontSize: "22px", 
  fontWeight: "800", 
  color: "#0f172a",
  letterSpacing: "-0.5px"
};

const priceStyle = { 
  fontSize: "24px", 
  fontWeight: "900", 
  color: "#2563eb", 
  margin: "10px 0 20px 0" 
};

const currency = { 
  fontSize: "13px", 
  fontWeight: "500", 
  color: "#64748b",
  textTransform: "uppercase"
};

const btnStyle = { 
  width: "100%", 
  padding: "14px", 
  border: "none", 
  borderRadius: "14px", 
  backgroundColor: "#0f172a", // Couleur sombre pour plus de contraste "Pro"
  color: "#fff", 
  fontWeight: "700", 
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.2s ease"
};

export default CardVoyage;