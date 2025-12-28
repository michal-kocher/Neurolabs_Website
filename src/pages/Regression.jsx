import { motion } from 'framer-motion';
import { LineChart, ChevronRight, Terminal } from 'lucide-react';
import NetworkCanvas from '../components/NetworkCanvas';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RegressionSandbox from '../components/RegressionSandbox';

const Regression = () => {
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
              <LineChart size={14} className="animate-pulse" />
              Convex Optimization Visualization
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black leading-[0.9] mb-8 lg:mb-12 tracking-tighter uppercase">
              Spadek <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#700B97] via-[#8E05C2] to-white">
                Gradientu.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-xl leading-relaxed mb-8 lg:mb-12 border-l-2 border-[#8E05C2] pl-6 lg:pl-8">
              Optymalizacja to serce uczenia maszynowego. Zobacz, jak prosty algorytm <strong>Iterative Descent</strong> minimalizuje błąd średniokwadratowy, dopasowując linię do chmury punktów. Eksperymentuj z tempem uczenia, by zaobserwować oscylacje lub powolną zbieżność.
            </p>
            <div className="flex flex-wrap gap-3 lg:gap-4">
              <button className="px-8 lg:px-12 py-4 lg:py-5 bg-[#8E05C2] rounded-full font-black hover:bg-[#700B97] transition-all flex items-center gap-3 uppercase text-xs tracking-widest shadow-[0_0_40px_rgba(142,5,194,0.3)] group">
                Publikacje ML <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 lg:px-12 py-4 lg:py-5 border border-white/10 rounded-full font-black hover:bg-white/5 transition-all uppercase text-xs tracking-widest flex items-center gap-3">
                Portfolio <Terminal size={18} />
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1, delay: 0.2 }}
            className="relative z-0 w-full min-w-0 flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-full">
              <RegressionSandbox />
            </div>
          </motion.div>
        </div>
      </section>

      <Footer text="Visualizing Gradient Convergence" />
    </div>
  );
};

export default Regression;

