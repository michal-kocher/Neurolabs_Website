import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import KNN from './pages/KNN';
import Regression from './pages/Regression';
import Music from './pages/Music';
import Pong from './pages/Pong';
import TechStack from './pages/TechStack';
import Contact from './pages/Contact';
import AgentAI from './pages/AgentAI';

function App() {
  return (
    <Router basename="/Neurolabs_Website">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/knn" element={<KNN />} />
        <Route path="/regression" element={<Regression />} />
        <Route path="/music" element={<Music />} />
        <Route path="/pong" element={<Pong />} />
        <Route path="/tech-stack" element={<TechStack />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/agent" element={<AgentAI />} />
      </Routes>
    </Router>
  );
}

export default App;

