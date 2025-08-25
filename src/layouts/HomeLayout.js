import { Outlet, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import "./HomeLayout.css";

export default function HomeLayout() {
  const { translations } = useLanguage();

  return (
    <div className="home-layout">
      <header className="app-header">
        <h1 className="main-title">Spielchen 🎲</h1>
        <LanguageSwitcher /> {/* ← banderitas aquí */}
      </header>

      <nav className="menu-grid">
        <Link to="/blanco"><button className="menu-btn">{translations.menu.blanco}</button></Link>
        <Link to="/wavelength"><button className="menu-btn">{translations.menu.wavelength}</button></Link>
        <Link to="/vergiftet"><button className="menu-btn">{translations.menu.vergiftet}</button></Link>
      </nav>

      <Outlet />
    </div>
  );
}
