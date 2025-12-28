import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, RotateCcw, MousePointer2, Activity, Cpu, Maximize2, Minimize2 } from 'lucide-react';

const generateRandomDataset = () => {
  const data = [];
  const center1 = { x: 0.4 + Math.random() * 0.2, y: 0.4 + Math.random() * 0.2 };
  for (let i = 0; i < 22; i++) {
    data.push({
      x: center1.x + (Math.random() - 0.5) * 0.35,
      y: center1.y + (Math.random() - 0.5) * 0.35,
      label: 1
    });
  }
  for (let i = 0; i < 28; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 0.32 + Math.random() * 0.15;
    data.push({
      x: center1.x + Math.cos(angle) * r,
      y: center1.y + Math.sin(angle) * r,
      label: -1
    });
  }
  return data;
};

const KNNSandbox = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [points, setPoints] = useState(() => generateRandomDataset());
  const [probe, setProbe] = useState(null);
  const [k, setK] = useState(5);
  const [result, setResult] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getDist = (p1, p2) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

  const updateClassification = useCallback((probePoint, currentPoints) => {
    if (!probePoint || currentPoints.length === 0) return;
    const neighbors = currentPoints
      .map((p, idx) => ({ dist: getDist(probePoint, p), point: p, idx }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, k);

    const posCount = neighbors.filter(n => n.point.label === 1).length;
    const finalLabel = posCount > k / 2 ? 1 : -1;
    const confidence = (Math.max(posCount, k - posCount) / k) * 100;
    setResult({ label: finalLabel, confidence, neighbors });
  }, [k]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x * width, p.y * height, 5, 0, Math.PI * 2);
        ctx.fillStyle = p.label === 1 ? 'rgba(142, 5, 194, 0.6)' : 'rgba(255, 255, 255, 0.4)';
        ctx.fill();
        if (p.label === 1) {
          ctx.shadowBlur = 8; ctx.shadowColor = '#8E05C2'; ctx.stroke(); ctx.shadowBlur = 0;
        }
      });

      if (probe && result?.neighbors) {
        result.neighbors.forEach(n => {
          ctx.beginPath();
          ctx.moveTo(probe.x * width, probe.y * height);
          ctx.lineTo(n.point.x * width, n.point.y * height);
          ctx.strokeStyle = n.point.label === 1 ? 'rgba(142, 5, 194, 0.5)' : 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 1; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
          ctx.beginPath();
          ctx.arc(n.point.x * width, n.point.y * height, 9, 0, Math.PI * 2);
          ctx.strokeStyle = n.point.label === 1 ? '#8E05C2' : '#FFF';
          ctx.lineWidth = 2; ctx.stroke();
        });

        ctx.beginPath();
        ctx.arc(probe.x * width, probe.y * height, 14, 0, Math.PI * 2);
        ctx.fillStyle = result.label === 1 ? '#8E05C2' : '#FFF';
        ctx.shadowBlur = 30; ctx.shadowColor = ctx.fillStyle; ctx.fill();
        ctx.strokeStyle = '#000'; ctx.lineWidth = 2; ctx.stroke(); ctx.shadowBlur = 0;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    const resize = () => {
      const container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    window.addEventListener('resize', resize);
    resize(); draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animationFrameId); };
  }, [points, probe, result]);

  useEffect(() => {
    if (probe) updateClassification(probe, points);
  }, [k, probe, points, updateClassification]);

  const handleReset = () => {
    setPoints(generateRandomDataset());
    setProbe(null);
    setResult(null);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative bg-[#050505] border border-[#3E065F]/50 overflow-hidden shadow-2xl group transition-all flex flex-col ${
        isFullscreen 
          ? 'fixed inset-0 z-[9999] rounded-none m-0 p-0 w-screen h-screen' 
          : 'w-full max-w-full aspect-[4/3] rounded-3xl'
      }`}
      style={isFullscreen ? { margin: 0, padding: 0 } : {}}
    >
      <div className="absolute top-0 left-0 right-0 p-6 bg-black/40 backdrop-blur-md border-b border-[#3E065F]/30 z-20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#8E05C2] rounded-lg">
            <Target size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm leading-tight uppercase tracking-tight italic">Inference Engine v1.0</h3>
            <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mt-0.5">Algorytm K-Najbliższych Sąsiadów</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleFullscreen} 
            className="p-2.5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
            title={isFullscreen ? "Wyjdź z pełnego ekranu" : "Pełny ekran"}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <button onClick={handleReset} className="p-2.5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all">
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      <div className={`${isFullscreen ? 'flex-1 mt-20' : 'w-full h-full'}`}>
        <canvas 
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onClick={(e) => {
            const rect = canvasRef.current.getBoundingClientRect();
            setProbe({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
          }}
        />
      </div>

      <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-4 w-64 pointer-events-none max-w-[calc(100%-3rem)]">
        <div className="bg-black/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 pointer-events-auto space-y-4 shadow-xl">
          <div className="space-y-3">
            <label className="text-[10px] font-mono text-gray-400 uppercase flex items-center justify-between">
              Sąsiedzi (K): <span className="text-white font-bold">{k}</span>
            </label>
            <input 
              type="range" min="1" max="15" step="2" value={k} 
              onChange={(e) => setK(parseInt(e.target.value))}
              className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#8E05C2]"
            />
          </div>
          <div className="pt-3 border-t border-white/5 flex items-center gap-2 text-[9px] text-gray-500 font-mono uppercase">
            <MousePointer2 size={12} className="text-[#8E05C2]" /> Kliknij na mapie, by postawić sondę
          </div>
        </div>
      </div>

      <AnimatePresence>
        {probe && result && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="absolute bottom-6 right-6 z-20 bg-[#8E05C2] p-5 rounded-2xl w-56 max-w-[calc(100%-3rem)] shadow-2xl text-white overflow-hidden"
          >
             <div className="absolute -top-2 -right-2 opacity-20">
               <Cpu size={80} />
             </div>
             <div className="relative">
                <span className="text-[8px] font-mono uppercase tracking-widest opacity-70">WYNIK INFERENCJI</span>
                <h4 className="text-xl font-black uppercase italic tracking-tighter mt-1">
                  {result.label === 1 ? 'Cluster A' : 'Cluster B'}
                </h4>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold">{result.confidence.toFixed(0)}% PEWNOŚCI</span>
                  <Activity size={14} className="animate-pulse" />
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KNNSandbox;

