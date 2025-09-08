import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./GameLayout.css";

export default function GameLayout() {
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <div className="game-shell">
      <header className="game-topbar">
        <Link to="/" className="btn back-btn">Menú</Link>
        <h1 className="brand">Spielchen 🎲</h1>
        <button
          className="btn"
          aria-label="Toggle dark mode"
          onClick={() => setDark((d) => !d)}
        >
          {dark ? "☀️" : "🌙"}
        </button>
      </header>

      <main className="game-stage">
        <Outlet />
      </main>
    </div>
  );
}
