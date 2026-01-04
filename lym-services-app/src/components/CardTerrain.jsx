// CardTerrain.jsx
function CardTerrain({ terrain }) {
  return (
    <div className="card">
      <img src={terrain.image} alt={terrain.localisation} />
      <h3>{terrain.localisation}</h3>
      <p>Superficie: {terrain.superficie} m²</p>
      <p>Prix: {terrain.prix}</p>
      <button>Contacter</button>
    </div>
  );
}
export default CardTerrain;
