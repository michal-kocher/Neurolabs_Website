import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bot, Zap, ChevronRight, Home } from 'lucide-react';
import NetworkCanvas from '../components/NetworkCanvas';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AgentAI = () => {
  return (
    <div className="relative bg-[#000000] text-white font-sans selection:bg-[#8E05C2]/30 min-h-screen overflow-x-hidden">
      <NetworkCanvas />
      <Navbar />

      <section className="relative pt-32 pb-20 px-4 sm:px-8 z-10 max-w-7xl mx-auto min-h-screen flex flex-col justify-center">
        <div className="grid lg:grid-cols-[1.2fr,1fr] gap-8 lg:gap-12 items-center w-full">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
            className="relative z-10 min-w-0 max-w-2xl"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#3E065F]/20 border border-[#700B97]/30 text-[#8E05C2] text-[10px] font-bold tracking-widest uppercase mb-10">
              <Zap size={14} className="animate-pulse" />
              AI Code Agent
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black leading-[0.9] mb-8 lg:mb-12 tracking-tighter uppercase">
              Agent <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#700B97] via-[#8E05C2] to-white">
                AI Sandbox.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-xl leading-relaxed mb-8 lg:mb-12 border-l-2 border-[#8E05C2] pl-6 lg:pl-8">
              Agenci AI to rozwiązania opratre o duże modele językowe. W przeciwieństwie do zwykłych chatbotów nie tylko tworzą teksty, ale i używają narzędzi, tzn. obsługują przygotowane dla nich funkcje programów. Dostępny tutaj agent dysponuje narzędziem do modyfikacji interfejsu. Wystarczy wpisać polecenie, a on zmini kod tej karty.
            </p>
            <div className="flex flex-wrap gap-3 lg:gap-4">
              <Link to="/knn" className="px-8 lg:px-12 py-4 lg:py-5 bg-[#8E05C2] rounded-full font-black hover:bg-[#700B97] transition-all flex items-center gap-3 uppercase text-xs tracking-widest shadow-[0_0_40px_rgba(142,5,194,0.3)] group">
                KNN <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/" className="px-8 lg:px-12 py-4 lg:py-5 border border-white/10 rounded-full font-black hover:bg-white/5 transition-all uppercase text-xs tracking-widest flex items-center gap-3">
                Home <Home size={18} />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1, delay: 0.2 }}
            className="relative z-0 w-full min-w-0 flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-full aspect-square rounded-3xl bg-[#050505] border border-[#3E065F]/50 flex items-center justify-center p-12">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-[#8E05C2]/20 rounded-full flex items-center justify-center border border-[#8E05C2]/30">
                  <Bot size={48} className="text-[#8E05C2]" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase mb-2">Agent AI Sandbox</h3>
                  <p className="text-sm text-gray-400">Placeholder - Wkrótce dostępne</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer text="AI Agent Development" />
    </div>
  );
};

export default AgentAI;

