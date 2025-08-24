import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useContext } from 'react';
import { LanguageContext } from './LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import Blanco from './Blanco';
import Wavelength from './Wavelength';
import Vergiftet from './Vergiftet';
import './App.css';

function App() {
  const { translations } = useContext(LanguageContext);

  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <div className="language-corner">
            <LanguageSwitcher />
          </div>
          <h1 className="main-title">Spielchen 🎲</h1>
        </header>

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
