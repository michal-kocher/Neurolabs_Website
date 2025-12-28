import { useEffect, useRef, useState, useCallback } from 'react';
import { RotateCcw, Zap, BarChart3, AlertTriangle, Cpu, Maximize2, Minimize2 } from 'lucide-react';

// STAŁE MUZYCZNE - DEFINICJA CELU
const D_MINOR_NOTES = [0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19, 21, 22]; 
const DIATONIC_TRIADS = [
  [0, 3, 7],   // d-moll
  [3, 7, 10],  // F-dur
  [5, 8, 12],  // g-moll
  [7, 10, 14], // a-moll
  [8, 12, 15], // Bb-dur
  [10, 14, 17] // C-dur
];

/**
 * High-Convergence Music Evolution Engine
 */
const EvolutionSandbox = () => {
  const containerRef = useRef(null);
  const [generation, setGeneration] = useState(0);
  const [bestFitnessUi, setBestFitnessUi] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepUi, setCurrentStepUi] = useState(-1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const audioContext = useRef(null);
  const STEPS = 16; 
  
  // Początkowy stan: Pełna entropia chromatyczna
  const genomeRef = useRef(Array.from({ length: STEPS }, () => ({
    notes: [Math.floor(Math.random() * 24)], 
    length: 1, 
    shift: Math.random() * 0.9 
  })));
  
  const fitnessRef = useRef(0);
  const stepRef = useRef(0);
  const [displayGenome, setDisplayGenome] = useState(genomeRef.current);

  const initAudio = () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.current.state === 'suspended') audioContext.current.resume();
  };

  const playNote = useCallback((noteIdx, time, duration, vol) => {
    if (!audioContext.current) return;
    const osc = audioContext.current.createOscillator();
    const gain = audioContext.current.createGain();
    
    // Gramy czysty półton
    const freq = 146.83 * Math.pow(2, noteIdx / 12);
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);
    
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    const filter = audioContext.current.createBiquadFilter();
    filter.type = 'lowpass';
    // Dynamiczny filtr - staje się ciemniejszy i czystszy przy wyższej harmonii
    filter.frequency.setValueAtTime(Math.max(800, 4500 - (fitnessRef.current * 15)), time);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.current.destination);

    osc.start(time);
    osc.stop(time + duration);
  }, []);

  const calculateFitness = useCallback((ind) => {
    let score = 0;
    ind.forEach((step, i) => {
      let stepScore = 0;
      const isMeasureStart = i % 4 === 0;
      const hasChord = step.notes.length >= 2;

      // 1. Harmonia: Czy nuty są w skali D-moll? (Bardzo wysokie kary)
      step.notes.forEach(n => {
        if (D_MINOR_NOTES.includes(n % 24)) stepScore += 100;
        else stepScore -= 400; // Drastyczna kara za fałsz przyspiesza konwergencję
      });

      // 2. Rytmika: Nagroda za kwantyzację
      if (step.shift < 0.05 || step.shift > 0.95) stepScore += 150;
      else stepScore -= 50;

      // 3. Struktura taktu
      if (isMeasureStart) {
        if (hasChord) stepScore += 200; // Akordy na "raz"
      } else {
        if (hasChord) stepScore -= 150; // Melodia w środku
      }

      // 4. Czystość akordów
      if (hasChord) {
        const isDiatonic = DIATONIC_TRIADS.some(triad => 
          step.notes.every(n => triad.includes(n % 12))
        );
        if (isDiatonic) stepScore += 200;
        else stepScore -= 300;
      }

      score += stepScore;
    });
    return Math.max(0, score / 30);
  }, []);

  const performEvolution = useCallback(() => {
    // FUNKCJA MUTACJI KIERUNKOWEJ (Guided Mutation)
    const mutate = (gene) => gene.map((step, i) => {
      const r = Math.random();
      if (r < 0.4) { // Wyższy mutation rate dla szybkości
        const isMeasureStart = i % 4 === 0;
        
        // Zamiast losować dowolną nutę, dajemy 70% szans na wybranie poprawnej ze skali
        const getGuidedNote = () => {
          if (Math.random() < 0.7) {
             return D_MINOR_NOTES[Math.floor(Math.random() * D_MINOR_NOTES.length)];
          }
          return Math.floor(Math.random() * 24);
        };

        return {
          ...step,
          notes: (isMeasureStart && Math.random() > 0.5) 
            ? [getGuidedNote(), getGuidedNote()] 
            : [getGuidedNote()],
          // Szybsza kwantyzacja: 50% szans na wymuszenie gridu
          shift: Math.random() < 0.5 ? 0 : Math.random() * 0.8
        };
      }
      return step;
    });

    let currentBest = [...genomeRef.current];
    let currentBestF = calculateFitness(currentBest);

    // Zwiększony Batch: 300 mutantów na pętlę dla natychmiastowego efektu
    for(let i=0; i<300; i++) {
      const mutant = mutate(genomeRef.current);
      const f = calculateFitness(mutant);
      if (f > currentBestF) {
        currentBest = mutant;
        currentBestF = f;
      }
    }
    
    genomeRef.current = currentBest;
    fitnessRef.current = currentBestF;
    setBestFitnessUi(currentBestF);
    setGeneration(g => g + 1);
    setDisplayGenome(currentBest);
  }, [calculateFitness]);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      initAudio();
      const tickTime = 0.22; 
      timer = setInterval(() => {
        const currentStep = stepRef.current;
        const currentGenome = genomeRef.current;
        const event = currentGenome[currentStep];
        const now = audioContext.current.currentTime;
        
        // Jitter rytmiczny (widoczny tylko przy niskim fitness)
        const jitter = event.shift > 0.1 && event.shift < 0.9 ? event.shift * 0.08 : 0;
        const playTime = now + jitter;
        
        setCurrentStepUi(currentStep);
        event.notes.forEach((n) => {
          playNote(n, playTime, tickTime * 0.9, 0.08);
        });

        const nextStep = (currentStep + 1) % STEPS;
        stepRef.current = nextStep;
        if (nextStep === 0) performEvolution();
      }, tickTime * 1000);
    } else {
      setCurrentStepUi(-1);
      stepRef.current = 0;
    }
    return () => clearInterval(timer);
  }, [isPlaying, performEvolution, playNote]);

  const resetToChaos = () => {
    const chaos = Array.from({ length: STEPS }, () => ({
      notes: [Math.floor(Math.random() * 24)], 
      length: 1, 
      shift: Math.random() * 0.9
    }));
    genomeRef.current = chaos;
    stepRef.current = 0;
    setGeneration(0);
    setBestFitnessUi(0);
    fitnessRef.current = 0;
    setDisplayGenome(chaos);
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
      className={`bg-[#050505] border border-[#3E065F] overflow-hidden shadow-2xl relative transition-all flex flex-col ${
        isFullscreen 
          ? 'fixed inset-0 z-[9999] rounded-none m-0 p-0 w-screen h-screen' 
          : 'w-full max-w-full rounded-3xl'
      }`}
      style={!isFullscreen ? { minHeight: '600px' } : { margin: 0, padding: 0 }}
    >
      <div className="p-6 border-b border-[#3E065F]/50 flex justify-between items-center bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl transition-all duration-700 ${bestFitnessUi > 150 ? 'bg-[#8E05C2] shadow-[0_0_30px_#8E05C2]' : 'bg-red-900/20 border border-red-500/30'}`}>
            {bestFitnessUi < 80 ? <AlertTriangle size={24} className="text-red-500 animate-pulse" /> : <Zap size={24} className="text-white animate-pulse" />}
          </div>
          <div>
            <h3 className="text-white font-bold text-lg leading-none uppercase tracking-tight italic">Guided Neural Optimizer</h3>
            <div className="flex gap-3 mt-1.5 font-mono text-[9px] uppercase tracking-widest text-gray-500">
              <span>Iteracja: <span className="text-white font-bold">{generation}</span></span>
              <span>Harmonia: <span className={bestFitnessUi > 120 ? "text-[#8E05C2] font-bold" : "text-red-500"}>{bestFitnessUi.toFixed(0)}</span></span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={toggleFullscreen} 
            className="p-2 hover:bg-white/10 rounded-lg text-gray-500 transition-colors"
            title={isFullscreen ? "Wyjdź z pełnego ekranu" : "Pełny ekran"}
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
          <button onClick={resetToChaos} className="p-2 hover:bg-white/10 rounded-lg text-gray-500 transition-colors">
            <RotateCcw size={20}/>
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-8 py-3 rounded-xl font-black transition-all text-xs tracking-tighter ${isPlaying ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-[#8E05C2] text-white shadow-[0_0_20px_rgba(142,5,194,0.4)]'}`}
          >
            {isPlaying ? 'PAUZA' : 'TURBO EVOLUTION'}
          </button>
        </div>
      </div>

      {/* Piano Roll Grid */}
      <div className={`bg-[#020202] overflow-x-auto no-scrollbar relative flex-1 flex ${isFullscreen ? 'p-12 items-stretch' : 'p-8 items-center'}`}>
        <div className={`flex gap-1.5 min-w-[700px] relative w-full ${isFullscreen ? 'flex-1' : 'h-64'}`}>
          {displayGenome.map((step, idx) => {
            const isMeasureStart = idx % 4 === 0;
            const hasShift = step.shift > 0.05 && step.shift < 0.95;
            return (
              <div 
                key={idx} 
                className={`flex-1 flex flex-col gap-1 transition-all duration-300 relative ${currentStepUi === idx ? 'opacity-100 scale-x-105' : 'opacity-20'} ${isMeasureStart ? 'border-l border-[#3E065F]/50 pl-1' : ''}`}
                style={{ 
                  transform: `translateY(${hasShift ? (step.shift - 0.5) * 30 : 0}px)`,
                  height: '100%'
                }}
              >
                <div className="flex-1 flex flex-col gap-0.5 h-full">
                  {Array.from({ length: 24 }).map((_, note) => {
                    const noteVal = 23 - note;
                    const isActive = step.notes.includes(noteVal);
                    const isHarmonic = D_MINOR_NOTES.includes(noteVal % 24);
                    return (
                      <div 
                        key={note}
                        className={`flex-1 rounded-sm border-[1px] border-white/5 transition-all ${
                          isActive 
                            ? (isHarmonic ? 'bg-[#8E05C2] shadow-[0_0_15px_#8E05C2]' : 'bg-red-600 shadow-[0_0_10px_red] animate-pulse') 
                            : 'bg-transparent'
                        }`}
                      />
                    );
                  })}
                </div>
                <div className={`h-2 shrink-0 rounded-full mt-4 transition-colors ${currentStepUi === idx ? 'bg-white shadow-[0_0_15px_white]' : 'bg-[#3E065F]/20'}`} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-6 bg-black/90 grid grid-cols-4 gap-4 border-t border-[#3E065F]/30">
        <div className="space-y-1">
          <p className="text-[8px] text-gray-600 font-mono uppercase tracking-widest">Technika</p>
          <p className="text-[10px] font-bold text-white flex items-center gap-1"><Cpu size={12} className="text-[#8E05C2]"/> Directed Metaheuristic</p>
        </div>
        <div className="space-y-1">
          <p className="text-[8px] text-gray-600 font-mono uppercase tracking-widest">Konwergencja</p>
          <p className="text-[10px] font-bold text-[#8E05C2]">AGRESYWNA</p>
        </div>
        <div className="space-y-1">
          <p className="text-[8px] text-gray-600 font-mono uppercase tracking-widest">Rytmika</p>
          <p className="text-[10px] font-bold text-white">Auto-Quantize</p>
        </div>
        <div className="space-y-1 text-right">
          <BarChart3 size={16} className="text-[#8E05C2] inline-block animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default EvolutionSandbox;