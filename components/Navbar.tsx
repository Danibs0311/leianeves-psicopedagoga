import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Instagram, Calendar } from 'lucide-react';

interface NavbarProps {
  onOpenScheduling: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenScheduling }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    if (location.pathname !== '/') {
      e.preventDefault();
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(target);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100" role="navigation" aria-label="Navegação Principal">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-black text-slate-900 tracking-tighter hover:text-sky-600 transition-colors">
              Léia<span className="text-sky-500">Neves</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <a href="#sobre" onClick={(e) => handleNavClick(e, '#sobre')} className="text-slate-500 hover:text-sky-600 text-[13px] font-bold uppercase tracking-widest transition-colors">Sobre</a>
            <a href="#metodo" onClick={(e) => handleNavClick(e, '#metodo')} className="text-slate-500 hover:text-sky-600 text-[13px] font-bold uppercase tracking-widest transition-colors">Método</a>
            <Link to="/materiais" className="text-slate-500 hover:text-sky-600 text-[13px] font-bold uppercase tracking-widest transition-colors">Materiais</Link>
            <Link to="/blog" className="text-slate-500 hover:text-sky-600 text-[13px] font-bold uppercase tracking-widest transition-colors">Blog</Link>
            
            <div className="flex items-center gap-6 ml-4 border-l border-slate-100 pl-6">
              <a
                href="https://www.instagram.com/leianeves.psicopedagoga"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-[#E4405F] transition-colors"
                aria-label="Siga-nos no Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <button
                onClick={onOpenScheduling}
                className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-sky-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
              >
                Agendar Consulta
              </button>
            </div>
          </div>

          {/* Mobile Menu Actions */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-3 text-slate-500 hover:text-sky-600 focus:outline-none bg-slate-50 rounded-xl"
              aria-expanded={isMobileMenuOpen}
              aria-label="Abrir menu de navegação"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 py-10 shadow-2xl flex flex-col gap-6 absolute w-full left-0 z-40 animate-in fade-in slide-in-from-top-4 duration-300">
          <a href="#sobre" onClick={(e) => handleNavClick(e, '#sobre')} className="text-2xl font-black text-slate-800 hover:text-sky-600 transition-colors">Sobre</a>
          <a href="#metodo" onClick={(e) => handleNavClick(e, '#metodo')} className="text-2xl font-black text-slate-800 hover:text-sky-600 transition-colors">Método</a>
          <Link to="/materiais" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-slate-800 hover:text-sky-600 transition-colors">Materiais</Link>
          <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-slate-800 hover:text-sky-600 transition-colors">Blog</Link>
          
          <div className="h-px bg-slate-100 my-4"></div>
          
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenScheduling();
            }}
            className="bg-sky-500 text-white px-8 py-5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-sky-100 flex items-center justify-center gap-3"
          >
            <Calendar className="w-5 h-5" /> Agendar Atendimento
          </button>
          
          <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] text-slate-300 font-bold uppercase tracking-widest text-center mt-4">
            Acesso Restrito
          </Link>
        </div>
      )}
    </nav>
  );
};
