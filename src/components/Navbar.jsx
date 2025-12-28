import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Brain, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [demoOpen, setDemoOpen] = useState(false);

  const demoItems = [
    { path: '/knn', label: 'KNN' },
    { path: '/regression', label: 'Regresja' },
    { path: '/music', label: 'Ewolucja' },
    { path: '/pong', label: 'Q-Learning' },
    { path: '/agent', label: 'Agent AI' },
  ];

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/tech-stack', label: 'Stack' },
    { path: '/contact', label: 'Contact' },
  ];

  const isDemoActive = demoItems.some(item => location.pathname === item.path);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-[#3E065F]/20 px-8 py-5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-[#700B97] to-[#8E05C2] rounded-lg flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform shadow-[#8E05C2]/40">
            <Brain size={22} className="text-white" />
          </div>
          <span className="text-lg font-black tracking-tighter uppercase italic tracking-widest text-white">
            Michał <span className="text-[#8E05C2]">Kocher</span>
          </span>
        </Link>
        <div className="hidden md:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`transition-colors ${
                location.pathname === item.path
                  ? 'text-[#8E05C2]'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="relative">
            <button
              onClick={() => setDemoOpen(!demoOpen)}
              className={`transition-colors flex items-center gap-1 ${
                isDemoActive
                  ? 'text-[#8E05C2]'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              Demo
              <ChevronDown size={14} className={`transition-transform ${demoOpen ? 'rotate-180' : ''}`} />
            </button>
            {demoOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setDemoOpen(false)}
                />
                <div 
                  className="absolute top-full left-0 mt-2 bg-black/95 backdrop-blur-xl border border-[#3E065F]/50 rounded-lg py-2 min-w-[180px] shadow-xl z-50"
                >
                {demoItems.map((item) => (
                  <div
                    key={item.path}
                    onClick={() => {
                      setDemoOpen(false);
                      navigate(item.path);
                    }}
                    className={`block px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em] transition-colors cursor-pointer ${
                      location.pathname === item.path
                        ? 'text-[#8E05C2] bg-[#8E05C2]/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </div>
                ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

