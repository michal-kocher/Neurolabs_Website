import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Terminal, Brain, Cpu, Sparkles } from 'lucide-react';
import HeroCanvas from '../components/HeroCanvas';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="relative min-h-screen bg-[#000000] text-white font-sans overflow-hidden selection:bg-[#8E05C2]/30">
      <Navbar />
      <HeroCanvas />

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#3E065F] blur-[150px] rounded-full opacity-30" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#700B97] blur-[150px] rounded-full opacity-20" />

      <main className="relative z-10 max-w-7xl mx-auto px-8 h-[calc(100vh-100px)] flex flex-col justify-center">
        <div className="max-w-3xl">
          

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
          >
            Tworzę <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#700B97] to-[#8E05C2]">Inteligentne</span><br /> 
            Rozwiązania.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-400 mb-10 max-w-xl leading-relaxed"
          >
            AI resercher and developer. Rozwijam i badam rozwiązania AI oraz wdrażam je w aplikacjach webowych.  
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
            <Link to="/tech-stack" className="px-8 py-4 bg-transparent border border-gray-700 hover:border-[#8E05C2] text-white rounded-lg font-bold transition-all flex items-center gap-2 group">
              <Cpu size={20} className="group-hover:text-[#8E05C2] transition-colors" />
              Eksploruj Stack
            </Link>
          </motion.div>

          
        </div>
      </main>

      <div className="absolute right-8 bottom-8 hidden lg:block z-10 font-mono text-[10px] text-gray-600 space-y-2">
        <p className="flex justify-between gap-4"><span>LATENCY:</span> <span className="text-[#8E05C2]">24ms</span></p>
        <p className="flex justify-between gap-4"><span>MODEL:</span> <span className="text-[#8E05C2]">GPT-4O-OPTIMIZED</span></p>
        <p className="flex justify-between gap-4"><span>LOC:</span> <span className="text-[#8E05C2]">52.2297° N, 21.0122° E</span></p>
      </div>
      
      <Footer text="Fullstack AI Developer" />
    </div>
  );
};

export default Home;

