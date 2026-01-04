import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin"); // Redirige vers l'admin si succès
    } catch (error) {
      alert("Identifiants incorrects !");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "100px" }}>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px", width: "300px" }}>
        <h2>Connexion Admin</h2>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
        <input type="password" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
        <button type="submit" style={btnStyle}>Se connecter</button>
      </form>
    </div>
  );
}

const inputStyle = { padding: "10px", borderRadius: "5px", border: "1px solid #ccc" };
const btnStyle = { backgroundColor: "#2563eb", color: "white", padding: "10px", border: "none", cursor: "pointer" };

export default Login;