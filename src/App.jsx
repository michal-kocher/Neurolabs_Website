import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import KNN from './pages/KNN';
import Regression from './pages/Regression';
import Music from './pages/Music';
import Pong from './pages/Pong';

function App() {
  return (
    <Router basename="/Neurolabs_Website">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/knn" element={<KNN />} />
        <Route path="/regression" element={<Regression />} />
        <Route path="/music" element={<Music />} />
        <Route path="/pong" element={<Pong />} />
      </Routes>
    </Router>
  );
}

export default App;

