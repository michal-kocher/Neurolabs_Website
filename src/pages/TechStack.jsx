import { motion } from 'framer-motion';
import { Code2, Database, Brain, Sparkles, Zap, Layers } from 'lucide-react';
import NetworkCanvas from '../components/NetworkCanvas';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TechStack = () => {
  const specialising = [
    { name: 'Python', icon: Code2, color: '#3776ab' },
    { name: 'Scikit-learn', icon: Brain, color: '#F7931E' },
    { name: 'Generative AI', icon: Sparkles, color: '#8E05C2' },
  ];

  const exploring = [
    { name: 'PyTorch', icon: Zap, color: '#EE4C2C' },
    { name: 'React', icon: Layers, color: '#61DAFB' },
  ];

  const otherTech = [
    { name: 'JavaScript', icon: Code2, color: '#F7DF1E' },
    { name: 'PostgreSQL', icon: Database, color: '#336791' },
    { name: 'LLM Ecosystem', icon: Brain, color: '#8E05C2' },
  ];

  return (
    <div className="relative bg-[#000000] text-white font-sans selection:bg-[#8E05C2]/30 min-h-screen overflow-x-hidden">
      <NetworkCanvas />
      <Navbar />

      <section className="relative pt-32 pb-20 px-4 sm:px-8 z-10 max-w-7xl mx-auto min-h-screen flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#3E065F]/20 border border-[#700B97]/30 text-[#8E05C2] text-[10px] font-bold tracking-widest uppercase mb-6">
            <Code2 size={14} />
            Tech Stack
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black leading-[0.9] mb-6 tracking-tighter uppercase">
            Narzędzia <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#700B97] via-[#8E05C2] to-white">
              Inteligencji.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl leading-relaxed border-l-2 border-[#8E05C2] pl-6">
            Stack technologiczny, który wykorzystuję do budowania systemów AI i aplikacji webowych. Łączę moc Pythona w ML z elastycznością JavaScript w frontendzie.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* Specialising */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-[#8E05C2]" />
              <h2 className="text-2xl font-black uppercase tracking-tight">Specialising</h2>
            </div>
            <div className="space-y-4">
              {specialising.map((tech, idx) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-black/40 backdrop-blur-sm border border-white/5 hover:border-[#8E05C2]/50 transition-all group"
                >
                  <div 
                    className="p-3 rounded-lg group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${tech.color}20` }}
                  >
                    <tech.icon size={24} style={{ color: tech.color }} />
                  </div>
                  <span className="text-lg font-bold">{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Exploring */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-[#8E05C2]" />
              <h2 className="text-2xl font-black uppercase tracking-tight">Exploring</h2>
            </div>
            <div className="space-y-4">
              {exploring.map((tech, idx) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-black/40 backdrop-blur-sm border border-white/5 hover:border-[#8E05C2]/50 transition-all group"
                >
                  <div 
                    className="p-3 rounded-lg group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${tech.color}20` }}
                  >
                    <tech.icon size={24} style={{ color: tech.color }} />
                  </div>
                  <span className="text-lg font-bold">{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Other Technologies */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-[#8E05C2]" />
            <h2 className="text-2xl font-black uppercase tracking-tight">Also Working With</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            {otherTech.map((tech, idx) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + idx * 0.05 }}
                className="flex items-center gap-3 px-5 py-3 rounded-lg bg-black/40 backdrop-blur-sm border border-white/5 hover:border-[#8E05C2]/50 transition-all group"
              >
                <tech.icon size={20} style={{ color: tech.color }} />
                <span className="font-bold text-sm">{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <Footer text="Building Intelligence" />
    </div>
  );
};

export default TechStack;

