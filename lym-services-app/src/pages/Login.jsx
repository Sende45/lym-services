import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch (error) {
      setError("Identifiants de sécurité incorrects ou accès refusé.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a192f] flex items-center justify-center p-6 relative overflow-hidden">
      {/* EFFETS DE FOND DYNAMIQUE */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[450px] z-10"
      >
        {/* LOGO / ENTÊTE */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-500/20"
          >
            <ShieldCheck size={32} />
          </motion.div>
          <h1 className="text-3xl font-black text-white tracking-tighter mb-2">LYM SERVICES</h1>
          <p className="text-slate-400 font-medium">Console d'administration sécurisée</p>
        </div>

        {/* CARTE DE CONNEXION */}
        <div className="bg-white/10 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Identifiant Admin</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                <input 
                  type="email" 
                  placeholder="admin@lymsservices.com" 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 ring-blue-500/40 focus:bg-white/10 transition-all font-medium"
                  required 
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Mot de passe</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-14 py-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 ring-blue-500/40 focus:bg-white/10 transition-all font-medium"
                  required 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* ERROR MESSAGE */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold p-4 rounded-xl text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* SUBMIT */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>Accéder au Dashboard <ArrowRight size={20} /></>
              )}
            </button>
          </form>
        </div>

        {/* PIED DE PAGE */}
        <p className="text-center mt-8 text-slate-500 text-xs font-medium">
          Accès strictement réservé au personnel autorisé de LYM Services. <br />
          Toute tentative de connexion non autorisée sera enregistrée.
        </p>
      </motion.div>
    </div>
  );
}

export default Login;