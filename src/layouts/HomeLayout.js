import { Outlet } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import "./HomeLayout.css";

export default function HomeLayout() {
  const { translations } = useLanguage();

  return (
    <div className="home-layout">
      <header className="app-header">
        <h1 className="main-title">Spielchen 🎲</h1>
        <LanguageSwitcher /> {/* banderitas */}
      </header>

      <Outlet />
    </div>
  );
}
