import { useEffect, useRef, useState, useCallback } from 'react';
import { RotateCcw, TrendingUp, Info, Maximize2, Minimize2 } from 'lucide-react';

/**
 * Funkcja generująca zbiór danych dla regresji
 * Wszystkie punkty są w zakresie [0, 1] dla obu osi
 */
const generateRegressionData = () => {
  const data = [];
  const centerX = 0.5;
  const centerY = 0.5;
  const baseSlope = (Math.random() - 0.5) * 2; // Nachylenie od -1 do 1
  
  for (let i = 0; i < 30; i++) {
    const x = Math.random();
    // Generujemy y tak, aby punkty były wokół linii przechodzącej przez środek
    const baseY = centerY + baseSlope * (x - centerX);
    const noise = (Math.random() - 0.5) * 0.2;
    const y = Math.max(0.05, Math.min(0.95, baseY + noise)); // Ograniczamy do zakresu [0.05, 0.95]
    data.push({ x, y });
  }
  return data;
};

/**
 * Komponent Regresji Liniowej z wizualizacją spadku gradientu
 */
const RegressionSandbox = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [points, setPoints] = useState(() => generateRegressionData());
  const [m, setM] = useState(0); // Nachylenie (Slope)
  // b jest obliczane automatycznie, aby linia przechodziła przez środek (0.5, 0.5)
  // b = 0.5 - m * 0.5 = 0.5 * (1 - m)
  const getB = () => 0.5 * (1 - m);
  const [lr, setLr] = useState(0.05); // Learning Rate
  const [isTraining, setIsTraining] = useState(false);
  const [lossHistory, setLossHistory] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Obliczanie gradientu i krok optymalizacji
  // Linia zawsze przechodzi przez środek (0.5, 0.5), więc uczymy się tylko nachylenia m
  const trainStep = useCallback(() => {
    if (points.length === 0) return;
    
    const b = getB(); // Obliczamy b na podstawie m
    let gradM = 0;
    let currentMSE = 0;

    points.forEach(p => {
      const pred = m * p.x + b;
      const error = pred - p.y;
      // Gradient dla m: d/dM (error^2) = 2 * error * (x - 0.5)
      // ponieważ b = 0.5 - m*0.5, więc d/dM (m*x + b) = x - 0.5
      gradM += error * (p.x - 0.5);
      currentMSE += error * error;
    });

    const n = points.length;
    setM(prevM => prevM - (lr * (2/n) * gradM));
    
    const finalMSE = currentMSE / n;
    setLossHistory(prev => [...prev.slice(-40), finalMSE]);
  }, [points, m, lr]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const b = getB(); // Obliczamy b, aby linia przechodziła przez środek
      
      // 1. Rysowanie punktów danych
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x * width, (1 - p.y) * height, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();

        // Rysowanie reziduów (błędów)
        const lineY = m * p.x + b;
        ctx.beginPath();
        ctx.moveTo(p.x * width, (1 - p.y) * height);
        ctx.lineTo(p.x * width, (1 - lineY) * height);
        ctx.strokeStyle = 'rgba(142, 5, 194, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // 2. Rysowanie linii regresji - zawsze przechodzi przez środek (0.5, 0.5)
      // Obliczamy punkty przecięcia z krawędziami canvasu
      const centerX = 0.5;
      const centerY = 0.5;
      
      // Znajdujemy punkty przecięcia linii z krawędziami (x=0, x=1, y=0, y=1)
      let x1 = 0, y1 = m * x1 + b;
      let x2 = 1, y2 = m * x2 + b;
      
      // Jeśli linia wychodzi poza zakres y [0,1], przecinamy z górną/dolną krawędzią
      if (y1 < 0 || y1 > 1) {
        // Przecięcie z y=0 lub y=1
        const targetY = y1 < 0 ? 0 : 1;
        x1 = (targetY - b) / m;
        y1 = targetY;
      }
      if (y2 < 0 || y2 > 1) {
        const targetY = y2 < 0 ? 0 : 1;
        x2 = (targetY - b) / m;
        y2 = targetY;
      }
      
      // Rysujemy linię tylko jeśli oba punkty są w zakresie
      if (x1 >= 0 && x1 <= 1 && y1 >= 0 && y1 <= 1 && x2 >= 0 && x2 <= 1 && y2 >= 0 && y2 <= 1) {
        ctx.beginPath();
        ctx.moveTo(x1 * width, (1 - y1) * height);
        ctx.lineTo(x2 * width, (1 - y2) * height);
        ctx.strokeStyle = '#8E05C2';
        ctx.lineWidth = 4;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#8E05C2';
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      
      // Rysujemy punkt środkowy dla wizualizacji
      ctx.beginPath();
      ctx.arc(centerX * width, (1 - centerY) * height, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#8E05C2';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(draw);
    };

    const resize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      // Wymuszamy ponowne rysowanie po zmianie rozmiaru
      draw();
    };

    // Używamy ResizeObserver do obserwowania zmian rozmiaru kontenera
    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    
    window.addEventListener('resize', resize);
    
    // Opóźniona inicjalizacja, aby upewnić się, że kontener ma już rozmiar
    const initTimeout = setTimeout(() => {
      resize();
      draw();
    }, 0);
    
    let trainingInterval;
    if (isTraining) {
      trainingInterval = setInterval(trainStep, 20);
    }
    
    return () => {
      clearTimeout(initTimeout);
      window.removeEventListener('resize', resize);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      if (trainingInterval) {
        clearInterval(trainingInterval);
      }
    };

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      clearInterval(trainingInterval);
    };
  }, [points, m, isTraining, trainStep]);

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(0.05, Math.min(0.95, (e.clientX - rect.left) / rect.width));
    const newY = Math.max(0.05, Math.min(0.95, 1 - (e.clientY - rect.top) / rect.height));
    setPoints([...points, { x: newX, y: newY }]);
  };

  const handleReset = () => {
    setPoints(generateRegressionData());
    setM(0); // Przy m=0, linia jest pozioma przez środek
    setLossHistory([]);
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
          : 'w-full aspect-[4/3] rounded-3xl'
      }`}
      style={isFullscreen ? { margin: 0, padding: 0 } : {}}
    >
      {/* HUD Header */}
      <div className="absolute top-0 left-0 right-0 p-6 bg-black/40 backdrop-blur-md border-b border-[#3E065F]/30 z-20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#8E05C2] rounded-lg">
            <TrendingUp size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm leading-tight uppercase tracking-tight italic">Gradient Descent Explorer</h3>
            <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mt-0.5">Model: y = {m.toFixed(2)}x + {getB().toFixed(2)} (przez środek)</p>
          </div>
        </div>
        <div className="flex gap-2">
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
          <button 
            onClick={() => setIsTraining(!isTraining)}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isTraining ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-[#8E05C2] text-white shadow-[0_0_20px_#8E05C2]'}`}
          >
            {isTraining ? 'STOP' : 'TRAIN'}
          </button>
        </div>
      </div>

      <div className={`${isFullscreen ? 'flex-1 pt-20' : 'absolute inset-0 top-20 bottom-0'} relative w-full h-full`}>
        <canvas 
          ref={canvasRef}
          className="w-full h-full cursor-crosshair absolute inset-0"
          onClick={handleCanvasClick}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Wykres Loss (MSE) w czasie rzeczywistym */}
      <div className="absolute top-24 right-6 w-32 h-16 bg-black/40 backdrop-blur-sm border border-white/5 rounded-xl p-2 z-20 pointer-events-none max-w-[calc(100%-3rem)]">
        <span className="text-[7px] font-mono text-gray-500 uppercase block mb-1">Loss (MSE)</span>
        <div className="flex items-end gap-[1px] h-8">
          {lossHistory.map((val, i) => (
            <div 
              key={i} 
              className="bg-[#8E05C2] w-full min-w-[2px]" 
              style={{ height: `${Math.min(100, val * 500)}%` }} 
            />
          ))}
        </div>
      </div>

      {/* Kontrolki pływające */}
      <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-4 w-64 pointer-events-none max-w-[calc(100%-3rem)]">
        <div className="bg-black/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 pointer-events-auto space-y-4 shadow-xl">
          <div className="space-y-3">
            <label className="text-[10px] font-mono text-gray-400 uppercase flex items-center justify-between">
              Learning Rate: <span className="text-[#8E05C2] font-bold">{lr.toFixed(3)}</span>
            </label>
            <input 
              type="range" min="0.001" max="0.2" step="0.001" value={lr} 
              onChange={(e) => setLr(parseFloat(e.target.value))}
              className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#8E05C2]"
            />
          </div>
          <div className="pt-3 border-t border-white/5 flex items-center gap-2 text-[9px] text-gray-500 font-mono uppercase leading-tight">
            <Info size={12} className="text-[#8E05C2] shrink-0" /> Kliknij, aby dodać punkty odstające i przetestować odporność modelu
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegressionSandbox;
export { generateRegressionData };