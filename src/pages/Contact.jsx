import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Github, Linkedin } from 'lucide-react';
import NetworkCanvas from '../components/NetworkCanvas';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // TODO: Implement backend API call
    // For now, just show success message
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    }, 1000);
  };

  return (
    <div className="relative bg-[#000000] text-white font-sans selection:bg-[#8E05C2]/30 min-h-screen overflow-x-hidden">
      <NetworkCanvas />
      <Navbar />

      <section className="relative pt-32 pb-20 px-4 sm:px-8 z-10 max-w-4xl mx-auto min-h-screen flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#3E065F]/20 border border-[#700B97]/30 text-[#8E05C2] text-[10px] font-bold tracking-widest uppercase mb-6">
            <Mail size={14} />
            Contact
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black leading-[0.9] mb-6 tracking-tighter uppercase">
            Skontaktuj <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#700B97] via-[#8E05C2] to-white">
              Się.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl leading-relaxed border-l-2 border-[#8E05C2] pl-6">
            Masz pytanie dotyczące AI, ML lub współpracy? Napisz do mnie, a odpowiem najszybciej jak to możliwe.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-bold uppercase tracking-widest mb-2 text-gray-400">
                Imię
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl focus:border-[#8E05C2] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-bold uppercase tracking-widest mb-2 text-gray-400">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl focus:border-[#8E05C2] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-bold uppercase tracking-widest mb-2 text-gray-400">
                Wiadomość
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={6}
                className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl focus:border-[#8E05C2] focus:outline-none transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-8 py-4 bg-[#8E05C2] hover:bg-[#700B97] text-white rounded-xl font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(142,5,194,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>Wysyłanie...</>
              ) : (
                <>
                  Wyślij <Send size={18} />
                </>
              )}
            </button>
            {submitStatus === 'success' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[#8E05C2] text-sm font-bold"
              >
                Wiadomość wysłana! Odpowiem najszybciej jak to możliwe.
              </motion.p>
            )}
          </motion.form>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
          >
            <div className="p-6 rounded-xl bg-black/40 backdrop-blur-sm border border-white/5">
              <h3 className="text-xl font-black uppercase mb-4">Inne sposoby kontaktu</h3>
              <div className="space-y-4">
                <a
                  href="mailto:michal.kocher.research@gmail.com"
                  className="flex items-center gap-3 text-gray-400 hover:text-[#8E05C2] transition-colors group"
                >
                  <Mail size={20} className="group-hover:scale-110 transition-transform" />
                  <span>michal.kocher.research@gmail.com</span>
                </a>
                <a
                  href="https://github.com/michal-kocher"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-400 hover:text-[#8E05C2] transition-colors group"
                >
                  <Github size={20} className="group-hover:scale-110 transition-transform" />
                  <span>github.com/michal-kocher</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/micha%C5%82-kocher-83a148307/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-400 hover:text-[#8E05C2] transition-colors group"
                >
                  <Linkedin size={20} className="group-hover:scale-110 transition-transform" />
                  <span>LinkedIn Profile</span>
                </a>
              </div>
            </div>
            <div className="p-6 rounded-xl bg-[#8E05C2]/10 border border-[#8E05C2]/30">
              <p className="text-sm text-gray-400 leading-relaxed">
                Otwarty na nowe wyzwania w AI/ML, współpracę badawczą oraz projekty na styku machine learning i web development.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer text="Let's Connect" />
    </div>
  );
};

export default Contact;

