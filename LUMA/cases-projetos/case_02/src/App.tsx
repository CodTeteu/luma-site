import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GiftsPage from './pages/GiftsPage';
import Noise from './components/Noise';

function App() {
  return (
    <Router>
      <Noise />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/presentes" element={<GiftsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
