
import React, { useEffect } from 'react';
import profileImage from '../images/rf7qvvtb.png';

// Declare custom element to avoid TS errors
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'behold-widget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { 'feed-id': string }, HTMLElement>;
    }
  }
}

export const InstagramFeed: React.FC = () => {
  const instagramUrl = "https://www.instagram.com/leianeves.psicopedagoga?igsh=d3UwMHBxdzByODYz";

  useEffect(() => {
    // Load Behold script
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://w.behold.so/widget.js";
    document.head.append(script);

    return () => {
      // Cleanup might not be strictly necessary for a global widget script, 
      // but good practice to remove if unmounting to avoid duplicates if re-mounted
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="mt-20 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
      {/* Official-looking Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 border-b border-slate-50 pb-6">
        <div className="flex items-center gap-4">
          <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]">
            <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden bg-slate-100">
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-bold text-slate-900 leading-none mb-1">@leianeves.psicopedagoga</h3>
            <p className="text-sm text-slate-500">Neuropsicopedagoga | Especialista TEA & TDAH</p>
          </div>
        </div>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2 bg-sky-600 text-white text-sm font-bold rounded-full hover:bg-sky-700 transition-colors shadow-md active:scale-95"
        >
          Seguir no Instagram
        </a>
      </div>

      {/* Behold Widget */}
      <div className="min-h-[300px]">
        <behold-widget feed-id="3HltmDeLWGG9dTsrRYJG"></behold-widget>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500 italic">
          Clique em uma imagem para ver os conteúdos completos.
        </p>
      </div>
    </div>
  );
};
