import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Plane, CalendarCheck, LayoutDashboard, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // Empêche le scroll derrière quand le menu est ouvert
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  const links = [
    { name: "Accueil", path: "/" },
    { name: "Offres", path: "/offres" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    /* MODIF CLÉ : 
       - bg-white (et non bg-white/95) pour une opacité totale.
       - z-[9999] pour passer AU-DESSUS de tout le contenu du site.
       - shadow-sm pour bien séparer le menu du reste de la page.
    */
    <header className="fixed top-0 left-0 right-0 h-20 bg-white shadow-sm border-b border-slate-100 z-[9999] flex items-center">
      <div className="w-[92%] max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO */}
        <NavLink to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 z-[10000]">
          <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md">
            <Plane size={20} />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tighter">
            LYM<span className="text-blue-600 italic font-medium">Services</span>
          </span>
        </NavLink>
        
        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <NavLink 
              key={link.path} 
              to={link.path} 
              className={({ isActive }) => `text-sm font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
            >
              {link.name}
            </NavLink>
          ))}
          <NavLink to="/consultation" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
            Consultation
          </NavLink>
        </nav>

        {/* BOUTON MOBILE */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-slate-900 z-[10000]">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MENU MOBILE PLEIN ÉCRAN */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            /* bg-white pur ici aussi pour cacher le contenu du dessous */
            className="fixed inset-0 bg-white z-[9998] flex flex-col p-8 pt-32 lg:hidden"
          >
            <div className="flex flex-col gap-8">
              {links.map((link) => (
                <NavLink 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  className="text-4xl font-black text-slate-900 border-b border-slate-50 pb-4"
                >
                  {link.name}
                </NavLink>
              ))}
              <NavLink 
                to="/consultation" 
                onClick={() => setIsOpen(false)}
                className="mt-4 w-full bg-blue-600 text-white py-5 rounded-2xl text-center font-black text-lg"
              >
                Consultation
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;