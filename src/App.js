import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Blanco from './Blanco';
import Wavelength from './Wavelength';
import Vergiftet from './Vergiftet';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Spielchen 🎲</h1>

        <nav className="menu-grid">
          <Link to="/blanco">
            <button className="menu-btn">Blanco</button>
          </Link>
          <Link to="/wavelength">
            <button className="menu-btn">Wavelength</button>
          </Link>
          <Link to="/vergiftet">
            <button className="menu-btn">Vergiftet</button>
          </Link>
        </nav>

        <Routes>
          <Route path="/blanco" element={<Blanco />} />
          <Route path="/wavelength" element={<Wavelength />} />
          <Route path="/vergiftet" element={<Vergiftet />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;