import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = ({ text = "Visualizing Machine Learning" }) => {
  return (
    <div className="fixed bottom-8 left-8 z-20 hidden xl:flex items-center gap-6">
      <div className="flex gap-4">
        <a 
          href="https://github.com/michal-kocher" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-[#8E05C2] transition-colors cursor-pointer"
        >
          <Github size={20} />
        </a>
        <a 
          href="https://www.linkedin.com/in/micha%C5%82-kocher-83a148307/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-[#8E05C2] transition-colors cursor-pointer"
        >
          <Linkedin size={20} />
        </a>
        <a 
          href="mailto:michal.kocher.research@gmail.com"
          className="text-gray-600 hover:text-[#8E05C2] transition-colors cursor-pointer"
        >
          <Mail size={20} />
        </a>
      </div>
      <div className="h-[1px] w-12 bg-gray-800" />
      <p className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.4em]">
        {text}
      </p>
    </div>
  );
};

export default Footer;

