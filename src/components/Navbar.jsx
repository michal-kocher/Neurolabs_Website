import { Link, useLocation } from 'react-router-dom';
import { Brain } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/knn', label: 'KNN' },
    { path: '/regression', label: 'Regresja' },
    { path: '/music', label: 'Ewolucja' },
    { path: '/pong', label: 'Q-Learning' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-[#3E065F]/20 px-8 py-5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-[#700B97] to-[#8E05C2] rounded-lg flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform shadow-[#8E05C2]/40">
            <Brain size={22} className="text-white" />
          </div>
          <span className="text-lg font-black tracking-tighter uppercase italic tracking-widest text-white">
            Neuro<span className="text-[#8E05C2]">Labs</span>
          </span>
        </Link>
        <div className="hidden md:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em]">
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

