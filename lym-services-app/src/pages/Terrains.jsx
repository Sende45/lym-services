// src/pages/Terrains.jsx
import { useState, useEffect } from "react";
import CardTerrain from "../components/CardTerrain";

// Exemple de données locales (pour test)
const terrainsData = [
  {
    id: 1,
    localisation: "Abidjan",
    superficie: 500,
    prix: "50 000 €",
    image: "https://via.placeholder.com/250"
  },
  {
    id: 2,
    localisation: "Yamoussoukro",
    superficie: 1000,
    prix: "80 000 €",
    image: "https://via.placeholder.com/250"
  }
];

function Terrains() {
  const [terrains, setTerrains] = useState([]);

  useEffect(() => {
    // Pour l'instant, on utilise des données locales
    setTerrains(terrainsData);

    // Plus tard, on pourra remplacer par un fetch depuis une API
    // axios.get("/api/terrains").then(res => setTerrains(res.data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Nos terrains à vendre</h2>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {terrains.map((terrain) => (
          <CardTerrain key={terrain.id} terrain={terrain} />
        ))}
      </div>
    </div>
  );
}

export default Terrains;
