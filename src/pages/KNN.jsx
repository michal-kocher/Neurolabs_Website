import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, ChevronRight, Home } from 'lucide-react';
import NetworkCanvas from '../components/NetworkCanvas';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import KNNSandbox from '../components/KNNSandbox';

const KNN = () => {
  return (
    <div className="relative bg-[#000000] text-white font-sans selection:bg-[#8E05C2]/30 min-h-screen overflow-x-hidden">
      <NetworkCanvas />
      <Navbar />

      <section className="relative pt-20 pb-4 px-4 sm:px-8 z-10 max-w-7xl mx-auto h-[calc(100vh-80px)] flex flex-col justify-center overflow-hidden">
        <div className="grid lg:grid-cols-[1.2fr,1fr] gap-6 lg:gap-8 items-stretch w-full h-full">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
            className="relative z-10 min-w-0 max-w-2xl flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3E065F]/20 border border-[#700B97]/30 text-[#8E05C2] text-[9px] font-bold tracking-widest uppercase mb-4">
              <Zap size={12} className="animate-pulse" />
              Classification Algorithm
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black leading-[0.95] mb-4 tracking-tighter uppercase">
              Klasyfikacja <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#700B97] via-[#8E05C2] to-white">
                kNN
              </span>
            </h1>
            <div className="text-lg sm:text-xl text-gray-400 max-w-xl leading-tight mb-4 border-l-2 border-[#8E05C2] pl-4 lg:pl-6 max-h-[120px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#8E05C2]/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#8E05C2]/40">
              <p>
                Algorytm <strong>K-Najbliższych Sąsiadów</strong> Demonstracja prostego algorytmu uczenia maszynowego kNN, która pokazuje, że AI to żadna magia, a czysta matematyka. Demonstracja obrazuje jak algorytm klasyfikuje obiekty poprzez znalezienie podobnych. Mierzy odległość między punktami których klasy zna, a tym, który ma sklasyfikować. Przypisuje punkt do klasy, której przedstawicele są blisko.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:gap-3">
              <Link to="/regression" className="px-6 lg:px-8 py-3 lg:py-4 bg-[#8E05C2] rounded-full font-black hover:bg-[#700B97] transition-all flex items-center gap-2 uppercase text-xs tracking-widest shadow-[0_0_40px_rgba(142,5,194,0.3)] group">
                Regresja <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/" className="px-6 lg:px-8 py-3 lg:py-4 border border-white/10 rounded-full font-black hover:bg-white/5 transition-all uppercase text-xs tracking-widest flex items-center gap-2">
                Home <Home size={16} />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1, delay: 0.2 }}
            className="relative z-0 w-full min-w-0 flex items-center justify-center lg:justify-end h-full"
          >
            <div className="w-full max-w-full h-full max-h-[calc(100vh-120px)] flex items-center">
              <KNNSandbox />
            </div>
          </motion.div>
        </div>
      </section>

      <Footer text="Optimizing Creative Search Spaces" />
    </div>
  );
};

export default KNN;

