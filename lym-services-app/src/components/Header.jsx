import React, { useState, useEffect } from "react"; // Ajout de useEffect
import { NavLink } from "react-router-dom";
import { Plane, CalendarCheck, LayoutDashboard, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // --- MODIF PRO : BLOQUER LE SCROLL QUAND LE MENU EST OUVERT ---
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  // Style Elite pour les liens
  const navLinkClass = ({ isActive }) => 
    `relative flex items-center gap-2 px-3 py-2 font-bold text-[13px] uppercase tracking-wider transition-all duration-300 group ${
      isActive ? "text-blue-600" : "text-slate-500 hover:text-blue-600"
    }`;

  // Style pour le bouton consultation
  const consultBtnClass = ({ isActive }) => `
    relative overflow-hidden flex items-center gap-2 px-7 py-3 rounded-2xl font-black text-[12px] uppercase tracking-widest transition-all duration-500
    ${isActive 
      ? "bg-slate-900 text-white shadow-2xl scale-95" 
      : "bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 text-white shadow-[0_10px_20px_-10px_rgba(245,158,11,0.5)] hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(245,158,11,0.6)]"
    }
  `;

  const links = [
    { name: "Accueil", path: "/" },
    { name: "Offres", path: "/offres" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-white border-b border-slate-200/50 z-[1000] flex items-center">
      <div className="w-[92%] max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO ELITE */}
        <NavLink to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 group z-[1100]">
          <div className="relative p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg shadow-blue-200 group-hover:scale-110 transition-all duration-300">
            <Plane size={20} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-[1000] text-slate-900 leading-none tracking-tighter">
              LYM<span className="text-blue-600 italic font-serif font-medium ml-0.5">Services</span>
            </span>
            <span className="hidden md:block text-[8px] font-black text-blue-600/60 tracking-[0.2em] uppercase leading-none mt-1">
              International Business
            </span>
          </div>
        </NavLink>
        
        {/* NAVIGATION DESKTOP */}
        <nav className="hidden lg:flex items-center gap-6">
          <ul className="flex items-center gap-2">
            {links.map((link) => (
              <li key={link.path}>
                <NavLink to={link.path} className={navLinkClass}>
                  {({ isActive }) => (
                    <>
                      {link.name}
                      <span className={`absolute -bottom-1 left-3 right-3 h-[3px] rounded-full bg-blue-600 transition-all duration-500 transform origin-center ${
                        isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0 group-hover:scale-x-50"
                      }`} />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="h-8 w-[1px] bg-slate-200/80 mx-2" />

          <NavLink to="/consultation" className={consultBtnClass}>
            <CalendarCheck size={16} />
            <span className="relative z-10">Consultation</span>
          </NavLink>
          
          <NavLink to="/login" className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all">
            <LayoutDashboard size={18} />
          </NavLink>
        </nav>

        {/* MENU MOBILE ICONE */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-slate-900 z-[1100]"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* RIDEAU MENU MOBILE - MODIFIÉ POUR ÊTRE TOTALEMENT OPAQUE ET PRO */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white z-[1050] flex flex-col p-8 pt-28 lg:hidden"
          >
            <div className="flex flex-col gap-6">
              {links.map((link) => (
                <NavLink 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  className="text-3xl font-black text-slate-900 hover:text-blue-600 transition-colors border-b border-slate-50 pb-4 tracking-tighter"
                >
                  {link.name}
                </NavLink>
              ))}
              
              <NavLink 
                to="/consultation" 
                onClick={() => setIsOpen(false)}
                className="mt-4 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-100"
              >
                <CalendarCheck size={20} /> Consultation
              </NavLink>

              <NavLink 
                to="/login" 
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-3 bg-slate-50 text-slate-600 py-4 rounded-2xl font-bold"
              >
                <LayoutDashboard size={18} /> Espace Client
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;