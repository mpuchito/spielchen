import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import HomeLayout from "./layouts/HomeLayout";
import GameLayout from "./layouts/GameLayout";
import Home from "./pages/Home";
import Blanco from "./pages/Blanco";
import Wavelength from "./pages/Wavelength";
import Vergiftet from "./pages/Vergiftet";
import QuePrefieres from "./pages/QuePrefieres";
import { useState } from "react";
import "./App.css";

function AppInner() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("qp_user");
    return saved ? JSON.parse(saved) : null;
  });
  const { translations } = useLanguage();
  const t = (k, d) => translations?.[k] ?? d;

  const createTempUser = () => {
    const name = prompt(t("enter_name", "Tu nombre (temporal):"))?.trim();
    if (!name) return;
    const u = { id: crypto.randomUUID(), name };
    localStorage.setItem("qp_user", JSON.stringify(u));
    setUser(u);
  };

  return (
    <BrowserRouter>
      {!user ? (
        <div className="fullscreen-center">
          <button className="btn-primary" onClick={createTempUser}>
            {t("create_temp_user", "Crear usuario temporal")}
          </button>
        </div>
      ) : (
        <Routes>
          <Route element={<HomeLayout />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route element={<GameLayout />}>
            <Route path="/blanco" element={<Blanco />} />
            <Route path="/wavelength" element={<Wavelength />} />
            <Route path="/vergiftet" element={<Vergiftet />} />
            <Route path="/queprefieres" element={<QuePrefieres user={user} />} />
          </Route>
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  );
}
