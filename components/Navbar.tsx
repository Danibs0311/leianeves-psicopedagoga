import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenScheduling: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenScheduling }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-sky-700 tracking-tight hover:text-sky-800 transition-colors">
              Léia<span className="text-sky-500">Neves</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <a href="#sobre" className="text-slate-600 hover:text-sky-600 font-medium transition-colors">Sobre</a>
            <a href="#metodo" className="text-slate-600 hover:text-sky-600 font-medium transition-colors">Método</a>
            <a href="#beneficios" className="text-slate-600 hover:text-sky-600 font-medium transition-colors">Benefícios</a>
            <Link to="/materiais" className="text-slate-600 hover:text-sky-600 font-medium transition-colors">
              Materiais
            </Link>
            <Link to="/blog" className="text-slate-600 hover:text-sky-600 font-medium transition-colors">
              Blog
            </Link>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/leianeves.psicopedagoga?igsh=d3UwMHBxdzByODYz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-[#E4405F] transition-colors"
                title="Siga no Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <button
                onClick={onOpenScheduling}
                className="bg-sky-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-sky-700 transition-all shadow-md active:scale-95"
              >
                Agendar Atendimento
              </button>
            </div>
          </div>

          {/* Mobile Menu Actions */}
          <div className="md:hidden flex items-center gap-3">
            <a
              href="https://biolink.info/leianeves_psicopedagoga"
              className="bg-sky-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-sky-700 transition-all shadow-md"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contato
            </a>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-sky-600 focus:outline-none bg-slate-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 shadow-lg flex flex-col gap-1 absolute w-full left-0 z-40">
          <a
            href="#sobre"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-slate-600 hover:text-sky-600 hover:bg-slate-50 font-medium transition-colors block py-3 px-2 rounded-md"
          >
            Sobre
          </a>
          <a
            href="#metodo"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-slate-600 hover:text-sky-600 hover:bg-slate-50 font-medium transition-colors block py-3 px-2 rounded-md"
          >
            Método
          </a>
          <a
            href="#beneficios"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-slate-600 hover:text-sky-600 hover:bg-slate-50 font-medium transition-colors block py-3 px-2 rounded-md"
          >
            Benefícios
          </a>
          <Link
            to="/materiais"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-slate-600 hover:text-sky-600 hover:bg-slate-50 font-medium transition-colors block py-3 px-2 rounded-md"
          >
            Materiais
          </Link>
          <Link
            to="/blog"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-slate-600 hover:text-sky-600 hover:bg-slate-50 font-medium transition-colors block py-3 px-2 rounded-md"
          >
            Blog
          </Link>
          
          <div className="h-px bg-slate-200 my-2 w-full"></div>
          
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenScheduling();
            }}
            className="bg-sky-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-sky-700 transition-all shadow-md text-center mt-2"
          >
            Agendar Atendimento
          </button>
          
          <a
            href="https://www.instagram.com/leianeves.psicopedagoga?igsh=d3UwMHBxdzByODYz"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 text-slate-500 hover:text-[#E4405F] transition-colors py-3 mt-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span className="font-medium">Siga no Instagram</span>
          </a>

          <Link
            to="/admin"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-[10px] text-slate-300 hover:text-slate-400 transition-colors uppercase tracking-widest font-medium text-center py-2"
          >
            Área do Profissional
          </Link>
        </div>
      )}
    </nav>
  );
};
