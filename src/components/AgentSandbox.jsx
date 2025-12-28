import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Code, RotateCcw, Loader2 } from 'lucide-react';
import API_URL from '../config/api';

const AgentSandbox = ({ onCodeModification }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingModification, setPendingModification] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Dodaj wiadomość użytkownika
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        const agentResponse = data.data.response || 'Brak odpowiedzi';
        const action = data.data.action || 'info';
        const modifications = data.data.modifications || null;
        const code = data.data.code || (modifications ? JSON.stringify(modifications, null, 2) : null);
        const component = data.data.component || 'AgentAI';

        // Dodaj odpowiedź agenta
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: agentResponse,
            action,
            code,
            component,
            modifications,
          },
        ]);

        // Jeśli agent zwrócił modyfikacje, zapisz jako pending
        if (action === 'modify_code' && (code || modifications)) {
          setPendingModification({ 
            code: code || JSON.stringify(modifications, null, 2), 
            component,
            modifications 
          });
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: `Błąd: ${error.message}. Upewnij się, że API działa na ${API_URL}`,
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const applyModification = () => {
    if (pendingModification && onCodeModification) {
      // Przekaż modyfikacje - preferuj obiekt modifications jeśli istnieje
      const modificationData = pendingModification.modifications 
        ? pendingModification.modifications 
        : pendingModification.code;
      
      onCodeModification(modificationData);
      setPendingModification(null);
      setMessages([
        ...messages,
        {
          role: 'system',
          content: 'Zmiany zostały zastosowane! Odśwież stronę, aby przywrócić oryginał.',
          system: true,
        },
      ]);
    }
  };

  const resetModifications = () => {
    if (onCodeModification) {
      onCodeModification(null); // Reset do oryginału
      setPendingModification(null);
      setMessages([
        ...messages,
        {
          role: 'system',
          content: 'Zmiany zostały zresetowane do oryginału.',
          system: true,
        },
      ]);
    }
  };

  return (
    <div className="w-full h-full flex flex-col rounded-3xl bg-[#050505] border border-[#3E065F]/50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#3E065F]/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#8E05C2]/20 rounded-full flex items-center justify-center border border-[#8E05C2]/30">
            <Bot size={16} className="text-[#8E05C2]" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase">Agent AI</h3>
            <p className="text-[10px] text-gray-500">Modyfikuj interfejs poleceniami</p>
          </div>
        </div>
        {pendingModification && (
          <button
            onClick={resetModifications}
            className="px-3 py-1.5 text-[10px] uppercase font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-2 border border-[#3E065F]/50 rounded-lg hover:border-[#8E05C2]/50"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Bot size={32} className="mx-auto mb-3 text-[#8E05C2]/30" />
            <p className="text-sm">Zacznij rozmowę z agentem AI</p>
            <p className="text-xs mt-2 text-gray-600">Przykład: "Zmień kolor tytułu na czerwony"</p>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-6 h-6 bg-[#8E05C2]/20 rounded-full flex items-center justify-center border border-[#8E05C2]/30 flex-shrink-0">
                  <Bot size={12} className="text-[#8E05C2]" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2.5 ${
                  msg.role === 'user'
                    ? 'bg-[#8E05C2] text-white'
                    : msg.error
                    ? 'bg-red-900/20 border border-red-900/50 text-red-400'
                    : msg.system
                    ? 'bg-[#3E065F]/20 border border-[#700B97]/30 text-[#8E05C2]'
                    : 'bg-[#0a0a0a] border border-[#3E065F]/30 text-gray-300'
                }`}
              >
                {msg.role === 'user' && (
                  <div className="flex items-center gap-2 mb-1">
                    <User size={12} />
                    <span className="text-[10px] font-bold uppercase">Ty</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                {msg.code && (
                  <div className="mt-3 pt-3 border-t border-[#3E065F]/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Code size={12} className="text-[#8E05C2]" />
                      <span className="text-[10px] font-bold text-[#8E05C2] uppercase">
                        Kod modyfikacji
                      </span>
                    </div>
                    <pre className="text-xs bg-black/50 p-2 rounded overflow-x-auto">
                      <code>{msg.code.substring(0, 200)}...</code>
                    </pre>
                  </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-6 h-6 bg-[#8E05C2]/20 rounded-full flex items-center justify-center border border-[#8E05C2]/30 flex-shrink-0">
                  <User size={12} className="text-[#8E05C2]" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3 justify-start"
          >
            <div className="w-6 h-6 bg-[#8E05C2]/20 rounded-full flex items-center justify-center border border-[#8E05C2]/30">
              <Bot size={12} className="text-[#8E05C2]" />
            </div>
            <div className="bg-[#0a0a0a] border border-[#3E065F]/30 rounded-lg px-4 py-2.5 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-[#8E05C2]" />
              <span className="text-sm text-gray-400">Agent myśli...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Pending Modification Alert */}
      {pendingModification && (
        <div className="mx-4 mb-2 p-3 bg-[#3E065F]/20 border border-[#8E05C2]/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code size={14} className="text-[#8E05C2]" />
              <span className="text-xs text-gray-300">
                Gotowe do zastosowania modyfikacje
              </span>
            </div>
            <button
              onClick={applyModification}
              className="px-3 py-1 bg-[#8E05C2] hover:bg-[#700B97] text-white text-[10px] font-bold uppercase rounded transition-colors"
            >
              Zastosuj
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-4 border-t border-[#3E065F]/30">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Wpisz polecenie dla agenta..."
            className="flex-1 bg-[#0a0a0a] border border-[#3E065F]/30 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#8E05C2]/50 transition-colors"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 bg-[#8E05C2] hover:bg-[#700B97] disabled:bg-gray-800 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentSandbox;

