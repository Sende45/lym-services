import { NavLink } from "react-router-dom";
import { Plane, CalendarCheck } from "lucide-react"; // Ajout d'une icône pour le bouton payant

function Header() {
  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <NavLink to="/" style={logoStyle}>
          <Plane size={24} color="#2563eb" />
          <span style={brandStyle}>Lym Services</span>
        </NavLink>
        
        <nav style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <ul style={navStyle}>
            <li>
              <NavLink to="/" style={navLinkLogic}>Accueil</NavLink>
            </li>
            <li>
              <NavLink to="/offres" style={navLinkLogic}>Nos Offres</NavLink>
            </li>
            <li>
              <NavLink to="/blog" style={navLinkLogic}>Blog</NavLink>
            </li>
            <li>
              <NavLink to="/contact" style={navLinkLogic}>Contact</NavLink>
            </li>
          </ul>

          {/* NOUVEAU : BOUTON CONSULTATION PAYANTE */}
          <NavLink to="/consultation" style={consultBtnLogic}>
            <CalendarCheck size={18} />
            Consultation (15.000F)
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

// --- Logique dynamique pour les liens standards ---
const navLinkLogic = ({ isActive }) => ({
  textDecoration: "none",
  color: isActive ? "#fff" : "#4b5563",
  backgroundColor: isActive ? "#2563eb" : "transparent",
  padding: "8px 18px",
  borderRadius: "8px",
  fontWeight: "500",
  fontSize: "15px",
  transition: "all 0.2s ease",
});

// --- Logique dynamique pour le bouton Consultation ---
const consultBtnLogic = ({ isActive }) => ({
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: "#fff",
  backgroundColor: isActive ? "#b45309" : "#f59e0b", // Orange plus foncé si actif
  padding: "10px 20px",
  borderRadius: "10px",
  fontWeight: "700",
  fontSize: "14px",
  boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
  transition: "all 0.3s ease",
  border: "none",
});

// --- Styles de base ---
const headerStyle = { 
  height: "80px", // Un peu plus haut pour plus de confort
  backgroundColor: "#fff", 
  display: "flex", 
  alignItems: "center", 
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)", 
  position: "sticky", 
  top: 0, 
  zIndex: 1000 
};

const containerStyle = { 
  width: "90%", 
  maxWidth: "1200px", 
  margin: "0 auto", 
  display: "flex", 
  justifyContent: "space-between", 
  alignItems: "center" 
};

const logoStyle = { 
  display: "flex", 
  alignItems: "center", 
  gap: "10px", 
  textDecoration: "none" 
};

const brandStyle = { 
  fontSize: "22px", 
  fontWeight: "800", 
  color: "#1e293b",
  letterSpacing: "-0.5px"
};

const navStyle = { 
  display: "flex", 
  listStyle: "none", 
  gap: "5px", 
  margin: 0, 
  padding: 0 
};

export default Header;