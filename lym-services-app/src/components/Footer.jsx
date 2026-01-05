import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";

function Footer() {
  return (
    <footer>
      

      {/* Footer Noir */}
      <div style={mainFooter}>
        <div style={footerGrid}>
          <div style={col}>
            <h3>LYM Services</h3>
            <p>Votre partenaire de confiance pour des voyages inoubliables.</p>
            <div style={socials}><Facebook size={20}/> <Instagram size={20}/> <Twitter size={20}/></div>
          </div>
          <div style={col}>
            <h3>Contact</h3>
            <p><MapPin size={16}/> Abidjan, Côte d'Ivoire</p>
            <p><Phone size={16}/> +225 07 97 43 68 95</p>
            <p><Mail size={16}/> lymglobalservices@gmail.com</p>
          </div>
          <div style={col}>
            <h3>Horaires d'ouverture</h3>
            <p>Lundi - Vendredi: 8h00 - 18h00</p>
            <p>Samedi: 9h00 - 16h00</p>
            <p>Dimanche: Fermé</p>
          </div>
        </div>
        <div style={copyright}>© 2026 LYM Services. Tous droits réservés.</div>
      </div>
    </footer>
  );
}

const ctaSection = { backgroundColor: "#2563eb", color: "#white", padding: "60px 20px", textAlign: "center" };
const btnCta = { padding: "15px 40px", backgroundColor: "#fff", color: "#2563eb", border: "none", borderRadius: "8px", fontWeight: "bold", marginTop: "20px", cursor: "pointer" };
const mainFooter = { backgroundColor: "#0f172a", color: "#94a3b8", padding: "60px 10% 20px" };
const footerGrid = { display: "flex", justifyContent: "space-between", gap: "40px", marginBottom: "40px" };
const col = { flex: 1 };
const socials = { display: "flex", gap: "15px", marginTop: "15px", color: "#fff" };
const copyright = { borderTop: "1px solid #1e293b", paddingTop: "20px", textAlign: "center", fontSize: "14px" };

export default Footer;