import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Terminal, Brain, Cpu, Sparkles } from 'lucide-react';
import HeroCanvas from '../components/HeroCanvas';

const Home = () => {
  return (
    <div className="relative min-h-screen bg-[#000000] text-white font-sans overflow-hidden selection:bg-[#8E05C2]/30">
      <HeroCanvas />

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#3E065F] blur-[150px] rounded-full opacity-30" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#700B97] blur-[150px] rounded-full opacity-20" />

      <main className="relative z-10 max-w-7xl mx-auto px-8 h-[calc(100vh-100px)] flex flex-col justify-center">
        <div className="max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3E065F]/30 border border-[#700B97]/50 text-[#8E05C2] text-xs font-mono mb-6"
          >
            <Sparkles size={14} />
            Dostępny do nowych wyzwań w AI/ML
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
          >
            Projektuję <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#700B97] to-[#8E05C2]">Inteligencję</span>,<br /> 
            Optymalizuję Chaos.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-400 mb-10 max-w-xl leading-relaxed"
          >
            Fullstack Developer & AI Researcher specjalizujący się w LLM, systemach RAG oraz metaheurystykach. Łączę rygor matematyczny z nowoczesną inżynierią oprogramowania.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/knn" className="px-8 py-4 bg-[#8E05C2] hover:bg-[#700B97] text-white rounded-lg font-bold transition-all shadow-[0_0_20px_rgba(142,5,194,0.3)] flex items-center gap-2 group">
              <Brain size={20} className="group-hover:scale-110 transition-transform" />
              Zobacz Lab AI
            </Link>
            <button className="px-8 py-4 bg-transparent border border-gray-700 hover:border-[#8E05C2] text-white rounded-lg font-bold transition-all flex items-center gap-2 group">
              <Cpu size={20} className="group-hover:text-[#8E05C2] transition-colors" />
              Eksploruj Stack
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-16 flex items-center gap-6"
          >
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#8E05C2] transition-colors">
              <Github size={24} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#8E05C2] transition-colors">
              <Linkedin size={24} />
            </a>
            <div className="h-[1px] w-12 bg-gray-800" />
            <span className="text-xs font-mono text-gray-600 uppercase tracking-widest">Scrolluj by poznać parametry</span>
          </motion.div>
        </div>
      </main>

      <div className="absolute right-8 bottom-8 hidden lg:block z-10 font-mono text-[10px] text-gray-600 space-y-2">
        <p className="flex justify-between gap-4"><span>LATENCY:</span> <span className="text-[#8E05C2]">24ms</span></p>
        <p className="flex justify-between gap-4"><span>MODEL:</span> <span className="text-[#8E05C2]">GPT-4O-OPTIMIZED</span></p>
        <p className="flex justify-between gap-4"><span>LOC:</span> <span className="text-[#8E05C2]">52.2297° N, 21.0122° E</span></p>
      </div>
    </div>
  );
};

export default Home;

