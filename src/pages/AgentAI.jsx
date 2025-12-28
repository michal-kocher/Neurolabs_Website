import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, ChevronRight, Home } from 'lucide-react';
import NetworkCanvas from '../components/NetworkCanvas';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AgentSandbox from '../components/AgentSandbox';

const AgentAI = () => {
  const [modifications, setModifications] = useState(null);
  const [originalContent, setOriginalContent] = useState({
    title: 'LLM Sandbox.',
    description: 'Agenci AI to rozwiązania opratre o duże modele językowe. W przeciwieństwie do zwykłych chatbotów nie tylko tworzą teksty, ale i używają narzędzi, tzn. obsługują przygotowane dla nich funkcje programów. Dostępny tutaj agent dysponuje narzędziem do modyfikacji interfejsu. Wystarczy wpisać polecenie, a on zmini kod tej karty.',
    titleColor: 'from-[#700B97] via-[#8E05C2] to-white',
    badgeText: 'AI Code Agent',
    badgeColor: 'bg-[#3E065F]/20 border-[#700B97]/30 text-[#8E05C2]',
    sectionBg: 'bg-[#000000]',
    button1Text: 'KNN',
    button1Color: 'bg-[#8E05C2] hover:bg-[#700B97]',
    button2Text: 'Home',
    button2Style: 'border border-white/10 hover:bg-white/5',
    titleSize: 'text-5xl sm:text-6xl md:text-7xl xl:text-8xl',
    descriptionSize: 'text-lg sm:text-xl',
    borderColor: 'border-[#8E05C2]',
  });

  // Funkcja do bezpiecznego wykonywania kodu modyfikacji
  const applyCodeModification = (code) => {
    if (!code) {
      setModifications(null);
      return;
    }

    try {
      let newModifications = null;

      // Jeśli code jest już obiektem (modifications z API)
      if (typeof code === 'object' && code !== null) {
        newModifications = code;
      }
      // Jeśli code jest stringiem, spróbuj sparsować jako JSON
      else if (typeof code === 'string') {
        // Spróbuj sparsować jako JSON najpierw
        if (code.trim().startsWith('{') || code.trim().startsWith('[')) {
          try {
            const parsed = JSON.parse(code);
            if (parsed && typeof parsed === 'object') {
              newModifications = parsed;
            }
          } catch (parseError) {
            // Nie jest poprawnym JSON, kontynuuj dalej
          }
        }

        // Jeśli jeszcze nie mamy modyfikacji, spróbuj wykonać jako funkcję
        if (!newModifications && (code.includes('function') || code.includes('=>'))) {
          try {
            const modificationFunction = new Function('return ' + code)();
            if (typeof modificationFunction === 'function') {
              newModifications = modificationFunction();
            } else if (typeof modificationFunction === 'object') {
              newModifications = modificationFunction;
            }
          } catch (funcError) {
            // Nie jest funkcją, kontynuuj dalej
          }
        }

        // Fallback: parsowanie tekstowe
        if (!newModifications) {
          newModifications = parseTextModifications(code);
        }
      }

      if (newModifications && typeof newModifications === 'object') {
        // MERGE: Połącz nowe modyfikacje z istniejącymi (kumulatywnie)
        setModifications((prevModifications) => {
          const merged = {
            ...(prevModifications || {}),
            ...newModifications
          };
          console.log('Merging modifications:', {
            previous: prevModifications,
            new: newModifications,
            merged
          });
          return merged;
        });
      } else {
        console.warn('Could not parse modification code:', code);
      }
    } catch (error) {
      console.error('Error applying modification:', error);
      // Fallback: parsowanie tekstowe
      if (typeof code === 'string') {
        const textModifications = parseTextModifications(code);
        if (textModifications) {
          setModifications((prevModifications) => ({
            ...(prevModifications || {}),
            ...textModifications
          }));
        }
      }
    }
  };

  // Funkcja pomocnicza do parsowania tekstowych modyfikacji
  const parseTextModifications = (text) => {
    if (!text || typeof text !== 'string') return null;
    
    const mods = {};
    const lowerText = text.toLowerCase();
    
    // Kolory gradientu tytułu
    if (lowerText.includes('czerwony') || lowerText.includes('red')) {
      mods.titleColor = 'from-red-500 via-red-600 to-red-700';
    } else if (lowerText.includes('niebieski') || lowerText.includes('blue')) {
      mods.titleColor = 'from-blue-500 via-blue-600 to-blue-700';
    } else if (lowerText.includes('zielony') || lowerText.includes('green')) {
      mods.titleColor = 'from-green-500 via-green-600 to-green-700';
    } else if (lowerText.includes('żółty') || lowerText.includes('yellow')) {
      mods.titleColor = 'from-yellow-500 via-yellow-600 to-yellow-700';
    } else if (lowerText.includes('pomarańczowy') || lowerText.includes('orange')) {
      mods.titleColor = 'from-orange-500 via-orange-600 to-orange-700';
    } else if (lowerText.includes('różowy') || lowerText.includes('pink')) {
      mods.titleColor = 'from-pink-500 via-pink-600 to-pink-700';
    } else if (lowerText.includes('cyjan') || lowerText.includes('cyan')) {
      mods.titleColor = 'from-cyan-500 via-cyan-600 to-cyan-700';
    }
    
    // Parsowanie zmiany tytułu
    const titlePatterns = [
      /tytuł[:\s]+["']([^"']+)["']/i,
      /title[:\s]+["']([^"']+)["']/i,
      /zmień\s+tytuł\s+na\s+["']([^"']+)["']/i,
      /change\s+title\s+to\s+["']([^"']+)["']/i,
    ];
    
    for (const pattern of titlePatterns) {
      const match = text.match(pattern);
      if (match) {
        mods.title = match[1];
        break;
      }
    }
    
    // Parsowanie zmiany opisu
    const descPatterns = [
      /opis[:\s]+["']([^"']+)["']/i,
      /description[:\s]+["']([^"']+)["']/i,
      /zmień\s+opis\s+na\s+["']([^"']+)["']/i,
      /change\s+description\s+to\s+["']([^"']+)["']/i,
    ];
    
    for (const pattern of descPatterns) {
      const match = text.match(pattern);
      if (match) {
        mods.description = match[1];
        break;
      }
    }

    // Parsowanie zmiany badge'a
    if (lowerText.includes('badge') || lowerText.includes('etykieta')) {
      const badgeMatch = text.match(/badge[:\s]+["']([^"']+)["']/i) || 
                        text.match(/etykieta[:\s]+["']([^"']+)["']/i);
      if (badgeMatch) {
        mods.badgeText = badgeMatch[1];
      }
    }

    // Parsowanie zmiany przycisków
    if (lowerText.includes('przycisk') || lowerText.includes('button')) {
      const button1Match = text.match(/pierwszy\s+przycisk[:\s]+["']([^"']+)["']/i) ||
                           text.match(/button\s+1[:\s]+["']([^"']+)["']/i);
      if (button1Match) {
        mods.button1Text = button1Match[1];
      }
      
      const button2Match = text.match(/drugi\s+przycisk[:\s]+["']([^"']+)["']/i) ||
                           text.match(/button\s+2[:\s]+["']([^"']+)["']/i);
      if (button2Match) {
        mods.button2Text = button2Match[1];
      }
    }

    // Parsowanie rozmiaru tytułu
    if (lowerText.includes('większy tytuł') || lowerText.includes('bigger title')) {
      mods.titleSize = 'text-6xl sm:text-7xl md:text-8xl xl:text-9xl';
    } else if (lowerText.includes('mniejszy tytuł') || lowerText.includes('smaller title')) {
      mods.titleSize = 'text-3xl sm:text-4xl md:text-5xl';
    }

    // Parsowanie tła sekcji
    if (lowerText.includes('ciemne tło') || lowerText.includes('dark background')) {
      mods.sectionBg = 'bg-[#0a0a0a]';
    } else if (lowerText.includes('jasne tło') || lowerText.includes('light background')) {
      mods.sectionBg = 'bg-gray-900';
    }

    return Object.keys(mods).length > 0 ? mods : null;
  };

  // Aktualne wartości z modyfikacjami lub oryginał
  const currentTitle = modifications?.title ?? originalContent.title;
  const currentDescription = modifications?.description ?? originalContent.description;
  const currentTitleColor = modifications?.titleColor ?? originalContent.titleColor;
  const currentBadgeText = modifications?.badgeText ?? originalContent.badgeText;
  const currentBadgeColor = modifications?.badgeColor ?? originalContent.badgeColor;
  const currentSectionBg = modifications?.sectionBg ?? originalContent.sectionBg;
  
  // Konwertuj klasę Tailwind na inline style jeśli potrzeba (fallback)
  const getSectionBgStyle = () => {
    if (!modifications?.sectionBg) return {};
    
    // Jeśli to niestandardowa klasa Tailwind, może nie być skompilowana
    // Spróbuj użyć inline style jako fallback
    const bgClass = modifications.sectionBg;
    
    // Mapowanie klas Tailwind na kolory (fallback)
    const colorMap = {
      'bg-blue-900': '#1e3a8a',
      'bg-red-900': '#7f1d1d',
      'bg-green-900': '#14532d',
      'bg-yellow-900': '#713f12',
      'bg-purple-900': '#581c87',
      'bg-pink-900': '#831843',
      'bg-cyan-900': '#164e63',
      'bg-orange-900': '#7c2d12',
    };
    
    if (colorMap[bgClass]) {
      return { backgroundColor: colorMap[bgClass] };
    }
    
    return {};
  };
  
  // Debug: sprawdź czy modyfikacje są aplikowane
  useEffect(() => {
    if (modifications) {
      console.log('Current modifications:', modifications);
      console.log('Current sectionBg:', currentSectionBg);
    }
  }, [modifications, currentSectionBg]);
  const currentButton1Text = modifications?.button1Text ?? originalContent.button1Text;
  const currentButton1Color = modifications?.button1Color ?? originalContent.button1Color;
  const currentButton2Text = modifications?.button2Text ?? originalContent.button2Text;
  const currentButton2Style = modifications?.button2Style ?? originalContent.button2Style;
  const currentTitleSize = modifications?.titleSize ?? originalContent.titleSize;
  const currentDescriptionSize = modifications?.descriptionSize ?? originalContent.descriptionSize;
  const currentBorderColor = modifications?.borderColor ?? originalContent.borderColor;

  return (
    <div 
      className={`relative ${currentSectionBg} text-white font-sans selection:bg-[#8E05C2]/30 min-h-screen overflow-x-hidden`}
      style={getSectionBgStyle()}
    >
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
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${currentBadgeColor} border text-[9px] font-bold tracking-widest uppercase mb-4`}>
              <Zap size={12} className="animate-pulse" />
              {currentBadgeText}
            </div>
            <h1 className={`${currentTitleSize} font-black leading-[0.95] mb-4 tracking-tighter uppercase`}>
              Agent <br />
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentTitleColor}`}>
                {currentTitle}
              </span>
            </h1>
            <div className={`${currentDescriptionSize} text-gray-400 max-w-xl leading-tight mb-4 border-l-2 ${currentBorderColor} pl-4 lg:pl-6 max-h-[120px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#8E05C2]/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#8E05C2]/40`}>
              <p>{currentDescription}</p>
            </div>
            <div className="flex flex-wrap gap-2 lg:gap-3">
              <Link to="/knn" className={`px-6 lg:px-8 py-3 lg:py-4 ${currentButton1Color} rounded-full font-black transition-all flex items-center gap-2 uppercase text-xs tracking-widest shadow-[0_0_40px_rgba(142,5,194,0.3)] group`}>
                {currentButton1Text} <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/" className={`px-6 lg:px-8 py-3 lg:py-4 ${currentButton2Style} rounded-full font-black transition-all uppercase text-xs tracking-widest flex items-center gap-2`}>
                {currentButton2Text} <Home size={16} />
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
              <AgentSandbox onCodeModification={applyCodeModification} />
            </div>
          </motion.div>
        </div>
      </section>

      <Footer text="AI Agent Development" />
    </div>
  );
};

export default AgentAI;

