import React from "react";
import { NavLink } from "react-router-dom";
import { Plane, CalendarCheck, LayoutDashboard } from "lucide-react";

function Header() {
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

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 z-[1000] flex items-center">
      <div className="w-[92%] max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO ELITE */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="relative p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg shadow-blue-200 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <Plane size={22} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-[1000] text-slate-900 leading-none tracking-tighter">
              LYM<span className="text-blue-600 italic font-serif font-medium ml-0.5">Services</span>
            </span>
            <span className="text-[8px] font-black text-blue-600/60 tracking-[0.2em] uppercase leading-none mt-1">
              International Business
            </span>
          </div>
        </NavLink>
        
        {/* NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-6">
          <ul className="flex items-center gap-2">
            {[
              { name: "Accueil", path: "/" },
              { name: "Offres", path: "/offres" },
              { name: "Blog", path: "/blog" },
              { name: "Contact", path: "/contact" }
            ].map((link) => (
              <li key={link.path}>
                <NavLink to={link.path} className={navLinkClass}>
                  {({ isActive }) => (
                    <>
                      {link.name}
                      <span className={`absolute -bottom-1 left-3 right-3 h-[3px] rounded-full bg-blue-600 transition-all duration-500 transform origin-center ${
                        isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-50"
                      }`} />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="h-8 w-[1px] bg-slate-200/80 mx-2" />

          {/* BOUTON CONSULTATION FIXÉ */}
          <NavLink to="/consultation" className={consultBtnClass}>
            {/* On utilise une fonction pour accéder à isActive de manière sécurisée */}
            {({ isActive }) => (
              <>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none"></span>
                <CalendarCheck size={16} className={isActive ? "" : "animate-bounce"} />
                <span className="relative z-10">Consultation</span>
                <span className="relative z-10 bg-black/20 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] ml-1">15k</span>
              </>
            )}
          </NavLink>
          
          <NavLink to="/login" className="group ml-2 p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all duration-300">
            <LayoutDashboard size={18} />
          </NavLink>
        </nav>

        {/* MENU MOBILE ICONE */}
        <button className="lg:hidden flex flex-col gap-1.5 items-end p-2">
           <span className="w-7 h-1 bg-slate-900 rounded-full"></span>
           <span className="w-5 h-1 bg-blue-600 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}

export default Header;