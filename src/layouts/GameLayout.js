import { Outlet, Link } from "react-router-dom";
import "./GameLayout.css";

export default function GameLayout() {
  return (
    <div className="game-shell">
      <header className="game-topbar">
        <Link to="/" className="btn back-btn">
          <span className="icon"></span> Menú
        </Link>
        <h1 className="brand">Spielchen 🎲</h1>
        <div className="spacer" />
      </header>

      <main className="game-stage">
        <Outlet />
      </main>
    </div>
  );
}