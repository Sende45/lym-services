function CardVoyage({ image, titre, prix }) {
  return (
    <div style={cardStyle}>
      <div style={imgContainer}>
        <img src={image} alt={titre} style={imgStyle} />
      </div>
      <div style={contentStyle}>
        <h3 style={titleStyle}>{titre}</h3>
        <p style={priceStyle}>{prix} <span style={currency}>FCFA / pers.</span></p>
        <button style={btnStyle}>Voir les détails</button>
      </div>
    </div>
  );
}

const cardStyle = { backgroundColor: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" };
const imgContainer = { height: "230px", width: "100%" };
const imgStyle = { width: "100%", height: "100%", objectFit: "cover" };
const contentStyle = { padding: "24px" };
const titleStyle = { margin: "0 0 10px 0", fontSize: "20px", fontWeight: "700" };
const priceStyle = { fontSize: "22px", fontWeight: "800", color: "#2563eb", margin: "10px 0" };
const currency = { fontSize: "14px", fontWeight: "400", color: "#64748b" };
const btnStyle = { width: "100%", padding: "12px", border: "none", borderRadius: "10px", backgroundColor: "#f1f5f9", color: "#475569", fontWeight: "600", cursor: "pointer" };

export default CardVoyage;